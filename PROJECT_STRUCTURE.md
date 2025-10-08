# Project Structure

```
yuyu_special/
├── docs/                          # Documentation
│   └── spec/                      # Specification mapping
│       ├── ui/                    # UI element specs
│       │   ├── 01_hp_bar.md
│       │   ├── 02_touki_meter.md
│       │   └── ...
│       ├── logic/                 # Game logic specs
│       │   ├── 01_battle_flow.md
│       │   ├── 02_motion_frame.md
│       │   └── ...
│       └── README.md
│
├── src/                           # Source code
│   ├── types/                     # TypeScript type definitions
│   │   ├── GameState.ts          # Game state interface
│   │   ├── PlayerInput.ts        # Input data structures
│   │   └── CharacterData.ts      # Character stats types
│   │
│   ├── logic/                     # Core game engine (no UI, no network)
│   │   ├── BattleFlow.ts         # Turn management, action priority
│   │   ├── MotionFrame.ts        # Frame timing system
│   │   ├── ToukiSystem.ts        # Fighting spirit calculations
│   │   ├── BalanceSystem.ts      # Balance/knockdown system
│   │   ├── CombatCalculation.ts  # Success/evasion calculations
│   │   ├── DamageCalculation.ts  # HP/balance damage
│   │   ├── ReikiSystem.ts        # Spiritual energy management
│   │   ├── CharacterStats.ts     # Character stat loading
│   │   ├── RNGSystem.ts          # Random number corrections
│   │   └── RewardSystem.ts       # Crystal ball rewards
│   │
│   ├── input/                     # Input adapters
│   │   ├── InputAdapter.ts       # Interface
│   │   ├── KeyboardAdapter.ts    # Local keyboard input
│   │   └── NetworkAdapter.ts     # PeerJS (future)
│   │
│   ├── ui/                        # Rendering layer
│   │   ├── CanvasRenderer.ts     # Main renderer
│   │   ├── UIManager.ts          # UI state management
│   │   └── components/           # UI components
│   │       ├── HPBar.ts
│   │       ├── ToukiMeter.ts
│   │       └── ...
│   │
│   ├── data/                      # Game data
│   │   ├── characters/           # Character stats
│   │   ├── frameData/            # Motion frame tables
│   │   └── lookupTables/         # Touki/balance correction tables
│   │
│   └── main.ts                    # Entry point
│
├── index.html                     # HTML entry point
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── vite.config.ts                 # Vite config
└── yuyuhakusho_ui_mockup.html    # UI reference mockup
```

## Layer Dependencies

```
┌─────────────────────────────────┐
│     UI Layer (ui/)              │
│  Canvas rendering only          │
└────────────┬────────────────────┘
             │ reads
             ▼
┌─────────────────────────────────┐
│  Game Engine (logic/)           │
│  Pure game logic, no I/O        │
└─────┬──────────────────┬────────┘
      │ uses             │ uses
      ▼                  ▼
┌──────────────┐   ┌──────────────┐
│  Data        │   │  Input       │
│  (data/)     │   │  (input/)    │
└──────────────┘   └──────────────┘
      │                  │
      └──────┬───────────┘
             │ both use
             ▼
┌─────────────────────────────────┐
│       Types (types/)            │
│  Data structures & interfaces   │
└─────────────────────────────────┘
```

## Design Principles

1. **Separation of Concerns**
   - Logic has NO UI code
   - UI has NO game logic
   - Input is abstracted (can swap keyboard/network)

2. **Network Independence**
   - Game engine accepts input from ANY source
   - Can add PeerJS later without touching core logic

3. **Type Safety**
   - All data structures strictly typed
   - Prevents bugs in complex calculations

4. **Testability**
   - Each layer can be tested independently
   - Logic layer has no side effects
