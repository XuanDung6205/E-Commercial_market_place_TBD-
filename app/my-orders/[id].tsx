import { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/src/constants/colors';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { useOrders } from '@/src/store/marketplaceStore';
import { OrderStatus } from '@/src/types/models';

const STEPS = [
  { id: 'pending', label: 'Đã đặt' },
  { id: 'confirmed', label: 'Đã xác nhận' },
  { id: 'shipped', label: 'Đang giao' },
  { id: 'delivered', label: 'Đã giao' },
];

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getOrderById, cancelOrder } = useOrders();
  const order = getOrderById(id || '');

  const [cancelling, setCancelling] = useState(false);

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar style="dark" />
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
          <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
          <View style={styles.headerPlaceholder} />
        </View>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundTitle}>Không tìm thấy đơn hàng</Text>
          <Text style={styles.notFoundText}>
            Đơn hàng #{id} không tồn tại hoặc đã bị xóa.
          </Text>
          <Pressable onPress={() => router.replace('/my-orders')} style={styles.backLinkBtn}>
            <Text style={styles.backLinkText}>Quay lại danh sách</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const getStepProgressIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'pending':
        return 0; // Đã đặt
      case 'confirmed':
        return 1; // Đã xác nhận
      case 'shipped':
        return 2; // Đang giao
      case 'delivered':
        return 3; // Đã giao
      case 'cancelled':
        return -1;
    }
  };

  const progressIndex = getStepProgressIndex(order.status);

  const handleCancelOrder = () => {
    Alert.alert('Hủy đơn hàng', 'Bạn có chắc chắn muốn hủy đơn hàng này không?', [
      { text: 'Không', style: 'cancel' },
      {
        text: 'Hủy đơn',
        style: 'destructive',
        onPress: () => {
          setCancelling(true);
          setTimeout(() => {
            cancelOrder(order.id);
            setCancelling(false);
            Alert.alert('Thành công', 'Đơn hàng của bạn đã được hủy.');
          }, 300);
        },
      },
    ]);
  };

  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <View style={[styles.badge, styles.badgePending]}>
            <Text style={[styles.badgeText, styles.badgeTextPending]}>Chờ xác nhận</Text>
          </View>
        );
      case 'confirmed':
      case 'shipped':
        return (
          <View style={[styles.badge, styles.badgeShipped]}>
            <Text style={[styles.badgeText, styles.badgeTextShipped]}>Đang giao</Text>
          </View>
        );
      case 'delivered':
        return (
          <View style={[styles.badge, styles.badgeDelivered]}>
            <Text style={[styles.badgeText, styles.badgeTextDelivered]}>Đã giao</Text>
          </View>
        );
      case 'cancelled':
        return (
          <View style={[styles.badge, styles.badgeCancelled]}>
            <Text style={[styles.badgeText, styles.badgeTextCancelled]}>Đã hủy</Text>
          </View>
        );
    }
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
        <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Order Title & Badge matching Figma */}
        <View style={styles.orderHeadCard}>
          <View style={styles.orderHeadRow}>
            <Text style={styles.orderTitle}>Đơn hàng #{order.orderNumber}</Text>
            {renderStatusBadge(order.status)}
          </View>
          <Text style={styles.orderSubtitle}>
            {order.status === 'delivered' && order.receivedTime
              ? `Đã nhận lúc ${order.receivedTime}`
              : `Đặt lúc ${order.time ? `${order.time} · ` : ''}${order.date}`}
          </Text>

          {/* Timeline Steps matching Figma */}
          {order.status !== 'cancelled' ? (
            <View style={styles.timelineWrap}>
              <View style={styles.timelineSteps}>
                {STEPS.map((step, idx) => {
                  const isDone = progressIndex >= idx;
                  const isLast = idx === STEPS.length - 1;

                  return (
                    <View key={step.id} style={styles.stepItem}>
                      <View style={styles.dotRow}>
                        <View style={[styles.stepCircle, isDone && styles.stepCircleActive]}>
                          {isDone ? (
                            <SymbolView
                              name={{ ios: 'checkmark', android: 'check', web: 'check' }}
                              tintColor={colors.white}
                              size={12}
                            />
                          ) : (
                            <View style={styles.stepDotInactive} />
                          )}
                        </View>
                        {!isLast ? (
                          <View
                            style={[
                              styles.stepConnector,
                              progressIndex > idx && styles.stepConnectorActive,
                            ]}
                          />
                        ) : null}
                      </View>
                      <Text
                        style={[
                          styles.stepLabel,
                          isDone && styles.stepLabelActive,
                        ]}
                      >
                        {step.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          ) : null}
        </View>

        {/* Section: Địa chỉ giao hàng matching Figma */}
        <View style={styles.sectionCard}>
          <View style={styles.addressRow}>
            <View style={styles.pinCircle}>
              <SymbolView
                name={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }}
                tintColor={colors.cyan}
                size={18}
              />
            </View>
            <View style={styles.addressContent}>
              <Text style={styles.sectionHeading}>Địa chỉ giao hàng</Text>
              <Text style={styles.recipientName}>
                {order.recipientName} · {order.phone}
              </Text>
              <Text style={styles.addressText}>{order.address}</Text>
            </View>
          </View>
        </View>

        {/* Section: Sản phẩm matching Figma */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Sản phẩm ({order.items.length})</Text>
          {order.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
              <View style={styles.itemDetails}>
                <Text numberOfLines={1} style={styles.itemName}>
                  {item.productName}
                </Text>
                <Text style={styles.itemMeta}>
                  {item.variant ? `${item.variant} · ` : ''}Số lượng: {item.quantity}
                </Text>
                <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Section: Chi tiết thanh toán matching Figma */}
        <View style={styles.sectionCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tạm tính</Text>
            <Text style={styles.priceValue}>{formatCurrency(order.subtotal)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Thuế (10%)</Text>
            <Text style={styles.priceValue}>{formatCurrency(order.tax)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Phí vận chuyển</Text>
            <Text style={styles.priceValue}>{formatCurrency(order.shippingFee)}</Text>
          </View>
          {order.discount > 0 ? (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Giảm giá</Text>
              <Text style={[styles.priceValue, styles.discountValue]}>
                -{formatCurrency(order.discount)}
              </Text>
            </View>
          ) : null}
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>{formatCurrency(order.total)}</Text>
          </View>
        </View>

        {/* Payment info bar matching Figma */}
        <View style={styles.paymentCard}>
          {order.isPaid || order.status === 'delivered' ? (
            <View style={styles.paymentContentRow}>
              <SymbolView
                name={{ ios: 'checkmark.circle', android: 'check_circle', web: 'check_circle' }}
                tintColor={colors.success}
                size={18}
              />
              <Text style={styles.paymentSuccessText}>Đã thanh toán khi nhận hàng</Text>
            </View>
          ) : (
            <View style={styles.paymentContentRow}>
              <SymbolView
                name={{ ios: 'creditcard', android: 'credit_card', web: 'credit_card' }}
                tintColor={colors.muted}
                size={18}
              />
              <Text style={styles.paymentPendingText}>
                {order.paymentMethod === 'cod'
                  ? 'Thanh toán khi nhận hàng (COD)'
                  : order.paymentMethod === 'bank_transfer'
                  ? 'Chuyển khoản ngân hàng'
                  : 'Ví điện tử'}
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Button matching Figma: Hủy đơn or ★ Đánh giá */}
        {order.status === 'pending' ? (
          <Pressable
            accessibilityRole="button"
            disabled={cancelling}
            onPress={handleCancelOrder}
            style={[styles.cancelBtn, cancelling && styles.cancelBtnDisabled]}
          >
            <Text style={styles.cancelBtnText}>
              {cancelling ? 'Đang hủy đơn...' : 'Hủy đơn'}
            </Text>
          </Pressable>
        ) : null}

        {order.status === 'delivered' ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              const first = order.items[0];
              router.push({
                pathname: '/feedback',
                params: {
                  orderId: order.id,
                  productId: first?.productId || '',
                  productName: first?.productName || '',
                  image: first?.image || '',
                  variant: first?.variant || '',
                },
              });
            }}
            style={styles.reviewBtn}
          >
            <SymbolView
              name={{ ios: 'star.fill', android: 'star', web: 'star' }}
              tintColor={colors.white}
              size={17}
            />
            <Text style={styles.reviewBtnText}>Đánh giá</Text>
          </Pressable>
        ) : null}
      </ScrollView>
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
  headerPlaceholder: {
    width: 36,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  orderHeadCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EDF1F3',
  },
  orderHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
  },
  orderSubtitle: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 6,
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgePending: {
    backgroundColor: '#FEF6E7',
  },
  badgeTextPending: {
    color: '#B57900',
  },
  badgeShipped: {
    backgroundColor: colors.paleCyan,
  },
  badgeTextShipped: {
    color: colors.cyan,
  },
  badgeDelivered: {
    backgroundColor: '#E6F7ED',
  },
  badgeTextDelivered: {
    color: '#12B76A',
  },
  badgeCancelled: {
    backgroundColor: '#FEE4E2',
  },
  badgeTextCancelled: {
    color: '#F04438',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  timelineWrap: {
    paddingTop: 10,
    paddingBottom: 4,
  },
  timelineSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
  },
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  stepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E4E7EC',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  stepCircleActive: {
    backgroundColor: colors.cyan,
  },
  stepDotInactive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#B5BAC3',
  },
  stepConnector: {
    position: 'absolute',
    left: '50%',
    width: '100%',
    height: 2,
    backgroundColor: '#E4E7EC',
    zIndex: 1,
  },
  stepConnectorActive: {
    backgroundColor: colors.cyan,
  },
  stepLabel: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 6,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: colors.cyan,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EDF1F3',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 12,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  pinCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.paleCyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressContent: {
    flex: 1,
  },
  recipientName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 12,
    color: colors.muted,
    lineHeight: 18,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemImage: {
    width: 58,
    height: 58,
    borderRadius: 10,
    backgroundColor: colors.softBg,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.ink,
  },
  itemMeta: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 3,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.cyan,
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 13,
    color: colors.muted,
  },
  priceValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.ink,
  },
  discountValue: {
    color: colors.danger,
  },
  totalRow: {
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F0F2F5',
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.cyan,
  },
  paymentCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EDF1F3',
  },
  paymentContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paymentSuccessText: {
    fontSize: 13,
    color: colors.success,
    fontWeight: '600',
  },
  paymentPendingText: {
    fontSize: 13,
    color: colors.ink,
    fontWeight: '500',
  },
  cancelBtn: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#F04438',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnDisabled: {
    opacity: 0.6,
  },
  cancelBtnText: {
    color: '#F04438',
    fontSize: 15,
    fontWeight: '700',
  },
  reviewBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.cyan,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  reviewBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 8,
  },
  notFoundText: {
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 20,
  },
  backLinkBtn: {
    backgroundColor: colors.cyan,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backLinkText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 13,
  },
});
