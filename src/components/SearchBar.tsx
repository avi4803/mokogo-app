import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Animated,
  Pressable,
  Platform,
  Dimensions,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search title or locality...',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [containerWidth, setContainerWidth] = useState(SCREEN_WIDTH-40); // Default fallback

  const animatedValue = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);
  const isClearing = useRef(false);

  // Measure the actual layout width to animate precisely
  const handleLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0) {
      setContainerWidth(width-40);
    }
  };    

  const handleExpand = () => {
    setIsExpanded(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 400,    
      useNativeDriver: false, // width/layout animations don't support native driver
    }).start(() => {
      inputRef.current?.focus();
    });
  };

  const handleCollapse = () => {
    inputRef.current?.blur();
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      setIsExpanded(false);
    });
  };

  const handleBlur = () => {
    // Delay collapsing to check if the user tapped the clear button (which triggers a blur)
    setTimeout(() => {
      if (!isClearing.current) {
        handleCollapse();
      } else {
        isClearing.current = false;
        inputRef.current?.focus();
      }
    }, 150);
  };

  // Interpolations for Title (fade out & slide up)
  const titleOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const titleTranslateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  // Interpolation for Search Box Width
  const searchWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, containerWidth],
  });

  // Interpolation for Search Box Border Radius
  const searchBorderRadius = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [25, 25],
  });

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {/* Title Group - Slides up and fades out */}
      <Animated.View
        style={[
          styles.titleTextGroup,
          {
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }],
          },
        ]}
        pointerEvents={isExpanded ? 'none' : 'auto'}
      >
        <Text style={styles.titleSub}>Made for You</Text>
        <Text style={styles.titleMain}>Explore Rooms</Text>
      </Animated.View>

      {/* Animated Search Container */}
      <Animated.View
        style={[
          styles.searchBox,
          {
            width: searchWidth,
            borderRadius: searchBorderRadius,
          },
        ]}
      >
        {isExpanded ? (
          // Expanded TextInput View
          <View style={styles.expandedContent}>
            <Pressable onPress={handleCollapse} style={styles.backButton}>
              <Feather name="arrow-left" size={20} color={theme.textPrimary} />
            </Pressable>
            <TextInput
              ref={inputRef}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor={theme.textSecondary}
              style={styles.textInput}
              onBlur={handleBlur}
            />
            {value.length > 0 && (
              <Pressable
                onPressIn={() => {
                  isClearing.current = true;
                }}
                onPress={() => {
                  onChangeText('');
                  inputRef.current?.focus();
                }}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
              </Pressable>
            )}
          </View>
        ) : (
          // Collapsed Circle Search Button View
          <Pressable onPress={handleExpand} style={styles.collapsedButton}>
            <Feather
              name="search"
              size={22}
              color={value.length > 0 ? theme.brand : theme.textPrimary}
            />
            {value.length > 0 && <View style={styles.activeSearchDot} />}
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 20,
    height: 60, // Fixed height keeps layout stable during transitions
    position: 'relative',
  },
  titleTextGroup: {
    justifyContent: 'center',
    flex: 1,
  },
  titleSub: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.textSecondary,
    marginBottom: 2,
  },
  titleMain: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.textPrimary,
    lineHeight: 34,
  },
  searchBox: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECEAE4',
    position: 'absolute',
    right: 20,
    ...Platform.select({
      ios: {
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  collapsedButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingHorizontal: 12,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    fontWeight: '600',
    color: theme.textPrimary,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 6,
  },
  activeSearchDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.brand,
  },
});
