/**
 * Module: VietQR Canvas Drawing
 * Procedural generation of VietQR code pattern on HTML5 Canvas
 */
(function() {
  'use strict';
  window.CLB = window.CLB || {};

  function drawVietQR(canvasId, text) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width || 220;
    const height = canvas.height || 220;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const modules = 25;
    const cellSize = (width - 24) / modules;
    const offset = 12;

    ctx.fillStyle = '#000000';

    function pseudoRandom(seed) {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    }

    let seed = 0;
    for (let i = 0; i < text.length; i++) {
      seed += text.charCodeAt(i);
    }

    // Module grid matrix
    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        // Skip corner finder patterns
        if ((r < 7 && c < 7) || (r < 7 && c >= modules - 7) || (r >= modules - 7 && c < 7)) {
          continue;
        }
        if (pseudoRandom(seed + r * modules + c) > 0.48) {
          ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize, cellSize);
        }
      }
    }

    // Draw 3 Finder Patterns
    drawFinder(ctx, offset, offset, cellSize);
    drawFinder(ctx, offset + (modules - 7) * cellSize, offset, cellSize);
    drawFinder(ctx, offset, offset + (modules - 7) * cellSize, cellSize);

    // Center VietQR logo icon badge
    const badgeSize = cellSize * 5;
    const badgeX = (width - badgeSize) / 2;
    const badgeY = (height - badgeSize) / 2;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(badgeX - 2, badgeY - 2, badgeSize + 4, badgeSize + 4);

    ctx.fillStyle = '#0054a6';
    ctx.fillRect(badgeX, badgeY, badgeSize, badgeSize);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MB', width / 2, height / 2);
  }

  function drawFinder(ctx, x, y, cellSize) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(x, y, cellSize * 7, cellSize * 7);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + cellSize, y + cellSize, cellSize * 5, cellSize * 5);
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + cellSize * 2, y + cellSize * 2, cellSize * 3, cellSize * 3);
  }

  window.CLB.vietqr = {
    drawVietQR
  };
})();
