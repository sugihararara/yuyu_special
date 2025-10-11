# Attack Judgment Simulator Analysis

**Source**: `docs/spec_from_html/simulators/攻撃判定シミュレーター_simulator.htm`

## Key Discovery: Judgment Thresholds Found!

The simulator JavaScript contains the exact judgment logic used in the original game.

## Critical Code Section (Deobfuscated):

```javascript
// Calculate judgment value 'ag' from success/evasion comparison
a = ae;  // attacker success (corrected)
b = af;  // defender evasion (corrected)
e = ae / 256;
e = e.toFixed(0);
b >>= 1;
c = b >> 1;
d = c / e;  // This is the judgment ratio!
ag = d;
ag = ag.toFixed(0);

// Determine result based on 'ag' value
x = 0;
ag <= 59 && (x = 6);   // ≤59%: Result 6
ag >= 60 && (x = 3);   // ≥60%: Result 3
ag >= 89 && (x = 0);   // ≥89%: Result 0

// Additional adjustment based on 'mino' (ad) value
mino = ad;
ad <= 50 && (x += parseInt(2));  // ≤50%: +2
ad >= 80 && (x = x);             // ≥80%: no change
ad >= 80 && (ad = 0);
ad >= 51 && (x += parseInt(1));  // 51-79%: +1
ad >= 51 && (ad = 0);

// Double the result
x = 2 * x;
x <= 1 && (x = 0);
```

## Result Interpretation:

The final `x` values map to outcomes:
- `x = 0`: 先手直撃：後手直撃 (Both direct hit)
- `x = 2`: 先手かすり：後手直撃(60%)　先手回避：後手かすり(40%)
- `x = 4`: 先手回避：後手直撃 (First evade, second direct)
- `x = 6`: 先手かすり：後手回避(60%)　先手直撃：後手かすり(40%)
- `x = 8`: 先手直撃：後手直撃(12.5%)　先手かすり：後手かすり(75%)　先手回避：後手回避(12.5%)
- `x = 10`: 先手かすり：後手回避(60%)　先手直撃：後手かすり(40%)
- `x = 12`: 先手回避：後手直撃 (First evade, second direct)
- `x = 14`: 先手回避：後手かすり(60%)　先手かすり：後手直撃(40%)
- `x = 16`: 先手回避：後手回避 (Both evade)

## Key Insights:

### 1. **Ratio-Based, Not Difference-Based!**
The judgment is **NOT** `(success - evasion)` but rather a **ratio**:
```javascript
d = c / e;  // where c is derived from evasion, e from success
```

### 2. **Percentage Thresholds**
- **89% or higher**: Best outcome (direct hit likely)
- **60-88%**: Medium outcome (graze likely)
- **59% or lower**: Worst outcome (evade/fail likely)

### 3. **Two-Stage Calculation**
There are TWO judgment values calculated:
- `ag`: Primary judgment (60%, 89% thresholds)
- `ad` (mino): Secondary adjustment (50%, 80% thresholds)

### 4. **Combined Result**
The final result is a combination of both players' judgment values, creating 9 possible outcome combinations.

## What This Means For Our Implementation:

### Current Problem:
We're using **absolute difference**: `successDiff = attackerSuccess - defenderEvasion`
- Thresholds: 30, 5, -15 (empirical)

### Should Be Using:
**Ratio-based calculation** with percentage thresholds:
- Calculate ratio for each player
- Apply 89%, 60%, 50% thresholds
- Combine results

## TODO: Reverse Engineer Full Formula

Need to understand:
1. Exact formula for calculating the ratio `ag`
2. How `ae` (attacker success) and `af` (defender evasion) are used
3. The bit shifting operations (`b >>= 1; c = b >> 1;`)
4. What is `mino` / `ad`?
5. How the two players' calculations combine

## Input Variables:

From the HTML form:
- `txta`: 先手成功率 (First player success rate)
- `txtb`: 後手回避率 (Second player evasion rate)
- `txtc`: 先手回避率 (First player evasion rate)
- `txtd`: 後手成功率 (Second player success rate)

## Next Steps:

1. ✅ Found the simulator with exact logic
2. ⏳ Deobfuscate and understand the full formula
3. ⏳ Implement the ratio-based judgment in CombatCalculation.ts
4. ⏳ Test with known values from the simulator
5. ⏳ Verify results match the original game

This is a MAJOR breakthrough! 🎉
