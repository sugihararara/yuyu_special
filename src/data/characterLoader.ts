/**
 * Character Data Loader
 *
 * Loads character JSON files from split structure and returns typed CharacterData objects
 * New structure: stats.json, moves.json, frames.json
 */

import type {
  CharacterData,
  CharacterId,
  CharacterStatsFile,
  CharacterMovesFile,
  CharacterFramesFile,
  MoveData,
} from '../types/CharacterData';

/**
 * Available characters (test set - 3 characters)
 */
export const AVAILABLE_CHARACTERS: CharacterId[] = [
  'yusuke',
  'kuwabara',
  'hiei',
];

/**
 * Load character data from split JSON files
 * Loads stats.json, moves.json, frames.json and combines them
 * @param characterId - ID of the character to load
 * @returns Promise<CharacterData> - Character data object
 * @throws Error if character not found or invalid
 */
export async function loadCharacter(characterId: CharacterId): Promise<CharacterData> {
  try {
    const basePath = `/data/characters/${characterId}`;

    // Load all 3 files in parallel
    const [statsResponse, movesResponse, framesResponse] = await Promise.all([
      fetch(`${basePath}/stats.json`),
      fetch(`${basePath}/moves.json`),
      fetch(`${basePath}/frames.json`),
    ]);

    // Check responses
    if (!statsResponse.ok) {
      throw new Error(`Failed to load stats.json: ${statsResponse.status}`);
    }
    if (!movesResponse.ok) {
      throw new Error(`Failed to load moves.json: ${movesResponse.status}`);
    }
    if (!framesResponse.ok) {
      throw new Error(`Failed to load frames.json: ${framesResponse.status}`);
    }

    // Parse JSON
    const statsData = (await statsResponse.json()) as CharacterStatsFile;
    const movesData = (await movesResponse.json()) as CharacterMovesFile;
    const framesData = (await framesResponse.json()) as CharacterFramesFile;

    // Combine into CharacterData
    const moves: MoveData[] = movesData.map((moveDefinition) => ({
      ...moveDefinition,
      frames: framesData[moveDefinition.id],
    }));

    const characterData: CharacterData = {
      id: statsData.id,
      name: statsData.name,
      nameEn: statsData.nameEn,
      canTransform: statsData.canTransform,
      transformInto: statsData.transformInto,
      transformCondition: statsData.transformCondition,
      stats: statsData.stats,
      moves,
    };

    return characterData;
  } catch (error) {
    throw new Error(`Failed to load character "${characterId}": ${error}`);
  }
}

/**
 * Load multiple characters at once
 * @param characterIds - Array of character IDs to load
 * @returns Promise<CharacterData[]> - Array of character data
 */
export async function loadCharacters(
  characterIds: CharacterId[]
): Promise<CharacterData[]> {
  const promises = characterIds.map((id) => loadCharacter(id));
  return Promise.all(promises);
}

/**
 * Load all available characters
 * @returns Promise<CharacterData[]> - All character data
 */
export async function loadAllCharacters(): Promise<CharacterData[]> {
  return loadCharacters(AVAILABLE_CHARACTERS);
}

/**
 * Get character name by ID (without loading full data)
 * @param characterId - Character ID
 * @returns Character name in Japanese
 */
export function getCharacterName(characterId: CharacterId): string {
  const names: Record<CharacterId, string> = {
    yusuke: '幽助',
    kuwabara: '桑原',
    kurama1: '蔵馬1',
    kurama2: '蔵馬2',
    youko: '妖狐',
    youko_kurama: '妖狐蔵馬',
    hiei: '飛影',
    hiei_dragon: '黒龍波吸収飛影',
    genkai: '幻海',
    genkai_young: '幻海（若）',
    suzuku: '鈴駒',
    touya: '凍矢',
    jin: '陣',
    shishiwakamaru: '死々若丸',
    karasu: '鴉',
    karasu_unmasked: 'マスク無し鴉',
    karasu_blonde: '金髪鴉',
    bui: '武威',
    toguro_elder: '戸愚呂兄',
    toguro_younger: '戸愚呂弟',
    toguro_80: '80%',
    toguro_100: '100%',
    gourmet: '神谷',
    makintaro: '刃霧',
    itsuki: '樹',
    sensui: '仙水',
  };
  return names[characterId] || characterId;
}

/**
 * Validate character data structure
 * @param data - Character data to validate
 * @returns boolean - True if valid
 */
export function validateCharacterData(data: any): data is CharacterData {
  if (!data || typeof data !== 'object') return false;

  // Check required fields
  if (
    !data.id ||
    !data.name ||
    !data.nameEn ||
    !data.stats ||
    !Array.isArray(data.moves)
  ) {
    return false;
  }

  // Check stats object
  const stats = data.stats;
  if (
    typeof stats.defense !== 'number' ||
    typeof stats.realHp !== 'number' ||
    typeof stats.balanceDefense !== 'number' ||
    typeof stats.realBalance !== 'number'
  ) {
    return false;
  }

  // Check moves array
  if (data.moves.length === 0) return false;

  for (const move of data.moves) {
    if (
      !move.id ||
      !move.command ||
      !move.name ||
      typeof move.successRate !== 'number' ||
      typeof move.evasionRate !== 'number'
    ) {
      return false;
    }
  }

  return true;
}
