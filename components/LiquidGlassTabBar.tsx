import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutChangeEvent,
  Image,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../contexts/LanguageContext';
import { useAppTheme } from '../contexts/ThemeContext';
import { TARGET_13_LANGUAGES } from '../constants/i18n';
import { Colors } from '../constants/theme';

const IS_WEB = Platform.OS === 'web';

export default function LiquidGlassTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { lang, setShowWelcomeModal } = useLanguage();
  const { isDark, toggleTheme } = useAppTheme();
  const currentLangObj = TARGET_13_LANGUAGES.find((l) => l.code === lang) || TARGET_13_LANGUAGES[0];

  const validRoutes = state.routes.filter(
    (route: { name: string }) => !['_layout', '+not-found', 'two'].includes(route.name)
  );

  const getTabInfo = (routeName: string) => {
    switch (routeName) {
      case 'index': return { title: 'Destinations', icon: 'compass-outline' };
      case 'map': return { title: 'Interactive Map', icon: 'map-outline' };
      case 'ai': return { title: 'AI Assistant', icon: 'sparkles-outline' };
      case 'transport': return { title: 'Transport', icon: 'bus-outline' };
      case 'utilities': return { title: 'Safety & Tools', icon: 'shield-checkmark-outline' };
      default: return { title: routeName, icon: 'ellipse-outline' };
    }
  };

  const handleTabPress = (route: any, index: number) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (state.index !== index && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  const textMain = isDark ? '#FFFFFF' : '#1A1410';
  const textMuted = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
  const borderBottomColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  if (!IS_WEB) {
    // Mobile Bottom Tab Bar (Minimalist)
    return (
      <View style={[styles.mobileTabBar, { paddingBottom: Math.max(insets.bottom, 16), borderTopColor: borderBottomColor }]}>
        <BlurView intensity={90} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        <View style={styles.mobileTabInner}>
          {validRoutes.map((route: any, index: number) => {
            const isFocused = state.index === index;
            const { title, icon } = getTabInfo(route.name);
            return (
              <TouchableOpacity
                key={route.key}
                style={styles.mobileTabItem}
                onPress={() => handleTabPress(route, index)}
              >
                <Ionicons
                  name={icon as any}
                  size={24}
                  color={isFocused ? textMain : textMuted}
                />
                <Text style={[styles.mobileTabLabel, { color: isFocused ? textMain : textMuted }]}>
                  {title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  // Web Premium Edge-to-Edge Navbar
  return (
    <View style={[styles.webHeaderContainer, { paddingTop: insets.top }]}>
      <BlurView intensity={85} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />

      <View style={[styles.webHeaderInner, { borderBottomColor }]}>
        {/* BRANDING */}
        <TouchableOpacity style={styles.brand} onPress={() => navigation.navigate('index')} activeOpacity={0.8}>
          <Image source={require('../assets/images/logo.png')} style={styles.brandLogo} />
        </TouchableOpacity>

        {/* CENTER NAV LINKS */}
        <View style={styles.navRow}>
          {validRoutes.map((route: any, index: number) => {
            const isFocused = state.index === index;
            const { title } = getTabInfo(route.name);

            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => handleTabPress(route, index)}
                activeOpacity={0.7}
                style={styles.navItem}
              >
                <Text style={[styles.navText, { color: isFocused ? textMain : textMuted }]}>
                  {title}
                </Text>
                {isFocused && <View style={[styles.navIndicator, { backgroundColor: '#E8612A' }]} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* RIGHT CONTROLS */}
        <View style={styles.controlsRow}>
          {/* Language */}
          <TouchableOpacity
            style={[styles.controlBtn, { borderColor: borderBottomColor }]}
            onPress={() => setShowWelcomeModal(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.langFlag}>{currentLangObj.flag}</Text>
            <Text style={[styles.langCode, { color: textMain }]}>{currentLangObj.code.toUpperCase()}</Text>
          </TouchableOpacity>

          {/* Theme */}
          <TouchableOpacity
            style={[styles.controlBtn, styles.themeBtn, { borderColor: borderBottomColor }]}
            onPress={toggleTheme}
            activeOpacity={0.8}
          >
            <Ionicons name={isDark ? 'moon' : 'sunny'} size={14} color={textMain} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Web Header Styles
  webHeaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  webHeaderInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 60,
    height: 80,
    borderBottomWidth: 1,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandLogo: {
    width: 300,
    height: 90,
    resizeMode: 'contain',
  },
  brandText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
  },
  brandTextLight: {
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 2,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 40,
  },
  navItem: {
    position: 'relative',
    paddingVertical: 8,
  },
  navText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  navIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  controlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  langFlag: {
    fontSize: 14,
  },
  langCode: {
    fontSize: 11,
    fontWeight: '800',
  },
  themeBtn: {
    paddingHorizontal: 10,
  },

  // Mobile Bottom Tab Styles
  mobileTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.7)', // Fallback if blur fails
  },
  mobileTabInner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
  },
  mobileTabItem: {
    alignItems: 'center',
    gap: 4,
  },
  mobileTabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
});
