/**
 * Character Stats System
 *
 * Manages character data loading and provides move/stat lookups for battle calculations.
 *
 * Based on: docs/spec/logic/08_character_stats.md
 * Related: 015-基本性能.md, Character docs (024-048)
 *
 * Memory Addresses:
 * - 7E0EB0: 1P defense value
 * - 7E10B0: 2P defense value
 * - 7E0EB8: 1P balance defense value
 * - 7E10B8: 2P balance defense value
 * - 7E0EBA: 1P knockdown recovery speed
 * - 7E10BA: 2P knockdown recovery speed
 * - 7E0EBC: 1P powered punch probability
 * - 7E10BC: 2P powered punch probability
 * - 7E0EBE: 1P clean hit probability
 * - 7E10BE: 2P clean hit probability
 */

import type {
  CharacterData,
  CharacterId,
  CharacterStats,
  MoveData,
  MoveId,
} from '../types/CharacterData';
import { loadCharacter } from '../data/characterLoader';

/**
 * Base stats for a move (four core stats)
 * These get multiplied by corrections (touki × RNG × balance × lowHP)
 */
export interface MoveStats {
  successRate: number;
  evasionRate: number;
  power: number;
  balanceDrain: number;
}

/**
 * Character Stats System
 *
 * Manages character data and provides stat lookups during battle.
 */
export class CharacterStatsSystem {
  private characterData: Map<CharacterId, CharacterData> = new Map();

  /**
   * Load character data asynchronously
   * Call this before battle starts.
   *
   * @param characterId - Character to load
   */
  async loadCharacterData(characterId: CharacterId): Promise<void> {
    if (this.characterData.has(characterId)) {
      // Already loaded
      return;
    }

    try {
      const data = await loadCharacter(characterId);
      this.characterData.set(characterId, data);
      console.log(`✅ Loaded character: ${data.name} (${characterId})`);
    } catch (error) {
      console.error(`❌ Failed to load character ${characterId}:`, error);
      throw error;
    }
  }

  /**
   * Get character base stats
   *
   * @param characterId - Character ID
   * @returns Character stats (defense, balance defense, etc.)
   */
  getCharacterStats(characterId: CharacterId): CharacterStats {
    const data = this.characterData.get(characterId);
    if (!data) {
      throw new Error(`Character data not loaded: ${characterId}`);
    }
    return data.stats;
  }

  /**
   * Get move stats by command string
   *
   * @param characterId - Character ID
   * @param command - Command string (e.g., "→A", "↓X")
   * @returns Move stats (four core stats)
   */
  getMoveStats(characterId: CharacterId, command: string): MoveStats {
    const move = this.getMove(characterId, command);
    return {
      successRate: move.successRate,
      evasionRate: move.evasionRate,
      power: move.power,
      balanceDrain: move.balanceDrain,
    };
  }

  /**
   * Get full move data (includes frames, type, etc.)
   *
   * @param characterId - Character ID
   * @param command - Command string (e.g., "→A", "↓X")
   * @returns Full move data
   */
  getMove(characterId: CharacterId, command: string): MoveData {
    const data = this.characterData.get(characterId);
    if (!data) {
      throw new Error(`Character data not loaded: ${characterId}`);
    }

    const move = data.moves.find((m) => m.command === command);
    if (!move) {
      throw new Error(`Move not found: ${command} for ${characterId}`);
    }

    return move;
  }

  /**
   * Get move by ID
   *
   * @param characterId - Character ID
   * @param moveId - Move ID (e.g., "forward_a", "down_x")
   * @returns Full move data
   */
  getMoveById(characterId: CharacterId, moveId: MoveId): MoveData {
    const data = this.characterData.get(characterId);
    if (!data) {
      throw new Error(`Character data not loaded: ${characterId}`);
    }

    const move = data.moves.find((m) => m.id === moveId);
    if (!move) {
      throw new Error(`Move ID not found: ${moveId} for ${characterId}`);
    }

    return move;
  }

  /**
   * Get move type (punch, spirit, defense, etc.)
   *
   * @param characterId - Character ID
   * @param command - Command string
   * @returns Move type
   */
  getMoveType(characterId: CharacterId, command: string): string {
    const move = this.getMove(characterId, command);
    return move.type;
  }

  /**
   * Check if character is loaded
   *
   * @param characterId - Character ID
   * @returns True if loaded
   */
  isCharacterLoaded(characterId: CharacterId): boolean {
    return this.characterData.has(characterId);
  }

  /**
   * Get all loaded characters
   *
   * @returns Array of loaded character IDs
   */
  getLoadedCharacters(): CharacterId[] {
    return Array.from(this.characterData.keys());
  }

  /**
   * Get character name
   *
   * @param characterId - Character ID
   * @returns Character name (Japanese)
   */
  getCharacterName(characterId: CharacterId): string {
    const data = this.characterData.get(characterId);
    if (!data) {
      throw new Error(`Character data not loaded: ${characterId}`);
    }
    return data.name;
  }

  /**
   * Get all moves for a character
   *
   * @param characterId - Character ID
   * @returns Array of all moves
   */
  getAllMoves(characterId: CharacterId): MoveData[] {
    const data = this.characterData.get(characterId);
    if (!data) {
      throw new Error(`Character data not loaded: ${characterId}`);
    }
    return data.moves;
  }

  /**
   * Check if move requires reiki
   *
   * @param characterId - Character ID
   * @param command - Command string
   * @returns Reiki cost (0 if no cost)
   */
  getReikiCost(characterId: CharacterId, command: string): number {
    const move = this.getMove(characterId, command);
    return move.reikiCost;
  }

  /**
   * Check if character can transform
   *
   * @param characterId - Character ID
   * @returns True if can transform
   */
  canTransform(characterId: CharacterId): boolean {
    const data = this.characterData.get(characterId);
    if (!data) {
      throw new Error(`Character data not loaded: ${characterId}`);
    }
    return data.canTransform;
  }

  /**
   * Get transformation target
   *
   * @param characterId - Character ID
   * @returns Target character ID (or null if can't transform)
   */
  getTransformTarget(characterId: CharacterId): CharacterId | null {
    const data = this.characterData.get(characterId);
    if (!data) {
      throw new Error(`Character data not loaded: ${characterId}`);
    }
    return data.transformInto || null;
  }

  /**
   * Clear all loaded character data
   * Useful for memory cleanup
   */
  clearAll(): void {
    this.characterData.clear();
  }

  /**
   * Preload multiple characters
   * Useful for character select screen
   *
   * @param characterIds - Array of character IDs to load
   */
  async preloadCharacters(characterIds: CharacterId[]): Promise<void> {
    const promises = characterIds.map((id) => this.loadCharacterData(id));
    await Promise.all(promises);
    console.log(`✅ Preloaded ${characterIds.length} characters`);
  }
}
