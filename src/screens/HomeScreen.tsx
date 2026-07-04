import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  Platform,
  FlatList,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/colors';
import { useListings } from '../hooks/useListings';
import { ListingCard } from '../components/ListingCard';
import { SearchBar } from '../components/SearchBar';
import { EmptyState } from '../components/EmptyState';
import { Loader } from '../components/Loader';
import { FilterModal } from '../components/FilterModal';

export const HomeScreen: React.FC = () => {
  const {
    favorites,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    isLoading,
    filterModalVisible,
    setFilterModalVisible,
    activeFilters,
    setActiveFilters,
    filteredListings,
    handleToggleFavorite,
    handleResetFilters,
  } = useListings();

  // Categories based on Mokogo room types
  const categories = ['All', 'Private', 'Shared', 'Furnished', 'Unfurnished'];

  return (
    <View style={styles.container}>
      <FlatList
        data={isLoading ? [] : filteredListings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            isFavorite={favorites.includes(item.id)}
            onFavoritePress={() => handleToggleFavorite(item.id)}
            onPress={() => console.log('Tapped listing:', item.title)}
          />
        )}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={4}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        ListHeaderComponent={
          <>
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
              <Pressable
                style={({ pressed }) => {
                  const hasActiveFilters =
                    activeFilters.roomType !== 'All' ||
                    activeFilters.minRent > 5000 ||
                    activeFilters.maxRent < 30000 ||
                    activeFilters.preferredGender !== 'Any' ||
                    activeFilters.city !== 'All';
                  return [
                    styles.filterIconBtn,
                    pressed && styles.filterIconBtnPressed,
                    hasActiveFilters && styles.filterIconBtnActive,
                  ];
                }}
                onPress={() => setFilterModalVisible(true)}
              >
                {({ pressed }) => {
                  const hasActiveFilters =
                    activeFilters.roomType !== 'All' ||
                    activeFilters.minRent > 5000 ||
                    activeFilters.maxRent < 30000 ||
                    activeFilters.preferredGender !== 'Any' ||
                    activeFilters.city !== 'All';
                  return (
                    <>
                      <Feather
                        name="sliders"
                        size={16}
                        color={hasActiveFilters ? theme.brand : theme.textPrimary}
                      />
                      {hasActiveFilters && <View style={styles.activeFilterDot} />}
                    </>
                  );
                }}
              </Pressable>
            </View>

            {/* Show water-filling M loader inside header during network updates */}
            {isLoading && (
              <Loader message={searchQuery ? `Searching for "${searchQuery}"...` : "Refreshing listings..."} />
            )}
          </>
        }
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              searchQuery={searchQuery}
              category={selectedCategory}
              onReset={handleResetFilters}
            />
          ) : null
        }
        ListFooterComponent={<View style={styles.bottomSpacer} />}
      />

      {/* Advanced Filter Modal Sheet */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={activeFilters}
        onApply={(newFilters) => setActiveFilters(newFilters)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderWidth: 1,
    borderColor: '#ECEAE4',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  notificationBtn: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 13,
    right: 13,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.brand, // Terracotta accent dot
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
    paddingVertical: 20,
    gap: 12,
    alignItems: 'center',
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.border,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  filterIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECEAE4',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterIconBtnPressed: {
    opacity: 0.8,
    backgroundColor: '#F5F3ED',
  },
  filterIconBtnActive: {
    borderColor: theme.brand,
    backgroundColor: theme.brandLight,
  },
  activeFilterDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.brand,
  },
  bottomSpacer: {
    height: 40,
  },
});
