import { useState, useEffect, useCallback, useMemo } from 'react';
import { sampleListings } from '../data/sampleData';
import { FilterState } from '../components/FilterModal';

export function useListings() {
  const [favorites, setFavorites] = useState<string[]>(['2', '4']); // Sample pre-favorited listings
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    roomType: 'All',
    minRent: 5000,
    maxRent: 30000,
    preferredGender: 'Any',
    city: 'All',
  });

  // Debounce search query updates to avoid triggering loader on every single keystroke.
  // This delays the filtering/searching until the user has stopped typing for 400ms.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Trigger simulated fetch loader when debounced search query, selected category chip, or modal filters change.
  // This gives a premium network-fetching feel with the animated M loader.
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simulated network load duration (1000ms)
    return () => clearTimeout(timer);
  }, [debouncedSearchQuery, selectedCategory, activeFilters]);

  // Toggle favorite handler (memoized with useCallback)
  const handleToggleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  }, []);

  // Reset filters callback (memoized with useCallback)
  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('All');
    setActiveFilters({
      roomType: 'All',
      minRent: 5000,
      maxRent: 30000,
      preferredGender: 'Any',
      city: 'All',
    });
  }, []);

  // Combined category chips, debounced text search, and advanced modal filters
  const filteredListings = useMemo(() => {
    return sampleListings.filter((listing) => {
      // 1. Quick Category Chips Filter
      const matchesCategory =
        selectedCategory === 'All' ||
        (selectedCategory === 'Private' && listing.roomType === 'Private') ||
        (selectedCategory === 'Shared' && listing.roomType === 'Shared') ||
        (selectedCategory === 'Furnished' && listing.furnished) ||
        (selectedCategory === 'Unfurnished' && !listing.furnished);

      // 2. Debounced Text Search Query Filter
      const matchesSearch =
        listing.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        listing.locality.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        listing.city.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

      // 3. Advanced Filters from Slide-up Modal
      const matchesModalRoomType =
        activeFilters.roomType === 'All' ||
        listing.roomType === activeFilters.roomType;

      const matchesRentRange =
        listing.rent >= activeFilters.minRent &&
        listing.rent <= activeFilters.maxRent;

      const matchesGender =
        activeFilters.preferredGender === 'Any' ||
        listing.preferredGender === activeFilters.preferredGender;

      const matchesCity =
        activeFilters.city === 'All' ||
        listing.city === activeFilters.city;

      return matchesCategory && matchesSearch && matchesModalRoomType && matchesRentRange && matchesGender && matchesCity;
    });
  }, [debouncedSearchQuery, selectedCategory, activeFilters]);

  return {
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
  };
}
