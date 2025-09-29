atwiki（yuyuz）→ Markdown 一括変換ガイド

対象: https://w.atwiki.jp/yuyuz/

目的: 各ページの中身をそのまま .md に落とす。まず1ページで検証して方法を確立 → その後に全ページへ展開。
想定ツール: curl/pandoc または Python (requests + BeautifulSoup + markdownify)
協力ツール: Claude Code / GitHub Copilot (Codex)

0. 背景 → 理由 → 具体

背景

この atwiki は各記事が連番 ID を持ち、/pages/{ID}.html で本文に直アクセスできる。

削除済み ID では本文に**「指定されたページ番号は存在しません。削除されたか新しく作り直された可能性があります。」**と表示される。

通常の巡回が難しい場合でも、ページ一覧 /list から ID とタイトルを取得して安定クロールが可能。

なぜこの方針？（理由）

まず 1 ページ検証で Markdown 化の「崩れ」（見出し、表、画像リンク）を確認してから量産すると、後戻りが少ない。

一覧 /list 方式は欠番を避けられ、{ID}-{タイトル}.md の命名も安定。

画像や相対リンクは絶対 URL 化しておくと、オフラインでもリンク先が明確で破綻しにくい。

具体（全体像）

1ページ検証（例：/pages/60.html など任意）

変換品質OKなら量産スクリプト（一覧 /list 推奨／連番スキャン併用可）

出力をGitで管理し、リトライ設計・レート制御を入れて堅牢化

1. まず 1 ページ検証（最速ルート）

ここで体裁（見出し/表/画像リンク/内部リンク）をチェック。OKなら量産へ。

A. Pandoc 一発（精度高め・手軽）
# 例: macOS/Linux。Windows PowerShell でも可（書式は適宜調整）
ID=60
BASE="https://w.atwiki.jp/yuyuz"
curl -fsSL "${BASE}/pages/${ID}.html" -o page-${ID}.html

# GitHub風Markdown (gfm) で出力
pandoc page-${ID}.html -f html -t gfm -o page-${ID}.md


確認ポイント

見出し階層（h1/h2/h3）

表（table→GFM）

画像リンク（相対 → 絶対への書き換えは下記 B 方式 or pandoc の前処理で実施）

B. Python（細かい除外や絶対URL化を自動化）
# pip install requests beautifulsoup4 markdownify
import re, requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md

BASE = "https://w.atwiki.jp/yuyuz"
ID = 60  # ←テストしたいID
url = f"{BASE}/pages/{ID}.html"
html = requests.get(url, timeout=20, headers={"User-Agent":"Mozilla/5.0"}).text

# 削除ページ判定
if "指定されたページ番号は存在しません" in html:
    raise SystemExit(f"deleted/missing: {ID}")

soup = BeautifulSoup(html, "html.parser")

# ナビ・フッターっぽいものを除去（必要に応じて調整）
for sel in ["#header", "#nav", ".menu", ".side", "#footer", "#rightmenu"]:
    for n in soup.select(sel):
        n.decompose()

# 画像・リンクの絶対化
def absolutize(attr, prefix="https://w.atwiki.jp"):
    for tag in soup.find_all(attrs={attr: True}):
        v = tag.get(attr,"")
        if v.startswith("/"):
            tag[attr] = prefix + v

absolutize("src")
absolutize("href")

text_md = md(str(soup), heading_style="ATX")
text_md = re.sub(r'\n{3,}', '\n\n', text_md).strip()

open(f"page-{ID}.md", "w", encoding="utf-8").write(text_md)
print("saved:", f"page-{ID}.md")

2. 量産化（方法確立後）
推奨：一覧 /list を起点に収集

メリット

欠番を避けられる

ファイル名を {ID}-{Title}.md に安定付与

「通常の方法でアクセスできない」場合の代替として有効

Python サンプル

# pip install requests beautifulsoup4 markdownify python-slugify
import os, re, time, requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md
from slugify import slugify

BASE = "https://w.atwiki.jp/yuyuz"
LIST_URL = f"{BASE}/list"
OUT = "yuyuz_md"
os.makedirs(OUT, exist_ok=True)

def fetch(url):
    r = requests.get(url, timeout=20, headers={"User-Agent":"Mozilla/5.0"})
    r.raise_for_status()
    return r.text

# 1) 一覧から (ID, Title) 取得
html = fetch(LIST_URL)
soup = BeautifulSoup(html, "html.parser")
pairs = {}
for a in soup.find_all("a", href=True):
    m = re.search(r'/yuyuz/pages/(\d+)\.html', a["href"])
    if m:
        pid = int(m.group(1))
        title = a.get_text(strip=True)
        pairs[pid] = title

for pid in sorted(pairs.keys()):
    url = f"{BASE}/pages/{pid}.html"
    html = fetch(url)

    if "指定されたページ番号は存在しません" in html:
        print(f"skip deleted: {pid}")
        continue

    page = BeautifulSoup(html, "html.parser")
    for sel in ["#header", "#nav", ".menu", ".side", "#footer", "#rightmenu"]:
        for n in page.select(sel):
            n.decompose()

    # 絶対化
    for tag, attr in (("img","src"), ("a","href")):
        for t in page.find_all(tag):
            v = t.get(attr,"")
            if v and v.startswith("/"):
                t[attr] = "https://w.atwiki.jp" + v

    md_text = md(str(page), heading_style="ATX")
    md_text = re.sub(r'\n{3,}', '\n\n', md_text).strip()

    fname = f"{pid}-{slugify(pairs[pid] or 'page')}.md"
    open(os.path.join(OUT, fname), "w", encoding="utf-8").write(md_text)
    print("saved:", fname)
    time.sleep(0.7)  # サーバ配慮

代替：/pages/1.html からカウントアップ

シンプルだが、削除ページが多いと無駄アクセスが増える

**「指定されたページ番号は存在しません」**の表示でスキップ

Bash の雛形

BASE="https://w.atwiki.jp/yuyuz"
OUT="yuyuz_md"
mkdir -p "$OUT"

for ID in $(seq 1 1000); do
  URL="${BASE}/pages/${ID}.html"
  HTML="$(curl -fsSL "$URL" || true)"
  if [ -z "$HTML" ]; then
    echo "fetch failed: $ID"
    continue
  fi
  if echo "$HTML" | grep -q "指定されたページ番号は存在しません"; then
    echo "deleted: $ID"
    continue
  fi
  echo "$HTML" > "$OUT/page-${ID}.html"
  pandoc "$OUT/page-${ID}.html" -f html -t gfm -o "$OUT/page-${ID}.md"
  echo "saved: $OUT/page-${ID}.md"
  sleep 1
done

3. 出力規約（提案）

ファイル名: ID-TitleSlug.md（例：60-technic.md）

テキスト: GFM（GitHub Flavored Markdown）

画像・内部リンク: 絶対 URL（https://w.atwiki.jp/...）

改行整形: 3 連以上改行を 2 連に圧縮

メタ情報（必要なら）: 先頭に YAML front-matter

---
source: "https://w.atwiki.jp/yuyuz/pages/60.html"
fetched_at: "2025-09-30T00:00:00+09:00"
title: "テクニック"
id: 60
---

4. 動作確認チェックリスト

 見出しの階層が原文と整合

 表が Markdown として崩れない

 画像が表示できる（絶対 URL 化）

 内部リンクが生きている（相対→絶対）

 削除ページが適切にスキップされる

 文字化けなし（UTF-8）

 レート制限に配慮（0.5–1 req/s 程度）

5. よくある詰まりどころと対策

CSSやナビが混入 → 変換前に #header, #footer, .menu, .side などを DOMから除去

相対リンクのまま → href/src を 絶対 URL 化

表の崩れ → まず pandoc で検証。難しければ after-processing で整形

レート制限/403 → User-Agent 指定 + スリープ + 失敗時リトライ

文字参照/エンティティ → BeautifulSoup 経由で展開（html.parser でOK）

6. ライセンス・マナー

私的利用前提。再配布や公開は各ページの権利・利用規約を確認

過度な同時アクセスを避け、穏当なレートでの取得を徹底

7. Claude Code / Codex への依頼テンプレ

初回（1ページ検証）

次の要件で atwiki の1ページを Markdown 化して:
- URL: https://w.atwiki.jp/yuyuz/pages/60.html
- #header, #footer, .menu, .side, #rightmenu 等のナビ系は除去
- 画像/リンクは絶対 URL 化（https://w.atwiki.jp を付与）
- 出力は GFM、UTF-8、改行は 3 以上連続を 2 に圧縮
- ファイル名: 60-<スラッグ>.md（タイトルはページ内から取得）

Python（requests + BeautifulSoup + markdownify）で最小スクリプトを作成して実行、出来上がりを表示してチェックして。


量産（一覧 /list 方式）

atwiki(yuyuz) の /list から ID とタイトルを収集し、各 /pages/{ID}.html を Markdown 化して yuyuz_md/ 配下に保存してください。
要件:
- 上と同じDOM除去と絶対URL化
- 失敗時は最大3回リトライ、各リクエスト間は0.7秒スリープ
- ファイル名: {ID}-{title-slug}.md
- 進捗ログを出力
- 途中中断に備えて上書き/スキップのオプションを付与

8. ディレクトリ構成（提案）
yuyuz-export/
├─ scripts/
│  ├─ single_test.py        # 1ページ検証用
│  └─ bulk_export.py        # 一覧から量産
├─ yuyuz_md/                # 出力 .md
└─ README.md                # 運用メモ（本ドキュメント）

9. 次の一手（あなたの指示）

検証用の ID をひとつ指定（例: 60 以外が良ければ番号を教えて）

Pandoc と Python のどちらで進めるか選択（迷ったら Pandoc→Pythonの二段構えも可）

OKなら、量産スクリプトをその選択で最適化して渡します（タイトル抽出や front-matter 追加なども調整可能）

付録：Makefile（任意）
OUT = yuyuz_md
ID ?= 60
BASE = https://w.atwiki.jp/yuyuz

.PHONY: test
test:
	mkdir -p $(OUT)
	curl -fsSL "$(BASE)/pages/$(ID).html" -o $(OUT)/page-$(ID).html
	pandoc $(OUT)/page-$(ID).html -f html -t gfm -o $(OUT)/page-$(ID).md
	@echo "saved: $(OUT)/page-$(ID).md"

.PHONY: clean
clean:
	rm -rf $(OUT)
