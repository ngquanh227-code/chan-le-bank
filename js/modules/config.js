/**
 * Module: Config & Game Rules Data
 * Defines game configurations, payout multipliers, numbers and rules.
 */
(function() {
  'use strict';
  window.CLB = window.CLB || {};

  window.CLB.config = {
    soundEnabled: true,
    densityCompact: false,
    currentGame: 'cltx',
    activeBank: {
      name: 'MBBank',
      accountNumber: '0644888866',
      owner: 'NGUYEN VAN PHONG',
      memo: 'C'
    },
    gameConfigs: {
      cltx2: {
        key: 'cltx2',
        titleIcon: '<i class="fa-solid fa-dice" style="color: #cbd5e1;"></i> <i class="fa-solid fa-dice" style="color: #cbd5e1;"></i>',
        title: 'CHẴN LẺ - TÀI XỈU - CỘNG 2 SỐ',
        colHeader: 'Tổng 2 số cuối',
        rulesType: 'sum2',
        rows: [
          { syntax: 'Dungdz TC', name: 'Chẵn', memo: 'Dungdz TC', numbers: [0, 2, 4, 6, 8], rate: 1.95, rateLabel: 'x 1.95' },
          { syntax: 'Dungdz TL', name: 'Lẻ', memo: 'Dungdz TL', numbers: [1, 3, 5, 7, 9], rate: 1.95, rateLabel: 'x 1.95' },
          { syntax: 'Dungdz TT', name: 'Tài', memo: 'Dungdz TT', numbers: [5, 6, 7, 8, 9], rate: 1.95, rateLabel: 'x 1.95' },
          { syntax: 'Dungdz TX', name: 'Xỉu', memo: 'Dungdz TX', numbers: [0, 1, 2, 3, 4], rate: 1.95, rateLabel: 'x 1.95' }
        ],
        notes: [
          'Kết quả dự theo <em>Tổng 2 số cuối</em> của mã ID/Trace.',
          'Tỉ lệ giảm <em>0.05</em> cho lệnh từ <em>50K</em> trở lên.',
          'Tỉ lệ giảm <em>0.1</em> cho lệnh từ <em>1tr</em> trở lên.',
          'Khách hàng chơi có <em>10% tỉ lệ thanh toán 2 lần!</em>'
        ]
      },
      cltx: {
        key: 'cltx',
        titleIcon: '<i class="fa-solid fa-dice" style="color: #cbd5e1;"></i> <i class="fa-solid fa-dice" style="color: #cbd5e1;"></i>',
        title: 'CHẴN LẺ TÀI XỈU',
        colHeader: 'Số cuối',
        rulesType: 'last1',
        rows: [
          { syntax: 'Dungdz C', name: 'Chẵn', memo: 'Dungdz C', numbers: [2, 4, 6, 8], rate: 2.4, rateLabel: 'x 2.4' },
          { syntax: 'Dungdz L', name: 'Lẻ', memo: 'Dungdz L', numbers: [1, 3, 5, 7], rate: 2.4, rateLabel: 'x 2.4' },
          { syntax: 'Dungdz T', name: 'Tài', memo: 'Dungdz T', numbers: [5, 6, 7, 8], rate: 2.4, rateLabel: 'x 2.4' },
          { syntax: 'Dungdz X', name: 'Xỉu', memo: 'Dungdz X', numbers: [1, 2, 3, 4], rate: 2.4, rateLabel: 'x 2.4' }
        ],
        notes: [
          'Kết quả dự theo <em>Số cuối</em> của mã ID/Trace.',
          'Khách hàng chơi có <em>10% tỉ lệ thanh toán 2 lần!</em>'
        ]
      },
      tx: {
        key: 'tx',
        titleIcon: '<i class="fa-solid fa-dice-five" style="color: #cbd5e1;"></i>',
        title: 'TÀI XỈU',
        colHeader: 'Số cuối',
        rulesType: 'last1',
        rows: [
          { syntax: 'Dungdz T', name: 'Tài', memo: 'Dungdz T', numbers: [5, 6, 7, 8], rate: 2.4, rateLabel: 'x 2.4' },
          { syntax: 'Dungdz X', name: 'Xỉu', memo: 'Dungdz X', numbers: [1, 2, 3, 4], rate: 2.4, rateLabel: 'x 2.4' }
        ],
        notes: [
          'Kết quả dự theo <em>Số cuối</em> của mã ID/Trace.',
          'Khách hàng chơi có <em>10% tỉ lệ thanh toán 2 lần!</em>'
        ]
      },
      '1p3': {
        key: '1p3',
        titleIcon: '<i class="fa-solid fa-percent" style="color: #cbd5e1;"></i>',
        title: '1 PHẦN 3',
        colHeader: 'Số cuối',
        rulesType: 'last1',
        rows: [
          { syntax: 'Dungdz N1', name: 'Nhóm 1', memo: 'Dungdz N1', numbers: [1, 5, 7], rate: 3.0, rateLabel: 'x 3' },
          { syntax: 'Dungdz N2', name: 'Nhóm 2', memo: 'Dungdz N2', numbers: [2, 4, 8], rate: 3.0, rateLabel: 'x 3' },
          { syntax: 'Dungdz N3', name: 'Nhóm 3', memo: 'Dungdz N3', numbers: [3, 6, 9], rate: 3.0, rateLabel: 'x 3' }
        ],
        notes: [
          'Kết quả dự theo <em>Số cuối</em> của mã ID/Trace.',
          'Khách hàng chơi có <em>10% tỉ lệ thanh toán 2 lần!</em>'
        ]
      },
      xien: {
        key: 'xien',
        titleIcon: '<i class="fa-solid fa-bolt" style="color: #cbd5e1;"></i>',
        title: 'XIÊN SỐ',
        colHeader: 'Tổng 2 số cuối',
        rulesType: 'sum2',
        rows: [
          { syntax: 'Dungdz CX', name: 'Chẵn Xỉu', memo: 'Dungdz CX', numbers: [0, 2, 4], rate: 3.0, rateLabel: 'x 3' },
          { syntax: 'Dungdz LT', name: 'Lẻ Tài', memo: 'Dungdz LT', numbers: [5, 7, 9], rate: 3.0, rateLabel: 'x 3' },
          { syntax: 'Dungdz CT', name: 'Chẵn Tài', memo: 'Dungdz CT', numbers: [6, 8], rate: 3.5, rateLabel: 'x 3.5' },
          { syntax: 'Dungdz LX', name: 'Lẻ Xỉu', memo: 'Dungdz LX', numbers: [1, 3], rate: 3.5, rateLabel: 'x 3.5' }
        ],
        notes: [
          'Chẵn Xỉu: 0, 2, 4 • Lẻ Tài: 5, 7, 9',
          'Chẵn Tài: 6, 8 • Lẻ Xỉu: 1, 3',
          'Kết quả dựa vào <em>Tổng 2 số cuối</em> của mã giao dịch.'
        ]
      },
      doanso: {
        key: 'doanso',
        titleIcon: '<i class="fa-solid fa-bullseye" style="color: #cbd5e1;"></i>',
        title: 'ĐOÁN SỐ CHÍNH XÁC',
        colHeader: 'Số cuối',
        rulesType: 'exact',
        rows: [
          { syntax: 'Dungdz 0', name: 'Số 0', memo: 'Dungdz 0', numbers: [0], rate: 7.5, rateLabel: 'x 7.5' },
          { syntax: 'Dungdz 1', name: 'Số 1', memo: 'Dungdz 1', numbers: [1], rate: 7.5, rateLabel: 'x 7.5' },
          { syntax: 'Dungdz 5', name: 'Số 5', memo: 'Dungdz 5', numbers: [5], rate: 7.5, rateLabel: 'x 7.5' },
          { syntax: 'Dungdz 9', name: 'Số 9', memo: 'Dungdz 9', numbers: [9], rate: 7.5, rateLabel: 'x 7.5' }
        ],
        notes: [
          'Dự đoán trúng đúng 1 số đuôi duy nhất.',
          'Tỉ lệ trả thưởng cực cao <em>x 7.5 lần</em> tiền cược.'
        ]
      },
      tong3: {
        key: 'tong3',
        titleIcon: '<i class="fa-solid fa-layer-group" style="color: #cbd5e1;"></i>',
        title: 'TỔNG 3 SỐ CUỐI',
        colHeader: 'Tổng 3 số cuối',
        rulesType: 'sum3',
        rows: [
          { syntax: 'Dungdz T3C', name: 'Chẵn', memo: 'Dungdz T3C', numbers: [0, 2, 4, 6, 8], rate: 1.95, rateLabel: 'x 1.95' },
          { syntax: 'Dungdz T3L', name: 'Lẻ', memo: 'Dungdz T3L', numbers: [1, 3, 5, 7, 9], rate: 1.95, rateLabel: 'x 1.95' }
        ],
        notes: [
          'Kết quả cộng tổng 3 số cuối cùng của mã ID GD.',
          'Nếu tổng ra chẵn hoặc lẻ theo lựa chọn thì nhận thưởng.'
        ]
      }
    }
  };
})();
