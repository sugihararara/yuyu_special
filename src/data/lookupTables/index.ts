/**
 * Lookup Tables Index
 *
 * Exports all correction tables for combat calculations
 */

export {
  TOUKI_TABLE,
  getToukiMultiplier,
  applyToukiCorrection,
} from './toukiTable';

export {
  BALANCE_TABLE,
  getBalanceMultiplier,
  applyBalanceCorrection,
} from './balanceTable';
