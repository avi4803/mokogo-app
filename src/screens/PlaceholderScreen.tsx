import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/colors';

interface PlaceholderScreenProps {
  title: string;
  iconName: any;
}

export const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ title, iconName }) => {
  return (
    <View style={styles.emptyTabContent}>
      <View style={styles.emptyTabCircle}>
        <Ionicons name={iconName} size={36} color={theme.brand} />
      </View>
      <Text style={styles.emptyTabTitle}>{title}</Text>
      <Text style={styles.emptyTabSub}>This screen is currently under development.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyTabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: 'transparent',
  },
  emptyTabCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.brandLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTabTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 8,
  },
  emptyTabSub: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
