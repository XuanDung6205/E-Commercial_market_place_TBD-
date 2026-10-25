
$folders = @(
  "src/components/common",
  "src/components/home",
  "src/components/product",
  "src/components/filter",
  "src/components/cart",
  "src/components/payment",
  "src/components/feedback",
  "src/services",
  "src/hooks",
  "src/store",
  "src/types",
  "src/constants",
  "src/utils",
  "assets/images",
  "assets/icons",
  "supabase",
  "app/(auth)",
  "app/(tabs)",
  "app/category",
  "app/product/[id]",
  "app/orders",
  "app/(admin)/categories",
  "app/(admin)/products",
  "app/(admin)/orders",
  "app/(admin)/vouchers",
  "app/(admin)/banners",
  "src/components/admin"
)

$files = @(
  "app/(auth)/_layout.tsx",
  "app/(auth)/login.tsx",
  "app/(auth)/register.tsx",
  "app/(auth)/forgot-password.tsx",
  "app/(tabs)/_layout.tsx",
  "app/(tabs)/search.tsx",
  "app/(tabs)/favorites.tsx",
  "app/(tabs)/inbox.tsx",
  "app/(tabs)/account.tsx",
  "app/category/[id].tsx",
  "app/product/[id].tsx",
  "app/product/[id]/reviews.tsx",
  "app/filter.tsx",
  "app/cart.tsx",
  "app/payment.tsx",
  "app/order-success.tsx",
  "app/feedback.tsx",
  "app/orders/index.tsx",
  "app/orders/[id].tsx",
  "src/services/supabase.ts",
  "src/services/auth.service.ts",
  "src/services/category.service.ts",
  "src/services/product.service.ts",
  "src/services/review.service.ts",
  "src/services/cart.service.ts",
  "src/services/favorite.service.ts",
  "src/services/voucher.service.ts",
  "src/services/order.service.ts",
  "src/services/payment.service.ts",
  "src/services/feedback.service.ts",
  "src/services/storage.service.ts",
  "src/hooks/useAuth.ts",
  "src/hooks/useProducts.ts",
  "src/hooks/useCart.ts",
  "src/hooks/useFavorites.ts",
  "src/store/authStore.ts",
  "src/store/cartStore.ts",
  "src/store/filterStore.ts",
  "src/types/database.types.ts",
  "src/types/models.ts",
  "src/constants/colors.ts",
  "src/constants/typography.ts",
  "src/constants/spacing.ts",
  "src/utils/formatCurrency.ts",
  "src/utils/calcTax.ts",
  "src/utils/validators.ts",
  "src/components/common/Button.tsx",
  "src/components/common/Input.tsx",
  "src/components/common/Badge.tsx",
  "src/components/common/Rating.tsx",
  "src/components/common/Header.tsx",
  "src/components/common/EmptyState.tsx",
  "src/components/common/Loading.tsx",
  "src/components/home/CategoryCircle.tsx",
  "src/components/home/PromoBanner.tsx",
  "src/components/home/DealCard.tsx",
  "src/components/home/RecommendedList.tsx",
  "src/components/product/ProductCardGrid.tsx",
  "src/components/product/ProductCardList.tsx",
  "src/components/product/ImageCarousel.tsx",
  "src/components/product/ColorPicker.tsx",
  "src/components/product/SizePicker.tsx",
  "src/components/product/QuantityStepper.tsx",
  "src/components/product/ReviewItem.tsx",
  "src/components/product/RatingSummary.tsx",
  "src/components/filter/ShippingOptions.tsx",
  "src/components/filter/PriceRangeSlider.tsx",
  "src/components/filter/ReviewFilter.tsx",
  "src/components/filter/OtherOptions.tsx",
  "src/components/cart/CartItem.tsx",
  "src/components/cart/VoucherInput.tsx",
  "src/components/cart/TotalBar.tsx",
  "src/components/payment/PaymentMethodItem.tsx",
  "src/components/payment/OrderSummary.tsx",
  "src/components/feedback/EmojiRating.tsx",
  "src/components/feedback/TagChip.tsx",
  "src/components/feedback/ImageUploader.tsx",
  "supabase/schema.sql",
  "supabase/policies.sql",
  "supabase/seed.sql",
  ".env.example",
    "app/_layout.tsx",
  "app/index.tsx",
  "app/(tabs)/index.tsx",
  "app/(admin)/_layout.tsx",
  "app/(admin)/dashboard.tsx",
  "app/(admin)/categories/index.tsx",
  "app/(admin)/categories/form.tsx",
  "app/(admin)/products/index.tsx",
  "app/(admin)/products/form.tsx",
  "app/(admin)/orders/index.tsx",
  "app/(admin)/orders/[id].tsx",
  "app/(admin)/vouchers/index.tsx",
  "app/(admin)/vouchers/form.tsx",
  "app/(admin)/banners/index.tsx",
  "app/(admin)/reviews.tsx",
  "app/(admin)/users.tsx",
  "src/hooks/useRole.ts",
  "src/services/admin.product.service.ts",
  "src/services/admin.order.service.ts",
  "src/services/admin.voucher.service.ts",
  "src/services/admin.user.service.ts",
  "src/services/admin.stats.service.ts",
  "src/components/admin/StatCard.tsx",
  "src/components/admin/DataTable.tsx",
  "src/components/admin/AdminForm.tsx",
  "src/components/admin/StatusPicker.tsx"
)

function Get-Stub($path) {
  $name = [IO.Path]::GetFileName($path)

  if ($name -eq ".env.example") {
    return "EXPO_PUBLIC_SUPABASE_URL=`nEXPO_PUBLIC_SUPABASE_ANON_KEY=`n"
  }
  if ($name -like "*.sql") {
    return "-- TODO: $name`n"
  }
  if ($path -like "app/*" -and $name -like "*.tsx") {
    if ($name -eq "_layout.tsx") {
      return "import { Slot } from 'expo-router';`n`nexport default function Layout() {`n  return <Slot />;`n}`n"
    }
    return "import { Text, View } from 'react-native';`n`nexport default function Screen() {`n  return (`n    <View>`n      <Text>$name</Text>`n    </View>`n  );`n}`n"
  }
  return "export {};`n"
}

foreach ($folder in $folders) {
  [void][IO.Directory]::CreateDirectory((Join-Path (Get-Location).Path $folder))
}

foreach ($file in $files) {
  $isNew = -not (Test-Path -LiteralPath $file)
  $isOldTodo = $false
  if (-not $isNew) {
    $content = Get-Content -LiteralPath $file -Raw
    $isOldTodo = ($content -match '^\s*# TODO')
  }
  if ($isNew -or $isOldTodo) {
    Set-Content -LiteralPath $file -Value (Get-Stub $file) -Encoding utf8
  }
}

Write-Host "project done!" -ForegroundColor Green