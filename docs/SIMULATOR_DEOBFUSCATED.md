# Simulator JavaScript Deobfuscation

**Date**: 2025-10-11
**Purpose**: Reverse-engineer the exact judgment formulas from the original game simulators

---

## Simulator 1: Attack Judgment (攻撃判定シミュレーター)

### Inputs:
- `txta`: 先手成功率 (First player success rate)
- `txtb`: 後手回避率 (Second player evasion rate)
- `txtc`: 先手回避率 (First player evasion rate)
- `txtd`: 後手成功率 (Second player success rate)

### Core Logic (Deobfuscated):

```javascript
// For first player attacking second player:
// Calculate RNG value (192-255 range)
rng1 = (randomValue & 63) | 192;  // Result: 192-255

// Apply RNG to second player evasion
correctedEvasion = (txtb * 256) * (rng1 / 256);

// Calculate RNG value for first player
rng2 = (randomValue & 63) | 192;  // Result: 192-255

// Apply RNG to first player success
correctedSuccess = (txta * 256) * (rng2 / 256);

// Calculate judgment ratio
e = correctedSuccess / 256;  // Divide by 256
b = correctedEvasion >> 1;   // Right shift by 1 (divide by 2)
c = b >> 1;                  // Right shift by 1 again (divide by 2)
ratio = c / e;               // Final ratio

// Apply thresholds
ag = Math.floor(ratio);

if (ag <= 59) { x = 6; }      // Poor outcome
if (ag >= 60) { x = 3; }      // Medium outcome
if (ag >= 89) { x = 0; }      // Best outcome
```

### Key Formula Discovered:

```
ratio = (correctedEvasion / 4) / (correctedSuccess / 256)
ratio = (correctedEvasion * 256) / (correctedSuccess * 4)
ratio = (correctedEvasion * 64) / correctedSuccess
```

**Simplified**:
```
judgmentRatio = (defenderEvasion * 64) / attackerSuccess
```

### Thresholds:
- **ratio ≥ 89**: Best for attacker (likely direct hit)
- **ratio ≥ 60**: Medium for attacker (likely graze)
- **ratio ≤ 59**: Poor for attacker (likely evade/fail)

### Interpretation:
- **Lower ratio = attacker advantage** (success >> evasion)
- **Higher ratio = defender advantage** (evasion >= success)
- The multiplier 64 normalizes the comparison

### Secondary Adjustment:

There's also a "mino" (ad) calculation that adjusts the result:

```javascript
mino = ad;  // Another ratio calculation (details TBD)

if (ad <= 50) { x += 2; }
if (ad >= 51 && ad < 80) { x += 1; }
if (ad >= 80) { /* no change */ }

x = x * 2;  // Double the result
if (x <= 1) { x = 0; }
```

This creates the final outcome matrix combining both players' results.

---

## Simulator 2: Collision Judgment (相殺判定シミュレーター)

### Inputs:
- `txta`: 先手成功率 (First player success rate)
- `txtb`: 後手成功率 (Second player success rate)

### Core Logic:

```javascript
// Similar RNG calculation
rng1 = (randomValue & 127) | 128;  // Result: 128-255 (DIFFERENT!)
rng2 = (randomValue & 63) | 192;   // Result: 192-255

// Apply RNG
corrected1 = txtb * 256 * (rng1 / 256);
corrected2 = txta * 256 * (rng2 / 256);

// Calculate ratio (same formula)
e = corrected1 / 256;
b = corrected2 >> 1;
c = b >> 1;
ratio = c / e;

ad = Math.floor(ratio);
```

### Thresholds (DIFFERENT from attack!):

```javascript
if (ad <= 52) { x = 6; }   // 後攻つきぬけ (Second player breakthrough)
if (ad >= 53) { x = 5; }   // 後攻減衰つきぬけ (Second player reduced breakthrough)
if (ad >= 59) { x = 3; }   // 打ち消し合い / お互いつきぬけ (Cancel / Both breakthrough)
if (ad >= 73) { x = 2; }   // 先手減衰つきぬけ (First player reduced breakthrough)
if (ad >= 88) { x = 1; }   // 先手つきぬけ (First player breakthrough)
```

### Key Difference:
- **RNG range is 128-255** for one player (not 192-255!)
- **Different thresholds**: 52, 53, 59, 73, 88 (vs 59, 60, 89)
- This is for **aerial collisions** (飛び同士)

---

## Critical Discovery: The Ratio Formula

### The Core Formula Used in BOTH Simulators:

```typescript
// After applying all corrections (touki, RNG, balance, etc.)
judgmentRatio = (defenderStat / 4) / (attackerStat / 256)
              = (defenderStat * 64) / attackerStat
```

### Why This Makes Sense:

1. **It's a percentage**: The ratio represents "how much of the attacker's advantage the defender can negate"
   - If attacker has 200 success and defender has 100 evasion:
   - Ratio = (100 * 64) / 200 = 6400 / 200 = 32
   - 32 < 59 → Defender fails (attacker advantage)

2. **Higher ratio = defender advantage**:
   - Ratio 90+ → Defender completely negates attack (evade/fail)
   - Ratio 60-89 → Partial success (graze)
   - Ratio 0-59 → Full success (direct hit)

3. **The 64 multiplier normalizes the scale**:
   - Stats range from ~20-255 after corrections
   - Multiplying by 64 brings the ratio into 0-100+ range
   - Thresholds (59, 60, 89) now make sense as percentages

---

## Implications for Our Implementation:

### Current (WRONG):
```typescript
const successDiff = attackerSuccess - defenderEvasion;
if (successDiff >= 30) return 'direct_hit';
```

### Should Be (CORRECT):
```typescript
const judgmentRatio = (defenderEvasion * 64) / attackerSuccess;
if (judgmentRatio <= 59) return 'direct_hit';
if (judgmentRatio <= 89) return 'graze';
return 'evade';
```

### Important Notes:

1. **Lower ratio = attacker wins** (opposite of what I initially thought!)
2. **Use corrected stats** (after touki × RNG × balance × lowHP × initiative)
3. **Different scenarios use different thresholds**:
   - Attack vs Defense: 59, 60, 89
   - Aerial collision: 52, 53, 59, 73, 88
4. **The formula is inverted**: We're measuring "defender's defensive ratio" not "attacker's success ratio"

---

## Next Steps:

1. ✅ Identified the core formula
2. ⏳ Check defense simulators for completeness
3. ⏳ Implement the ratio-based judgment
4. ⏳ Test with known values from the simulator
5. ⏳ Verify all scenarios (attack, collision, defense)

---

## Test Cases to Verify:

From the simulator, we can generate test cases:

**Example 1**:
- First success: 200
- Second evasion: 100
- Expected ratio: (100 * 64) / 200 = 32
- Expected result: ratio < 59 → likely direct hit

**Example 2**:
- First success: 100
- Second evasion: 150
- Expected ratio: (150 * 64) / 100 = 96
- Expected result: ratio > 89 → likely evade/fail

We can use the HTML simulator to verify our implementation!
