# WayEcho V7 — Đánh giá theo vai người dùng và các sửa đổi

Nhánh: `imninh`. Phạm vi: đóng vai Traveler (người khiếm thị), Business, Guide, Volunteer, Admin; dùng thử web local (Next dev), quét HTTP toàn bộ route, chạy thử luồng đặt chỗ Traveler → Business bằng API.

## 1. Kết quả kiểm tra nhanh

| Hạng mục | Kết quả |
|---|---|
| Quét HTTP ~48 route | Tất cả 200 hoặc 307 (portal cần đăng nhập, đúng thiết kế). `/item` không kèm `id` trả 404 (chủ ý). |
| Ảnh được tham chiếu trong code | Không thiếu file nào trong `public/assets`. |
| Anchor trong menu (`/help#contact`, `/volunteer#wbu-guidelines`, `#audit-feed`) | Tồn tại. |
| Luồng Traveler → Business | Khách đặt `demo-hotel` kèm yêu cầu hỗ trợ → Business thấy → xác nhận → khách thấy trạng thái `confirmed` và có thông báo. Đạt. |
| `npm test` | Trước: 116/117 (1 test Header hỏng). Sau: 118/118. |
| `npm run lint` | 0 lỗi, 8 cảnh báo cũ (`window.location.assign`). |
| `npm run build` | Đạt. |

## 2. Nhận xét theo từng vai (chê thẳng)

**Traveler (người mù/nhìn kém)**
- Trang chủ: lúc vừa vào, 3/4 ô ảnh ở hero trắng trơn vì ảnh `lazy` dù nằm ngay màn hình đầu. Ấn tượng đầu tiên rất tệ.
- Danh sách điểm đến ghi "Đã khảo sát thực địa — …" cho cả những địa điểm đang gắn nhãn "minh họa". Mâu thuẫn, và với người khiếm thị thì đây là thông tin an toàn: tin nhầm lối dốc hay thang máy không có là nguy hiểm.
- Nhãn "Accessibility:" bằng tiếng Anh trên thẻ địa điểm; trình đọc màn hình đọc lẫn giọng.
- Trang đặt chỗ vẫn dùng tiêu đề tiếng Anh "Booking + Accessibility Request".

**Business**
- Màn quản lý đặt chỗ đầy thuật ngữ nội bộ: "Booking Management", "mô phỏng BR06", "confirm/reject", "notification". Người chủ khách sạn không hiểu BR06 là gì.
- API trả `ownerId` (mã khách) về cho Business, thừa so với nhu cầu.

**Guide**
- Trang đăng ký nói rõ chưa có quy trình xét duyệt và form không lưu gì. Trung thực, nhưng người dùng điền form xong không nhận được gì, dễ thấy bị lừa. Cần một kênh liên hệ thật khi triển khai.

**Volunteer**
- Trang `/volunteer` công khai, không cần đăng nhập, nhưng hiển thị tên, mức khiếm thị và số điện thoại (che một phần) của "khách". Về nguyên tắc là rò rỉ riêng tư; hiện chỉ là dữ liệu mẫu nhưng không có nhãn DEMO.
- Số liệu "100% ★ an toàn & thấu cảm", "42.5 giờ", mã thẻ "TNV-HN09" là bịa, trái quy tắc "không bịa số liệu" trong `AGENTS.md`.
- Nút "Nhận ca hỗ trợ này" chỉ đổi state trên trình duyệt, không lưu, không báo cho khách. Người dùng tưởng đã nhận ca thật.

**Admin**
- Chỉ có link ở Footer, đúng yêu cầu. Chưa kiểm thử sâu được chức năng điều phối ở vòng này.

**Cổng Đối tác (`/partner`)**
- Thống kê "100% chuẩn WBU", "36+ điểm di sản có dữ liệu tiếp cận" (thực tế 25 điểm trong danh mục), "Escrow bảo vệ 100% minh bạch" đều là tuyên bố không có căn cứ. Ký quỹ chỉ là mô phỏng.

## 3. Những gì đã sửa

| File | Sửa đổi |
|---|---|
| `app/page.jsx` | Ba ô ảnh hero chuyển `loading="eager"`, hết trắng khi vào trang. |
| `lib/accessStatus.js` (mới), `components/DestinationCard.jsx`, `app/destination/DestinationView.jsx` | Chuỗi "Đã khảo sát…" được hiển thị thành "Mô tả tham khảo, chưa xác minh tại chỗ — …". Đổi nhãn "Accessibility:" thành "Tiếp cận:". Dữ liệu gốc không bị sửa. |
| `app/partner/page.jsx` | Bỏ số liệu bịa. Số điểm đến lấy từ danh mục thật; thêm nhãn DEMO và "mô phỏng". |
| `app/volunteer/page.jsx` | Thêm banner DEMO rõ ràng; ghi chú chỉ số an toàn là minh họa và thao tác nhận ca không được lưu. |
| `app/business/bookings/page.jsx`, `app/booking/page.jsx` | Việt hóa thuật ngữ, bỏ "BR06". |
| `components/Header.jsx` | Viết lại điều kiện hiển thị "Vào bảng điều khiển" (không còn chuỗi `role!=="admin"`) nhưng hành vi giữ nguyên, sửa test Header đang hỏng. |
| `tests/access-status.test.mjs` (mới) | Test cho `honestAccessStatus`. |

## 3b. Đợt sửa bổ sung

| File | Sửa đổi |
|---|---|
| `lib/permissions.js`, `app/api/bookings/route.js`, `app/api/requests/route.js` | Thêm `forViewer`: Business và Guide không còn nhận `ownerId` (mã khách) trong phản hồi. Traveler và Admin giữ nguyên. Có test. |
| `app/volunteer/page.jsx` | Ẩn tên và số điện thoại mẫu ("Khách A/B/C (minh họa)", "Số điện thoại ẩn"), bỏ mã thẻ và tên người thật-giống. Nút "Gọi điện" tạo link `tel:` rỗng nên đổi thành nút vô hiệu hóa ghi rõ chưa có trong DEMO. |

Kiểm tra lại sau đợt này: `npm test` 119/119, `npm run build` đạt, `scripts/http-smoke.mjs` 241/241 (gồm kiểm tra phân quyền các vai và khởi động lại server), lint 0 lỗi.

## 4. Chưa làm / đề xuất tiếp

1. Volunteer: vẫn nên đặt sau đăng nhập và lưu ca thật qua API; hiện chỉ là bản minh họa đã ẩn dữ liệu cá nhân.
2. Thay 15 ảnh trang Điểm đến theo `WAYECHO V7.docx` (cần nguồn ảnh có quyền sử dụng rõ ràng; chưa làm vì không có ảnh đã xác minh bản quyền).
3. Chưa kiểm bằng screen reader thật, chưa kiểm responsive trên thiết bị thật.
4. 8 cảnh báo lint `window.location.assign` còn nguyên: chủ ý tải lại trang đầy đủ sau đăng nhập/đăng xuất để làm mới phiên, đổi sang `router.push` cần kiểm lại luồng phiên.
5. Rà soát toàn bộ Phần III–IX của master prompt mới ở mức quét; Header có đúng 5 nhóm, Admin chỉ ở Footer (đã có test).
