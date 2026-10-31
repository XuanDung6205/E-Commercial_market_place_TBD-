import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';

const active = '#00BCD4';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: active,
        tabBarInactiveTintColor: '#8D929D',
        tabBarStyle: { height: 82, paddingTop: 8, paddingBottom: 18, borderTopColor: '#E3E5EA', backgroundColor: '#fff' },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '500' },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Trang chủ', tabBarIcon: ({ color }) => <SymbolView name={{ ios: 'house', android: 'home', web: 'home' }} tintColor={color} size={21} /> }} />
      <Tabs.Screen name="search" options={{ title: 'Tìm kiếm', tabBarIcon: ({ color }) => <SymbolView name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }} tintColor={color} size={21} /> }} />
      <Tabs.Screen name="favorites" options={{ title: 'Yêu thích', tabBarIcon: ({ color }) => <SymbolView name={{ ios: 'heart', android: 'favorite', web: 'favorite' }} tintColor={color} size={21} /> }} />
      <Tabs.Screen name="inbox" options={{ title: 'Hộp thư', tabBarIcon: ({ color }) => <SymbolView name={{ ios: 'message', android: 'mail', web: 'mail' }} tintColor={color} size={21} /> }} />
      <Tabs.Screen name="account" options={{ title: 'Tài khoản', tabBarIcon: ({ color }) => <SymbolView name={{ ios: 'person.crop.circle', android: 'account_circle', web: 'account_circle' }} tintColor={color} size={21} /> }} />
      <Tabs.Screen name="two" options={{ href: null }} />
    </Tabs>
  );
}
