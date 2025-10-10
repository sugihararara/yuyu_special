/**
 * Button Lamps Renderer
 *
 * Manages ABXY button indicator lamps
 * Migrated from game.html inline JavaScript
 *
 * Button Lamps System:
 * - 4 buttons per player: A (red), B (yellow), X (green), Y (blue)
 * - Toggle on/off to show available buttons
 * - Color-coded by button type
 */

/**
 * Button Lamps Renderer State
 */
class ButtonLampsRendererState {
  // Player 1 button states
  btn1A: boolean = false;
  btn1B: boolean = false;
  btn1X: boolean = false;
  btn1Y: boolean = false;

  // Player 2 button states
  btn2A: boolean = false;
  btn2B: boolean = false;
  btn2X: boolean = false;
  btn2Y: boolean = false;
}

/**
 * Button Lamps Renderer class
 */
export class ButtonLampsRenderer {
  private state: ButtonLampsRendererState;

  constructor() {
    this.state = new ButtonLampsRendererState();
  }

  /**
   * Initialize renderer
   */
  initialize(): void {
    console.log('ButtonLampsRenderer initialized');
  }

  /**
   * Set button state
   */
  private setButtonState(player: 1 | 2, button: 'a' | 'b' | 'x' | 'y', enabled: boolean): void {
    const btnId = `btn-${player}p-${button}`;
    const btn = document.getElementById(btnId);

    if (!btn) return;

    let color = '#000';  // Default: black (disabled)

    if (enabled) {
      const colorMap = {
        y: '#0080ff',  // Blue
        x: '#00ff00',  // Green
        b: '#ffff00',  // Yellow
        a: '#ff0000',  // Red
      };
      color = colorMap[button];
    }

    btn.style.background = color;

    // Update state
    const stateKey = `btn${player}${button.toUpperCase()}` as keyof ButtonLampsRendererState;
    this.state[stateKey] = enabled as never;
  }

  /**
   * Set all buttons for a player
   */
  private setAllButtons(player: 1 | 2, enabled: boolean): void {
    (['a', 'b', 'x', 'y'] as const).forEach((button) => {
      this.setButtonState(player, button, enabled);
    });
  }

  /**
   * Toggle button state
   */
  private toggleButton(player: 1 | 2, button: 'a' | 'b' | 'x' | 'y'): void {
    const btnId = `btn-${player}p-${button}`;
    const btn = document.getElementById(btnId);

    if (!btn) return;

    // Check current state (black = disabled)
    const isOn = btn.style.background !== 'rgb(0, 0, 0)';
    this.setButtonState(player, button, !isOn);
  }

  // ========================================
  // Public API - Player 1 Controls
  // ========================================

  setAllButtons1(enabled: boolean): void {
    this.setAllButtons(1, enabled);
  }

  toggleButton1A(): void {
    this.toggleButton(1, 'a');
  }

  toggleButton1B(): void {
    this.toggleButton(1, 'b');
  }

  toggleButton1X(): void {
    this.toggleButton(1, 'x');
  }

  toggleButton1Y(): void {
    this.toggleButton(1, 'y');
  }

  // ========================================
  // Public API - Player 2 Controls
  // ========================================

  setAllButtons2(enabled: boolean): void {
    this.setAllButtons(2, enabled);
  }

  toggleButton2A(): void {
    this.toggleButton(2, 'a');
  }

  toggleButton2B(): void {
    this.toggleButton(2, 'b');
  }

  toggleButton2X(): void {
    this.toggleButton(2, 'x');
  }

  toggleButton2Y(): void {
    this.toggleButton(2, 'y');
  }

  // ========================================
  // Getters (for external access)
  // ========================================

  getButton1State(): { a: boolean; b: boolean; x: boolean; y: boolean } {
    return {
      a: this.state.btn1A,
      b: this.state.btn1B,
      x: this.state.btn1X,
      y: this.state.btn1Y,
    };
  }

  getButton2State(): { a: boolean; b: boolean; x: boolean; y: boolean } {
    return {
      a: this.state.btn2A,
      b: this.state.btn2B,
      x: this.state.btn2X,
      y: this.state.btn2Y,
    };
  }
}

/**
 * Export singleton instance
 */
export const buttonLampsRenderer = new ButtonLampsRenderer();
