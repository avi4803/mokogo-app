import React, { memo } from 'react';
import { StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Listing } from '../types/listing';
import { theme } from '../theme/colors';

interface ListingCardProps {
  listing: Listing;
  isFavorite?: boolean;
  onPress?: () => void;
  onFavoritePress?: () => void;
}

export const ListingCard = memo(({
  listing,
  isFavorite = false,
  onPress,
  onFavoritePress,
}: ListingCardProps) => {
  // Format rent value to Indian numbering system (e.g., 12,000)
  const formattedRent = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(listing.rent);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.cardContainer,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      {/* Listing Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: listing.image || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
          }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />

        {/* Top-Left Badge overlay: Best Deal (similar to screen image) */}
        <View style={styles.badgeOverlay}>
          <Text style={styles.badgeText}>Best Deal</Text>
        </View>

        {/* Top-Right Favorite Button overlay */}
        <Pressable
          style={({ pressed }) => [
            styles.favoriteButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={onFavoritePress}
        >
          {isFavorite ? (
            <Ionicons name="heart" size={20} color={theme.heartActive} />
          ) : (
            <Ionicons name="heart-outline" size={20} color={theme.heartInactive} />
          )}
        </Pressable>
      </View>

      {/* Listing Content Details */}
      <View style={styles.contentContainer}>
        {/* Title and Price Row */}
        <View style={styles.titlePriceRow}>
          <Text style={styles.titleText} numberOfLines={1}>
            {listing.title}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>
              ₹{formattedRent}/mo
            </Text>
          </View>
        </View>

        {/* Detail Badges Wrap Row (Location, Room Type, Gender, Furnishing) */}
        <View style={styles.pillsRow}>
          {/* Locality Pill */}
          <View style={styles.pillContainer}>
            <Feather name="map-pin" size={12} color={theme.iconTint} />
            <Text style={styles.pillText} numberOfLines={1}>
              {listing.locality}
            </Text>
          </View>

          {/* Gender Pill */}
          <View style={styles.pillContainer}>
            <Ionicons name="person-outline" size={12} color={theme.iconTint} />
            <Text style={styles.pillText} numberOfLines={1}>
              Pref: {listing.preferredGender}
            </Text>
          </View>

          {/* Room Type Pill */}
          <View style={styles.pillContainer}>
            <Ionicons name="bed-outline" size={12} color={theme.iconTint} />
            <Text style={styles.pillText} numberOfLines={1}>
              {listing.roomType} Room
            </Text>
          </View>

          {/* Furnishing Pill */}
          <View style={styles.pillContainer}>
            <MaterialCommunityIcons name="sofa-outline" size={12} color={theme.iconTint} />
            <Text style={styles.pillText} numberOfLines={1}>
              {listing.furnished ? 'Furnished' : 'Unfurnished'}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.isFavorite === nextProps.isFavorite &&
    prevProps.listing.id === nextProps.listing.id
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: theme.cardBackground,
    borderRadius: 25,
    padding: 3,
    marginVertical: 10,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.border,
    ...Platform.select({
      ios: {
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  imageContainer: {
    position: 'relative',
    height: 200,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: theme.tagBg,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: theme.tagBg,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.9 }],
  },
  contentContainer: {
    paddingHorizontal: 6,
    paddingTop: 12,
    paddingBottom: 4,
  },
  titlePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  priceContainer: {
    backgroundColor: theme.highlightBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.outlinePillBorder,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.textSecondary,
    marginLeft: 4,
  },
});
