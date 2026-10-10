/**
 * CHAN LE BANK - MASTER APPLICATION ENTRY COORDINATOR
 * Connects modular engines (Config, Audio, Toast, VietQR, Game Engine,
 * Phone Core, Phone QR, Phone Transfer, Withdraw Simulator).
 */
(function() {
  'use strict';

  // Master App object exposed to global scope
  const App = {
    // Delegated methods for HTML onclick handlers
    openQrModal: function(bankName, stk, owner) {
      if (window.CLB && window.CLB.game) {
        window.CLB.game.openQrModal(bankName, stk, owner);
      }
    },

    openPhone: function() {
      if (window.CLB && window.CLB.phone && window.CLB.phone.togglePhone) {
        window.CLB.phone.togglePhone(true);
      }
    },

    closePhone: function() {
      if (window.CLB && window.CLB.phone && window.CLB.phone.togglePhone) {
        window.CLB.phone.togglePhone(false);
      }
    },

    togglePhone: function(open) {
      if (window.CLB && window.CLB.phone && window.CLB.phone.togglePhone) {
        window.CLB.phone.togglePhone(open);
      }
    },

    closeQrModal: function() {
      if (window.CLB && window.CLB.game) {
        window.CLB.game.closeQrModal();
      }
    },

    setGameMode: function(gameKey) {
      if (window.CLB && window.CLB.game) {
        window.CLB.game.setGameMode(gameKey);
      }
    },

    setPhoneGameMode: function(modeKey, targetMemo) {
      if (window.CLB && window.CLB.transfer) {
        window.CLB.transfer.setPhoneGameMode(modeKey, targetMemo);
      }
    },

    selectAndPlay: function(syntax, catKey, label) {
      if (window.CLB && window.CLB.game) {
        window.CLB.game.selectAndPlay(syntax, catKey, label);
      }
    },

    copyText: function(text, label) {
      if (window.CLB && window.CLB.toast) {
        window.CLB.toast.copyText(text, label);
      }
    },

    // Master initialization
    init: function() {
      const CLB = window.CLB || {};
      const config = CLB.config || {};
      const toast = CLB.toast || {};
      const audio = CLB.audio || {};
      const game = CLB.game || {};
      const phone = CLB.phone || {};
      const qr = CLB.qr || {};
      const transfer = CLB.transfer || {};
      const withdraw = CLB.withdraw || {};

      // 1. Audio initialization on first interaction
      if (audio.initAudio) {
        ['click', 'touchstart', 'keydown'].forEach(evt => {
          document.addEventListener(evt, audio.initAudio, { once: true });
        });
      }

      // 2. Sound Toggle
      const btnSound = document.getElementById('btn-sound');
      if (btnSound) {
        btnSound.addEventListener('click', () => {
          config.soundEnabled = !config.soundEnabled;
          const icon = document.getElementById('sound-icon');
          if (icon) {
            icon.className = config.soundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
          }
          if (toast.showToast) {
            toast.showToast(config.soundEnabled ? 'Đã bật âm thanh hiệu ứng' : 'Đã tắt âm thanh', 'info');
          }
        });
      }

      // 3. Density Toggle
      const btnDensity = document.getElementById('btn-density');
      if (btnDensity) {
        btnDensity.addEventListener('click', () => {
          config.densityCompact = !config.densityCompact;
          document.querySelectorAll('.table-clean th, .table-clean td, .table-live-stream th, .table-live-stream td').forEach(el => {
            el.style.padding = config.densityCompact ? '4px 6px' : '';
          });
          if (toast.showToast) {
            toast.showToast(`Đã đổi chế độ: ${config.densityCompact ? 'Thu gọn (Compact)' : 'Chuẩn'}`, 'info');
          }
        });
      }

      // 4. Design Tokens Modal
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

      // 5. Red Bank Pill
      const btnBank = document.getElementById('btn-bank-tab');
      if (btnBank) {
        btnBank.addEventListener('click', () => {
          if (toast.showToast) toast.showToast('Hệ thống đang hoạt động ở chế độ Bank chuyển tiền 24/7!', 'info');
          if (audio.playTone) audio.playTone(600, 'sine', 0.1);
        });
      }

      // 6. Save Account Info
      const btnSaveAcc = document.getElementById('btn-save-account');
      if (btnSaveAcc) {
        btnSaveAcc.addEventListener('click', () => {
          const inputStk = document.getElementById('input-stk-reward');
          const inputName = document.getElementById('input-name-reward');
          const stk = inputStk ? inputStk.value.trim() : '';
          const name = inputName ? inputName.value.trim() : '';
          if (toast.showToast) toast.showToast(`Đã lưu thông tin Bank: ${name} (${stk})`, 'success');
          if (audio.playTone) audio.playTone(550, 'sine', 0.1);
        });
      }

      // 7. Lịch sử chơi scroll
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

      // 8. Copy STK in Table 1
      ['btn-copy-stk-1', 'btn-copy-stk-2', 'btn-copy-stk-3', 'btn-copy-stk-4'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
          btn.addEventListener('click', () => {
            const stk = btn.getAttribute('data-stk');
            if (toast.copyText) toast.copyText(stk, `STK ${stk}`);
          });
        }
      });

      // 9. Claim Quest Reward
      const btnClaim = document.getElementById('btn-claim-quest');
      if (btnClaim) {
        btnClaim.addEventListener('click', () => {
          btnClaim.disabled = true;
          btnClaim.innerHTML = '<i class="fa-solid fa-check"></i> Đã nhận';
          btnClaim.style.opacity = '0.5';
          if (toast.showToast) toast.showToast('Chúc mừng! Bạn đã nhận thưởng mốc 614k (+6.666đ)!', 'success');
          if (audio.playChime) audio.playChime(true);
        });
      }

      // 10. Search Transaction
      const btnSearch = document.getElementById('btn-search-tx');
      const inputSearch = document.getElementById('input-search-tx');
      if (btnSearch && game.searchTransaction) btnSearch.addEventListener('click', game.searchTransaction);
      if (inputSearch && game.searchTransaction) {
        inputSearch.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') game.searchTransaction();
        });
      }

      // 11. Bind Game Tabs
      document.querySelectorAll('.game-tab-button').forEach(btn => {
        btn.addEventListener('click', () => {
          const gameKey = btn.getAttribute('data-game');
          App.setGameMode(gameKey);
        });
      });

      // 12. Initialize Phone Simulator & Submodules
      if (phone.initPhoneCoreListeners) phone.initPhoneCoreListeners();
      if (qr.initQrListeners) qr.initQrListeners();
      if (transfer.initTransferListeners) transfer.initTransferListeners();
      if (withdraw.initWithdrawListeners) withdraw.initWithdrawListeners();

      // 13. Default Boot on CLTX2 (matching authentic screenshot)
      App.setGameMode('cltx2');
      App.setPhoneGameMode('cltx2');

      // 14. Global Keyboard Navigation (Escape key)
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          App.closeQrModal();
          toggleDs(false);
          if (phone.togglePhone) phone.togglePhone(false);
        }
      });

      // 15. Stream new big winner transactions periodically
      if (game.streamNewBigWinner) {
        setInterval(game.streamNewBigWinner, 4200);
      }

      console.log('%cTRUM.TOP Engine Active - Modular Architecture Loaded Successfully', 'color: #38bdf8; font-weight: bold; font-size: 13px;');
    }
  };

  // Expose to window
  window.App = App;

  // Boot on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', App.init);
  } else {
    App.init();
  }
})();
