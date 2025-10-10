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

  // Setup event listeners
  setupToukiControls();
  setupHPControls();
  setupKeyboardShortcuts();

  console.log('Game initialized! 🎮');
});

// Expose renderers globally for debugging
(window as any).toukiRenderer = toukiRenderer;
(window as any).hpRenderer = hpRenderer;
