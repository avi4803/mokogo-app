import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar as RNStatusBar,
  Pressable,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { theme } from './src/theme/colors';
import { HomeScreen } from './src/screens/HomeScreen';
import { PlaceholderScreen } from './src/screens/PlaceholderScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<'Home' | 'Search' | 'Wallet' | 'Calendar' | 'Settings'>('Home');

  return (
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
        <View style={styles.bottomTabBar}>
          <Pressable
            style={[styles.tabButton, activeTab === 'Home' && styles.tabButtonActive]}
            onPress={() => setActiveTab('Home')}
          >
            <Ionicons name="home" size={20} color={activeTab === 'Home' ? theme.textPrimary : theme.textSecondary} />
          </Pressable>
          <Pressable
            style={[styles.tabButton, activeTab === 'Search' && styles.tabButtonActive]}
            onPress={() => setActiveTab('Search')}
          >
            <Ionicons name="search" size={20} color={activeTab === 'Search' ? theme.textPrimary : theme.textSecondary} />
          </Pressable>
          <Pressable
            style={[styles.tabButton, activeTab === 'Wallet' && styles.tabButtonActive]}
            onPress={() => setActiveTab('Wallet')}
          >
            <Ionicons name="wallet-outline" size={20} color={activeTab === 'Wallet' ? theme.textPrimary : theme.textSecondary} />
          </Pressable>
          <Pressable
            style={[styles.tabButton, activeTab === 'Calendar' && styles.tabButtonActive]}
            onPress={() => setActiveTab('Calendar')}
          >
            <Ionicons name="calendar-outline" size={20} color={activeTab === 'Calendar' ? theme.textPrimary : theme.textSecondary} />
          </Pressable>
          <Pressable
            style={[styles.tabButton, activeTab === 'Settings' && styles.tabButtonActive]}
            onPress={() => setActiveTab('Settings')}
          >
            <Ionicons name="settings-outline" size={20} color={activeTab === 'Settings' ? theme.textPrimary : theme.textSecondary} />
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
    backgroundColor: '#EFFF8C', // Accent tab circular highlight
  },
});
