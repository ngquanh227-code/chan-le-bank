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

  function formatMoney(amount) {
    if (amount === undefined || amount === null || isNaN(amount)) return '0';
    return Number(amount).toLocaleString('en-US');
  }

  function syncBalanceUI() {
    const balFormEl = document.getElementById('phone-user-balance');
    const balHomeValEl = document.getElementById('home-bal-val');

    if (balFormEl) {
      balFormEl.textContent = `${formatMoney(phoneState.balance)} VND`;
    }
    if (balHomeValEl) {
      balHomeValEl.textContent = isBalanceVisible ? formatMoney(phoneState.balance) : '••••••••';
    }
  }

  function toggleEyeBalance() {
    isBalanceVisible = !isBalanceVisible;
    syncBalanceUI();
    if (window.CLB.audio) window.CLB.audio.playTone(isBalanceVisible ? 620 : 440, 'sine', 0.05);
  }

  function formatMbNotiDate(d = new Date()) {
    const pad = n => n.toString().padStart(2, '0');
    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear().toString().slice(-2);
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  function dismissPhoneNotification() {
    const payoutAlert = document.getElementById('phone-payout-alert');
    if (!payoutAlert) return;
    if (phoneToastTimer) {
      clearTimeout(phoneToastTimer);
      phoneToastTimer = null;
    }
    payoutAlert.classList.add('is-dismissing');
    setTimeout(() => {
      payoutAlert.classList.remove('show', 'is-dismissing', 'is-swiping');
      payoutAlert.style.transform = '';
      payoutAlert.style.opacity = '';
    }, 220);
  }

  function initNotificationSwipe() {
    const payoutAlert = document.getElementById('phone-payout-alert');
    if (!payoutAlert || payoutAlert._hasSwipeListener) return;
    payoutAlert._hasSwipeListener = true;

    let startY = 0;
    let currentDeltaY = 0;
    let isTracking = false;

    // Click/tap to dismiss immediately
    payoutAlert.addEventListener('click', () => {
      if (Math.abs(currentDeltaY) < 6) {
        dismissPhoneNotification();
      }
    });

    // Touch events for mobile/tablet swipe-up
    payoutAlert.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      startY = e.touches[0].clientY;
      currentDeltaY = 0;
      isTracking = true;
      payoutAlert.classList.add('is-swiping');
    }, { passive: true });

    payoutAlert.addEventListener('touchmove', (e) => {
      if (!isTracking || e.touches.length !== 1) return;
      const deltaY = e.touches[0].clientY - startY;
      if (deltaY < 0) {
        currentDeltaY = deltaY;
        payoutAlert.style.transform = `translateY(${deltaY}px) scale(${Math.max(0.85, 1 + deltaY / 300)})`;
        payoutAlert.style.opacity = Math.max(0, 1 + deltaY / 80).toString();
      }
    }, { passive: true });

    const handleTouchEnd = () => {
      if (!isTracking) return;
      isTracking = false;
      payoutAlert.classList.remove('is-swiping');
      if (currentDeltaY < -15) {
        dismissPhoneNotification();
      } else {
        payoutAlert.style.transform = '';
        payoutAlert.style.opacity = '';
      }
      setTimeout(() => { currentDeltaY = 0; }, 80);
    };

    payoutAlert.addEventListener('touchend', handleTouchEnd, { passive: true });
    payoutAlert.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    // Pointer events for desktop drag-up
    payoutAlert.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch') return;
      startY = e.clientY;
      currentDeltaY = 0;
      isTracking = true;
      payoutAlert.classList.add('is-swiping');
      try { payoutAlert.setPointerCapture(e.pointerId); } catch(err) {}
    });

    payoutAlert.addEventListener('pointermove', (e) => {
      if (!isTracking || e.pointerType === 'touch') return;
      const deltaY = e.clientY - startY;
      if (deltaY < 0) {
        currentDeltaY = deltaY;
        payoutAlert.style.transform = `translateY(${deltaY}px) scale(${Math.max(0.85, 1 + deltaY / 300)})`;
        payoutAlert.style.opacity = Math.max(0, 1 + deltaY / 80).toString();
      }
    });

    const handlePointerUp = (e) => {
      if (!isTracking || e.pointerType === 'touch') return;
      isTracking = false;
      payoutAlert.classList.remove('is-swiping');
      try { payoutAlert.releasePointerCapture(e.pointerId); } catch(err) {}
      if (currentDeltaY < -15) {
        dismissPhoneNotification();
      } else {
        payoutAlert.style.transform = '';
        payoutAlert.style.opacity = '';
      }
      setTimeout(() => { currentDeltaY = 0; }, 80);
    };

    payoutAlert.addEventListener('pointerup', handlePointerUp);
    payoutAlert.addEventListener('pointercancel', handlePointerUp);
  }

  function triggerPhoneNotification({ title, body, iconHtml, type, duration = 1800, time = 'Vừa xong' }) {
    const payoutAlert = document.getElementById('phone-payout-alert');
    if (!payoutAlert) return;
    if (phoneToastTimer) clearTimeout(phoneToastTimer);

    initNotificationSwipe();

    // Play MBBank Notification MP3 audio
    if (window.CLB.audio && window.CLB.audio.playMbBankAudio) {
      window.CLB.audio.playMbBankAudio();
    }

    payoutAlert.classList.remove('show', 'is-debit', 'is-credit', 'is-lose', 'is-topup', 'is-dismissing', 'is-swiping');
    payoutAlert.style.transform = '';
    payoutAlert.style.opacity = '';

    const iconEl = document.getElementById('phone-payout-toast-icon');
    const titleEl = document.getElementById('phone-payout-toast-title');
    const timeEl = document.getElementById('phone-payout-toast-time');
    const bodyEl = document.getElementById('phone-payout-toast-body');

    if (type) payoutAlert.classList.add(`is-${type}`);

    if (iconEl) {
      if (iconHtml) {
        iconEl.innerHTML = iconHtml;
      } else if (!iconEl.querySelector('img')) {
        iconEl.innerHTML = '<img src="img/mbbank_noti_icon.png" alt="MBBank" class="phone-payout-mb-logo">';
      }
    }

    if (titleEl) titleEl.textContent = title || 'Thông báo biến động số dư';
    if (timeEl) timeEl.textContent = time || 'Vừa xong';
    if (bodyEl && body) bodyEl.innerHTML = body;

    void payoutAlert.offsetWidth;
    payoutAlert.classList.add('show');

    // Haptic feedback for notification
    triggerHaptic(type === 'credit' ? 'payout' : (type === 'debit' ? 'success' : 'light'));

    // 1-2s duration: defaults to 1.8s (1800ms), maximum 2.0s (2000ms)
    const notiDuration = Math.min(Math.max(duration || 1800, 1000), 2000);
    phoneToastTimer = setTimeout(() => {
      dismissPhoneNotification();
    }, notiDuration);
  }

  /* HAPTIC VIBRATION ENGINE (iOS / Android Web Vibration API) */
  function triggerHaptic(type = 'light') {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        if (type === 'light') navigator.vibrate(35);
        else if (type === 'success') navigator.vibrate([40, 50, 70]);
        else if (type === 'payout') navigator.vibrate([70, 50, 120, 60, 90]);
        else if (type === 'error') navigator.vibrate([80, 50, 80]);
      } catch(e) {}
    }
  }

  /* MBBANK REAL-TIME TRANSACTION HISTORY MODEL */
  const phoneTransactions = [
    {
      id: 'TX-INIT',
      type: 'credit',
      amount: 10000000,
      title: 'MBBank khôi phục số dư',
      memo: 'Nạp tiền khả dụng MBBank',
      time: '22:04 - 09/10/2026',
      balance: 10000000
    }
  ];

  function addPhoneTransaction(tx) {
    phoneTransactions.unshift({
      id: tx.id || ('TX-' + Date.now()),
      type: tx.type || 'credit',
      amount: tx.amount || 0,
      title: tx.title || (tx.type === 'credit' ? 'Nhận tiền chuyển đến' : 'Chuyển tiền đi'),
      memo: tx.memo || '',
      time: tx.time || formatMbNotiDate(),
      balance: tx.balance !== undefined ? tx.balance : phoneState.balance
    });
    if (phoneTransactions.length > 50) phoneTransactions.pop();
    renderPhoneHistory();
  }

  let currentHistoryFilter = 'all';

  function renderPhoneHistory(filter) {
    if (filter) currentHistoryFilter = filter;
    const listEl = document.getElementById('phone-history-list');
    const balEl = document.getElementById('phone-history-bal-num');
    if (balEl) balEl.textContent = formatMoney(phoneState.balance);
    if (!listEl) return;

    const filtered = phoneTransactions.filter(item => {
      if (currentHistoryFilter === 'credit') return item.type === 'credit';
      if (currentHistoryFilter === 'debit') return item.type === 'debit';
      return true;
    });

    if (filtered.length === 0) {
      listEl.innerHTML = `<div class="phone-history-empty"><i class="fa-solid fa-receipt" style="font-size: 28px; margin-bottom: 8px; opacity: 0.5;"></i><br>Không có giao dịch nào</div>`;
      return;
    }

    listEl.innerHTML = filtered.map(item => `
      <div class="phone-history-item is-${item.type}">
        <div class="phone-history-item-icon">
          <i class="fa-solid fa-${item.type === 'credit' ? 'arrow-down-left' : 'arrow-up-right'}"></i>
        </div>
        <div class="phone-history-item-main">
          <div class="phone-history-item-title">${item.title}</div>
          ${item.memo ? `<div class="phone-history-item-memo">${item.memo}</div>` : ''}
          <div class="phone-history-item-time">${item.time}</div>
        </div>
        <div class="phone-history-item-right">
          <div class="phone-history-item-amount">${item.type === 'credit' ? '+' : '-'}${formatMoney(item.amount)} VND</div>
          <div class="phone-history-item-bal">SD: ${formatMoney(item.balance)}đ</div>
        </div>
      </div>
    `).join('');
  }

  /* DOWNLOAD AUTHENTIC PHOTOGRAPHIC RECEIPT VIA HTML5 CANVAS */
  function downloadReceiptImage() {
    triggerHaptic('light');
    const canvas = document.createElement('canvas');
    canvas.width = 473;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      ctx.drawImage(img, 0, 0, 473, 1024);
      ctx.textAlign = 'center';

      // Status bar Clock
      const clockText = document.getElementById('photo-receipt-clock')?.textContent || '22:23';
      ctx.font = '600 13px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(clockText, 236, 26);

      // Amount
      const amountText = document.getElementById('receipt-amount-display')?.textContent || '50,000 VND';
      ctx.font = '800 25px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(amountText, 236, 256);

      // Time
      const timeText = document.getElementById('receipt-time-display')?.textContent || '22:23 - 09/10/2026';
      ctx.font = '500 12.5px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(timeText, 236, 292);

      // Recipient Name
      const nameText = document.getElementById('receipt-recipient-name')?.textContent || 'NGUYEN VAN PHONG';
      ctx.font = '700 14px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(nameText, 236, 388);

      // Bank
      ctx.font = '700 12.5px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = '#002b80';
      ctx.fillText('MB Bank (MBB)', 236, 420);

      // STK
      const stkText = document.getElementById('receipt-recipient-stk')?.textContent || '0644888866';
      ctx.font = '500 12.5px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText(stkText, 236, 452);

      // Memo
      const memoText = document.getElementById('receipt-memo')?.textContent || 'Dungdz TC';
      ctx.font = '600 12.5px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText('Nội dung: ' + memoText, 236, 484);

      // FT Code
      const txCodeText = document.getElementById('receipt-tx-code')?.textContent || 'FT268194824';
      ctx.font = '700 12px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = '#002b80';
      ctx.fillText('Mã giao dịch: ' + txCodeText, 236, 516);

      // Trigger automatic download
      try {
        const link = document.createElement('a');
        link.download = `Bien_Lai_MBBank_${txCodeText}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error('Cannot download canvas image', err);
      }

      if (window.CLB.toast) {
        window.CLB.toast.showToast(`Đã lưu ảnh biên lai ${txCodeText} thành công!`, 'success');
      }
      triggerHaptic('success');
    };

    img.onerror = () => {
      if (window.CLB.toast) window.CLB.toast.showToast('Không thể tạo ảnh biên lai lúc này', 'warning');
    };

    img.src = 'img/mbbank_receipt_clean.jpg';
  }

  function showPhoneScreen(screenName) {
    const screenHome = document.getElementById('phone-screen-home');
    const screenSuperTransfer = document.getElementById('phone-screen-super-transfer');
    const screenQr = document.getElementById('phone-screen-qr');
    const screenForm = document.getElementById('phone-screen-form');
    const screenReceipt = document.getElementById('phone-screen-receipt');
    const screenHistory = document.getElementById('phone-screen-history');

    if (window.CLB.qr && window.CLB.qr.clearQrTimer) {
      window.CLB.qr.clearQrTimer();
    }

    if (screenHome) {
      screenHome.classList.toggle('is-active', screenName === 'home');
      screenHome.style.display = screenName === 'home' ? 'block' : 'none';
    }
    if (screenSuperTransfer) {
      screenSuperTransfer.classList.toggle('is-active', screenName === 'super-transfer');
      screenSuperTransfer.style.display = screenName === 'super-transfer' ? 'block' : 'none';
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
    if (screenHistory) {
      screenHistory.classList.toggle('is-active', screenName === 'history');
      screenHistory.style.display = screenName === 'history' ? 'flex' : 'none';
      if (screenName === 'history') renderPhoneHistory();
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

    // History Screen Navigation
    const btnHomeHistory = document.getElementById('btn-home-open-history');
    const btnHomeQuickHistory = document.getElementById('btn-home-quick-history');
    const btnHistoryBack = document.getElementById('btn-phone-history-back');
    const btnHistoryRefresh = document.getElementById('btn-phone-history-refresh');

    if (btnHomeHistory) btnHomeHistory.addEventListener('click', () => {
      showPhoneScreen('history');
      if (window.CLB.audio) window.CLB.audio.playTone(520, 'sine', 0.05);
    });
    if (btnHomeQuickHistory) btnHomeQuickHistory.addEventListener('click', () => {
      showPhoneScreen('history');
      if (window.CLB.audio) window.CLB.audio.playTone(520, 'sine', 0.05);
    });
    if (btnHistoryBack) btnHistoryBack.addEventListener('click', () => {
      showPhoneScreen('home');
      if (window.CLB.audio) window.CLB.audio.playTone(460, 'sine', 0.05);
    });
    if (btnHistoryRefresh) btnHistoryRefresh.addEventListener('click', () => {
      renderPhoneHistory();
      if (window.CLB.audio) window.CLB.audio.playTone(600, 'sine', 0.05);
      if (window.CLB.toast) window.CLB.toast.showToast('Đã làm mới biến động số dư', 'info');
    });

    // History Filter Tabs
    document.querySelectorAll('.phone-history-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.phone-history-tab').forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');
        const filterKey = tab.getAttribute('data-tab') || 'all';
        renderPhoneHistory(filterKey);
        if (window.CLB.audio) window.CLB.audio.playTone(560, 'sine', 0.04);
      });
    });

    // Download Receipt Button
    const btnDownloadReceipt = document.getElementById('btn-phone-download-receipt');
    if (btnDownloadReceipt) {
      btnDownloadReceipt.addEventListener('click', () => {
        downloadReceiptImage();
      });
    }

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
    formatMoney,
    formatMbNotiDate,
    triggerHaptic,
    phoneTransactions,
    addPhoneTransaction,
    renderPhoneHistory,
    downloadReceiptImage,
    syncBalanceUI,
    toggleEyeBalance,
    triggerPhoneNotification,
    dismissPhoneNotification,
    showPhoneScreen,
    togglePhone,
    updatePhoneClock,
    initDragAndPin,
    initPhoneCoreListeners,
    setPhoneBetChoice
  };
    setPhoneBetChoice
  };
})();
