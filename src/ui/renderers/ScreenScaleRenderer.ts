/**
 * Screen Scale Renderer
 *
 * Manages game screen scaling (zoom)
 * Migrated from game.html inline JavaScript
 *
 * Screen Scale System:
 * - Supports 0.5x to 3x scaling
 * - CSS transform-based scaling
 * - Button highlight for active scale
 */

/**
 * Screen Scale Renderer State
 */
class ScreenScaleRendererState {
  currentScale: number = 1.0;
}

/**
 * Screen Scale Renderer class
 */
export class ScreenScaleRenderer {
  private state: ScreenScaleRendererState;

  constructor() {
    this.state = new ScreenScaleRendererState();
  }

  /**
   * Initialize renderer
   */
  initialize(): void {
    console.log('ScreenScaleRenderer initialized');
    this.setGameScale(1.0);  // Default to 1x scale
  }

  /**
   * Set game screen scale
   */
  setGameScale(scale: number): void {
    const container = document.getElementById('game-screen-container');
    if (container) {
      // Apply CSS transform
      container.style.transform = `scale(${scale})`;

      // Update state
      this.state.currentScale = scale;

      // Update display value
      const scaleDisplay = document.getElementById('current-scale');
      if (scaleDisplay) {
        scaleDisplay.textContent = scale.toFixed(1);
      }

      // Update button highlights
      this.updateScaleButtonHighlight(scale);
    }
  }

  /**
   * Update scale button highlights
   */
  private updateScaleButtonHighlight(scale: number): void {
    // Reset all button backgrounds
    document.querySelectorAll('[id^="scale-"]').forEach((btn) => {
      (btn as HTMLElement).style.background = '#400';
    });

    // Highlight active button
    const activeBtn = document.getElementById(`scale-${scale}x`);
    if (activeBtn) {
      (activeBtn as HTMLElement).style.background = '#060';
    }
  }

  // ========================================
  // Public API
  // ========================================

  setScale0_5x(): void {
    this.setGameScale(0.5);
  }

  setScale1x(): void {
    this.setGameScale(1.0);
  }

  setScale1_5x(): void {
    this.setGameScale(1.5);
  }

  setScale2x(): void {
    this.setGameScale(2.0);
  }

  setScale3x(): void {
    this.setGameScale(3.0);
  }

  // ========================================
  // Getters (for external access)
  // ========================================

  getCurrentScale(): number {
    return this.state.currentScale;
  }
}

/**
 * Export singleton instance
 */
export const screenScaleRenderer = new ScreenScaleRenderer();
