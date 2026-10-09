/**
 * Module: Phone Transfer & Betting Simulator
 * Manages authentic MBBank transfer screen (Image 2 replica), manual user memo input,
 * Face ID verification, dynamic transaction receipt generation, win/loss calculation,
 * and realistic notification alerts.
 */
(function() {
  'use strict';
  window.CLB = window.CLB || {};

  function formatMoney(amount) {
    if (amount === undefined || amount === null || isNaN(amount)) return "0";
    return Number(amount).toLocaleString("en-US");
  }

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

  // Switch game category inside Phone Simulator and set current betting memo
  function setPhoneGameMode(modeKey, targetMemo) {
    const phoneState = (window.CLB.phone && window.CLB.phone.phoneState) ? window.CLB.phone.phoneState : {};
    phoneState.gameCategory = modeKey;

    let defaultSyntax = targetMemo;
    if (!defaultSyntax) {
      if (modeKey === 'cltx2') defaultSyntax = 'Dungdz TC';
      else if (modeKey === 'cltx') defaultSyntax = 'Dungdz C';
      else if (modeKey === 'tx') defaultSyntax = 'Dungdz T';
      else if (modeKey === '1p3') defaultSyntax = 'Dungdz N1';
      else if (modeKey === 'xien') defaultSyntax = 'Dungdz CX';
      else if (modeKey === 'doanso') defaultSyntax = 'Dungdz 0';
      else if (modeKey === 'tong3') defaultSyntax = 'Dungdz S1';
      else defaultSyntax = 'Dungdz TC';
    } else if (!/^dungdz\s+/i.test(defaultSyntax)) {
      defaultSyntax = `Dungdz ${defaultSyntax}`;
    }

    phoneState.memo = defaultSyntax;
    const memoInput = document.getElementById('phone-memo-input');
    if (memoInput) memoInput.innerText = defaultSyntax;
    const disp = document.getElementById('phone-memo-display');
    if (disp) disp.textContent = defaultSyntax;
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

    function updateRecipientUI(rec) {
      if (!rec) return;
      phoneState.recipient = { ...rec };
      const bankEl = document.getElementById('phone-bank-name-label');
      const stkEl = document.getElementById('phone-recipient-stk');
      const nameEl = document.getElementById('phone-recipient-name');
      if (bankEl) bankEl.textContent = rec.bank || 'Quân đội (MB)';
      if (stkEl) stkEl.textContent = rec.stk || '';
      if (nameEl) nameEl.textContent = rec.name || '';
    }

    if (btnToggleEye && window.CLB.phone) {
      btnToggleEye.addEventListener('click', () => window.CLB.phone.toggleEyeBalance());
    }

    // 1. Home -> "Chuyển tiền" opens Super Transfer screen (Image 1 replica)
    if (btnHomeOpenTransfer) {
      btnHomeOpenTransfer.addEventListener('click', () => {
        showPhoneScreen('super-transfer');
        if (window.CLB.audio) window.CLB.audio.playTone(520, 'sine', 0.06);
      });
    }

    // 2. Super Transfer Screen Navigation & Actions
    const btnSuperBack = document.getElementById('btn-super-transfer-back');
    const btnSuperHome = document.getElementById('btn-super-transfer-home');
    const btnSuperStk = document.getElementById('btn-super-transfer-stk');
    const btnSuperMbai = document.getElementById('btn-super-transfer-mbai');
    const btnSuperRecent = document.getElementById('btn-super-transfer-recent');
    const btnSuperWallet = document.getElementById('btn-super-transfer-wallet');
    const btnContactDung = document.getElementById('btn-super-contact-dung') || document.getElementById('btn-super-contact-luong');
    const btnContactFather = document.getElementById('btn-super-contact-father');
    const btnContactHung = document.getElementById('btn-super-contact-hung');
    const btnContactLuong2 = document.getElementById('btn-super-contact-luong2');

    if (btnSuperBack) {
      btnSuperBack.addEventListener('click', () => {
        showPhoneScreen('home');
        if (window.CLB.audio) window.CLB.audio.playTone(480, 'sine', 0.06);
      });
    }

    if (btnSuperHome) {
      btnSuperHome.addEventListener('click', () => {
        showPhoneScreen('home');
        if (window.CLB.audio) window.CLB.audio.playTone(480, 'sine', 0.06);
      });
    }

    if (btnSuperStk) {
      btnSuperStk.addEventListener('click', () => {
        updateRecipientUI({ name: 'NGUYEN TUAN DUNG', stk: '0644888866', bank: 'Quân đội (MB)' });
        showPhoneScreen('form');
        if (window.CLB.audio) window.CLB.audio.playTone(540, 'sine', 0.06);
      });
    }

    if (btnSuperMbai) {
      btnSuperMbai.addEventListener('click', () => {
        updateRecipientUI({ name: 'NGUYEN TUAN DUNG', stk: '0644888866', bank: 'Quân đội (MB)' });
        showPhoneScreen('form');
        if (window.CLB.audio) window.CLB.audio.playTone(520, 'sine', 0.06);
      });
    }

    if (btnSuperRecent) {
      btnSuperRecent.addEventListener('click', () => {
        updateRecipientUI({ name: 'NGUYEN TUAN DUNG', stk: '0644888866', bank: 'Quân đội (MB)' });
        showPhoneScreen('form');
        if (window.CLB.audio) window.CLB.audio.playTone(520, 'sine', 0.06);
      });
    }

    if (btnSuperWallet) {
      btnSuperWallet.addEventListener('click', () => {
        if (window.CLB.toast) window.CLB.toast.showToast('Ví điện tử liên kết MBBank', 'info');
        if (window.CLB.audio) window.CLB.audio.playTone(520, 'sine', 0.06);
      });
    }

    if (btnContactDung) {
      btnContactDung.addEventListener('click', () => {
        updateRecipientUI({ name: 'NGUYEN TUAN DUNG', stk: '0916508081', bank: 'MBBank (MB)' });
        showPhoneScreen('form');
        if (window.CLB.audio) window.CLB.audio.playTone(540, 'sine', 0.06);
      });
    }

    if (btnContactFather) {
      btnContactFather.addEventListener('click', () => {
        updateRecipientUI({ name: 'FATHER', stk: '5130065858', bank: 'BIDV' });
        showPhoneScreen('form');
        if (window.CLB.audio) window.CLB.audio.playTone(540, 'sine', 0.06);
      });
    }

    if (btnContactHung) {
      btnContactHung.addEventListener('click', () => {
        updateRecipientUI({ name: 'DANG DUY HUNG', stk: '0399152836', bank: 'MBBank (MB)' });
        showPhoneScreen('form');
        if (window.CLB.audio) window.CLB.audio.playTone(540, 'sine', 0.06);
      });
    }

    if (btnContactLuong2) {
      btnContactLuong2.addEventListener('click', () => {
        updateRecipientUI({ name: 'LUONG 2', stk: '8825423642', bank: 'BIDV' });
        showPhoneScreen('form');
        if (window.CLB.audio) window.CLB.audio.playTone(540, 'sine', 0.06);
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

    // 3. Form -> Back goes to Super Transfer
    if (btnFormBackHome) {
      btnFormBackHome.addEventListener('click', () => {
        showPhoneScreen('super-transfer');
        if (window.CLB.audio) window.CLB.audio.playTone(480, 'sine', 0.06);
      });
    }

    if (btnTransferBottomBack) {
      btnTransferBottomBack.addEventListener('click', () => {
        showPhoneScreen('super-transfer');
        if (window.CLB.audio) window.CLB.audio.playTone(480, 'sine', 0.06);
      });
    }

    function setCursorAtEnd(el) {
      if (!el) return;
      try {
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(el);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      } catch (e) {}
    }

    // 1. Direct Manual Memo Typing by User with persistent "Dungdz " prefix
    const memoInput = document.getElementById('phone-memo-input');
    if (memoInput) {
      memoInput.addEventListener('focus', () => {
        let current = (memoInput.innerText || memoInput.textContent || '').trim();
        if (!current || !/^dungdz/i.test(current)) {
          const suffix = current.replace(/^dungdz\s*/i, '').trim();
          const val = suffix ? `Dungdz ${suffix}` : 'Dungdz ';
          memoInput.innerText = val;
          phoneState.memo = val;
        }
        setCursorAtEnd(memoInput);
      });

      memoInput.addEventListener('input', () => {
        let current = memoInput.innerText || memoInput.textContent || '';
        if (!current.trim() || !/^dungdz/i.test(current.trim())) {
          const suffix = current.replace(/^dungdz\s*/i, '').trim();
          current = suffix ? `Dungdz ${suffix}` : 'Dungdz ';
          memoInput.innerText = current;
          setCursorAtEnd(memoInput);
        }
        phoneState.memo = current.trim();
        const disp = document.getElementById('phone-memo-display');
        if (disp) disp.textContent = phoneState.memo;
      });

      memoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          memoInput.blur();
        }
      });
    }

    // 2. Clear Memo Button: Resets to "Dungdz " ready for user to type just the door code
    if (btnClearMemo) {
      btnClearMemo.addEventListener('click', () => {
        phoneState.memo = 'Dungdz ';
        if (memoInput) {
          memoInput.innerText = 'Dungdz ';
          memoInput.focus();
          setCursorAtEnd(memoInput);
        }
        const disp = document.getElementById('phone-memo-display');
        if (disp) disp.textContent = 'Dungdz ';
        if (window.CLB.audio) window.CLB.audio.playTone(400, 'sine', 0.05);
      });
    }

    if (btnChatSave) {
      btnChatSave.addEventListener('click', () => {
        if (window.CLB.toast) window.CLB.toast.showToast('Đã lưu tài khoản người nhận vào Money Chat!', 'success');
        if (window.CLB.audio) window.CLB.audio.playTone(580, 'sine', 0.06);
      });
    }

    // 3. Amount Display Manual Input & Quick Chips
    const amtInput = document.getElementById('phone-amount-display-num');
    if (amtInput) {
      amtInput.addEventListener('input', () => {
        const raw = amtInput.innerText.replace(/[^\d]/g, '');
        const parsed = parseInt(raw, 10) || 0;
        phoneState.amount = parsed;
      });
      amtInput.addEventListener('blur', () => {
        if (phoneState.amount > 0) {
          amtInput.innerText = formatMoney(phoneState.amount);
        } else {
          amtInput.innerText = '0';
        }
      });
      amtInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          amtInput.blur();
        }
      });
    }

    document.querySelectorAll('.fake-chip-btn').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.fake-chip-btn').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const amt = parseInt(chip.getAttribute('data-amount'), 10);
        phoneState.amount = amt;
        if (amtInput) amtInput.innerText = formatMoney(amt);
        if (window.CLB.audio) window.CLB.audio.playTone(520, 'sine', 0.05);
      });
    });

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

        const notiDate = window.CLB.phone && window.CLB.phone.formatMbNotiDate ? window.CLB.phone.formatMbNotiDate() : '09/10/26 22:04';
        if (topupVal === 'reset') {
          phoneState.balance = 10000000;
          if (window.CLB.toast) window.CLB.toast.showToast('Đã khôi phục số dư MB về 10,000,000đ!', 'success');
          triggerPhoneNotification({
            type: 'topup',
            title: 'Thông báo biến động số dư',
            time: 'Vừa xong',
            body: `TK 09xxx081|GD: +10,000,000VND ${notiDate} |SD: ${formatMoney(phoneState.balance)}VND|ND: MBBank khoi phuc so du goc`,
            duration: 4500
          });
        } else {
          const addAmount = parseInt(topupVal, 10);
          if (!isNaN(addAmount)) {
            phoneState.balance += addAmount;
            if (window.CLB.toast) window.CLB.toast.showToast(`Đã nạp +${formatMoney(addAmount)}đ vào tài khoản nguồn MBBank!`, 'success');
            triggerPhoneNotification({
              type: 'topup',
              title: 'Thông báo biến động số dư',
              time: 'Vừa xong',
              body: `TK 09xxx081|GD: +${formatMoney(addAmount)}VND ${notiDate} |SD: ${formatMoney(phoneState.balance)}VND|ND: Nguon tien MBBank nap vao`,
              duration: 4500
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
            const notiDate = window.CLB.phone && window.CLB.phone.formatMbNotiDate ? window.CLB.phone.formatMbNotiDate() : '09/10/26 22:04';
            if (window.CLB.toast) window.CLB.toast.showToast(`Đã thiết lập số dư MB thành công: ${formatMoney(phoneState.balance)}đ`, 'success');
            triggerPhoneNotification({
              type: 'topup',
              title: 'Thông báo biến động số dư',
              time: 'Vừa xong',
              body: `TK 09xxx081|GD: Cap nhat ${notiDate} |SD: ${formatMoney(phoneState.balance)}VND|ND: Thiet lap so du tuy chinh`,
              duration: 4500
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
        if (memoInput) {
          const currentTyped = (memoInput.innerText || memoInput.textContent || '').trim();
          if (currentTyped) phoneState.memo = currentTyped;
        }

        const rawMemo = (phoneState.memo || '').trim();
        if (!rawMemo || /^dungdz\s*$/i.test(rawMemo)) {
          if (window.CLB.toast) window.CLB.toast.showToast('Vui lòng nhập cửa cược sau Dungdz (VD: Dungdz T, Dungdz X, Dungdz TT, Dungdz TC, ...)!', 'warning');
          if (memoInput) {
            memoInput.focus();
            setCursorAtEnd(memoInput);
          }
          return;
        }

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

          // Determine WIN / LOSE strictly requiring prefix "Dungdz" + valid door key
          let isWin = false;
          let rate = 1.95;
          let calcExplain = '';
          let isValidSyntax = false;

          const hasDungdzPrefix = /^dungdz\s+/i.test(rawMemo);
          const memoClean = hasDungdzPrefix ? rawMemo.replace(/^dungdz\s+/i, '').trim().toUpperCase() : '';

          if (hasDungdzPrefix && memoClean) {
            // 1. CLTX+2 (Cộng 2 số cuối: TC, TL, TT, TX)
            if (memoClean === 'TC') {
              isValidSyntax = true;
              isWin = [0, 2, 4, 6, 8].includes(sumLast2);
              rate = phoneState.amount >= 1000000 ? 1.85 : (phoneState.amount >= 50000 ? 1.90 : 1.95);
              calcExplain = `Tổng 2 số cuối: ${secondLastDigit}+${lastDigit}=${secondLastDigit + lastDigit} (Đuôi: ${sumLast2}) [Chẵn]`;
            } else if (memoClean === 'TL') {
              isValidSyntax = true;
              isWin = [1, 3, 5, 7, 9].includes(sumLast2);
              rate = phoneState.amount >= 1000000 ? 1.85 : (phoneState.amount >= 50000 ? 1.90 : 1.95);
              calcExplain = `Tổng 2 số cuối: ${secondLastDigit}+${lastDigit}=${secondLastDigit + lastDigit} (Đuôi: ${sumLast2}) [Lẻ]`;
            } else if (memoClean === 'TT') {
              isValidSyntax = true;
              isWin = [5, 6, 7, 8, 9].includes(sumLast2);
              rate = phoneState.amount >= 1000000 ? 1.85 : (phoneState.amount >= 50000 ? 1.90 : 1.95);
              calcExplain = `Tổng 2 số cuối: ${secondLastDigit}+${lastDigit}=${secondLastDigit + lastDigit} (Đuôi: ${sumLast2}) [Tài]`;
            } else if (memoClean === 'TX') {
              isValidSyntax = true;
              isWin = [0, 1, 2, 3, 4].includes(sumLast2);
              rate = phoneState.amount >= 1000000 ? 1.85 : (phoneState.amount >= 50000 ? 1.90 : 1.95);
              calcExplain = `Tổng 2 số cuối: ${secondLastDigit}+${lastDigit}=${secondLastDigit + lastDigit} (Đuôi: ${sumLast2}) [Xỉu]`;
            }
            // 2. 1 PHẦN 3 (N1, N2, N3)
            else if (memoClean === 'N1') {
              isValidSyntax = true;
              isWin = [1, 5, 7].includes(lastDigit);
              rate = 3.0;
              calcExplain = `Số cuối: [${lastDigit}] khớp N1 (1, 5, 7)`;
            } else if (memoClean === 'N2') {
              isValidSyntax = true;
              isWin = [2, 4, 8].includes(lastDigit);
              rate = 3.0;
              calcExplain = `Số cuối: [${lastDigit}] khớp N2 (2, 4, 8)`;
            } else if (memoClean === 'N3') {
              isValidSyntax = true;
              isWin = [3, 6, 9].includes(lastDigit);
              rate = 3.0;
              calcExplain = `Số cuối: [${lastDigit}] khớp N3 (3, 6, 9)`;
            }
            // 3. XIÊN SỐ (Tổng 2 số cuối: CX, LT, CT, LX - Tỉ lệ x 3.5)
            else if (memoClean === 'CX') {
              isValidSyntax = true;
              isWin = [0, 2, 4].includes(sumLast2);
              rate = 3.5;
              calcExplain = `Tổng 2 số cuối: ${secondLastDigit}+${lastDigit}=${secondLastDigit + lastDigit} (Đuôi: ${sumLast2}) khớp CX (0, 2, 4)`;
            } else if (memoClean === 'LT') {
              isValidSyntax = true;
              isWin = [5, 7, 9].includes(sumLast2);
              rate = 3.5;
              calcExplain = `Tổng 2 số cuối: ${secondLastDigit}+${lastDigit}=${secondLastDigit + lastDigit} (Đuôi: ${sumLast2}) khớp LT (5, 7, 9)`;
            } else if (memoClean === 'CT') {
              isValidSyntax = true;
              isWin = [6, 8].includes(sumLast2);
              rate = 3.5;
              calcExplain = `Tổng 2 số cuối: ${secondLastDigit}+${lastDigit}=${secondLastDigit + lastDigit} (Đuôi: ${sumLast2}) khớp CT (6, 8)`;
            } else if (memoClean === 'LX') {
              isValidSyntax = true;
              isWin = [1, 3].includes(sumLast2);
              rate = 3.5;
              calcExplain = `Tổng 2 số cuối: ${secondLastDigit}+${lastDigit}=${secondLastDigit + lastDigit} (Đuôi: ${sumLast2}) khớp LX (1, 3)`;
            }
            // 4. CLTX & TÀI XỈU (Số cuối: C, L, T, X - Dưới 50k ăn 2.68, Từ 50k ăn 2.48)
            else if (memoClean === 'C') {
              isValidSyntax = true;
              isWin = [2, 4, 6, 8].includes(lastDigit);
              rate = phoneState.amount < 50000 ? 2.68 : 2.48;
              calcExplain = `Số cuối: [${lastDigit}] [Chẵn] (Tỉ lệ x${rate})`;
            } else if (memoClean === 'L') {
              isValidSyntax = true;
              isWin = [1, 3, 5, 7].includes(lastDigit);
              rate = phoneState.amount < 50000 ? 2.68 : 2.48;
              calcExplain = `Số cuối: [${lastDigit}] [Lẻ] (Tỉ lệ x${rate})`;
            } else if (memoClean === 'T') {
              isValidSyntax = true;
              isWin = [5, 6, 7, 8].includes(lastDigit);
              rate = phoneState.amount < 50000 ? 2.68 : 2.48;
              calcExplain = `Số cuối: [${lastDigit}] [Tài] (Tỉ lệ x${rate})`;
            } else if (memoClean === 'X') {
              isValidSyntax = true;
              isWin = [1, 2, 3, 4].includes(lastDigit);
              rate = phoneState.amount < 50000 ? 2.68 : 2.48;
              calcExplain = `Số cuối: [${lastDigit}] [Xỉu] (Tỉ lệ x${rate})`;
            }
            // 5. ĐOÁN SỐ (0 đến 9)
            else if (/^[0-9]$/.test(memoClean)) {
              isValidSyntax = true;
              const betDigit = parseInt(memoClean, 10);
              isWin = (lastDigit === betDigit);
              rate = 7.0;
              calcExplain = `Số cuối: [${lastDigit}] ${isWin ? 'trùng số đoán' : 'không khớp số đoán'} [${betDigit}]`;
            }
            // 6. TỔNG 3 SỐ CUỐI (S1, S2, S3, C3, L3, T3, X3)
            else if (memoClean === 'S1') {
              isValidSyntax = true;
              isWin = (sumLast3 >= 1 && sumLast3 <= 9);
              rate = 3.5;
              calcExplain = `Tổng 3 số cuối: ${thirdLastDigit}+${secondLastDigit}+${lastDigit}=${sumLast3} (Nhóm S1: 1-9)`;
            } else if (memoClean === 'S2') {
              isValidSyntax = true;
              isWin = (sumLast3 >= 10 && sumLast3 <= 18);
              rate = 3.5;
              calcExplain = `Tổng 3 số cuối: ${thirdLastDigit}+${secondLastDigit}+${lastDigit}=${sumLast3} (Nhóm S2: 10-18)`;
            } else if (memoClean === 'S3') {
              isValidSyntax = true;
              isWin = (sumLast3 >= 19 && sumLast3 <= 27);
              rate = 3.5;
              calcExplain = `Tổng 3 số cuối: ${thirdLastDigit}+${secondLastDigit}+${lastDigit}=${sumLast3} (Nhóm S3: 19-27)`;
            } else if (memoClean === 'C3') {
              isValidSyntax = true;
              isWin = (sumLast3 % 2 === 0);
              rate = phoneState.amount < 50000 ? 2.68 : 2.48;
              calcExplain = `Tổng 3 số cuối: ${thirdLastDigit}+${secondLastDigit}+${lastDigit}=${sumLast3} [Chẵn 3] (Tỉ lệ x${rate})`;
            } else if (memoClean === 'L3') {
              isValidSyntax = true;
              isWin = (sumLast3 % 2 !== 0);
              rate = phoneState.amount < 50000 ? 2.68 : 2.48;
              calcExplain = `Tổng 3 số cuối: ${thirdLastDigit}+${secondLastDigit}+${lastDigit}=${sumLast3} [Lẻ 3] (Tỉ lệ x${rate})`;
            } else if (memoClean === 'T3') {
              isValidSyntax = true;
              isWin = (sumLast3 >= 14);
              rate = phoneState.amount < 50000 ? 2.68 : 2.48;
              calcExplain = `Tổng 3 số cuối: ${thirdLastDigit}+${secondLastDigit}+${lastDigit}=${sumLast3} [Tài 3] (Tỉ lệ x${rate})`;
            } else if (memoClean === 'X3') {
              isValidSyntax = true;
              isWin = (sumLast3 < 14);
              rate = phoneState.amount < 50000 ? 2.68 : 2.48;
              calcExplain = `Tổng 3 số cuối: ${thirdLastDigit}+${secondLastDigit}+${lastDigit}=${sumLast3} [Xỉu 3] (Tỉ lệ x${rate})`;
            }
          }

          if (!isValidSyntax) {
            isWin = false;
            calcExplain = hasDungdzPrefix
              ? `Cửa cược '${memoClean || 'trống'}' không có trong quy định`
              : `Thiếu tiền tố 'Dungdz' (VD: Dungdz T, Dungdz X, Dungdz TT, ...)`;
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

          if (receiptAmountEl) receiptAmountEl.textContent = `${formatMoney(phoneState.amount)} VND`;
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
            if (!isValidSyntax) {
              receiptMatchEl.style.color = '#dc2626';
              receiptMatchEl.textContent = `SAI CÚ PHÁP: ${calcExplain} ➔ KHÔNG TRẢ THƯỞNG`;
            } else if (isWin) {
              receiptMatchEl.style.color = '#15803d';
              receiptMatchEl.textContent = `KHỚP CỬA ${memoClean} ➔ THẮNG (+${formatMoney(payoutAmount)}đ)${isDoublePayout ? ' [NỔ HŨ X2!]' : ''}`;
            } else {
              receiptMatchEl.style.color = '#dc2626';
              receiptMatchEl.textContent = `${calcExplain} ➔ THUA (-${formatMoney(phoneState.amount)}đ)`;
            }
          }

          // Show Receipt Screen
          showPhoneScreen('receipt');

          if (window.CLB.audio) window.CLB.audio.playTone(400, 'sine', 0.1);

          const notiDate = window.CLB.phone && window.CLB.phone.formatMbNotiDate ? window.CLB.phone.formatMbNotiDate() : '09/10/26 22:04';
          // Trigger Immediate Debit Notification (Authentic MBBank iOS Notification)
          triggerPhoneNotification({
            type: 'debit',
            title: 'Thông báo biến động số dư',
            time: 'Vừa xong',
            body: `TK 09xxx081|GD: -${formatMoney(phoneState.amount)}VND ${notiDate} |SD: ${formatMoney(phoneState.balance)}VND|ND: NGUYEN TUAN DUNG chuyen tien ${phoneState.memo}`,
            duration: 4500
          });

          // Inject into Website's "LỊCH SỬ CHƠI" Table
          const historyTable = document.getElementById('my-history-rows');
          if (historyTable) {
            const newRow = document.createElement('tr');
            newRow.style.backgroundColor = isWin ? 'rgba(40, 167, 69, 0.25)' : 'rgba(220, 53, 69, 0.15)';
            newRow.style.transition = 'background-color 1.5s ease';

            const gameTag = ['C', 'L', 'C2', 'L2'].includes(memoClean) ? 'CL' : 'TX';
            newRow.innerHTML = `
              <td><span class="badge-game-mode">${gameTag}</span></td>
              <td><span class="badge-bet-choice">${phoneState.memo}</span></td>
              <td>${formatMoney(phoneState.amount)}</td>
              <td><strong style="color: ${isWin ? '#4ade80' : '#888'};">${isWin ? formatMoney(payoutAmount) : '0'}</strong></td>
              <td><span class="${isWin ? 'badge-result-win' : (isValidSyntax ? 'badge-result-lose' : 'badge-result-lose')}">${isWin ? 'WIN' : (isValidSyntax ? 'LOSE' : 'SAI ND')}</span></td>
              <td><code>***${fullTxCode.slice(-4)}</code></td>
              <td><span class="badge-tail-digit">${lastDigit}</span></td>
              <td>${formatTimeNow()}</td>
            `;
            historyTable.insertBefore(newRow, historyTable.firstChild);
            setTimeout(() => { newRow.style.backgroundColor = ''; }, 1400);
          }

          // Step 3: Trigger Real-time Payout Dropdown Notification on Phone (after 3.5s)
          setTimeout(() => {
            const payoutNotiDate = window.CLB.phone && window.CLB.phone.formatMbNotiDate ? window.CLB.phone.formatMbNotiDate() : '09/10/26 22:04';
            if (isWin) {
              phoneState.balance += payoutAmount;
              syncBalanceUI();

              // Authentic MBBank Credit Notification
              triggerPhoneNotification({
                type: 'credit',
                title: 'Thông báo biến động số dư',
                time: 'Vừa xong',
                body: `TK 09xxx081|GD: +${formatMoney(payoutAmount)}VND ${payoutNotiDate} |SD: ${formatMoney(phoneState.balance)}VND|ND: NGUYEN TUAN DUNG chuyen tien tra thuong ${memoClean}`,
                duration: 6000
              });

              if (window.CLB.audio) window.CLB.audio.playChime(true);
              if (window.CLB.toast) window.CLB.toast.showToast(`🎉 Trúng thưởng +${formatMoney(payoutAmount)}đ đã thanh toán 5s!`, 'success');
            } else if (!isValidSyntax) {
              // Notification when syntax is wrong
              triggerPhoneNotification({
                type: 'debit',
                title: 'Thông báo biến động số dư',
                time: 'Vừa xong',
                body: `TK 09xxx081|GD: 0VND ${payoutNotiDate} |SD: ${formatMoney(phoneState.balance)}VND|ND: Sai cu phap (${phoneState.memo}) khong tra thuong`,
                duration: 4500
              });
              if (window.CLB.audio) window.CLB.audio.playChime(false);
              if (window.CLB.toast) window.CLB.toast.showToast(`Nội dung "${phoneState.memo}" sai cú pháp! Hệ thống không chuyển tiền lại.`, 'warning');
            } else {
              // Normal lose
              triggerPhoneNotification({
                type: 'lose',
                title: 'Thông báo biến động số dư',
                time: 'Vừa xong',
                body: `TK 09xxx081|GD: 0VND ${payoutNotiDate} |SD: ${formatMoney(phoneState.balance)}VND|ND: Khong trung thuong (${lastDigit} khac ${memoClean})`,
                duration: 4500
              });

              if (window.CLB.audio) window.CLB.audio.playChime(false);
              if (window.CLB.toast) window.CLB.toast.showToast(`❌ Thua cược! Số cuối ${lastDigit} không khớp ${phoneState.memo} (-${formatMoney(phoneState.amount)}đ)`, 'danger');
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
