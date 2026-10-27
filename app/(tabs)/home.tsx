import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { C, currency, Icon, Page } from '@/src/components/customer/CustomerUI';
import { supabase } from '@/src/services/supabase';

type Category = { id: string; name: string };
type Product = { id: string; name: string; price: number; product_images?: { image_url: string }[] };
type Banner = { title: string; image_url: string };

export default function HomeScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [name, setName] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      const [{ data: categoryRows }, { data: productRows }, { data: bannerRows }, { data: { user } }] = await Promise.all([
        supabase.from('categories').select('id, name').eq('is_active', true).order('sort_order').limit(10),
        supabase.from('products').select('id, name, price, product_images(image_url)').eq('status', 'active').order('created_at', { ascending: false }).limit(10),
        supabase.from('banners').select('title, image_url').eq('is_active', true).order('sort_order').limit(1),
        supabase.auth.getUser(),
      ]);
      let displayName = '';
      if (user) {
        const { data } = await supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle();
        displayName = data?.full_name?.split(' ')[0] ?? '';
      }
      if (!active) return;
      setCategories((categoryRows ?? []) as Category[]);
      setProducts((productRows ?? []) as Product[]);
      setBanner((bannerRows?.[0] ?? null) as Banner | null);
      setName(displayName);
    };
    void load();
    return () => { active = false; };
  }, []);

  return <Page>
    <View style={styles.topBar}>
      <View><Text style={styles.brand}>Marketplace</Text><Text style={styles.greeting}>{name ? `Xin chào, ${name}` : 'Khám phá sản phẩm mỗi ngày'}</Text></View>
      <Pressable accessibilityRole="button" accessibilityLabel="Giỏ hàng" onPress={() => router.push('/cart')} style={styles.cartButton}><Icon name="orders" color={C.ink} size={21} /></Pressable>
    </View>
    <Pressable onPress={() => router.push('/(tabs)/search')} style={styles.search}><Icon name="search" color={C.muted} size={19} /><Text style={styles.searchHint}>Tìm kiếm sản phẩm</Text><Icon name="filter" color={C.muted} size={18} /></Pressable>

    <Pressable onPress={() => router.push('/(tabs)/search')} style={styles.hero}>
      {banner?.image_url ? <Image source={{ uri: banner.image_url }} style={StyleSheet.absoluteFill} resizeMode="cover" /> : null}
      <View style={styles.heroScrim} />
      <Text style={styles.heroEyebrow}>MUA SẮM THẬT DỄ DÀNG</Text>
      <Text style={styles.heroTitle}>{banner?.title || 'Tìm món đồ bạn yêu thích'}</Text>
      <View style={styles.heroButton}><Text style={styles.heroButtonText}>Khám phá ngay</Text><Text style={styles.heroArrow}>›</Text></View>
      <View style={styles.heroDotRow}><View style={styles.heroDotActive} /><View style={styles.heroDot} /><View style={styles.heroDot} /></View>
    </Pressable>

    <View style={styles.sectionHead}><Text style={styles.sectionTitle}>Danh mục</Text><Pressable onPress={() => router.push('/(tabs)/search')}><Text style={styles.seeAll}>Xem tất cả</Text></Pressable></View>
    {categories.length ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>{categories.map(item => <Pressable key={item.id} onPress={() => router.push(`/category/${item.id}`)} style={styles.category}><View style={styles.categoryIcon}><Icon name="package" color={C.cyan} size={21} /></View><Text numberOfLines={1} style={styles.categoryName}>{item.name}</Text></Pressable>)}</ScrollView> : <Text style={styles.hint}>Danh mục sản phẩm sẽ xuất hiện tại đây.</Text>}

    <View style={[styles.sectionHead, styles.productsHead]}><View><Text style={styles.sectionTitle}>Sản phẩm mới</Text><Text style={styles.sectionSub}>Gợi ý dành cho bạn</Text></View><Pressable onPress={() => router.push('/(tabs)/search')}><Text style={styles.seeAll}>Xem tất cả</Text></Pressable></View>
    {products.length ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productRow}>{products.map(item => <Pressable key={item.id} onPress={() => router.push(`/product/${item.id}`)} style={styles.productCard}>
      {item.product_images?.[0]?.image_url ? <Image source={{ uri: item.product_images[0].image_url }} style={styles.productImage} resizeMode="cover" /> : <View style={[styles.productImage, styles.imageFallback]}><Icon name="package" color={C.cyan} size={28} /></View>}
      <Text numberOfLines={2} style={styles.productName}>{item.name}</Text><Text style={styles.price}>{currency(item.price)}</Text>
    </Pressable>)}</ScrollView> : <View style={styles.empty}><Text style={styles.emptyTitle}>Chưa có sản phẩm</Text><Text style={styles.hint}>Sản phẩm đang được cập nhật. Bạn có thể tìm lại sau.</Text></View>}
    <View style={styles.bottomSpace} />
  </Page>;
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 5, marginBottom: 16 },
  brand: { color: C.ink, fontSize: 21, fontWeight: '800', letterSpacing: -0.4 },
  greeting: { color: C.muted, fontSize: 12, marginTop: 4 },
  cartButton: { width: 42, height: 42, borderRadius: 13, backgroundColor: C.soft, alignItems: 'center', justifyContent: 'center' },
  search: { height: 46, borderRadius: 8, borderWidth: 1, borderColor: C.line, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, marginBottom: 18 },
  searchHint: { flex: 1, color: '#969CA5', fontSize: 13 },
  hero: { height: 178, borderRadius: 12, backgroundColor: '#DFF8FA', padding: 18, overflow: 'hidden', justifyContent: 'center', marginBottom: 23 },
  heroScrim: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0, 50, 59, 0.20)' },
  heroEyebrow: { color: '#E8FCFD', fontSize: 9, fontWeight: '800', letterSpacing: 1.1 },
  heroTitle: { color: '#FFFFFF', fontSize: 21, lineHeight: 27, fontWeight: '800', maxWidth: '75%', marginTop: 6 },
  heroButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 8, backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, marginTop: 13 },
  heroButtonText: { color: C.ink, fontSize: 11, fontWeight: '700' }, heroArrow: { color: C.cyan, fontSize: 19, lineHeight: 19 },
  heroDotRow: { position: 'absolute', right: 16, bottom: 15, flexDirection: 'row', gap: 5 }, heroDotActive: { width: 15, height: 5, borderRadius: 4, backgroundColor: '#FFFFFF' }, heroDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.55)' },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { color: C.ink, fontSize: 16, fontWeight: '700' }, seeAll: { color: C.cyan, fontSize: 12, fontWeight: '600' },
  categoryRow: { gap: 15, paddingBottom: 4 }, category: { width: 68, alignItems: 'center' }, categoryIcon: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#E9FAFC', alignItems: 'center', justifyContent: 'center' }, categoryName: { color: C.ink, fontSize: 10, marginTop: 7, textAlign: 'center' },
  productsHead: { marginTop: 24 }, sectionSub: { color: C.muted, fontSize: 11, marginTop: 4 }, productRow: { gap: 12 }, productCard: { width: 148, borderWidth: 1, borderColor: '#EEF0F2', borderRadius: 9, overflow: 'hidden', paddingBottom: 10 }, productImage: { width: '100%', height: 135, backgroundColor: C.soft }, imageFallback: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#EFFBFC' }, productName: { color: C.ink, fontSize: 12, lineHeight: 17, fontWeight: '500', marginHorizontal: 9, marginTop: 9, minHeight: 34 }, price: { color: C.red, fontSize: 13, fontWeight: '700', marginHorizontal: 9, marginTop: 6 },
  hint: { color: C.muted, fontSize: 12 }, empty: { paddingVertical: 22, alignItems: 'center', gap: 6, backgroundColor: '#F8FAFB', borderRadius: 9 }, emptyTitle: { color: C.ink, fontSize: 14, fontWeight: '700' }, bottomSpace: { height: 20 },
});
