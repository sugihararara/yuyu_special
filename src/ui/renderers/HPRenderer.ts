/**
 * HP Renderer
 *
 * Manages HP bar display and animations
 * Migrated from game.html inline JavaScript
 *
 * HP Display Features:
 * - Dual-layer bar (yellow + red)
 * - Smooth animation to target value
 * - 0-50%: Yellow bar only
 * - 51-100%: Yellow + Red bars
 */

/**
 * HP Renderer State
 */
class HPRendererState {
  // HP values: 0-96 (matches game specs)
  hp1Current: number = 96;
  hp2Current: number = 96;
  hp1Target: number = 96;
  hp2Target: number = 96;
  animationId: number | null = null;
}

/**
 * HP Renderer class
 */
export class HPRenderer {
  private state: HPRendererState;

  constructor() {
    this.state = new HPRendererState();
  }

  /**
   * Initialize and start animation loop
   */
  initialize(): void {
    console.log('HPRenderer initialized');
    this.startAnimation();
  }

  /**
   * Update HP display (called every frame)
   */
  private updateDisplay(): void {
    // Player 1 HP update
    const hp1Yellow = document.querySelector('.hp-bar.p1 .hp-bar-yellow') as HTMLElement;
    const hp1Red = document.querySelector('.hp-bar.p1 .hp-bar-red') as HTMLElement;

    if (hp1Yellow && hp1Red) {
      const hp1Percent = (this.state.hp1Current / 96) * 100;

      if (hp1Percent <= 50) {
        // Yellow bar only (0-50%)
        hp1Yellow.style.width = (hp1Percent * 2) + '%';  // 0-50 → 0-100%
        hp1Red.style.width = '0%';
      } else {
        // Yellow + Red bars (51-100%)
        hp1Yellow.style.width = '100%';
        hp1Red.style.width = ((hp1Percent - 50) * 2) + '%';  // 51-100 → 0-100%
      }
    }

    // Player 2 HP update
    const hp2Yellow = document.querySelector('.hp-bar.p2 .hp-bar-yellow') as HTMLElement;
    const hp2Red = document.querySelector('.hp-bar.p2 .hp-bar-red') as HTMLElement;

    if (hp2Yellow && hp2Red) {
      const hp2Percent = (this.state.hp2Current / 96) * 100;

      if (hp2Percent <= 50) {
        // Yellow bar only (0-50%)
        hp2Yellow.style.width = (hp2Percent * 2) + '%';
        hp2Red.style.width = '0%';
      } else {
        // Yellow + Red bars (51-100%)
        hp2Yellow.style.width = '100%';
        hp2Red.style.width = ((hp2Percent - 50) * 2) + '%';
      }
    }

    // Update debug panel values
    const hp1Value = document.getElementById('hp1-value');
    const hp2Value = document.getElementById('hp2-value');
    if (hp1Value) hp1Value.textContent = Math.round(this.state.hp1Current).toString();
    if (hp2Value) hp2Value.textContent = Math.round(this.state.hp2Current).toString();
  }

  /**
   * Animation loop (runs with requestAnimationFrame)
   */
  private animate = (): void => {
    // Player 1 HP gradually approach target
    if (Math.abs(this.state.hp1Current - this.state.hp1Target) > 0.5) {
      const diff = this.state.hp1Target - this.state.hp1Current;
      this.state.hp1Current += diff * 0.1;  // 10% per frame (exponential decay)
    } else {
      this.state.hp1Current = this.state.hp1Target;
    }

    // Player 2 HP gradually approach target
    if (Math.abs(this.state.hp2Current - this.state.hp2Target) > 0.5) {
      const diff = this.state.hp2Target - this.state.hp2Current;
      this.state.hp2Current += diff * 0.1;  // 10% per frame
    } else {
      this.state.hp2Current = this.state.hp2Target;
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

  setHP1(value: number): void {
    value = Math.max(0, Math.min(96, value));  // Clamp to 0-96
    this.state.hp1Target = value;

    // Update input field
    const input = document.getElementById('hp1-input') as HTMLInputElement;
    if (input) input.value = value.toString();
  }

  // ========================================
  // Public API - Player 2 Controls
  // ========================================

  setHP2(value: number): void {
    value = Math.max(0, Math.min(96, value));  // Clamp to 0-96
    this.state.hp2Target = value;

    // Update input field
    const input = document.getElementById('hp2-input') as HTMLInputElement;
    if (input) input.value = value.toString();
  }

  // ========================================
  // Getters (for external access)
  // ========================================

  getHP1(): number {
    return this.state.hp1Current;
  }

  getHP2(): number {
    return this.state.hp2Current;
  }
}

/**
 * Export singleton instance
 */
export const hpRenderer = new HPRenderer();
