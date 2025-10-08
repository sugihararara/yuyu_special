/**
 * Entry point for Yu Yu Hakusho Special Edition
 *
 * Architecture:
 * - Types: Data structures and interfaces
 * - Logic: Game engine (battle, combat, stats, etc.)
 * - Input: Input adapters (keyboard, network)
 * - UI: Canvas rendering
 * - Data: Character stats, frame data, lookup tables
 */

console.log('幽☆遊☆白書 特別篇 - Starting...');

// Get canvas and hide loading
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const loading = document.getElementById('loading') as HTMLElement;
const ctx = canvas.getContext('2d');

if (!ctx) {
  throw new Error('Failed to get 2D context');
}

// Hide loading, show canvas
loading.style.display = 'none';
canvas.style.display = 'block';

// Temporary test rendering
ctx.fillStyle = '#1a1a1a';
ctx.fillRect(0, 0, 512, 448);

ctx.fillStyle = '#fff';
ctx.font = '20px "MS Gothic"';
ctx.textAlign = 'center';
ctx.fillText('幽☆遊☆白書 特別篇', 256, 224);
ctx.font = '14px "MS Gothic"';
ctx.fillText('Game engine initializing...', 256, 260);

console.log('Canvas ready. Starting game engine...');

// TODO: Initialize game engine
// const engine = new GameEngine(ctx);
// engine.start();
