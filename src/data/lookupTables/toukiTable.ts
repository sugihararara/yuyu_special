/**
 * Touki Correction Table (闘気補正値)
 *
 * Source: docs/spec_from_html/yuyuz_md/019-闘気補正.md
 *
 * 97 levels (touki 0-96)
 * Values are multipliers (0.0 to 1.0) applied to base stats
 *
 * Formula:
 * - If touki = 96 (MAX): multiplier = 1.0
 * - If touki < 96: multiplier = toukiTable[touki] / 256
 *
 * Non-linear scaling:
 * - 30% touki (~29) → ~50% performance
 * - 50% touki (48) → ~70% performance
 * - 62.5% touki (60) → ~80% performance
 * - 75% touki (72) → ~90% performance
 */

/**
 * Raw touki values (0-256 range)
 * Divide by 256 to get actual multiplier
 */
const TOUKI_RAW_VALUES = [
  // 0-9
  2, 5, 7, 10, 15, 20, 23, 25, 30, 33,
  // 10-19
  38, 43, 46, 51, 53, 56, 61, 66, 69, 74,
  // 20-29
  76, 79, 84, 89, 92, 97, 99, 104, 110, 112,
  // 30-39
  117, 120, 125, 128, 133, 138, 140, 145, 151, 153,
  // 40-49
  156, 158, 161, 163, 168, 171, 174, 176, 179, 181,
  // 50-59
  184, 186, 189, 192, 192, 194, 197, 199, 202, 204,
  // 60-69
  207, 209, 212, 212, 215, 217, 217, 220, 222, 225,
  // 70-79
  227, 230, 232, 232, 235, 235, 238, 238, 240, 240,
  // 80-89
  243, 243, 243, 245, 245, 245, 248, 248, 248, 250,
  // 90-96
  250, 250, 253, 253, 253, 253, 256, // touki=96 → 256 (= 1.0)
] as const;

/**
 * Touki correction table as decimal multipliers (0.0 to 1.0)
 * Index = touki value (0-96)
 */
export const TOUKI_TABLE: readonly number[] = TOUKI_RAW_VALUES.map(
  (value) => value / 256
);

/**
 * Get touki correction multiplier
 * @param touki - Touki value (0-96)
 * @returns Multiplier (0.0078 to 1.0)
 */
export function getToukiMultiplier(touki: number): number {
  if (touki < 0 || touki > 96) {
    throw new Error(`Invalid touki value: ${touki}. Must be 0-96.`);
  }
  return TOUKI_TABLE[touki];
}

/**
 * Apply touki correction to a stat value
 * @param baseValue - Base stat value
 * @param touki - Touki value (0-96)
 * @returns Corrected value
 */
export function applyToukiCorrection(baseValue: number, touki: number): number {
  return Math.floor(baseValue * getToukiMultiplier(touki));
}
