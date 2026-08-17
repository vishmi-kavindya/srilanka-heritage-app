import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppTheme } from '../../contexts/ThemeContext';
import { getTranslation } from '../../constants/i18n';
import LiquidGlassTabBar from '../../components/LiquidGlassTabBar';

export default function TabLayout() {
  const { lang } = useLanguage();
  const { colors } = useAppTheme();
  const t = getTranslation(lang);

  return (
    <View style={styles.fullContainer}>
      {/* Full-Screen Dynamic Background Gradient (Sunset in Light Mode, Burgundy Velvet in Dark Mode) */}
      <LinearGradient
        colors={colors.bgGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <Tabs
        tabBar={(props) => <LiquidGlassTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: 'transparent' },
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
          },
        }}
      >
        <Tabs.Screen name="index" options={{ title: t.virtualGuideTab || 'Guide' }} />
        <Tabs.Screen name="map"   options={{ title: t.mapTab || 'Map' }} />
        <Tabs.Screen name="ai"    options={{ title: t.aiTab || 'AI' }} />
        <Tabs.Screen name="transport" options={{ title: t.transportTab || 'Transport' }} />
        <Tabs.Screen name="utilities" options={{ title: t.utilitiesTab || 'Utils' }} />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    position: 'relative',
  },
});