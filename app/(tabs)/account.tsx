import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { supabase } from '@/src/services/supabase';
import { C, Header, Icon, LoadingState, Page, Row } from '@/src/components/customer/CustomerUI';

type Profile = { full_name?: string | null; phone?: string | null; avatar_url?: string | null };

export default function AccountScreen() {
  const [profile, setProfile] = useState<Profile | null>({ full_name: 'Nguyễn Minh Anh' });
  const [email, setEmail] = useState('khachhang@chomay.vn');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadProfile = useCallback(async () => {
    setError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email ?? 'khachhang@chomay.vn');
        const { data } = await supabase.from('profiles').select('full_name, phone, avatar_url').eq('id', user.id).maybeSingle();
        setProfile(data ?? { full_name: String(user.user_metadata?.full_name ?? 'Nguyễn Minh Anh') });
      } else {
        setEmail('khachhang@chomay.vn');
        setProfile({ full_name: 'Nguyễn Minh Anh' });
      }
    } catch {
      setEmail('khachhang@chomay.vn');
      setProfile({ full_name: 'Nguyễn Minh Anh' });
    }
  }, []);

  useFocusEffect(useCallback(() => { void loadProfile(); }, [loadProfile]));

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    router.replace('/(auth)/login');
  };

  if (loading) return <Page><Header title="Tài khoản" /><LoadingState /></Page>;
  return (
    <Page>
      <Header title="Tài khoản" />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>{(profile?.full_name || email || 'N').trim().slice(0, 1).toUpperCase()}</Text>
        </View>
        <View style={styles.profileCopy}>
          <Text style={styles.name}>{profile?.full_name || 'Nguyễn Minh Anh'}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={() => router.push('/profile/edit')} style={styles.editButton}>
          <Icon name="edit" color={C.cyan} size={16} />
          <Text style={styles.editLabel}>Chỉnh sửa</Text>
        </Pressable>
      </View>
      <View style={styles.menu}>
        <Row icon="orders" title="Đơn hàng của tôi" subtitle="Theo dõi và quản lý đơn hàng" onPress={() => router.push('/my-orders')} />
        <Row icon="heart" title="Sản phẩm yêu thích" onPress={() => router.push('/(tabs)/favorites')} />
        <Row icon="pin" title="Địa chỉ giao hàng" subtitle="25 Nguyễn Thị Minh Khai, Quận 1, TP. HCM" onPress={() => Alert.alert('Địa chỉ giao hàng', 'Địa chỉ mặc định: 25 Nguyễn Thị Minh Khai, P. Bến Nghé, Quận 1, TP. Hồ Chí Minh')} />
        <Row icon="card" title="Phương thức thanh toán" subtitle="COD, Chuyển khoản, Ví điện tử" onPress={() => Alert.alert('Thanh toán', 'Phương thức thanh toán được chọn khi đặt hàng.')} />
        <Row icon="bell" title="Thông báo" onPress={() => router.push('/(tabs)/inbox')} />
        <Row icon="help" title="Trợ giúp và hỗ trợ" onPress={() => Alert.alert('Trợ giúp', 'Liên hệ Chợ Mây qua hotline: 1900 6868')} />
      </View>
      <Pressable style={styles.logout} onPress={() => void logout()}>
        <Icon name="logout" color={C.red} size={18} />
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </Pressable>
    </Page>
  );
}

const styles = StyleSheet.create({
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#F8FAFB', borderRadius: 12, padding: 14, marginBottom: 24 },
  avatar: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#DDF7FA', alignItems: 'center', justifyContent: 'center' },
  initials: { color: '#008C9E', fontWeight: '700', fontSize: 24 },
  profileCopy: { flex: 1 },
  name: { fontSize: 16, color: C.ink, fontWeight: '700' },
  email: { fontSize: 12, color: C.muted, marginTop: 4 },
  editButton: { borderWidth: 1, borderColor: C.cyan, borderRadius: 6, height: 36, paddingHorizontal: 9, flexDirection: 'row', alignItems: 'center', gap: 5 },
  editLabel: { color: C.cyan, fontSize: 11, fontWeight: '600' },
  menu: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
  logout: { marginTop: 28, borderWidth: 1, borderColor: '#F1B9B7', borderRadius: 7, minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  logoutText: { fontSize: 14, color: C.red, fontWeight: '700' },
  error: { color: C.red, fontSize: 13, marginBottom: 12 },
});
