import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Voucher = {
  id: string;
  code: string;
  description: string;
  discount: string;
  minOrder: number;
  startDate: string;
  endDate: string;
  active: boolean;
};

type FilterType = 'Tất cả' | 'Đang hoạt động' | 'Đã hết hạn';

const INITIAL_VOUCHERS: Voucher[] = [
  {
    id: '1',
    code: 'CHAO15',
    description: 'Giảm 15%',
    discount: '15%',
    minOrder: 200000,
    startDate: '25/10/2026',
    endDate: '31/10/2026',
    active: true,
  },
  {
    id: '2',
    code: 'FREESHIP',
    description: 'Giảm 25.000 ₫',
    discount: '25.000 ₫',
    minOrder: 150000,
    startDate: '15/10/2026',
    endDate: '15/11/2026',
    active: true,
  },
  {
    id: '3',
    code: 'MAY50',
    description: 'Giảm 50.000 ₫',
    discount: '50.000 ₫',
    minOrder: 500000,
    startDate: '01/10/2026',
    endDate: '30/11/2026',
    active: true,
  },
  {
    id: '4',
    code: 'CUOITUAN',
    description: 'Giảm 10%',
    discount: '10%',
    minOrder: 300000,
    startDate: '01/10/2026',
    endDate: '24/10/2026',
    active: false,
  },
];

const COLORS = {
  primary: '#00BCD0',
  primaryDark: '#00A9BC',
  background: '#F5F7FA',
  white: '#FFFFFF',
  text: '#293241',
  muted: '#8B95A5',
  border: '#E7EBF0',
  purple: '#9B8AFB',
  green: '#37B978',
  red: '#FF626B',
};

const FILTERS: FilterType[] = [
  'Tất cả',
  'Đang hoạt động',
  'Đã hết hạn',
];

function formatCurrency(value: number): string {
  return `${value.toLocaleString('vi-VN')} ₫`;
}

function isExpired(date: string): boolean {
  const [day, month, year] = date.split('/').map(Number);
  const expiry = new Date(year, month - 1, day, 23, 59, 59);
  return expiry.getTime() < Date.now();
}

export default function VoucherManagementScreen() {
  const router = useRouter();

  const [vouchers, setVouchers] = useState<Voucher[]>(INITIAL_VOUCHERS);
  const [selectedFilter, setSelectedFilter] =
    useState<FilterType>('Tất cả');

  const filteredVouchers = useMemo(() => {
    if (selectedFilter === 'Đang hoạt động') {
      return vouchers.filter(
        (voucher) => voucher.active && !isExpired(voucher.endDate),
      );
    }

    if (selectedFilter === 'Đã hết hạn') {
      return vouchers.filter((voucher) => isExpired(voucher.endDate));
    }

    return vouchers;
  }, [vouchers, selectedFilter]);

  const activeCount = vouchers.filter(
    (voucher) => voucher.active && !isExpired(voucher.endDate),
  ).length;

  const expiredCount = vouchers.filter((voucher) =>
    isExpired(voucher.endDate),
  ).length;

  const toggleVoucher = (id: string, value: boolean) => {
    setVouchers((current) =>
      current.map((voucher) =>
        voucher.id === id ? { ...voucher, active: value } : voucher,
      ),
    );
  };

  const openAddVoucher = () => {
    router.push('/(admin)/vouchers/form' as any);
  };

  const renderVoucher = (voucher: Voucher) => {
    const expired = isExpired(voucher.endDate);
    const enabled = voucher.active && !expired;

    return (
      <View key={voucher.id} style={styles.voucherCard}>
        <View style={styles.voucherTop}>
          <View style={styles.ticketIcon}>
            <Ionicons
              name="ticket-outline"
              size={21}
              color={COLORS.purple}
            />
          </View>

          <View style={styles.voucherInfo}>
            <Text style={styles.voucherCode}>{voucher.code}</Text>
            <Text style={styles.discountText}>
              {voucher.description}
            </Text>
          </View>

          <Switch
            value={voucher.active && !expired}
            onValueChange={(value) => toggleVoucher(voucher.id, value)}
            disabled={expired}
            trackColor={{
              false: '#DFE3E9',
              true: COLORS.primary,
            }}
            thumbColor={COLORS.white}
            ios_backgroundColor="#DFE3E9"
          />
        </View>

        <View style={styles.voucherDetails}>
          <Text style={styles.detailText}>
            Đơn tối thiểu {formatCurrency(voucher.minOrder)}
          </Text>

          <Text style={styles.detailText}>
            Từ {voucher.startDate} - Đến {voucher.endDate}
          </Text>
        </View>

        <View style={styles.voucherBottom}>
          <Text style={styles.expiryText}>
            Hết hạn: {voucher.endDate}
          </Text>

          <View
            style={[
              styles.statusBadge,
              expired
                ? styles.expiredBadge
                : enabled
                  ? styles.activeBadge
                  : styles.inactiveBadge,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                expired
                  ? styles.expiredText
                  : enabled
                    ? styles.activeText
                    : styles.inactiveText,
              ]}
            >
              {expired
                ? 'Đã hết hạn'
                : enabled
                  ? 'Đang hoạt động'
                  : 'Đã tắt'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quản lý voucher</Text>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {FILTERS.map((filter) => {
            const selected = selectedFilter === filter;

            let count = vouchers.length;

            if (filter === 'Đang hoạt động') {
              count = activeCount;
            } else if (filter === 'Đã hết hạn') {
              count = expiredCount;
            }

            return (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  selected && styles.filterButtonSelected,
                ]}
                onPress={() => setSelectedFilter(filter)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterText,
                    selected && styles.filterTextSelected,
                  ]}
                >
                  {filter} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredVouchers.length > 0 ? (
          filteredVouchers.map(renderVoucher)
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="ticket-outline"
              size={48}
              color={COLORS.muted}
            />
            <Text style={styles.emptyTitle}>Không có voucher</Text>
            <Text style={styles.emptyDescription}>
              Chưa có voucher nào trong danh mục này.
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={openAddVoucher}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={30} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    // [QUAN TRỌNG CHO WEB] Giúp container chiếm trọn chiều cao màn hình trình duyệt
    ...(Platform.OS === 'web' ? { height: '100vh' as any, overflow: 'hidden' } : {}),
  },

  header: {
    height: 54,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },

  filterContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },

  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 7,
    backgroundColor: '#F1F3F7',
  },

  filterButtonSelected: {
    backgroundColor: '#E1FAFC',
  },

  filterText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '500',
  },

  filterTextSelected: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },

  scrollView: {
    flex: 1,
    // [QUAN TRỌNG CHO WEB] Cho phép cuộn dọc trên trình duyệt
    ...(Platform.OS === 'web' ? { overflowY: 'auto' as any } : {}),
  },

  listContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 100,
  },

  voucherCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 13,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EDF0F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.035,
    shadowRadius: 5,
    elevation: 2,
  },

  voucherTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  ticketIcon: {
    width: 38,
    height: 38,
    borderRadius: 9,
    backgroundColor: '#F0EDFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  voucherInfo: {
    flex: 1,
  },

  voucherCode: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 3,
  },

  discountText: {
    color: COLORS.primaryDark,
    fontSize: 11,
    fontWeight: '600',
  },

  voucherDetails: {
    marginTop: 10,
    gap: 5,
  },

  detailText: {
    color: COLORS.muted,
    fontSize: 10,
  },

  voucherBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 11,
    paddingTop: 9,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F6',
  },

  expiryText: {
    color: COLORS.muted,
    fontSize: 10,
  },

  statusBadge: {
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  activeBadge: {
    backgroundColor: '#E5F8ED',
  },

  inactiveBadge: {
    backgroundColor: '#F0F1F4',
  },

  expiredBadge: {
    backgroundColor: '#FFE9EA',
  },

  statusText: {
    fontSize: 9,
    fontWeight: '600',
  },

  activeText: {
    color: COLORS.green,
  },

  inactiveText: {
    color: COLORS.muted,
  },

  expiredText: {
    color: COLORS.red,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 70,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 12,
  },

  emptyDescription: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },

  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});
