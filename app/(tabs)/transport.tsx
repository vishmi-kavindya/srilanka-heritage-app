import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { FALLBACK_ROUTES, FALLBACK_RENTALS } from '../../constants/heritageData';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppTheme } from '../../contexts/ThemeContext';
import { getTranslation } from '../../constants/i18n';
import { Colors, Radius, Shadow } from '../../constants/theme';

export default function TransportScreen() {
  const { lang } = useLanguage();
  const { isDark, colors } = useAppTheme();
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

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBg, borderColor: colors.cardBorder }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{t.transportTitle}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t.transportSub}</Text>
      </View>

      {/* Segment Switcher */}
      <View style={[styles.segmentContainer, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'rideshare' && styles.activeSegmentBtn]}
          onPress={() => setActiveTab('rideshare')}
        >
          <Text style={[styles.segmentBtnText, { color: activeTab === 'rideshare' ? '#fff' : colors.textSecondary }]}>
            {t.rideshareTab}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'public' && styles.activeSegmentBtn]}
          onPress={() => setActiveTab('public')}
        >
          <Text style={[styles.segmentBtnText, { color: activeTab === 'public' ? '#fff' : colors.textSecondary }]}>
            {t.busTrainTab}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'rentals' && styles.activeSegmentBtn]}
          onPress={() => setActiveTab('rentals')}
        >
          <Text style={[styles.segmentBtnText, { color: activeTab === 'rentals' ? '#fff' : colors.textSecondary }]}>
            {t.rentalsTab}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* RIDESHARE */}
        {activeTab === 'rideshare' && (
          <View>
            <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>{t.rideshareTitle}</Text>
            <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>{t.rideshareSub}</Text>
            {FALLBACK_ROUTES.map((route) => (
              <View key={route.id} style={[styles.routeCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
                <Text style={[styles.routeTitle, { color: colors.textPrimary }]}>📍 {route.from} ➔ {route.to}</Text>
                <View style={styles.fareBadge}>
                  <Text style={styles.fareBadgeText}>{t.estFare} {route.pickme_uber_estimate}</Text>
                </View>
                <View style={styles.btnRow}>
                  <TouchableOpacity style={styles.pickmeBtn} onPress={() => openPickMe(route.dest_lat, route.dest_lng)}>
                    <Text style={styles.pickmeBtnText}>{t.bookPickMe}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.uberBtn, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder }]} onPress={() => openUber(route.dest_lat, route.dest_lng)}>
                    <Text style={[styles.uberBtnText, { color: colors.textPrimary }]}>{t.bookUber}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* PUBLIC TRANSPORT */}
        {activeTab === 'public' && (
          <View>
            <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>{t.publicTransportTitle}</Text>
            <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>{t.publicTransportSub}</Text>
            {FALLBACK_ROUTES.map((route) => (
              <View key={route.id} style={[styles.transportCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
                <Text style={[styles.routeTitle, { color: colors.textPrimary }]}>{t.routeLabel} {route.from} → {route.to}</Text>
                <View style={[styles.modeBox, { backgroundColor: colors.softTeal }]}>
                  <Text style={styles.modeTitle}>{t.busRoute}</Text>
                  <Text style={[styles.modeText, { color: colors.textSecondary }]}>{route.bus_option}</Text>
                </View>
                <View style={[styles.modeBox, { backgroundColor: colors.softTeal }]}>
                  <Text style={styles.modeTitle}>{t.trainRoute}</Text>
                  <Text style={[styles.modeText, { color: colors.textSecondary }]}>{route.train_option}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* RENTALS */}
        {activeTab === 'rentals' && (
          <View>
            <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>{t.localRentals}</Text>
            <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>{t.rentalsSub}</Text>
            {FALLBACK_RENTALS.map((rental) => (
              <View key={rental.id} style={[styles.rentalCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
                <View style={styles.rentalHeader}>
                  <Text style={[styles.districtBadge, { backgroundColor: colors.softTeal, color: colors.textSecondary }]}>{rental.district}</Text>
                  <Text style={styles.dailyRateText}>{t.dailyRate} {rental.daily_rate_lkr}</Text>
                </View>
                <Text style={[styles.agencyName, { color: colors.textPrimary }]}>{rental.agency}</Text>
                <Text style={[styles.vehicleTypes, { color: colors.textSecondary }]}>
                  {t.available} <Text style={{ fontWeight: 'bold', color: colors.textPrimary }}>{rental.types.join(', ')}</Text>
                </Text>
                <View style={styles.btnRow}>
                  <TouchableOpacity style={styles.callBtn} onPress={() => contactRental(rental.phone, false)}>
                    <Text style={styles.callBtnText}>{t.callAgency}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.waBtn} onPress={() => contactRental(rental.whatsapp, true)}>
                    <Text style={styles.waBtnText}>💬 WhatsApp</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent', paddingTop: 54 },
  header: { paddingHorizontal: 20, paddingBottom: 12, marginBottom: 10 },
  title: { fontSize: 24, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 4 },
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: 16, padding: 4, marginHorizontal: 16, marginBottom: 14,
    borderWidth: 1,
  },
  segmentBtn: { flex: 1, paddingVertical: 11, alignItems: 'center', borderRadius: 12 },
  activeSegmentBtn: { backgroundColor: Colors.temple },
  segmentBtnText: { fontSize: 11, fontWeight: '700' },
  scrollContent: { paddingBottom: 50, paddingHorizontal: 16 },
  sectionHeading: { fontSize: 17, fontWeight: '800', marginBottom: 4 },
  sectionSub: { fontSize: 12, marginBottom: 16 },
  routeCard: {
    borderRadius: 20, padding: 18,
    marginBottom: 14, borderWidth: 1, ...Shadow.card,
  },
  routeTitle: { fontSize: 15, fontWeight: '800', marginBottom: 10 },
  fareBadge: {
    backgroundColor: Colors.saffron + '22', paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 20, alignSelf: 'flex-start', marginBottom: 14,
    borderWidth: 1, borderColor: Colors.saffron + '55',
  },
  fareBadgeText: { color: Colors.saffron, fontSize: 13, fontWeight: '800' },
  btnRow: { flexDirection: 'row', gap: 10 },
  pickmeBtn: { flex: 1, backgroundColor: '#E65100', paddingVertical: 13, borderRadius: 12, alignItems: 'center' },
  pickmeBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  uberBtn: { flex: 1, paddingVertical: 13, borderRadius: 12, alignItems: 'center', borderWidth: 1 },
  uberBtnText: { fontWeight: '800', fontSize: 14 },
  transportCard: {
    borderRadius: 20, padding: 18, marginBottom: 14,
    borderWidth: 1, ...Shadow.card,
  },
  modeBox: { padding: 14, borderRadius: 12, marginTop: 10 },
  modeTitle: { fontSize: 13, fontWeight: '800', color: Colors.sapphire, marginBottom: 6 },
  modeText: { fontSize: 13, lineHeight: 19 },
  rentalCard: {
    borderRadius: 20, padding: 18, marginBottom: 14,
    borderWidth: 1, ...Shadow.card,
  },
  rentalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  districtBadge: {
    fontSize: 11, fontWeight: '700', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
  },
  dailyRateText: { color: Colors.success, fontSize: 13, fontWeight: '800' },
  agencyName: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  vehicleTypes: { fontSize: 13, marginBottom: 14 },
  callBtn: { flex: 1, backgroundColor: Colors.sapphire, paddingVertical: 11, borderRadius: 10, alignItems: 'center' },
  callBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  waBtn: { flex: 1, backgroundColor: '#1B5E20', paddingVertical: 11, borderRadius: 10, alignItems: 'center' },
  waBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },
});
