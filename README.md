# 幽☆遊☆白書 特別篇 (Yu Yu Hakusho Special Edition)

A faithful recreation of the Super Famicom turn-based fighting game.

## 🎮 About

This project recreates the Yu Yu Hakusho Special Edition fighting game with:
- **19 playable characters** from the anime/manga
- **Turn-based combat** with real-time input timing
- **Complex battle system** with touki (fighting spirit), balance, and spiritual energy
- **Frame-perfect mechanics** based on original game data

## 🏗️ Tech Stack

- **TypeScript** - Type-safe game logic
- **Vite** - Fast build tool and dev server
- **HTML5 Canvas** - Rendering
- **PeerJS** (planned) - P2P multiplayer

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open `http://localhost:3000` in your browser.

## 📁 Project Structure

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed architecture.

```
src/
├── types/      # TypeScript interfaces
├── logic/      # Game engine (battle systems)
├── input/      # Input adapters (keyboard/network)
├── ui/         # Canvas rendering
├── data/       # Character stats, frame data
└── main.ts     # Entry point
```

## 📖 Documentation

### Specifications
- **`docs/spec/ui/`** - UI element specifications
- **`docs/spec/logic/`** - Game logic specifications
- **`docs/spec_from_html/yuyuz_md/`** - Original game documentation (Japanese)

### Key Documents
- `docs/spec/logic/02_motion_frame.md` - Frame timing system (critical!)
- `docs/spec/logic/06_combat_calculation.md` - Battle calculations
- `docs/spec_from_html/yuyuz_md/027-メモリアドレス.md` - Original game memory map

## 🎯 Development Roadmap

### Phase 1: Core Systems (Current)
- [x] Project setup (Vite + TypeScript)
- [ ] Type definitions
- [ ] Battle flow system
- [ ] Motion frame timing
- [ ] Combat calculations
- [ ] Character stats system

### Phase 2: Local Play
- [ ] Canvas rendering
- [ ] Keyboard input
- [ ] UI elements (HP, touki, balance, reiki)
- [ ] 2-player local mode
- [ ] Character selection

### Phase 3: Remote Play
- [ ] PeerJS integration
- [ ] Room creation/joining
- [ ] Input synchronization
- [ ] Network adapter

### Phase 4: Polish
- [ ] Character sprites/animations
- [ ] Sound effects
- [ ] Visual effects
- [ ] Menu system

## 🎮 Game Systems

### Core Mechanics
- **Touki (闘気)** - Fighting spirit gauge (97 levels, non-linear scaling)
- **Balance (バランス)** - Stamina gauge (knockdown at 256)
- **Reiki (霊気)** - Spiritual energy (25 cells for techniques)
- **Four Core Stats** - Success rate, evasion, power, balance damage
- **Motion Frames** - Frame-perfect timing for all actions

### Corrections Pipeline
```
Base Stat → Touki × RNG × Balance × Low HP → Final Stat
```

### 19 Characters
Yusuke, Kuwabara, Kurama, Hiei, Genkai, Toguro Brothers, and more!

## 🌐 Deployment

Designed for deployment on **Vercel**:
- Static site hosting (free tier)
- Automatic builds from Git
- Fast global CDN
https://yuyu-special.vercel.app/

PeerJS enables direct P2P connections (low latency) after initial page load from Vercel.

## 📝 License

This is a fan project recreating the original Super Famicom game. All rights to Yu Yu Hakusho belong to Yoshihiro Togashi and respective copyright holders.

## 🙏 Credits

- Original game by Namco (1994)
- Documentation from [yuyuz wiki](https://w.atwiki.jp/yuyuz/)
- Built with assistance from Claude Code
