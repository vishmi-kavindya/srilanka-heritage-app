import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppTheme } from '../../contexts/ThemeContext';
import { getTranslation } from '../../constants/i18n';
import LiquidGlassTabBar from '../../components/LiquidGlassTabBar';

export default function TabLayout() {
  const { lang } = useLanguage();
  const { isDark } = useAppTheme();
  const t = getTranslation(lang);

  // Solid dark/neutral base — prevents any bleed-through between tabs
  const sceneBg = isDark ? '#0A0A12' : '#F8F4F0';

  return (
    <View style={[styles.fullContainer, { backgroundColor: sceneBg }]}>
      <Tabs
        tabBar={(props) => <LiquidGlassTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: sceneBg },
        }}
      >
        <Tabs.Screen name="index"     options={{ title: t.virtualGuideTab || 'Guide' }} />
        <Tabs.Screen name="map"       options={{ title: t.mapTab || 'Map' }} />
        <Tabs.Screen name="ai"        options={{ title: t.aiTab || 'AI' }} />
        <Tabs.Screen name="transport" options={{ title: t.transportTab || 'Transport' }} />
        <Tabs.Screen name="utilities" options={{ title: t.utilitiesTab || 'Utils' }} />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
  },
});