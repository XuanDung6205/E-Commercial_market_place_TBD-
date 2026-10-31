import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/src/constants/colors';

export default function OrderSuccessScreen() {
  const { orderId, orderNumber } = useLocalSearchParams<{
    orderId?: string;
    orderNumber?: string;
  }>();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <SymbolView
            name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
            tintColor={colors.cyan}
            size={76}
          />
        </View>

        <Text style={styles.title}>Đặt hàng thành công!</Text>
        <Text style={styles.orderNumberText}>
          Mã đơn hàng: #{orderNumber || '2027'}
        </Text>
        <Text style={styles.subtitle}>
          Cảm ơn bạn đã mua sắm tại Chợ Mây. Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.
        </Text>

        <View style={styles.buttonGroup}>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              if (orderId) {
                router.replace({ pathname: '/my-orders/[id]', params: { id: orderId } });
              } else {
                router.replace('/my-orders');
              }
            }}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Xem chi tiết đơn hàng</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace('/(tabs)/home')}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>Tiếp tục mua sắm</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  iconCircle: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
    marginBottom: 8,
  },
  orderNumberText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.cyan,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 36,
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    height: 50,
    backgroundColor: colors.cyan,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    height: 50,
    backgroundColor: '#F3F5F7',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '600',
  },
});
