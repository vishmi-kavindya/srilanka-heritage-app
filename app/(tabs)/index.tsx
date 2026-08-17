import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Image, Animated, Modal } from 'react-native';
import { useGeofence } from '../../hooks/useGeofence';
import AudioPlayerCard from '../../components/AudioPlayerCard';
import VideoPlayerCard from '../../components/VideoPlayerCard';
import PearlExplorerWelcomeModal from '../../components/PearlExplorerWelcomeModal';
import { LanguageCode, TARGET_13_LANGUAGES, getTranslation } from '../../constants/i18n';
import { FALLBACK_POIS, POI, getTranslatedPOIs } from '../../constants/heritageData';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppTheme } from '../../contexts/ThemeContext';
import { Colors, Radius, Shadow } from '../../constants/theme';

// Map each heritage POI to iconic high-resolution scenery imagery
const POI_IMAGES: Record<number, any> = {
  1: require('../../assets/images/temple.jpg'),
  2: require('../../assets/images/nine.jpg'),
  3: require('../../assets/images/coco.AVIF'),
  4: require('../../assets/images/beach.AVIF'),
};

export default function VirtualGuideScreen() {
  const { lang, setLang, userProfile, setUserProfile, showWelcomeModal, setShowWelcomeModal } = useLanguage();
  const { isDark, colors } = useAppTheme();
  const [activePoiId, setActivePoiId] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simDistance, setSimDistance] = useState<number>(10);
  const [showPickerModal, setShowPickerModal] = useState<boolean>(false);

  const t = getTranslation(lang);
  const currentLangObj = TARGET_13_LANGUAGES.find((l) => l.code === lang) || TARGET_13_LANGUAGES[0];
  const translatedPOIs = useMemo(() => getTranslatedPOIs(lang), [lang]);
  const activePoi = useMemo(
    () => translatedPOIs.find(p => p.id === activePoiId) ?? translatedPOIs[0],
    [translatedPOIs, activePoiId]
  );

  const simCoords = useMemo(() => {
    if (!activePoi) return { latitude: 7.9570, longitude: 80.7603 };
    const offset = (simDistance / 111320); 
    return {
      latitude: activePoi.latitude + (simDistance > activePoi.geofence_radius_meters ? offset : 0),
      longitude: activePoi.longitude
    };
  }, [activePoi, simDistance]);

  const { currentLocation } = useGeofence((poi) => {
    if (!isSimulating) {
      setActivePoiId(poi.id);
      Alert.alert('🏛️ Nearby Heritage!', `Within ${poi.geofence_radius_meters}m of ${poi.title}`);
    }
  });

  const handleCompleteOnboarding = (selectedLang: LanguageCode, profile?: any) => {
    setLang(selectedLang);
    if (profile) setUserProfile(profile);
    setShowWelcomeModal(false);
  };

  // Official Brand Role Color Palette Assignments
  const poiColors = [Colors.primary, Colors.accent, Colors.secondary, Colors.highlight, Colors.primary, Colors.accent];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
      <PearlExplorerWelcomeModal
        visible={showWelcomeModal}
        currentLang={lang}
        onCompleteOnboarding={handleCompleteOnboarding}
      />

      {/* ── Floating Header & Brand Navbar ── */}
      <View style={[styles.heroHeader, { backgroundColor: colors.headerBg, borderColor: colors.cardBorder }]}>
        <View style={styles.heroTop}>
          <View style={styles.brandRow}>
            <View style={styles.logoRing}>
              <Image source={require('../../assets/images/logo.jpeg')} style={styles.logo} />
            </View>
            <View>
              <View style={styles.titleTagRow}>
                <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>{t.appTitle}</Text>
                <View style={styles.proBadge}>
                  <Text style={styles.proBadgeText}>PRO</Text>
                </View>
              </View>
              <Text style={[styles.heroSub, { color: colors.textSecondary }]}>{t.appSubtitle}</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.langPill, { backgroundColor: colors.softTeal }]} onPress={() => setShowWelcomeModal(true)} activeOpacity={0.8}>
            <Text style={styles.langPillFlag}>{currentLangObj.flag}</Text>
            <Text style={styles.langPillCode}>{currentLangObj.code.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        {/* User Profile & Active Language Banner */}
        <View style={[styles.profileStrip, { backgroundColor: colors.softTeal, borderColor: colors.cardBorder }]}>
          <View style={[styles.profileDot, { backgroundColor: colors.cardBg }]}>
            <Text style={{ fontSize: 18 }}>{currentLangObj.flag}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.profileLangText, { color: colors.textSecondary }]}>
              {t.activeLang} <Text style={[styles.profileLangBold, { color: colors.textPrimary }]}>{currentLangObj.nativeName}</Text>
            </Text>
            <Text style={styles.profileEmail}>
              {userProfile?.email ? `Explorer: ${userProfile.email}` : t.guestMode}
            </Text>
          </View>
          <TouchableOpacity style={styles.settingsBtn} onPress={() => setShowWelcomeModal(true)} activeOpacity={0.85}>
            <Text style={styles.settingsBtnText}>⚙️ {t.settings}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Luxury Travel Hero Banner ── */}
      <View style={styles.heroBannerCard}>
        <Image source={require('../../assets/images/temple.jpg')} style={styles.heroBannerImage} resizeMode="cover" />
        <View style={styles.heroBannerOverlay}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>🌴 TROPICAL SRI LANKA HERITAGE</Text>
          </View>
          <Text style={styles.heroBannerHeading}>Discover Sri Lanka's Ancient Wonders</Text>
          <Text style={styles.heroBannerSub}>
            Experience real-time GPS location stories, 2,500-year UNESCO heritage, and sacred cultural treasures.
          </Text>
          <View style={styles.heroBtnRow}>
            <TouchableOpacity style={styles.ctaPrimaryBtn} onPress={() => setShowPickerModal(true)} activeOpacity={0.88}>
              <Text style={styles.ctaPrimaryText}>📍 Explore Landmarks</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ctaSecondaryBtn} onPress={() => setShowWelcomeModal(true)} activeOpacity={0.88}>
              <Text style={styles.ctaSecondaryText}>🎧 Smart Voice Guide</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── Geofence Simulator & GPS Panel ── */}
      <View style={[styles.glassCard, styles.simulatorCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
        <View style={styles.cardHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 18 }}>🎛️</Text>
            <Text style={[styles.cardHeaderText, { color: colors.textPrimary }]}>{t.liveGpsStatus}</Text>
          </View>
          <View style={[styles.modeBadge, isSimulating ? { backgroundColor: colors.softTeal } : styles.realGpsBadge]}>
            <View style={!isSimulating && styles.pulseDot} />
            <Text style={[styles.modeBadgeText, { color: isSimulating ? Colors.primary : Colors.secondary }]}>
              {isSimulating ? "SIMULATION ACTIVE" : "REAL GPS LIVE"}
            </Text>
          </View>
        </View>

        {/* Mode Segment Switcher */}
        <View style={[styles.toggleRow, { backgroundColor: colors.softTeal, borderColor: colors.cardBorder }]}>
          <TouchableOpacity 
            style={[styles.toggleBtn, !isSimulating && styles.toggleBtnActive]} 
            onPress={() => setIsSimulating(false)}
            activeOpacity={0.85}
          >
            <Text style={[styles.toggleBtnText, { color: !isSimulating ? '#FFFFFF' : colors.textPrimary }]}>🌍 Real GPS Mode</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, isSimulating && styles.toggleBtnActive]} 
            onPress={() => setIsSimulating(true)}
            activeOpacity={0.85}
          >
            <Text style={[styles.toggleBtnText, { color: isSimulating ? '#FFFFFF' : colors.textPrimary }]}>🎛️ Geofence Simulator</Text>
          </TouchableOpacity>
        </View>

        {isSimulating ? (
          <View style={styles.simControls}>
            <Text style={styles.inputLabel}>🏛️ Select Heritage Landmark:</Text>
            <TouchableOpacity 
              style={[styles.pickerButton, { backgroundColor: colors.softTeal, borderColor: colors.cardBorder }]} 
              onPress={() => setShowPickerModal(true)}
              activeOpacity={0.85}
            >
              <Text style={[styles.pickerButtonText, { color: colors.textPrimary }]}>
                📍 {activePoi ? activePoi.title : "Select Landmark..."}
              </Text>
              <Text style={styles.pickerArrow}>▼</Text>
            </TouchableOpacity>

            <Text style={styles.inputLabel}>📏 Simulated Distance:</Text>
            <View style={styles.distanceTabs}>
              {[5, 15, 50, 150].map((dist) => (
                <TouchableOpacity
                  key={dist}
                  style={[styles.distanceTab, simDistance === dist && styles.distanceTabActive]}
                  onPress={() => {
                    setSimDistance(dist);
                    if (dist <= (activePoi?.geofence_radius_meters || 20)) {
                      setActivePoiId(activePoi.id);
                    }
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.distanceTabText, simDistance === dist && styles.distanceTabTextActive]}>
                    {dist}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Readout Coordinates Stats */}
            <View style={styles.readoutBox}>
              <View style={styles.readoutItem}>
                <Text style={styles.readoutLabel}>Latitude</Text>
                <Text style={styles.readoutValue}>{simCoords.latitude.toFixed(5)}° N</Text>
              </View>
              <View style={styles.readoutItem}>
                <Text style={styles.readoutLabel}>Longitude</Text>
                <Text style={styles.readoutValue}>{simCoords.longitude.toFixed(5)}° E</Text>
              </View>
              <View style={styles.readoutItem}>
                <Text style={styles.readoutLabel}>Geofence Status</Text>
                <Text style={[
                  styles.readoutValue, 
                  simDistance <= (activePoi?.geofence_radius_meters || 20) ? { color: Colors.secondary } : { color: Colors.accent }
                ]}>
                  {simDistance <= (activePoi?.geofence_radius_meters || 20) ? "INSIDE (Auto-play) 🟢" : "OUTSIDE (Locked) 🔴"}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.realCoordsBox}>
            <Text style={styles.gpsCoords}>
              {currentLocation
                ? `📍 ${currentLocation.latitude.toFixed(5)}° N  |  ${currentLocation.longitude.toFixed(5)}° E`
                : 'Searching for GPS Lock...'}
            </Text>
            <View style={styles.geofenceBadge}>
              <Text style={styles.geofenceBadgeText}>⚡ Auto-trigger radius: 15–20 meters</Text>
            </View>
          </View>
        )}
      </View>

      {/* Landmark Selector Modal Popup */}
      <Modal
        visible={showPickerModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPickerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🏛️ Select Heritage Landmark</Text>
              <TouchableOpacity onPress={() => setShowPickerModal(false)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
              {translatedPOIs.map((poi) => (
                <TouchableOpacity
                  key={poi.id}
                  style={[styles.modalItem, activePoiId === poi.id && styles.modalItemActive]}
                  onPress={() => {
                    setActivePoiId(poi.id);
                    setShowPickerModal(false);
                    Alert.alert('📍 Simulator Engaged', `Simulating arrival near: ${poi.title}`);
                  }}
                >
                  <Text style={[styles.modalItemText, activePoiId === poi.id && styles.modalItemTextActive]}>
                    📍 {poi.title}
                  </Text>
                  <Text style={styles.modalItemCoords}>
                    Radius: {poi.geofence_radius_meters}m · {poi.latitude}° N, {poi.longitude}° E
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── Active Audio Guide / Video Explorer ── */}
      {activePoi && (!isSimulating || simDistance <= activePoi.geofence_radius_meters) ? (
        <View style={styles.audioSection}>
          <Text style={styles.sectionLabel}>
            {activePoi.video_url ? "🎬 Active Video Explorer" : t.activeAudioStory}
          </Text>
          {activePoi.video_url ? (
            <VideoPlayerCard
              title={activePoi.title}
              historicalSummary={activePoi.historical_summary}
              videoUrl={activePoi.video_url}
            />
          ) : (
            <AudioPlayerCard
              title={activePoi.title}
              historicalSummary={activePoi.historical_summary}
              audioUrl={activePoi.audio_url}
            />
          )}
        </View>
      ) : activePoi ? (
        <View style={styles.audioSection}>
          <Text style={styles.sectionLabel}>
            {activePoi.video_url ? "🎬 Active Video Explorer" : t.activeAudioStory}
          </Text>
          <View style={[styles.glassCard, styles.lockedCard]}>
            <Text style={styles.lockedIcon}>🔏</Text>
            <Text style={styles.lockedTitle}>
              {activePoi.video_url ? "Video Guide Locked" : "Audio Guide Locked"}
            </Text>
            <Text style={styles.lockedText}>
              You are currently simulated at {simDistance}m away from the landmark. Walk within {activePoi.geofence_radius_meters}m to automatically unlock and play this {activePoi.video_url ? "video" : "story"}!
            </Text>
          </View>
        </View>
      ) : null}

      {/* ── Rich Destination Cards Section ── */}
      <View style={styles.poiSection}>
        <Text style={styles.sectionLabel}>🌴 Iconic Heritage Destinations</Text>
        <Text style={styles.sectionSub}>Select a landmark below to simulate arrival & unlock audio guide</Text>

        {translatedPOIs.map((poi, idx) => {
          const accent = poiColors[idx % poiColors.length];
          const isActive = activePoi?.id === poi.id;
          const coverImg = POI_IMAGES[poi.id] || POI_IMAGES[1];

          return (
            <TouchableOpacity
              key={poi.id}
              style={[styles.destinationCard, isActive && { borderColor: accent, borderWidth: 2.5 }]}
              onPress={() => {
                setActivePoiId(poi.id);
                Alert.alert('📍 Geofence Engaged', `Simulating arrival near: ${poi.title}`);
              }}
              activeOpacity={0.9}
            >
              {/* Destination Cover Image */}
              <View style={styles.destImageWrapper}>
                <Image source={coverImg} style={styles.destCoverImage} resizeMode="cover" />
                <View style={styles.destOverlayGradient} />
                
                {/* Floating Top Badge */}
                <View style={[styles.destBadgeTag, { backgroundColor: accent }]}>
                  <Text style={styles.destBadgeText}>📍 {poi.geofence_radius_meters}m Geofence</Text>
                </View>

                {/* Active Indicator Chip */}
                {isActive && (
                  <View style={styles.destActiveChip}>
                    <Text style={styles.destActiveChipText}>▶ ACTIVE GUIDE</Text>
                  </View>
                )}
              </View>

              {/* Destination Body Content */}
              <View style={styles.destBody}>
                <View style={styles.destTitleRow}>
                  <Text style={[styles.destTitle, isActive && { color: accent }]}>{poi.title}</Text>
                  <Text style={styles.ratingBadge}>⭐ 4.9</Text>
                </View>
                <Text style={styles.destSummary} numberOfLines={2}>
                  {poi.historical_summary}
                </Text>

                <View style={styles.destFooterRow}>
                  <Text style={styles.destCoordsText}>
                    📍 {poi.latitude.toFixed(4)}° N, {poi.longitude.toFixed(4)}° E
                  </Text>
                  <View style={[styles.destPlayBtn, { backgroundColor: accent }]}>
                    <Text style={styles.destPlayBtnText}>Explore →</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Brand Footer ── */}
      <View style={styles.footerContainer}>
        <View style={styles.footerBrandRow}>
          <Image source={require('../../assets/images/logo.jpeg')} style={styles.footerLogo} />
          <View>
            <Text style={styles.footerBrandTitle}>PEARL EXPLORER</Text>
            <Text style={styles.footerBrandSub}>Sri Lanka Heritage & Smart GPS Audio Guide</Text>
          </View>
        </View>

        <View style={styles.footerDivider} />

        <View style={styles.footerTagRow}>
          <View style={[styles.footerTag, { backgroundColor: Colors.primary + '30' }]}>
            <Text style={[styles.footerTagText, { color: '#00D1DE' }]}>🌊 Deep Teal</Text>
          </View>
          <View style={[styles.footerTag, { backgroundColor: Colors.accent + '30' }]}>
            <Text style={[styles.footerTagText, { color: '#FFA552' }]}>🌅 Sunset Orange</Text>
          </View>
          <View style={[styles.footerTag, { backgroundColor: Colors.secondary + '30' }]}>
            <Text style={[styles.footerTagText, { color: '#2CE09C' }]}>🌴 Tropical Green</Text>
          </View>
        </View>

        <Text style={styles.footerCopyright}>
          © 2026 Pearl Explorer Platform · Crafted for Sri Lankan Tourism & Culture
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },

  // Navbar & Header
  heroHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 72,
    paddingBottom: 20,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 140, 149, 0.15)',
    shadowColor: Colors.textDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoRing: {
    padding: 2,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  logo: { width: 44, height: 44, borderRadius: 22 },
  titleTagRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroTitle: { fontSize: 20, fontWeight: '900', color: Colors.textDark, letterSpacing: 0.3 },
  proBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  proBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },
  heroSub: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  langPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.softTeal, borderRadius: 100,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1.5, borderColor: Colors.primary,
  },
  langPillFlag: { fontSize: 18 },
  langPillCode: { fontSize: 12, fontWeight: '800', color: Colors.primary },

  profileStrip: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.softTeal,
    borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: 'rgba(0, 140, 149, 0.2)',
  },
  profileDot: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(0, 140, 149, 0.2)',
  },
  profileLangText: { fontSize: 12, color: Colors.textSecondary },
  profileLangBold: { fontWeight: '700', color: Colors.textDark },
  profileEmail: { fontSize: 11, color: Colors.primary, marginTop: 2, fontWeight: '600' },
  settingsBtn: {
    backgroundColor: Colors.accent, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 8,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsBtnText: { fontSize: 12, fontWeight: '800', color: '#FFFFFF' },

  // Travel Hero Banner
  heroBannerCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 26,
    overflow: 'hidden',
    height: 240,
    borderWidth: 1,
    borderColor: 'rgba(0, 140, 149, 0.2)',
    shadowColor: Colors.textDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 5,
  },
  heroBannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroBannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30, 22, 22, 0.65)',
    padding: 22,
    justifyContent: 'flex-end',
  },
  heroBadge: {
    backgroundColor: Colors.accent,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroBannerHeading: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroBannerSub: {
    color: '#E8F7F5',
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 16,
  },
  heroBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  ctaPrimaryBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 100,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  ctaPrimaryText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  ctaSecondaryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 100,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  ctaSecondaryText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },

  // GPS Card & Simulator
  glassCard: {
    marginHorizontal: 16,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 140, 149, 0.18)',
    backgroundColor: '#FFFFFF',
    shadowColor: Colors.textDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  simulatorCard: { marginBottom: 20, borderLeftWidth: 5, borderLeftColor: Colors.primary },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardHeaderText: { fontSize: 15, fontWeight: '800', color: Colors.textDark },
  modeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeSimBadge: {
    backgroundColor: Colors.softTeal,
  },
  realGpsBadge: {
    backgroundColor: 'rgba(25, 169, 116, 0.15)',
  },
  modeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.secondary },

  toggleRow: {
    flexDirection: 'row',
    backgroundColor: Colors.softTeal,
    borderRadius: 12,
    padding: 3,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 140, 149, 0.18)',
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: Colors.primary,
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textDark,
  },
  toggleBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  simControls: {
    marginTop: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 8,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.softTeal,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 140, 149, 0.22)',
    borderRadius: 12,
    padding: 13,
    marginBottom: 10,
  },
  pickerButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textDark,
  },
  pickerArrow: {
    fontSize: 10,
    color: Colors.primary,
  },
  distanceTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  distanceTab: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 140, 149, 0.2)',
  },
  distanceTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  distanceTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textDark,
  },
  distanceTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  readoutBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    backgroundColor: Colors.softTeal,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 140, 149, 0.2)',
  },
  readoutItem: {
    flex: 1,
    alignItems: 'center',
  },
  readoutLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    marginBottom: 3,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  readoutValue: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textDark,
  },
  realCoordsBox: {
    paddingVertical: 10,
  },

  // Modal Picker
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30, 22, 22, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    width: '100%',
    maxHeight: '75%',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 140, 149, 0.2)',
    backgroundColor: Colors.softTeal,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textDark,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalCloseText: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: '800',
  },
  modalList: {
    padding: 10,
  },
  modalItem: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: Colors.softTeal,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  modalItemActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.softTeal,
  },
  modalItemText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textDark,
  },
  modalItemTextActive: {
    color: Colors.primary,
  },
  modalItemCoords: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  // Locked Card
  lockedCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 26,
    paddingHorizontal: 16,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: Colors.accent,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
  },
  lockedIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  lockedTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textDark,
    marginBottom: 6,
  },
  lockedText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
  },

  gpsCoords: { fontSize: 14, fontWeight: '600', color: Colors.primary, fontFamily: 'monospace' },
  geofenceBadge: { marginTop: 8, backgroundColor: Colors.softTeal, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start' },
  geofenceBadgeText: { fontSize: 12, color: Colors.primary, fontWeight: '600' },

  // Sections
  sectionLabel: { fontSize: 18, fontWeight: '900', color: Colors.textDark, marginBottom: 4, paddingHorizontal: 16 },
  sectionSub: { fontSize: 12.5, color: Colors.textSecondary, marginBottom: 16, paddingHorizontal: 16 },
  audioSection: { marginBottom: 20 },
  poiSection: { marginBottom: 20 },

  // Destination Cover Cards
  destinationCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 140, 149, 0.18)',
    shadowColor: Colors.textDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  destImageWrapper: {
    width: '100%',
    height: 160,
    backgroundColor: '#000',
  },
  destCoverImage: {
    width: '100%',
    height: '100%',
  },
  destOverlayGradient: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0, height: 60,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  destBadgeTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  destBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  destActiveChip: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 100,
  },
  destActiveChipText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  destBody: {
    padding: 16,
  },
  destTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  destTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textDark,
    flex: 1,
    marginRight: 8,
  },
  ratingBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.accent,
  },
  destSummary: {
    fontSize: 12.5,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  destFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.softTeal,
    paddingTop: 10,
  },
  destCoordsText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  destPlayBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
  },
  destPlayBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  // Footer (Deep Brown #261D1D)
  footerContainer: {
    backgroundColor: '#261D1D',
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 24,
    borderTopWidth: 3,
    borderTopColor: Colors.primary,
  },
  footerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  footerLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  footerBrandTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 1,
  },
  footerBrandSub: {
    color: '#D1D1D6',
    fontSize: 11,
    marginTop: 2,
  },
  footerDivider: {
    width: 60,
    height: 2,
    backgroundColor: Colors.accent,
    marginVertical: 14,
    borderRadius: 1,
  },
  footerTagRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 10,
  },
  footerTag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 100,
  },
  footerTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
  footerCopyright: {
    color: '#999999',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 10,
  },
});