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
│   │   ├── MotionFrameSystem.ts  # Frame timing system
│   │   ├── ToukiSystem.ts        # Fighting spirit calculations
│   │   ├── BalanceSystem.ts      # Balance/knockdown system
│   │   ├── CombatCalculation.ts  # Success/evasion calculations
│   │   ├── DamageCalculation.ts  # HP/balance damage
│   │   ├── ReikiSystem.ts        # Spiritual energy management
│   │   ├── CharacterStats.ts     # Character stat loading
│   │   ├── RNGSystem.ts          # Random number corrections
│   │   ├── RewardSystem.ts       # Crystal ball rewards
│   │   └── mocks/                # Temporary mock implementations
│   │       ├── MockRNG.ts
│   │       ├── MockTouki.ts
│   │       ├── MockBalance.ts
│   │       ├── MockCombat.ts
│   │       └── MockDamage.ts
│   │
│   ├── input/                     # Input adapters
│   │   ├── InputAdapter.ts       # Interface
│   │   ├── KeyboardAdapter.ts    # Local keyboard input
│   │   └── NetworkAdapter.ts     # PeerJS (future)
│   │
│   ├── ui/                        # UI rendering layer (TypeScript)
│   │   └── renderers/            # UI rendering components
│   │       ├── HPRenderer.ts
│   │       ├── ToukiRenderer.ts
│   │       ├── BalanceRenderer.ts
│   │       ├── ReikiRenderer.ts
│   │       └── ...
│   │
│   ├── data/                      # Game data
│   │   ├── characters/           # Character stats
│   │   ├── frameData/            # Motion frame tables
│   │   └── lookupTables/         # Touki/balance correction tables
│   │
│   └── game.ts                    # Game entry point (loaded by game.html)
│
├── public/                        # Static assets (auto-copied to dist/)
│   └── ui/                        # HTML UI files
│       ├── game.html              # Main battle UI
│       ├── battle-ui.html         # Battle UI components
│       ├── character-select-test.html  # Character selection
│       └── stage-select-test.html      # Stage selection
│
├── index.html                     # HTML entry point
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
└── vite.config.ts                 # Vite config
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
