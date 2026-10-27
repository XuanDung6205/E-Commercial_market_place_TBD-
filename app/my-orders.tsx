import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { C, currency, EmptyState, Header, Icon, LoadingState, Page } from '@/src/components/customer/CustomerUI';
import { supabase } from '@/src/services/supabase';

type Order = { id: string; order_number: string; status: string; total_amount: number; created_at: string; order_items?: { product_name: string; quantity: number }[] };
const filters = [{ id: 'all', label: 'Tất cả' }, { id: 'pending', label: 'Chờ xác nhận' }, { id: 'shipped', label: 'Đang giao' }, { id: 'delivered', label: 'Đã giao' }];
const statusLabel: Record<string, string> = { pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', processing: 'Đang xử lý', shipped: 'Đang giao', delivered: 'Đã giao', cancelled: 'Đã hủy' };

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]); const [filter, setFilter] = useState('all'); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = useCallback(async () => {
    setLoading(true); setError('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Vui lòng đăng nhập để xem đơn hàng.'); setLoading(false); return; }
    const { data, error: queryError } = await supabase.from('orders').select('id, order_number, status, total_amount, created_at, order_items(product_name, quantity)').eq('user_id', user.id).order('created_at', { ascending: false });
    if (queryError) setError('Không tải được đơn hàng. Hãy kiểm tra bảng orders và policies trên Supabase.');
    setOrders((data ?? []) as Order[]); setLoading(false);
  }, []);
  useFocusEffect(useCallback(() => { void load(); }, [load]));
  const visible = useMemo(() => filter === 'all' ? orders : filter === 'shipped' ? orders.filter(o => ['shipped', 'processing'].includes(o.status)) : orders.filter(o => o.status === filter), [orders, filter]);
  if (loading) return <Page><Header title="Đơn hàng của tôi" back={() => router.back()} /><LoadingState /></Page>;
  return <Page>
    <Header title="Đơn hàng của tôi" back={() => router.back()} />
    <View style={styles.filters}>{filters.map(item => <Pressable key={item.id} onPress={() => setFilter(item.id)} style={[styles.filter, filter === item.id && styles.filterActive]}><Text style={[styles.filterText, filter === item.id && styles.filterTextActive]}>{item.label}</Text></Pressable>)}</View>
    {error ? <Text style={styles.error}>{error}</Text> : null}
    {visible.length === 0 ? <EmptyState title="Chưa có đơn hàng" detail={error || 'Các đơn hàng bạn đặt sẽ xuất hiện tại đây.'} /> : visible.map(order => <Pressable key={order.id} onPress={() => router.push({ pathname: '/my-orders/[id]', params: { id: order.id } })} style={styles.card}>
      <View style={styles.cardTop}><View><Text style={styles.orderNo}>#{order.order_number}</Text><Text style={styles.date}>{new Date(order.created_at).toLocaleDateString('vi-VN')}</Text></View><Text style={[styles.status, order.status === 'cancelled' ? styles.cancelled : order.status === 'delivered' ? styles.delivered : styles.pending]}>{statusLabel[order.status] ?? order.status}</Text></View>
      <View style={styles.product}><View style={styles.thumb}><Icon name="package" color={C.cyan} size={22} /></View><View style={styles.productCopy}><Text numberOfLines={2} style={styles.productName}>{order.order_items?.[0]?.product_name ?? 'Đơn hàng'}</Text><Text style={styles.quantity}>{order.order_items?.length ?? 0} sản phẩm</Text></View></View>
      <View style={styles.cardBottom}><Text style={styles.total}>{currency(order.total_amount)}</Text><View style={styles.detail}><Text style={styles.detailText}>Chi tiết</Text><Text style={styles.chevron}>›</Text></View></View>
    </Pressable>)}
    <View style={styles.bottomPad} />
  </Page>;
}
const styles = StyleSheet.create({ filters: { flexDirection: 'row', gap: 7, marginBottom: 16 }, filter: { paddingHorizontal: 11, paddingVertical: 9, borderRadius: 20, backgroundColor: C.soft }, filterActive: { backgroundColor: C.cyan }, filterText: { color: C.muted, fontSize: 11, fontWeight: '600' }, filterTextActive: { color: '#fff' }, card: { borderColor: C.line, borderWidth: 1, borderRadius: 9, padding: 13, marginBottom: 12 }, cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottomColor: C.line, borderBottomWidth: StyleSheet.hairlineWidth }, orderNo: { color: C.ink, fontWeight: '700', fontSize: 14 }, date: { color: C.muted, fontSize: 11, marginTop: 3 }, status: { fontSize: 11, fontWeight: '600', paddingHorizontal: 9, paddingVertical: 6, borderRadius: 14, overflow: 'hidden' }, pending: { color: '#A66300', backgroundColor: '#FFF3D8' }, delivered: { color: C.green, backgroundColor: '#E3F5ED' }, cancelled: { color: C.red, backgroundColor: '#FCE9E8' }, product: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 13 }, thumb: { width: 58, height: 58, borderRadius: 7, backgroundColor: '#EFFBFC', alignItems: 'center', justifyContent: 'center' }, productCopy: { flex: 1 }, productName: { color: C.ink, fontSize: 13, fontWeight: '600' }, quantity: { color: C.muted, fontSize: 11, marginTop: 6 }, cardBottom: { borderTopColor: C.line, borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, total: { color: C.red, fontWeight: '700', fontSize: 15 }, detail: { flexDirection: 'row', alignItems: 'center', gap: 5 }, detailText: { color: C.cyan, fontWeight: '600', fontSize: 12 }, chevron: { color: '#9299A3', fontSize: 20 }, error: { color: C.red, fontSize: 12, marginVertical: 5 }, bottomPad: { height: 16 } });
