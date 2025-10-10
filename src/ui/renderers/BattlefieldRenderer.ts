/**
 * Battlefield Renderer
 *
 * Manages battlefield display modes, messages, and character states
 * Migrated from game.html inline JavaScript
 *
 * Battlefield System:
 * - Two display modes: split (2 characters) or single (unified background)
 * - Message box display
 * - Character blink animation (for active player indication)
 * - Background image management
 */

/**
 * Battlefield Renderer State
 */
class BattlefieldRendererState {
  battlefieldMode: 'split' | 'single' = 'split';
}

/**
 * Battlefield Renderer class
 */
export class BattlefieldRenderer {
  private state: BattlefieldRendererState;

  constructor() {
    this.state = new BattlefieldRendererState();
  }

  /**
   * Initialize renderer
   */
  initialize(): void {
    console.log('BattlefieldRenderer initialized');
    // Initialize to split mode
    this.setBattlefieldMode('split');
  }

  // ========================================
  // Battlefield Mode
  // ========================================

  /**
   * Set battlefield display mode
   */
  setBattlefieldMode(mode: 'split' | 'single'): void {
    const characterArea = document.getElementById('character-area');
    if (!characterArea) return;

    this.state.battlefieldMode = mode;

    if (mode === 'single') {
      // Single mode (unified background/image)
      characterArea.className = 'character-area single-mode';
      characterArea.innerHTML = `
        <div class="single-image">
          統合画面（背景や一枚絵をここに表示）
        </div>
      `;
    } else {
      // Split mode (two separate characters)
      characterArea.className = 'character-area split-mode';
      characterArea.innerHTML = `
        <div class="character" id="character-1p">
          １Ｐ
        </div>
        <div class="character" id="character-2p">
          ２Ｐ
        </div>
      `;
    }
  }

  /**
   * Set background image (switches to single mode)
   */
  setBackgroundImage(imageUrl: string): void {
    this.setBattlefieldMode('single');
    const singleImage = document.querySelector('.single-image') as HTMLElement;
    if (singleImage) {
      singleImage.style.backgroundImage = `url(${imageUrl})`;
      singleImage.style.backgroundSize = 'cover';
      singleImage.style.backgroundPosition = 'center';
      singleImage.textContent = '';
    }
  }

  /**
   * Set test background gradient (switches to single mode)
   */
  setTestBackground(): void {
    this.setBattlefieldMode('single');
    const singleImage = document.querySelector('.single-image') as HTMLElement;
    if (singleImage) {
      singleImage.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4)';
      singleImage.textContent = 'テスト背景';
    }
  }

  // ========================================
  // Character Blink (Active Player Indication)
  // ========================================

  /**
   * Set character blink animation
   */
  setCharacterBlink(player: '1p' | '2p' | 'none'): void {
    // Only works in split mode
    if (this.state.battlefieldMode !== 'split') return;

    const char1p = document.getElementById('character-1p');
    const char2p = document.getElementById('character-2p');

    if (!char1p || !char2p) return;

    if (player === '1p') {
      // Toggle 1P blink
      char1p.classList.toggle('active-player');
    } else if (player === '2p') {
      // Toggle 2P blink
      char2p.classList.toggle('active-player');
    } else if (player === 'none') {
      // Remove all blinking
      char1p.classList.remove('active-player');
      char2p.classList.remove('active-player');
    }
  }

  // ========================================
  // Message Box
  // ========================================

  /**
   * Set message text
   */
  setMessage(text: string): void {
    const messageBox = document.getElementById('message-box');
    if (messageBox) {
      messageBox.textContent = text;
    }
  }

  /**
   * Clear message
   */
  clearMessage(): void {
    this.setMessage('');
  }

  // ========================================
  // Getters (for external access)
  // ========================================

  getBattlefieldMode(): 'split' | 'single' {
    return this.state.battlefieldMode;
  }
}

/**
 * Export singleton instance
 */
export const battlefieldRenderer = new BattlefieldRenderer();
