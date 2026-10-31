import { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/src/constants/colors';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { useCart } from '@/src/hooks/useCart';
import { useFavorites } from '@/src/hooks/useFavorites';
import { Product } from '@/src/types/models';

export default function FavoritesScreen() {
  const { favorites, removeFavorite, count } = useFavorites();
  const { addToCart, totalQuantity } = useCart();
  const [keyword, setKeyword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  const filteredFavorites = favorites.filter((item) =>
    item.name.toLowerCase().includes(keyword.trim().toLowerCase())
  );

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => {
      setAddedId(null);
    }, 1200);
  };

  const handleRemove = (product: Product) => {
    Alert.alert('Bỏ yêu thích', `Bỏ "${product.name}" khỏi danh sách yêu thích?`, [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Bỏ lưu', style: 'destructive', onPress: () => removeFavorite(product.id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />

      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Yêu thích ({count})</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Giỏ hàng"
          hitSlop={10}
          onPress={() => router.push('/cart')}
          style={styles.cartIconButton}
        >
          <SymbolView
            name={{ ios: 'cart', android: 'shopping_cart', web: 'shopping_cart' }}
            tintColor={colors.ink}
            size={22}
          />
          {totalQuantity > 0 ? (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>
                {totalQuantity > 99 ? '99+' : totalQuantity}
              </Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      {count === 0 ? (
        /* Empty State matching Figma image 1 */
        <View style={styles.emptyContainer}>
          <View style={styles.emptyCircle}>
            <SymbolView
              name={{ ios: 'heart', android: 'favorite_border', web: 'favorite_border' }}
              tintColor={colors.cyan}
              size={54}
            />
          </View>
          <Text style={styles.emptyTitle}>Chưa có sản phẩm yêu thích</Text>
          <Text style={styles.emptySubtitle}>
            Chạm vào trái tim để lưu những món đồ bạn yêu thích nhé.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace('/(tabs)/home')}
            style={styles.emptyButton}
          >
            <Text style={styles.emptyButtonText}>Khám phá ngay</Text>
          </Pressable>
        </View>
      ) : (
        /* Populated List matching Figma image 1 */
        <View style={styles.content}>
          {/* Search Bar */}
          <View style={styles.searchBar}>
            <SymbolView
              name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
              tintColor={colors.muted}
              size={18}
            />
            <TextInput
              placeholder="Tìm trong danh sách yêu thích"
              placeholderTextColor={colors.muted}
              value={keyword}
              onChangeText={setKeyword}
              style={styles.searchInput}
              returnKeyType="search"
            />
            {keyword ? (
              <Pressable hitSlop={8} onPress={() => setKeyword('')}>
                <SymbolView
                  name={{ ios: 'xmark.circle.fill', android: 'cancel', web: 'cancel' }}
                  tintColor={colors.muted}
                  size={16}
                />
              </Pressable>
            ) : null}
          </View>

          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sản phẩm bạn đã lưu</Text>
            <Pressable hitSlop={8} onPress={() => setIsEditing(!isEditing)}>
              <Text style={styles.editActionText}>
                {isEditing ? 'Xong' : 'Chỉnh sửa'}
              </Text>
            </Pressable>
          </View>

          {/* Grid of Favorites */}
          <FlatList
            data={filteredFavorites}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isAdded = addedId === item.id;
              return (
                <Pressable
                  onPress={() => router.push(`/product/${item.id}`)}
                  style={styles.card}
                >
                  {/* Image container */}
                  <View style={styles.imageWrap}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />

                    {/* Tag badge in bottom-left corner of image */}
                    {item.tag ? (
                      <View style={styles.tagBadge}>
                        <Text style={styles.tagText}>{item.tag}</Text>
                      </View>
                    ) : null}

                    {/* Heart button in top-right corner of image */}
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Xóa khỏi yêu thích"
                      hitSlop={6}
                      onPress={() => handleRemove(item)}
                      style={styles.heartButton}
                    >
                      <SymbolView
                        name={{ ios: 'heart.fill', android: 'favorite', web: 'favorite' }}
                        tintColor="#F04438"
                        size={17}
                      />
                    </Pressable>
                  </View>

                  {/* Product Info */}
                  <View style={styles.infoWrap}>
                    <Text numberOfLines={1} style={styles.productName}>
                      {item.name}
                    </Text>

                    <View style={styles.ratingRow}>
                      <SymbolView
                        name={{ ios: 'star.fill', android: 'star', web: 'star' }}
                        tintColor={colors.star}
                        size={13}
                      />
                      <Text style={styles.ratingText}>
                        {item.rating.toString().replace('.', ',')} ({item.reviewCount})
                      </Text>
                    </View>

                    <View style={styles.priceRow}>
                      <Text style={styles.priceText}>
                        {formatCurrency(item.price)}
                      </Text>

                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Thêm vào giỏ"
                        hitSlop={8}
                        onPress={() => handleAddToCart(item)}
                        style={[styles.addButton, isAdded && styles.addButtonSuccess]}
                      >
                        {isAdded ? (
                          <SymbolView
                            name={{ ios: 'checkmark', android: 'check', web: 'check' }}
                            tintColor={colors.white}
                            size={14}
                          />
                        ) : (
                          <SymbolView
                            name={{ ios: 'plus', android: 'add', web: 'add' }}
                            tintColor={colors.violet}
                            size={16}
                          />
                        )}
                      </Pressable>
                    </View>
                  </View>
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <View style={styles.searchEmpty}>
                <Text style={styles.searchEmptyText}>
                  {`Không tìm thấy sản phẩm phù hợp với "${keyword}"`}
                </Text>
              </View>
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: -0.3,
  },
  cartIconButton: {
    width: 40,
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: -4,
    backgroundColor: '#F04438',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchBar: {
    height: 44,
    backgroundColor: '#F3F5F7',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
    marginTop: 8,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 13,
    color: colors.ink,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: '500',
  },
  editActionText: {
    fontSize: 13,
    color: colors.cyan,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEF0F3',
    shadowColor: '#162B36',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  imageWrap: {
    width: '100%',
    height: 140,
    backgroundColor: '#F5F7FA',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  tagBadge: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    backgroundColor: '#F1EAFD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    color: '#7C5CE0',
    fontSize: 10,
    fontWeight: '700',
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  infoWrap: {
    padding: 12,
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 5,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 11,
    color: colors.muted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.cyan,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F1EAFD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonSuccess: {
    backgroundColor: colors.success,
  },
  searchEmpty: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  searchEmptyText: {
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
  },
  /* Empty State Styles matching Figma */
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  emptyCircle: {
    width: 136,
    height: 136,
    borderRadius: 68,
    backgroundColor: colors.paleCyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 28,
  },
  emptyButton: {
    width: '100%',
    height: 50,
    backgroundColor: colors.cyan,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
