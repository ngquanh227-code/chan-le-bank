# CHẴN LẺ BANK (TRUM.TOP)

> Giao diện Dark Fintech Dashboard chuyên nghiệp & Giả lập Chuyển khoản MBBank 24/7 chân thực.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![WCAG 2.2 AA](https://img.shields.io/badge/WCAG-2.2%20AA-success.svg)](https://www.w3.org/WAI/standards-guidelines/wcag/)

---

## 🌟 Tính Năng Nổi Bật

### 1. Giao diện Web Dashboard Trùm (Dark Fintech)
- **Chuẩn giao diện TRUM.TOP**: Thiết kế theo phong cách Dark Mode cao cấp với bảng màu vàng hổ phách (`#f8c332`), xanh Navy MBBank (`#003399`) và nền tối tương phản cao (`#121417`, `#20242a`).
- **Hệ thống Game Chẵn Lẻ & Tài Xỉu đa dạng**:
  - Chẵn Lẻ (`C`, `L` - Tỉ lệ 2.4)
  - CLTX 2 (`C2`, `L2` - Tỉ lệ 1.98)
  - Đoán Số, 1 Phần 3, Tổng 3, Xiên
- **7 Bảng dữ liệu thời gian thực**:
  - Bảng tài khoản nhận tiền (STK MBBank, tên chủ tài khoản, trạng thái hoạt động, hạn mức ngày/tháng).
  - Bảng hạn mức cược & công thức tính thắng thua.
  - Lịch sử chơi trực tiếp (My Bet History) tự động cập nhật khi chuyển tiền.
  - Người chơi thắng lớn (Live Winner Stream).
  - Bảng xếp hạng Đại gia tuần.
  - Nhiệm vụ ngày nhận thưởng mốc cược.
  - Tra cứu mã giao dịch thời gian thực.
- **Tạo mã VietQR động**: Tự động tạo mã QR VietQR chuẩn Napas 247 khi bấm sao chép số tài khoản.
- **Âm thanh Web Audio Synth tích hợp**: Hiệu ứng ting ting khi nạp tiền, thắng cược, thua cược không cần tải file âm thanh ngoài.

### 2. Giả Lập Smartphone Chuyển Tiền MBBank Chân Thực
- **Khung iPhone 16 Pro viền Titanium**: Viền vát kim loại ánh bạc, cụm Dynamic Island thời gian thực và kính phản quang bóng loáng.
- **Quy trình chuyển tiền chuẩn xác**:
  - Chọn mệnh giá (`10k`, `20k`, `50k`, `100k`, `200k`, `500k`).
  - Chọn nội dung cược (`C`, `L`, `T`, `X`, `C2`, `L2`).
  - Quét FaceID hoạt họa radar bảo mật MBBank.
  - Tạo mã giao dịch **Napas 247 chuẩn `FT26...`** (9 chữ số ngẫu nhiên) và tính thắng thua theo số cuối mã FT.
- **Hóa đơn biên lai trắng MBBank chính hãng**:
  - Icon thành công xanh lục, mã FT dập nổi, dấu phân cách xé biên lai, chi tiết người gửi/người nhận.
- **Hệ thống Thông Báo Biến Động Số Dư Dropdown**:
  - Thông báo trừ tiền cược tức thì ngay khi chuyển (`-50,000đ`).
  - Thông báo trả thưởng 5s tự động khi thắng (`+120,000đ`).
  - Thông báo khi thua cược kèm số dư còn lại trong tài khoản.
  - Tất cả thông báo đều hiển thị số dư thực tế (`Số dư: ... VND`).

### 3. Tính Năng Nạp Tiền & Chỉnh Số Dư Linh Hoạt
- Mở ngăn kéo **Top-Up Drawer** khi cược hết tiền.
- Nạp nhanh với 1 chạm: `+500k`, `+1M`, `+2M`, `+5M`, `+10M`, `+50M`.
- Nút **Nhập số dư tùy chỉnh**: Cho phép bạn gõ bất kỳ số tiền nào bạn muốn.
- Nút **Khôi phục số dư 10,000,000đ**: Đưa tài khoản về trạng thái ban đầu bất cứ lúc nào.

### 4. Tối Ưu Toàn Diện Trên Điện Thoại Di Động (Mobile Responsive)
- **Chế độ Full-Screen App trên Smartphone**: Khi mở trên điện thoại, giả lập tự động bung toàn màn hình thành app native MBBank.
- **Chống tràn màn hình**: Toàn bộ 7 bảng dữ liệu hỗ trợ cuộn ngang mượt mà.
- **Thanh menu trượt ngang**: Menu danh mục dạng chips lướt ngón tay êm ái.
- **Touch-zone thân thiện**: Mọi nút bấm đều đạt kích thước tối thiểu 42px – 44px.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Thử

### Cách 1: Chạy trực tiếp qua Live Server hoặc Python
```bash
# Clone repository
git clone https://github.com/ngquanh227-code/chan-le-bank.git

# Di chuyển vào thư mục
cd chan-le-bank

# Chạy server với Python (hoặc mở index.html bằng trình duyệt)
python -m http.server 8888
```
Mở trình duyệt truy cập: `http://localhost:8888/`

---

## 🛠️ Cấu Trúc Dự Án
```
chan-le-bank/
├── index.html           # Cấu trúc Dashboard & Smartphone simulator (WCAG 2.2 AA)
├── css/
│   └── style.css        # Hệ thống Design Tokens, Dark Fintech Theme & Mobile Responsive
├── js/
│   └── app.js           # Engine game, Web Audio Synth, Phone Simulator & Biến động số dư
├── DESIGN_SYSTEM.md     # Tài liệu quy chuẩn Design Tokens & 8-State UI Model
└── README.md            # Hướng dẫn chi tiết & tài liệu dự án
```

---

## 📄 Bản Quyền
Dự án được xây dựng phục vụ mục đích nghiên cứu, học tập phát triển giao diện web fintech hiện đại.
