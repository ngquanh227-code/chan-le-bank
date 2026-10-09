/**
 * Module: Fake Withdrawal Simulation
 * Simulates instant NAPAS 24/7 money withdrawal to player's bank account
 */
(function() {
  'use strict';
  window.CLB = window.CLB || {};

  let currentWithdrawAmount = 100000;

  function setWithdrawAmount(amt) {
    currentWithdrawAmount = Math.max(10000, amt);
    const withdrawValDisplay = document.getElementById('withdraw-val-display');
    const withdrawCustomInput = document.getElementById('withdraw-custom-amount');

    if (withdrawValDisplay) {
      withdrawValDisplay.textContent = `${currentWithdrawAmount.toLocaleString("en-US")} VND`;
    }
    if (withdrawCustomInput) {
      withdrawCustomInput.textContent = currentWithdrawAmount.toLocaleString("en-US");
    }
  }

  function executeFakeWithdrawal(amtOverride) {
    const selectBank = document.getElementById('select-payout-bank');
    const inputStk = document.getElementById('input-stk-reward');
    const inputName = document.getElementById('input-name-reward');
    const btnDoWithdraw = document.getElementById('btn-do-quick-withdraw');
    const modalWithdrawReceipt = document.getElementById('modal-withdraw-receipt');

    const stk = inputStk ? inputStk.value.trim() : '0971266012';
    const name = inputName ? inputName.value.trim() : 'NGUYEN THAO LINH';
    const bankCode = selectBank ? selectBank.value : 'MB';
    const bankText = selectBank && selectBank.options[selectBank.selectedIndex] 
      ? selectBank.options[selectBank.selectedIndex].text 
      : 'MB - Ngân hàng Quân Đội';

    const amount = amtOverride || currentWithdrawAmount || 100000;

    if (!stk) {
      if (window.CLB.toast) window.CLB.toast.showToast('Vui lòng nhập số tài khoản nhận tiền!', 'warning');
      if (inputStk) inputStk.focus();
      return;
    }

    if (amount < 10000) {
      if (window.CLB.toast) window.CLB.toast.showToast('Số tiền rút tối thiểu là 10,000đ!', 'warning');
      return;
    }

    // Loading button state
    if (btnDoWithdraw) {
      btnDoWithdraw.classList.add('is-loading');
      btnDoWithdraw.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>ĐANG KẾT NỐI NAPAS 24/7...</span>';
    }

    if (window.CLB.audio) window.CLB.audio.playTone(480, 'triangle', 0.1);

    // Simulate instantaneous NAPAS 24/7 payout (1.2s)
    setTimeout(() => {
      if (btnDoWithdraw) {
        btnDoWithdraw.classList.remove('is-loading');
        btnDoWithdraw.innerHTML = '<i class="fa-solid fa-paper-plane"></i> <span id="btn-withdraw-text">RÚT TIỀN VỀ NGÂN HÀNG (GIẢ LẬP)</span>';
      }

      const txCode = `NPS${Math.floor(100000000 + Math.random() * 900000000)}`;
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} ${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

      // Success audio chime
      if (window.CLB.audio) {
        window.CLB.audio.playTone(523.25, 'sine', 0.12);
        setTimeout(() => window.CLB.audio.playTone(659.25, 'sine', 0.15), 100);
        setTimeout(() => window.CLB.audio.playTone(783.99, 'sine', 0.25), 220);
      }

      if (window.CLB.toast) {
        window.CLB.toast.showToast(`Rút tiền thành công! Đã giải ngân ${amount.toLocaleString("en-US")}đ về STK ${stk} (${bankCode})`, 'success');
      }

      // Populate success receipt dialog
      const rcAmount = document.getElementById('receipt-modal-amount');
      const rcBank = document.getElementById('receipt-modal-bank');
      const rcStk = document.getElementById('receipt-modal-stk');
      const rcName = document.getElementById('receipt-modal-name');
      const rcFt = document.getElementById('receipt-modal-ft');
      const rcTime = document.getElementById('receipt-modal-time');

      if (rcAmount) rcAmount.textContent = amount.toLocaleString("en-US");
      if (rcBank) rcBank.textContent = bankText;
      if (rcStk) rcStk.textContent = stk;
      if (rcName) rcName.textContent = name;
      if (rcFt) rcFt.textContent = txCode;
      if (rcTime) rcTime.textContent = timeStr;

      if (modalWithdrawReceipt) {
        modalWithdrawReceipt.style.display = 'flex';
      }

      // Drop notification in simulated phone
      if (window.CLB.phone) {
        const notiDate = window.CLB.phone.formatMbNotiDate ? window.CLB.phone.formatMbNotiDate() : '09/10/26 22:04';
        const maskedStk = stk.length > 5 ? `${stk.slice(0, 2)}xxx${stk.slice(-3)}` : (stk || '09xxx081');
        window.CLB.phone.triggerPhoneNotification({
          title: 'Thông báo biến động số dư',
          time: 'Vừa xong',
          body: `TK ${maskedStk}|GD: +${amount.toLocaleString("en-US")}VND ${notiDate} |SD: +${amount.toLocaleString("en-US")}VND|ND: NGUYEN TUAN DUNG rut tien TRUM.TOP`,
          type: 'credit',
          duration: 5500
        });
      }
    }, 1200);
  }

  function initWithdrawListeners() {
    const btnDoWithdraw = document.getElementById('btn-do-quick-withdraw');
    const withdrawCustomInput = document.getElementById('withdraw-custom-amount');
    const withdrawValDisplay = document.getElementById('withdraw-val-display');
    const btnWithdrawAll = document.getElementById('btn-withdraw-all');
    const withdrawChips = document.querySelectorAll('.withdraw-chip');
    const btnHomeQuickWithdraw = document.getElementById('btn-home-quick-withdraw');
    const modalWithdrawReceipt = document.getElementById('modal-withdraw-receipt');
    const btnCloseWithdrawModal = document.getElementById('btn-close-withdraw-modal');
    const btnOpenPhoneFromReceipt = document.getElementById('btn-open-phone-from-receipt');
    const withdrawBackdrop = document.getElementById('withdraw-receipt-backdrop');

    // Preset chips
    withdrawChips.forEach(chip => {
      chip.addEventListener('click', () => {
        withdrawChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const amt = parseInt(chip.getAttribute('data-amount'), 10);
        setWithdrawAmount(amt);
        if (window.CLB.audio) window.CLB.audio.playTone(520, 'sine', 0.05);
      });
    });

    // Custom editable amount
    if (withdrawCustomInput) {
      withdrawCustomInput.addEventListener('input', () => {
        const raw = withdrawCustomInput.textContent.replace(/[^\d]/g, '');
        const parsed = parseInt(raw, 10) || 0;
        currentWithdrawAmount = parsed;
        if (withdrawValDisplay) {
          withdrawValDisplay.textContent = `${parsed.toLocaleString("en-US")} VND`;
        }
        withdrawChips.forEach(c => c.classList.remove('active'));
      });
    }

    // All balance button
    if (btnWithdrawAll) {
      btnWithdrawAll.addEventListener('click', () => {
        withdrawChips.forEach(c => c.classList.remove('active'));
        const allBal = (window.CLB.phone && window.CLB.phone.phoneState) ? window.CLB.phone.phoneState.balance : 10000000;
        setWithdrawAmount(allBal);
        if (window.CLB.audio) window.CLB.audio.playTone(600, 'sine', 0.06);
        if (window.CLB.toast) window.CLB.toast.showToast(`Đã chọn toàn bộ số dư: ${allBal.toLocaleString("en-US")}đ`, 'info');
      });
    }

    // Modal close & open phone
    const closeWithdrawModal = () => {
      if (modalWithdrawReceipt) modalWithdrawReceipt.style.display = 'none';
    };

    if (btnCloseWithdrawModal) btnCloseWithdrawModal.addEventListener('click', closeWithdrawModal);
    if (withdrawBackdrop) withdrawBackdrop.addEventListener('click', closeWithdrawModal);
    if (btnOpenPhoneFromReceipt) {
      btnOpenPhoneFromReceipt.addEventListener('click', () => {
        closeWithdrawModal();
        if (window.CLB.phone) window.CLB.phone.togglePhone(true);
      });
    }

    if (btnDoWithdraw) {
      btnDoWithdraw.addEventListener('click', () => executeFakeWithdrawal());
    }

    if (btnHomeQuickWithdraw) {
      btnHomeQuickWithdraw.addEventListener('click', () => {
        executeFakeWithdrawal(500000);
      });
    }
  }

  window.CLB.withdraw = {
    setWithdrawAmount,
    executeFakeWithdrawal,
    initWithdrawListeners
  };
})();
