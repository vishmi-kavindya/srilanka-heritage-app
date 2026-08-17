import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  LayoutChangeEvent,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../contexts/LanguageContext';
import { useAppTheme } from '../contexts/ThemeContext';
import { getTranslation } from '../constants/i18n';
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
  const { lang } = useLanguage();
  const t = getTranslation(lang);
  const { isDark, toggleTheme } = useAppTheme();

  // Tab items measurement map for dynamic pill positioning
  const [measurements, setMeasurements] = useState<{ [key: number]: TabMeasurement }>({});

  // Animated values for active pill position and width
  const translateX = useRef(new Animated.Value(0)).current;
  const pillWidth = useRef(new Animated.Value(0)).current;
  const pillOpacity = useRef(new Animated.Value(0)).current;

  // Scale animation values for tab buttons
  const scaleAnim = useRef(state.routes.map(() => new Animated.Value(1))).current;

  // Map route names to icons and titles matching reference style
  const getTabInfo = (routeName: string) => {
    switch (routeName) {
      case 'index':
        return {
          title: 'Home',
          iconActive: 'home' as const,
          iconInactive: 'home-outline' as const,
        };
      case 'map':
        return {
          title: 'Map',
          iconActive: 'map' as const,
          iconInactive: 'map-outline' as const,
        };
      case 'ai':
        return {
          title: 'Call',
          iconActive: 'call' as const,
          iconInactive: 'call-outline' as const,
        };
      case 'transport':
        return {
          title: 'Transport',
          iconActive: 'bus' as const,
          iconInactive: 'bus-outline' as const,
        };
      case 'utilities':
        return {
          title: 'List',
          iconActive: 'list' as const,
          iconInactive: 'list-outline' as const,
        };
      default:
        return {
          title: routeName,
          iconActive: 'ellipse' as const,
          iconInactive: 'ellipse-outline' as const,
        };
    }
  };

  // Filter routes to exclude non-navigation screens if any
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
    // Micro-scale press animation
    if (scaleAnim[index]) {
      Animated.sequence([
        Animated.timing(scaleAnim[index], {
          toValue: 0.88,
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

  // Position navbar AT THE TOP of the screen as requested
  const topInset = Math.max(insets.top, 14);

  return (
    <View style={[styles.outerContainer, { top: topInset }]}>
      {/* Floating Liquid Glass Shell */}
      <View
        style={[
          styles.glassWrapper,
          isDark ? styles.glassWrapperDark : styles.glassWrapperLight,
        ]}
      >
        <BlurView
          intensity={Platform.OS === 'ios' ? 75 : 90}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />

        {/* Specular Edge Highlight (Top Reflective Rim) */}
        <View
          style={[
            styles.specularHighlight,
            isDark ? styles.specularDark : styles.specularLight,
          ]}
        />

        {/* Glass Glow Sheen Overlay */}
        <View
          style={[
            styles.glassGlowOverlay,
            isDark ? styles.glowDark : styles.glowLight,
          ]}
        />

        <View style={styles.contentContainer}>
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
            {/* Pill Inner Glossy Top Specular Line */}
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
            const { title, iconActive, iconInactive } = getTabInfo(route.name);
            const scale = scaleAnim[index] || new Animated.Value(1);

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={title}
                onPress={() => handleTabPress(route, index)}
                onLayout={(e) => handleTabLayout(index, e)}
                activeOpacity={0.7}
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
                    size={17}
                    color={
                      isFocused
                        ? isDark
                          ? '#FFFFFF'
                          : '#4A2A0C'
                        : isDark
                        ? 'rgba(255, 215, 230, 0.7)'
                        : 'rgba(92, 53, 18, 0.75)'
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
                            : '#4A2A0C'
                          : isDark
                          ? 'rgba(255, 215, 230, 0.75)'
                          : 'rgba(92, 53, 18, 0.8)',
                      },
                    ]}
                  >
                    {title}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            );
          })}

          {/* Theme Switcher Button (Sun ☀️ / Moon 🌙) */}
          <TouchableOpacity
            onPress={toggleTheme}
            activeOpacity={0.7}
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
    maxWidth: 480,
    borderRadius: 40,
    overflow: 'hidden',
    position: 'relative',
    // Liquid Glass Multi-Layer Shadow
    ...Platform.select({
      ios: {
        shadowColor: '#3B1506',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.28,
        shadowRadius: 20,
      },
      android: {
        elevation: 14,
      },
      web: {
        shadowColor: 'rgba(59, 21, 6, 0.3)',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        backdropFilter: 'blur(22px) saturate(200%)',
        WebkitBackdropFilter: 'blur(22px) saturate(200%)',
      } as any,
    }),
  },

  /* 🌟 Light Theme Glass (Amber / Honey Liquid Glass matching Reference Screenshot 1) */
  glassWrapperLight: {
    backgroundColor: 'rgba(251, 191, 114, 0.48)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.85)',
  },

  /* 🍷 Dark Theme Glass (Rich Ruby / Plum Velvet Glass matching Reference Screenshot 2) */
  glassWrapperDark: {
    backgroundColor: 'rgba(68, 18, 38, 0.72)',
    borderWidth: 1.5,
    borderColor: 'rgba(244, 114, 182, 0.35)',
  },

  specularHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    zIndex: 10,
  },
  specularLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  specularDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  glassGlowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    zIndex: 1,
  },
  glowLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  glowDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    position: 'relative',
    zIndex: 5,
  },
  activePill: {
    position: 'absolute',
    top: 5,
    bottom: 5,
    borderRadius: 30,
    zIndex: 2,
    overflow: 'hidden',
  },

  /* Light Theme Active Indicator Pill (Glowing Crisp White) */
  activePillLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
    ...Platform.select({
      ios: {
        shadowColor: '#EA580C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0px 4px 14px rgba(234, 88, 12, 0.25), inset 0px 1px 2px rgba(255, 255, 255, 1)',
      } as any,
    }),
  },

  /* Dark Theme Active Indicator Pill (Frosted Silver / Plum Pill) */
  activePillDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.5), inset 0px 1px 1px rgba(255, 255, 255, 0.5)',
      } as any,
    }),
  },

  pillHighlightLine: {
    position: 'absolute',
    top: 1,
    left: 10,
    right: 10,
    height: 1,
    borderRadius: 1,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  tabButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 12,
    letterSpacing: 0.1,
  },
  tabLabelActive: {
    fontWeight: '800',
  },
  tabLabelInactive: {
    fontWeight: '600',
  },
  themeBtn: {
    paddingLeft: 4,
    paddingRight: 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  themeBtnInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  themeBtnLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderColor: 'rgba(249, 115, 22, 0.5)',
  },
  themeBtnDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderColor: 'rgba(244, 114, 182, 0.5)',
  },
});
