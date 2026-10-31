# Quy ước commit

Dự án `ecommerce-marketplace` là ứng dụng marketplace xây dựng bằng Expo, React Native và Expo Router, sử dụng Supabase cho dữ liệu. Commit dùng định dạng Conventional Commits để lịch sử thay đổi dễ đọc và dễ tra cứu.

## Định dạng

```text
<type>(<scope>): <mô tả ngắn>
```

`scope` có thể bỏ nếu thay đổi ảnh hưởng nhiều khu vực và không có khu vực chính.

```text
feat(cart): thêm thao tác cập nhật số lượng sản phẩm
fix(auth): giữ trạng thái đăng nhập khi mở lại ứng dụng
docs(project): cập nhật hướng dẫn commit
chore(config): chỉnh cấu hình Expo
```

## Type

| Type | Dùng khi |
|---|---|
| `feat` | Thêm hoặc mở rộng chức năng cho người mua hoặc quản trị viên |
| `fix` | Sửa lỗi trong giao diện, luồng nghiệp vụ hoặc dữ liệu |
| `refactor` | Cải tổ mã nguồn mà không thay đổi hành vi bên ngoài |
| `perf` | Cải thiện hiệu năng ứng dụng, truy vấn hoặc hiển thị |
| `style` | Chỉnh định dạng mã hoặc giao diện mà không đổi nghiệp vụ |
| `test` | Thêm hoặc sửa kiểm thử |
| `docs` | Thay đổi tài liệu |
| `build` | Thay đổi dependency, cấu hình Expo hoặc công cụ build |
| `ci` | Thay đổi quy trình CI/CD |
| `chore` | Công việc bảo trì khác không làm thay đổi chức năng ứng dụng |
| `revert` | Hoàn tác một commit trước đó |

Không tự tạo type mới nếu chưa thống nhất với nhóm.

## Scope

Chọn scope theo tính năng hoặc khu vực bị thay đổi trực tiếp. Có thể dùng các scope sau:

| Scope | Khu vực |
|---|---|
| `auth` | Đăng nhập, đăng ký, khôi phục mật khẩu và phiên người dùng |
| `home` | Trang chủ, danh mục nổi bật, banner và sản phẩm gợi ý |
| `product` | Chi tiết sản phẩm, biến thể, ảnh và đánh giá sản phẩm |
| `category` | Danh mục sản phẩm |
| `search` | Tìm kiếm sản phẩm |
| `filter` | Bộ lọc và sắp xếp sản phẩm |
| `cart` | Giỏ hàng và mã giảm giá áp dụng trong giỏ |
| `favorite` | Danh sách sản phẩm yêu thích |
| `order` | Tạo đơn, danh sách đơn và chi tiết đơn |
| `payment` | Phương thức và luồng thanh toán |
| `review` | Đánh giá sản phẩm |
| `feedback` | Gửi phản hồi sau mua hàng |
| `admin` | Các màn hình và thao tác quản trị |
| `supabase` | Schema, seed data, policy hoặc tích hợp Supabase |
| `navigation` | Expo Router, route hoặc điều hướng giữa màn hình |
| `ui` | Thành phần giao diện dùng chung hoặc thiết kế tổng thể |
| `config` | Cấu hình ứng dụng và môi trường |
| `deps` | Thêm, gỡ hoặc cập nhật dependency |
| `docs` | Tài liệu dự án |
| `project` | Thay đổi khung hoặc cấu trúc tổng thể của dự án |

Chỉ dùng scope phù hợp với thay đổi; không cần thêm scope mới cho mỗi thư mục. Khi một commit thay đổi nhiều khu vực, chọn khu vực chính hoặc bỏ scope.

## Cách viết mô tả

- Viết ngắn gọn và nêu kết quả thay đổi.
- Dùng tiếng Việt có dấu hoặc tiếng Anh nhất quán trong cùng một mô tả.
- Bắt đầu bằng chữ thường; không đặt dấu chấm ở cuối.
- Giữ tiêu đề trong khoảng 72 ký tự nếu có thể.
- Mỗi commit nên tập trung vào một thay đổi có thể giải thích độc lập.
- Tránh mô tả mơ hồ như `update`, `fix bug`, `sửa code`, `done` hoặc `test thử`.
- Không đưa tên người thực hiện, ngày tháng hoặc số thứ tự vào tiêu đề.

## Nội dung commit

Thay đổi nhỏ chỉ cần tiêu đề. Với thay đổi cần thêm bối cảnh, viết phần nội dung sau một dòng trống và chỉ giữ các mục có thông tin:

```text
feat(order): thêm màn hình chi tiết đơn hàng

Lý do:
- Người mua cần xem trạng thái và sản phẩm trong từng đơn.

Thay đổi:
- Thêm route chi tiết đơn và tải dữ liệu đơn từ Supabase.

Kiểm tra:
- Mở màn hình danh sách đơn và chọn một đơn hàng.

Refs: #123
```

`Refs` là tùy chọn, dùng khi commit liên quan đến issue hoặc ticket.

## Breaking change

Nếu thay đổi phá vỡ cách sử dụng hiện tại, thêm `!` sau type/scope và mô tả tác động bằng footer `BREAKING CHANGE`:

```text
feat(supabase)!: đổi cấu trúc dữ liệu biến thể sản phẩm

BREAKING CHANGE: cần cập nhật dữ liệu sản phẩm theo schema biến thể mới.
```

Chỉ đánh dấu breaking change khi người dùng hoặc mã hiện có cần thay đổi để tiếp tục hoạt động.

## Ví dụ theo dự án

```text
feat(auth): thêm khôi phục mật khẩu
feat(product): hiển thị lựa chọn màu sắc và kích cỡ
feat(search): tìm sản phẩm theo tên
feat(cart): áp dụng mã giảm giá cho đơn hàng
feat(order): thêm màn hình theo dõi đơn hàng
feat(admin): thêm biểu đồ thống kê doanh thu
fix(favorite): đồng bộ danh sách yêu thích sau khi đăng nhập
fix(payment): ngăn tạo đơn khi chưa chọn phương thức thanh toán
refactor(supabase): tách truy vấn sản phẩm khỏi màn hình
style(ui): căn chỉnh khoảng cách trên thẻ sản phẩm
build(deps): cập nhật dependency tương thích với Expo SDK
docs(project): bổ sung hướng dẫn thiết lập Supabase
```

Các ví dụ chỉ minh họa định dạng; hãy mô tả đúng nội dung thực tế của commit.

## Ví dụ không nên dùng

```text
update code
fix bug
feat: update
sửa giao diện
commit lần 2
```

Commit tạm như `wip`, `temp` hoặc `save` cần được đổi tên hoặc squash trước khi đưa vào nhánh chính.
