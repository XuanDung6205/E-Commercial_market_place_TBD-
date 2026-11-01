
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';

type Period = 'Ngày' | 'Tuần' | 'Tháng' | 'Năm';

const periods: Period[] = ['Ngày', 'Tuần', 'Tháng', 'Năm'];

// DỮ LIỆU MẪU - Sau này thay bằng dữ liệu Supabase
const mockStats = {
  revenue: 125800000,
  orders: 258,
  productsSold: 436,
  customers: 182,
  pendingOrders: 18,
  shippingOrders: 35,
  completedOrders: 190,
  cancelledOrders: 15,
};

const revenueData: Record<Period, { label: string; value: number }[]> = {
  Ngày: [
    { label: '8h', value: 20 },
    { label: '10h', value: 45 },
    { label: '12h', value: 35 },
    { label: '14h', value: 70 },
    { label: '16h', value: 55 },
    { label: '18h', value: 90 },
    { label: '20h', value: 65 },
  ],
  Tuần: [
    { label: 'T2', value: 35 },
    { label: 'T3', value: 55 },
    { label: 'T4', value: 40 },
    { label: 'T5', value: 75 },
    { label: 'T6', value: 60 },
    { label: 'T7', value: 95 },
    { label: 'CN', value: 70 },
  ],
  Tháng: [
    { label: '1', value: 35 },
    { label: '5', value: 50 },
    { label: '10', value: 65 },
    { label: '15', value: 45 },
    { label: '20', value: 80 },
    { label: '25', value: 95 },
    { label: '30', value: 70 },
  ],
  Năm: [
    { label: 'T1', value: 30 },
    { label: 'T2', value: 45 },
    { label: 'T3', value: 55 },
    { label: 'T4', value: 40 },
    { label: 'T5', value: 70 },
    { label: 'T6', value: 90 },
    { label: 'T7', value: 65 },
  ],
};

const bestSellingProducts = [
  {
    id: '1',
    name: 'Áo thun nam Basic',
    category: 'Áo thun',
    sold: 125,
    revenue: 18750000,
  },
  {
    id: '2',
    name: 'Quần Jean Slim Fit',
    category: 'Quần jean',
    sold: 98,
    revenue: 29400000,
  },
  {
    id: '3',
    name: 'Áo Polo Classic',
    category: 'Áo polo',
    sold: 86,
    revenue: 17200000,
  },
  {
    id: '4',
    name: 'Áo khoác Bomber',
    category: 'Áo khoác',
    sold: 72,
    revenue: 28800000,
  },
];

const formatMoney = (value: number) =>
  value.toLocaleString('vi-VN') + ' đ';

export default function StatisticsScreen() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] =
    useState<Period>('Tuần');

  const chart = revenueData[selectedPeriod];

  const maxValue = Math.max(...chart.map(item => item.value));

  const StatCard = ({
    title,
    value,
    icon,
    color,
    background,
    note,
  }: {
    title: string;
    value: string;
    icon: string;
    color: string;
    background: string;
    note: string;
  }) => (
    <View style={styles.statCard}>
      <View style={styles.statTop}>
        <View style={[styles.statIcon, { backgroundColor: background }]}>
          <Text style={{ fontSize: 20 }}>{icon}</Text>
        </View>
        <View style={styles.growthBadge}>
          <Text style={styles.growthText}>↑ 12.5%</Text>
        </View>
      </View>

      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={[styles.statNote, { color }]}>{note}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Thống kê cửa hàng</Text>
          <Text style={styles.headerSubtitle}>
            Tổng quan tình hình kinh doanh
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Text style={{ fontSize: 19 }}>📊</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* DEMO NOTICE */}
        <View style={styles.demoNotice}>
          <Text style={styles.demoIcon}>ⓘ</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.demoTitle}>Dữ liệu minh họa</Text>
            <Text style={styles.demoDescription}>
              Đây là số liệu mẫu để xem trước giao diện.
              Chưa kết nối dữ liệu thực tế.
            </Text>
          </View>
        </View>

        {/* FILTER */}
        <View style={styles.filterHeader}>
          <Text style={styles.sectionTitle}>Tổng quan kinh doanh</Text>
          <Text style={styles.currentDate}>Năm 2026</Text>
        </View>

        <View style={styles.periodContainer}>
          {periods.map(period => (
            <TouchableOpacity
              key={period}
              onPress={() => setSelectedPeriod(period)}
              style={[
                styles.periodButton,
                selectedPeriod === period &&
                  styles.periodButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period &&
                    styles.periodTextActive,
                ]}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* STAT CARDS */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Tổng doanh thu"
            value={formatMoney(mockStats.revenue)}
            icon="💰"
            color="#16A34A"
            background="#DCFCE7"
            note="So với kỳ trước"
          />

          <StatCard
            title="Đơn hàng"
            value={String(mockStats.orders)}
            icon="🛍️"
            color="#2563EB"
            background="#DBEAFE"
            note="Tổng đơn đặt hàng"
          />

          <StatCard
            title="Sản phẩm đã bán"
            value={String(mockStats.productsSold)}
            icon="📦"
            color="#EA580C"
            background="#FFEDD5"
            note="Tổng sản phẩm"
          />

          <StatCard
            title="Khách hàng"
            value={String(mockStats.customers)}
            icon="👥"
            color="#9333EA"
            background="#F3E8FF"
            note="Đã mua hàng"
          />
        </View>

        {/* REVENUE CHART */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Doanh thu</Text>
            <Text style={styles.sectionSubtitle}>
              Biến động doanh thu theo {selectedPeriod.toLowerCase()}
            </Text>
          </View>
          <Text style={styles.chartIcon}>📈</Text>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTotal}>
            {formatMoney(mockStats.revenue)}
          </Text>
          <Text style={styles.chartCaption}>
            Doanh thu minh họa
          </Text>

          <View style={styles.chart}>
            {chart.map((item, index) => (
              <View key={index} style={styles.chartColumn}>
                <View style={styles.barArea}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${(item.value / maxValue) * 100}%`,
                        backgroundColor:
                          item.value === maxValue
                            ? '#123B78'
                            : '#A8C5F0',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.chartLegend}>
            <View style={styles.legendDot} />
            <Text style={styles.legendText}>Doanh thu</Text>
          </View>
        </View>

        {/* ORDER STATUS */}
        <Text style={styles.sectionTitle}>Tình trạng đơn hàng</Text>

        <View style={styles.orderCard}>
          <View style={styles.orderItem}>
            <View style={[styles.orderIcon, { backgroundColor: '#FEF3C7' }]}>
              <Text>⏳</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.orderName}>Chờ xác nhận</Text>
              <Text style={styles.orderDescription}>
                Đơn hàng mới
              </Text>
            </View>
            <Text style={[styles.orderNumber, { color: '#D97706' }]}>
              {mockStats.pendingOrders}
            </Text>
          </View>

          <View style={styles.orderDivider} />

          <View style={styles.orderItem}>
            <View style={[styles.orderIcon, { backgroundColor: '#DBEAFE' }]}>
              <Text>🚚</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.orderName}>Đang giao</Text>
              <Text style={styles.orderDescription}>
                Đơn hàng đang vận chuyển
              </Text>
            </View>
            <Text style={[styles.orderNumber, { color: '#2563EB' }]}>
              {mockStats.shippingOrders}
            </Text>
          </View>

          <View style={styles.orderDivider} />

          <View style={styles.orderItem}>
            <View style={[styles.orderIcon, { backgroundColor: '#DCFCE7' }]}>
              <Text>✓</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.orderName}>Đã hoàn thành</Text>
              <Text style={styles.orderDescription}>
                Giao hàng thành công
              </Text>
            </View>
            <Text style={[styles.orderNumber, { color: '#16A34A' }]}>
              {mockStats.completedOrders}
            </Text>
          </View>

          <View style={styles.orderDivider} />

          <View style={styles.orderItem}>
            <View style={[styles.orderIcon, { backgroundColor: '#FEE2E2' }]}>
              <Text>✕</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.orderName}>Đã hủy</Text>
              <Text style={styles.orderDescription}>
                Đơn hàng không thành công
              </Text>
            </View>
            <Text style={[styles.orderNumber, { color: '#DC2626' }]}>
              {mockStats.cancelledOrders}
            </Text>
          </View>
        </View>

        {/* BEST SELLING */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Sản phẩm bán chạy</Text>
            <Text style={styles.sectionSubtitle}>
              Top sản phẩm có số lượng bán cao
            </Text>
          </View>
          <Text style={styles.trophy}>🏆</Text>
        </View>

        <View style={styles.productCard}>
          {bestSellingProducts.map((product, index) => (
            <View key={product.id}>
              <View style={styles.productItem}>
                <View style={styles.rank}>
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.productName}>
                    {product.name}
                  </Text>
                  <Text style={styles.productCategory}>
                    {product.category}
                  </Text>
                  <Text style={styles.productRevenue}>
                    {formatMoney(product.revenue)}
                  </Text>
                </View>

                <View style={styles.soldBox}>
                  <Text style={styles.soldNumber}>
                    {product.sold}
                  </Text>
                  <Text style={styles.soldLabel}>Đã bán</Text>
                </View>
              </View>

              {index !== bestSellingProducts.length - 1 && (
                <View style={styles.productDivider} />
              )}
            </View>
          ))}
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thống kê hoạt động kinh doanh cửa hàng
          </Text>
          <Text style={styles.footerSubtext}>
            Giao diện demo – chưa kết nối Supabase
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF4',
    gap: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#EAFBF7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: '#0D9488',
    fontSize: 29,
    marginTop: -5,
  },
  headerTitle: {
    color: '#172554',
    fontSize: 17,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 3,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 15,
    paddingBottom: 35,
  },
  demoNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7E6',
    borderWidth: 1,
    borderColor: '#FDE6B5',
    borderRadius: 11,
    padding: 12,
    marginBottom: 19,
    gap: 10,
  },
  demoIcon: {
    fontSize: 21,
    color: '#D97706',
  },
  demoTitle: {
    color: '#92400E',
    fontWeight: 'bold',
    fontSize: 12,
  },
  demoDescription: {
    color: '#A16207',
    fontSize: 11,
    marginTop: 3,
    lineHeight: 17,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#172554',
  },
  currentDate: {
    color: '#64748B',
    fontSize: 11,
  },
  periodContainer: {
    flexDirection: 'row',
    backgroundColor: '#E9EEF5',
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  periodButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: '#123B78',
  },
  periodText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  periodTextActive: {
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 11,
    marginBottom: 23,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    padding: 13,
    minHeight: 145,
    borderWidth: 1,
    borderColor: '#EDF0F5',
  },
  statTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statIcon: {
    width: 39,
    height: 39,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  growthBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 4,
  },
  growthText: {
    color: '#15803D',
    fontSize: 9,
    fontWeight: 'bold',
  },
  statValue: {
    color: '#172554',
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 12,
  },
  statTitle: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  statNote: {
    fontSize: 10,
    marginTop: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 3,
  },
  sectionSubtitle: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 4,
  },
  chartIcon: {
    fontSize: 23,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 13,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#EDF0F5',
  },
  chartTotal: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#172554',
  },
  chartCaption: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
  chart: {
    height: 155,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    marginTop: 18,
    gap: 8,
  },
  chartColumn: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
  },
  barArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '70%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    minHeight: 3,
  },
  barLabel: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 9,
  },
  chartLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 17,
    gap: 7,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#123B78',
  },
  legendText: {
    color: '#64748B',
    fontSize: 10,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 3,
    marginTop: 12,
    marginBottom: 23,
    borderWidth: 1,
    borderColor: '#EDF0F5',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    gap: 11,
  },
  orderIcon: {
    width: 37,
    height: 37,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderName: {
    color: '#334155',
    fontWeight: '600',
    fontSize: 12,
  },
  orderDescription: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 4,
  },
  orderNumber: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  orderDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  trophy: {
    fontSize: 24,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    paddingHorizontal: 14,
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#EDF0F5',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    gap: 11,
  },
  rank: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    color: '#123B78',
    fontWeight: 'bold',
    fontSize: 12,
  },
  productName: {
    color: '#334155',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productCategory: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 4,
  },
  productRevenue: {
    color: '#0D9488',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 5,
  },
  soldBox: {
    alignItems: 'center',
    minWidth: 48,
  },
  soldNumber: {
    color: '#172554',
    fontSize: 17,
    fontWeight: 'bold',
  },
  soldLabel: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 3,
  },
  productDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
  footerSubtext: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 5,
  },
});
