import { SymbolView } from 'expo-symbols';
import { ComponentProps, ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const C = { cyan: '#00BCD4', red: '#E53935', ink: '#20232A', muted: '#747A86', line: '#E3E5EA', soft: '#F5F6F8', green: '#1B9A68', white: '#FFFFFF' };

export function Page({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  return <SafeAreaView edges={['top']} style={styles.safe}>{scroll ? <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">{children}</ScrollView> : <View style={styles.content}>{children}</View>}</SafeAreaView>;
}

export function Header({ title, back, right }: { title: string; back?: () => void; right?: ReactNode }) {
  return <View style={styles.header}>{back ? <Pressable accessibilityRole="button" accessibilityLabel="Quay lại" onPress={back} hitSlop={12} style={styles.headerSide}><SymbolView name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }} tintColor={C.ink} size={21} /></Pressable> : <View style={styles.headerSide} />}<Text style={styles.headerTitle}>{title}</Text><View style={[styles.headerSide, styles.right]}>{right}</View></View>;
}

export function Icon({ name, size = 20, color = C.ink }: { name: string; size?: number; color?: string }) {
  const icons: Record<string, { ios: string; android: string; web: string }> = {
    orders: { ios: 'shippingbox', android: 'inventory_2', web: 'inventory_2' }, heart: { ios: 'heart', android: 'favorite_border', web: 'favorite_border' }, pin: { ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }, card: { ios: 'creditcard', android: 'credit_card', web: 'credit_card' }, bell: { ios: 'bell', android: 'notifications_none', web: 'notifications_none' }, help: { ios: 'questionmark.circle', android: 'help_outline', web: 'help_outline' }, logout: { ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' }, edit: { ios: 'pencil', android: 'edit', web: 'edit' }, search: { ios: 'magnifyingglass', android: 'search', web: 'search' }, close: { ios: 'xmark', android: 'close', web: 'close' }, package: { ios: 'shippingbox', android: 'local_shipping', web: 'local_shipping' }, gift: { ios: 'gift', android: 'card_giftcard', web: 'card_giftcard' }, truck: { ios: 'truck.box', android: 'local_shipping', web: 'local_shipping' }, check: { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }, clock: { ios: 'clock', android: 'schedule', web: 'schedule' }, chat: { ios: 'message', android: 'chat_bubble_outline', web: 'chat_bubble_outline' }, lock: { ios: 'lock.fill', android: 'lock', web: 'lock' }, camera: { ios: 'camera', android: 'photo_camera', web: 'photo_camera' }, dots: { ios: 'ellipsis', android: 'more_horiz', web: 'more_horiz' }, tag: { ios: 'tag', android: 'sell', web: 'sell' }, filter: { ios: 'line.3.horizontal.decrease', android: 'tune', web: 'tune' }, star: { ios: 'star.fill', android: 'star', web: 'star' }
  };
  return <SymbolView name={(icons[name] ?? icons.dots) as ComponentProps<typeof SymbolView>['name']} tintColor={color} size={size} />;
}

export function SectionTitle({ children }: { children: ReactNode }) { return <Text style={styles.sectionTitle}>{children}</Text>; }
export function Row({ icon, title, subtitle, onPress, accessory }: { icon: string; title: string; subtitle?: string; onPress?: () => void; accessory?: ReactNode }) {
  return <Pressable onPress={onPress} style={styles.row}><View style={styles.rowIcon}><Icon name={icon} color={C.ink} size={19} /></View><View style={styles.rowCopy}><Text style={styles.rowTitle}>{title}</Text>{subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}</View>{accessory ?? <Text style={styles.chevron}>›</Text>}</Pressable>;
}
export function PrimaryButton({ title, onPress, busy, disabled }: { title: string; onPress: () => void; busy?: boolean; disabled?: boolean }) {
  return <Pressable disabled={disabled || busy} onPress={onPress} style={[styles.primary, (disabled || busy) && { opacity: 0.6 }]}>{busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>{title}</Text>}</Pressable>;
}
export function LoadingState({ label = 'Đang tải...' }: { label?: string }) { return <View style={styles.center}><ActivityIndicator color={C.cyan} /><Text style={styles.muted}>{label}</Text></View>; }
export function EmptyState({ title, detail }: { title: string; detail: string }) { return <View style={styles.empty}><Text style={styles.emptyTitle}>{title}</Text><Text style={styles.muted}>{detail}</Text></View>; }
export function currency(amount: number | string | null | undefined) { const n = Number(amount || 0); return `${n.toLocaleString('vi-VN')}₫`; }

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: C.white }, content: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 24 }, header: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line, marginBottom: 16 }, headerSide: { width: 36, height: 40, justifyContent: 'center' }, right: { alignItems: 'flex-end' }, headerTitle: { color: C.ink, fontSize: 18, fontWeight: '700' }, sectionTitle: { color: C.ink, fontSize: 15, fontWeight: '700', marginBottom: 12 }, row: { minHeight: 62, flexDirection: 'row', alignItems: 'center', borderBottomColor: C.line, borderBottomWidth: StyleSheet.hairlineWidth, gap: 12 }, rowIcon: { width: 36, height: 36, borderRadius: 11, backgroundColor: C.soft, alignItems: 'center', justifyContent: 'center' }, rowCopy: { flex: 1 }, rowTitle: { color: C.ink, fontSize: 14, fontWeight: '600' }, rowSubtitle: { color: C.muted, fontSize: 12, marginTop: 3 }, chevron: { color: '#9AA0A9', fontSize: 25, paddingHorizontal: 3 }, primary: { minHeight: 48, backgroundColor: C.cyan, borderRadius: 7, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 }, primaryText: { color: C.white, fontSize: 15, fontWeight: '700' }, center: { flex: 1, minHeight: 200, alignItems: 'center', justifyContent: 'center', gap: 12 }, muted: { color: C.muted, fontSize: 13, lineHeight: 19, textAlign: 'center' }, empty: { padding: 32, alignItems: 'center', gap: 8 }, emptyTitle: { fontSize: 16, fontWeight: '700', color: C.ink } });
