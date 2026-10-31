import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/src/constants/colors';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { useCart } from '@/src/hooks/useCart';
import { CartItem } from '@/src/components/cart/CartItem';
import { TotalBar } from '@/src/components/cart/TotalBar';
import { VoucherInput } from '@/src/components/cart/VoucherInput';

export default function CartScreen() {
  const {
    cart,
    selectedItems,
    subtotal,
    discount,
    shippingFee,
    total,
    voucherCode,
    discountRate,
    updateQuantity,
    removeFromCart,
    toggleSelectItem,
    toggleSelectAll,
    applyVoucher,
    removeVoucher,
    clearCart,
  } = useCart();

  const isAllSelected = cart.length > 0 && cart.every((i) => i.selected);

  const confirmDelete = (cartItemId: string, name: string) => {
    Alert.alert('Xóa sản phẩm', `Bạn có chắc muốn xóa "${name}" khỏi giỏ hàng?`, [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => removeFromCart(cartItemId) },
    ]);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một sản phẩm để thanh toán');
      return;
    }
    router.push('/payment');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
          hitSlop={12}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <SymbolView
            name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
            tintColor={colors.ink}
            size={22}
          />
        </Pressable>
        <Text style={styles.headerTitle}>Giỏ hàng ({cart.length})</Text>
        {cart.length > 0 ? (
          <Pressable
            hitSlop={8}
            onPress={() => {
              Alert.alert('Xóa toàn bộ giỏ hàng', 'Bạn có chắc muốn xóa tất cả sản phẩm?', [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Xóa hết', style: 'destructive', onPress: clearCart },
              ]);
            }}
          >
            <Text style={styles.clearAllText}>Xóa tất cả</Text>
          </Pressable>
        ) : (
          <View style={styles.headerRightPlaceholder} />
        )}
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyCircle}>
            <SymbolView
              name={{ ios: 'cart', android: 'shopping_cart', web: 'shopping_cart' }}
              tintColor={colors.cyan}
              size={54}
            />
          </View>
          <Text style={styles.emptyTitle}>Giỏ hàng của bạn đang trống</Text>
          <Text style={styles.emptySubtitle}>
            Hãy khám phá các sản phẩm nổi bật và thêm vào giỏ hàng ngay nhé!
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace('/(tabs)/home')}
            style={styles.exploreButton}
          >
            <Text style={styles.exploreButtonText}>Mua sắm ngay</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <CartItem
                item={item}
                onUpdateQuantity={(q) => {
                  if (q <= 0) {
                    confirmDelete(item.id, item.product.name);
                  } else {
                    updateQuantity(item.id, q);
                  }
                }}
                onRemove={() => confirmDelete(item.id, item.product.name)}
                onToggleSelect={() => toggleSelectItem(item.id)}
              />
            )}
            ListFooterComponent={
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Ưu đãi & Khuyến mãi</Text>
                <VoucherInput
                  appliedVoucher={voucherCode}
                  discountRate={discountRate}
                  onApply={applyVoucher}
                  onRemove={removeVoucher}
                />

                <View style={styles.divider} />

                <Text style={styles.summaryTitle}>Chi tiết thanh toán</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tạm tính ({selectedItems.length} sản phẩm)</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
                </View>
                {discount > 0 ? (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Giảm giá ({voucherCode})</Text>
                    <Text style={[styles.summaryValue, styles.discountText]}>
                      -{formatCurrency(discount)}
                    </Text>
                  </View>
                ) : null}
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Phí giao hàng dự kiến</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(shippingFee)}</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Tổng ước tính</Text>
                  <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
                </View>
              </View>
            }
          />

          <TotalBar
            isAllSelected={isAllSelected}
            selectedCount={selectedItems.length}
            total={total}
            onToggleSelectAll={() => toggleSelectAll(!isAllSelected)}
            onCheckout={handleCheckout}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EDF1F3',
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.ink,
  },
  clearAllText: {
    fontSize: 13,
    color: colors.danger,
    fontWeight: '600',
  },
  headerRightPlaceholder: {
    width: 36,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDF1F3',
    marginTop: 8,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F2F5',
    marginVertical: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.muted,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.ink,
  },
  discountText: {
    color: colors.danger,
  },
  totalRow: {
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.cyan,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.paleCyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: colors.cyan,
    paddingHorizontal: 28,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
