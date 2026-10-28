import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

type ProductVariant = {
  id: number;
  color: string;
  size: string;
  stock: string;
};

const CATEGORIES = [
  'Điện tử',
  'Thời trang',
  'Gia dụng',
  'Sách',
  'Làm đẹp',
  'Thể thao',
];

export default function AddProductScreen() {
  const [name, setName] = useState('Tai nghe không dây Air');
  const [category, setCategory] = useState('Điện tử');
  const [price, setPrice] = useState('890.000');
  const [discount, setDiscount] = useState('15');
  const [description, setDescription] = useState(
    'Âm thanh trong trẻo, kết nối Bluetooth 5.3. Pin sử dụng đến 30 giờ, đệm tai êm ái.'
  );

  const [variants, setVariants] = useState<ProductVariant[]>([
    {
      id: 1,
      color: 'Trắng',
      size: 'Tiêu chuẩn',
      stock: '48',
    },
  ]);

  const [categoryIndex, setCategoryIndex] = useState(0);

  const addVariant = () => {
    setVariants((previous) => [
      ...previous,
      {
        id: Date.now(),
        color: '',
        size: '',
        stock: '',
      },
    ]);
  };

  const updateVariant = (
    id: number,
    field: keyof Omit<ProductVariant, 'id'>,
    value: string
  ) => {
    setVariants((previous) =>
      previous.map((variant) =>
        variant.id === id
          ? { ...variant, [field]: value }
          : variant
      )
    );
  };

  const removeVariant = (id: number) => {
    setVariants((previous) =>
      previous.filter((variant) => variant.id !== id)
    );
  };

  const handleCategoryPress = () => {
    const nextIndex =
      (categoryIndex + 1) % CATEGORIES.length;

    setCategoryIndex(nextIndex);
    setCategory(CATEGORIES[nextIndex]);
  };

  const handleUploadImage = () => {
    Alert.alert(
      'Thêm hình ảnh',
      'Phần chọn ảnh sẽ được tích hợp với thư viện hình ảnh của thiết bị ở bước tiếp theo.'
    );
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập tên sản phẩm.');
      return;
    }

    if (!price.trim() || Number(price.replace(/\D/g, '')) <= 0) {
      Alert.alert('Thông báo', 'Vui lòng nhập giá sản phẩm hợp lệ.');
      return;
    }

    const invalidVariant = variants.some(
      (variant) =>
        !variant.color.trim() ||
        !variant.size.trim() ||
        !variant.stock.trim() ||
        !Number.isInteger(Number(variant.stock)) ||
        Number(variant.stock) < 0
    );

    if (invalidVariant) {
      Alert.alert(
        'Thông báo',
        'Vui lòng nhập đầy đủ màu sắc, kích thước và số lượng tồn kho hợp lệ.'
      );
      return;
    }

    if (
      discount.trim() !== '' &&
      (!Number.isFinite(Number(discount)) ||
        Number(discount) < 0 ||
        Number(discount) > 100)
    ) {
      Alert.alert(
        'Thông báo',
        'Phần trăm giảm giá phải nằm trong khoảng 0 đến 100.'
      );
      return;
    }

    const product = {
      name: name.trim(),
      category,
      price: Number(price.replace(/\D/g, '')),
      discount: Number(discount || 0),
      description: description.trim(),
      variants,
    };

    // Hiện tại chỉ kiểm tra dữ liệu giao diện.
    // Chưa gửi dữ liệu lên Supabase.
    console.log('Thông tin sản phẩm:', product);

    Alert.alert(
      'Thông báo',
      'Thông tin hợp lệ! Bước tiếp theo sẽ kết nối chức năng lưu sản phẩm vào Supabase.'
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => Alert.alert('Thông báo', 'Bạn có thể kết nối nút này với điều hướng quay lại.')}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Thêm sản phẩm</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Upload image */}
          <TouchableOpacity
            style={styles.uploadBox}
            activeOpacity={0.7}
            onPress={handleUploadImage}
          >
            <Text style={styles.uploadIcon}>▧</Text>
            <Text style={styles.uploadTitle}>
              Thêm ảnh sản phẩm
            </Text>
            <Text style={styles.uploadDescription}>
              Tối đa 5 ảnh · JPG, PNG · 5 MB/ảnh
            </Text>
          </TouchableOpacity>

          {/* Product name */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Tên</Text>

            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nhập tên sản phẩm"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Category */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Danh mục</Text>

            <TouchableOpacity
              style={styles.categoryInput}
              onPress={handleCategoryPress}
              activeOpacity={0.7}
            >
              <Text style={styles.categoryText}>
                {category}
              </Text>

              <Text style={styles.chevron}>⌄</Text>
            </TouchableOpacity>

            <Text style={styles.helperText}>
              Nhấn để chuyển danh mục
            </Text>
          </View>

          {/* Price and discount */}
          <View style={styles.formGroup}>
            <View style={styles.row}>
              <View style={[styles.column, styles.leftColumn]}>
                <Text style={styles.label}>Giá</Text>

                <TextInput
                  style={styles.input}
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.column}>
                <Text style={styles.label}>% giảm giá</Text>

                <TextInput
                  style={styles.input}
                  value={discount}
                  onChangeText={setDiscount}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Mô tả</Text>

            <TextInput
              style={[styles.input, styles.descriptionInput]}
              value={description}
              onChangeText={setDescription}
              placeholder="Nhập mô tả sản phẩm"
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Variants */}
          <View style={styles.variantSection}>
            <Text style={styles.sectionTitle}>Biến thể</Text>

            <View style={styles.variantHeader}>
              <Text style={styles.variantHeaderText}>Màu</Text>
              <Text style={styles.variantHeaderText}>Size</Text>
              <Text style={styles.variantHeaderText}>
                Tồn kho
              </Text>
              <View style={styles.removeColumn} />
            </View>

            {variants.map((variant) => (
              <View
                key={variant.id}
                style={styles.variantRow}
              >
                <TextInput
                  style={[styles.variantInput, styles.variantColor]}
                  value={variant.color}
                  onChangeText={(value) =>
                    updateVariant(variant.id, 'color', value)
                  }
                  placeholder="Trắng"
                  placeholderTextColor="#9CA3AF"
                />

                <TextInput
                  style={[styles.variantInput, styles.variantSize]}
                  value={variant.size}
                  onChangeText={(value) =>
                    updateVariant(variant.id, 'size', value)
                  }
                  placeholder="Size"
                  placeholderTextColor="#9CA3AF"
                />

                <TextInput
                  style={[styles.variantInput, styles.variantStock]}
                  value={variant.stock}
                  onChangeText={(value) =>
                    updateVariant(variant.id, 'stock', value)
                  }
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeVariant(variant.id)}
                >
                  <Text style={styles.removeText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={styles.addVariantButton}
              onPress={addVariant}
              activeOpacity={0.7}
            >
              <Text style={styles.addVariantText}>
                + Thêm biến thể
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed bottom button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>
            Lưu sản phẩm
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  flex: {
    flex: 1,
  },

  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  backButton: {
    width: 30,
    height: 40,
    justifyContent: 'center',
  },

  backIcon: {
    fontSize: 30,
    color: '#374151',
    lineHeight: 34,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#252B36',
    marginLeft: 2,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },

  uploadBox: {
    minHeight: 74,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#60D9E8',
    borderRadius: 8,
    backgroundColor: '#F0FCFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    padding: 8,
  },

  uploadIcon: {
    fontSize: 20,
    color: '#00BCD4',
    marginBottom: 2,
  },

  uploadTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00AFC4',
  },

  uploadDescription: {
    fontSize: 9,
    color: '#8995A5',
    marginTop: 4,
  },

  formGroup: {
    marginBottom: 9,
  },

  label: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 5,
  },

  input: {
    height: 36,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 7,
    paddingHorizontal: 10,
    fontSize: 12,
    color: '#374151',
    backgroundColor: '#FFFFFF',
  },

  categoryInput: {
    height: 36,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 7,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  categoryText: {
    fontSize: 12,
    color: '#374151',
  },

  chevron: {
    fontSize: 18,
    color: '#9CA3AF',
  },

  helperText: {
    display: 'none',
  },

  row: {
    flexDirection: 'row',
  },

  column: {
    flex: 1,
  },

  leftColumn: {
    marginRight: 8,
  },

  descriptionInput: {
    height: 62,
    paddingTop: 9,
    lineHeight: 17,
  },

  variantSection: {
    marginTop: 3,
  },

  sectionTitle: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 8,
  },

  variantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  variantHeaderText: {
    flex: 1,
    fontSize: 10,
    color: '#9CA3AF',
  },

  removeColumn: {
    width: 20,
  },

  variantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
    gap: 5,
  },

  variantInput: {
    height: 32,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingHorizontal: 7,
    fontSize: 11,
    color: '#374151',
  },

  variantColor: {
    flex: 1,
  },

  variantSize: {
    flex: 1.15,
  },

  variantStock: {
    flex: 0.85,
  },

  removeButton: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  removeText: {
    color: '#EF4444',
    fontSize: 20,
  },

  addVariantButton: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
  },

  addVariantText: {
    fontSize: 11,
    color: '#00BCD4',
    fontWeight: '500',
  },

  footer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },

  saveButton: {
    height: 42,
    borderRadius: 5,
    backgroundColor: '#06B6CB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  saveButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});