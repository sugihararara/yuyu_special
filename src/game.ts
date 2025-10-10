/**
 * Game Entry Point
 *
 * Handles:
 * - Mode switching (debug/game)
 * - Renderer initialization
 * - Event listener setup
 */

import { toukiRenderer } from './ui/renderers/ToukiRenderer';
import { hpRenderer } from './ui/renderers/HPRenderer';
import { balanceRenderer } from './ui/renderers/BalanceRenderer';
import { reikiRenderer } from './ui/renderers/ReikiRenderer';
import { crystalBallRenderer } from './ui/renderers/CrystalBallRenderer';
import { inputLampRenderer } from './ui/renderers/InputLampRenderer';
import { buttonLampsRenderer } from './ui/renderers/ButtonLampsRenderer';
import { battlefieldRenderer } from './ui/renderers/BattlefieldRenderer';
import { screenScaleRenderer } from './ui/renderers/ScreenScaleRenderer';

// Battle Flow (Phase 1 - with mocks)
import { BattleFlow } from './logic/BattleFlow';
import type { PlayerTurnInput } from './types/PlayerInput';
import type { BattleState } from './types/GameState';

/**
 * Game modes
 */
enum GameMode {
  DEBUG = 'debug', // UI checker with test buttons
  GAME = 'game',   // Real gameplay without debug panel
}

/**
 * Get current game mode from URL parameter
 */
function getGameMode(): GameMode {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode');

  if (mode === 'game') {
    return GameMode.GAME;
  }

  // Default to debug mode
  return GameMode.DEBUG;
}

/**
 * Set game mode (show/hide debug panel)
 */
function setGameMode(mode: GameMode): void {
  const debugPanel = document.getElementById('debug-control-panel');

  if (!debugPanel) {
    console.warn('Debug panel not found');
    return;
  }

  if (mode === GameMode.DEBUG) {
    debugPanel.style.display = 'block';
    console.log('Mode: DEBUG (test buttons visible)');
  } else {
    debugPanel.style.display = 'none';
    console.log('Mode: GAME (test buttons hidden)');
  }
}

/**
 * Setup touki control event listeners
 */
function setupToukiControls(): void {
  // Player 1 controls
  const touki1ChargeBtn = document.getElementById('touki1-charge');
  if (touki1ChargeBtn) {
    touki1ChargeBtn.addEventListener('mousedown', () => toukiRenderer.startChargeTouki1());
    touki1ChargeBtn.addEventListener('mouseup', () => toukiRenderer.stopChargeTouki1());
    touki1ChargeBtn.addEventListener('mouseleave', () => toukiRenderer.stopChargeTouki1());
    touki1ChargeBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      toukiRenderer.startChargeTouki1();
    });
    touki1ChargeBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      toukiRenderer.stopChargeTouki1();
    });
  }

  const touki1ResetBtn = document.getElementById('touki1-reset');
  if (touki1ResetBtn) {
    touki1ResetBtn.addEventListener('click', () => toukiRenderer.resetTouki1());
  }

  const touki1Set50Btn = document.getElementById('touki1-set50');
  if (touki1Set50Btn) {
    touki1Set50Btn.addEventListener('click', () => toukiRenderer.setTouki1(48)); // 50% of 96
  }

  const touki1Set100Btn = document.getElementById('touki1-set100');
  if (touki1Set100Btn) {
    touki1Set100Btn.addEventListener('click', () => toukiRenderer.setTouki1(96)); // MAX
  }

  // Player 2 controls
  const touki2ChargeBtn = document.getElementById('touki2-charge');
  if (touki2ChargeBtn) {
    touki2ChargeBtn.addEventListener('mousedown', () => toukiRenderer.startChargeTouki2());
    touki2ChargeBtn.addEventListener('mouseup', () => toukiRenderer.stopChargeTouki2());
    touki2ChargeBtn.addEventListener('mouseleave', () => toukiRenderer.stopChargeTouki2());
    touki2ChargeBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      toukiRenderer.startChargeTouki2();
    });
    touki2ChargeBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      toukiRenderer.stopChargeTouki2();
    });
  }

  const touki2ResetBtn = document.getElementById('touki2-reset');
  if (touki2ResetBtn) {
    touki2ResetBtn.addEventListener('click', () => toukiRenderer.resetTouki2());
  }

  const touki2Set50Btn = document.getElementById('touki2-set50');
  if (touki2Set50Btn) {
    touki2Set50Btn.addEventListener('click', () => toukiRenderer.setTouki2(48));
  }

  const touki2Set100Btn = document.getElementById('touki2-set100');
  if (touki2Set100Btn) {
    touki2Set100Btn.addEventListener('click', () => toukiRenderer.setTouki2(96));
  }

  // Color controls for P1
  const touki1ColorRed = document.getElementById('touki1-color-red');
  if (touki1ColorRed) {
    touki1ColorRed.addEventListener('click', () => toukiRenderer.setTouki1Color('red'));
  }

  const touki1ColorCyan = document.getElementById('touki1-color-cyan');
  if (touki1ColorCyan) {
    touki1ColorCyan.addEventListener('click', () => toukiRenderer.setTouki1Color('cyan'));
  }

  const touki1ColorPurple = document.getElementById('touki1-color-purple');
  if (touki1ColorPurple) {
    touki1ColorPurple.addEventListener('click', () => toukiRenderer.setTouki1Color('purple'));
  }

  // Color controls for P2
  const touki2ColorRed = document.getElementById('touki2-color-red');
  if (touki2ColorRed) {
    touki2ColorRed.addEventListener('click', () => toukiRenderer.setTouki2Color('red'));
  }

  const touki2ColorCyan = document.getElementById('touki2-color-cyan');
  if (touki2ColorCyan) {
    touki2ColorCyan.addEventListener('click', () => toukiRenderer.setTouki2Color('cyan'));
  }

  const touki2ColorPurple = document.getElementById('touki2-color-purple');
  if (touki2ColorPurple) {
    touki2ColorPurple.addEventListener('click', () => toukiRenderer.setTouki2Color('purple'));
  }

  console.log('Touki controls connected');
}

/**
 * Setup HP control event listeners
 */
function setupHPControls(): void {
  // Player 1 HP controls
  const hp1SetBtn = document.getElementById('hp1-set');
  if (hp1SetBtn) {
    hp1SetBtn.addEventListener('click', () => {
      const input = document.getElementById('hp1-input') as HTMLInputElement;
      if (input) {
        const value = parseFloat(input.value);
        hpRenderer.setHP1(value);
      }
    });
  }

  const hp1_0Btn = document.getElementById('hp1-0');
  if (hp1_0Btn) {
    hp1_0Btn.addEventListener('click', () => hpRenderer.setHP1(0)); // Defeated
  }

  const hp1_50Btn = document.getElementById('hp1-50');
  if (hp1_50Btn) {
    hp1_50Btn.addEventListener('click', () => hpRenderer.setHP1(48)); // Half HP
  }

  const hp1_100Btn = document.getElementById('hp1-100');
  if (hp1_100Btn) {
    hp1_100Btn.addEventListener('click', () => hpRenderer.setHP1(96)); // Full HP
  }

  // Player 2 HP controls
  const hp2SetBtn = document.getElementById('hp2-set');
  if (hp2SetBtn) {
    hp2SetBtn.addEventListener('click', () => {
      const input = document.getElementById('hp2-input') as HTMLInputElement;
      if (input) {
        const value = parseFloat(input.value);
        hpRenderer.setHP2(value);
      }
    });
  }

  const hp2_0Btn = document.getElementById('hp2-0');
  if (hp2_0Btn) {
    hp2_0Btn.addEventListener('click', () => hpRenderer.setHP2(0)); // Defeated
  }

  const hp2_50Btn = document.getElementById('hp2-50');
  if (hp2_50Btn) {
    hp2_50Btn.addEventListener('click', () => hpRenderer.setHP2(48)); // Half HP
  }

  const hp2_100Btn = document.getElementById('hp2-100');
  if (hp2_100Btn) {
    hp2_100Btn.addEventListener('click', () => hpRenderer.setHP2(96)); // Full HP
  }

  // Enter key support
  const hp1Input = document.getElementById('hp1-input');
  if (hp1Input) {
    hp1Input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const value = parseFloat((e.target as HTMLInputElement).value);
        hpRenderer.setHP1(value);
      }
    });
  }

  const hp2Input = document.getElementById('hp2-input');
  if (hp2Input) {
    hp2Input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const value = parseFloat((e.target as HTMLInputElement).value);
        hpRenderer.setHP2(value);
      }
    });
  }

  console.log('HP controls connected');
}

/**
 * Setup Balance control event listeners
 */
function setupBalanceControls(): void {
  // Player 1 Balance controls
  const balance1SetBtn = document.getElementById('balance1-set');
  if (balance1SetBtn) {
    balance1SetBtn.addEventListener('click', () => {
      const input = document.getElementById('balance1-input') as HTMLInputElement;
      if (input) {
        const value = parseFloat(input.value);
        balanceRenderer.setBalance1(value);
      }
    });
  }

  const balance1_0Btn = document.getElementById('balance1-0');
  if (balance1_0Btn) {
    balance1_0Btn.addEventListener('click', () => balanceRenderer.setBalance1(0)); // No damage (full bar)
  }

  const balance1_50Btn = document.getElementById('balance1-50');
  if (balance1_50Btn) {
    balance1_50Btn.addEventListener('click', () => balanceRenderer.setBalance1(128)); // Half damage
  }

  const balance1_100Btn = document.getElementById('balance1-100');
  if (balance1_100Btn) {
    balance1_100Btn.addEventListener('click', () => balanceRenderer.setBalance1(255)); // Knocked down
  }

  // Player 2 Balance controls
  const balance2SetBtn = document.getElementById('balance2-set');
  if (balance2SetBtn) {
    balance2SetBtn.addEventListener('click', () => {
      const input = document.getElementById('balance2-input') as HTMLInputElement;
      if (input) {
        const value = parseFloat(input.value);
        balanceRenderer.setBalance2(value);
      }
    });
  }

  const balance2_0Btn = document.getElementById('balance2-0');
  if (balance2_0Btn) {
    balance2_0Btn.addEventListener('click', () => balanceRenderer.setBalance2(0)); // No damage (full bar)
  }

  const balance2_50Btn = document.getElementById('balance2-50');
  if (balance2_50Btn) {
    balance2_50Btn.addEventListener('click', () => balanceRenderer.setBalance2(128)); // Half damage
  }

  const balance2_100Btn = document.getElementById('balance2-100');
  if (balance2_100Btn) {
    balance2_100Btn.addEventListener('click', () => balanceRenderer.setBalance2(255)); // Knocked down
  }

  // Enter key support
  const balance1Input = document.getElementById('balance1-input');
  if (balance1Input) {
    balance1Input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const value = parseFloat((e.target as HTMLInputElement).value);
        balanceRenderer.setBalance1(value);
      }
    });
  }

  const balance2Input = document.getElementById('balance2-input');
  if (balance2Input) {
    balance2Input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const value = parseFloat((e.target as HTMLInputElement).value);
        balanceRenderer.setBalance2(value);
      }
    });
  }

  console.log('Balance controls connected');
}

/**
 * Setup Reiki and Item control event listeners
 */
function setupReikiControls(): void {
  // ========================================
  // Player 1 Item controls
  // ========================================
  const item1None = document.getElementById('item1-none');
  if (item1None) {
    item1None.addEventListener('click', () => reikiRenderer.setItem1(''));
  }

  const item1AiSmall = document.getElementById('item1-ai-small');
  if (item1AiSmall) {
    item1AiSmall.addEventListener('click', () => reikiRenderer.setItem1('愛(小)'));
  }

  const item1AiLarge = document.getElementById('item1-ai-large');
  if (item1AiLarge) {
    item1AiLarge.addEventListener('click', () => reikiRenderer.setItem1('愛(大)'));
  }

  const item1KiSmall = document.getElementById('item1-ki-small');
  if (item1KiSmall) {
    item1KiSmall.addEventListener('click', () => reikiRenderer.setItem1('気(小)'));
  }

  const item1KiLarge = document.getElementById('item1-ki-large');
  if (item1KiLarge) {
    item1KiLarge.addEventListener('click', () => reikiRenderer.setItem1('気(大)'));
  }

  const item1ReiSmall = document.getElementById('item1-rei-small');
  if (item1ReiSmall) {
    item1ReiSmall.addEventListener('click', () => reikiRenderer.setItem1('霊(小)'));
  }

  const item1ReiLarge = document.getElementById('item1-rei-large');
  if (item1ReiLarge) {
    item1ReiLarge.addEventListener('click', () => reikiRenderer.setItem1('霊(大)'));
  }

  // ========================================
  // Player 1 Reiki controls
  // ========================================
  const reiki1SetBtn = document.getElementById('reiki1-set');
  if (reiki1SetBtn) {
    reiki1SetBtn.addEventListener('click', () => {
      const input = document.getElementById('reiki1-input') as HTMLInputElement;
      if (input) {
        const value = parseInt(input.value);
        reikiRenderer.setReiki1(value);
      }
    });
  }

  const reiki1_0Btn = document.getElementById('reiki1-0');
  if (reiki1_0Btn) {
    reiki1_0Btn.addEventListener('click', () => reikiRenderer.setReiki1(0));
  }

  const reiki1_20Btn = document.getElementById('reiki1-20');
  if (reiki1_20Btn) {
    reiki1_20Btn.addEventListener('click', () => reikiRenderer.setReiki1(20));
  }

  const reiki1_25Btn = document.getElementById('reiki1-25');
  if (reiki1_25Btn) {
    reiki1_25Btn.addEventListener('click', () => reikiRenderer.setReiki1(25));
  }

  // ========================================
  // Player 2 Item controls
  // ========================================
  const item2None = document.getElementById('item2-none');
  if (item2None) {
    item2None.addEventListener('click', () => reikiRenderer.setItem2(''));
  }

  const item2AiSmall = document.getElementById('item2-ai-small');
  if (item2AiSmall) {
    item2AiSmall.addEventListener('click', () => reikiRenderer.setItem2('愛(小)'));
  }

  const item2AiLarge = document.getElementById('item2-ai-large');
  if (item2AiLarge) {
    item2AiLarge.addEventListener('click', () => reikiRenderer.setItem2('愛(大)'));
  }

  const item2KiSmall = document.getElementById('item2-ki-small');
  if (item2KiSmall) {
    item2KiSmall.addEventListener('click', () => reikiRenderer.setItem2('気(小)'));
  }

  const item2KiLarge = document.getElementById('item2-ki-large');
  if (item2KiLarge) {
    item2KiLarge.addEventListener('click', () => reikiRenderer.setItem2('気(大)'));
  }

  const item2ReiSmall = document.getElementById('item2-rei-small');
  if (item2ReiSmall) {
    item2ReiSmall.addEventListener('click', () => reikiRenderer.setItem2('霊(小)'));
  }

  const item2ReiLarge = document.getElementById('item2-rei-large');
  if (item2ReiLarge) {
    item2ReiLarge.addEventListener('click', () => reikiRenderer.setItem2('霊(大)'));
  }

  // ========================================
  // Player 2 Reiki controls
  // ========================================
  const reiki2SetBtn = document.getElementById('reiki2-set');
  if (reiki2SetBtn) {
    reiki2SetBtn.addEventListener('click', () => {
      const input = document.getElementById('reiki2-input') as HTMLInputElement;
      if (input) {
        const value = parseInt(input.value);
        reikiRenderer.setReiki2(value);
      }
    });
  }

  const reiki2_0Btn = document.getElementById('reiki2-0');
  if (reiki2_0Btn) {
    reiki2_0Btn.addEventListener('click', () => reikiRenderer.setReiki2(0));
  }

  const reiki2_20Btn = document.getElementById('reiki2-20');
  if (reiki2_20Btn) {
    reiki2_20Btn.addEventListener('click', () => reikiRenderer.setReiki2(20));
  }

  const reiki2_25Btn = document.getElementById('reiki2-25');
  if (reiki2_25Btn) {
    reiki2_25Btn.addEventListener('click', () => reikiRenderer.setReiki2(25));
  }

  // ========================================
  // Enter key support
  // ========================================
  const reiki1Input = document.getElementById('reiki1-input');
  if (reiki1Input) {
    reiki1Input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const value = parseInt((e.target as HTMLInputElement).value);
        reikiRenderer.setReiki1(value);
      }
    });
  }

  const reiki2Input = document.getElementById('reiki2-input');
  if (reiki2Input) {
    reiki2Input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const value = parseInt((e.target as HTMLInputElement).value);
        reikiRenderer.setReiki2(value);
      }
    });
  }

  console.log('Reiki and Item controls connected');
}

/**
 * Setup Crystal Ball control event listeners
 */
function setupCrystalBallControls(): void {
  // Item controls
  const crystalItemNone = document.getElementById('crystal-item-none');
  if (crystalItemNone) {
    crystalItemNone.addEventListener('click', () => crystalBallRenderer.setCrystalItem(''));
  }

  const crystalItemAiSmall = document.getElementById('crystal-item-ai-small');
  if (crystalItemAiSmall) {
    crystalItemAiSmall.addEventListener('click', () => crystalBallRenderer.setCrystalItem('愛(小)'));
  }

  const crystalItemAiLarge = document.getElementById('crystal-item-ai-large');
  if (crystalItemAiLarge) {
    crystalItemAiLarge.addEventListener('click', () => crystalBallRenderer.setCrystalItem('愛(大)'));
  }

  const crystalItemKiSmall = document.getElementById('crystal-item-ki-small');
  if (crystalItemKiSmall) {
    crystalItemKiSmall.addEventListener('click', () => crystalBallRenderer.setCrystalItem('気(小)'));
  }

  const crystalItemKiLarge = document.getElementById('crystal-item-ki-large');
  if (crystalItemKiLarge) {
    crystalItemKiLarge.addEventListener('click', () => crystalBallRenderer.setCrystalItem('気(大)'));
  }

  const crystalItemReiSmall = document.getElementById('crystal-item-rei-small');
  if (crystalItemReiSmall) {
    crystalItemReiSmall.addEventListener('click', () => crystalBallRenderer.setCrystalItem('霊(小)'));
  }

  const crystalItemReiLarge = document.getElementById('crystal-item-rei-large');
  if (crystalItemReiLarge) {
    crystalItemReiLarge.addEventListener('click', () => crystalBallRenderer.setCrystalItem('霊(大)'));
  }

  // Reiki orb count controls
  const crystalReiki2 = document.getElementById('crystal-reiki-2');
  if (crystalReiki2) {
    crystalReiki2.addEventListener('click', () => crystalBallRenderer.setCrystalReiki(2));
  }

  const crystalReiki3 = document.getElementById('crystal-reiki-3');
  if (crystalReiki3) {
    crystalReiki3.addEventListener('click', () => crystalBallRenderer.setCrystalReiki(3));
  }

  const crystalReiki4 = document.getElementById('crystal-reiki-4');
  if (crystalReiki4) {
    crystalReiki4.addEventListener('click', () => crystalBallRenderer.setCrystalReiki(4));
  }

  const crystalReiki5 = document.getElementById('crystal-reiki-5');
  if (crystalReiki5) {
    crystalReiki5.addEventListener('click', () => crystalBallRenderer.setCrystalReiki(5));
  }

  const crystalReiki6 = document.getElementById('crystal-reiki-6');
  if (crystalReiki6) {
    crystalReiki6.addEventListener('click', () => crystalBallRenderer.setCrystalReiki(6));
  }

  // Clear control
  const crystalClear = document.getElementById('crystal-clear');
  if (crystalClear) {
    crystalClear.addEventListener('click', () => crystalBallRenderer.clearCrystal());
  }

  console.log('Crystal Ball controls connected');
}

/**
 * Setup Input Lamp control event listeners
 */
function setupInputLampControls(): void {
  // Player 1 lamp controls
  const lamp1Blue = document.getElementById('lamp1-blue');
  if (lamp1Blue) {
    lamp1Blue.addEventListener('click', () => inputLampRenderer.setLamp1Blue());
  }

  const lamp1Yellow = document.getElementById('lamp1-yellow');
  if (lamp1Yellow) {
    lamp1Yellow.addEventListener('click', () => inputLampRenderer.setLamp1Yellow());
  }

  const lamp1Red = document.getElementById('lamp1-red');
  if (lamp1Red) {
    lamp1Red.addEventListener('click', () => inputLampRenderer.setLamp1Red());
  }

  // Player 2 lamp controls
  const lamp2Blue = document.getElementById('lamp2-blue');
  if (lamp2Blue) {
    lamp2Blue.addEventListener('click', () => inputLampRenderer.setLamp2Blue());
  }

  const lamp2Yellow = document.getElementById('lamp2-yellow');
  if (lamp2Yellow) {
    lamp2Yellow.addEventListener('click', () => inputLampRenderer.setLamp2Yellow());
  }

  const lamp2Red = document.getElementById('lamp2-red');
  if (lamp2Red) {
    lamp2Red.addEventListener('click', () => inputLampRenderer.setLamp2Red());
  }

  console.log('Input Lamp controls connected');
}

/**
 * Setup Button Lamps control event listeners
 */
function setupButtonLampsControls(): void {
  // Player 1 button controls
  const btn1All = document.getElementById('btn1-all');
  if (btn1All) {
    btn1All.addEventListener('click', () => buttonLampsRenderer.setAllButtons1(true));
  }

  const btn1None = document.getElementById('btn1-none');
  if (btn1None) {
    btn1None.addEventListener('click', () => buttonLampsRenderer.setAllButtons1(false));
  }

  const btn1ToggleA = document.getElementById('btn1-toggle-a');
  if (btn1ToggleA) {
    btn1ToggleA.addEventListener('click', () => buttonLampsRenderer.toggleButton1A());
  }

  const btn1ToggleB = document.getElementById('btn1-toggle-b');
  if (btn1ToggleB) {
    btn1ToggleB.addEventListener('click', () => buttonLampsRenderer.toggleButton1B());
  }

  const btn1ToggleX = document.getElementById('btn1-toggle-x');
  if (btn1ToggleX) {
    btn1ToggleX.addEventListener('click', () => buttonLampsRenderer.toggleButton1X());
  }

  const btn1ToggleY = document.getElementById('btn1-toggle-y');
  if (btn1ToggleY) {
    btn1ToggleY.addEventListener('click', () => buttonLampsRenderer.toggleButton1Y());
  }

  // Player 2 button controls
  const btn2All = document.getElementById('btn2-all');
  if (btn2All) {
    btn2All.addEventListener('click', () => buttonLampsRenderer.setAllButtons2(true));
  }

  const btn2None = document.getElementById('btn2-none');
  if (btn2None) {
    btn2None.addEventListener('click', () => buttonLampsRenderer.setAllButtons2(false));
  }

  const btn2ToggleA = document.getElementById('btn2-toggle-a');
  if (btn2ToggleA) {
    btn2ToggleA.addEventListener('click', () => buttonLampsRenderer.toggleButton2A());
  }

  const btn2ToggleB = document.getElementById('btn2-toggle-b');
  if (btn2ToggleB) {
    btn2ToggleB.addEventListener('click', () => buttonLampsRenderer.toggleButton2B());
  }

  const btn2ToggleX = document.getElementById('btn2-toggle-x');
  if (btn2ToggleX) {
    btn2ToggleX.addEventListener('click', () => buttonLampsRenderer.toggleButton2X());
  }

  const btn2ToggleY = document.getElementById('btn2-toggle-y');
  if (btn2ToggleY) {
    btn2ToggleY.addEventListener('click', () => buttonLampsRenderer.toggleButton2Y());
  }

  console.log('Button Lamps controls connected');
}

/**
 * Setup Battlefield and Message control event listeners
 */
function setupBattlefieldControls(): void {
  // Mode switching buttons
  const modeSplit = document.getElementById('mode-split');
  if (modeSplit) {
    modeSplit.addEventListener('click', () => {
      battlefieldRenderer.setBattlefieldMode('split');
    });
  }

  const modeSingle = document.getElementById('mode-single');
  if (modeSingle) {
    modeSingle.addEventListener('click', () => {
      battlefieldRenderer.setBattlefieldMode('single');
    });
  }

  const modeBgTest = document.getElementById('mode-bg-test');
  if (modeBgTest) {
    modeBgTest.addEventListener('click', () => {
      battlefieldRenderer.setTestBackground();
    });
  }

  // Character blink controls
  const blink1p = document.getElementById('blink-1p');
  if (blink1p) {
    blink1p.addEventListener('click', () => {
      battlefieldRenderer.setCharacterBlink('1p');
    });
  }

  const blink2p = document.getElementById('blink-2p');
  if (blink2p) {
    blink2p.addEventListener('click', () => {
      battlefieldRenderer.setCharacterBlink('2p');
    });
  }

  const blinkNone = document.getElementById('blink-none');
  if (blinkNone) {
    blinkNone.addEventListener('click', () => {
      battlefieldRenderer.setCharacterBlink('none');
    });
  }

  // Message controls
  const messageSet = document.getElementById('message-set');
  const messageInput = document.getElementById('message-input') as HTMLInputElement;
  if (messageSet && messageInput) {
    messageSet.addEventListener('click', () => {
      battlefieldRenderer.setMessage(messageInput.value);
    });
  }

  const messageClear = document.getElementById('message-clear');
  if (messageClear && messageInput) {
    messageClear.addEventListener('click', () => {
      battlefieldRenderer.clearMessage();
      messageInput.value = '';
    });
  }

  const messageSample1 = document.getElementById('message-sample1');
  if (messageSample1 && messageInput) {
    messageSample1.addEventListener('click', () => {
      const msg = '飛影の邪王炎殺黒龍波！';
      battlefieldRenderer.setMessage(msg);
      messageInput.value = msg;
    });
  }

  const messageSample2 = document.getElementById('message-sample2');
  if (messageSample2 && messageInput) {
    messageSample2.addEventListener('click', () => {
      const msg = 'おまえもしかしてまだ...自分が死なないとでも思ってるんじゃないかね？';
      battlefieldRenderer.setMessage(msg);
      messageInput.value = msg;
    });
  }

  // Enter key support for message input
  if (messageInput) {
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        battlefieldRenderer.setMessage((e.target as HTMLInputElement).value);
      }
    });
  }

  console.log('Battlefield and Message controls connected');
}

/**
 * Setup Battle Test controls
 */
function setupBattleTestControls(): void {
  const battleTestBtn = document.getElementById('battle-test-run');
  if (battleTestBtn) {
    battleTestBtn.addEventListener('click', () => {
      console.log('\n🎮 Starting Battle Test...\n');
      runBattleTest();
    });
  }

  console.log('Battle Test controls connected');
}

/**
 * Run battle test with BattleFlow
 */
async function runBattleTest(): Promise<void> {
  // Create battle
  const battle = new BattleFlow('yusuke', 'kuwabara', 'forest');

  // ✅ Phase 2.2: Load character data before battle starts
  battlefieldRenderer.setMessage('Loading characters...');
  try {
    await battle.loadCharacters();
    battlefieldRenderer.setMessage('Battle Start: Yusuke vs Kuwabara');
  } catch (error) {
    console.error('Failed to load characters:', error);
    battlefieldRenderer.setMessage('Error: Failed to load character data');
    return;
  }

  // Turn 1: Both punch (with touki charging animation)
  console.log('=== TURN 1 ===');
  battlefieldRenderer.setMessage('Turn 1: Charging touki...');

  // Animate touki charging for turn 1
  animateToukiCharge(30, 40, () => {
    const turn1P1Input: PlayerTurnInput = {
      toukiCharge: { isCharging: true, direction: '→', chargeFrames: 60 },
      command: { direction: '→', button: 'A', timestamp: 60 },
      useItem: false,
    };

    const turn1P2Input: PlayerTurnInput = {
      toukiCharge: { isCharging: true, direction: '→', chargeFrames: 80 },
      command: { direction: '→', button: 'A', timestamp: 80 },
      useItem: false,
    };

    const result1 = battle.processTurn(turn1P1Input, turn1P2Input);
    updateUIFromBattleState(result1.battleState, result1.message);
    console.log(result1.message);

    // Turn 2 after delay
    setTimeout(() => {
      console.log('\n=== TURN 2 ===');
      battlefieldRenderer.setMessage('Turn 2: Charging touki...');

      // Animate touki charging for turn 2
      animateToukiCharge(45, 35, () => {
        const turn2P1Input: PlayerTurnInput = {
          toukiCharge: { isCharging: true, direction: '→', chargeFrames: 90 },
          command: { direction: '→', button: 'B', timestamp: 90 },
          useItem: false,
        };

        const turn2P2Input: PlayerTurnInput = {
          toukiCharge: { isCharging: true, direction: '↓', chargeFrames: 70 },
          command: { direction: '↓', button: 'A', timestamp: 100 },
          useItem: false,
        };

        const result2 = battle.processTurn(turn2P1Input, turn2P2Input);
        updateUIFromBattleState(result2.battleState, result2.message);
        console.log(result2.message);

        // Turn 3 after another delay
        setTimeout(() => {
          console.log('\n=== TURN 3 ===');
          battlefieldRenderer.setMessage('Turn 3: Charging touki...');

          // Animate touki charging for turn 3
          animateToukiCharge(50, 50, () => {
            const turn3P1Input: PlayerTurnInput = {
              toukiCharge: { isCharging: true, direction: '↑', chargeFrames: 100 },
              command: { direction: '↑', button: 'X', timestamp: 100 },
              useItem: false,
            };

            const turn3P2Input: PlayerTurnInput = {
              toukiCharge: { isCharging: true, direction: '↑', chargeFrames: 100 },
              command: { direction: '↑', button: 'X', timestamp: 105 },
              useItem: false,
            };

            const result3 = battle.processTurn(turn3P1Input, turn3P2Input);
            updateUIFromBattleState(result3.battleState, result3.message);
            console.log(result3.message);

            // Final message
            setTimeout(() => {
              if (result3.battleState.matchOver) {
                battlefieldRenderer.setMessage(`Winner: Player ${result3.battleState.winner}!`);
              } else {
                battlefieldRenderer.setMessage('Battle Test Complete! Check console for details.');
              }
              console.log('\n✅ Battle Test Complete!\n');
            }, 1000);
          });
        }, 1500);
      });
    }, 1500);
  });
}

/**
 * Animate touki charging for both players
 */
function animateToukiCharge(p1Target: number, p2Target: number, onComplete: () => void): void {
  const duration = 800; // 800ms charging animation
  const steps = 30; // 30 steps for smooth animation
  const stepDuration = duration / steps;

  let currentStep = 0;
  const p1Start = toukiRenderer.getTouki1();
  const p2Start = toukiRenderer.getTouki2();

  const interval = setInterval(() => {
    currentStep++;
    const progress = currentStep / steps;

    // Ease-in-out animation
    const eased = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    const p1Current = p1Start + (p1Target - p1Start) * eased;
    const p2Current = p2Start + (p2Target - p2Start) * eased;

    toukiRenderer.setTouki1(p1Current);
    toukiRenderer.setTouki2(p2Current);

    if (currentStep >= steps) {
      clearInterval(interval);
      toukiRenderer.setTouki1(p1Target);
      toukiRenderer.setTouki2(p2Target);
      onComplete();
    }
  }, stepDuration);
}

/**
 * Update all UI renderers from battle state
 */
function updateUIFromBattleState(state: BattleState, message: string): void {
  // Update HP
  hpRenderer.setHP1(state.player1.hp);
  hpRenderer.setHP2(state.player2.hp);

  // Update Touki
  toukiRenderer.setTouki1(state.player1.touki);
  toukiRenderer.setTouki2(state.player2.touki);

  // Update Balance
  balanceRenderer.setBalance1(state.player1.balance);
  balanceRenderer.setBalance2(state.player2.balance);

  // Update Reiki
  reikiRenderer.setReiki1(state.player1.reiki);
  reikiRenderer.setReiki2(state.player2.reiki);

  // Update Crystal Ball if reward exists
  if (state.crystalBallReward) {
    if (state.crystalBallReward.type === 'reiki') {
      crystalBallRenderer.setCrystalReiki(state.crystalBallReward.amount);
    } else if (state.crystalBallReward.type === 'item') {
      // Map item to display string
      const itemMap: Record<string, string> = {
        '霊大': '霊(大)',
        '霊小': '霊(小)',
        '気大': '気(大)',
        '気小': '気(小)',
        '愛大': '愛(大)',
        '愛小': '愛(小)',
      };
      const itemText = itemMap[state.crystalBallReward.item] || '';
      crystalBallRenderer.setCrystalItem(itemText);
    }
  }

  // Update message
  battlefieldRenderer.setMessage(message);

  // Update input lamps based on initiative
  if (state.firstPlayer === 1) {
    inputLampRenderer.setLamp1Blue();  // First player
    inputLampRenderer.setLamp2Yellow(); // Second player
  } else if (state.firstPlayer === 2) {
    inputLampRenderer.setLamp1Yellow(); // Second player
    inputLampRenderer.setLamp2Blue();  // First player
  }
}

/**
 * Setup Screen Scale control event listeners
 */
function setupScreenScaleControls(): void {
  const scale0_5xBtn = document.getElementById('scale-0.5x');
  if (scale0_5xBtn) {
    scale0_5xBtn.addEventListener('click', () => screenScaleRenderer.setScale0_5x());
  }

  const scale1xBtn = document.getElementById('scale-1x');
  if (scale1xBtn) {
    scale1xBtn.addEventListener('click', () => screenScaleRenderer.setScale1x());
  }

  const scale1_5xBtn = document.getElementById('scale-1.5x');
  if (scale1_5xBtn) {
    scale1_5xBtn.addEventListener('click', () => screenScaleRenderer.setScale1_5x());
  }

  const scale2xBtn = document.getElementById('scale-2x');
  if (scale2xBtn) {
    scale2xBtn.addEventListener('click', () => screenScaleRenderer.setScale2x());
  }

  const scale3xBtn = document.getElementById('scale-3x');
  if (scale3xBtn) {
    scale3xBtn.addEventListener('click', () => screenScaleRenderer.setScale3x());
  }

  console.log('Screen Scale controls connected');
}

/**
 * Setup keyboard shortcuts
 */
function setupKeyboardShortcuts(): void {
  document.addEventListener('keydown', (e) => {
    // Ctrl+D: Toggle debug panel
    if (e.ctrlKey && e.key === 'd') {
      e.preventDefault();
      const panel = document.getElementById('debug-control-panel');
      if (panel) {
        const isVisible = panel.style.display !== 'none';
        setGameMode(isVisible ? GameMode.GAME : GameMode.DEBUG);
      }
    }
  });

  console.log('Keyboard shortcuts set (Ctrl+D: toggle debug panel)');
}

/**
 * Initialize game
 */
window.addEventListener('DOMContentLoaded', () => {
  console.log('幽☆遊☆白書 特別篇 - Initializing...');

  // Get mode from URL
  const mode = getGameMode();
  setGameMode(mode);

  // Initialize renderers
  toukiRenderer.initialize();
  hpRenderer.initialize();
  balanceRenderer.initialize();
  reikiRenderer.initialize();
  crystalBallRenderer.initialize();
  inputLampRenderer.initialize();
  buttonLampsRenderer.initialize();
  battlefieldRenderer.initialize();
  screenScaleRenderer.initialize();

  // Setup event listeners
  setupToukiControls();
  setupHPControls();
  setupBalanceControls();
  setupReikiControls();
  setupCrystalBallControls();
  setupInputLampControls();
  setupButtonLampsControls();
  setupBattlefieldControls();
  setupScreenScaleControls();
  setupBattleTestControls(); // Battle Test (Phase 1)
  setupKeyboardShortcuts();

  console.log('Game initialized! 🎮');
});

// Expose renderers globally for debugging
(window as any).toukiRenderer = toukiRenderer;
(window as any).hpRenderer = hpRenderer;
(window as any).balanceRenderer = balanceRenderer;
(window as any).reikiRenderer = reikiRenderer;
(window as any).crystalBallRenderer = crystalBallRenderer;
(window as any).inputLampRenderer = inputLampRenderer;
(window as any).buttonLampsRenderer = buttonLampsRenderer;
(window as any).battlefieldRenderer = battlefieldRenderer;
(window as any).screenScaleRenderer = screenScaleRenderer;
