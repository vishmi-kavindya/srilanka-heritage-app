import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { FALLBACK_ROUTES, FALLBACK_RENTALS } from '../../constants/heritageData';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppTheme } from '../../contexts/ThemeContext';
import { getTranslation } from '../../constants/i18n';
import { Colors } from '../../constants/theme';

export default function TransportScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const { lang } = useLanguage();
  const { isDark } = useAppTheme();
  const t = getTranslation(lang);
  const [activeTab, setActiveTab] = useState<'rideshare' | 'public' | 'rentals'>('rideshare');

  const openPickMe = (lat: number, lng: number) => {
    const url = `pickme://ride?dest_lat=${lat}&dest_lng=${lng}`;
    Linking.canOpenURL(url)
      .then((supported) => { Linking.openURL(supported ? url : 'https://pickme.lk'); })
      .catch(() => Linking.openURL('https://pickme.lk'));
  };

  const openUber = (lat: number, lng: number) => {
    const url = `uber://?action=setPickup&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}`;
    Linking.canOpenURL(url)
      .then((supported) => { Linking.openURL(supported ? url : 'https://m.uber.com'); })
      .catch(() => Linking.openURL('https://m.uber.com'));
  };

  const contactRental = (phone: string, isWhatsapp: boolean = false) => {
    if (isWhatsapp) {
      Linking.openURL(`https://wa.me/${phone.replace(/[^0-9]/g, '')}`);
    } else {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const pageBg = isDark ? '#0A0A0A' : '#F5F7FA';
  const glassTint = isDark ? 'dark' : 'light';
  const contentMaxWidth = 1000;

  return (
    <View style={[styles.container, { backgroundColor: pageBg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        {/* Cinematic Full-Bleed Hero */}
        <View style={styles.heroContainer}>
          <ImageBackground source={require('../../assets/images/nine.jpg')} style={styles.heroBgImage} imageStyle={{ opacity: 0.85 }}>
            <LinearGradient colors={['rgba(0,0,0,0.2)', isDark ? '#0A0A0A' : '#F5F7FA']} style={StyleSheet.absoluteFillObject} />
            <View style={[styles.heroContentWrapper, { maxWidth: contentMaxWidth }]}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>🚕 TRANSPORT HUB</Text>
              </View>
              <Text style={styles.heroTitle}>{t.transportTitle || 'Transport Options'}</Text>
              <Text style={styles.heroSubtitle}>{t.transportSub || 'Find your way around Sri Lanka effortlessly'}</Text>
            </View>
          </ImageBackground>
        </View>

        {/* Floating Segment Control */}
        <View style={styles.segmentWrapper}>
          <BlurView intensity={80} tint={glassTint} style={styles.segmentBlur}>
            <TouchableOpacity style={[styles.segmentBtn, activeTab === 'rideshare' && styles.segmentBtnActive]} onPress={() => setActiveTab('rideshare')}>
              <Text style={[styles.segmentBtnText, activeTab === 'rideshare' ? { color: '#FFF' } : { color: isDark ? '#AAA' : '#666' }]}>
                {t.rideshareTab || 'Ride Share'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.segmentBtn, activeTab === 'public' && styles.segmentBtnActive]} onPress={() => setActiveTab('public')}>
              <Text style={[styles.segmentBtnText, activeTab === 'public' ? { color: '#FFF' } : { color: isDark ? '#AAA' : '#666' }]}>
                {t.busTrainTab || 'Bus & Train'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.segmentBtn, activeTab === 'rentals' && styles.segmentBtnActive]} onPress={() => setActiveTab('rentals')}>
              <Text style={[styles.segmentBtnText, activeTab === 'rentals' ? { color: '#FFF' } : { color: isDark ? '#AAA' : '#666' }]}>
                {t.rentalsTab || 'Rentals'}
              </Text>
            </TouchableOpacity>
          </BlurView>
        </View>

        {/* Main Content Area */}
        <View style={[styles.mainContent, { maxWidth: contentMaxWidth }]}>
          <View style={styles.cardsGrid}>
            {/* RIDESHARE */}
            {activeTab === 'rideshare' && FALLBACK_ROUTES.map((route) => (
              <View key={route.id} style={[styles.card, { backgroundColor: isDark ? '#141414' : '#FFFFFF', borderColor: isDark ? '#2A2A2A' : '#E5E7EB', width: isDesktop ? '48%' : '100%' }]}>
                <Text style={[styles.routeTitle, { color: isDark ? '#FFF' : '#111' }]}>📍 {route.from} ➔ {route.to}</Text>
                <View style={styles.fareBadge}>
                  <Text style={styles.fareBadgeText}>{t.estFare || 'Est. Fare:'} {route.pickme_uber_estimate}</Text>
                </View>
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.primaryBtn} onPress={() => openPickMe(route.dest_lat, route.dest_lng)}>
                    <LinearGradient colors={['#E65100', '#FF9800']} style={styles.primaryBtnGradient}>
                      <Text style={styles.primaryBtnText}>{t.bookPickMe || 'PickMe'}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.secondaryBtn, { borderColor: isDark ? '#333' : '#E5E7EB' }]} onPress={() => openUber(route.dest_lat, route.dest_lng)}>
                    <Text style={[styles.secondaryBtnText, { color: isDark ? '#FFF' : '#111' }]}>{t.bookUber || 'Uber'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* PUBLIC TRANSPORT */}
            {activeTab === 'public' && FALLBACK_ROUTES.map((route) => (
              <View key={route.id} style={[styles.card, { backgroundColor: isDark ? '#141414' : '#FFFFFF', borderColor: isDark ? '#2A2A2A' : '#E5E7EB', width: isDesktop ? '48%' : '100%' }]}>
                <Text style={[styles.routeTitle, { color: isDark ? '#FFF' : '#111' }]}>{t.routeLabel || 'Route:'} {route.from} → {route.to}</Text>
                <View style={[styles.modeBox, { backgroundColor: isDark ? '#1A1A1A' : '#F9FAFB', borderColor: isDark ? '#333' : '#E5E7EB' }]}>
                  <Text style={styles.modeTitle}>{t.busRoute || 'Bus'}</Text>
                  <Text style={[styles.modeText, { color: isDark ? '#BBB' : '#444' }]}>{route.bus_option}</Text>
                </View>
                <View style={[styles.modeBox, { backgroundColor: isDark ? '#1A1A1A' : '#F9FAFB', borderColor: isDark ? '#333' : '#E5E7EB' }]}>
                  <Text style={styles.modeTitle}>{t.trainRoute || 'Train'}</Text>
                  <Text style={[styles.modeText, { color: isDark ? '#BBB' : '#444' }]}>{route.train_option}</Text>
                </View>
              </View>
            ))}

            {/* RENTALS */}
            {activeTab === 'rentals' && FALLBACK_RENTALS.map((rental) => (
              <View key={rental.id} style={[styles.card, { backgroundColor: isDark ? '#141414' : '#FFFFFF', borderColor: isDark ? '#2A2A2A' : '#E5E7EB', width: isDesktop ? '48%' : '100%' }]}>
                <View style={styles.rentalHeader}>
                  <View style={[styles.districtBadge, { backgroundColor: isDark ? 'rgba(0,140,149,0.2)' : '#E0F2F1' }]}>
                    <Text style={{ fontSize: 11, fontWeight: '800', color: Colors.teal }}>{rental.district}</Text>
                  </View>
                  <Text style={styles.dailyRateText}>{t.dailyRate || 'Daily:'} {rental.daily_rate_lkr}</Text>
                </View>
                <Text style={[styles.agencyName, { color: isDark ? '#FFF' : '#111' }]}>{rental.agency}</Text>
                <Text style={[styles.vehicleTypes, { color: isDark ? '#999' : '#666' }]}>
                  {t.available || 'Available:'} <Text style={{ fontWeight: '800', color: isDark ? '#DDD' : '#333' }}>{rental.types.join(', ')}</Text>
                </Text>
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.primaryBtn} onPress={() => contactRental(rental.phone, false)}>
                    <LinearGradient colors={[Colors.teal, Colors.tealSoft]} style={styles.primaryBtnGradient}>
                      <Text style={styles.primaryBtnText}>{t.callAgency || 'Call'}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.secondaryBtn, { borderColor: isDark ? '#333' : '#E5E7EB', backgroundColor: '#25D366' }]} onPress={() => contactRental(rental.whatsapp, true)}>
                    <Text style={[styles.secondaryBtnText, { color: '#FFF' }]}>WhatsApp</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroContainer: {
    width: '100%',
    height: Platform.OS === 'web' ? 360 : 280,
  },
  heroBgImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContentWrapper: {
    width: '100%',
    paddingHorizontal: 24,
    alignItems: 'center',
    zIndex: 2,
  },
  badge: {
    backgroundColor: 'rgba(245, 130, 32, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  heroTitle: {
    color: '#FFF',
    fontSize: Platform.OS === 'web' ? 42 : 32,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: Platform.OS === 'web' ? 18 : 15,
    textAlign: 'center',
    fontWeight: '500',
  },
  segmentWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: -30,
    zIndex: 10,
  },
  segmentBlur: {
    flexDirection: 'row',
    borderRadius: 30,
    padding: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    maxWidth: 600,
    width: '90%',
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 24,
  },
  segmentBtnActive: {
    backgroundColor: Colors.orange,
  },
  segmentBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  mainContent: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 60,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 12,
  },
  fareBadge: {
    backgroundColor: 'rgba(245, 130, 32, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  fareBadgeText: {
    color: Colors.orange,
    fontSize: 13,
    fontWeight: '800',
  },
  modeBox: {
    padding: 16,
    borderRadius: 16,
    marginTop: 12,
    borderWidth: 1,
  },
  modeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.teal,
    marginBottom: 6,
  },
  modeText: {
    fontSize: 14,
    lineHeight: 22,
  },
  rentalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  districtBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dailyRateText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '900',
  },
  agencyName: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 6,
  },
  vehicleTypes: {
    fontSize: 14,
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  primaryBtn: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  primaryBtnGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
