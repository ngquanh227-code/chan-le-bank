/**
 * Module: Game Engine
 * Manages game modes, rule cards rendering, bet streaming and transaction search
 */
(function() {
  'use strict';
  window.CLB = window.CLB || {};

  function openQrModal(bankName, stk, owner) {
    const config = window.CLB.config;
    if (config) {
      config.activeBank.name = bankName || config.activeBank.name;
      config.activeBank.accountNumber = stk || config.activeBank.accountNumber;
      config.activeBank.owner = owner || config.activeBank.owner;
    }

    const nameEl = document.getElementById('modal-bank-name');
    const stkEl = document.getElementById('modal-bank-stk');
    const ownerEl = document.getElementById('modal-bank-owner');
    const memoEl = document.getElementById('modal-bank-memo');

    if (nameEl) nameEl.textContent = config.activeBank.name;
    if (stkEl) stkEl.textContent = config.activeBank.accountNumber;
    if (ownerEl) ownerEl.textContent = config.activeBank.owner;
    if (memoEl) memoEl.textContent = config.activeBank.memo;

    const qrData = `vietqr://${config.activeBank.name}/${config.activeBank.accountNumber}?memo=${config.activeBank.memo}`;
    if (window.CLB.vietqr) window.CLB.vietqr.drawVietQR('qr-canvas', qrData);

    const modal = document.getElementById('modal-qr');
    if (modal) {
      modal.classList.add('is-open');
      if (window.CLB.audio) window.CLB.audio.playTone(450, 'sine', 0.1);
    }
  }

  function closeQrModal() {
    const modal = document.getElementById('modal-qr');
    if (modal) modal.classList.remove('is-open');
  }

  function renderGameRules(modeKey) {
    const container = document.getElementById('game-rules-card');
    if (!container) return;
    const configs = window.CLB.config ? window.CLB.config.gameConfigs : {};
    const config = configs[modeKey] || configs.cltx2;

    let rowsHtml = '';
    config.rows.forEach(r => {
      const numbersHtml = r.numbers.map(n => `<span class="game-number-chip">${n}</span>`).join(' ');
      const doorTag = r.name ? `<span class="syntax-door-tag">${r.name}</span>` : '';
      rowsHtml += `
        <div class="game-rule-row" role="button" tabindex="0" onclick="App.selectAndPlay('${r.syntax}', '${modeKey}', '${r.name || r.syntax}')" onkeydown="if(event.key==='Enter'||event.key===' '){App.selectAndPlay('${r.syntax}', '${modeKey}', '${r.name || r.syntax}'); event.preventDefault();}" title="Nhấn để chọn ${r.name || r.syntax} và cược trên MBBank">
          <div class="game-syntax-cell">
            <span class="syntax-badge">${r.syntax}</span>
            ${doorTag}
          </div>
          <div class="game-numbers-cell">
            ${numbersHtml}
          </div>
          <div class="game-rate-cell">
            ${r.rateLabel}
          </div>
        </div>
      `;
    });

    let notesHtml = '';
    if (config.notes && config.notes.length) {
      notesHtml = `
        <div class="game-rule-notes">
          ${config.notes.map(n => `<div class="game-rule-note-line"><i class="fa-solid fa-circle-dot"></i> <span>${n}</span></div>`).join('')}
        </div>
      `;
    }

    container.innerHTML = `
      <div class="game-rule-header">
        <span class="game-rule-title">
          ${config.titleIcon} ${config.title}
        </span>
        <span class="game-rule-badge">TỰ ĐỘNG 24/7</span>
      </div>
      <div class="game-rule-table-head">
        <div>NỘI DUNG</div>
        <div>${config.colHeader.toUpperCase()}</div>
        <div style="text-align: right;">TIỀN THƯỞNG</div>
      </div>
      <div class="game-rule-rows-container">
        ${rowsHtml}
      </div>
      ${notesHtml}
    `;
  }

  function selectAndPlay(syntax, catKey, label) {
    if (window.CLB.toast) window.CLB.toast.showToast(`Đã chọn cửa [${label || syntax}]. Đang mở ứng dụng MBBank...`, 'success');
    if (window.CLB.audio) window.CLB.audio.playTone(600, 'sine', 0.1);

    if (window.CLB.phone) {
      window.CLB.phone.togglePhone(true);
      window.CLB.phone.setPhoneBetChoice(syntax, catKey, label);
    }
  }

  function setGameMode(gameKey) {
    if (window.CLB.config) window.CLB.config.currentGame = gameKey;

    document.querySelectorAll('.game-tab-button').forEach(btn => {
      const match = btn.getAttribute('data-game') === gameKey;
      btn.classList.toggle('active', match);
      btn.setAttribute('aria-selected', match ? 'true' : 'false');
    });

    renderGameRules(gameKey);
    if (window.CLB.audio) window.CLB.audio.playTone(520, 'sine', 0.06);
  }

  function streamNewBigWinner() {
    const tbody = document.getElementById('body-top-winners');
    if (!tbody) return;

    const names = ['Nguyễn V.***', 'Trần H.***', 'Lê T.***', 'Phạm D.***', 'Vũ Q.***', 'Hoàng M.***'];
    const games = ['CLTX+2', 'CLTX', 'XIÊN', '1 PHẦN 3', 'TÀI XỈU'];
    const amounts = [125000, 240000, 580000, 950000, 1950000, 3900000];

    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomGame = games[Math.floor(Math.random() * games.length)];
    const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const tr = document.createElement('tr');
    tr.style.animation = 'rowHighlight 1.5s ease-out';
    tr.innerHTML = `
      <td style="color: #60a5fa; font-weight: 700;">${randomName}</td>
      <td style="color: #fbbf24; font-weight: 700;">+${randomAmount.toLocaleString('vi-VN')}đ</td>
      <td><span class="game-badge-tag">${randomGame}</span></td>
      <td style="color: #9ca3af;">${timeStr}</td>
    `;

    tbody.insertBefore(tr, tbody.firstChild);
    if (tbody.children.length > 5) {
      tbody.removeChild(tbody.lastChild);
    }
  }

  function searchTransaction() {
    const input = document.getElementById('input-search-tx');
    const resultBox = document.getElementById('search-result-box');
    if (!input || !resultBox) return;

    const query = input.value.trim().toUpperCase();
    if (!query) {
      if (window.CLB.toast) window.CLB.toast.showToast('Vui lòng nhập mã giao dịch để tra cứu!', 'warning');
      return;
    }

    resultBox.style.display = 'block';
    resultBox.innerHTML = `
      <div style="background: rgba(30, 41, 59, 0.9); border: 1px solid #38bdf8; border-radius: 8px; padding: 12px; margin-top: 10px; font-size: 13px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span>Mã GD: <strong style="color: #38bdf8;">${query}</strong></span>
          <span style="color: #22c55e; font-weight: 700;"><i class="fa-solid fa-check"></i> THẮNG CƯỢC</span>
        </div>
        <div style="color: #cbd5e1;">Nội dung: <strong>Dungdz TC</strong> • Số tiền cược: <strong>100,000đ</strong></div>
        <div style="color: #fbbf24; font-weight: 700; margin-top: 4px;">Tiền thưởng: +195,000đ (Đã thanh toán NAPAS 24/7)</div>
      </div>
    `;
    if (window.CLB.audio) window.CLB.audio.playChime(true);
  }

  window.CLB.game = {
    openQrModal,
    closeQrModal,
    renderGameRules,
    selectAndPlay,
    setGameMode,
    streamNewBigWinner,
    searchTransaction
  };
})();
