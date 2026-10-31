import { StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/src/constants/colors';

type RatingSummaryProps = {
  rating: number;
  totalReviews: number;
  distribution?: { [star: number]: number }; // percentage 0-100
};

const DEFAULT_DISTRIBUTION: { [star: number]: number } = {
  5: 82,
  4: 12,
  3: 4,
  2: 1,
  1: 1,
};

export function RatingSummary({
  rating,
  totalReviews,
  distribution = DEFAULT_DISTRIBUTION,
}: RatingSummaryProps) {
  const roundedRating = Number(rating.toFixed(1));

  return (
    <View style={styles.container}>
      {/* Left Score Block */}
      <View style={styles.scoreBlock}>
        <View style={styles.bigScoreRow}>
          <Text style={styles.bigScore}>{roundedRating.toString().replace('.', ',')}</Text>
          <Text style={styles.scoreScale}>/5</Text>
        </View>

        {/* 5 Stars row */}
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => {
            const isFull = star <= Math.floor(roundedRating);
            return (
              <SymbolView
                key={star}
                name={{
                  ios: isFull ? 'star.fill' : 'star',
                  android: isFull ? 'star' : 'star_border',
                  web: isFull ? 'star' : 'star_border',
                }}
                tintColor={isFull ? colors.star : '#D8DCE3'}
                size={16}
              />
            );
          })}
        </View>

        <Text style={styles.reviewCountText}>{totalReviews} lượt đánh giá</Text>
      </View>

      {/* Vertical separator */}
      <View style={styles.separator} />

      {/* Right Progress Bars */}
      <View style={styles.barsBlock}>
        {[5, 4, 3, 2, 1].map((star) => {
          const percent = distribution[star] ?? 0;
          return (
            <View key={star} style={styles.barRow}>
              <View style={styles.starLabel}>
                <Text style={styles.starText}>{star}</Text>
                <SymbolView
                  name={{ ios: 'star.fill', android: 'star', web: 'star' }}
                  tintColor={colors.star}
                  size={10}
                />
              </View>

              <View style={styles.track}>
                <View style={[styles.fill, { width: `${percent}%` }]} />
              </View>

              <Text style={styles.percentText}>{percent}%</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBFCFD',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDF1F3',
    marginBottom: 16,
  },
  scoreBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 110,
  },
  bigScoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bigScore: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: -0.5,
  },
  scoreScale: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.muted,
    marginLeft: 2,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
    marginBottom: 6,
  },
  reviewCountText: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: '500',
  },
  separator: {
    width: 1,
    height: '80%',
    backgroundColor: '#EDF1F3',
    marginHorizontal: 12,
  },
  barsBlock: {
    flex: 1,
    gap: 5,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    width: 22,
    justifyContent: 'flex-end',
  },
  starText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.ink,
  },
  track: {
    flex: 1,
    height: 7,
    backgroundColor: '#EBEFF2',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.star,
    borderRadius: 4,
  },
  percentText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.muted,
    width: 28,
    textAlign: 'right',
  },
});
