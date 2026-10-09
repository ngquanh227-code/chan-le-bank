/**
 * Module: Phone QR Scanner
 * Manages authentic MBBank QR Code Scanner screen (Image 1 replica)
 */
(function() {
  'use strict';
  window.CLB = window.CLB || {};

  let qrScanTimer = null;

  function clearQrTimer() {
    if (qrScanTimer) {
      clearTimeout(qrScanTimer);
      qrScanTimer = null;
    }
  }

  function completeQrScan() {
    clearQrTimer();

    // Camera scan beep audio effect
    if (window.CLB.audio) {
      window.CLB.audio.playTone(1800, 'sine', 0.12);
      setTimeout(() => window.CLB.audio.playTone(2400, 'sine', 0.08), 70);
    }

    const config = window.CLB.config ? window.CLB.config.activeBank : {};
    const recNameEl = document.getElementById('phone-recipient-name');
    const recStkEl = document.getElementById('phone-recipient-stk');
    const recBankLabel = document.getElementById('phone-bank-name-label');
    const memoDisplay = document.getElementById('phone-memo-display');

    if (recNameEl) recNameEl.textContent = config.owner || 'NGUYEN QUANG ANH';
    if (recStkEl) recStkEl.textContent = config.accountNumber || '0962714685';
    if (recBankLabel) recBankLabel.textContent = `${config.name || 'MB'} - Quân đội`;
    if (memoDisplay) memoDisplay.textContent = `${config.memo || 'Dungdz TC'} (Quét mã VietQR)`;

    if (window.CLB.toast) {
      window.CLB.toast.showToast('Quét mã QR MB thành công! Đã nhận diện thông tin người thụ hưởng.', 'success');
    }

    if (window.CLB.phone) {
      window.CLB.phone.showPhoneScreen('form');
    }
  }

  function startAutoScan() {
    clearQrTimer();
    if (window.CLB.audio) window.CLB.audio.playTone(550, 'sine', 0.08);
    qrScanTimer = setTimeout(() => {
      completeQrScan();
    }, 1300);
  }

  function initQrListeners() {
    const btnQrBack = document.getElementById('btn-qr-back');
    const btnQrFlash = document.getElementById('btn-qr-flash');
    const qrCameraTarget = document.getElementById('qr-camera-viewport');
    const btnQrModalScanPhone = document.getElementById('btn-qr-modal-scan-phone');

    if (btnQrBack) {
      btnQrBack.addEventListener('click', () => {
        clearQrTimer();
        if (window.CLB.phone) window.CLB.phone.showPhoneScreen('home');
        if (window.CLB.audio) window.CLB.audio.playTone(450, 'sine', 0.05);
      });
    }

    if (btnQrFlash) {
      btnQrFlash.addEventListener('click', () => {
        const frame = document.getElementById('qr-camera-viewport');
        if (frame) {
          const isLit = frame.getAttribute('data-flash') === '1';
          frame.setAttribute('data-flash', isLit ? '0' : '1');
          frame.style.filter = isLit ? '' : 'brightness(1.4)';
          btnQrFlash.style.background = isLit ? '#ffffff' : '#facc15';
          if (window.CLB.audio) window.CLB.audio.playTone(isLit ? 400 : 700, 'sine', 0.05);
        }
      });
    }

    if (qrCameraTarget) {
      qrCameraTarget.addEventListener('click', completeQrScan);
    }

    ['qr-brand-napas', 'qr-brand-mb', 'qr-brand-vietqr', 'qr-brand-vietqr2', 'btn-qr-photo-transfer', 'btn-qr-upload'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', completeQrScan);
    });

    if (btnQrModalScanPhone) {
      btnQrModalScanPhone.addEventListener('click', () => {
        if (window.CLB.game) window.CLB.game.closeQrModal();
        if (window.CLB.phone) {
          window.CLB.phone.togglePhone(true);
          window.CLB.phone.showPhoneScreen('qr');
        }
      });
    }
  }

  window.CLB.qr = {
    completeQrScan,
    startAutoScan,
    clearQrTimer,
    initQrListeners
  };
})();
