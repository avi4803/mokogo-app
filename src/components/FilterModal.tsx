import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  Platform,
  Dimensions,
  ScrollView,
  PanResponder,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/colors';

export interface FilterState {
  roomType: 'All' | 'Private' | 'Shared';
  minRent: number;
  maxRent: number;
  preferredGender: 'Any' | 'Male' | 'Female';
  city: 'All' | 'Pune' | 'Bangalore' | 'Hyderabad' | 'Mumbai';
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (newFilters: FilterState) => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const MIN_RENT = 5000;
const MAX_RENT_LIMIT = 30000;

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  filters,
  onApply,
}) => {
  // Local state for filters to modify before applying
  const [localRoomType, setLocalRoomType] = useState<'All' | 'Private' | 'Shared'>(filters.roomType);
  const [localMinRent, setLocalMinRent] = useState<number>(filters.minRent);
  const [localMaxRent, setLocalMaxRent] = useState<number>(filters.maxRent);
  const [localGender, setLocalGender] = useState<'Any' | 'Male' | 'Female'>(filters.preferredGender);
  const [localCity, setLocalCity] = useState<'All' | 'Pune' | 'Bangalore' | 'Hyderabad' | 'Mumbai'>(filters.city);

  // Scroll enabled state to prevent stuttering when dragging slider thumbs
  const [scrollEnabled, setScrollEnabled] = useState<boolean>(true);

  // Sync state when modal opens
  useEffect(() => {
    if (visible) {
      setLocalRoomType(filters.roomType);
      setLocalMinRent(filters.minRent);
      setLocalMaxRent(filters.maxRent);
      setLocalGender(filters.preferredGender);
      setLocalCity(filters.city);
    }
  }, [visible, filters]);

  // Width of the slider track
  const [sliderWidth, setSliderWidth] = useState(SCREEN_WIDTH - 64);
  
  // Refs to hold active slider state and prevent React stale closure bugs
  const minRentRef = useRef<number>(localMinRent);
  const maxRentRef = useRef<number>(localMaxRent);
  const sliderWidthRef = useRef<number>(sliderWidth);

  // Keep refs in sync with latest state
  minRentRef.current = localMinRent;
  maxRentRef.current = localMaxRent;
  sliderWidthRef.current = sliderWidth;

  // Refs for tracking slider drag operations
  const activeThumbRef = useRef<'min' | 'max' | null>(null);
  const startThumbXRef = useRef<number>(0);

  // Calculate thumb positions based on minRent and maxRent
  const minPercent = (localMinRent - MIN_RENT) / (MAX_RENT_LIMIT - MIN_RENT);
  const maxPercent = (localMaxRent - MIN_RENT) / (MAX_RENT_LIMIT - MIN_RENT);
  const minThumbPosition = minPercent * sliderWidth;
  const maxThumbPosition = maxPercent * sliderWidth;

  // PanResponder to handle dual-slider dragging smoothly without scroll interference
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        setScrollEnabled(false); // Disable ScrollView scroll instantly to prevent stuttering/jumps
        
        const touchX = evt.nativeEvent.locationX;
        const currentMinX = ((minRentRef.current - MIN_RENT) / (MAX_RENT_LIMIT - MIN_RENT)) * sliderWidthRef.current;
        const currentMaxX = ((maxRentRef.current - MIN_RENT) / (MAX_RENT_LIMIT - MIN_RENT)) * sliderWidthRef.current;

        // Determine which thumb is closer to the user's touch point
        const distToMin = Math.abs(touchX - currentMinX);
        const distToMax = Math.abs(touchX - currentMaxX);
        
        const isMinCloser = distToMin < distToMax;
        activeThumbRef.current = isMinCloser ? 'min' : 'max';
        startThumbXRef.current = isMinCloser ? currentMinX : currentMaxX;

        // Instantly update value to touch point
        updateThumbValue(touchX);
      },
      onPanResponderMove: (evt, gestureState) => {
        const newThumbX = startThumbXRef.current + gestureState.dx;
        updateThumbValue(newThumbX);
      },
      onPanResponderRelease: () => {
        activeThumbRef.current = null;
        setScrollEnabled(true); // Re-enable ScrollView scrolling safely
      },
      onPanResponderTerminate: () => {
        activeThumbRef.current = null;
        setScrollEnabled(true); // Re-enable ScrollView scrolling safely
      },
    })
  ).current;

  const updateThumbValue = (newThumbX: number) => {
    const currentWidth = sliderWidthRef.current;
    let newPercent = newThumbX / currentWidth;
    if (newPercent < 0) newPercent = 0;
    if (newPercent > 1) newPercent = 1;

    // Calculate rent rounded to nearest 500
    const calculatedRent = MIN_RENT + newPercent * (MAX_RENT_LIMIT - MIN_RENT);
    const roundedRent = Math.round(calculatedRent / 500) * 500;

    const MIN_GAP = 2000; // Force a minimum gap of ₹2,000 between min and max thumb

    if (activeThumbRef.current === 'min') {
      const limit = maxRentRef.current - MIN_GAP;
      if (roundedRent < limit) {
        setLocalMinRent(roundedRent);
        minRentRef.current = roundedRent; // Sync ref instantly to prevent out-of-order race conditions
      } else {
        setLocalMinRent(limit);
        minRentRef.current = limit;
      }
    } else if (activeThumbRef.current === 'max') {
      const limit = minRentRef.current + MIN_GAP;
      if (roundedRent > limit) {
        setLocalMaxRent(roundedRent);
        maxRentRef.current = roundedRent; // Sync ref instantly to prevent out-of-order race conditions
      } else {
        setLocalMaxRent(limit);
        maxRentRef.current = limit;
      }
    }
  };

  const handleApply = () => {
    onApply({
      roomType: localRoomType,
      minRent: localMinRent,
      maxRent: localMaxRent,
      preferredGender: localGender,
      city: localCity,
    });
    onClose();
  };

  const handleReset = () => {
    setLocalRoomType('All');
    setLocalMinRent(MIN_RENT);
    setLocalMaxRent(MAX_RENT_LIMIT);
    setLocalGender('Any');
    setLocalCity('All');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        {/* Click outside to cancel/close */}
        <Pressable style={styles.backdropPressable} onPress={onClose} />

        {/* Modal Sheet Content */}
        <View style={styles.sheetContainer}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <Pressable onPress={onClose} style={styles.backButton}>
              <Feather name="chevron-left" size={24} color={theme.textPrimary} />
            </Pressable>
            <Text style={styles.headerTitle}>Filter</Text>
            <Pressable onPress={handleReset} style={styles.resetTextBtn}>
              <Text style={styles.resetText}>Reset</Text>
            </Pressable>
          </View>

          {/* scrollEnabled property prevents stuttering by locking scroll when dragging slider */}
          <ScrollView
            scrollEnabled={scrollEnabled}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            
            {/* SECTION 1: Room Type (styled as large property cards) */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Room type</Text>
              <View style={styles.propertyGrid}>
                {/* All Rooms Card */}
                <Pressable
                  style={[
                    styles.propertyCard,
                    localRoomType === 'All' && styles.propertyCardActive,
                  ]}
                  onPress={() => setLocalRoomType('All')}
                >
                  <Ionicons
                    name="grid-outline"
                    size={22}
                    color={localRoomType === 'All' ? theme.white : theme.textPrimary}
                  />
                  <Text
                    style={[
                      styles.propertyCardText,
                      localRoomType === 'All' && styles.propertyCardTextActive,
                    ]}
                  >
                    Any Room
                  </Text>
                </Pressable>

                {/* Private Room Card */}
                <Pressable
                  style={[
                    styles.propertyCard,
                    localRoomType === 'Private' && styles.propertyCardActive,
                  ]}
                  onPress={() => setLocalRoomType('Private')}
                >
                  <Ionicons
                    name="home-outline"
                    size={22}
                    color={localRoomType === 'Private' ? theme.white : theme.textPrimary}
                  />
                  <Text
                    style={[
                      styles.propertyCardText,
                      localRoomType === 'Private' && styles.propertyCardTextActive,
                    ]}
                  >
                    Private Room
                  </Text>
                </Pressable>

                {/* Shared Room Card */}
                <Pressable
                  style={[
                    styles.propertyCard,
                    localRoomType === 'Shared' && styles.propertyCardActive,
                  ]}
                  onPress={() => setLocalRoomType('Shared')}
                >
                  <Ionicons
                    name="people-outline"
                    size={22}
                    color={localRoomType === 'Shared' ? theme.white : theme.textPrimary}
                  />
                  <Text
                    style={[
                      styles.propertyCardText,
                      localRoomType === 'Shared' && styles.propertyCardTextActive,
                    ]}
                  >
                    Shared Room
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* SECTION 2: Price range (Rent range slider) */}
            <View style={styles.sectionContainer}>
              <View style={styles.sliderHeaderRow}>
                <Text style={styles.sectionTitle}>Price range</Text>
                <Text style={styles.priceRangeValueText}>
                  ₹{localMinRent.toLocaleString('en-IN')} - ₹{localMaxRent === MAX_RENT_LIMIT ? `${MAX_RENT_LIMIT.toLocaleString('en-IN')}+` : localMaxRent.toLocaleString('en-IN')}
                </Text>
              </View>
              
              {/* Custom Dual Animated Slider */}
              <View
                style={styles.sliderContainer}
                onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
                {...panResponder.panHandlers}
              >
                {/* Unfilled background track */}
                <View style={styles.sliderTrackBackground} pointerEvents="none" />
                
                {/* Active filled track segment */}
                <View
                  style={[
                    styles.sliderTrackActive,
                    {
                      left: minThumbPosition,
                      width: Math.max(0, maxThumbPosition - minThumbPosition),
                    },
                  ]}
                  pointerEvents="none"
                />
                
                {/* Min thumb */}
                <View
                  style={[
                    styles.sliderThumb,
                    { left: Math.max(0, Math.min(minThumbPosition - 12, sliderWidth - 24)) },
                  ]}
                  pointerEvents="none"
                />

                {/* Max thumb */}
                <View
                  style={[
                    styles.sliderThumb,
                    { left: Math.max(0, Math.min(maxThumbPosition - 12, sliderWidth - 24)) },
                  ]}
                  pointerEvents="none"
                />
              </View>

              {/* Min/Max limit markers */}
              <View style={styles.priceLimitRow}>
                <Text style={styles.priceLimitLabel}>Min: ₹{MIN_RENT.toLocaleString('en-IN')}</Text>
                <Text style={styles.priceLimitLabel}>Max: ₹{MAX_RENT_LIMIT.toLocaleString('en-IN')}+</Text>
              </View>
            </View>

            {/* SECTION 3: Preferred Gender */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Preferred gender</Text>
              <View style={styles.chipsRow}>
                {(['Any', 'Male', 'Female'] as const).map((gender) => {
                  const isActive = localGender === gender;
                  return (
                    <Pressable
                      key={gender}
                      style={[
                        styles.circleChip,
                        isActive && styles.circleChipActive,
                      ]}
                      onPress={() => setLocalGender(gender)}
                    >
                      <Text
                        style={[
                          styles.circleChipText,
                          isActive && styles.circleChipTextActive,
                        ]}
                      >
                        {gender}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* SECTION 4: City */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>City</Text>
              <View style={styles.chipsRow}>
                {(['All', 'Pune', 'Bangalore', 'Hyderabad', 'Mumbai'] as const).map((city) => {
                  const isActive = localCity === city;
                  return (
                    <Pressable
                      key={city}
                      style={[
                        styles.rectChip,
                        isActive && styles.rectChipActive,
                      ]}
                      onPress={() => setLocalCity(city)}
                    >
                      <Text
                        style={[
                          styles.rectChipText,
                          isActive && styles.rectChipTextActive,
                        ]}
                      >
                        {city}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

          </ScrollView>

          {/* Bottom Button Row: Apply (Left) and Cancel (Right) */}
          <View style={styles.bottomActionsRow}>
            <Pressable
              style={({ pressed }) => [
                styles.actionBtnApply,
                pressed && styles.actionBtnPressed,
              ]}
              onPress={handleApply}
            >
              <Text style={styles.actionBtnApplyText}>Apply</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.actionBtnCancel,
                pressed && styles.actionBtnPressed,
              ]}
              onPress={onClose}
            >
              <Text style={styles.actionBtnCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(44, 37, 35, 0.45)',
    justifyContent: 'flex-end',
  },
  backdropPressable: {
    ...StyleSheet.absoluteFill,
  },
  sheetContainer: {
    backgroundColor: theme.cardBackground,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '85%',
    width: '100%',
    paddingTop: 16,
    ...Platform.select({
      ios: {
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#F2ECE4',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
    textAlign: 'center',
  },
  resetTextBtn: {
    padding: 6,
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  sectionContainer: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 14,
  },
  sliderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  priceRangeValueText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.brand,
  },
  propertyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  propertyCard: {
    flex: 1,
    minWidth: '45%',
    height: 90,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'center',
    gap: 8,
  },
  propertyCardActive: {
    backgroundColor: theme.brand,
    borderColor: theme.brand,
  },
  propertyCardText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  propertyCardTextActive: {
    color: theme.white,
  },
  sliderContainer: {
    height: 30,
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },
  sliderTrackBackground: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ECEAE4',
    width: '100%',
  },
  sliderTrackActive: {
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.brand,
    position: 'absolute',
  },
  sliderThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.brand,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    position: 'absolute',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  priceLimitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  priceLimitLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  circleChip: {
    minWidth: 64,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  circleChipActive: {
    backgroundColor: theme.brand,
    borderColor: theme.brand,
  },
  circleChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  circleChipTextActive: {
    color: theme.white,
    fontWeight: '700',
  },
  rectChip: {
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  rectChipActive: {
    backgroundColor: theme.brand,
    borderColor: theme.brand,
  },
  rectChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  rectChipTextActive: {
    color: theme.white,
    fontWeight: '700',
  },
  bottomActionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderColor: '#F2ECE4',
    gap: 12,
  },
  actionBtnApply: {
    flex: 1,
    height: 50,
    backgroundColor: theme.brand,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  actionBtnApplyText: {
    color: theme.white,
    fontSize: 15,
    fontWeight: '700',
  },
  actionBtnCancel: {
    flex: 1,
    height: 50,
    backgroundColor: '#F3EFE9',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnCancelText: {
    color: theme.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  actionBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
