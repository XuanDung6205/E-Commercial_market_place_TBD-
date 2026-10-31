import { useMemo, useState } from 'react';
import {
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
import { MOCK_PRODUCTS, useCart, useFavorites, useReviews } from '@/src/store/marketplaceStore';
import { RatingSummary } from '@/src/components/product/RatingSummary';
import { ReviewItem } from '@/src/components/product/ReviewItem';

type SortOption = 'newest' | 'highest' | 'lowest';

const SORT_TABS: { id: SortOption; label: string }[] = [
  { id: 'newest', label: 'Mới nhất' },
  { id: 'highest', label: 'Điểm cao nhất' },
  { id: 'lowest', label: 'Điểm thấp nhất' },
];

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = MOCK_PRODUCTS.find((p) => p.id === id) || MOCK_PRODUCTS[0];

  const { addToCart, totalQuantity } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { getReviewsByProductId } = useReviews();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant] = useState(product.variant || 'Mặc định');
  const [added, setAdded] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  const favorited = isFavorite(product.id);
  const rawReviews = getReviewsByProductId(product.id);

  // If this product has no specific reviews yet, provide fallback reviews so the UI is always populated
  const reviews = useMemo(() => {
    if (rawReviews.length > 0) return rawReviews;
    return [
      {
        id: `fb-1-${product.id}`,
        productId: product.id,
        userName: 'Trần Hoàng Long',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        isVerifiedBuyer: true,
        createdAt: '28/10/2026',
        comment: 'Sản phẩm tuyệt vời, chất lượng hoàn thiện rất tốt đúng như mô tả. Giao hàng cực nhanh và đóng gói rất cẩn thận!',
        tags: ['Chất lượng tuyệt vời', 'Giao hàng nhanh'],
      },
      {
        id: `fb-2-${product.id}`,
        productId: product.id,
        userName: 'Nguyễn Minh Trang',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        rating: 4,
        isVerifiedBuyer: true,
        createdAt: '24/10/2026',
        comment: 'Dùng rất thích và tiện lợi. Mức giá hợp lý so với chất lượng nhận được. Sẽ tiếp tục ủng hộ Chợ Mây.',
        tags: ['Giá cả hợp lý'],
      },
    ];
  }, [rawReviews, product.id]);

  const sortedReviews = useMemo(() => {
    const list = [...reviews];
    if (sortOption === 'highest') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    if (sortOption === 'lowest') {
      return list.sort((a, b) => a.rating - b.rating);
    }
    return list; // 'newest' default order
  }, [reviews, sortOption]);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant);
    router.push('/payment');
  };

  const handleWriteReview = () => {
    router.push({
      pathname: '/feedback',
      params: {
        productId: product.id,
        productName: product.name,
        image: product.image,
        variant: selectedVariant,
      },
    });
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
          style={styles.headerButton}
        >
          <SymbolView
            name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
            tintColor={colors.ink}
            size={22}
          />
        </Pressable>

        <View style={styles.headerRight}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Yêu thích"
            hitSlop={10}
            onPress={() => toggleFavorite(product.id)}
            style={styles.headerButton}
          >
            <SymbolView
              name={{
                ios: favorited ? 'heart.fill' : 'heart',
                android: favorited ? 'favorite' : 'favorite_border',
                web: favorited ? 'favorite' : 'favorite_border',
              }}
              tintColor={favorited ? '#F04438' : colors.ink}
              size={22}
            />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Giỏ hàng"
            hitSlop={10}
            onPress={() => router.push('/cart')}
            style={styles.headerButton}
          >
            <SymbolView
              name={{ ios: 'cart', android: 'shopping_cart', web: 'shopping_cart' }}
              tintColor={colors.ink}
              size={22}
            />
            {totalQuantity > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {totalQuantity > 99 ? '99+' : totalQuantity}
                </Text>
              </View>
            ) : null}
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
          {product.tag ? (
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{product.tag}</Text>
            </View>
          ) : null}
        </View>

        {/* Pricing & Rating */}
        <View style={styles.infoCard}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatCurrency(product.price)}</Text>
            {product.compareAtPrice ? (
              <Text style={styles.comparePrice}>{formatCurrency(product.compareAtPrice)}</Text>
            ) : null}
          </View>

          <Text style={styles.title}>{product.name}</Text>

          <View style={styles.metaRow}>
            <View style={styles.ratingBox}>
              <SymbolView
                name={{ ios: 'star.fill', android: 'star', web: 'star' }}
                tintColor={colors.star}
                size={14}
              />
              <Text style={styles.ratingText}>
                {product.rating.toString().replace('.', ',')}
              </Text>
              <Text style={styles.reviewCountText}>({product.reviewCount} đánh giá)</Text>
            </View>
            <Text style={styles.stockText}>Kho: {product.stock || 50} sản phẩm</Text>
          </View>
        </View>

        {/* Quantity selector */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Số lượng</Text>
          <View style={styles.stepperRow}>
            <View style={styles.stepper}>
              <Pressable
                accessibilityLabel="Giảm"
                hitSlop={8}
                disabled={quantity <= 1}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                style={styles.stepBtn}
              >
                <Text style={[styles.stepBtnText, quantity <= 1 && styles.stepBtnDisabled]}>−</Text>
              </Pressable>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <Pressable
                accessibilityLabel="Tăng"
                hitSlop={8}
                onPress={() => setQuantity(quantity + 1)}
                style={styles.stepBtn}
              >
                <Text style={styles.stepBtnText}>+</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
          <Text style={styles.description}>
            {product.description ||
              'Sản phẩm chất lượng cao, nguồn gốc xuất xứ rõ ràng. Đảm bảo giao hàng nhanh chóng và chính sách đổi trả thuận tiện.'}
          </Text>
        </View>

        {/* Đánh giá và bình luận của người mua */}
        <View style={styles.reviewsSection}>
          <View style={styles.reviewsHeader}>
            <View>
              <Text style={styles.sectionTitle}>Đánh giá & Bình luận</Text>
              <Text style={styles.reviewsSubText}>Nhận xét từ khách hàng thực tế</Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Viết đánh giá"
              hitSlop={8}
              onPress={handleWriteReview}
              style={styles.writeReviewBtn}
            >
              <SymbolView
                name={{ ios: 'square.and.pencil', android: 'edit', web: 'edit' }}
                tintColor={colors.cyan}
                size={14}
              />
              <Text style={styles.writeReviewText}>Viết đánh giá</Text>
            </Pressable>
          </View>

          {/* Rating Summary Breakdown with Progress Bars */}
          <RatingSummary
            rating={product.rating}
            totalReviews={product.reviewCount}
          />

          {/* Sort Tabs */}
          <View style={styles.sortTabsRow}>
            <Text style={styles.sortTitle}>Sắp xếp:</Text>
            {SORT_TABS.map((tab) => {
              const active = sortOption === tab.id;
              return (
                <Pressable
                  key={tab.id}
                  onPress={() => setSortOption(tab.id)}
                  style={[styles.sortTab, active && styles.sortTabActive]}
                >
                  <Text style={[styles.sortTabText, active && styles.sortTabTextActive]}>
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Reviews List */}
          <View style={styles.reviewsList}>
            {sortedReviews.map((rev) => (
              <ReviewItem key={rev.id} review={rev} />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <Pressable
          accessibilityRole="button"
          onPress={handleAddToCart}
          style={[styles.addCartBtn, added && styles.addCartBtnSuccess]}
        >
          <SymbolView
            name={{
              ios: added ? 'checkmark' : 'cart.badge.plus',
              android: added ? 'check' : 'add_shopping_cart',
              web: added ? 'check' : 'add_shopping_cart',
            }}
            tintColor={added ? colors.white : colors.cyan}
            size={18}
          />
          <Text style={[styles.addCartText, added && styles.addCartTextSuccess]}>
            {added ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ'}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={handleBuyNow}
          style={styles.buyNowBtn}
        >
          <Text style={styles.buyNowText}>Mua ngay</Text>
        </Pressable>
      </View>
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
  headerButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 0,
    backgroundColor: '#F04438',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  imageContainer: {
    width: '100%',
    height: 320,
    backgroundColor: colors.white,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  tagBadge: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    backgroundColor: '#F1EAFD',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  tagText: {
    color: '#7C5CE0',
    fontSize: 12,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: colors.white,
    padding: 18,
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.cyan,
  },
  comparePrice: {
    fontSize: 14,
    color: colors.muted,
    textDecorationLine: 'line-through',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
    lineHeight: 25,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
  },
  reviewCountText: {
    fontSize: 12,
    color: colors.muted,
  },
  stockText: {
    fontSize: 12,
    color: colors.muted,
  },
  sectionCard: {
    backgroundColor: colors.white,
    padding: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 6,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F5F7',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  stepBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.ink,
  },
  stepBtnDisabled: {
    color: '#CED3DC',
  },
  quantityValue: {
    minWidth: 36,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  description: {
    fontSize: 13,
    color: '#4B5565',
    lineHeight: 21,
    marginTop: 4,
  },
  reviewsSection: {
    backgroundColor: colors.white,
    padding: 16,
    marginBottom: 10,
  },
  reviewsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  reviewsSubText: {
    fontSize: 12,
    color: colors.muted,
  },
  writeReviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: colors.paleCyan,
    borderWidth: 1,
    borderColor: '#C6F3F9',
  },
  writeReviewText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.cyan,
  },
  sortTabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sortTitle: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '500',
    marginRight: 2,
  },
  sortTab: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F5F7',
  },
  sortTabActive: {
    backgroundColor: colors.paleCyan,
    borderWidth: 1,
    borderColor: '#BFEFF7',
  },
  sortTabText: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: '600',
  },
  sortTabTextActive: {
    color: colors.cyan,
  },
  reviewsList: {
    marginTop: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#EEF0F2',
  },
  addCartBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.cyan,
    backgroundColor: colors.paleCyan,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addCartBtnSuccess: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  addCartText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.cyan,
  },
  addCartTextSuccess: {
    color: colors.white,
  },
  buyNowBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyNowText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
});
