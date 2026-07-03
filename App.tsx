import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar as RNStatusBar,
  Image,
  Pressable,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather, Ionicons } from '@expo/vector-icons';
import { theme } from './src/theme/colors';
import { sampleListings } from './src/data/sampleData';
import { ListingCard } from './src/components/ListingCard';

export default function App() {
  const [favorites, setFavorites] = useState<string[]>(['2', '4']); // Sample pre-favorited listings
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Toggle favorite handler
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // Categories based on Mokogo room types
  const categories = ['All', 'Private', 'Shared', 'Furnished', 'Unfurnished'];

  return (
    <SafeAreaView style={styles.safeArea}>
     <View>
      <Text>Heyyy</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  scrollContainer: {
    paddingBottom: 90, // extra spacing so content isn't covered by floating tab bar
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 15,
  },
  rightHeaderGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECEAE4',
  },
  notificationBtn: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 13,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 20,
  },
  titleTextGroup: {
    flex: 1,
  },
  titleSub: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.textSecondary,
    marginBottom: 4,
  },
  titleMain: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.textPrimary,
    lineHeight: 34,
  },
  searchCircleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECEAE4',
    ...Platform.select({
      ios: {
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 25,
    height: 44,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECEAE4',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  categoryPillActive: {
    backgroundColor: '#EFFF8C', // Soft accent highlight color similar to selected 'All' in design image
    borderColor: '#E2F183',
  },
  categoryThumbnailContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 8,
  },
  categoryThumbnail: {
    width: '100%',
    height: '100%',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  categoryTextActive: {
    fontWeight: '700',
  },
  sectionTitleRow: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  bottomSpacer: {
    height: 40,
  },
  bottomTabBarContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ECEAE4',
    ...Platform.select({
      ios: {
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#EFFF8C', // Highlighted tab matching 'All' chip
  },
});
