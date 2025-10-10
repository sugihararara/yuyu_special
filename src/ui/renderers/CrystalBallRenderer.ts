/**
 * Crystal Ball Renderer
 *
 * Manages the crystal ball reward display (center of UI panel)
 * Migrated from game.html inline JavaScript
 *
 * Crystal Ball System:
 * - Displays either reiki orbs (2-6) or items
 * - 2-row layout for 4+ orbs
 * - Color-coded items (pink=ai/love, yellow=ki/energy, cyan=rei/spirit)
 */

/**
 * Crystal Ball Renderer State
 */
class CrystalBallRendererState {
  crystalType: 'reiki' | 'item' | '' = 'reiki';
  crystalReikiCount: number = 3;  // 2-6 orbs
  crystalItemType: string = '';   // Item name
}

/**
 * Crystal Ball Renderer class
 */
export class CrystalBallRenderer {
  private state: CrystalBallRendererState;

  constructor() {
    this.state = new CrystalBallRendererState();
  }

  /**
   * Initialize renderer
   */
  initialize(): void {
    console.log('CrystalBallRenderer initialized');
    this.updateDisplay();
  }

  /**
   * Update crystal ball display
   */
  private updateDisplay(): void {
    const crystalContent = document.querySelector('.crystal-content');
    const crystalValue = document.getElementById('crystal-value');

    if (!crystalContent || !crystalValue) return;

    if (this.state.crystalType === 'reiki') {
      // Display reiki orbs (●)
      let dots = '';
      if (this.state.crystalReikiCount <= 3) {
        // 3 or fewer: single row
        for (let i = 0; i < this.state.crystalReikiCount; i++) {
          dots += '●';
        }
      } else {
        // 4+: split into 2 rows
        const firstRow = Math.ceil(this.state.crystalReikiCount / 2);
        const secondRow = this.state.crystalReikiCount - firstRow;

        for (let i = 0; i < firstRow; i++) {
          dots += '●';
        }
        dots += '<br>';
        for (let i = 0; i < secondRow; i++) {
          dots += '●';
        }
      }

      crystalContent.innerHTML = dots;
      (crystalContent as HTMLElement).style.color = '#0ff';
      (crystalContent as HTMLElement).style.fontSize = '18px';
      (crystalContent as HTMLElement).style.lineHeight = '0.8';
      crystalValue.textContent = `霊気${this.state.crystalReikiCount}個`;
    } else if (this.state.crystalType === 'item') {
      // Display item
      if (this.state.crystalItemType === '') {
        crystalContent.innerHTML = '---';
        (crystalContent as HTMLElement).style.color = '#666';
        crystalValue.textContent = 'なし';
      } else {
        // Color-code items by type
        let itemColor = '#fff';
        if (this.state.crystalItemType.includes('愛')) {
          itemColor = '#ff69b4';  // Pink (love)
        } else if (this.state.crystalItemType.includes('気')) {
          itemColor = '#ffff00';  // Yellow (energy)
        } else if (this.state.crystalItemType.includes('霊')) {
          itemColor = '#00ffff';  // Cyan (spirit)
        }

        // Parse item name: e.g. "愛(小)" → "愛" + "(小)"
        const baseName = this.state.crystalItemType.substring(0, 1);  // 愛, 気, 霊
        const sizePart = this.state.crystalItemType.substring(1);     // (小) or (大)
        const sizeText = sizePart.replace('(', '').replace(')', '');  // 小 or 大

        // Size-based font sizing
        let sizeStyle = '';
        if (sizeText === '大') {
          sizeStyle = 'font-size: 14px;';
        } else if (sizeText === '小') {
          sizeStyle = 'font-size: 10px;';
        }

        // Render as HTML
        crystalContent.innerHTML = `<span style="color: ${itemColor}; font-size: 18px;">${baseName}</span><span style="color: ${itemColor}; ${sizeStyle}">(${sizeText})</span>`;
        (crystalContent as HTMLElement).style.fontSize = '18px';
        (crystalContent as HTMLElement).style.lineHeight = '1';
        crystalValue.textContent = this.state.crystalItemType;
      }
    } else {
      // Clear state
      crystalContent.innerHTML = '';
      crystalValue.textContent = 'クリア';
    }
  }

  // ========================================
  // Public API
  // ========================================

  /**
   * Set crystal to display reiki orbs
   */
  setCrystalReiki(count: number): void {
    this.state.crystalType = 'reiki';
    this.state.crystalReikiCount = Math.max(2, Math.min(6, count));  // Clamp to 2-6
    this.updateDisplay();
  }

  /**
   * Set crystal to display an item
   */
  setCrystalItem(itemName: string): void {
    this.state.crystalType = 'item';
    this.state.crystalItemType = itemName;
    this.updateDisplay();
  }

  /**
   * Clear crystal ball
   */
  clearCrystal(): void {
    this.state.crystalType = '';
    this.state.crystalItemType = '';
    this.state.crystalReikiCount = 0;
    this.updateDisplay();
  }

  // ========================================
  // Getters (for external access)
  // ========================================

  getCrystalType(): 'reiki' | 'item' | '' {
    return this.state.crystalType;
  }

  getCrystalReikiCount(): number {
    return this.state.crystalReikiCount;
  }

  getCrystalItem(): string {
    return this.state.crystalItemType;
  }
}

/**
 * Export singleton instance
 */
export const crystalBallRenderer = new CrystalBallRenderer();
