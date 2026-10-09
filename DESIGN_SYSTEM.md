# TRUM.TOP - CHẴN LẺ BANK FAKE PHONE TRANSFER SIMULATOR (V2)

> **Cập nhật Nâng Cấp V2:** Đã sửa hoàn toàn lỗi nút bấm, cập nhật mã giao dịch sang chuẩn ngân hàng chuyển nhanh **Mã FT (Funds Transfer: `FT26...`)**, thiết kế lại biên lai theo chuẩn biên lai giấy trắng chính thức của app MBBank Việt Nam, phóng to số đuôi để so kết quả, và tự động bắn thông báo trượt từ Dynamic Island sau 3.5 giây!

---

## 1. Các Nâng Cấp Trực Quan Của Điện Thoại Giả Lập

### 1.1 Khắc Phục Lỗi Nút Bấm Chuyển Khoản
- Đồng bộ ID nút `btn-phone-submit-transfer` giữa HTML và Javascript.
- Khi người dùng bấm **XÁC NHẬN CHUYỂN TIỀN**, hệ thống ngay lập tức kích hoạt hiệu ứng quét FaceID và hiển thị biên lai sau 0.9s.

### 1.2 Sinh Mã Giao Dịch Chuẩn `FT...` (Fast Transfer 247)
- Thay thế mã giả trước đây bằng mã chuyển tiền chuẩn ngân hàng quốc gia: **`FT26` + 9 chữ số ngẫu nhiên** (ví dụ: `FT26281903824`).
- **Số cuối của mã FT (ví dụ: `4`)** chính là con số quyết định thắng thua của trò chơi:
  - Nếu cược `C` (Chẵn) ➔ Số `4` là Chẵn ➔ **THẮNG (+120,000đ)**.
  - Nếu cược `L` (Lẻ) ➔ Số `4` là Chẵn ➔ **THUA (0đ)**.

### 1.3 Thiết Kế Lại Biên Lai Chuẩn App MBBank Thật 100%
- Giao diện thẻ biên lai trắng bo góc (`.receipt-white-card`) với viền bóng đổ chân thực:
  - Tích tròn xanh lá chuẩn ngân hàng `fa-solid fa-check`.
  - Dòng chữ: **GIAO DỊCH THÀNH CÔNG**.
  - Số tiền trừ lớn màu đen đậm: `- 50,000 VND`.
  - Các trường thông tin rõ ràng:
    - *Tài khoản trích nợ:* `0888999888 (NGUYEN TUAN DUNG)`
    - *Tài khoản thụ hưởng:* `0644888866`
    - *Tên người thụ hưởng:* `NGUYEN VAN PHONG`
    - *Ngân hàng thụ hưởng:* `MB - NGÂN HÀNG QUÂN ĐỘI`
    - *Mã giao dịch (Mã FT):* Hiển thị trong badge nổi bật `FT26281903824`
    - *Nội dung chuyển tiền:* `C`
    - *Phí giao dịch:* `0 VND (Miễn phí 247)`
  - Hộp thông báo kết quả:
    - Hiển thị đuôi mã FT trong ô màu tím hồng.
    - Dòng kết luận: `KHỚP CỬA C (CHẴN) ➔ THẮNG (+120,000đ)`.

### 1.4 Hiệu Ứng Trả Thưởng Tự Động Trong 3.5 Giây
- Sau 3.5 giây, thanh thông báo Dynamic Island trên đỉnh điện thoại trượt xuống kèm tiếng chuông ting ting:
  *🔔 MBBank Biến động số dư: TK 08xxx888 +120,000 VND lúc 01:09. ND: NGUYEN TUAN DUNG chuyen tien tra thuong*
- Số dư tài khoản trong điện thoại được cộng ngay lập tức.
- Trên trang web chính, một dòng lịch sử cược mới lập tức được chèn vào đầu bảng **LỊCH SỬ CHƠI**.
