/**
 * Input Lamp Renderer
 *
 * Manages input acceptance lamp display (round indicators)
 * Migrated from game.html inline JavaScript
 *
 * Input Lamp System:
 * - Shows player input acceptance state
 * - 3 colors: blue (normal), yellow (warning), red (error/busy)
 * - Box-shadow glow effect
 */

/**
 * Input Lamp Renderer State
 */
class InputLampRendererState {
  lamp1Color: 'blue' | 'yellow' | 'red' = 'blue';
  lamp2Color: 'blue' | 'yellow' | 'red' = 'blue';
}

/**
 * Input Lamp Renderer class
 */
export class InputLampRenderer {
  private state: InputLampRendererState;

  constructor() {
    this.state = new InputLampRendererState();
  }

  /**
   * Initialize renderer
   */
  initialize(): void {
    console.log('InputLampRenderer initialized');
  }

  /**
   * Set input lamp color
   */
  private setLampColor(player: 1 | 2, color: 'blue' | 'yellow' | 'red'): void {
    const lampId = player === 1 ? 'input-lamp-1p' : 'input-lamp-2p';
    const lamp = document.getElementById(lampId);

    if (!lamp) return;

    const colorMap = {
      blue: { bg: '#0080ff', shadow: '#0080ff' },
      yellow: { bg: '#ffff00', shadow: '#ffff00' },
      red: { bg: '#ff0000', shadow: '#ff0000' },
    };

    const colors = colorMap[color];
    lamp.style.background = colors.bg;
    lamp.style.boxShadow = `0 0 10px ${colors.shadow}`;

    // Update state
    if (player === 1) {
      this.state.lamp1Color = color;
    } else {
      this.state.lamp2Color = color;
    }
  }

  // ========================================
  // Public API - Player 1 Controls
  // ========================================

  setLamp1Blue(): void {
    this.setLampColor(1, 'blue');
  }

  setLamp1Yellow(): void {
    this.setLampColor(1, 'yellow');
  }

  setLamp1Red(): void {
    this.setLampColor(1, 'red');
  }

  // ========================================
  // Public API - Player 2 Controls
  // ========================================

  setLamp2Blue(): void {
    this.setLampColor(2, 'blue');
  }

  setLamp2Yellow(): void {
    this.setLampColor(2, 'yellow');
  }

  setLamp2Red(): void {
    this.setLampColor(2, 'red');
  }

  // ========================================
  // Getters (for external access)
  // ========================================

  getLamp1Color(): 'blue' | 'yellow' | 'red' {
    return this.state.lamp1Color;
  }

  getLamp2Color(): 'blue' | 'yellow' | 'red' {
    return this.state.lamp2Color;
  }
}

/**
 * Export singleton instance
 */
export const inputLampRenderer = new InputLampRenderer();
