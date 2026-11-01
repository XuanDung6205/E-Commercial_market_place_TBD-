
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/src/services/supabase';

type Account = Record<string, any>;

const getValue = (item: Account, keys: string[]) => {
  for (const key of keys) {
    const value = item?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return value;
    }
  }
  return '';
};

const getRole = (item: Account) => {
  const role = String(
    getValue(item, ['role', 'user_role', 'account_type', 'loai_tai_khoan', 'vai_tro'])
  ).toLowerCase();

  if (role.includes('admin') || role.includes('quản trị')) return 'Admin';
  return 'User';
};

const getName = (item: Account) =>
  getValue(item, ['name', 'full_name', 'fullname', 'ho_ten', 'hoten', 'username', 'ten']);

const getEmail = (item: Account) =>
  getValue(item, ['email', 'mail']);

const getPhone = (item: Account) =>
  getValue(item, ['phone', 'phone_number', 'sdt', 'so_dien_thoai', 'mobile']);

const getId = (item: Account) =>
  getValue(item, ['id', 'user_id', 'account_id', 'ma_tai_khoan', 'uid']);

export default function AccountListScreen() {
  const router = useRouter();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadAccounts = async () => {
  try {
    setError('');

    console.log('Đang truy vấn bảng account_user...');

    const { data, error } = await supabase
      .from('account_user')
      .select('*');

    console.log('DỮ LIỆU SUPABASE:', data);
    console.log('LỖI SUPABASE:', error);

    if (error) {
      throw error;
    }

    setAccounts(data || []);

  } catch (err: any) {
    console.log('LỖI TẢI TÀI KHOẢN:', err);
    setError(err?.message || 'Không thể tải danh sách tài khoản.');
    setAccounts([]);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  useEffect(() => {
    loadAccounts();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAccounts();
  }, []);

  const adminCount = accounts.filter(
    (item) => getRole(item) === 'Admin'
  ).length;

  const userCount = accounts.length - adminCount;

  const activeCount = accounts.filter((item) => {
    const status = getValue(item, [
      'status',
      'is_active',
      'active',
      'trang_thai',
      'is_enabled',
    ]);

    if (status === '') return true;

    return !(
      status === false ||
      status === 0 ||
      String(status).toLowerCase() === 'false' ||
      String(status).toLowerCase() === 'inactive' ||
      String(status).toLowerCase() === 'locked'
    );
  }).length;

  const filteredAccounts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return accounts;

    return accounts.filter((item) =>
      Object.entries(item).some(([key, value]) => {
        // Không tìm kiếm trong các trường nhạy cảm.
        if (/password|token|secret/i.test(key)) return false;
        return String(value ?? '').toLowerCase().includes(keyword);
      })
    );
  }, [accounts, search]);

  const openDetail = (item: Account) => {
    router.push({
      pathname: '/(admin)/accounts/detail',
      params: {
        record: JSON.stringify(item),
      },
    });
  };

  const renderAccount = ({ item, index }: { item: Account; index: number }) => {
    const name = getName(item) || 'Chưa cập nhật tên';
    const email = getEmail(item) || 'Chưa có email';
    const phone = getPhone(item) || 'Chưa có số điện thoại';
    const role = getRole(item);
    const id = getId(item) || `account-${index}`;

    return (
      <TouchableOpacity
        style={styles.accountCard}
        activeOpacity={0.8}
        onPress={() => openDetail(item)}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {String(name).charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.accountInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.accountName} numberOfLines={1}>
              {String(name)}
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

          <Text style={styles.accountSub} numberOfLines={1}>
            ✉ {String(email)}
          </Text>

          <Text style={styles.accountSub}>
            ☎ {String(phone)}
          </Text>

          <Text style={styles.accountId} numberOfLines={1}>
            ID: {String(id)}
          </Text>
        </View>

        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    );
  };

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
          <Text style={styles.headerTitle}>Quản lý tài khoản</Text>
          <Text style={styles.headerSubtitle}>
            Quản lý Admin và khách hàng
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{accounts.length}</Text>
            <Text style={styles.statLabel}>Tổng tài khoản</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#9333EA' }]}>
              {adminCount}
            </Text>
            <Text style={styles.statLabel}>Admin</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#2563EB' }]}>
              {userCount}
            </Text>
            <Text style={styles.statLabel}>User</Text>
          </View>
        </View>

        <View style={styles.activeBar}>
          <Text style={styles.activeText}>
            Đang hoạt động: {activeCount}/{accounts.length} tài khoản
          </Text>
        </View>

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm tên, email, số điện thoại..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Danh sách tài khoản</Text>
          <Text style={styles.resultText}>
            {filteredAccounts.length} kết quả
          </Text>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#0D9488" />
            <Text style={styles.emptyText}>Đang tải tài khoản...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={loadAccounts}>
              <Text style={styles.retryText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : filteredAccounts.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyIcon}>♙</Text>
            <Text style={styles.emptyTitle}>Chưa có tài khoản</Text>
            <Text style={styles.emptyText}>
              Không tìm thấy dữ liệu tài khoản trong hệ thống.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredAccounts}
            keyExtractor={(item, index) =>
              String(getId(item) || index)
            }
            renderItem={renderAccount}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 30 }}
          />
        )}
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
  content: { flex: 1, padding: 14 },
  statsRow: { flexDirection: 'row', gap: 8 },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 17,
    alignItems: 'center',
  },
  statNumber: { fontSize: 23, fontWeight: 'bold', color: '#172554' },
  statLabel: { fontSize: 11, color: '#64748B', marginTop: 5 },
  activeBar: {
    backgroundColor: '#DCFCE7',
    padding: 12,
    borderRadius: 9,
    marginTop: 10,
  },
  activeText: { color: '#15803D', fontSize: 12, fontWeight: '500' },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    marginTop: 14,
  },
  searchIcon: { fontSize: 23, color: '#64748B', marginRight: 8 },
  searchInput: { flex: 1, height: 44, fontSize: 13, color: '#1E293B' },
  clearText: { color: '#64748B', padding: 8 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#172554' },
  resultText: { fontSize: 11, color: '#64748B' },
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#CCFBF1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#00BCD4', fontSize: 19, fontWeight: 'bold' },
  accountInfo: { flex: 1 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  accountName: {
    flex: 1,
    fontWeight: 'bold',
    color: '#1E293B',
    fontSize: 14,
  },
  roleBadge: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20 },
  adminBadge: { backgroundColor: '#F3E8FF' },
  userBadge: { backgroundColor: '#DBEAFE' },
  roleText: { fontSize: 10, fontWeight: 'bold' },
  adminText: { color: '#9333EA' },
  userText: { color: '#2563EB' },
  accountSub: { color: '#64748B', fontSize: 12, marginTop: 5 },
  accountId: { color: '#94A3B8', fontSize: 10, marginTop: 5 },
  arrow: { color: '#94A3B8', fontSize: 25 },
  center: { alignItems: 'center', paddingVertical: 55 },
  emptyIcon: { fontSize: 42, color: '#94A3B8' },
  emptyTitle: {
    fontWeight: 'bold',
    color: '#334155',
    fontSize: 15,
    marginTop: 12,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    padding: 14,
    borderRadius: 10,
  },
  errorText: { color: '#B91C1C', fontSize: 12 },
  retryText: {
    color: '#0D9488',
    fontWeight: 'bold',
    marginTop: 10,
  },
});
