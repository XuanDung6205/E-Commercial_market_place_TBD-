-- Sample data for the Chợ Mây marketplace app.
-- Run schema.sql and policies.sql first, then run this file in Supabase SQL Editor.
-- This script is safe to re-run: catalog rows are upserted and demo user rows are deduplicated.

-- -----------------------------------------------------------------------------
-- Public catalog: categories and products
-- -----------------------------------------------------------------------------

insert into public.categories (name, slug, description, image_url, is_active, sort_order)
values
  ('Thời trang nữ', 'thoi-trang-nu', 'Trang phục và phụ kiện dành cho nữ.', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80', true, 1),
  ('Thời trang nam', 'thoi-trang-nam', 'Trang phục thường ngày dành cho nam.', 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80', true, 2),
  ('Điện tử', 'dien-tu', 'Thiết bị công nghệ và phụ kiện điện tử.', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80', true, 3),
  ('Nhà cửa & đời sống', 'nha-cua-doi-song', 'Đồ dùng tiện ích cho không gian sống.', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80', true, 4),
  ('Làm đẹp', 'lam-dep', 'Sản phẩm chăm sóc cá nhân và làm đẹp.', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80', true, 5)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  image_url = excluded.image_url,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();

with seed_products (category_slug, name, slug, sku, description, price, compare_at_price, stock_quantity) as (
  values
    ('thoi-trang-nu', 'Túi đeo chéo Mini Cloud', 'tui-deo-cheo-mini-cloud', 'DEMO-BAG-001', 'Thiết kế gọn nhẹ, dễ phối đồ khi đi làm hoặc dạo phố.', 329000::numeric, 399000::numeric, 28),
    ('thoi-trang-nu', 'Áo sơ mi Linen thanh lịch', 'ao-so-mi-linen-thanh-lich', 'DEMO-WOMEN-001', 'Chất liệu linen thoáng mát, phom dáng thoải mái.', 289000::numeric, 349000::numeric, 42),
    ('thoi-trang-nam', 'Áo thun Cotton Basic', 'ao-thun-cotton-basic', 'DEMO-MEN-001', 'Áo thun cotton mềm mại, phù hợp mặc hằng ngày.', 189000::numeric, 229000::numeric, 65),
    ('thoi-trang-nam', 'Giày Sneaker Urban', 'giay-sneaker-urban', 'DEMO-SHOE-001', 'Giày sneaker phong cách tối giản với đế êm nhẹ.', 649000::numeric, 799000::numeric, 24),
    ('dien-tu', 'Tai nghe Bluetooth Studio', 'tai-nghe-bluetooth-studio', 'DEMO-AUDIO-001', 'Tai nghe không dây, âm thanh rõ và thời lượng pin dài.', 590000::numeric, 790000::numeric, 31),
    ('dien-tu', 'Đồng hồ thông minh Fit S', 'dong-ho-thong-minh-fit-s', 'DEMO-WATCH-001', 'Theo dõi vận động, nhịp tim và thông báo trên điện thoại.', 890000::numeric, 1090000::numeric, 19),
    ('nha-cua-doi-song', 'Bình giữ nhiệt Daily 500ml', 'binh-giu-nhiet-daily-500ml', 'DEMO-HOME-001', 'Bình giữ nhiệt gọn nhẹ, phù hợp mang theo mỗi ngày.', 219000::numeric, 269000::numeric, 50),
    ('nha-cua-doi-song', 'Đèn bàn đọc sách Aura', 'den-ban-doc-sach-aura', 'DEMO-LAMP-001', 'Ánh sáng dịu mắt, thiết kế phù hợp bàn học và bàn làm việc.', 459000::numeric, 549000::numeric, 17),
    ('lam-dep', 'Bộ chăm sóc da Daily Care', 'bo-cham-soc-da-daily-care', 'DEMO-BEAUTY-001', 'Bộ sản phẩm chăm sóc da cơ bản dùng hằng ngày.', 399000::numeric, 479000::numeric, 36)
)
insert into public.products (
  category_id, name, slug, sku, description, price, compare_at_price,
  stock_quantity, status
)
select
  c.id, s.name, s.slug, s.sku, s.description, s.price, s.compare_at_price,
  s.stock_quantity, 'active'
from seed_products s
join public.categories c on c.slug = s.category_slug
on conflict (slug) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  sku = excluded.sku,
  description = excluded.description,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  stock_quantity = excluded.stock_quantity,
  status = excluded.status,
  updated_at = now();

-- Product images used by the home page, search results, and product detail.
with seed_images (product_slug, image_url, alt_text) as (
  values
    ('tui-deo-cheo-mini-cloud', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80', 'Túi đeo chéo Mini Cloud'),
    ('ao-so-mi-linen-thanh-lich', 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=1000&q=80', 'Áo sơ mi Linen'),
    ('ao-thun-cotton-basic', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=80', 'Áo thun Cotton Basic'),
    ('giay-sneaker-urban', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80', 'Giày Sneaker Urban'),
    ('tai-nghe-bluetooth-studio', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80', 'Tai nghe Bluetooth Studio'),
    ('dong-ho-thong-minh-fit-s', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80', 'Đồng hồ thông minh Fit S'),
    ('binh-giu-nhiet-daily-500ml', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=80', 'Bình giữ nhiệt Daily'),
    ('den-ban-doc-sach-aura', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80', 'Đèn bàn đọc sách Aura'),
    ('bo-cham-soc-da-daily-care', 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1000&q=80', 'Bộ chăm sóc da Daily Care')
)
insert into public.product_images (product_id, image_url, alt_text, sort_order)
select p.id, s.image_url, s.alt_text, 0
from seed_images s
join public.products p on p.slug = s.product_slug
on conflict (product_id, sort_order) do update set
  image_url = excluded.image_url,
  alt_text = excluded.alt_text;

-- A few variants for product detail screens.
insert into public.product_variants (product_id, sku, color, size, stock_quantity, is_active)
select p.id, v.sku, v.color, v.size, v.stock_quantity, true
from (values
  ('ao-thun-cotton-basic', 'DEMO-MEN-001-BLK-M', 'Đen', 'M', 20),
  ('ao-thun-cotton-basic', 'DEMO-MEN-001-WHT-L', 'Trắng', 'L', 18),
  ('giay-sneaker-urban', 'DEMO-SHOE-001-WHT-39', 'Trắng', '39', 8),
  ('giay-sneaker-urban', 'DEMO-SHOE-001-WHT-40', 'Trắng', '40', 9)
) as v(product_slug, sku, color, size, stock_quantity)
join public.products p on p.slug = v.product_slug
on conflict (product_id, color, size) do update set
  sku = excluded.sku,
  stock_quantity = excluded.stock_quantity,
  is_active = excluded.is_active;

-- Active banner and vouchers used on the home page and checkout.
insert into public.banners (title, image_url, target_url, is_active, sort_order)
select
  'Ưu đãi mua sắm mùa mới',
  'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1400&q=85',
  '/(tabs)/search', true, 1
where not exists (
  select 1 from public.banners where title = 'Ưu đãi mua sắm mùa mới'
);

insert into public.vouchers (
  code, description, discount_type, discount_value, min_order_amount,
  max_discount, usage_limit, starts_at, expires_at, is_active
)
values
  ('MAYMOI10', 'Giảm 10% cho đơn hàng từ 200.000đ.', 'percentage', 10, 200000, 50000, 500, now(), '2030-12-31 23:59:59+07', true),
  ('CHAOMUNG20', 'Giảm 20.000đ cho đơn hàng từ 100.000đ.', 'fixed', 20000, 100000, null, 500, now(), '2030-12-31 23:59:59+07', true)
on conflict (code) do update set
  description = excluded.description,
  discount_type = excluded.discount_type,
  discount_value = excluded.discount_value,
  min_order_amount = excluded.min_order_amount,
  max_discount = excluded.max_discount,
  usage_limit = excluded.usage_limit,
  starts_at = excluded.starts_at,
  expires_at = excluded.expires_at,
  is_active = excluded.is_active,
  updated_at = now();

-- -----------------------------------------------------------------------------
-- Personalized demo data for the first active Auth customer, if one exists.
-- Create/sign in to an Auth account before running this section to see sample
-- favorites, cart, orders, reviews, and notifications in the customer screens.
-- -----------------------------------------------------------------------------

do $$
declare
  v_user_id uuid;
  v_cart_id uuid;
  v_pending_order_id uuid;
  v_delivered_order_id uuid;
  v_user_key text;
begin
  select p.id
  into v_user_id
  from public.profiles p
  where p.account_status = 'active'
  order by p.created_at asc
  limit 1;

  if v_user_id is null then
    raise notice 'No active profile found; skipped personalized sample data.';
    return;
  end if;

  v_user_key := upper(substr(replace(v_user_id::text, '-', ''), 1, 8));

  update public.profiles
  set full_name = coalesce(nullif(full_name, ''), 'Nguyễn Minh Anh'),
      phone = coalesce(nullif(phone, ''), '0901234567'),
      address = coalesce(nullif(address, ''), '25 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh'),
      updated_at = now()
  where id = v_user_id;

  insert into public.favorites (user_id, product_id)
  select v_user_id, p.id
  from public.products p
  where p.slug in ('tui-deo-cheo-mini-cloud', 'tai-nghe-bluetooth-studio', 'den-ban-doc-sach-aura')
  on conflict (user_id, product_id) do nothing;

  insert into public.carts (user_id)
  values (v_user_id)
  on conflict (user_id) do update set updated_at = now()
  returning id into v_cart_id;

  insert into public.cart_items (cart_id, product_id, quantity)
  select v_cart_id, p.id, 1
  from public.products p
  where p.slug = 'binh-giu-nhiet-daily-500ml'
    and not exists (
      select 1 from public.cart_items ci
      where ci.cart_id = v_cart_id and ci.product_id = p.id and ci.variant_id is null
    );

  insert into public.orders (
    order_number, user_id, status, payment_method, payment_status,
    subtotal, discount_amount, shipping_fee, total_amount,
    recipient_name, recipient_phone, delivery_address, customer_note
  ) values (
    'DEMO-' || v_user_key || '-01', v_user_id, 'pending', 'cod', 'pending',
    518000, 0, 25000, 543000,
    'Nguyễn Minh Anh', '0901234567', '25 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    'Đơn hàng mẫu để thử chức năng theo dõi và hủy đơn.'
  )
  on conflict (order_number) do update set
    user_id = excluded.user_id,
    status = excluded.status,
    payment_method = excluded.payment_method,
    payment_status = excluded.payment_status,
    subtotal = excluded.subtotal,
    discount_amount = excluded.discount_amount,
    shipping_fee = excluded.shipping_fee,
    total_amount = excluded.total_amount,
    recipient_name = excluded.recipient_name,
    recipient_phone = excluded.recipient_phone,
    delivery_address = excluded.delivery_address,
    customer_note = excluded.customer_note,
    updated_at = now()
  returning id into v_pending_order_id;

  delete from public.order_items where order_id = v_pending_order_id;
  insert into public.order_items (order_id, product_id, product_name, sku, unit_price, quantity, line_total)
  select v_pending_order_id, p.id, p.name, p.sku, p.price, 1, p.price
  from public.products p
  where p.slug in ('tui-deo-cheo-mini-cloud', 'ao-thun-cotton-basic');

  insert into public.orders (
    order_number, user_id, status, payment_method, payment_status,
    subtotal, discount_amount, shipping_fee, total_amount,
    recipient_name, recipient_phone, delivery_address, customer_note,
    created_at
  ) values (
    'DEMO-' || v_user_key || '-02', v_user_id, 'delivered', 'cod', 'paid',
    590000, 0, 25000, 615000,
    'Nguyễn Minh Anh', '0901234567', '25 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    'Đơn hàng mẫu đã giao thành công.', now() - interval '10 days'
  )
  on conflict (order_number) do update set
    user_id = excluded.user_id,
    status = excluded.status,
    payment_method = excluded.payment_method,
    payment_status = excluded.payment_status,
    subtotal = excluded.subtotal,
    discount_amount = excluded.discount_amount,
    shipping_fee = excluded.shipping_fee,
    total_amount = excluded.total_amount,
    recipient_name = excluded.recipient_name,
    recipient_phone = excluded.recipient_phone,
    delivery_address = excluded.delivery_address,
    customer_note = excluded.customer_note,
    updated_at = now()
  returning id into v_delivered_order_id;

  delete from public.order_items where order_id = v_delivered_order_id;
  insert into public.order_items (order_id, product_id, product_name, sku, unit_price, quantity, line_total)
  select v_delivered_order_id, p.id, p.name, p.sku, p.price, 1, p.price
  from public.products p
  where p.slug = 'tai-nghe-bluetooth-studio';

  insert into public.reviews (product_id, user_id, order_id, rating, comment, status)
  select p.id, v_user_id, v_delivered_order_id, 5,
         'Sản phẩm đúng mô tả, đóng gói cẩn thận và giao hàng nhanh.', 'approved'
  from public.products p
  where p.slug = 'tai-nghe-bluetooth-studio'
  on conflict (user_id, product_id) do nothing;

  insert into public.notifications (user_id, title, body, type, data)
  select v_user_id, n.title, n.body, n.type, n.data
  from (values
    ('Đơn hàng đang chờ xác nhận', 'Đơn hàng mẫu của bạn đã được tiếp nhận.', 'order_status', jsonb_build_object('seed_key', 'pending-order', 'order_id', v_pending_order_id)),
    ('Đơn hàng đã giao thành công', 'Đơn hàng mẫu của bạn đã được giao. Hãy chia sẻ đánh giá nhé!', 'order_status', jsonb_build_object('seed_key', 'delivered-order', 'order_id', v_delivered_order_id)),
    ('Ưu đãi dành cho bạn', 'Nhập mã MAYMOI10 để giảm 10% cho đơn hàng từ 200.000đ.', 'promotion', jsonb_build_object('seed_key', 'welcome-promotion', 'voucher_code', 'MAYMOI10'))
  ) as n(title, body, type, data)
  where not exists (
    select 1 from public.notifications existing
    where existing.user_id = v_user_id
      and existing.data ->> 'seed_key' = n.data ->> 'seed_key'
  );
end;
$$;
