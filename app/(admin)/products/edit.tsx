
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';

export default function EditProductScreen() {
  const [productName, setProductName] = useState('Áo thun nam Basic Cotton');
  const [productCode, setProductCode] = useState('SP001');
  const [category, setCategory] = useState('Áo thun');
  const [price, setPrice] = useState('250000');
  const [salePrice, setSalePrice] = useState('199000');
  const [description, setDescription] = useState(
    'Áo thun nam chất liệu cotton cao cấp, thoáng mát, co giãn tốt.'
  );

  const [color, setColor] = useState('Đen, Trắng, Xám');
  const [size, setSize] = useState('S, M, L, XL');
  const [stock, setStock] = useState('120');
  const [isActive, setIsActive] = useState(true);

  const handleSave = () => {
    if (!productName.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập tên sản phẩm!');
      return;
    }

    if (!price.trim() || Number(price) <= 0) {
      Alert.alert('Thông báo', 'Giá sản phẩm không hợp lệ!');
      return;
    }

    if (salePrice.trim() && Number(salePrice) < 0) {
      Alert.alert('Thông báo', 'Giá khuyến mãi không hợp lệ!');
      return;
    }

    if (salePrice.trim() && Number(salePrice) > Number(price)) {
      Alert.alert('Thông báo', 'Giá khuyến mãi không được lớn hơn giá gốc!');
      return;
    }

    if (!stock.trim() || Number(stock) < 0) {
      Alert.alert('Thông báo', 'Số lượng tồn kho không hợp lệ!');
      return;
    }

    Alert.alert(
      'Thành công',
      'Thông tin sản phẩm đã được kiểm tra. Bạn cần kết nối API để cập nhật vào cơ sở dữ liệu.',
      [{ text: 'Đóng' }]
    );
  };

  const handleCancel = () => {
    Alert.alert('Xác nhận', 'Bạn có muốn hủy cập nhật sản phẩm không?', [
      { text: 'Ở lại', style: 'cancel' },
      { text: 'Hủy cập nhật', onPress: () => router.back() },
    ]);
  };

  const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    multiline = false,
    keyboardType = 'default',
  }: {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    placeholder?: string;
    multiline?: boolean;
    keyboardType?: 'default' | 'numeric';
  }) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content"/>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerTitle}>
          <Text style={styles.title}>Cập nhật sản phẩm</Text>
          <Text style={styles.subtitle}>Chỉnh sửa thông tin sản phẩm</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Product image */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Hình ảnh sản phẩm</Text>

          <TouchableOpacity
            style={styles.imageUpload}
            onPress={() =>
              Alert.alert('Hình ảnh', 'Bạn có thể tích hợp Image Picker để chọn ảnh.')
            }
          >
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imageIcon}>▧</Text>
              <Text style={styles.imageMainText}>Ảnh sản phẩm</Text>
              <Text style={styles.imageSubText}>Nhấn để thay đổi hình ảnh</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Basic information */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>

          <InputField
            label="Tên sản phẩm *"
            value={productName}
            onChangeText={setProductName}
            placeholder="Nhập tên sản phẩm"
          />

          <InputField
            label="Mã sản phẩm"
            value={productCode}
            onChangeText={setProductCode}
            placeholder="Nhập mã sản phẩm"
          />

          <InputField
            label="Danh mục"
            value={category}
            onChangeText={setCategory}
            placeholder="Nhập danh mục"
          />

          <InputField
            label="Mô tả sản phẩm"
            value={description}
            onChangeText={setDescription}
            placeholder="Nhập mô tả sản phẩm"
            multiline
          />
        </View>

        {/* Price */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Giá bán</Text>

          <InputField
            label="Giá gốc (VNĐ) *"
            value={price}
            onChangeText={setPrice}
            placeholder="Nhập giá gốc"
            keyboardType="numeric"
          />

          <InputField
            label="Giá khuyến mãi (VNĐ)"
            value={salePrice}
            onChangeText={setSalePrice}
            placeholder="Nhập giá khuyến mãi"
            keyboardType="numeric"
          />
        </View>

        {/* Variants */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Phân loại sản phẩm</Text>

          <InputField
            label="Màu sắc"
            value={color}
            onChangeText={setColor}
            placeholder="Ví dụ: Đen, Trắng, Xám"
          />

          <InputField
            label="Kích thước"
            value={size}
            onChangeText={setSize}
            placeholder="Ví dụ: S, M, L, XL"
          />

          <InputField
            label="Số lượng tồn kho"
            value={stock}
            onChangeText={setStock}
            placeholder="Nhập số lượng"
            keyboardType="numeric"
          />
        </View>

        {/* Status */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Trạng thái sản phẩm</Text>

          <View style={styles.statusRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.statusTitle}>Đang kinh doanh</Text>
              <Text style={styles.statusDescription}>
                {isActive
                  ? 'Sản phẩm đang được hiển thị trên cửa hàng'
                  : 'Sản phẩm hiện không được kinh doanh'}
              </Text>
            </View>

            <Switch
              value={isActive}
              onValueChange={setIsActive}
              trackColor={{ false: '#D1D5DB', true: '#A7E8E5' }}
              thumbColor={isActive ? '#0D9488' : '#F4F4F5'}
            />
          </View>
        </View>

        <Text style={styles.note}>* Các trường thông tin bắt buộc</Text>
      </ScrollView>

      {/* Bottom buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
        >
          <Text style={styles.cancelText}>Hủy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveText}>Lưu thay đổi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F0FDFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 32,
    color: '#0D9488',
    lineHeight: 36,
  },
  headerTitle: {
    marginLeft: 12,
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#172554',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 25,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EDF0F4',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#172554',
    marginBottom: 17,
  },
  imageUpload: {
    borderWidth: 1.5,
    borderColor: '#99DCD7',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 18,
    backgroundColor: '#F0FDFC',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  imageIcon: {
    fontSize: 42,
    color: '#0D9488',
    marginBottom: 8,
  },
  imageMainText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  imageSubText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 5,
  },
  field: {
    marginBottom: 15,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 9,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  statusDescription: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 5,
    paddingRight: 10,
  },
  note: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  saveButton: {
    flex: 2,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#00BCD4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
