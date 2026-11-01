
import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

type Account = Record<string, any>;

const hiddenField = (key: string) =>
  /password|token|secret|refresh_token|access_token/i.test(key);

const formatLabel = (key: string) => {
  const labels: Record<string, string> = {
    id: 'Mã tài khoản',
    user_id: 'Mã người dùng',
    account_id: 'Mã tài khoản',
    name: 'Họ và tên',
    full_name: 'Họ và tên',
    fullname: 'Họ và tên',
    username: 'Tên đăng nhập',
    email: 'Email',
    phone: 'Số điện thoại',
    phone_number: 'Số điện thoại',
    address: 'Địa chỉ',
    role: 'Vai trò',
    user_role: 'Vai trò',
    status: 'Trạng thái',
    is_active: 'Trạng thái hoạt động',
    created_at: 'Ngày tạo',
    updated_at: 'Ngày cập nhật',
    avatar_url: 'Ảnh đại diện',
    gender: 'Giới tính',
    birthday: 'Ngày sinh',
    date_of_birth: 'Ngày sinh',
  };

  return labels[key.toLowerCase()] ||
    key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatValue = (value: any) => {
  if (value === null || value === undefined || value === '') {
    return 'Chưa cập nhật';
  }

  if (typeof value === 'boolean') {
    return value ? 'Có' : 'Không';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
};

const getRole = (account: Account) => {
  const role = String(
    account.role ??
    account.user_role ??
    account.account_type ??
    account.loai_tai_khoan ??
    account.vai_tro ??
    ''
  ).toLowerCase();

  return role.includes('admin') || role.includes('quản trị')
    ? 'Admin'
    : 'User';
};

export default function AccountDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ record?: string }>();

  const account = useMemo(() => {
    try {
      return JSON.parse(params.record || '{}') as Account;
    } catch {
      return {};
    }
  }, [params.record]);

  const role = getRole(account);

  const fields = Object.entries(account).filter(
    ([key]) => !hiddenField(key)
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>Chi tiết tài khoản</Text>
          <Text style={styles.headerSubtitle}>Thông tin người dùng</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {String(
                account.name ||
                account.full_name ||
                account.fullname ||
                account.username ||
                'U'
              ).charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.name}>
            {account.name ||
              account.full_name ||
              account.fullname ||
              account.username ||
              'Chưa cập nhật tên'}
          </Text>

          <Text style={styles.email}>
            {account.email || 'Chưa có email'}
          </Text>

          <View
            style={[
              styles.roleBadge,
              role === 'Admin' ? styles.adminBadge : styles.userBadge,
            ]}
          >
            <Text
              style={[
                styles.roleText,
                role === 'Admin' ? styles.adminText : styles.userText,
              ]}
            >
              {role}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>

        {fields.length === 0 ? (
          <View style={styles.infoCard}>
            <Text style={styles.value}>Không có dữ liệu tài khoản.</Text>
          </View>
        ) : (
          <View style={styles.infoCard}>
            {fields.map(([key, value], index) => (
              <View
                key={key}
                style={[
                  styles.infoRow,
                  index === fields.length - 1 && styles.lastRow,
                ]}
              >
                <Text style={styles.label}>{formatLabel(key)}</Text>
                <Text style={styles.value}>
                  {formatValue(value)}
                </Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.backToList}
          onPress={() => router.back()}
        >
          <Text style={styles.backToListText}>Quay lại danh sách</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F6FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { fontSize: 28, color: '#0D9488', marginTop: -4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#172554' },
  headerSubtitle: { fontSize: 12, color: '#64748B', marginTop: 3 },
  content: { padding: 16, paddingBottom: 35 },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    alignItems: 'center',
    padding: 25,
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 40,
    backgroundColor: '#CCFBF1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 30, fontWeight: 'bold', color: '#0F766E' },
  name: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#172554',
    marginTop: 14,
  },
  email: { fontSize: 13, color: '#64748B', marginTop: 5 },
  roleBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },
  adminBadge: { backgroundColor: '#F3E8FF' },
  userBadge: { backgroundColor: '#DBEAFE' },
  roleText: { fontWeight: 'bold', fontSize: 12 },
  adminText: { color: '#9333EA' },
  userText: { color: '#2563EB' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#172554',
    marginTop: 24,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    paddingHorizontal: 15,
  },
  infoRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 7,
  },
  lastRow: { borderBottomWidth: 0 },
  label: { fontSize: 12, color: '#64748B' },
  value: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  },
  backToList: {
    backgroundColor: '#00BCD4',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 22,
  },
  backToListText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
});
