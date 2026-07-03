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
import { SearchBar } from './src/components/SearchBar';
import { EmptyState } from './src/components/EmptyState';

export default function App() {
  const [favorites, setFavorites] = useState<string[]>(['2', '4']); // Sample pre-favorited listings
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Toggle favorite handler
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // Categories based on Mokogo room types
  const categories = ['All', 'Private', 'Shared', 'Furnished', 'Unfurnished'];

  // Combined search and category filtering
  const filteredListings = sampleListings.filter((listing) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'Private' && listing.roomType === 'Private') ||
      (selectedCategory === 'Shared' && listing.roomType === 'Shared') ||
      (selectedCategory === 'Furnished' && listing.furnished) ||
      (selectedCategory === 'Unfurnished' && !listing.furnished);

    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.city.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      
      {/* Scrollable Main Screen Container */}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Top Header Row (matching design image) */}
        <View style={styles.headerRow}>
          <Pressable style={styles.iconCircleButton}>
            <Feather name="menu" size={20} color={theme.textPrimary} />
          </Pressable>
          
          <View style={styles.rightHeaderGroup}>
            <Pressable style={[styles.iconCircleButton, styles.notificationBtn]}>
              <Ionicons name="notifications-outline" size={20} color={theme.textPrimary} />
              <View style={styles.notificationDot} />
            </Pressable>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' }}
              style={styles.avatarImage}
            />
          </View>
        </View>

        {/* Animated Search Bar Component (replaces titleContainer) */}
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        {/* Horizontal Category Selector (matching design image) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <Pressable
                key={category}
                style={[
                  styles.categoryPill,
                  isActive && styles.categoryPillActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                {category !== 'All' && (
                  <View style={styles.categoryThumbnailContainer}>
                    <Image
                      source={{
                        uri: category.includes('Private')
                          ? 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=100&q=80'
                          : 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=100&q=80',
                      }}
                      style={styles.categoryThumbnail}
                    />
                  </View>
                )}
                <Text
                  style={[
                    styles.categoryText,
                    isActive && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Section Title (matching design image) */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitleText}>Recommend for You</Text>
        </View>

        {/* Listings Feed Cards list or Empty State */}
        {filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isFavorite={favorites.includes(listing.id)}
              onFavoritePress={() => handleToggleFavorite(listing.id)}
              onPress={() => console.log('Tapped listing:', listing.title)}
            />
          ))
        ) : (
          <EmptyState
            searchQuery={searchQuery}
            category={selectedCategory}
            onReset={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          />
        )}

        {/* Spacer for bottom tab bar padding */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Bottom Navigation Tab Bar (matching design image) */}
      <View style={styles.bottomTabBarContainer}>
        <View style={styles.bottomTabBar}>
          <Pressable style={[styles.tabButton, styles.tabButtonActive]}>
            <Ionicons name="home" size={20} color={theme.textPrimary} />
          </Pressable>
          <Pressable style={styles.tabButton}>
            <Ionicons name="search" size={20} color={theme.textSecondary} />
          </Pressable>
          <Pressable style={styles.tabButton}>
            <Ionicons name="wallet-outline" size={20} color={theme.textSecondary} />
          </Pressable>
          <Pressable style={styles.tabButton}>
            <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} />
          </Pressable>
          <Pressable style={styles.tabButton}>
            <Ionicons name="settings-outline" size={20} color={theme.textSecondary} />
          </Pressable>
        </View>
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
