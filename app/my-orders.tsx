import { useMemo, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/src/constants/colors';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { useOrders } from '@/src/store/marketplaceStore';
import { OrderStatus } from '@/src/types/models';

type FilterTab = 'all' | 'pending' | 'shipped' | 'delivered';

const TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'pending', label: 'Chờ xác nhận' },
  { id: 'shipped', label: 'Đang giao' },
  { id: 'delivered', label: 'Đã giao' },
];

export default function MyOrdersScreen() {
  const { orders } = useOrders();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return orders;
    if (activeTab === 'shipped') {
      return orders.filter((o) => o.status === 'shipped' || o.status === 'confirmed');
    }
    return orders.filter((o) => o.status === activeTab);
  }, [orders, activeTab]);

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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
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
        <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Filter Tabs matching Figma */}
      <View style={styles.tabsRow}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Order List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const firstItem = item.items[0];
          const otherCount = item.items.length - 1;

          return (
            <Pressable
              onPress={() => router.push({ pathname: '/my-orders/[id]', params: { id: item.id } })}
              style={styles.orderCard}
            >
              {/* Card Top: Order Number, Date, Status */}
              <View style={styles.cardTop}>
                <View style={styles.orderNumberGroup}>
                  <Text style={styles.orderNumber}>#{item.orderNumber}</Text>
                  <Text style={styles.orderDate}>{item.date}</Text>
                </View>
                {renderStatusBadge(item.status)}
              </View>

              {/* Product Info */}
              {firstItem ? (
                <View style={styles.productRow}>
                  <Image
                    source={{ uri: firstItem.image }}
                    style={styles.productThumb}
                    resizeMode="cover"
                  />
                  <View style={styles.productInfo}>
                    <Text numberOfLines={1} style={styles.productName}>
                      {firstItem.productName}
                    </Text>
                    <Text style={styles.productSubtext}>
                      {firstItem.variant ? `${firstItem.variant} · ` : ''}
                      {otherCount > 0 ? `+${otherCount} sản phẩm khác` : `${firstItem.quantity} sản phẩm`}
                    </Text>
                  </View>
                </View>
              ) : null}

              {/* Card Bottom: Total Price & Detail Link */}
              <View style={styles.cardBottom}>
                <Text style={styles.totalPrice}>{formatCurrency(item.total)}</Text>
                <Pressable
                  hitSlop={8}
                  onPress={() => router.push({ pathname: '/my-orders/[id]', params: { id: item.id } })}
                >
                  <Text style={styles.detailLink}>Xem chi tiết</Text>
                </Pressable>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyCircle}>
              <SymbolView
                name={{ ios: 'shippingbox', android: 'inventory_2', web: 'inventory_2' }}
                tintColor={colors.cyan}
                size={48}
              />
            </View>
            <Text style={styles.emptyTitle}>Chưa có đơn hàng nào</Text>
            <Text style={styles.emptySubtitle}>
              Các đơn hàng bạn đặt sẽ được hiển thị và cập nhật trạng thái tại đây.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.replace('/(tabs)/home')}
              style={styles.emptyButton}
            >
              <Text style={styles.emptyButtonText}>Mua sắm ngay</Text>
            </Pressable>
          </View>
        }
      />
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
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EDF1F3',
  },
  tabButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F5F7',
  },
  tabButtonActive: {
    backgroundColor: colors.paleCyan,
    borderWidth: 1,
    borderColor: '#BFEFF7',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
  },
  tabTextActive: {
    color: colors.cyan,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EDF1F3',
    shadowColor: '#162B36',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F0F2F5',
  },
  orderNumberGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
  },
  orderDate: {
    fontSize: 12,
    color: colors.muted,
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
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  productThumb: {
    width: 54,
    height: 54,
    borderRadius: 10,
    backgroundColor: colors.softBg,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.ink,
  },
  productSubtext: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 4,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F0F2F5',
  },
  totalPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.cyan,
  },
  detailLink: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.cyan,
  },
  emptyContainer: {
    paddingVertical: 64,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.paleCyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: colors.cyan,
    paddingHorizontal: 24,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
