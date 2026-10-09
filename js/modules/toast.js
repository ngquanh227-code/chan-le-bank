/**
 * Module: Toast & Clipboard Utilities
 * Handles accessible toast notifications and clipboard copying
 */
(function() {
  'use strict';
  window.CLB = window.CLB || {};

  function showToast(message, type = 'info', duration = 2800) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    toast.setAttribute('role', 'alert');

    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'warning') icon = 'triangle-exclamation';
    if (type === 'error') icon = 'circle-xmark';

    toast.innerHTML = `
      <i class="fa-solid fa-${icon}"></i>
      <span style="flex: 1;">${message}</span>
      <span class="toast-close" style="cursor: pointer; opacity: 0.6;" onclick="this.parentElement.remove()" title="Đóng">
        <i class="fa-solid fa-xmark"></i>
      </span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => {
        if (toast.remove) toast.remove();
        else if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 250);
    }, duration);
  }

  function copyText(text, label = 'Nội dung') {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Đã sao chép ${label}: ${text}`, 'success');
        if (window.CLB.audio) window.CLB.audio.playTone(800, 'sine', 0.08);
      }).catch(() => fallbackCopy(text, label));
    } else {
      fallbackCopy(text, label);
    }
  }

  function fallbackCopy(text, label) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast(`Đã sao chép ${label}: ${text}`, 'success');
      if (window.CLB.audio) window.CLB.audio.playTone(800, 'sine', 0.08);
    } catch (err) {
      showToast(`Không thể sao chép tự động: ${text}`, 'warning');
    }
    document.body.removeChild(ta);
  }

  window.CLB.toast = {
    showToast,
    copyText
  };
})();
