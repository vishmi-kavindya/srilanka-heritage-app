import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  LayoutChangeEvent,
  Image,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../contexts/LanguageContext';
import { useAppTheme } from '../contexts/ThemeContext';
import { getTranslation, TARGET_13_LANGUAGES } from '../constants/i18n';
import { Colors } from '../constants/theme';

interface TabMeasurement {
  x: number;
  width: number;
}

export default function LiquidGlassTabBar({
  state,
  descriptors,
  navigation,
}: any) {
  const insets = useSafeAreaInsets();
  const { lang, setShowWelcomeModal } = useLanguage();
  const t = getTranslation(lang);
  const { isDark, toggleTheme, colors } = useAppTheme();
  const currentLangObj = TARGET_13_LANGUAGES.find((l) => l.code === lang) || TARGET_13_LANGUAGES[0];

  // Tab items measurement map for dynamic pill positioning
  const [measurements, setMeasurements] = useState<{ [key: number]: TabMeasurement }>({});

  // Animated values for active pill position and width
  const translateX = useRef(new Animated.Value(0)).current;
  const pillWidth = useRef(new Animated.Value(0)).current;
  const pillOpacity = useRef(new Animated.Value(0)).current;

  // Scale animation values for tab buttons
  const scaleAnim = useRef(state.routes.map(() => new Animated.Value(1))).current;

  // Map route names to modern luxury titles and icons
  const getTabInfo = (routeName: string) => {
    switch (routeName) {
      case 'index':
        return {
          title: 'Places & Guide',
          shortTitle: 'Guide',
          iconActive: 'compass' as const,
          iconInactive: 'compass-outline' as const,
        };
      case 'map':
        return {
          title: 'Map & Planner',
          shortTitle: 'Planner',
          iconActive: 'map' as const,
          iconInactive: 'map-outline' as const,
        };
      case 'ai':
        return {
          title: 'AI Scanner',
          shortTitle: 'AI',
          iconActive: 'sparkles' as const,
          iconInactive: 'sparkles-outline' as const,
        };
      case 'transport':
        return {
          title: 'Transport Hub',
          shortTitle: 'Transport',
          iconActive: 'bus' as const,
          iconInactive: 'bus-outline' as const,
        };
      case 'utilities':
        return {
          title: 'Safety & Tools',
          shortTitle: 'Safety',
          iconActive: 'shield-checkmark' as const,
          iconInactive: 'shield-checkmark-outline' as const,
        };
      default:
        return {
          title: routeName,
          shortTitle: routeName,
          iconActive: 'ellipse' as const,
          iconInactive: 'ellipse-outline' as const,
        };
    }
  };

  const validRoutes = state.routes.filter(
    (route: { name: string }) => !['_layout', '+not-found', 'two'].includes(route.name)
  );

  const activeIndex = state.index;

  // Update pill position when active tab changes or measurements update
  useEffect(() => {
    const activeMeasurement = measurements[activeIndex];
    if (activeMeasurement && activeMeasurement.width > 0) {
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: activeMeasurement.x,
          useNativeDriver: false,
          speed: 16,
          bounciness: 7,
        }),
        Animated.spring(pillWidth, {
          toValue: activeMeasurement.width,
          useNativeDriver: false,
          speed: 16,
          bounciness: 7,
        }),
        Animated.timing(pillOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [activeIndex, measurements]);

  const handleTabLayout = (index: number, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setMeasurements((prev) => {
      if (prev[index]?.x === x && prev[index]?.width === width) return prev;
      return { ...prev, [index]: { x, width } };
    });
  };

  const handleTabPress = (route: (typeof state.routes)[0], index: number) => {
    if (scaleAnim[index]) {
      Animated.sequence([
        Animated.timing(scaleAnim[index], {
          toValue: 0.92,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim[index], {
          toValue: 1,
          speed: 22,
          bounciness: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (state.index !== index && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  const topInset = Math.max(insets.top, 12);

  return (
    <View style={[styles.outerContainer, { top: topInset }]}>
      {/* Liquid Glass Luxury Web Header Shell */}
      <View
        style={[
          styles.glassWrapper,
          isDark ? styles.glassWrapperDark : styles.glassWrapperLight,
        ]}
      >
        <BlurView
          intensity={Platform.OS === 'ios' ? 80 : 95}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />

        {/* Specular Edge Highlight */}
        <View
          style={[
            styles.specularHighlight,
            isDark ? styles.specularDark : styles.specularLight,
          ]}
        />

        {/* Glass Glow Sheen */}
        <View
          style={[
            styles.glassGlowOverlay,
            isDark ? styles.glowDark : styles.glowLight,
          ]}
        />

        <View style={styles.contentContainer}>
          {/* Brand Logo & Title (Desktop/Web Header Branding) */}
          <TouchableOpacity
            style={styles.brandContainer}
            onPress={() => navigation.navigate('index')}
            activeOpacity={0.8}
          >
            <Image source={require('../assets/images/logo.jpeg')} style={styles.brandLogo} />
            <View style={styles.brandTextCol}>
              <View style={styles.brandTitleRow}>
                <Text style={[styles.brandTitle, { color: isDark ? '#FFFFFF' : Colors.textDark }]}>PEARL</Text>
                <Text style={[styles.brandAccentTitle, { color: Colors.accent }]}>EXPLORER</Text>
                <View style={styles.proTag}>
                  <Text style={styles.proTagText}>PRO</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Center Nav Items Container */}
          <View style={styles.navItemsRow}>
            {/* Animated Liquid Active Pill */}
            <Animated.View
              style={[
                styles.activePill,
                isDark ? styles.activePillDark : styles.activePillLight,
                {
                  transform: [{ translateX }],
                  width: pillWidth,
                  opacity: pillOpacity,
                },
              ]}
            >
              <View
                style={[
                  styles.pillHighlightLine,
                  {
                    backgroundColor: isDark
                      ? 'rgba(255, 255, 255, 0.45)'
                      : 'rgba(255, 255, 255, 0.95)',
                  },
                ]}
              />
            </Animated.View>

            {/* Navigation Items */}
            {validRoutes.map((route: any, index: number) => {
              const isFocused = state.index === index;
              const { title, shortTitle, iconActive, iconInactive } = getTabInfo(route.name);
              const scale = scaleAnim[index] || new Animated.Value(1);

              return (
                <TouchableOpacity
                  key={route.key}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={title}
                  onPress={() => handleTabPress(route, index)}
                  onLayout={(e) => handleTabLayout(index, e)}
                  activeOpacity={0.75}
                  style={styles.tabButton}
                >
                  <Animated.View
                    style={[
                      styles.tabButtonInner,
                      { transform: [{ scale }] },
                    ]}
                  >
                    <Ionicons
                      name={isFocused ? iconActive : iconInactive}
                      size={18}
                      color={
                        isFocused
                          ? isDark
                            ? '#FFFFFF'
                            : Colors.primary
                          : isDark
                          ? 'rgba(255, 255, 255, 0.65)'
                          : 'rgba(26, 43, 62, 0.65)'
                      }
                    />
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.tabLabel,
                        isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
                        {
                          color: isFocused
                            ? isDark
                              ? '#FFFFFF'
                              : Colors.primary
                            : isDark
                            ? 'rgba(255, 255, 255, 0.75)'
                            : 'rgba(26, 43, 62, 0.75)',
                        },
                      ]}
                    >
                      {Platform.OS === 'web' ? title : shortTitle}
                    </Text>
                  </Animated.View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Right Action Controls: Language Pill + Theme Toggle */}
          <View style={styles.rightControlsRow}>
            {/* Language Selector Pill */}
            <TouchableOpacity
              style={[
                styles.langPill,
                { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,140,149,0.1)' }
              ]}
              onPress={() => setShowWelcomeModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.langPillFlag}>{currentLangObj.flag}</Text>
              <Text style={[styles.langPillCode, { color: isDark ? '#FFF' : Colors.primary }]}>
                {currentLangObj.code.toUpperCase()}
              </Text>
            </TouchableOpacity>

            {/* Theme Switcher Button */}
            <TouchableOpacity
              onPress={toggleTheme}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Toggle Light / Dark Theme"
              style={styles.themeBtn}
            >
              <View
                style={[
                  styles.themeBtnInner,
                  isDark ? styles.themeBtnDark : styles.themeBtnLight,
                ]}
              >
                <Ionicons
                  name={isDark ? 'moon' : 'sunny'}
                  size={16}
                  color={isDark ? '#F472B6' : '#EA580C'}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    paddingHorizontal: 16,
  },
  glassWrapper: {
    width: '100%',
    maxWidth: 1140,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.22,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.16), 0 2px 6px rgba(0, 0, 0, 0.08)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      } as any,
    }),
  },
  glassWrapperLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
  },
  glassWrapperDark: {
    backgroundColor: 'rgba(18, 22, 34, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  specularHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
  },
  specularLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  specularDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  glassGlowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 28,
  },
  glowLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  glowDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },

  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  // Brand Logo & Title
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandLogo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  brandTextCol: {
    justifyContent: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  brandTitle: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  brandAccentTitle: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  proTag: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 5,
    marginLeft: 3,
  },
  proTagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },

  // Nav Items Center Row
  navItemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    gap: 4,
  },
  activePill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 16,
  },
  activePillLight: {
    backgroundColor: 'rgba(0, 140, 149, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(0, 140, 149, 0.3)',
  },
  activePillDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  pillHighlightLine: {
    position: 'absolute',
    top: 0,
    left: 8,
    right: 8,
    height: 1,
    borderRadius: 1,
  },

  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    zIndex: 2,
  },
  tabButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  tabLabelActive: {
    fontWeight: '800',
  },
  tabLabelInactive: {
    fontWeight: '600',
  },

  // Right Actions
  rightControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(0,140,149,0.2)',
  },
  langPillFlag: {
    fontSize: 14,
  },
  langPillCode: {
    fontSize: 11,
    fontWeight: '800',
  },
  themeBtn: {
    borderRadius: 100,
  },
  themeBtnInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeBtnLight: {
    backgroundColor: 'rgba(245, 130, 32, 0.15)',
  },
  themeBtnDark: {
    backgroundColor: 'rgba(244, 114, 182, 0.2)',
  },
});
