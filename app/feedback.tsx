import { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/src/constants/colors';
import { useReviews } from '@/src/store/marketplaceStore';

const RATING_LABELS = ['Rất tệ', 'Tệ', 'Bình thường', 'Hài lòng', 'Tuyệt vời'];

const QUICK_TAGS = [
  'Chất lượng tuyệt vời',
  'Đúng với mô tả',
  'Giao hàng nhanh',
  'Đóng gói cẩn thận',
  'Thân thiện nhiệt tình',
  'Giá cả hợp lý',
];

export default function FeedbackScreen() {
  const { orderId, productId, productName, image, variant } = useLocalSearchParams<{
    orderId?: string;
    productId?: string;
    productName?: string;
    image?: string;
    variant?: string;
  }>();

  const { addReview } = useReviews();

  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Chất lượng tuyệt vời',
    'Giao hàng nhanh',
  ]);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      addReview({
        orderId,
        productId: productId || 'prod-4',
        productName: productName || 'Tai nghe không dây Air',
        rating,
        comment: comment.trim(),
        tags: selectedTags,
      });

      setSubmitting(false);
      Alert.alert('Cảm ơn bạn!', 'Đánh giá của bạn đã được gửi thành công.', [
        {
          text: 'Xác nhận',
          onPress: () => router.back(),
        },
      ]);
    }, 300);
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
        <Text style={styles.headerTitle}>Đánh giá sản phẩm</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Product Card */}
        <View style={styles.card}>
          <View style={styles.productRow}>
            {image ? (
              <Image source={{ uri: image }} style={styles.productImage} resizeMode="cover" />
            ) : (
              <View style={[styles.productImage, styles.productImageFallback]}>
                <SymbolView
                  name={{ ios: 'shippingbox', android: 'inventory_2', web: 'inventory_2' }}
                  tintColor={colors.cyan}
                  size={24}
                />
              </View>
            )}
            <View style={styles.productDetails}>
              <Text numberOfLines={2} style={styles.productName}>
                {productName || 'Tai nghe không dây Air'}
              </Text>
              {variant ? <Text style={styles.productVariant}>{variant}</Text> : null}
            </View>
          </View>
        </View>

        {/* Rating Stars */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Chất lượng sản phẩm</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable
                key={star}
                hitSlop={8}
                onPress={() => setRating(star)}
                style={styles.starButton}
              >
                <SymbolView
                  name={{
                    ios: star <= rating ? 'star.fill' : 'star',
                    android: star <= rating ? 'star' : 'star_border',
                    web: star <= rating ? 'star' : 'star_border',
                  }}
                  tintColor={star <= rating ? colors.star : '#D1D5DB'}
                  size={36}
                />
              </Pressable>
            ))}
          </View>
          <Text style={styles.ratingLabel}>{RATING_LABELS[rating - 1]}</Text>
        </View>

        {/* Quick Tag Chips */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Điểm nổi bật</Text>
          <View style={styles.tagsContainer}>
            {QUICK_TAGS.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <Pressable
                  key={tag}
                  onPress={() => toggleTag(tag)}
                  style={[styles.tagChip, active && styles.tagChipActive]}
                >
                  <Text style={[styles.tagText, active && styles.tagTextActive]}>
                    {active ? '✓ ' : '+ '}
                    {tag}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Review Comment Input */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Chia sẻ trải nghiệm chi tiết</Text>
          <TextInput
            placeholder="Hãy chia sẻ cảm nhận của bạn về chất lượng sản phẩm, tốc độ giao hàng, đóng gói để giúp người mua khác nhé..."
            placeholderTextColor={colors.muted}
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={setComment}
            style={styles.commentInput}
          />

          {/* Add photos mock */}
          <Pressable
            onPress={() =>
              Alert.alert('Thêm ảnh', 'Tính năng tải ảnh sản phẩm sẽ hỗ trợ trong phiên bản sau.')
            }
            style={styles.photoUploadBtn}
          >
            <SymbolView
              name={{ ios: 'camera', android: 'photo_camera', web: 'photo_camera' }}
              tintColor={colors.muted}
              size={20}
            />
            <Text style={styles.photoUploadText}>Thêm hình ảnh / video</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.bottomBar}>
        <Pressable
          accessibilityRole="button"
          disabled={submitting}
          onPress={handleSubmit}
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? 'Đang gửi đánh giá...' : 'Gửi đánh giá'}
          </Text>
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
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EDF1F3',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 58,
    height: 58,
    borderRadius: 10,
    backgroundColor: colors.softBg,
    marginRight: 12,
  },
  productImageFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paleCyan,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
    lineHeight: 20,
  },
  productVariant: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 12,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 6,
  },
  starButton: {
    padding: 4,
  },
  ratingLabel: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: colors.star,
    marginTop: 6,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E3E5EA',
    backgroundColor: '#F9FAFB',
  },
  tagChipActive: {
    borderColor: colors.cyan,
    backgroundColor: colors.paleCyan,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.muted,
  },
  tagTextActive: {
    color: colors.cyan,
    fontWeight: '700',
  },
  commentInput: {
    height: 100,
    borderWidth: 1,
    borderColor: '#EDF1F3',
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    color: colors.ink,
    backgroundColor: '#FBFCFD',
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  photoUploadBtn: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EDF1F3',
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F9FAFB',
  },
  photoUploadText: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: '500',
  },
  bottomBar: {
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#EEF0F2',
  },
  submitButton: {
    height: 48,
    backgroundColor: colors.cyan,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
