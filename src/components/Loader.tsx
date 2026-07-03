import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Easing } from 'react-native';
import { theme } from '../theme/colors';

interface LoaderProps {
  message?: string;
}

const M_HEIGHT = 80;

export const Loader: React.FC<LoaderProps> = ({
  message = 'Searching for rooms...',
}) => {
  const fillHeight = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    // 1. Water filling loop animation
    Animated.loop(
      Animated.sequence([
        // Fill up (bottom to top)
        Animated.timing(fillHeight, {
          toValue: M_HEIGHT,
          duration: 1500,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver: false, // height animations don't support native driver
        }),
        // Pause at full
        Animated.delay(400),
        // Drain / reset back to 0
        Animated.timing(fillHeight, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        // Pause at empty
        Animated.delay(200),
      ])
    ).start();

    // 2. Pulsing animation for the loading status text
    Animated.loop(
      Animated.sequence([
        Animated.timing(textOpacity, {
          toValue: 1.0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 0.4,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fillHeight, textOpacity]);

  return (
    <View style={styles.container}>
      {/* Custom Liquid Filling "M" Logo */}
      <View style={styles.mLogoContainer}>
        {/* Background "Hollow" M (Empty state) */}
        <Text style={styles.backgroundM}>M</Text>

        {/* Masking Container representing rising water */}
        <Animated.View
          style={[
            styles.waterMask,
            { height: fillHeight },
          ]}
        >
          {/* Foreground Colored M (Filled water state) */}
          {/* Kept at bottom alignment to stay perfectly superimposed */}
          <Text style={styles.foregroundM}>M</Text>
        </Animated.View>
      </View>

      {/* Loading message text */}
      <Animated.Text style={[styles.loadingText, { opacity: textOpacity }]}>
        {message}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 70,
    backgroundColor: 'transparent',
  },
  mLogoContainer: {
    width: 90,
    height: M_HEIGHT,
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 22,
  },
  backgroundM: {
    fontSize: 78,
    fontWeight: '900',
    color: '#ECEAE4', // Warm Sand hollow color
    textAlign: 'center',
    // fontStyle: 'italic',
    lineHeight: M_HEIGHT + 10,
  },
  waterMask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  foregroundM: {
    fontSize: 78,
    fontWeight: '900',
    color: theme.brand, // Active Terracotta water color
    textAlign: 'center',
    // fontStyle: 'italic',
    lineHeight: M_HEIGHT + 10,
    height: M_HEIGHT,
    width: '100%',
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
