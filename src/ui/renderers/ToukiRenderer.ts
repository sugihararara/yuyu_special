/**
 * Touki Renderer
 *
 * Manages touki meter display and animations
 * Migrated from game.html inline JavaScript
 */

/**
 * Touki meter state
 */
class ToukiRendererState {
  // Touki values: 0-96 (97 levels, matches game specs)
  touki1: number = 0;
  touki2: number = 0;
  isTouki1Charging: boolean = false;
  isTouki2Charging: boolean = false;
  animationId: number | null = null;

  // Charge speed constant
  readonly TOUKI_CHARGE_SPEED = 0.96; // 96 frames to MAX
}

/**
 * Touki Renderer class
 */
export class ToukiRenderer {
  private state: ToukiRendererState;

  constructor() {
    this.state = new ToukiRendererState();
  }

  /**
   * Initialize and start animation loop
   */
  initialize(): void {
    console.log('ToukiRenderer initialized');
    this.startAnimation();
  }

  /**
   * Get touki meter inner width (excluding borders)
   */
  private getToukiMeterWidth(playerId: 1 | 2): number {
    const meterElement = document.querySelector(`.touki-meter.p${playerId}`);
    if (meterElement) {
      const computedStyle = window.getComputedStyle(meterElement);
      const width = parseFloat(computedStyle.width);
      const borderLeft = parseFloat(computedStyle.borderLeftWidth);
      const borderRight = parseFloat(computedStyle.borderRightWidth);
      return width - borderLeft - borderRight;
    }
    // Fallback value
    return 176;
  }

  /**
   * Update touki display (called every frame)
   */
  private updateDisplay(): void {
    const touki1Element = document.getElementById('touki1');
    const touki2Element = document.getElementById('touki2');

    if (!touki1Element || !touki2Element) return;

    // Get actual meter widths
    const meter1Width = this.getToukiMeterWidth(1);
    const meter2Width = this.getToukiMeterWidth(2);

    // Calculate pixel widths
    // touki: 0-96 → convert to percentage for display
    const width1 = (this.state.touki1 / 96) * meter1Width;
    const width2 = (this.state.touki2 / 96) * meter2Width;

    touki1Element.style.width = width1 + 'px';
    touki2Element.style.width = width2 + 'px';

    // Update debug panel value display
    const value1 = document.getElementById('touki1-value');
    const value2 = document.getElementById('touki2-value');
    if (value1) value1.textContent = Math.round(this.state.touki1).toString();
    if (value2) value2.textContent = Math.round(this.state.touki2).toString();
  }

  /**
   * Animation loop (runs with requestAnimationFrame)
   */
  private animate = (): void => {
    // 1P charging
    if (this.state.isTouki1Charging && this.state.touki1 < 96) {
      this.state.touki1 = Math.min(96, this.state.touki1 + this.state.TOUKI_CHARGE_SPEED);
    }

    // 2P charging
    if (this.state.isTouki2Charging && this.state.touki2 < 96) {
      this.state.touki2 = Math.min(96, this.state.touki2 + this.state.TOUKI_CHARGE_SPEED);
    }

    this.updateDisplay();
    this.state.animationId = requestAnimationFrame(this.animate);
  };

  /**
   * Start animation loop
   */
  private startAnimation(): void {
    if (this.state.animationId === null) {
      this.state.animationId = requestAnimationFrame(this.animate);
    }
  }

  /**
   * Stop animation loop
   */
  stopAnimation(): void {
    if (this.state.animationId !== null) {
      cancelAnimationFrame(this.state.animationId);
      this.state.animationId = null;
    }
  }

  // ========================================
  // Public API - Player 1 Controls
  // ========================================

  startChargeTouki1(): void {
    this.state.isTouki1Charging = true;
    const button = document.getElementById('touki1-charge');
    if (button) (button as HTMLElement).style.background = '#800';
  }

  stopChargeTouki1(): void {
    this.state.isTouki1Charging = false;
    const button = document.getElementById('touki1-charge');
    if (button) (button as HTMLElement).style.background = '#400';
  }

  resetTouki1(): void {
    this.state.touki1 = 0;
    this.updateDisplay();
  }

  setTouki1(value: number): void {
    this.state.touki1 = Math.max(0, Math.min(96, value));
    this.updateDisplay();
  }

  setTouki1Color(color: 'red' | 'cyan' | 'purple'): void {
    const colorMap = {
      red: '#ff0000',
      cyan: '#00ffff',
      purple: '#9900ff',
    };
    const element = document.getElementById('touki1');
    if (element) element.style.background = colorMap[color];
  }

  // ========================================
  // Public API - Player 2 Controls
  // ========================================

  startChargeTouki2(): void {
    this.state.isTouki2Charging = true;
    const button = document.getElementById('touki2-charge');
    if (button) (button as HTMLElement).style.background = '#800';
  }

  stopChargeTouki2(): void {
    this.state.isTouki2Charging = false;
    const button = document.getElementById('touki2-charge');
    if (button) (button as HTMLElement).style.background = '#400';
  }

  resetTouki2(): void {
    this.state.touki2 = 0;
    this.updateDisplay();
  }

  setTouki2(value: number): void {
    this.state.touki2 = Math.max(0, Math.min(96, value));
    this.updateDisplay();
  }

  setTouki2Color(color: 'red' | 'cyan' | 'purple'): void {
    const colorMap = {
      red: '#ff0000',
      cyan: '#00ffff',
      purple: '#9900ff',
    };
    const element = document.getElementById('touki2');
    if (element) element.style.background = colorMap[color];
  }

  // ========================================
  // Getters (for external access)
  // ========================================

  getTouki1(): number {
    return this.state.touki1;
  }

  getTouki2(): number {
    return this.state.touki2;
  }
}

/**
 * Export singleton instance
 */
export const toukiRenderer = new ToukiRenderer();
