import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { C, currency, EmptyState, Header, Icon, Page } from '@/src/components/customer/CustomerUI';
import { supabase } from '@/src/services/supabase';

type Product = { id: string; name: string; price: number; compare_at_price?: number | null; product_images?: { image_url: string }[] };
export default function SearchScreen() {
  const [query, setQuery] = useState(''); const [products, setProducts] = useState<Product[]>([]); const [loading, setLoading] = useState(false); const [searched, setSearched] = useState(false); const [error, setError] = useState('');
  const search = useCallback(async (term: string) => {
    const cleaned = term.trim(); if (!cleaned) { setProducts([]); setSearched(false); setError(''); return; }
    setLoading(true); setSearched(true); setError('');
    const { data, error: queryError } = await supabase.from('products').select('id, name, price, compare_at_price, product_images(image_url)').eq('status', 'active').ilike('name', `%${cleaned.replace(/[%_]/g, '\\$&')}%`).order('created_at', { ascending: false }).limit(30);
    if (queryError) setError('Tìm kiếm chưa khả dụng. Kiểm tra kết nối và bảng products trên Supabase.');
    setProducts((data ?? []) as Product[]); setLoading(false);
  }, []);
  useEffect(() => { const timer = setTimeout(() => { if (query.trim()) void search(query); }, 350); return () => clearTimeout(timer); }, [query, search]);
  return <Page>
    <Header title="Tìm kiếm sản phẩm" />
    <View style={styles.searchBox}><Icon name="search" size={19} color={C.muted} /><TextInput autoCapitalize="none" returnKeyType="search" value={query} onChangeText={setQuery} placeholder="Bạn đang tìm sản phẩm nào?" placeholderTextColor="#9AA0A9" style={styles.input} onSubmitEditing={() => void search(query)} />{query ? <Pressable onPress={() => setQuery('')} hitSlop={9}><Icon name="close" color={C.muted} size={17} /></Pressable> : null}</View>
    {loading ? <View style={styles.loading}><ActivityIndicator color={C.cyan} /><Text style={styles.helper}>Đang tìm sản phẩm...</Text></View> : error ? <EmptyState title="Không thể tìm kiếm" detail={error} /> : searched && products.length === 0 ? <EmptyState title="Không tìm thấy sản phẩm" detail={`Không có kết quả phù hợp với “${query.trim()}”.`} /> : !searched ? <View style={styles.intro}><View style={styles.searchIcon}><Icon name="search" size={25} color={C.cyan} /></View><Text style={styles.introTitle}>Tìm sản phẩm yêu thích</Text><Text style={styles.helper}>Nhập tên sản phẩm để xem kết quả phù hợp.</Text></View> : <>
      <Text style={styles.resultCount}>{products.length} kết quả</Text>
      <View style={styles.grid}>{products.map(product => <Pressable key={product.id} onPress={() => router.push(`/product/${product.id}`)} style={styles.productCard}>
        {product.product_images?.[0]?.image_url ? <Image source={{ uri: product.product_images[0].image_url }} style={styles.productImage} resizeMode="cover" /> : <View style={[styles.productImage, styles.imageFallback]}><Icon name="package" size={29} color={C.cyan} /></View>}
        <Text numberOfLines={2} style={styles.productName}>{product.name}</Text><Text style={styles.price}>{currency(product.price)}</Text>{product.compare_at_price ? <Text style={styles.compare}>{currency(product.compare_at_price)}</Text> : null}
      </Pressable>)}</View>
    </>}
  </Page>;
}
const styles = StyleSheet.create({ searchBox: { minHeight: 46, borderWidth: 1, borderColor: C.line, borderRadius: 7, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 12, backgroundColor: '#fff' }, input: { flex: 1, color: C.ink, fontSize: 13, paddingVertical: 10 }, loading: { paddingTop: 48, alignItems: 'center', gap: 10 }, helper: { color: C.muted, fontSize: 12, textAlign: 'center', lineHeight: 18 }, intro: { alignItems: 'center', paddingTop: 76, paddingHorizontal: 25 }, searchIcon: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#E8FAFC', alignItems: 'center', justifyContent: 'center', marginBottom: 15 }, introTitle: { color: C.ink, fontSize: 16, fontWeight: '700', marginBottom: 7 }, resultCount: { color: C.muted, fontSize: 12, marginVertical: 14 }, grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 15 }, productCard: { width: '48%', borderRadius: 8, overflow: 'hidden', paddingBottom: 8, borderColor: '#F0F1F3', borderWidth: 1 }, productImage: { width: '100%', height: 150, backgroundColor: '#F5F6F8' }, imageFallback: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#EFFBFC' }, productName: { color: C.ink, fontSize: 12, lineHeight: 16, fontWeight: '500', marginHorizontal: 9, marginTop: 9, minHeight: 32 }, price: { color: C.red, fontWeight: '700', fontSize: 13, marginHorizontal: 9, marginTop: 6 }, compare: { color: C.muted, fontSize: 10, textDecorationLine: 'line-through', marginHorizontal: 9, marginTop: 3 } });
