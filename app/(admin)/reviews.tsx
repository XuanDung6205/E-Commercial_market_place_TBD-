import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';

type Review = {
  id: number;
  name: string;
  date: string;
  content: string;
  product: string;
  avatar: string;
  productImage: string;
  status: 'pending' | 'approved' | 'hidden';
};

const INITIAL_REVIEWS: Review[] = [
  {
    id: 1,
    name: 'Nguyễn Minh Anh',
    date: '25/10/2026',
    content:
      'Tai nghe êm, âm thanh rất trong. Đóng gói cẩn thận, giao hàng nhanh. Mình rất hài lòng!',
    product: 'Tai nghe không dây Air',
    avatar: '👩🏻',
    productImage: '🎧',
    status: 'pending',
  },
  {
    id: 2,
    name: 'Trần Hoàng Nam',
    date: '24/10/2026',
    content:
      'Dâu tây rất ngọt, hộp đẹp. Có vài quả hơi nhỏ nhưng chất lượng vẫn rất tốt.',
    product: 'Dâu tây Đà Lạt',
    avatar: '👨🏻',
    productImage: '🍓',
    status: 'pending',
  },
  {
    id: 3,
    name: 'Lê Thu Hà',
    date: '23/10/2026',
    content:
      'Sản phẩm đúng mô tả, chất lượng tốt và giao hàng đúng hẹn.',
    product: 'Áo thun basic',
    avatar: '👩🏻',
    productImage: '👕',
    status: 'approved',
  },
  {
    id: 4,
    name: 'Phạm Quốc Bảo',
    date: '22/10/2026',
    content:
      'Đóng gói đẹp, sản phẩm sử dụng tốt. Sẽ tiếp tục ủng hộ shop.',
    product: 'Bình giữ nhiệt',
    avatar: '👨🏻',
    productImage: '🥤',
    status: 'hidden',
  },
];

type FilterType = 'all' | 'pending' | 'hidden';

export default function ReviewsScreen() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredReviews = reviews.filter((review) => {
    if (filter === 'pending') {
      return review.status === 'pending';
    }

    if (filter === 'hidden') {
      return review.status === 'hidden';
    }

    return true;
  });

  const pendingCount = reviews.filter(
    (review) => review.status === 'pending'
  ).length;

  const approveReview = (id: number) => {
    setReviews((previous) =>
      previous.map((review) =>
        review.id === id
          ? { ...review, status: 'approved' }
          : review
      )
    );

    Alert.alert('Thành công', 'Đã duyệt đánh giá.');
  };

  const hideReview = (id: number) => {
    Alert.alert(
      'Ẩn đánh giá',
      'Bạn có chắc muốn ẩn đánh giá này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Ẩn',
          style: 'destructive',
          onPress: () => {
            setReviews((previous) =>
              previous.map((review) =>
                review.id === id
                  ? { ...review, status: 'hidden' }
                  : review
              )
            );
          },
        },
      ]
    );
  };

  const deleteReview = (id: number) => {
    Alert.alert(
      'Xóa đánh giá',
      'Bạn có chắc muốn xóa đánh giá này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            setReviews((previous) =>
              previous.filter((review) => review.id !== id)
            );
          },
        },
      ]
    );
  };

  const renderFilter = (
    label: string,
    value: FilterType,
    count?: number
  ) => {
    const active = filter === value;

    return (
      <TouchableOpacity
        key={value}
        style={[styles.filterButton, active && styles.activeFilter]}
        onPress={() => setFilter(value)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.filterText,
            active && styles.activeFilterText,
          ]}
        >
          {label}
          {count !== undefined ? ` (${count})` : ''}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      {/* Tiêu đề */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kiểm duyệt đánh giá</Text>
      </View>

      {/* Bộ lọc */}
      <View style={styles.filterContainer}>
        {renderFilter('Tất cả', 'all', reviews.length)}
        {renderFilter('Chờ duyệt', 'pending', pendingCount)}
        {renderFilter(
          'Đã ẩn',
          'hidden',
          reviews.filter((review) => review.status === 'hidden').length
        )}
      </View>

      {/* Danh sách đánh giá */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredReviews.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>
              Không có đánh giá nào
            </Text>
          </View>
        ) : (
          filteredReviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              {/* Thông tin người đánh giá */}
              <View style={styles.reviewerRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {review.avatar}
                  </Text>
                </View>

                <View style={styles.reviewerInfo}>
                  <Text style={styles.reviewerName}>
                    {review.name}
                  </Text>

                  <Text style={styles.reviewDate}>
                    {review.date}
                  </Text>
                </View>
              </View>

              {/* Nội dung */}
              <Text style={styles.reviewContent}>
                {review.content}
              </Text>

              {/* Sản phẩm */}
              <View style={styles.productBox}>
                <View style={styles.productImage}>
                  <Text style={styles.productEmoji}>
                    {review.productImage}
                  </Text>
                </View>

                <View style={styles.productInfo}>
                  <Text
                    style={styles.productName}
                    numberOfLines={1}
                  >
                    {review.product}
                  </Text>

                  <Text style={styles.productStatus}>
                    {review.status === 'pending'
                      ? 'Chờ duyệt'
                      : review.status === 'approved'
                        ? 'Đã duyệt'
                        : 'Đã ẩn'}
                  </Text>
                </View>
              </View>

              {/* Các nút thao tác */}
              <View style={styles.actionRow}>
                {review.status === 'pending' && (
                  <TouchableOpacity
                    style={styles.approveButton}
                    onPress={() => approveReview(review.id)}
                  >
                    <Text style={styles.approveButtonText}>
                      ✓ Duyệt
                    </Text>
                  </TouchableOpacity>
                )}

                {review.status !== 'hidden' && (
                  <TouchableOpacity
                    style={styles.hideButton}
                    onPress={() => hideReview(review.id)}
                  >
                    <Text style={styles.hideButtonText}>
                      ◉ Ẩn
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteReview(review.id)}
                >
                  <Text style={styles.deleteButtonText}>
                    ♧ Xóa
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Thanh điều hướng dưới */}
      <View style={styles.bottomTab}>
        <TabItem icon="▦" label="Tổng quan" />
        <TabItem icon="⬡" label="Sản phẩm" />
        <TabItem icon="▤" label="Đơn hàng" />
        <TabItem icon="♧" label="Khuyến mãi" />
        <TabItem icon="⚙" label="Cài đặt" active />
      </View>
    </View>
  );
}

function TabItem({
  icon,
  label,
  active = false,
}: {
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <TouchableOpacity
      style={styles.tabItem}
      onPress={() => {
        if (label !== 'Cài đặt') {
          Alert.alert('Điều hướng', `Bạn chọn ${label}.`);
        }
      }}
    >
      <Text style={[styles.tabIcon, active && styles.activeTab]}>
        {icon}
      </Text>

      <Text style={[styles.tabLabel, active && styles.activeTab]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#252B36',
  },

  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
    backgroundColor: '#F3F4F6',
  },

  activeFilter: {
    backgroundColor: '#E5FAFC',
  },

  filterText: {
    fontSize: 10,
    color: '#8B95A5',
  },

  activeFilterText: {
    color: '#00AFC4',
    fontWeight: '600',
  },

  list: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#12B8E8',
    marginHorizontal: 16,
    marginTop: 0,
  },

  listContent: {
    padding: 10,
    paddingBottom: 16,
  },

  reviewCard: {
    borderWidth: 1,
    borderColor: '#E8EBEF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },

  reviewerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E6F5F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  avatarText: {
    fontSize: 17,
  },

  reviewerInfo: {
    flex: 1,
  },

  reviewerName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#252B36',
  },

  reviewDate: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 3,
  },

  reviewContent: {
    fontSize: 10,
    lineHeight: 15,
    color: '#4B5563',
    marginBottom: 8,
  },

  productBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    backgroundColor: '#F5F7F9',
    borderRadius: 5,
    marginBottom: 8,
  },

  productImage: {
    width: 30,
    height: 30,
    borderRadius: 4,
    backgroundColor: '#E8ECEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  productEmoji: {
    fontSize: 18,
  },

  productInfo: {
    flex: 1,
  },

  productName: {
    fontSize: 10,
    color: '#6B7280',
  },

  productStatus: {
    fontSize: 9,
    color: '#00B8CE',
    marginTop: 3,
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 6,
  },

  approveButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#00BCD4',
    borderRadius: 5,
  },

  approveButtonText: {
    fontSize: 10,
    color: '#00AFC4',
  },

  hideButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#00BCD4',
    borderRadius: 5,
  },

  hideButtonText: {
    fontSize: 10,
    color: '#00AFC4',
  },

  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#F87171',
    borderRadius: 5,
  },

  deleteButtonText: {
    fontSize: 10,
    color: '#EF4444',
  },

  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },

  emptyIcon: {
    fontSize: 32,
    marginBottom: 10,
  },

  emptyText: {
    fontSize: 13,
    color: '#9CA3AF',
  },

  bottomTab: {
    height: 58,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },

  tabIcon: {
    fontSize: 17,
    color: '#9CA3AF',
  },

  tabLabel: {
    fontSize: 9,
    color: '#9CA3AF',
  },

  activeTab: {
    color: '#00B8CE',
  },
});