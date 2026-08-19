import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Animated,
  Modal,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import PearlExplorerWelcomeModal from '../../components/PearlExplorerWelcomeModal';
import { LanguageCode, TARGET_13_LANGUAGES, getTranslation } from '../../constants/i18n';
import { getTranslatedPOIs } from '../../constants/heritageData';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppTheme } from '../../contexts/ThemeContext';
import { Colors } from '../../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Extended Iconic Sri Lankan Travel Destinations Collection
const HERO_DESTINATIONS = [
  {
    id: 1,
    title: 'SIGIRIYA LION ROCK',
    province: 'Matale District · Central Province',
    tag: '🏛️ UNESCO WORLD HERITAGE',
    badgeColor: '#FF9F43',
    image: require('../../assets/images/temple.jpg'),
    rating: '⭐ 4.9',
    summary: 'A 5th-century ancient palace fortress built by King Kashyapa on a 200m vertical granite peak, famous for frescoes, mirror wall, and lion gate entry.',
    audioPoiId: 1,
  },
  {
    id: 2,
    title: 'NINE ARCH BRIDGE',
    province: 'Ella · Badulla District',
    tag: '🚂 COLONIAL ENGINEERING WONDER',
    badgeColor: '#00D1DE',
    image: require('../../assets/images/nine.jpg'),
    rating: '⭐ 4.9',
    summary: 'The iconic Demodara Nine Arch Viaduct built entirely from stone blocks and bricks without steel, set amidst lush green mountain tea gardens.',
    audioPoiId: 2,
  },
  {
    id: 3,
    title: 'COCONUT TREE HILL',
    province: 'Mirissa · Southern Coast',
    tag: '🌴 TROPICAL SCENIC PROMONTORY',
    badgeColor: '#10B981',
    image: require('../../assets/images/coco.AVIF'),
    rating: '⭐ 4.8',
    summary: 'A unique reddish cliff-side dome covered in tall coconut palm trees, extending gracefully into the turquoise Indian Ocean waves.',
    audioPoiId: 3,
  },
  {
    id: 4,
    title: 'MIRISSA COASTAL BEACH',
    province: 'Mirissa · Southern Province',
    tag: '🌊 OCEAN SAFARI & SURFING',
    badgeColor: '#3B82F6',
    image: require('../../assets/images/beach.AVIF'),
    rating: '⭐ 4.8',
    summary: 'Pristine golden sand crescent bay world-renowned for blue whale watching expeditions, coral reef snorkeling, and relaxing sunset beach dining.',
    audioPoiId: 4,
  },
  {
    id: 5,
    title: 'TEMPLE OF THE SACRED TOOTH',
    province: 'Kandy · Central Highlands',
    tag: '👑 SACRED BUDDHIST ROYAL SHRINE',
    badgeColor: '#F59E0B',
    image: require('../../assets/images/temple.jpg'),
    rating: '⭐ 4.9',
    summary: 'Sri Dalada Maligawa in Kandy houses the sacred tooth relic of the Buddha in a golden-roofed royal palace complex rich with ritual traditions.',
    audioPoiId: 1,
  },
  {
    id: 6,
    title: 'GALLE DUTCH FORT',
    province: 'Galle · Southern Coast',
    tag: '🏰 17TH CENTURY SEA FORTRESS',
    badgeColor: '#8B5CF6',
    image: require('../../assets/images/beach.AVIF'),
    rating: '⭐ 4.8',
    summary: 'Europeans fortified 17th-century ramparts overlooking the ocean, blending Dutch colonial architecture, boutique alleys, and ocean views.',
    audioPoiId: 4,
  },
  {
    id: 7,
    title: 'POLONNARUWA VATADAGE',
    province: 'Polonnaruwa · North Central',
    tag: '🗿 ANCIENT KINGDOM RUINS',
    badgeColor: '#EC4899',
    image: require('../../assets/images/nine.jpg'),
    rating: '⭐ 4.9',
    summary: 'Intricately carved 12th-century circular stone relic house featuring moonstones, guardstones, and seated granite Buddha statues.',
    audioPoiId: 2,
  },
];

export default function VirtualGuideScreen() {
  const router = useRouter();
  const { lang, setLang, userProfile, setUserProfile, showWelcomeModal, setShowWelcomeModal } = useLanguage();
  const { colors } = useAppTheme();

  const [selectedHeroIndex, setSelectedHeroIndex] = useState<number>(0);
  const [activePoiId, setActivePoiId] = useState<number>(1);
  const [showPickerModal, setShowPickerModal] = useState<boolean>(false);

  // Animation values for interactive card opening transition
  const heroCardOpacity = useRef(new Animated.Value(1)).current;
  const heroCardScale = useRef(new Animated.Value(1)).current;
  const kenBurnsAnim = useRef(new Animated.Value(1)).current;

  const activeDestination = HERO_DESTINATIONS[selectedHeroIndex] || HERO_DESTINATIONS[0];

  useEffect(() => {
    // Ken-Burns Infinite Slow Zoom Loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(kenBurnsAnim, {
          toValue: 1.14,
          duration: 14000,
          useNativeDriver: false,
        }),
        Animated.timing(kenBurnsAnim, {
          toValue: 1.0,
          duration: 14000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  // Smooth Card Opening Animation Switcher
  const handleSelectDestination = (index: number) => {
    if (index === selectedHeroIndex) return;

    Animated.parallel([
      Animated.timing(heroCardOpacity, {
        toValue: 0.15,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(heroCardScale, {
        toValue: 0.97,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setSelectedHeroIndex(index);
      setActivePoiId(HERO_DESTINATIONS[index].audioPoiId);

      Animated.parallel([
        Animated.timing(heroCardOpacity, {
          toValue: 1,
          duration: 320,
          useNativeDriver: false,
        }),
        Animated.timing(heroCardScale, {
          toValue: 1,
          duration: 320,
          useNativeDriver: false,
        }),
      ]).start();
    });
  };

  const currentLangObj = TARGET_13_LANGUAGES.find((l) => l.code === lang) || TARGET_13_LANGUAGES[0];
  const translatedPOIs = useMemo(() => getTranslatedPOIs(lang), [lang]);

  const handleCompleteOnboarding = (selectedLang: LanguageCode, profile?: any) => {
    setLang(selectedLang);
    if (profile) setUserProfile(profile);
    setShowWelcomeModal(false);
  };

  return (
    <View style={styles.fullScreenWrapper}>
      <PearlExplorerWelcomeModal
        visible={showWelcomeModal}
        currentLang={lang}
        onCompleteOnboarding={handleCompleteOnboarding}
      />

      {/* ── FULL SCREEN HERO LANDING PAGE WITH BACKGROUND WALLPAPER ── */}
      <Animated.View
        style={[
          styles.heroFullContainer,
          {
            opacity: heroCardOpacity,
            transform: [{ scale: heroCardScale }],
          },
        ]}
      >
        <Animated.Image
          source={activeDestination.image}
          style={[styles.heroFullImage, { transform: [{ scale: kenBurnsAnim }] }]}
          resizeMode="cover"
        />

        {/* Dark Luxury Gradient Overlay */}
        <View style={styles.heroGradientOverlay}>

          {/* ── SINGLE SLEEK WEBSITE NAVBAR ── */}
          <View style={styles.singleSleekNavbar}>
            <View style={styles.navLeftBrand}>
              <Image source={require('../../assets/images/logo.jpeg')} style={styles.brandLogoImage} />
              <View>
                <View style={styles.brandTitleRow}>
                  <Text style={styles.brandMainTitle}>PEARL EXPLORER</Text>
                  <View style={styles.brandProBadge}>
                    <Text style={styles.brandProBadgeText}>PRO</Text>
                  </View>
                </View>
                <Text style={styles.brandSubTitle}>Sri Lanka Heritage & Travel Guide</Text>
              </View>
            </View>

            {/* Nav Links */}
            <View style={styles.navCenterLinks}>
              <TouchableOpacity style={[styles.navLinkItem, styles.navLinkActive]} activeOpacity={0.85}>
                <Text style={[styles.navLinkText, styles.navLinkTextActive]}>🏠 Home</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navLinkItem}
                onPress={() => router.push('/map')}
                activeOpacity={0.85}
              >
                <Text style={styles.navLinkText}>🗺️ Interactive Map</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navLinkItem}
                onPress={() => router.push('/ai')}
                activeOpacity={0.85}
              >
                <Text style={styles.navLinkText}>🤖 AI Assistant</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navLinkItem}
                onPress={() => router.push('/transport')}
                activeOpacity={0.85}
              >
                <Text style={styles.navLinkText}>🚗 Transport</Text>
              </TouchableOpacity>
            </View>

            {/* Nav Right Actions */}
            <View style={styles.navRightActions}>
              <TouchableOpacity
                style={styles.langSelectorPill}
                onPress={() => setShowWelcomeModal(true)}
                activeOpacity={0.85}
              >
                <Text style={{ fontSize: 15 }}>{currentLangObj.flag}</Text>
                <Text style={styles.langSelectorCode}>{currentLangObj.code.toUpperCase()}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.explorerProfileBtn}
                onPress={() => setShowWelcomeModal(true)}
                activeOpacity={0.85}
              >
                <Text style={styles.explorerProfileText}>⚙️ Settings</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── HERO CONTENT LEFT ── */}
          <View style={styles.heroMainBody}>
            <View style={styles.heroTextSection}>
              <View style={[styles.destinationBadge, { backgroundColor: activeDestination.badgeColor }]}>
                <Text style={styles.destinationBadgeText}>{activeDestination.tag}</Text>
              </View>

              <Text style={styles.heroMainHeading}>{activeDestination.title}</Text>
              <Text style={styles.heroLocationSub}>📍 {activeDestination.province}</Text>

              <Text style={styles.heroDescriptionText}>{activeDestination.summary}</Text>

              {/* Action Buttons */}
              <View style={styles.heroButtonGroup}>
                <TouchableOpacity
                  style={styles.btnPrimaryExplore}
                  onPress={() => setShowPickerModal(true)}
                  activeOpacity={0.88}
                >
                  <Text style={styles.btnPrimaryText}>📍 Explore Site</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnSecondaryStory}
                  onPress={() => {
                    const targetPoi = translatedPOIs.find((p) => p.id === activeDestination.audioPoiId);
                    Alert.alert('🎧 Heritage Audio Guide', `Playing story for: ${targetPoi?.title || activeDestination.title}`);
                  }}
                  activeOpacity={0.88}
                >
                  <Text style={styles.btnSecondaryText}>🎧 Listen Story</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnIconMap}
                  onPress={() => router.push('/map')}
                  activeOpacity={0.88}
                >
                  <Text style={{ fontSize: 18 }}>🗺️</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ── BOTTOM RIGHT INTERACTIVE THUMBNAIL CARDS ("CARD OPENING SYSTEM") ── */}
            <View style={styles.cardOpeningFooter}>
              <View style={styles.cardOpeningTopRow}>
                <Text style={styles.cardOpeningSectionTitle}>FEATURED DESTINATIONS</Text>
                <Text style={styles.cardOpeningCounter}>
                  0{selectedHeroIndex + 1} <Text style={{ color: 'rgba(255,255,255,0.4)' }}>/ 0{HERO_DESTINATIONS.length}</Text>
                </Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.thumbnailCarouselContainer}
              >
                {HERO_DESTINATIONS.map((dest, idx) => {
                  const isActive = idx === selectedHeroIndex;
                  return (
                    <TouchableOpacity
                      key={dest.id}
                      style={[
                        styles.thumbnailCard,
                        isActive && styles.thumbnailCardActive,
                      ]}
                      onPress={() => handleSelectDestination(idx)}
                      activeOpacity={0.85}
                    >
                      <Image source={dest.image} style={styles.thumbnailCardImage} />
                      <View style={styles.thumbnailCardOverlay}>
                        <View style={styles.ratingBadgePill}>
                          <Text style={styles.ratingBadgeText}>{dest.rating}</Text>
                        </View>
                        <Text style={styles.thumbnailCardTitle} numberOfLines={1}>
                          {dest.title}
                        </Text>
                        <Text style={styles.thumbnailCardSub} numberOfLines={1}>
                          {dest.province.split('·')[0]}
                        </Text>
                      </View>

                      {isActive && (
                        <View style={styles.activeIndicatorRing}>
                          <Text style={styles.activeIndicatorText}>ACTIVE</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Heritage Landmark Picker Modal */}
      <Modal
        visible={showPickerModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPickerModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <View style={styles.modalTopBar}>
              <Text style={styles.modalTitleText}>🏛️ Select Heritage Landmark</Text>
              <TouchableOpacity onPress={() => setShowPickerModal(false)} style={styles.modalCloseButton}>
                <Text style={styles.modalCloseIcon}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBodyList} showsVerticalScrollIndicator={false}>
              {translatedPOIs.map((poi) => (
                <TouchableOpacity
                  key={poi.id}
                  style={[styles.modalItemRow, activePoiId === poi.id && styles.modalItemRowActive]}
                  onPress={() => {
                    setActivePoiId(poi.id);
                    setShowPickerModal(false);
                    Alert.alert('📍 Landmark Selected', `Exploring: ${poi.title}`);
                  }}
                >
                  <Text style={[styles.modalItemTitle, activePoiId === poi.id && styles.modalItemTitleActive]}>
                    📍 {poi.title}
                  </Text>
                  <Text style={styles.modalItemCoordsText}>
                    Geofence Radius: {poi.geofence_radius_meters}m · {poi.latitude}° N, {poi.longitude}° E
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
  fullScreenWrapper: {
    flex: 1,
    backgroundColor: '#0A0E14',
  },
  heroFullContainer: {
    flex: 1,
    minHeight: SCREEN_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
  },
  heroFullImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroGradientOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 14, 20, 0.58)',
    justifyContent: 'space-between',
    paddingHorizontal: Platform.OS === 'web' ? 40 : 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 24,
    paddingBottom: 28,
  },

  // ── SINGLE SLEEK WEBSITE NAVBAR ──
  singleSleekNavbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderRadius: 100,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    ...Platform.select({
      web: { backdropFilter: 'blur(16px)' as any },
    }),
  },
  navLeftBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandLogoImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandMainTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  brandProBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  brandProBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
  brandSubTitle: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 1,
  },

  // Nav Links
  navCenterLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    display: SCREEN_WIDTH < 600 ? 'none' : 'flex',
  },
  navLinkItem: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 100,
  },
  navLinkActive: {
    backgroundColor: Colors.primary,
  },
  navLinkText: {
    color: '#CBD5E1',
    fontSize: 12.5,
    fontWeight: '700',
  },
  navLinkTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // Nav Right Actions
  navRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  langSelectorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  langSelectorCode: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  explorerProfileBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 100,
  },
  explorerProfileText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },

  // ── HERO MAIN BODY ──
  heroMainBody: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 20,
  },
  heroTextSection: {
    maxWidth: Platform.OS === 'web' ? 620 : '100%',
    marginTop: 30,
  },
  destinationBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  destinationBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  heroMainHeading: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'web' ? 42 : 30,
    fontWeight: '900',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
    marginBottom: 6,
  },
  heroLocationSub: {
    color: '#BAE6FD',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 14,
  },
  heroDescriptionText: {
    color: '#F1F5F9',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.65)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroButtonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  btnPrimaryExplore: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 100,
    elevation: 4,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  btnSecondaryStory: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  btnSecondaryText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  btnIconMap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },

  // ── CARD OPENING FOOTER CAROUSEL ──
  cardOpeningFooter: {
    marginTop: 'auto',
    paddingTop: 20,
  },
  cardOpeningTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardOpeningSectionTitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  cardOpeningCounter: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '900',
  },
  thumbnailCarouselContainer: {
    gap: 12,
    paddingBottom: 8,
  },
  thumbnailCard: {
    width: 140,
    height: 145,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    backgroundColor: '#1E293B',
    position: 'relative',
  },
  thumbnailCardActive: {
    borderColor: Colors.accent,
    borderWidth: 3,
    transform: [{ translateY: -4 }],
  },
  thumbnailCardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  thumbnailCardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    padding: 10,
    justifyContent: 'flex-end',
  },
  ratingBadgePill: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
  },
  thumbnailCardTitle: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  thumbnailCardSub: {
    color: '#CBD5E1',
    fontSize: 9.5,
    marginTop: 2,
  },
  activeIndicatorRing: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.accent,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activeIndicatorText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
  },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    width: Platform.OS === 'web' ? 500 : '100%',
    maxHeight: '80%',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    overflow: 'hidden',
  },
  modalTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalCloseIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  modalBodyList: {
    padding: 12,
  },
  modalItemRow: {
    padding: 14,
    borderRadius: 14,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  modalItemRowActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(0, 209, 222, 0.15)',
  },
  modalItemTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalItemTitleActive: {
    color: Colors.primary,
  },
  modalItemCoordsText: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 4,
  },
});