import React from 'react';
import { StyleSheet, Text, View, Image, Pressable, Platform } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Listing } from '../types/listing';
import { theme } from '../theme/colors';

interface ListingCardProps {
  listing: Listing;
  isFavorite?: boolean;
  onPress?: () => void;
  onFavoritePress?: () => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  isFavorite = false,
  onPress,
  onFavoritePress,
}) => {
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
          resizeMode="cover"
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
};
