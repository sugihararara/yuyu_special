/**
 * Reiki Renderer
 *
 * Manages reiki gauge and item stock display
 * Migrated from game.html inline JavaScript
 *
 * Reiki System:
 * - 25 cells spiritual energy gauge
 * - Blinking animation when filling/emptying
 * - Item slot display
 * - Player-specific fill direction (P1: left→right, P2: right→left)
 */

/**
 * Reiki Renderer State
 */
class ReikiRendererState {
  // Item stocks
  item1Current: string = '';
  item2Current: string = '';

  // Reiki values: 0-25
  reiki1Current: number = 20;
  reiki2Current: number = 20;
  reiki1Target: number = 20;
  reiki2Target: number = 20;

  // Animation flags
  reiki1Animating: boolean = false;
  reiki2Animating: boolean = false;
}

/**
 * Reiki Renderer class
 */
export class ReikiRenderer {
  private state: ReikiRendererState;

  constructor() {
    this.state = new ReikiRendererState();
  }

  /**
   * Initialize renderer
   */
  initialize(): void {
    console.log('ReikiRenderer initialized');
    this.updateItemDisplay();
    this.updateReikiDisplayImmediate(1);
    this.updateReikiDisplayImmediate(2);
  }

  // ========================================
  // Item Display
  // ========================================

  /**
   * Update item slot display
   */
  private updateItemDisplay(): void {
    // Player 1 item
    const item1Slot = document.querySelector('.player-info.p1 .item-slot');
    if (item1Slot) {
      if (this.state.item1Current === '') {
        item1Slot.textContent = '---';
        item1Slot.classList.add('empty');
      } else {
        item1Slot.textContent = this.state.item1Current;
        item1Slot.classList.remove('empty');
      }
    }

    // Player 2 item
    const item2Slot = document.querySelector('.player-info.p2 .item-slot');
    if (item2Slot) {
      if (this.state.item2Current === '') {
        item2Slot.textContent = '---';
        item2Slot.classList.add('empty');
      } else {
        item2Slot.textContent = this.state.item2Current;
        item2Slot.classList.remove('empty');
      }
    }
  }

  // ========================================
  // Reiki Gauge Display
  // ========================================

  /**
   * Update reiki gauge display immediately (no animation)
   */
  private updateReikiDisplayImmediate(player: 1 | 2): void {
    if (player === 1) {
      const reiki1Cells = document.querySelectorAll('.player-info.p1 .reiki-cell');
      const reiki1Label = document.querySelector('.player-info.p1 .reiki-label');

      reiki1Cells.forEach((cell, index) => {
        if (index < this.state.reiki1Current) {
          cell.classList.add('filled');
        } else {
          cell.classList.remove('filled');
        }
      });

      if (reiki1Label) {
        reiki1Label.textContent = `霊気ゲージ (${this.state.reiki1Current}/25)`;
      }

      const reiki1Value = document.getElementById('reiki1-value');
      if (reiki1Value) {
        reiki1Value.textContent = this.state.reiki1Current.toString();
      }
    } else {
      const reiki2Cells = document.querySelectorAll('.player-info.p2 .reiki-cell');
      const reiki2Label = document.querySelector('.player-info.p2 .reiki-label');

      reiki2Cells.forEach((cell, index) => {
        if (index < this.state.reiki2Current) {
          cell.classList.add('filled');
        } else {
          cell.classList.remove('filled');
        }
      });

      if (reiki2Label) {
        reiki2Label.textContent = `霊気ゲージ (${this.state.reiki2Current}/25)`;
      }

      const reiki2Value = document.getElementById('reiki2-value');
      if (reiki2Value) {
        reiki2Value.textContent = this.state.reiki2Current.toString();
      }
    }
  }

  /**
   * Animate reiki gauge changes with blinking effect
   */
  private async animateReiki(player: 1 | 2): Promise<void> {
    if (player === 1) {
      if (this.state.reiki1Animating) return;
      this.state.reiki1Animating = true;

      const cells = document.querySelectorAll('.player-info.p1 .reiki-cell');
      const label = document.querySelector('.player-info.p1 .reiki-label');

      while (this.state.reiki1Current !== this.state.reiki1Target) {
        if (this.state.reiki1Current < this.state.reiki1Target) {
          // Increase
          const cellIndex = this.state.reiki1Current;
          if (cellIndex < 25) {
            cells[cellIndex].classList.add('blinking');
            await this.sleep(150);
            cells[cellIndex].classList.add('filled');
            await this.sleep(150);
            cells[cellIndex].classList.remove('blinking');
            this.state.reiki1Current++;
          }
        } else {
          // Decrease
          const cellIndex = this.state.reiki1Current - 1;
          if (cellIndex >= 0) {
            cells[cellIndex].classList.add('blinking');
            await this.sleep(150);
            cells[cellIndex].classList.remove('filled');
            await this.sleep(150);
            cells[cellIndex].classList.remove('blinking');
            this.state.reiki1Current--;
          }
        }

        if (label) {
          label.textContent = `霊気ゲージ (${this.state.reiki1Current}/25)`;
        }

        const reiki1Value = document.getElementById('reiki1-value');
        if (reiki1Value) {
          reiki1Value.textContent = this.state.reiki1Current.toString();
        }
      }

      this.state.reiki1Animating = false;
    } else {
      if (this.state.reiki2Animating) return;
      this.state.reiki2Animating = true;

      const cells = document.querySelectorAll('.player-info.p2 .reiki-cell');
      const label = document.querySelector('.player-info.p2 .reiki-label');

      while (this.state.reiki2Current !== this.state.reiki2Target) {
        if (this.state.reiki2Current < this.state.reiki2Target) {
          // Increase
          const cellIndex = this.state.reiki2Current;
          if (cellIndex < 25) {
            cells[cellIndex].classList.add('blinking');
            await this.sleep(150);
            cells[cellIndex].classList.add('filled');
            await this.sleep(150);
            cells[cellIndex].classList.remove('blinking');
            this.state.reiki2Current++;
          }
        } else {
          // Decrease
          const cellIndex = this.state.reiki2Current - 1;
          if (cellIndex >= 0) {
            cells[cellIndex].classList.add('blinking');
            await this.sleep(150);
            cells[cellIndex].classList.remove('filled');
            await this.sleep(150);
            cells[cellIndex].classList.remove('blinking');
            this.state.reiki2Current--;
          }
        }

        if (label) {
          label.textContent = `霊気ゲージ (${this.state.reiki2Current}/25)`;
        }

        const reiki2Value = document.getElementById('reiki2-value');
        if (reiki2Value) {
          reiki2Value.textContent = this.state.reiki2Current.toString();
        }
      }

      this.state.reiki2Animating = false;
    }
  }

  /**
   * Helper function for async delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ========================================
  // Public API - Player 1 Controls
  // ========================================

  setItem1(itemName: string): void {
    this.state.item1Current = itemName;
    this.updateItemDisplay();
  }

  setReiki1(value: number): void {
    value = Math.max(0, Math.min(25, value));  // Clamp to 0-25
    this.state.reiki1Target = value;

    // Update input field
    const input = document.getElementById('reiki1-input') as HTMLInputElement;
    if (input) input.value = value.toString();

    // Start animation
    this.animateReiki(1);
  }

  // ========================================
  // Public API - Player 2 Controls
  // ========================================

  setItem2(itemName: string): void {
    this.state.item2Current = itemName;
    this.updateItemDisplay();
  }

  setReiki2(value: number): void {
    value = Math.max(0, Math.min(25, value));  // Clamp to 0-25
    this.state.reiki2Target = value;

    // Update input field
    const input = document.getElementById('reiki2-input') as HTMLInputElement;
    if (input) input.value = value.toString();

    // Start animation
    this.animateReiki(2);
  }

  // ========================================
  // Getters (for external access)
  // ========================================

  getItem1(): string {
    return this.state.item1Current;
  }

  getItem2(): string {
    return this.state.item2Current;
  }

  getReiki1(): number {
    return this.state.reiki1Current;
  }

  getReiki2(): number {
    return this.state.reiki2Current;
  }
}

/**
 * Export singleton instance
 */
export const reikiRenderer = new ReikiRenderer();
