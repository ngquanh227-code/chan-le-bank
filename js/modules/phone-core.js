/**
 * Module: Phone Simulator Core
 * Manages virtual phone lifecycle, dragging, pinning, clock sync, and notifications
 */
(function() {
  'use strict';
  window.CLB = window.CLB || {};

  const phoneState = {
    balance: 10000000,
    amount: 50000,
    memo: 'Dungdz TC',
    gameCategory: 'cltx2',
    recipient: {
      name: 'NGUYEN VAN PHONG',
      stk: '0644888866',
      bank: 'MBBank'
    }
  };

  let isBalanceVisible = true;
  let phoneToastTimer = null;

  function syncBalanceUI() {
    const balFormEl = document.getElementById('phone-user-balance');
    const balHomeValEl = document.getElementById('home-bal-val');

    if (balFormEl) {
      balFormEl.textContent = `${phoneState.balance.toLocaleString('vi-VN')} VND`;
    }
    if (balHomeValEl) {
      balHomeValEl.textContent = isBalanceVisible ? phoneState.balance.toLocaleString('vi-VN') : '••••••••';
    }
  }

  function toggleEyeBalance() {
    isBalanceVisible = !isBalanceVisible;
    syncBalanceUI();
    if (window.CLB.audio) window.CLB.audio.playTone(isBalanceVisible ? 620 : 440, 'sine', 0.05);
  }

  function triggerPhoneNotification({ title, body, iconHtml, type, duration = 4200 }) {
    const payoutAlert = document.getElementById('phone-payout-alert');
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

    void payoutAlert.offsetWidth;
    payoutAlert.classList.add('show');

    phoneToastTimer = setTimeout(() => {
      payoutAlert.classList.remove('show');
    }, duration);
  }

  function showPhoneScreen(screenName) {
    const screenHome = document.getElementById('phone-screen-home');
    const screenQr = document.getElementById('phone-screen-qr');
    const screenForm = document.getElementById('phone-screen-form');
    const screenReceipt = document.getElementById('phone-screen-receipt');

    if (window.CLB.qr && window.CLB.qr.clearQrTimer) {
      window.CLB.qr.clearQrTimer();
    }

    if (screenHome) {
      screenHome.classList.toggle('is-active', screenName === 'home');
      screenHome.style.display = screenName === 'home' ? 'block' : 'none';
    }
    if (screenQr) {
      screenQr.style.display = screenName === 'qr' ? 'flex' : 'none';
    }
    if (screenForm) {
      screenForm.style.display = screenName === 'form' ? 'flex' : 'none';
    }
    if (screenReceipt) {
      screenReceipt.classList.toggle('is-active', screenName === 'receipt');
      screenReceipt.style.display = screenName === 'receipt' ? 'block' : 'none';
    }
    syncBalanceUI();

    if (screenName === 'qr' && window.CLB.qr) {
      window.CLB.qr.startAutoScan();
    }
  }

  function togglePhone(open) {
    const modalPhone = document.getElementById('modal-phone-sim');
    if (modalPhone) {
      modalPhone.classList.toggle('is-open', open);
      if (open) {
        showPhoneScreen('home');
        if (window.CLB.audio) window.CLB.audio.playTone(480, 'sine', 0.08);
      }
    }
  }

  function updatePhoneClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${h}:${m}`;

    ['phone-clock', 'phone-home-clock', 'photo-receipt-clock', 'phone-qr-clock'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = timeStr;
    });
  }

  // Draggable phone chassis logic
  let isDragging = false;
  let dragStartX = 0, dragStartY = 0;
  let currentPosX = 0, currentPosY = 0;

  function initDragAndPin() {
    const dragHandle = document.getElementById('phone-drag-handle');
    const dynamicIsland = document.getElementById('phone-dynamic-island');
    const chassis = document.querySelector('.phone-chassis');
    const modalPhone = document.getElementById('modal-phone-sim');
    const btnPin = document.getElementById('btn-pin-phone');

    function startDrag(e) {
      isDragging = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      dragStartX = clientX - currentPosX;
      dragStartY = clientY - currentPosY;
      if (chassis) chassis.style.transition = 'none';
    }

    function onDragMove(e) {
      if (!isDragging || !chassis) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      currentPosX = clientX - dragStartX;
      currentPosY = clientY - dragStartY;
      chassis.style.transform = `translate(${currentPosX}px, ${currentPosY}px)`;
    }

    function onDragEnd() {
      if (isDragging && chassis) {
        isDragging = false;
        chassis.style.transition = '';
      }
    }

    if (dragHandle) {
      dragHandle.addEventListener('mousedown', startDrag);
      dragHandle.addEventListener('touchstart', startDrag, { passive: false });
    }
    if (dynamicIsland) {
      dynamicIsland.addEventListener('mousedown', startDrag);
      dynamicIsland.addEventListener('touchstart', startDrag, { passive: false });
    }
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('touchmove', onDragMove, { passive: false });
    window.addEventListener('mouseup', onDragEnd);
    window.addEventListener('touchend', onDragEnd);

    // Pinning toggle
    if (btnPin && modalPhone) {
      btnPin.addEventListener('click', () => {
        const isPinned = modalPhone.classList.toggle('is-pinned');
        btnPin.classList.toggle('active', isPinned);
        if (window.CLB.toast) window.CLB.toast.showToast(isPinned ? 'Đã ghim điện thoại ảo (Non-blocking)' : 'Đã bỏ ghim', 'info');
      });
    }

    // Modal backdrop click closes (only when not pinned)
    if (modalPhone) {
      modalPhone.addEventListener('click', (e) => {
        if (modalPhone.classList.contains('is-pinned')) return;
        if (e.target === modalPhone) togglePhone(false);
      });
    }
  }

  function initPhoneCoreListeners() {
    initDragAndPin();
    const btnOpenPhone = document.getElementById('btn-open-phone-sim');
    const btnClosePhone = document.getElementById('btn-close-phone');
    if (btnOpenPhone) btnOpenPhone.addEventListener('click', () => togglePhone(true));
    if (btnClosePhone) btnClosePhone.addEventListener('click', () => togglePhone(false));

    updatePhoneClock();
    setInterval(updatePhoneClock, 10000);
  }

  function setPhoneBetChoice(syntax, catKey, label) {
    const fullMemo = /^dungdz\s+/i.test(syntax) ? syntax : `Dungdz ${syntax}`;
    phoneState.memo = fullMemo;
    phoneState.gameCategory = catKey;
    const memoInput = document.getElementById('phone-memo-input');
    if (memoInput) {
      memoInput.innerText = fullMemo;
    }
    const memoDisp = document.getElementById('phone-memo-display');
    if (memoDisp) memoDisp.textContent = `${fullMemo} (${label || syntax})`;

    showPhoneScreen('form');
    if (memoInput) {
      setTimeout(() => {
        memoInput.focus();
        try {
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(memoInput);
          range.collapse(false);
          sel.removeAllRanges();
          sel.addRange(range);
        } catch(e) {}
      }, 150);
    }
  }

  window.CLB.phone = {
    phoneState,
    syncBalanceUI,
    toggleEyeBalance,
    triggerPhoneNotification,
    showPhoneScreen,
    togglePhone,
    updatePhoneClock,
    initDragAndPin,
    initPhoneCoreListeners,
    setPhoneBetChoice
  };
})();
