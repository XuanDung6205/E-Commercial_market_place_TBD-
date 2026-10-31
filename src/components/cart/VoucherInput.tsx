import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/src/constants/colors';

type VoucherInputProps = {
  appliedVoucher: string;
  discountRate: number;
  onApply: (code: string) => { success: boolean; message: string };
  onRemove: () => void;
};

export function VoucherInput({
  appliedVoucher,
  discountRate,
  onApply,
  onRemove,
}: VoucherInputProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApply = () => {
    if (!code.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const res = onApply(code);
      if (res.success) {
        setCode('');
      } else {
        Alert.alert('Không thể áp dụng', res.message);
      }
    }, 200);
  };

  return (
    <View style={styles.container}>
      {appliedVoucher ? (
        <View style={styles.appliedCard}>
          <View style={styles.appliedLeft}>
            <View style={styles.ticketIcon}>
              <SymbolView
                name={{ ios: 'tag.fill', android: 'sell', web: 'sell' }}
                tintColor={colors.cyan}
                size={18}
              />
            </View>
            <View>
              <Text style={styles.appliedCode}>{appliedVoucher}</Text>
              <Text style={styles.appliedDesc}>
                Đã giảm {Math.round(discountRate * 100)}% trên tổng giá trị
              </Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Gỡ mã giảm giá"
            hitSlop={8}
            onPress={onRemove}
            style={styles.removeBtn}
          >
            <Text style={styles.removeBtnText}>Gỡ</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.inputRow}>
          <TextInput
            placeholder="Nhập mã ưu đãi (VD: MAYMOI10)"
            placeholderTextColor={colors.muted}
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
            style={styles.input}
          />
          <Pressable
            accessibilityRole="button"
            disabled={!code.trim() || loading}
            onPress={handleApply}
            style={[styles.applyButton, !code.trim() && styles.applyButtonDisabled]}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Text style={styles.applyButtonText}>Áp dụng</Text>
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.white,
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EDF1F3',
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 12,
    color: colors.ink,
    fontSize: 13,
    fontWeight: '500',
  },
  applyButton: {
    height: 44,
    paddingHorizontal: 18,
    backgroundColor: colors.cyan,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonDisabled: {
    opacity: 0.5,
  },
  applyButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  appliedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.paleCyan,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D4F5FA',
  },
  appliedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ticketIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appliedCode: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
  },
  appliedDesc: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
  },
  removeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.white,
  },
  removeBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.danger,
  },
});
