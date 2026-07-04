import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  StatusBar as RNStatusBar,
  Pressable,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { theme } from './src/theme/colors';
import { HomeScreen } from './src/screens/HomeScreen';
import { PlaceholderScreen } from './src/screens/PlaceholderScreen';

const TAB_INDEXES = {
  Home: 0,
  Search: 1,
  Wallet: 2,
  Calendar: 3,
  Settings: 4,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'Home' | 'Search' | 'Wallet' | 'Calendar' | 'Settings'>('Home');
  const [tabBarWidth, setTabBarWidth] = useState<number>(0);
  const animValue = useRef(new Animated.Value(0)).current;

  // Animate the active tab indicator dot on tab change
  useEffect(() => {
    Animated.spring(animValue, {
      toValue: TAB_INDEXES[activeTab],
      useNativeDriver: true,
      tension: 68,
      friction: 10,
    }).start();
  }, [activeTab]);

  // Calculate sliding offsets dynamically based on measured layout width
  const colWidth = tabBarWidth / 5;
  const translateX = animValue.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: [
      0 * colWidth + (colWidth - 30) / 2,
      1 * colWidth + (colWidth - 30) / 2,
      2 * colWidth + (colWidth - 30) / 2,
      3 * colWidth + (colWidth - 30) / 2,
      4 * colWidth + (colWidth - 30) / 2,
    ],
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        
        {/* Screen Router Switcher */}
        <View style={styles.screenContainer}>
          {activeTab === 'Home' && <HomeScreen />}
          {activeTab === 'Search' && <PlaceholderScreen title="Search" iconName="search-outline" />}
          {activeTab === 'Wallet' && <PlaceholderScreen title="Wallet" iconName="wallet-outline" />}
          {activeTab === 'Calendar' && <PlaceholderScreen title="Calendar" iconName="calendar-outline" />}
          {activeTab === 'Settings' && <PlaceholderScreen title="Settings" iconName="settings-outline" />}
        </View>

        {/* Floating Bottom Navigation Tab Bar (matching design image mockup) */}
        <View style={styles.bottomTabBarContainer}>
          <View 
            style={styles.bottomTabBar}
            onLayout={(e) => setTabBarWidth(e.nativeEvent.layout.width - 16)} // Subtract paddingHorizontal (8 * 2)
          >
            {/* Fluid Sliding Active Tab Indicator (runs on native UI thread) */}
            {tabBarWidth > 0 && (
              <Animated.View
                style={[
                  styles.activeTabIndicator,
                  { transform: [{ translateX }] },
                ]}
              />
            )}

            <Pressable
              style={styles.tabButton}
              onPress={() => setActiveTab('Home')}
            >
              <Ionicons name="home" size={20} color={activeTab === 'Home' ? theme.textPrimary : theme.textSecondary} />
            </Pressable>
            <Pressable
              style={styles.tabButton}
              onPress={() => setActiveTab('Search')}
            >
              <Ionicons name="search" size={20} color={activeTab === 'Search' ? theme.textPrimary : theme.textSecondary} />
            </Pressable>
            <Pressable
              style={styles.tabButton}
              onPress={() => setActiveTab('Wallet')}
            >
              <Ionicons name="wallet-outline" size={20} color={activeTab === 'Wallet' ? theme.textPrimary : theme.textSecondary} />
            </Pressable>
            <Pressable
              style={styles.tabButton}
              onPress={() => setActiveTab('Calendar')}
            >
              <Ionicons name="calendar-outline" size={20} color={activeTab === 'Calendar' ? theme.textPrimary : theme.textSecondary} />
            </Pressable>
            <Pressable
              style={styles.tabButton}
              onPress={() => setActiveTab('Settings')}
            >
              <Ionicons name="settings-outline" size={20} color={activeTab === 'Settings' ? theme.textPrimary : theme.textSecondary} />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  screenContainer: {
    flex: 1,
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
    paddingHorizontal: 8,
    justifyContent: 'space-between',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ECEAE4',
    position: 'relative',
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
    flex: 1,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2, // Icons hover above the sliding indicator background
  },
  activeTabIndicator: {
    position: 'absolute',
    top: 8,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFFF8C', // Accent circular highlight
    zIndex: 1, // Indicator sits behind the icons
  },
});
