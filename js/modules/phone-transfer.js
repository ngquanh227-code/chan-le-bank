/**
 * Module: Phone Transfer & Betting Simulator
 * Manages MBBank transfer screen (Image 2 replica), Face ID verification,
 * dynamic transaction receipt generation, win/loss calculation, and payout notifications.
 */
(function() {
  'use strict';
  window.CLB = window.CLB || {};

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

  // Switch game category inside Phone Simulator and render betting memo chips
  function setPhoneGameMode(modeKey, targetMemo) {
    const phoneState = (window.CLB.phone && window.CLB.phone.phoneState) ? window.CLB.phone.phoneState : {};
    const pills = document.querySelectorAll('.phone-mode-pill');
    pills.forEach(p => p.classList.toggle('active', p.getAttribute('data-cat') === modeKey));

    const chipsContainer = document.getElementById('phone-memo-chips');
    if (!chipsContainer) return;

    let chipItems = [];
    if (modeKey === 'cltx2') {
      chipItems = [
        { memo: 'Dungdz TC', label: 'Chẵn (TC) • x1.95' },
        { memo: 'Dungdz TL', label: 'Lẻ (TL) • x1.95' },
        { memo: 'Dungdz TT', label: 'Tài (TT) • x1.95' },
        { memo: 'Dungdz TX', label: 'Xỉu (TX) • x1.95' }
      ];
    } else if (modeKey === 'cltx') {
      chipItems = [
        { memo: 'Dungdz C', label: 'Chẵn (C) • x2.4' },
        { memo: 'Dungdz L', label: 'Lẻ (L) • x2.4' },
        { memo: 'Dungdz T', label: 'Tài (T) • x2.4' },
        { memo: 'Dungdz X', label: 'Xỉu (X) • x2.4' }
      ];
    } else if (modeKey === 'tx') {
      chipItems = [
        { memo: 'Dungdz T', label: 'Tài (T) • x2.4' },
        { memo: 'Dungdz X', label: 'Xỉu (X) • x2.4' }
      ];
    } else if (modeKey === '1p3') {
      chipItems = [
        { memo: 'Dungdz N1', label: 'Nhóm 1 (1-5-7) • x3' },
        { memo: 'Dungdz N2', label: 'Nhóm 2 (2-4-8) • x3' },
        { memo: 'Dungdz N3', label: 'Nhóm 3 (3-6-9) • x3' }
      ];
    } else if (modeKey === 'xien') {
      chipItems = [
        { memo: 'Dungdz CX', label: 'Chẵn Xỉu (CX) • x3' },
        { memo: 'Dungdz LT', label: 'Lẻ Tài (LT) • x3' },
        { memo: 'Dungdz CT', label: 'Chẵn Tài (CT) • x3.5' },
        { memo: 'Dungdz LX', label: 'Lẻ Xỉu (LX) • x3.5' }
      ];
    } else if (modeKey === 'doanso') {
      chipItems = [
        { memo: 'Dungdz 0', label: 'Số 0 • x7' },
        { memo: 'Dungdz 1', label: 'Số 1 • x7' },
        { memo: 'Dungdz 2', label: 'Số 2 • x7' },
        { memo: 'Dungdz 3', label: 'Số 3 • x7' },
        { memo: 'Dungdz 4', label: 'Số 4 • x7' },
        { memo: 'Dungdz 5', label: 'Số 5 • x7' },
        { memo: 'Dungdz 6', label: 'Số 6 • x7' },
        { memo: 'Dungdz 7', label: 'Số 7 • x7' },
        { memo: 'Dungdz 8', label: 'Số 8 • x7' },
        { memo: 'Dungdz 9', label: 'Số 9 • x7' }
      ];
    } else if (modeKey === 'tong3') {
      chipItems = [
        { memo: 'Dungdz S1', label: 'Nhóm 1-9 • x3.5' },
        { memo: 'Dungdz S2', label: 'Nhóm 10-18 • x3.5' },
        { memo: 'Dungdz S3', label: 'Nhóm 19-27 • x3.5' },
        { memo: 'Dungdz C3', label: 'Chẵn 3 • x2.4' },
        { memo: 'Dungdz L3', label: 'Lẻ 3 • x2.4' },
        { memo: 'Dungdz T3', label: 'Tài 3 • x2.4' },
        { memo: 'Dungdz X3', label: 'Xỉu 3 • x2.4' }
      ];
    } else {
      chipItems = [
        { memo: 'Dungdz C', label: 'Chẵn (C) • x2.4' },
        { memo: 'Dungdz L', label: 'Lẻ (L) • x2.4' },
        { memo: 'Dungdz T', label: 'Tài (T) • x2.4' },
        { memo: 'Dungdz X', label: 'Xỉu (X) • x2.4' }
      ];
    }

    const activeIndex = targetMemo
      ? Math.max(0, chipItems.findIndex(c => c.memo === targetMemo))
      : 0;

    chipsContainer.innerHTML = chipItems.map((c, i) => `
      <div class="fake-memo-chip ${i === activeIndex ? 'active' : ''}" role="button" tabindex="0" data-memo="${c.memo}">${c.label}</div>
    `).join('');

    phoneState.memo = chipItems[activeIndex].memo;
    const disp = document.getElementById('phone-memo-display');
    if (disp) disp.textContent = phoneState.memo;

    // Attach click listeners to newly created chips
    chipsContainer.querySelectorAll('.fake-memo-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        chipsContainer.querySelectorAll('.fake-memo-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const memo = chip.getAttribute('data-memo');
        phoneState.memo = memo;
        if (disp) disp.textContent = memo;
        if (window.CLB.audio) window.CLB.audio.playTone(580, 'sine', 0.05);
      });
    });
  }

  function initTransferListeners() {
    const phoneState = (window.CLB.phone && window.CLB.phone.phoneState) ? window.CLB.phone.phoneState : { balance: 10000000, amount: 50000, memo: 'Dungdz TC' };
    const syncBalanceUI = window.CLB.phone ? window.CLB.phone.syncBalanceUI : () => {};
    const showPhoneScreen = window.CLB.phone ? window.CLB.phone.showPhoneScreen : () => {};
    const triggerPhoneNotification = window.CLB.phone ? window.CLB.phone.triggerPhoneNotification : () => {};

    const btnHomeOpenTransfer = document.getElementById('btn-home-open-transfer');
    const btnHomeOpenQr = document.getElementById('btn-home-open-qr');
    const btnToggleEye = document.getElementById('btn-toggle-eye-balance');
    const btnHomeQuickTopup = document.getElementById('btn-home-quick-topup');
    const btnFormBackHome = document.getElementById('btn-form-back-home');
    const btnTransferBottomBack = document.getElementById('btn-transfer-bottom-back');
    const btnClearMemo = document.getElementById('btn-clear-memo');
    const btnChatSave = document.getElementById('btn-chat-save');
    const topupPanel = document.getElementById('phone-topup-panel');
    const btnToggleTopup = document.getElementById('btn-toggle-topup');
    const faceidOverlay = document.getElementById('phone-faceid-overlay');

    if (btnToggleEye && window.CLB.phone) {
      btnToggleEye.addEventListener('click', () => window.CLB.phone.toggleEyeBalance());
    }

    if (btnHomeOpenTransfer) {
      btnHomeOpenTransfer.addEventListener('click', () => {
        showPhoneScreen('form');
        if (window.CLB.audio) window.CLB.audio.playTone(520, 'sine', 0.06);
      });
    }

    if (btnHomeOpenQr) {
      btnHomeOpenQr.addEventListener('click', () => {
        showPhoneScreen('qr');
        if (window.CLB.audio) window.CLB.audio.playTone(520, 'sine', 0.06);
      });
    }

    if (btnHomeQuickTopup) {
      btnHomeQuickTopup.addEventListener('click', () => {
        showPhoneScreen('form');
        if (topupPanel) topupPanel.classList.add('is-open');
        if (window.CLB.audio) window.CLB.audio.playTone(520, 'sine', 0.06);
      });
    }

    if (btnFormBackHome) {
      btnFormBackHome.addEventListener('click', () => {
        showPhoneScreen('home');
        if (window.CLB.audio) window.CLB.audio.playTone(480, 'sine', 0.06);
      });
    }

    if (btnTransferBottomBack) {
      btnTransferBottomBack.addEventListener('click', () => {
        showPhoneScreen('home');
        if (window.CLB.audio) window.CLB.audio.playTone(480, 'sine', 0.06);
      });
    }

    if (btnClearMemo) {
      btnClearMemo.addEventListener('click', () => {
        phoneState.memo = '';
        const memoDisp = document.getElementById('phone-memo-display');
        if (memoDisp) memoDisp.textContent = '(Chưa có nội dung)';
        if (window.CLB.audio) window.CLB.audio.playTone(400, 'sine', 0.05);
      });
    }

    if (btnChatSave) {
      btnChatSave.addEventListener('click', () => {
        if (window.CLB.toast) window.CLB.toast.showToast('Đã lưu tài khoản người nhận vào Money Chat!', 'success');
        if (window.CLB.audio) window.CLB.audio.playTone(580, 'sine', 0.06);
      });
    }

    // Quick transfer amount chips
    document.querySelectorAll('.fake-chip-btn').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.fake-chip-btn').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const amt = parseInt(chip.getAttribute('data-amount'), 10);
        phoneState.amount = amt;
        const amtDisp = document.getElementById('phone-amount-display-num');
        if (amtDisp) amtDisp.textContent = amt.toLocaleString('vi-VN');
        if (window.CLB.audio) window.CLB.audio.playTone(520, 'sine', 0.05);
      });
    });

    // Delegated Phone Game Mode Pills Selection
    const pillsContainer = document.getElementById('phone-game-pills');
    if (pillsContainer) {
      pillsContainer.addEventListener('click', (e) => {
        const pill = e.target.closest('.phone-mode-pill');
        if (pill) {
          const catKey = pill.getAttribute('data-cat');
          setPhoneGameMode(catKey);
          if (window.CLB.audio) window.CLB.audio.playTone(500, 'sine', 0.06);
        }
      });
    }

    // Top-Up & Balance Adjustment Listeners
    if (btnToggleTopup && topupPanel) {
      btnToggleTopup.addEventListener('click', () => {
        topupPanel.classList.toggle('is-open');
        if (window.CLB.audio) window.CLB.audio.playTone(480, 'sine', 0.06);
      });
    }

    // Top-up Chip Buttons
    document.querySelectorAll('.topup-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const topupVal = btn.getAttribute('data-topup');
        if (!topupVal) return;

        if (topupVal === 'reset') {
          phoneState.balance = 10000000;
          if (window.CLB.toast) window.CLB.toast.showToast('Đã khôi phục số dư MB về 10,000,000đ!', 'success');
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
            if (window.CLB.toast) window.CLB.toast.showToast(`Đã nạp +${addAmount.toLocaleString('vi-VN')}đ vào tài khoản nguồn MBBank!`, 'success');
            triggerPhoneNotification({
              type: 'topup',
              iconHtml: '<i class="fa-solid fa-wallet" style="color: #4ade80;"></i>',
              title: `<span style="color: #4ade80; font-weight: 800;">MBBank Nạp tiền nguồn (+${(addAmount >= 1000000 ? (addAmount/1000000)+'M' : (addAmount/1000)+'k')})</span>`,
              body: `TK 0971266012 | Nạp: +${addAmount.toLocaleString('vi-VN')} VND | <strong>Số dư khả dụng: ${phoneState.balance.toLocaleString('vi-VN')} VND</strong>`,
              duration: 3500
            });
          }
        }

        syncBalanceUI();

        if (window.CLB.audio) {
          window.CLB.audio.playTone(523, 'triangle', 0.08, 0.03);
          setTimeout(() => window.CLB.audio.playTone(659, 'triangle', 0.1, 0.03), 70);
          setTimeout(() => window.CLB.audio.playTone(784, 'sine', 0.16, 0.04), 140);
        }
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
            syncBalanceUI();
            if (window.CLB.toast) window.CLB.toast.showToast(`Đã thiết lập số dư MB thành công: ${phoneState.balance.toLocaleString('vi-VN')}đ`, 'success');
            triggerPhoneNotification({
              type: 'topup',
              iconHtml: '<i class="fa-solid fa-pen-to-square" style="color: #38bdf8;"></i>',
              title: '<span style="color: #38bdf8; font-weight: 800;">MBBank Cập nhật số dư tùy chỉnh</span>',
              body: `TK 0971266012 | <strong>Số dư khả dụng mới: ${phoneState.balance.toLocaleString('vi-VN')} VND</strong>`,
              duration: 3500
            });
            if (window.CLB.audio) {
              window.CLB.audio.playTone(587, 'sine', 0.1);
              setTimeout(() => window.CLB.audio.playTone(880, 'sine', 0.18), 90);
            }
          } else {
            if (window.CLB.toast) window.CLB.toast.showToast('Số tiền nhập không hợp lệ!', 'warning');
          }
        }
      });
    }

    // Receipt Quick Top-up Button
    const btnReceiptTopup = document.getElementById('btn-receipt-quick-topup');
    if (btnReceiptTopup) {
      btnReceiptTopup.addEventListener('click', () => {
        showPhoneScreen('form');
        if (topupPanel) topupPanel.classList.add('is-open');
        if (window.CLB.audio) window.CLB.audio.playTone(520, 'sine', 0.08);
      });
    }

    // Submit Fake Transfer
    const btnSubmitTransfer = document.getElementById('btn-phone-submit-transfer') || document.getElementById('btn-fake-transfer-confirm');
    if (btnSubmitTransfer) {
      btnSubmitTransfer.addEventListener('click', () => {
        if (phoneState.balance < phoneState.amount) {
          if (topupPanel) topupPanel.classList.add('is-open');
          if (window.CLB.toast) window.CLB.toast.showToast('Số dư MB không đủ để chuyển! Vui lòng nạp thêm tiền bên dưới.', 'danger');
          if (window.CLB.audio) window.CLB.audio.playTone(240, 'sawtooth', 0.2);
          return;
        }

        // Deduct balance
        phoneState.balance -= phoneState.amount;
        syncBalanceUI();

        // Sound: Transfer initiate
        if (window.CLB.audio) window.CLB.audio.playTone(350, 'triangle', 0.12, 0.06);

        // Step 1: Show FaceID Scanning
        if (faceidOverlay) faceidOverlay.classList.add('is-active');
        if (window.CLB.audio) setTimeout(() => window.CLB.audio.playTone(600, 'sine', 0.12, 0.05), 350);

        // Step 2: Complete FaceID & Show Receipt
        setTimeout(() => {
          if (faceidOverlay) faceidOverlay.classList.remove('is-active');

          // Generate authentic Fast Transfer FT transaction code (Vietnamese banking standard)
          const randFT = Math.floor(100000000 + Math.random() * 900000000);
          const fullTxCode = `FT26${randFT}`;
          const lastDigit = randFT % 10;
          const secondLastDigit = Math.floor(randFT / 10) % 10;
          const thirdLastDigit = Math.floor(randFT / 100) % 10;
          const sumLast2 = (lastDigit + secondLastDigit) % 10;
          const sumLast3 = lastDigit + secondLastDigit + thirdLastDigit;

          // Determine WIN / LOSE based on player's chosen memo
          let isWin = false;
          let rate = 1.95;
          let calcExplain = '';
          const memoClean = (phoneState.memo || '').toUpperCase().replace(/^DUNGDZ\s+/, '').trim();

          // 1. CLTX+2 (Cộng 2 số cuối: TC, TL, TT, TX)
          if (memoClean === 'TC') {
            isWin = [0, 2, 4, 6, 8].includes(sumLast2);
            rate = phoneState.amount >= 1000000 ? 1.85 : (phoneState.amount >= 50000 ? 1.90 : 1.95);
            calcExplain = `Tổng 2 số cuối: ${secondLastDigit}+${lastDigit}=${secondLastDigit + lastDigit} (Đuôi: ${sumLast2}) [Chẵn]`;
          } else if (memoClean === 'TL') {
            isWin = [1, 3, 5, 7, 9].includes(sumLast2);
            rate = phoneState.amount >= 1000000 ? 1.85 : (phoneState.amount >= 50000 ? 1.90 : 1.95);
            calcExplain = `Tổng 2 số cuối: ${secondLastDigit}+${lastDigit}=${secondLastDigit + lastDigit} (Đuôi: ${sumLast2}) [Lẻ]`;
          } else if (memoClean === 'TT') {
            isWin = [5, 6, 7, 8, 9].includes(sumLast2);
            rate = phoneState.amount >= 1000000 ? 1.85 : (phoneState.amount >= 50000 ? 1.90 : 1.95);
            calcExplain = `Tổng 2 số cuối: ${secondLastDigit}+${lastDigit}=${secondLastDigit + lastDigit} (Đuôi: ${sumLast2}) [Tài]`;
          } else if (memoClean === 'TX') {
            isWin = [0, 1, 2, 3, 4].includes(sumLast2);
            rate = phoneState.amount >= 1000000 ? 1.85 : (phoneState.amount >= 50000 ? 1.90 : 1.95);
            calcExplain = `Tổng 2 số cuối: ${secondLastDigit}+${lastDigit}=${secondLastDigit + lastDigit} (Đuôi: ${sumLast2}) [Xỉu]`;
          }
          // 2. 1 PHẦN 3 (N1, N2, N3)
          else if (memoClean === 'N1') {
            isWin = [1, 5, 7].includes(lastDigit);
            rate = 3.0;
            calcExplain = `Số cuối: [${lastDigit}] khớp N1 (1, 5, 7)`;
          } else if (memoClean === 'N2') {
            isWin = [2, 4, 8].includes(lastDigit);
            rate = 3.0;
            calcExplain = `Số cuối: [${lastDigit}] khớp N2 (2, 4, 8)`;
          } else if (memoClean === 'N3') {
            isWin = [3, 6, 9].includes(lastDigit);
            rate = 3.0;
            calcExplain = `Số cuối: [${lastDigit}] khớp N3 (3, 6, 9)`;
          }
          // 3. XIÊN SỐ (Tổng 2 số cuối: CX, LT, CT, LX)
          else if (memoClean === 'CX') {
            isWin = [0, 2, 4].includes(sumLast2);
            rate = 3.0;
            calcExplain = `Tổng 2 số cuối: ${secondLastDigit}+${lastDigit}=${secondLastDigit + lastDigit} (Đuôi: ${sumLast2}) khớp CX (0, 2, 4)`;
          } else if (memoClean === 'LT') {
            isWin = [5, 7, 9].includes(sumLast2);
            rate = 3.0;
            calcExplain = `Tổng 2 số cuối: ${secondLastDigit}+${lastDigit}=${secondLastDigit + lastDigit} (Đuôi: ${sumLast2}) khớp LT (5, 7, 9)`;
          } else if (memoClean === 'CT') {
            isWin = [6, 8].includes(sumLast2);
            rate = 3.5;
            calcExplain = `Tổng 2 số cuối: ${secondLastDigit}+${lastDigit}=${secondLastDigit + lastDigit} (Đuôi: ${sumLast2}) khớp CT (6, 8)`;
          } else if (memoClean === 'LX') {
            isWin = [1, 3].includes(sumLast2);
            rate = 3.5;
            calcExplain = `Tổng 2 số cuối: ${secondLastDigit}+${lastDigit}=${secondLastDigit + lastDigit} (Đuôi: ${sumLast2}) khớp LX (1, 3)`;
          }
          // 4. CLTX & TÀI XỈU (Số cuối: C, L, T, X)
          else if (memoClean === 'C') {
            isWin = [2, 4, 6, 8].includes(lastDigit);
            rate = 2.4;
            calcExplain = `Số cuối: [${lastDigit}] [Chẵn]`;
          } else if (memoClean === 'L') {
            isWin = [1, 3, 5, 7].includes(lastDigit);
            rate = 2.4;
            calcExplain = `Số cuối: [${lastDigit}] [Lẻ]`;
          } else if (memoClean === 'T') {
            isWin = [5, 6, 7, 8].includes(lastDigit);
            rate = 2.4;
            calcExplain = `Số cuối: [${lastDigit}] [Tài]`;
          } else if (memoClean === 'X') {
            isWin = [1, 2, 3, 4].includes(lastDigit);
            rate = 2.4;
            calcExplain = `Số cuối: [${lastDigit}] [Xỉu]`;
          }
          // 5. ĐOÁN SỐ (0 đến 9)
          else if (/^[0-9]$/.test(memoClean)) {
            const betDigit = parseInt(memoClean, 10);
            isWin = (lastDigit === betDigit);
            rate = 7.0;
            calcExplain = `Số cuối: [${lastDigit}] ${isWin ? 'trùng số đoán' : 'không khớp số đoán'} [${betDigit}]`;
          }
          // 6. TỔNG 3 SỐ CUỐI (S1, S2, S3, C3, L3, T3, X3)
          else if (memoClean === 'S1') {
            isWin = (sumLast3 >= 1 && sumLast3 <= 9);
            rate = 3.5;
            calcExplain = `Tổng 3 số cuối: ${thirdLastDigit}+${secondLastDigit}+${lastDigit}=${sumLast3} (Nhóm S1: 1-9)`;
          } else if (memoClean === 'S2') {
            isWin = (sumLast3 >= 10 && sumLast3 <= 18);
            rate = 3.5;
            calcExplain = `Tổng 3 số cuối: ${thirdLastDigit}+${secondLastDigit}+${lastDigit}=${sumLast3} (Nhóm S2: 10-18)`;
          } else if (memoClean === 'S3') {
            isWin = (sumLast3 >= 19 && sumLast3 <= 27);
            rate = 3.5;
            calcExplain = `Tổng 3 số cuối: ${thirdLastDigit}+${secondLastDigit}+${lastDigit}=${sumLast3} (Nhóm S3: 19-27)`;
          } else if (memoClean === 'C3') {
            isWin = (sumLast3 % 2 === 0);
            rate = 2.4;
            calcExplain = `Tổng 3 số cuối: ${thirdLastDigit}+${secondLastDigit}+${lastDigit}=${sumLast3} [Chẵn 3]`;
          } else if (memoClean === 'L3') {
            isWin = (sumLast3 % 2 !== 0);
            rate = 2.4;
            calcExplain = `Tổng 3 số cuối: ${thirdLastDigit}+${secondLastDigit}+${lastDigit}=${sumLast3} [Lẻ 3]`;
          } else if (memoClean === 'T3') {
            isWin = (sumLast3 >= 14);
            rate = 2.4;
            calcExplain = `Tổng 3 số cuối: ${thirdLastDigit}+${secondLastDigit}+${lastDigit}=${sumLast3} [Tài 3]`;
          } else if (memoClean === 'X3') {
            isWin = (sumLast3 < 14);
            rate = 2.4;
            calcExplain = `Tổng 3 số cuối: ${thirdLastDigit}+${secondLastDigit}+${lastDigit}=${sumLast3} [Xỉu 3]`;
          }

          // 10% Chance of Double Payment (Thanh toán 2 lần!)
          let isDoublePayout = false;
          if (isWin && Math.random() < 0.10) {
            isDoublePayout = true;
            rate *= 2;
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

          const isSumGame = ['TC', 'TL', 'TT', 'TX', 'CX', 'LT', 'CT', 'LX'].includes(memoClean);

          const nowTx = new Date();
          const timeShortTx = `${String(nowTx.getHours()).padStart(2, '0')}:${String(nowTx.getMinutes()).padStart(2, '0')}`;
          const dateFormatted = `${String(nowTx.getDate()).padStart(2, '0')}/${String(nowTx.getMonth() + 1).padStart(2, '0')}/${nowTx.getFullYear()}`;

          if (receiptAmountEl) receiptAmountEl.textContent = `${phoneState.amount.toLocaleString('vi-VN')} VND`;
          if (receiptTimeEl) receiptTimeEl.textContent = `${timeShortTx} - ${dateFormatted}`;
          const photoClock = document.getElementById('photo-receipt-clock');
          if (photoClock) photoClock.textContent = timeShortTx;

          if (receiptMemoEl) receiptMemoEl.textContent = phoneState.memo;
          if (receiptTxEl) receiptTxEl.textContent = fullTxCode;
          if (receiptDigitEl) receiptDigitEl.textContent = isSumGame ? sumLast2 : lastDigit;
          if (receiptTailEl) receiptTailEl.textContent = isSumGame ? `${secondLastDigit}+${lastDigit}=${sumLast2}` : lastDigit;
          if (receiptRecipientStk) receiptRecipientStk.textContent = phoneState.recipient ? phoneState.recipient.stk : '0962714685';
          if (receiptRecipientName) receiptRecipientName.textContent = phoneState.recipient ? phoneState.recipient.name : 'NGUYEN VAN PHONG';

          if (receiptMatchEl) {
            if (isWin) {
              receiptMatchEl.style.color = '#15803d';
              receiptMatchEl.textContent = `KHỚP CỬA ${memoClean} ➔ THẮNG (+${payoutAmount.toLocaleString('vi-VN')}đ)${isDoublePayout ? ' [NỔ HŨ X2!]' : ''}`;
            } else {
              receiptMatchEl.style.color = '#dc2626';
              receiptMatchEl.textContent = `${calcExplain} ➔ THUA (-${phoneState.amount.toLocaleString('vi-VN')}đ)`;
            }
          }

          // Show Receipt Screen
          showPhoneScreen('receipt');

          if (window.CLB.audio) window.CLB.audio.playTone(400, 'sine', 0.1);

          // Trigger Immediate Debit Notification
          triggerPhoneNotification({
            type: 'debit',
            iconHtml: '<i class="fa-solid fa-arrow-up-right-from-square" style="color: #dc2626;"></i>',
            title: `<span style="color: #dc2626; font-weight: 800;">MBBank Biến động số dư (-${phoneState.amount.toLocaleString('vi-VN')} VND)</span>`,
            body: `TK 0971266012 | GD: -${phoneState.amount.toLocaleString('vi-VN')} VND lúc ${timeShortTx} | <strong style="color: #0f172a;">Số dư: ${phoneState.balance.toLocaleString('vi-VN')} VND</strong> | ND: ${phoneState.memo} GD ${fullTxCode}`,
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
              syncBalanceUI();

              const nowWin = new Date();
              const timeShortWin = `${String(nowWin.getHours()).padStart(2, '0')}:${String(nowWin.getMinutes()).padStart(2, '0')}`;

              triggerPhoneNotification({
                type: 'credit',
                iconHtml: '<i class="fa-solid fa-circle-check" style="color: #16a34a;"></i>',
                title: `<span style="color: #15803d; font-weight: 800;">MBBank Biến động số dư (+${payoutAmount.toLocaleString('vi-VN')} VND)</span>`,
                body: `TK 0971266012 | GD: +${payoutAmount.toLocaleString('vi-VN')} VND lúc ${timeShortWin} | <strong style="color: #0f172a;">Số dư: ${phoneState.balance.toLocaleString('vi-VN')} VND</strong> | ND: TRUM.TOP TRA THUONG GD ${fullTxCode}`,
                duration: 5000
              });

              if (window.CLB.audio) window.CLB.audio.playChime(true);
              if (window.CLB.toast) window.CLB.toast.showToast(`🎉 Trúng thưởng +${payoutAmount.toLocaleString('vi-VN')}đ đã thanh toán 5s! Số dư: ${phoneState.balance.toLocaleString('vi-VN')}đ`, 'success');
            } else {
              const nowLose = new Date();
              const timeShortLose = `${String(nowLose.getHours()).padStart(2, '0')}:${String(nowLose.getMinutes()).padStart(2, '0')}`;

              triggerPhoneNotification({
                type: 'lose',
                iconHtml: '<i class="fa-solid fa-triangle-exclamation" style="color: #dc2626;"></i>',
                title: `<span style="color: #dc2626; font-weight: 800;">TRUM.TOP Kết quả cược (Thua cược)</span>`,
                body: `GD ${fullTxCode} số đuôi [${lastDigit}] không khớp cửa [${phoneState.memo}]. Mất: -${phoneState.amount.toLocaleString('vi-VN')} VND | <strong style="color: #0f172a;">Số dư: ${phoneState.balance.toLocaleString('vi-VN')} VND</strong>`,
                duration: 5000
              });

              if (window.CLB.audio) window.CLB.audio.playChime(false);
              if (window.CLB.toast) window.CLB.toast.showToast(`❌ Thua cược! Số cuối ${lastDigit} không khớp ${phoneState.memo} (-${phoneState.amount.toLocaleString('vi-VN')}đ) | Số dư: ${phoneState.balance.toLocaleString('vi-VN')}đ`, 'danger');
            }
          }, 3500);

        }, 900);
      });
    }

    // Button "Thực hiện giao dịch khác" -> quay lại màn hình chọn cược
    const btnNewTransfer = document.getElementById('btn-phone-new-transfer');
    if (btnNewTransfer) {
      btnNewTransfer.addEventListener('click', () => {
        showPhoneScreen('form');
        if (window.CLB.audio) window.CLB.audio.playTone(500, 'sine', 0.08);
      });
    }

    // Button "Hoàn tất" (Icon Home góc trên phải) -> quay về màn hình xem số dư chính
    const btnCloseReceipt = document.getElementById('btn-phone-close-receipt');
    if (btnCloseReceipt) {
      btnCloseReceipt.addEventListener('click', () => {
        showPhoneScreen('home');
        if (window.CLB.audio) window.CLB.audio.playTone(480, 'sine', 0.06);
      });
    }
  }

  window.CLB.transfer = {
    setPhoneGameMode,
    initTransferListeners
  };
})();
