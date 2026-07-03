import React from 'react';
import { StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/colors';

interface EmptyStateProps {
  searchQuery: string;
  category: string;
  onReset: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  searchQuery,
  category,
  onReset,
}) => {
  const hasActiveFilters = searchQuery.length > 0 || category !== 'All';

  return (
    <View style={styles.container}>
      {/* Layered Custom Illustration */}
      <View style={styles.illustrationContainer}>
        {/* Soft Background Circle */}
        <View style={styles.bgCircle}>
          <Ionicons name="home-outline" size={40} color={theme.brand} />
        </View>
        {/* Overlapping Small Circle with Search Icon */}
        <View style={styles.searchCircleOverlay}>
          <Ionicons name="search" size={14} color={theme.white} />
        </View>
      </View>

      {/* Empathetic & Warm Messaging */}
      <Text style={styles.titleText}>No rooms found</Text>
      
      {hasActiveFilters ? (
        <Text style={styles.subText}>
          We couldn't find any listings matching{' '}
          {searchQuery ? (
            <Text style={styles.boldText}>"{searchQuery}"</Text>
          ) : (
            'your criteria'
          )}{' '}
          in the <Text style={styles.boldText}>{category}</Text> category. Try resetting your search filters.
        </Text>
      ) : (
        <Text style={styles.subText}>
          There are no listings available at the moment. Please check back later!
        </Text>
      )}

      {/* Interactive Reset Button */}
      {hasActiveFilters && (
        <Pressable
          style={({ pressed }) => [
            styles.resetButton,
            pressed && styles.resetButtonPressed,
          ]}
          onPress={onReset}
        >
          <Text style={styles.resetButtonText}>Clear all filters</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
    backgroundColor: 'transparent',
  },
  illustrationContainer: {
    position: 'relative',
    width: 90,
    height: 90,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.brandLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchCircleOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.brand,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.background,
    ...Platform.select({
      ios: {
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  titleText: {
    fontSize: 19,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 28,
  },
  boldText: {
    fontWeight: '700',
    color: theme.textPrimary,
  },
  resetButton: {
    backgroundColor: theme.textPrimary,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.textPrimary,
    ...Platform.select({
      ios: {
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  resetButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  resetButtonText: {
    color: theme.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
