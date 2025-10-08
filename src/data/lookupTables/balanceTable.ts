/**
 * Balance Correction Table (バランス補正値)
 *
 * Source: docs/spec_from_html/yuyuz_md/020-バランス補正.md
 *
 * 256 levels (balance 0-255)
 * Values are multipliers (0.0 to ~1.0) applied to success/evasion rates
 *
 * Formula:
 * - If balance ≤ 8: no correction (use RNG value as-is)
 * - If balance ≥ 9: multiplier = balanceTable[balance] / 256
 *
 * Non-linear scaling (steep then flattens):
 * - Balance 70% (179) → ~80% performance
 * - Balance 0% (255) → ~68% performance (minimum)
 * - Steep correction until 30% balance lost, then gradual
 */

/**
 * Raw balance values (0-256 range)
 * Divide by 256 to get actual multiplier
 * Index = balance damage (0-255)
 */
const BALANCE_RAW_VALUES = [
  // 0-19
  0, 0, 0, 0, 0, 0, 0, 0, 0, 254, 254, 254, 254, 253, 253, 253, 253, 252, 252, 251,
  // 20-39
  251, 250, 250, 249, 249, 248, 247, 246, 245, 244, 243, 242, 241, 240, 239, 238, 237, 236, 235, 234,
  // 40-59
  233, 232, 231, 230, 229, 228, 227, 226, 225, 224, 223, 222, 221, 220, 219, 218, 217, 216, 215, 214,
  // 60-79
  213, 212, 211, 210, 209, 208, 208, 207, 207, 206, 206, 205, 205, 204, 204, 204, 204, 204, 204, 204,
  // 80-99
  204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 201, 201, 201,
  // 100-119
  201, 201, 201, 201, 201, 201, 201, 201, 201, 201, 201, 201, 201, 198, 198, 198, 198, 198, 198, 198,
  // 120-139
  198, 198, 198, 198, 198, 198, 198, 198, 198, 195, 195, 195, 195, 195, 195, 195, 195, 195, 195, 195,
  // 140-159
  195, 195, 195, 195, 195, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192,
  // 160-179
  192, 188, 188, 188, 188, 188, 188, 188, 188, 188, 188, 188, 188, 188, 188, 188, 188, 186, 186, 186,
  // 180-199
  186, 186, 186, 186, 186, 183, 183, 183, 183, 183, 183, 183, 183, 183, 183, 183, 183, 183, 183, 183,
  // 200-219
  183, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 179, 179, 179,
  // 220-239
  179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 175, 175, 175, 175, 175, 175, 175,
  // 240-255
  175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175,
] as const;

/**
 * Balance correction table as decimal multipliers (0.0 to ~1.0)
 * Index = balance damage (0-255)
 */
export const BALANCE_TABLE: readonly number[] = BALANCE_RAW_VALUES.map(
  (value) => value / 256
);

/**
 * Get balance correction multiplier
 * @param balance - Current balance damage (0-255)
 * @returns Multiplier (0.0 to ~0.99, or 1.0 if balance ≤ 8)
 */
export function getBalanceMultiplier(balance: number): number {
  if (balance < 0 || balance > 255) {
    throw new Error(`Invalid balance value: ${balance}. Must be 0-255.`);
  }

  // Balance ≤ 8: no correction applied
  if (balance <= 8) {
    return 1.0;
  }

  return BALANCE_TABLE[balance];
}

/**
 * Apply balance correction to a stat value
 * @param baseValue - Base stat value (after RNG correction)
 * @param balance - Current balance damage (0-255)
 * @returns Corrected value
 */
export function applyBalanceCorrection(
  baseValue: number,
  balance: number
): number {
  const multiplier = getBalanceMultiplier(balance);
  return Math.floor(baseValue * multiplier);
}
