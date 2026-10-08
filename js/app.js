/**
 * TRUM.TOP - CHẴN LẺ BANK UI UX ENGINE
 * Conforms to: Exact Visual Representation, WCAG 2.2 AA, 8-State Architecture
 */

const App = (function() {
  'use strict';

  // State Management
  const state = {
    soundEnabled: true,
    densityCompact: false,
    currentGame: 'cltx',
    audioCtx: null,
    activeBank: {
      name: 'MBBank',
      accountNumber: '0644888866',
      owner: 'NGUYEN VAN PHONG',
      memo: 'C'
    },
    gameConfigs: {
      cltx: {
        name: 'CLTX (Chẵn Lẻ Tài Xỉu)',
        rate: 2.4,
        memos: ['C', 'L', 'T', 'X']
      },
      cltx2: {
        name: 'CLTX2 (Chẵn Lẻ Tài Xỉu 2)',
        rate: 1.98,
        memos: ['C2', 'L2', 'T2', 'X2']
      },
      doanso: {
        name: 'ĐOÁN SỐ',
        rate: 7.0,
        memos: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      },
      '1p3': {
        name: '1 PHẦN 3',
        rate: 3.0,
        memos: ['N1', 'N2', 'N3']
      },
      tong3: {
        name: 'TỔNG 3 SỐ',
        rate: 3.5,
        memos: ['S1', 'S2', 'S3']
      },
      xien: {
        name: 'XIÊN',
        rate: 3.2,
        memos: ['CX', 'CT', 'LX', 'LT']
      },
      tx: {
        name: 'TÀI XỈU',
        rate: 2.4,
        memos: ['T', 'X']
      }
    }
  };

  // Web Audio Synth Synthesizer for subtle UX feedback
  function initAudio() {
    if (!state.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) state.audioCtx = new AudioContext();
    }
  }

  function playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.08) {
    if (!state.soundEnabled) return;
    try {
      initAudio();
      if (!state.audioCtx) return;
      if (state.audioCtx.state === 'suspended') state.audioCtx.resume();
      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, state.audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, state.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, state.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(state.audioCtx.destination);
      osc.start();
      osc.stop(state.audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay fallback
    }
  }

  function playChime(isWin = true) {
    if (!state.soundEnabled) return;
    if (isWin) {
      playTone(523.25, 'triangle', 0.12, 0.06);
      setTimeout(() => playTone(659.25, 'triangle', 0.12, 0.06), 90);
      setTimeout(() => playTone(783.99, 'triangle', 0.22, 0.08), 180);
    } else {
      playTone(220, 'sawtooth', 0.12, 0.04);
      setTimeout(() => playTone(180, 'sawtooth', 0.18, 0.04), 100);
    }
  }

  // Toast Notification System
  function showToast(message, type = 'info', duration = 2800) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    let iconClass = 'fa-circle-info';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'danger') iconClass = 'fa-triangle-exclamation';

    toast.innerHTML = `<i class="fa-solid ${iconClass}"></i><span>${message}</span>`;
    container.appendChild(toast);
    playTone(type === 'danger' ? 240 : 480, 'sine', 0.08);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-8px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, duration);
  }

  // Copy to Clipboard Utility
  function copyText(text, label) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Đã sao chép ${label || text}!`, 'success');
        playTone(620, 'sine', 0.08);
      }).catch(() => fallbackCopy(text, label));
    } else {
      fallbackCopy(text, label);
    }
  }

  function fallbackCopy(text, label) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast(`Đã sao chép ${label || text}!`, 'success');
      playTone(620, 'sine', 0.08);
    } catch (e) {
      showToast('Không thể sao chép tự động!', 'danger');
    }
    document.body.removeChild(ta);
  }

  // Generate Realistic VietQR Canvas Pattern
  function drawVietQR(canvasId, text) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // Matrix
    ctx.fillStyle = '#0a192f';
    const gridSize = 25;
    const cellSize = (w - 40) / gridSize;
    const startX = 20;
    const startY = 20;

    let seed = 0;
    for (let i = 0; i < text.length; i++) seed = (seed * 31 + text.charCodeAt(i)) % 1000000;

    function pseudoRandom() {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    }

    // Corner Finder Patterns
    function drawFinder(gx, gy) {
      const px = startX + gx * cellSize;
      const py = startY + gy * cellSize;
      const sz = cellSize * 7;
      ctx.fillStyle = '#0a192f';
      ctx.fillRect(px, py, sz, sz);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px + cellSize, py + cellSize, sz - 2 * cellSize, sz - 2 * cellSize);
      ctx.fillStyle = '#0a192f';
      ctx.fillRect(px + 2 * cellSize, py + 2 * cellSize, sz - 4 * cellSize, sz - 4 * cellSize);
    }

    drawFinder(0, 0);
    drawFinder(gridSize - 7, 0);
    drawFinder(0, gridSize - 7);

    // Data dots
    ctx.fillStyle = '#0a192f';
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if ((r < 8 && c < 8) || (r < 8 && c >= gridSize - 8) || (r >= gridSize - 8 && c < 8)) continue;
        if (pseudoRandom() > 0.48) {
          ctx.fillRect(startX + c * cellSize, startY + r * cellSize, cellSize - 0.5, cellSize - 0.5);
        }
      }
    }

    // Center MBBank / NAPAS Badge
    const centerSize = 44;
    const cx = w / 2 - centerSize / 2;
    const cy = h / 2 - centerSize / 2;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 3, cy - 3, centerSize + 6, centerSize + 6);
    ctx.fillStyle = '#003399';
    ctx.beginPath();
    ctx.roundRect(cx, cy, centerSize, centerSize, 5);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px "Open Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MBBANK', w / 2, h / 2);
  }

  // Open VietQR Modal
  function openQrModal(bankName, stk, owner) {
    state.activeBank.name = bankName || state.activeBank.name;
    state.activeBank.accountNumber = stk || state.activeBank.accountNumber;
    state.activeBank.owner = owner || state.activeBank.owner;

    const nameEl = document.getElementById('modal-bank-name');
    const stkEl = document.getElementById('modal-bank-stk');
    const ownerEl = document.getElementById('modal-bank-owner');
    const memoEl = document.getElementById('modal-bank-memo');

    if (nameEl) nameEl.textContent = state.activeBank.name;
    if (stkEl) stkEl.textContent = state.activeBank.accountNumber;
    if (ownerEl) ownerEl.textContent = state.activeBank.owner;
    if (memoEl) memoEl.textContent = state.activeBank.memo;

    const qrData = `vietqr://${state.activeBank.name}/${state.activeBank.accountNumber}?memo=${state.activeBank.memo}`;
    drawVietQR('qr-canvas', qrData);

    const modal = document.getElementById('modal-qr');
    if (modal) {
      modal.classList.add('is-open');
      playTone(450, 'sine', 0.1);
    }
  }

  function closeQrModal() {
    const modal = document.getElementById('modal-qr');
    if (modal) modal.classList.remove('is-open');
  }

  // Switch Game Mode
  function setGameMode(modeKey) {
    state.currentGame = modeKey;
    const config = state.gameConfigs[modeKey] || state.gameConfigs.cltx;

    // Update active tab buttons
    document.querySelectorAll('.game-tab-button').forEach(btn => {
      const isSelected = btn.getAttribute('data-game') === modeKey;
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });

    state.activeBank.memo = config.memos[0];
    showToast(`Chuyển chế độ: ${config.name}`, 'info');
    playTone(520, 'sine', 0.08);
  }

  // Live Stream Transactions Simulator
  const mockNicknames = ['nghia5***', 'trhvunga***', 'danhsan***', 'Tiet9***', 'Bao7***', 'Xuanthao***', 'Huy2***', 'dzuz7***'];
  const mockAmounts = [20000, 48000, 100000, 150000, 250000, 600000];

  function formatTimeNow() {
    const now = new Date();
    const Y = now.getFullYear();
    const M = String(now.getMonth() + 1).padStart(2, '0');
    const D = String(now.getDate()).padStart(2, '0');
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    return `${Y}/${M}/${D} ${h}:${m}:${s}`;
  }

  function streamNewBigWinner() {
    const tbody = document.getElementById('big-winners-rows');
    if (!tbody) return;

    const nick = mockNicknames[Math.floor(Math.random() * mockNicknames.length)];
    const games = ['CL', 'TX'];
    const game = games[Math.floor(Math.random() * games.length)];
    const choices = game === 'CL' ? ['C', 'L'] : ['T', 'X'];
    const choice = choices[Math.floor(Math.random() * choices.length)];
    const bet = mockAmounts[Math.floor(Math.random() * mockAmounts.length)];
    const winAmount = Math.round(bet * 2.4);
    const lastDigit = [1, 2, 4, 6, 7, 8][Math.floor(Math.random() * 6)];
    const trans = `***${Math.floor(1000 + Math.random() * 9000)}`;

    const row = document.createElement('tr');
    row.style.backgroundColor = 'rgba(40, 167, 69, 0.2)';
    row.style.transition = 'background-color 1.5s ease';

    row.innerHTML = `
      <td><code>${nick}</code></td>
      <td><span class="badge-game-mode">${game}</span></td>
      <td><span class="badge-bet-choice">${choice}</span></td>
      <td>${bet.toLocaleString('vi-VN')}</td>
      <td><strong style="color: #4ade80;">${winAmount.toLocaleString('vi-VN')}</strong></td>
      <td><span class="badge-result-win">WIN</span></td>
      <td><code>${trans}</code></td>
      <td><span class="badge-tail-digit">${lastDigit}</span></td>
      <td>${formatTimeNow()}</td>
    `;

    tbody.insertBefore(row, tbody.firstChild);
    if (tbody.children.length > 7) tbody.removeChild(tbody.lastChild);

    setTimeout(() => { row.style.backgroundColor = ''; }, 1200);
    if (bet >= 200000) playChime(true);
  }

  // Lookup Transaction Tool
  function searchTransaction() {
    const input = document.getElementById('input-search-tx');
    const resultBox = document.getElementById('tx-search-result-box');
    if (!input || !resultBox) return;

    const query = input.value.trim();
    if (!query) {
      showToast('Vui lòng nhập mã giao dịch ngân hàng để kiểm tra!', 'danger');
      input.focus();
      return;
    }

    resultBox.style.display = 'block';
    resultBox.innerHTML = `
      <div style="display: flex; align-items: center; gap: 6px; color: #38bdf8;">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <span>Đang kết nối cổng MBBank & tra cứu mã GD ${query}...</span>
      </div>
    `;

    setTimeout(() => {
      const lastDigit = parseInt(query.replace(/\D/g, '').slice(-1) || '7', 10);
      const isWin = [1, 2, 4, 6, 7, 8].includes(lastDigit);

      resultBox.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border-strong); padding-bottom: 4px;">
            <strong style="color: #4ade80;"><i class="fa-solid fa-check"></i> ĐÃ TÌM THẤY GIAO DỊCH</strong>
            <span style="color: #9ca3af;">Mã GD: <strong>${query.toUpperCase()}</strong></span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-top: 4px;">
            <div>Số tiền chuyển: <strong style="color: #facc15;">100,000đ</strong></div>
            <div>Số cuối mã GD: <span class="badge-tail-digit">${lastDigit}</span></div>
            <div>Kết quả cược: <strong style="color: ${isWin ? '#4ade80' : '#f87171'};">${isWin ? 'THẮNG (x2.4)' : 'KHÔNG TRÚNG'}</strong></div>
            <div>Tiền trả về: <strong style="color: #4ade80;">${isWin ? '240,000đ (Đã chuyển 5s)' : '0đ'}</strong></div>
          </div>
        </div>
      `;
      playChime(isWin);
      showToast(`Đã kiểm tra mã ${query}!`, 'success');
    }, 600);
  }

  // Setup Event Listeners
  function initListeners() {
    // Button 1: Sound Toggle
    const btnSound = document.getElementById('btn-sound');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        const icon = document.getElementById('sound-icon');
        if (icon) {
          icon.className = state.soundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
        }
        showToast(state.soundEnabled ? 'Đã bật âm thanh hiệu ứng' : 'Đã tắt âm thanh', 'info');
      });
    }

    // Button 2: Density Toggle
    const btnDensity = document.getElementById('btn-density');
    if (btnDensity) {
      btnDensity.addEventListener('click', () => {
        state.densityCompact = !state.densityCompact;
        document.querySelectorAll('.table-clean th, .table-clean td, .table-live-stream th, .table-live-stream td').forEach(el => {
          el.style.padding = state.densityCompact ? '4px 6px' : '';
        });
        showToast(`Đã đổi chế độ: ${state.densityCompact ? 'Thu gọn (Compact)' : 'Chuẩn'}`, 'info');
      });
    }

    // Button 3: Design Tokens Drawer Modal
    const btnOpenDs = document.getElementById('btn-design-tokens');
    const modalDs = document.getElementById('modal-design-system');
    const btnCloseDs = document.getElementById('btn-close-ds-modal');
    const btnCloseDsFooter = document.getElementById('btn-close-ds-footer');

    const toggleDs = (open) => {
      if (modalDs) modalDs.classList.toggle('is-open', open);
    };

    if (btnOpenDs) btnOpenDs.addEventListener('click', () => toggleDs(true));
    if (btnCloseDs) btnCloseDs.addEventListener('click', () => toggleDs(false));
    if (btnCloseDsFooter) btnCloseDsFooter.addEventListener('click', () => toggleDs(false));

    // Button 4: Red Bank Pill
    const btnBank = document.getElementById('btn-bank-tab');
    if (btnBank) {
      btnBank.addEventListener('click', () => {
        showToast('Hệ thống đang hoạt động ở chế độ Bank chuyển tiền 24/7!', 'info');
        playTone(600, 'sine', 0.1);
      });
    }

    // Button 5: Save Account Info
    const btnSaveAcc = document.getElementById('btn-save-account');
    if (btnSaveAcc) {
      btnSaveAcc.addEventListener('click', () => {
        const stk = document.getElementById('input-stk-reward').value.trim();
        const name = document.getElementById('input-name-reward').value.trim();
        showToast(`Đã lưu thông tin Bank: ${name} (${stk})`, 'success');
        playTone(550, 'sine', 0.1);
      });
    }

    // Button 6: Lịch sử chơi scroll
    const btnHistory = document.getElementById('btn-history-play');
    if (btnHistory) {
      btnHistory.addEventListener('click', () => {
        const target = document.getElementById('lich-su-choi-section');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          target.style.boxShadow = '0 0 14px rgba(56, 189, 248, 0.6)';
          setTimeout(() => { target.style.boxShadow = ''; }, 1200);
        }
      });
    }

    // Buttons 8, 10, 12, 14: Copy STK in Table 1
    ['btn-copy-stk-1', 'btn-copy-stk-2', 'btn-copy-stk-3', 'btn-copy-stk-4'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => {
          const stk = btn.getAttribute('data-stk');
          copyText(stk, `STK ${stk}`);
        });
      }
    });

    // Button 15: Claim Quest Reward
    const btnClaim = document.getElementById('btn-claim-quest');
    if (btnClaim) {
      btnClaim.addEventListener('click', () => {
        btnClaim.disabled = true;
        btnClaim.innerHTML = '<i class="fa-solid fa-check"></i> Đã nhận';
        btnClaim.style.opacity = '0.5';
        showToast('Chúc mừng! Bạn đã nhận thưởng mốc 614k (+6.666đ)!', 'success');
        playChime(true);
      });
    }

    // Button 16: Search Transaction
    const btnSearch = document.getElementById('btn-search-tx');
    const inputSearch = document.getElementById('input-search-tx');
    if (btnSearch) btnSearch.addEventListener('click', searchTransaction);
    if (inputSearch) {
      inputSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') searchTransaction();
      });
    }

    // Game Mode Tabs Switching
    document.querySelectorAll('.game-tab-button').forEach(btn => {
      btn.addEventListener('click', () => {
        const game = btn.getAttribute('data-game');
        setGameMode(game);
      });
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const game = btn.getAttribute('data-game');
          setGameMode(game);
        }
      });
    });

    // =========================================================================
    // PHONE FAKE BANKING SIMULATOR LOGIC
    // =========================================================================
    const phoneState = {
      balance: 5420000,
      amount: 50000,
      memo: 'C',
      recipientName: 'NGUYEN VAN PHONG',
      recipientStk: '0644888866'
    };

    const modalPhone = document.getElementById('modal-phone-sim');
    const btnOpenPhone = document.getElementById('btn-open-phone-sim');
    const btnClosePhone = document.getElementById('btn-close-phone');
    const screenForm = document.getElementById('phone-screen-form');
    const screenReceipt = document.getElementById('phone-screen-receipt');
    const faceidOverlay = document.getElementById('phone-faceid-overlay');
    const payoutAlert = document.getElementById('phone-payout-alert');
    const payoutToastBody = document.getElementById('phone-payout-toast-body');

    // Helper to trigger realistic Phone Banking Notification Dropdown
    let phoneToastTimer = null;
    const triggerPhoneNotification = ({ title, body, iconHtml, type, duration = 4200 }) => {
      if (!payoutAlert) return;
      if (phoneToastTimer) clearTimeout(phoneToastTimer);

      payoutAlert.classList.remove('show', 'is-debit', 'is-credit', 'is-lose', 'is-topup');

      const iconEl = document.getElementById('phone-payout-toast-icon');
      const titleEl = document.getElementById('phone-payout-toast-title');
      const bodyEl = document.getElementById('phone-payout-toast-body');

      if (type) payoutAlert.classList.add(`is-${type}`);
      if (iconEl && iconHtml) iconEl.innerHTML = iconHtml;
      if (titleEl && title) titleEl.innerHTML = title;
      if (bodyEl && body) bodyEl.innerHTML = body;

      // Force layout reflow to retrigger animation
      void payoutAlert.offsetWidth;
      payoutAlert.classList.add('show');

      phoneToastTimer = setTimeout(() => {
        payoutAlert.classList.remove('show');
      }, duration);
    };

    // Open/Close Phone Modal
    const togglePhone = (open) => {
      if (modalPhone) {
        modalPhone.classList.toggle('is-open', open);
        if (open) playTone(480, 'sine', 0.08);
      }
    };

    if (btnOpenPhone) btnOpenPhone.addEventListener('click', () => togglePhone(true));
    if (btnClosePhone) btnClosePhone.addEventListener('click', () => togglePhone(false));

    // Update Phone Clock to local live time
    const updatePhoneClock = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const clockEl = document.getElementById('phone-clock');
      if (clockEl) clockEl.textContent = `${h}:${m}`;
    };
    updatePhoneClock();
    setInterval(updatePhoneClock, 30000);

    // Amount Chips Selection
    document.querySelectorAll('.fake-chip-btn').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.fake-chip-btn').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const val = parseInt(chip.getAttribute('data-amount'), 10);
        phoneState.amount = val;

        const disp = document.getElementById('phone-amount-display');
        const btnText = document.getElementById('btn-phone-transfer-text');
        if (disp) disp.textContent = `${val.toLocaleString('vi-VN')} VND`;
        if (btnText) btnText.textContent = `XÁC NHẬN CHUYỂN TIỀN (${(val/1000).toLocaleString('vi-VN')}k)`;
        playTone(550, 'sine', 0.05);
      });
    });

    // Memo Chips Selection
    document.querySelectorAll('.fake-memo-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.fake-memo-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const memo = chip.getAttribute('data-memo');
        phoneState.memo = memo;

        const disp = document.getElementById('phone-memo-display');
        if (disp) disp.textContent = memo;
        playTone(580, 'sine', 0.05);
      });
    });

    // Top-Up & Balance Adjustment Listeners
    const btnToggleTopup = document.getElementById('btn-toggle-topup');
    const topupPanel = document.getElementById('phone-topup-panel');
    if (btnToggleTopup && topupPanel) {
      btnToggleTopup.addEventListener('click', () => {
        topupPanel.classList.toggle('is-open');
        playTone(480, 'sine', 0.06);
      });
    }

    // Top-up Chip Buttons
    document.querySelectorAll('.topup-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const topupVal = btn.getAttribute('data-topup');
        if (!topupVal) return;

        if (topupVal === 'reset') {
          phoneState.balance = 10000000;
          showToast('Đã khôi phục số dư MB về 10,000,000đ!', 'success');
          triggerPhoneNotification({
            type: 'topup',
            iconHtml: '<i class="fa-solid fa-arrows-rotate" style="color: #38bdf8;"></i>',
            title: '<span style="color: #38bdf8; font-weight: 800;">MBBank Khôi phục số dư gốc</span>',
            body: `TK 0971266012 | Đặt lại số dư: 10,000,000 VND | <strong>Số dư khả dụng: 10,000,000 VND</strong>`,
            duration: 3500
          });
        } else {
          const addAmount = parseInt(topupVal, 10);
          if (!isNaN(addAmount)) {
            phoneState.balance += addAmount;
            showToast(`Đã nạp +${addAmount.toLocaleString('vi-VN')}đ vào tài khoản nguồn MBBank!`, 'success');
            triggerPhoneNotification({
              type: 'topup',
              iconHtml: '<i class="fa-solid fa-wallet" style="color: #4ade80;"></i>',
              title: `<span style="color: #4ade80; font-weight: 800;">MBBank Nạp tiền nguồn (+${(addAmount >= 1000000 ? (addAmount/1000000)+'M' : (addAmount/1000)+'k')})</span>`,
              body: `TK 0971266012 | Nạp: +${addAmount.toLocaleString('vi-VN')} VND | <strong>Số dư khả dụng: ${phoneState.balance.toLocaleString('vi-VN')} VND</strong>`,
              duration: 3500
            });
          }
        }

        const balEl = document.getElementById('phone-user-balance');
        if (balEl) balEl.textContent = `${phoneState.balance.toLocaleString('vi-VN')}đ`;

        // Melodic deposit sound
        playTone(523, 'triangle', 0.08, 0.03);
        setTimeout(() => playTone(659, 'triangle', 0.1, 0.03), 70);
        setTimeout(() => playTone(784, 'sine', 0.16, 0.04), 140);
      });
    });

    // Custom Top-Up Amount Prompt
    const btnCustomTopup = document.getElementById('btn-custom-topup');
    if (btnCustomTopup) {
      btnCustomTopup.addEventListener('click', () => {
        const currentBal = phoneState.balance;
        const res = prompt('Nhập số dư tài khoản MB bạn muốn đặt (VND):', currentBal.toString());
        if (res !== null) {
          const num = parseInt(res.replace(/\D/g, ''), 10);
          if (!isNaN(num) && num > 0) {
            phoneState.balance = num;
            const balEl = document.getElementById('phone-user-balance');
            if (balEl) balEl.textContent = `${phoneState.balance.toLocaleString('vi-VN')}đ`;
            showToast(`Đã thiết lập số dư MB thành công: ${phoneState.balance.toLocaleString('vi-VN')}đ`, 'success');
            triggerPhoneNotification({
              type: 'topup',
              iconHtml: '<i class="fa-solid fa-pen-to-square" style="color: #38bdf8;"></i>',
              title: '<span style="color: #38bdf8; font-weight: 800;">MBBank Cập nhật số dư tùy chỉnh</span>',
              body: `TK 0971266012 | <strong>Số dư khả dụng mới: ${phoneState.balance.toLocaleString('vi-VN')} VND</strong>`,
              duration: 3500
            });
            playTone(587, 'sine', 0.1);
            setTimeout(() => playTone(880, 'sine', 0.18), 90);
          } else {
            showToast('Số tiền nhập không hợp lệ!', 'warning');
          }
        }
      });
    }

    // Receipt Quick Top-up Button
    const btnReceiptTopup = document.getElementById('btn-receipt-quick-topup');
    if (btnReceiptTopup) {
      btnReceiptTopup.addEventListener('click', () => {
        if (screenReceipt) screenReceipt.classList.remove('is-active');
        if (screenForm) screenForm.style.display = 'flex';
        if (topupPanel) topupPanel.classList.add('is-open');
        playTone(520, 'sine', 0.08);
      });
    }

    // Submit Fake Transfer
    const btnSubmitTransfer = document.getElementById('btn-phone-submit-transfer') || document.getElementById('btn-fake-transfer-confirm');
    if (btnSubmitTransfer) {
      btnSubmitTransfer.addEventListener('click', () => {
        if (phoneState.balance < phoneState.amount) {
          if (topupPanel) topupPanel.classList.add('is-open');
          showToast('Số dư MB không đủ để chuyển! Vui lòng nạp thêm tiền bên dưới.', 'danger');
          playTone(240, 'sawtooth', 0.2);
          return;
        }

        // Deduct balance
        phoneState.balance -= phoneState.amount;
        const balEl = document.getElementById('phone-user-balance');
        if (balEl) balEl.textContent = `${phoneState.balance.toLocaleString('vi-VN')}đ`;

        // Sound: Transfer initiate
        playTone(350, 'triangle', 0.12, 0.06);

        // Step 1: Show FaceID Scanning
        if (faceidOverlay) faceidOverlay.classList.add('is-active');
        setTimeout(() => playTone(600, 'sine', 0.12, 0.05), 350);

        // Step 2: Complete FaceID & Show Receipt
        setTimeout(() => {
          if (faceidOverlay) faceidOverlay.classList.remove('is-active');

          // Generate authentic Fast Transfer FT transaction code (Vietnamese banking standard)
          const randFT = Math.floor(100000000 + Math.random() * 900000000);
          const fullTxCode = `FT26${randFT}`;
          const lastDigit = randFT % 10;

          // Determine WIN / LOSE based on player's chosen memo
          let isWin = false;
          let rate = 2.4;
          const memoUpper = phoneState.memo.toUpperCase();

          if (memoUpper === 'C') {
            isWin = [2, 4, 6, 8].includes(lastDigit);
            rate = 2.4;
          } else if (memoUpper === 'L') {
            isWin = [1, 3, 5, 7].includes(lastDigit);
            rate = 2.4;
          } else if (memoUpper === 'T') {
            isWin = [5, 6, 7, 8].includes(lastDigit);
            rate = 2.4;
          } else if (memoUpper === 'X') {
            isWin = [1, 2, 3, 4].includes(lastDigit);
            rate = 2.4;
          } else if (memoUpper === 'C2') {
            isWin = [0, 2, 4, 6, 8].includes(lastDigit);
            rate = 1.98;
          } else if (memoUpper === 'L2') {
            isWin = [1, 3, 5, 7, 9].includes(lastDigit);
            rate = 1.98;
          }

          const payoutAmount = isWin ? Math.round(phoneState.amount * rate) : 0;

          // Update Receipt Elements
          const receiptAmountEl = document.getElementById('receipt-amount-display');
          const receiptTimeEl = document.getElementById('receipt-time-display');
          const receiptMemoEl = document.getElementById('receipt-memo');
          const receiptTxEl = document.getElementById('receipt-tx-code');
          const receiptDigitEl = document.getElementById('receipt-last-digit');
          const receiptTailEl = document.getElementById('receipt-tail-box');
          const receiptMatchEl = document.getElementById('receipt-match-result');
          const receiptRecipientStk = document.getElementById('receipt-recipient-stk');
          const receiptRecipientName = document.getElementById('receipt-recipient-name');

          if (receiptAmountEl) receiptAmountEl.textContent = `-${phoneState.amount.toLocaleString('vi-VN')} VND`;
          if (receiptTimeEl) receiptTimeEl.textContent = formatTimeNow();
          if (receiptMemoEl) receiptMemoEl.textContent = phoneState.memo;
          if (receiptTxEl) receiptTxEl.textContent = fullTxCode;
          if (receiptDigitEl) receiptDigitEl.textContent = lastDigit;
          if (receiptTailEl) receiptTailEl.textContent = lastDigit;
          if (receiptRecipientStk) receiptRecipientStk.textContent = phoneState.recipientStk;
          if (receiptRecipientName) receiptRecipientName.textContent = phoneState.recipientName;

          if (receiptMatchEl) {
            if (isWin) {
              receiptMatchEl.style.color = '#16a34a';
              receiptMatchEl.textContent = `KHỚP CỬA ${phoneState.memo} ➔ THẮNG (+${payoutAmount.toLocaleString('vi-VN')}đ)`;
            } else {
              receiptMatchEl.style.color = '#dc2626';
              receiptMatchEl.textContent = `SỐ CUỐI ${lastDigit} KHÔNG KHỚP CỬA ${phoneState.memo} ➔ THUA (0đ)`;
            }
          }

          // Show Receipt Screen
          if (screenForm) screenForm.style.display = 'none';
          if (screenReceipt) screenReceipt.classList.add('is-active');

          playTone(400, 'sine', 0.1);

          // Trigger Immediate Debit Notification (Biến động số dư trừ tiền cược & hiện số dư còn lại)
          const nowTx = new Date();
          const timeShortTx = `${String(nowTx.getHours()).padStart(2, '0')}:${String(nowTx.getMinutes()).padStart(2, '0')}`;
          triggerPhoneNotification({
            type: 'debit',
            iconHtml: '<i class="fa-solid fa-arrow-up-right-from-square" style="color: #f87171;"></i>',
            title: `<span style="color: #f87171; font-weight: 800;">MBBank Biến động số dư (-${phoneState.amount.toLocaleString('vi-VN')} VND)</span>`,
            body: `TK 0971266012 | GD: -${phoneState.amount.toLocaleString('vi-VN')} VND lúc ${timeShortTx} | <strong>Số dư: ${phoneState.balance.toLocaleString('vi-VN')} VND</strong> | ND: ${phoneState.memo} GD ${fullTxCode}`,
            duration: 3200
          });

          // Inject into Website's "LỊCH SỬ CHƠI" Table
          const historyTable = document.getElementById('my-history-rows');
          if (historyTable) {
            const newRow = document.createElement('tr');
            newRow.style.backgroundColor = isWin ? 'rgba(40, 167, 69, 0.25)' : 'rgba(220, 53, 69, 0.15)';
            newRow.style.transition = 'background-color 1.5s ease';

            const gameTag = ['C', 'L', 'C2', 'L2'].includes(phoneState.memo) ? 'CL' : 'TX';
            newRow.innerHTML = `
              <td><span class="badge-game-mode">${gameTag}</span></td>
              <td><span class="badge-bet-choice">${phoneState.memo}</span></td>
              <td>${phoneState.amount.toLocaleString('vi-VN')}</td>
              <td><strong style="color: ${isWin ? '#4ade80' : '#888'};">${isWin ? payoutAmount.toLocaleString('vi-VN') : '0'}</strong></td>
              <td><span class="${isWin ? 'badge-result-win' : 'badge-result-lose'}">${isWin ? 'WIN' : 'LOSE'}</span></td>
              <td><code>***${fullTxCode.slice(-4)}</code></td>
              <td><span class="badge-tail-digit">${lastDigit}</span></td>
              <td>${formatTimeNow()}</td>
            `;
            historyTable.insertBefore(newRow, historyTable.firstChild);
            setTimeout(() => { newRow.style.backgroundColor = ''; }, 1400);
          }

          // Step 3: Trigger Real-time Payout Dropdown Notification on Phone (after 3.5s)
          setTimeout(() => {
            if (isWin) {
              phoneState.balance += payoutAmount;
              if (balEl) balEl.textContent = `${phoneState.balance.toLocaleString('vi-VN')}đ`;

              const nowWin = new Date();
              const timeShortWin = `${String(nowWin.getHours()).padStart(2, '0')}:${String(nowWin.getMinutes()).padStart(2, '0')}`;

              triggerPhoneNotification({
                type: 'credit',
                iconHtml: '<i class="fa-solid fa-circle-check" style="color: #4ade80;"></i>',
                title: `<span style="color: #4ade80; font-weight: 800;">MBBank Biến động số dư (+${payoutAmount.toLocaleString('vi-VN')} VND)</span>`,
                body: `TK 0971266012 | GD: +${payoutAmount.toLocaleString('vi-VN')} VND lúc ${timeShortWin} | <strong>Số dư: ${phoneState.balance.toLocaleString('vi-VN')} VND</strong> | ND: TRUM.TOP TRA THUONG GD ${fullTxCode}`,
                duration: 5000
              });

              playChime(true);
              showToast(`🎉 Trúng thưởng +${payoutAmount.toLocaleString('vi-VN')}đ đã thanh toán 5s! Số dư: ${phoneState.balance.toLocaleString('vi-VN')}đ`, 'success');
            } else {
              // LOSE: Hiển thị thông báo khi mất tiền cược kèm số dư hiện tại
              const nowLose = new Date();
              const timeShortLose = `${String(nowLose.getHours()).padStart(2, '0')}:${String(nowLose.getMinutes()).padStart(2, '0')}`;

              triggerPhoneNotification({
                type: 'lose',
                iconHtml: '<i class="fa-solid fa-triangle-exclamation" style="color: #ef4444;"></i>',
                title: `<span style="color: #ef4444; font-weight: 800;">TRUM.TOP Kết quả cược (Thua cược)</span>`,
                body: `GD ${fullTxCode} số đuôi [${lastDigit}] không khớp cửa [${phoneState.memo}]. Mất: -${phoneState.amount.toLocaleString('vi-VN')} VND | <strong>Số dư: ${phoneState.balance.toLocaleString('vi-VN')} VND</strong>`,
                duration: 5000
              });

              playChime(false);
              showToast(`❌ Thua cược! Số cuối ${lastDigit} không khớp ${phoneState.memo} (-${phoneState.amount.toLocaleString('vi-VN')}đ) | Số dư: ${phoneState.balance.toLocaleString('vi-VN')}đ`, 'danger');
            }
          }, 3500);

        }, 900);
      });
    }

    // Button "Chơi tiếp"
    const btnNewTransfer = document.getElementById('btn-phone-new-transfer');
    if (btnNewTransfer) {
      btnNewTransfer.addEventListener('click', () => {
        if (screenReceipt) screenReceipt.classList.remove('is-active');
        if (screenForm) screenForm.style.display = 'flex';
        playTone(500, 'sine', 0.08);
      });
    }

    // Button "Hoàn tất"
    const btnCloseReceipt = document.getElementById('btn-phone-close-receipt');
    if (btnCloseReceipt) {
      btnCloseReceipt.addEventListener('click', () => {
        if (screenReceipt) screenReceipt.classList.remove('is-active');
        if (screenForm) screenForm.style.display = 'flex';
        togglePhone(false);
      });
    }

    // Escape closes modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeQrModal();
        toggleDs(false);
        togglePhone(false);
      }
    });
  }

  // Initialization
  function init() {
    initListeners();
    // Periodically stream new winning transactions
    setInterval(streamNewBigWinner, 4200);
    console.log('%cTRUM.TOP Engine Active with Fake Phone Simulator', 'color: #ffb703; font-weight: bold; font-size: 14px;');
  }

  return {
    init,
    openQrModal,
    closeQrModal,
    setGameMode,
    copyText
  };
})();

// Boot on DOM ready
document.addEventListener('DOMContentLoaded', App.init);

