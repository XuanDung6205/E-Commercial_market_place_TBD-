import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { C, EmptyState, Header, Icon, LoadingState, Page } from '@/src/components/customer/CustomerUI';
import { supabase } from '@/src/services/supabase';

type Notice = { id: string; title: string; body: string; type: string; data: Record<string, unknown>; read_at: string | null; created_at: string };
const filters = [{ id: 'all', title: 'Tất cả' }, { id: 'order', title: 'Đơn hàng' }, { id: 'promotion', title: 'Khuyến mãi' }];
function kindOf(notice: Notice) { const raw = `${notice.type} ${notice.title}`.toLowerCase(); return /promo|discount|voucher|khuyen|khuyến|sale/.test(raw) ? 'promotion' : /order|don|đơn|shipping|delivery/.test(raw) ? 'order' : 'other'; }
function iconOf(notice: Notice) { const kind = kindOf(notice); return kind === 'promotion' ? 'gift' : kind === 'order' ? 'package' : 'bell'; }

export default function InboxScreen() {
  const [notices, setNotices] = useState<Notice[]>([]); const [filter, setFilter] = useState('all'); const [loading, setLoading] = useState(true); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  const load = useCallback(async () => {
    setLoading(true); setError('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Vui lòng đăng nhập để xem thông báo.'); setNotices([]); setLoading(false); return; }
    const { data, error: queryError } = await supabase.from('notifications').select('id, title, body, type, data, read_at, created_at').eq('user_id', user.id).order('created_at', { ascending: false });
    if (queryError) setError('Không tải được thông báo. Hãy kiểm tra bảng notifications trên Supabase.');
    setNotices((data ?? []) as Notice[]); setLoading(false);
  }, []);
  useFocusEffect(useCallback(() => { void load(); }, [load]));
  const visible = useMemo(() => filter === 'all' ? notices : notices.filter(item => kindOf(item) === filter), [notices, filter]);
  const markAllRead = async () => {
    setBusy(true); const now = new Date().toISOString();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setBusy(false); return; }
    const { error: updateError } = await supabase.from('notifications').update({ read_at: now }).eq('user_id', user.id).is('read_at', null);
    setBusy(false);
    if (updateError) Alert.alert('Chưa cập nhật được', updateError.message); else setNotices(current => current.map(item => ({ ...item, read_at: item.read_at ?? now })));
  };
  const openNotice = async (item: Notice) => {
    if (!item.read_at) {
      const now = new Date().toISOString();
      const { error: updateError } = await supabase.from('notifications').update({ read_at: now }).eq('id', item.id);
      if (!updateError) setNotices(current => current.map(n => n.id === item.id ? { ...n, read_at: now } : n));
    }
    const orderId = item.data?.order_id;
    if (orderId) router.push({ pathname: '/my-orders/[id]', params: { id: String(orderId) } });
  };
  if (loading) return <Page><Header title="Hộp thư" /><LoadingState /></Page>;
  return <Page>
    <Header title="Hộp thư" right={<Pressable onPress={() => void markAllRead()} disabled={busy}><Text style={styles.markAll}>{busy ? 'Đang lưu...' : 'Đánh dấu đã đọc'}</Text></Pressable>} />
    <View style={styles.filters}>{filters.map(item => <Pressable key={item.id} onPress={() => setFilter(item.id)} style={[styles.filter, filter === item.id && styles.filterActive]}><Text style={[styles.filterText, filter === item.id && styles.filterTextActive]}>{item.title}</Text></Pressable>)}</View>
    {error ? <Text style={styles.error}>{error}</Text> : null}
    {visible.length === 0 ? <EmptyState title="Chưa có thông báo" detail={error || 'Tin nhắn về đơn hàng và ưu đãi sẽ được gửi đến đây.'} /> : visible.map(item => <Pressable key={item.id} onPress={() => void openNotice(item)} style={[styles.notice, !item.read_at && styles.unread]}>
      <View style={[styles.iconCircle, kindOf(item) === 'promotion' ? styles.promo : kindOf(item) === 'order' ? styles.order : styles.general]}><Icon name={iconOf(item)} size={19} color={kindOf(item) === 'promotion' ? '#B97B0C' : kindOf(item) === 'order' ? C.cyan : C.muted} /></View>
      <View style={styles.copy}><View style={styles.titleLine}><Text style={styles.title}>{item.title}</Text>{!item.read_at ? <View style={styles.unreadDot} /> : null}</View><Text style={styles.body}>{item.body}</Text><Text style={styles.date}>{new Date(item.created_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</Text></View>
    </Pressable>)}
  </Page>;
}
const styles = StyleSheet.create({ markAll: { color: C.cyan, fontSize: 11, fontWeight: '600' }, filters: { flexDirection: 'row', gap: 8, marginBottom: 12 }, filter: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 18, backgroundColor: C.soft }, filterActive: { backgroundColor: C.cyan }, filterText: { color: C.muted, fontSize: 12, fontWeight: '600' }, filterTextActive: { color: '#fff' }, notice: { flexDirection: 'row', gap: 12, paddingVertical: 15, borderBottomColor: C.line, borderBottomWidth: StyleSheet.hairlineWidth }, unread: { backgroundColor: '#F8FCFC' }, iconCircle: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' }, promo: { backgroundColor: '#FFF4DA' }, order: { backgroundColor: '#E7F9FB' }, general: { backgroundColor: C.soft }, copy: { flex: 1 }, titleLine: { flexDirection: 'row', alignItems: 'center', gap: 7 }, title: { flex: 1, color: C.ink, fontSize: 13, fontWeight: '700' }, unreadDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.cyan }, body: { color: C.muted, fontSize: 12, lineHeight: 17, marginTop: 5 }, date: { color: '#A1A6AF', fontSize: 10, marginTop: 7 }, error: { color: C.red, fontSize: 12, paddingVertical: 8 } });
