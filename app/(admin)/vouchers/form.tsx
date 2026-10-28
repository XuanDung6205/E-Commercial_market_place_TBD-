import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AddVoucherScreen() {
  const router = useRouter();

  // State quản lý form
  const [code, setCode] = useState('CHAO15');
  const [discountType, setDiscountType] = useState('Phần trăm (%)');
  const [value, setValue] = useState('15');
  const [startDate, setStartDate] = useState('25/10/2026');
  const [endDate, setEndDate] = useState('31/10/2026');
  const [minOrder, setMinOrder] = useState('200.000');
  const [isActive, setIsActive] = useState(true);

  const handleSave = () => {
    // Xử lý lưu dữ liệu ở đây
    console.log({
      code,
      discountType,
      value,
      startDate,
      endDate,
      minOrder,
      isActive,
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thêm voucher</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Banner thông báo tím */}
          <View style={styles.infoBanner}>
            <Ionicons name="ticket-outline" size={22} color="#7c3aed" style={styles.bannerIcon} />
            <Text style={styles.bannerText}>
              Tạo ưu đãi mới để khách hàng mua sắm nhiều hơn.
            </Text>
          </View>

          {/* Trường Mã */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mã</Text>
            <TextInput
              style={styles.input}
              value={code}
              onChangeText={(text) => setCode(text.toUpperCase())}
              placeholder="VD: CHAO15"
              autoCapitalize="characters"
            />
            <Text style={styles.helperText}>
              Chỉ dùng chữ in hoa và số, không có khoảng trắng.
            </Text>
          </View>

          {/* Trường Loại giảm */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Loại giảm</Text>
            <TouchableOpacity style={styles.dropdownInput} activeOpacity={0.7}>
              <Text style={styles.dropdownText}>{discountType}</Text>
              <Ionicons name="chevron-down" size={20} color="#888" />
            </TouchableOpacity>
          </View>

          {/* Trường Giá trị */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Giá trị</Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={setValue}
              keyboardType="numeric"
            />
          </View>

          {/* Hàng Ngày bắt đầu & Ngày hết hạn */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Ngày bắt đầu</Text>
              <View style={styles.dateInputContainer}>
                <TextInput
                  style={styles.dateInput}
                  value={startDate}
                  onChangeText={setStartDate}
                />
                <Ionicons name="calendar-outline" size={18} color="#888" />
              </View>
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Ngày hết hạn</Text>
              <View style={styles.dateInputContainer}>
                <TextInput
                  style={styles.dateInput}
                  value={endDate}
                  onChangeText={setEndDate}
                />
                <Ionicons name="calendar-outline" size={18} color="#888" />
              </View>
            </View>
          </View>

          {/* Trường Đơn tối thiểu */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Đơn tối thiểu</Text>
            <View style={styles.currencyInputContainer}>
              <TextInput
                style={styles.input}
                value={minOrder}
                onChangeText={setMinOrder}
                keyboardType="numeric"
              />
              <Text style={styles.currencySymbol}>đ</Text>
            </View>
          </View>

          {/* Switch Kích hoạt ngay */}
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Kích hoạt ngay</Text>
            <Switch
              trackColor={{ false: '#e2e8f0', true: '#00c4cc' }}
              thumbColor={isActive ? '#ffffff' : '#f4f3f4'}
              onValueChange={setIsActive}
              value={isActive}
            />
          </View>
        </ScrollView>

        {/* Nút Lưu voucher ở dưới cùng */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
            <Text style={styles.saveButtonText}>Lưu voucher</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    paddingRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#f3e8ff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginVertical: 12,
  },
  bannerIcon: {
    marginRight: 10,
  },
  bannerText: {
    flex: 1,
    color: '#7e22ce',
    fontSize: 13,
    lineHeight: 18,
  },
  inputGroup: {
    marginTop: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0f172a',
    backgroundColor: '#fff',
  },
  helperText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  dropdownInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dropdownText: {
    fontSize: 15,
    color: '#0f172a',
  },
  row: {
    flexDirection: 'row',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  dateInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  currencyInputContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  currencySymbol: {
    position: 'absolute',
    right: 14,
    fontSize: 15,
    color: '#64748b',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#00c4cc',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});