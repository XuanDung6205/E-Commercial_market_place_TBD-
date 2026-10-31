import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/src/constants/colors';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { CartItem as CartItemType } from '@/src/types/models';

type CartItemProps = {
  item: CartItemType;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
  onToggleSelect: () => void;
};

export function CartItem({ item, onUpdateQuantity, onRemove, onToggleSelect }: CartItemProps) {
  const { product, quantity, variant, selected } = item;

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: selected }}
        hitSlop={8}
        onPress={onToggleSelect}
        style={[styles.checkbox, selected && styles.checkboxActive]}
      >
        {selected ? (
          <SymbolView
            name={{ ios: 'checkmark', android: 'check', web: 'check' }}
            tintColor={colors.white}
            size={13}
          />
        ) : null}
      </Pressable>

      <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text numberOfLines={1} style={styles.name}>
            {product.name}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Xóa sản phẩm"
            hitSlop={8}
            onPress={onRemove}
            style={styles.deleteButton}
          >
            <SymbolView
              name={{ ios: 'trash', android: 'delete_outline', web: 'delete' }}
              tintColor={colors.muted}
              size={18}
            />
          </Pressable>
        </View>

        {variant ? <Text style={styles.variant}>{variant}</Text> : null}

        <View style={styles.footerRow}>
          <Text style={styles.price}>{formatCurrency(product.price)}</Text>

          <View style={styles.stepper}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Giảm số lượng"
              hitSlop={6}
              onPress={() => onUpdateQuantity(quantity - 1)}
              style={styles.stepButton}
            >
              <Text style={styles.stepButtonText}>−</Text>
            </Pressable>
            <Text style={styles.quantity}>{quantity}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Tăng số lượng"
              hitSlop={6}
              onPress={() => onUpdateQuantity(quantity + 1)}
              style={styles.stepButton}
            >
              <Text style={styles.stepButtonText}>+</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EDF1F3',
    shadowColor: '#162B36',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CED3DC',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxActive: {
    backgroundColor: colors.cyan,
    borderColor: colors.cyan,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: colors.softBg,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
    marginRight: 8,
  },
  deleteButton: {
    padding: 2,
  },
  variant: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 3,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.cyan,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F5F7',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  stepButton: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.ink,
  },
  quantity: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
    minWidth: 24,
    textAlign: 'center',
  },
});
