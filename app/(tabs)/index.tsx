import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
  ScrollView, Animated, Platform, Dimensions, Modal, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import PearlExplorerWelcomeModal from '../../components/PearlExplorerWelcomeModal';
import { LanguageCode, TARGET_13_LANGUAGES } from '../../constants/i18n';
import { getTranslatedPOIs } from '../../constants/heritageData';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppTheme } from '../../contexts/ThemeContext';
import { Colors } from '../../constants/theme';

import { DESTINATIONS } from '../../constants/homeData';
import { HeroSection } from '../../components/home/HeroSection';
import { DestinationGrid } from '../../components/home/DestinationGrid';
import { KeyExperiences } from '../../components/home/KeyExperiences';
import { ThingsToDoSection } from '../../components/home/ThingsToDoSection';
import { PremiumFooter } from '../../components/home/PremiumFooter';

const IS_WEB = Platform.OS === 'web';

export default function VirtualGuideScreen() {
  const router = useRouter();
  const { lang, setLang, setUserProfile, showWelcomeModal, setShowWelcomeModal } = useLanguage();
  const { isDark } = useAppTheme();

  const [heroIdx, setHeroIdx] = useState(0);
  const [activePoiId, setActivePoiId] = useState(1);
  const [showPickerModal, setShowPickerModal] = useState(false);

  const heroOpacity = useRef(new Animated.Value(1)).current;
  const kenBurns = useRef(new Animated.Value(1)).current;

  const dest = DESTINATIONS[heroIdx];
  const translatedPOIs = getTranslatedPOIs(lang);

  // Ken-Burns zoom loop
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(kenBurns, { toValue: 1.12, duration: 14000, useNativeDriver: false }),
      Animated.timing(kenBurns, { toValue: 1.0, duration: 14000, useNativeDriver: false }),
    ])).start();
  }, []);

  const switchHero = (idx: number) => {
    if (idx === heroIdx) return;
    Animated.timing(heroOpacity, { toValue: 0, duration: 180, useNativeDriver: false }).start(() => {
      setHeroIdx(idx);
      Animated.timing(heroOpacity, { toValue: 1, duration: 320, useNativeDriver: false }).start();
    });
  };

  const handleCompleteOnboarding = (selectedLang: LanguageCode, profile?: any) => {
    setLang(selectedLang);
    if (profile) setUserProfile(profile);
    setShowWelcomeModal(false);
  };

  // editorial palette
  const bg = isDark ? '#0E0E0E' : '#F2F0ED';
  const textMain = isDark ? '#F5F0E8' : '#1A1410';
  const textSub = isDark ? '#A09A90' : '#6B6460';
  const cardBg = isDark ? '#1A1A1A' : '#FFFFFF';
  const borderCol = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <PearlExplorerWelcomeModal
        visible={showWelcomeModal}
        currentLang={lang}
        onCompleteOnboarding={handleCompleteOnboarding}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <HeroSection
          dest={dest}
          heroIdx={heroIdx}
          heroOpacity={heroOpacity}
          kenBurns={kenBurns}
          switchHero={switchHero}
          onExplore={() => setShowPickerModal(true)}
        />

        <View style={[styles.content, { backgroundColor: bg }]}>
          <DestinationGrid textMain={textMain} textSub={textSub} switchHero={switchHero} />
          
          <KeyExperiences textMain={textMain} />

          <ThingsToDoSection
            textMain={textMain}
            textSub={textSub}
            cardBg={cardBg}
            borderCol={borderCol}
          />

          <PremiumFooter dest={dest} kenBurns={kenBurns} />
        </View>
      </ScrollView>

      {/* Landmark Picker Modal */}
      <Modal visible={showPickerModal} transparent animationType="fade" onRequestClose={() => setShowPickerModal(false)}>
        <View style={styles.modalBg}>
          <View style={[styles.modalBox, { backgroundColor: cardBg }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textMain }]}>Select Heritage Site</Text>
              <TouchableOpacity onPress={() => setShowPickerModal(false)}>
                <Text style={{ color: textSub, fontSize: 20 }}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {translatedPOIs.map(poi => (
                <TouchableOpacity
                  key={poi.id}
                  style={[styles.modalRow, { borderBottomColor: borderCol }, activePoiId === poi.id && { backgroundColor: `${Colors.primary}22` }]}
                  onPress={() => { setActivePoiId(poi.id); setShowPickerModal(false); Alert.alert('📍', `Exploring: ${poi.title}`); }}
                >
                  <Text style={[styles.modalRowTitle, { color: textMain }, activePoiId === poi.id && { color: Colors.primary }]}>
                    📍 {poi.title}
                  </Text>
                  <Text style={[styles.modalRowSub, { color: textSub }]}>
                    {poi.latitude}°N · {poi.longitude}°E
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1 },
  
  // Modal
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalBox: {
    width: IS_WEB ? 480 : '100%',
    maxHeight: '80%',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 20, shadowOffset: { width: 0, height: 10 },
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)' },
  modalTitle: { fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
  modalRow: { padding: 16, borderBottomWidth: 1 },
  modalRowTitle: { fontSize: 13.5, fontWeight: '700', marginBottom: 3 },
  modalRowSub: { fontSize: 10.5 },
});