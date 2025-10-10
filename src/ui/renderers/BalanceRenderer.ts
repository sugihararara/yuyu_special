/**
 * Balance Renderer
 *
 * Manages balance meter display and animations
 * Migrated from game.html inline JavaScript
 *
 * Balance System:
 * - Values: 0-255 (balance DAMAGE, not remaining balance)
 * - Display: Inverted (0 = full bar, 255 = knocked down)
 * - Animation: Intentional CSS+JS combo for "fighting game feel"
 *
 * IMPORTANT DESIGN NOTE:
 * The CSS transition + JS exponential decay animation is INTENTIONAL.
 * This creates a unique "slow at first, then snap at the end" effect
 * that mimics classic fighting games. This is NOT a bug!
 */

/**
 * Balance Renderer State
 */
class BalanceRendererState {
  // Balance values: 0-255 (balance DAMAGE, 0=full bar, 255=knocked down)
  balance1Current: number = 0;
  balance2Current: number = 0;
  balance1Target: number = 0;
  balance2Target: number = 0;
  animationId: number | null = null;
}

/**
 * Balance Renderer class
 */
export class BalanceRenderer {
  private state: BalanceRendererState;

  constructor() {
    this.state = new BalanceRendererState();
  }

  /**
   * Initialize and start animation loop
   */
  initialize(): void {
    console.log('BalanceRenderer initialized');
    this.startAnimation();
  }

  /**
   * Update balance display (called every frame)
   */
  private updateDisplay(): void {
    // Player 1 balance update
    // Convert balance damage (0-255) to remaining percentage (0-100%)
    const balance1Percent = ((256 - this.state.balance1Current) / 256) * 100;
    const balance1Fill = document.querySelector('.balance-meter.p1 .balance-meter-fill') as HTMLElement;
    if (balance1Fill) {
      balance1Fill.style.width = balance1Percent + '%';
    }

    // Player 2 balance update
    const balance2Percent = ((256 - this.state.balance2Current) / 256) * 100;
    const balance2Fill = document.querySelector('.balance-meter.p2 .balance-meter-fill') as HTMLElement;
    if (balance2Fill) {
      balance2Fill.style.width = balance2Percent + '%';
    }

    // Update debug panel values (show raw damage value)
    const balance1Value = document.getElementById('balance1-value');
    const balance2Value = document.getElementById('balance2-value');
    if (balance1Value) balance1Value.textContent = Math.round(this.state.balance1Current).toString();
    if (balance2Value) balance2Value.textContent = Math.round(this.state.balance2Current).toString();
  }

  /**
   * Animation loop (runs with requestAnimationFrame)
   *
   * IMPORTANT: CSS+JS combo animation is intentional
   * - JS: 10% exponential decay per frame
   * - CSS: 0.3s ease transition
   * Result: "Slow start, then snap" fighting game feel
   */
  private animate = (): void => {
    // Player 1 balance gradually approach target
    if (Math.abs(this.state.balance1Current - this.state.balance1Target) > 0.5) {
      const diff = this.state.balance1Target - this.state.balance1Current;
      this.state.balance1Current += diff * 0.1;  // 10% per frame (exponential decay)
    } else {
      this.state.balance1Current = this.state.balance1Target;  // Snap to target
    }

    // Player 2 balance gradually approach target
    if (Math.abs(this.state.balance2Current - this.state.balance2Target) > 0.5) {
      const diff = this.state.balance2Target - this.state.balance2Current;
      this.state.balance2Current += diff * 0.1;  // 10% per frame
    } else {
      this.state.balance2Current = this.state.balance2Target;  // Snap to target
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

  setBalance1(value: number): void {
    value = Math.max(0, Math.min(255, value));  // Clamp to 0-255
    this.state.balance1Target = value;

    // Update input field
    const input = document.getElementById('balance1-input') as HTMLInputElement;
    if (input) input.value = value.toString();
  }

  // ========================================
  // Public API - Player 2 Controls
  // ========================================

  setBalance2(value: number): void {
    value = Math.max(0, Math.min(255, value));  // Clamp to 0-255
    this.state.balance2Target = value;

    // Update input field
    const input = document.getElementById('balance2-input') as HTMLInputElement;
    if (input) input.value = value.toString();
  }

  // ========================================
  // Getters (for external access)
  // ========================================

  getBalance1(): number {
    return this.state.balance1Current;
  }

  getBalance2(): number {
    return this.state.balance2Current;
  }
}

/**
 * Export singleton instance
 */
export const balanceRenderer = new BalanceRenderer();
