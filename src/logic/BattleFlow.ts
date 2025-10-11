/**
 * Battle Flow System
 *
 * Main orchestrator for turn-based battle
 * Manages the 4 phases: Input → Execute → Resolve → Reward
 *
 * Based on: docs/spec/logic/01_battle_flow.md
 */

import type {
  BattleState,
  PlayerState,
  BattlePhase,
  BattleCommand,
  Stage,
} from '../types/GameState';
import type { BattleOutcome } from '../types/BattleTypes';
import type { PlayerTurnInput } from '../types/PlayerInput';

// Real systems (Phase 2)
import { RNGSystem } from './RNGSystem';
import { CharacterStatsSystem } from './CharacterStatsSystem';
import { ToukiSystem } from './ToukiSystem';
import { BalanceSystem } from './BalanceSystem';
import { CombatCalculation } from './CombatCalculation';
import { DamageCalculation } from './DamageCalculation';

/**
 * Turn result returned to UI/game loop
 */
export interface TurnResult {
  battleState: BattleState;
  outcome: BattleOutcome;
  message: string; // Debug message describing what happened
}

/**
 * Main battle orchestrator
 */
export class BattleFlow {
  private battleState: BattleState;

  // Systems (✅ = real implementation, mock = temporary)
  private rng: RNGSystem;                       // ✅ Phase 2.1 - Real RNG System
  private characterStats: CharacterStatsSystem; // ✅ Phase 2.2 - Real Character Stats
  private touki: ToukiSystem;                   // ✅ Phase 2.3 - Real Touki System
  private balance: BalanceSystem;               // ✅ Phase 2.4 - Real Balance System
  private combat: CombatCalculation;            // ✅ Phase 2.5 - Real Combat System
  private damage: DamageCalculation;            // ✅ Phase 2.6 - Real Damage System

  constructor(
    player1CharacterId: string,
    player2CharacterId: string,
    stage: Stage = 'forest'
  ) {
    // Initialize battle state
    this.battleState = this.createInitialState(
      player1CharacterId,
      player2CharacterId,
      stage
    );

    // Initialize systems
    this.rng = new RNGSystem();                       // ✅ Real implementation
    this.characterStats = new CharacterStatsSystem(); // ✅ Real implementation
    this.touki = new ToukiSystem();                   // ✅ Real implementation
    this.balance = new BalanceSystem();               // ✅ Real implementation
    this.combat = new CombatCalculation();            // ✅ Real implementation
    this.damage = new DamageCalculation();            // ✅ Real implementation
  }

  /**
   * Load character data asynchronously
   * IMPORTANT: Must be called after constructor, before first turn!
   */
  async loadCharacters(): Promise<void> {
    const p1Id = this.battleState.player1.characterId;
    const p2Id = this.battleState.player2.characterId;

    await this.characterStats.preloadCharacters([p1Id as any, p2Id as any]);
    console.log(`✅ Characters loaded: ${p1Id} vs ${p2Id}`);
  }

  /**
   * Process a single turn
   * Called by game loop with player inputs
   */
  processTurn(p1Input: PlayerTurnInput, p2Input: PlayerTurnInput): TurnResult {
    // Phase 1: Input (touki charging handled externally, commands received)
    this.updateTouki(p1Input, p2Input);

    // Determine initiative (先手/後手)
    this.determineInitiative(p1Input, p2Input);

    // Phase 2: Preparation (frame timing - simplified for now)
    this.battleState.phase = 'preparation';

    // Phase 3: Activation (execute actions)
    this.battleState.phase = 'activation';
    const outcome = this.executeActions(p1Input, p2Input);

    // Phase 4: Resolution (apply damage/effects)
    this.battleState.phase = 'resolution';
    this.applyOutcome(outcome);

    // Phase 5: Reward (crystal ball)
    this.battleState.phase = 'reward';
    this.distributeRewards(outcome);

    // Check win condition
    this.checkWinCondition();

    // Increment turn
    this.battleState.turn++;
    this.battleState.phase = 'input';

    return {
      battleState: this.battleState,
      outcome,
      message: this.generateTurnMessage(outcome),
    };
  }

  /**
   * Get current battle state (for UI rendering)
   */
  getState(): BattleState {
    return this.battleState;
  }

  /**
   * Get current phase
   */
  getPhase(): BattlePhase {
    return this.battleState.phase;
  }

  /**
   * Check if battle is over
   */
  isMatchOver(): boolean {
    return this.battleState.matchOver;
  }

  /**
   * Get winner (null if match not over)
   */
  getWinner(): 1 | 2 | null {
    return this.battleState.winner;
  }

  // ==================== Private Methods ====================

  /**
   * Create initial battle state
   */
  private createInitialState(
    p1CharId: string,
    p2CharId: string,
    stage: Stage
  ): BattleState {
    const createPlayerState = (charId: string): PlayerState => ({
      hp: 96,
      hpFractional: 0,
      hpFractionalAccum: 0,
      touki: 0,
      balance: 0,
      reiki: 20,
      airtime: 0,
      knockdownRecovery: 0,
      isKnockedDown: false,
      currentCommand: null,
      toukiUp: false,
      toukiDown: false,
      balanceUp: false,
      defensiveUp: false,
      itemStock: null,
      characterId: charId,
      characterState: charId, // No transformation initially
    });

    return {
      player1: createPlayerState(p1CharId),
      player2: createPlayerState(p2CharId),
      turn: 0,
      phase: 'input',
      firstPlayer: null,
      stage,
      crystalBallReward: null,
      lastDamage: 0,
      lastBalanceDamage: 0,
      winner: null,
      matchOver: false,
    };
  }

  /**
   * Update touki based on charging input
   * TODO: Use real ToukiSystem - this is simplified
   */
  private updateTouki(p1Input: PlayerTurnInput, p2Input: PlayerTurnInput): void {
    // Simplified: just charge touki based on frames
    // Real implementation in Phase 2.3
    if (p1Input.toukiCharge.isCharging) {
      const frames = p1Input.toukiCharge.chargeFrames;
      this.battleState.player1.touki = Math.min(96, Math.floor(frames / 2));
    }

    if (p2Input.toukiCharge.isCharging) {
      const frames = p2Input.toukiCharge.chargeFrames;
      this.battleState.player2.touki = Math.min(96, Math.floor(frames / 2));
    }
  }

  /**
   * Determine initiative (先手/後手)
   * Based on: docs/spec/logic/01_battle_flow.md
   */
  private determineInitiative(
    p1Input: PlayerTurnInput,
    p2Input: PlayerTurnInput
  ): void {
    const p1Time = p1Input.command?.timestamp ?? Infinity;
    const p2Time = p2Input.command?.timestamp ?? Infinity;

    // Simultaneous input → P1 is first
    if (p1Time === p2Time) {
      this.battleState.firstPlayer = 1;
    } else if (p1Time < p2Time) {
      this.battleState.firstPlayer = 1;
    } else {
      this.battleState.firstPlayer = 2;
    }
  }

  /**
   * Execute actions and calculate battle outcome
   * TODO: Use real systems - this uses mocks
   */
  private executeActions(
    p1Input: PlayerTurnInput,
    p2Input: PlayerTurnInput
  ): BattleOutcome {
    // Store commands
    if (p1Input.command) {
      const cmd = `${p1Input.command.direction}${p1Input.command.button}` as BattleCommand;
      this.battleState.player1.currentCommand = cmd;
    }

    if (p2Input.command) {
      const cmd = `${p2Input.command.direction}${p2Input.command.button}` as BattleCommand;
      this.battleState.player2.currentCommand = cmd;
    }

    // Calculate battle outcome with all real systems!
    return this.calculateBattleOutcome();
  }

  /**
   * Apply battle outcome to state
   */
  private applyOutcome(outcome: BattleOutcome): void {
    // Apply damage to P1
    this.battleState.player1.hp -= outcome.firstPlayerDamage.hp;
    this.battleState.player1.hpFractional += outcome.firstPlayerDamage.hpFractional;
    this.battleState.player1.balance += outcome.firstPlayerDamage.balance;

    // Apply damage to P2
    this.battleState.player2.hp -= outcome.secondPlayerDamage.hp;
    this.battleState.player2.hpFractional += outcome.secondPlayerDamage.hpFractional;
    this.battleState.player2.balance += outcome.secondPlayerDamage.balance;

    // Check knockdown
    if (this.battleState.player1.balance > 255) {
      this.battleState.player1.isKnockedDown = true;
      this.battleState.player1.balance = 0;
    }

    if (this.battleState.player2.balance > 255) {
      this.battleState.player2.isKnockedDown = true;
      this.battleState.player2.balance = 0;
    }

    // Reset touki after action (consumed by the action)
    this.battleState.player1.touki = 0;
    this.battleState.player2.touki = 0;

    // Store for UI
    this.battleState.lastDamage = outcome.firstPlayerDamage.hp + outcome.secondPlayerDamage.hp;
    this.battleState.lastBalanceDamage =
      outcome.firstPlayerDamage.balance + outcome.secondPlayerDamage.balance;
  }

  /**
   * Distribute crystal ball rewards
   * TODO: Use real RewardSystem
   */
  private distributeRewards(outcome: BattleOutcome): void {
    // Simplified: give reiki to winner
    if (outcome.firstPlayerReward) {
      this.battleState.player1.reiki = Math.min(25, this.battleState.player1.reiki + 3);
      this.battleState.crystalBallReward = { type: 'reiki', amount: 3 };
    } else if (outcome.secondPlayerReward) {
      this.battleState.player2.reiki = Math.min(25, this.battleState.player2.reiki + 3);
      this.battleState.crystalBallReward = { type: 'reiki', amount: 3 };
    }
  }

  /**
   * Check win condition
   */
  private checkWinCondition(): void {
    const p1Dead = this.battleState.player1.hp <= 0;
    const p2Dead = this.battleState.player2.hp <= 0;

    if (p1Dead && p2Dead) {
      // Simultaneous KO - check excess damage (not implemented yet)
      this.battleState.winner = 1; // Temporary: P1 wins
      this.battleState.matchOver = true;
    } else if (p1Dead) {
      this.battleState.winner = 2;
      this.battleState.matchOver = true;
    } else if (p2Dead) {
      this.battleState.winner = 1;
      this.battleState.matchOver = true;
    }
  }

  /**
   * Generate debug message
   */
  private generateTurnMessage(outcome: BattleOutcome): string {
    const p1Cmd = this.battleState.player1.currentCommand ?? 'none';
    const p2Cmd = this.battleState.player2.currentCommand ?? 'none';
    const first = this.battleState.firstPlayer === 1 ? 'P1' : 'P2';

    return `Turn ${this.battleState.turn}: ${first} first | P1: ${p1Cmd} (${outcome.firstPlayerResult}) | P2: ${p2Cmd} (${outcome.secondPlayerResult})`;
  }

  // ==================== Mock Methods (temporary) ====================

  /**
   * Battle outcome calculation
   * ✅ Uses REAL character stats! (Phase 2.2)
   * ✅ Uses REAL combat calculation! (Phase 2.5)
   * ✅ Uses REAL damage calculation! (Phase 2.6)
   * ALL SYSTEMS ARE NOW REAL! 🎉
   */
  private calculateBattleOutcome(): BattleOutcome {
    const isP1First = this.battleState.firstPlayer === 1;

    // ✅ Get REAL move stats from character data (Phase 2.2)
    const p1CharId = this.battleState.player1.characterId;
    const p2CharId = this.battleState.player2.characterId;
    const p1Command = this.battleState.player1.currentCommand ?? '→A';
    const p2Command = this.battleState.player2.currentCommand ?? '→A';

    const p1Stats = this.characterStats.getMoveStats(p1CharId as any, p1Command);
    const p2Stats = this.characterStats.getMoveStats(p2CharId as any, p2Command);

    // Apply mock corrections (touki, rng, balance)
    const p1ToukiCorr = this.touki.getCorrection(this.battleState.player1.touki);
    const p2ToukiCorr = this.touki.getCorrection(this.battleState.player2.touki);

    // Get move types for RNG scenario determination
    const p1MoveData = this.characterStats.getMove(p1CharId as any, p1Command);
    const p2MoveData = this.characterStats.getMove(p2CharId as any, p2Command);

    // Determine RNG scenario based on move types
    const rngScenario = this.combat.determineRNGScenario(p1MoveData.type, p2MoveData.type);
    const p1RngCorr = this.rng.getFirstPlayerCorrection(rngScenario);
    const p2RngCorr = this.rng.getSecondPlayerCorrection(rngScenario);

    const p1BalCorr = this.balance.getCorrection(this.battleState.player1.balance);
    const p2BalCorr = this.balance.getCorrection(this.battleState.player2.balance);

    // Get character defense stats
    const p1CharStats = this.characterStats.getCharacterStats(p1CharId as any);
    const p2CharStats = this.characterStats.getCharacterStats(p2CharId as any);

    // Calculate low HP bonuses
    const p1LowHpCorr = this.combat.calculateLowHPCorrection(this.battleState.player1.hp);
    const p2LowHpCorr = this.combat.calculateLowHPCorrection(this.battleState.player2.hp);

    // Build correction values for each player
    const p1Corrections = {
      touki: p1ToukiCorr,
      rng: p1RngCorr,
      balance: p1BalCorr,
      lowHp: p1LowHpCorr,
    };
    const p2Corrections = {
      touki: p2ToukiCorr,
      rng: p2RngCorr,
      balance: p2BalCorr,
      lowHp: p2LowHpCorr,
    };

    // Determine initiative states
    const p1Initiative = {
      isSecond: !isP1First,
      isCompleteSecond: false, // TODO: Implement complete second detection
    };
    const p2Initiative = {
      isSecond: isP1First,
      isCompleteSecond: false, // TODO: Implement complete second detection
    };

    // Calculate judgments with real combat calculation
    const p1Result = this.combat.calculateJudgment(
      p1Stats,              // Attacker stats
      p2Stats,              // Defender stats
      p1Corrections,        // Attacker corrections
      p2Corrections,        // Defender corrections
      p1CharStats,          // Attacker character stats
      p2CharStats,          // Defender character stats
      p1Initiative,         // Initiative state
      this.battleState.player1.hp,
      this.battleState.player2.hp
    );

    const p2Result = this.combat.calculateJudgment(
      p2Stats,              // Attacker stats
      p1Stats,              // Defender stats
      p2Corrections,        // Attacker corrections
      p1Corrections,        // Defender corrections
      p2CharStats,          // Attacker character stats
      p1CharStats,          // Defender character stats
      p2Initiative,         // Initiative state
      this.battleState.player2.hp,
      this.battleState.player1.hp
    );

    // Calculate damage with real damage calculation system
    // P1 takes damage from P2's attack
    const p1Dmg = this.damage.calculateDamage(
      p2Stats.power,           // Base power from P2's move
      p2Stats.balanceDrain,     // Base balance drain from P2's move
      p2Corrections,           // P2's corrections (attacker)
      p2Result,                 // P2's judgment result
      p1CharStats,             // P1's defense stats (defender)
      'player1',               // Defender ID for accumulator
      this.battleState.player1.hp,
      this.battleState.player1.balance
    );

    // P2 takes damage from P1's attack
    const p2Dmg = this.damage.calculateDamage(
      p1Stats.power,           // Base power from P1's move
      p1Stats.balanceDrain,     // Base balance drain from P1's move
      p1Corrections,           // P1's corrections (attacker)
      p1Result,                 // P1's judgment result
      p2CharStats,             // P2's defense stats (defender)
      'player2',               // Defender ID for accumulator
      this.battleState.player2.hp,
      this.battleState.player2.balance
    );

    return {
      firstPlayerResult: p1Result,
      secondPlayerResult: p2Result,
      collision: null,
      firstPlayerDamage: {
        hp: p1Dmg.hpDamage,
        hpFractional: p1Dmg.hpFractional,
        balance: p1Dmg.balanceDamage,
      },
      secondPlayerDamage: {
        hp: p2Dmg.hpDamage,
        hpFractional: p2Dmg.hpFractional,
        balance: p2Dmg.balanceDamage,
      },
      firstPlayerKnockedDown: p1Dmg.knockdown,
      secondPlayerKnockedDown: p2Dmg.knockdown,
      firstPlayerActionCanceled: false,
      secondPlayerActionCanceled: false,
      firstPlayerReward: p1Result === 'direct_hit',
      secondPlayerReward: p2Result === 'direct_hit',
    };
  }
}
