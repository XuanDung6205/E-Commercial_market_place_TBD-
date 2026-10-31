import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/src/constants/colors';
import { formatCurrency } from '@/src/utils/formatCurrency';

type TotalBarProps = {
  isAllSelected: boolean;
  selectedCount: number;
  total: number;
  onToggleSelectAll: () => void;
  onCheckout: () => void;
  disabled?: boolean;
};

export function TotalBar({
  isAllSelected,
  selectedCount,
  total,
  onToggleSelectAll,
  onCheckout,
  disabled,
}: TotalBarProps) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isAllSelected }}
        hitSlop={8}
        onPress={onToggleSelectAll}
        style={styles.selectAllRow}
      >
        <View style={[styles.checkbox, isAllSelected && styles.checkboxActive]}>
          {isAllSelected ? (
            <SymbolView
              name={{ ios: 'checkmark', android: 'check', web: 'check' }}
              tintColor={colors.white}
              size={12}
            />
          ) : null}
        </View>
        <Text style={styles.selectAllText}>Tất cả</Text>
      </Pressable>

      <View style={styles.rightGroup}>
        <View style={styles.totalBlock}>
          <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
          <Text style={styles.totalAmount}>{formatCurrency(total)}</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={disabled || selectedCount === 0}
          onPress={onCheckout}
          style={[
            styles.checkoutButton,
            (disabled || selectedCount === 0) && styles.checkoutButtonDisabled,
          ]}
        >
          <Text style={styles.checkoutText}>
            Mua hàng ({selectedCount})
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#EEF0F2',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
    elevation: 8,
  },
  selectAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#CED3DC',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.cyan,
    borderColor: colors.cyan,
  },
  selectAllText: {
    fontSize: 13,
    color: colors.ink,
    fontWeight: '500',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  totalBlock: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 11,
    color: colors.muted,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.cyan,
    marginTop: 2,
  },
  checkoutButton: {
    backgroundColor: colors.cyan,
    paddingHorizontal: 18,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonDisabled: {
    opacity: 0.45,
  },
  checkoutText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
