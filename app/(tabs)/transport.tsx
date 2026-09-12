// @ts-nocheck
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
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
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
  
  const [activeTab, setActiveTab] = useState<'rideshare' | 'public' | 'rentals'>('public');
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');

  const openPickMe = (lat: number, lng: number) => {
    const url = `pickme://ride?dest_lat=${lat}&dest_lng=${lng}`;
    Linking.canOpenURL(url).then(supported => Linking.openURL(supported ? url : 'https://pickme.lk')).catch(() => Linking.openURL('https://pickme.lk'));
  };

  const openUber = (lat: number, lng: number) => {
    const url = `uber://?action=setPickup&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}`;
    Linking.canOpenURL(url).then(supported => Linking.openURL(supported ? url : 'https://m.uber.com')).catch(() => Linking.openURL('https://m.uber.com'));
  };

  const contactRental = (phone: string, isWhatsapp: boolean = false) => {
    if (isWhatsapp) {
      Linking.openURL(`https://wa.me/${phone.replace(/[^0-9]/g, '')}`);
    } else {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const pageBg = isDark ? '#080909' : '#F8F9FA';
  const contentMaxWidth = 1000;

  return (
    <View style={[styles.container, { backgroundColor: pageBg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        {/* Cinematic Hero */}
        <View style={styles.heroContainer}>
          <ImageBackground source={require('../../assets/images/nine.jpg')} style={styles.heroBgImage} imageStyle={{ opacity: isDark ? 0.6 : 0.8 }}>
            <LinearGradient colors={['rgba(0,0,0,0.4)', isDark ? '#080909' : '#F8F9FA']} style={StyleSheet.absoluteFill} />
            <View style={[styles.heroContentWrapper, { maxWidth: contentMaxWidth }]}>
              <View style={styles.badge}>
                <Ionicons name="compass" size={12} color="#F59E0B" style={{ marginRight: 6 }} />
                <Text style={styles.badgeText}>TRANSPORT HUB</Text>
              </View>
              <Text style={styles.heroTitle}>{t.transportTitle || 'Move Around Sri Lanka'}</Text>
              <Text style={styles.heroSubtitle}>{t.transportSub || 'Seamless routes, scenic trains, and reliable rentals.'}</Text>
            </View>
          </ImageBackground>
        </View>

        <View style={[styles.mainContent, { maxWidth: contentMaxWidth }]}>
          
          {/* Large Route Search Module */}
          <View style={[styles.searchModule, { backgroundColor: isDark ? '#121414' : '#FFFFFF', borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#E5E7EB' }]}>
            <View style={[styles.searchRow, isDesktop ? { flexDirection: 'row' } : { flexDirection: 'column' }]}>
              <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, { color: isDark ? '#888' : '#666' }]}>FROM</Text>
                <View style={[styles.inputBox, { backgroundColor: isDark ? '#0A0A0A' : '#F3F4F6', borderColor: isDark ? '#333' : '#E5E7EB' }]}>
                  <Ionicons name="location-outline" size={20} color={Colors.teal} style={{ marginRight: 12 }} />
                  <TextInput
                    style={[styles.input, { color: isDark ? '#FFF' : '#111' }]}
                    placeholder="Colombo"
                    placeholderTextColor={isDark ? '#555' : '#999'}
                    value={fromQuery}
                    onChangeText={setFromQuery}
                  />
                </View>
              </View>
              
              {!isDesktop && <View style={styles.swapIconMobile}><Ionicons name="swap-vertical" size={24} color={Colors.orange} /></View>}
              {isDesktop && <View style={styles.swapIconDesktop}><Ionicons name="swap-horizontal" size={24} color={Colors.orange} /></View>}
              
              <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, { color: isDark ? '#888' : '#666' }]}>TO</Text>
                <View style={[styles.inputBox, { backgroundColor: isDark ? '#0A0A0A' : '#F3F4F6', borderColor: isDark ? '#333' : '#E5E7EB' }]}>
                  <Ionicons name="flag-outline" size={20} color={Colors.teal} style={{ marginRight: 12 }} />
                  <TextInput
                    style={[styles.input, { color: isDark ? '#FFF' : '#111' }]}
                    placeholder="Ella"
                    placeholderTextColor={isDark ? '#555' : '#999'}
                    value={toQuery}
                    onChangeText={setToQuery}
                  />
                </View>
              </View>
              
              <TouchableOpacity style={styles.searchBtn}>
                <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.searchBtnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <Text style={styles.searchBtnText}>Search Routes</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFF" style={{ marginLeft: 8 }} />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Sub Filters */}
            <View style={styles.filterTabs}>
              <TouchableOpacity style={[styles.filterTab, activeTab === 'public' && { borderBottomColor: Colors.teal }]} onPress={() => setActiveTab('public')}>
                <Text style={[styles.filterTabText, { color: activeTab === 'public' ? Colors.teal : (isDark ? '#888' : '#666') }]}>Public Transit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.filterTab, activeTab === 'rideshare' && { borderBottomColor: Colors.teal }]} onPress={() => setActiveTab('rideshare')}>
                <Text style={[styles.filterTabText, { color: activeTab === 'rideshare' ? Colors.teal : (isDark ? '#888' : '#666') }]}>Rideshare</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.filterTab, activeTab === 'rentals' && { borderBottomColor: Colors.teal }]} onPress={() => setActiveTab('rentals')}>
                <Text style={[styles.filterTabText, { color: activeTab === 'rentals' ? Colors.teal : (isDark ? '#888' : '#666') }]}>Rentals</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Results Area */}
          <View style={styles.resultsArea}>
            
            {/* PUBLIC TRANSIT TIMELINE */}
            {activeTab === 'public' && FALLBACK_ROUTES.map((route, index) => (
              <View key={route.id} style={[styles.timelineCard, { backgroundColor: isDark ? '#121414' : '#FFFFFF', borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#E5E7EB' }]}>
                <View style={styles.timelineHeader}>
                  <Text style={[styles.timelineRouteTitle, { color: isDark ? '#FFF' : '#111' }]}>{route.from} to {route.to}</Text>
                  <Text style={styles.timelineDuration}>~4h 30m</Text>
                </View>

                {/* Visual Timeline Graphic */}
                <View style={styles.timelineGraphic}>
                  {/* Step 1 */}
                  <View style={styles.timelineStep}>
                    <View style={[styles.timelineDot, { backgroundColor: Colors.teal }]}><Ionicons name="bus" size={14} color="#FFF" /></View>
                    <View style={[styles.timelineLine, { backgroundColor: Colors.teal }]} />
                    <View style={styles.timelineStepContent}>
                      <Text style={[styles.timelineStepLabel, { color: isDark ? '#FFF' : '#111' }]}>Express Bus</Text>
                      <Text style={[styles.timelineStepDesc, { color: isDark ? '#888' : '#666' }]}>{route.bus_option}</Text>
                    </View>
                  </View>
                  
                  {/* Step 2 */}
                  <View style={styles.timelineStep}>
                    <View style={[styles.timelineDot, { backgroundColor: Colors.orange }]}><Ionicons name="train" size={14} color="#FFF" /></View>
                    <View style={styles.timelineStepContent}>
                      <Text style={[styles.timelineStepLabel, { color: isDark ? '#FFF' : '#111' }]}>Scenic Train</Text>
                      <Text style={[styles.timelineStepDesc, { color: isDark ? '#888' : '#666' }]}>{route.train_option}</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity style={[styles.timelineAction, { backgroundColor: isDark ? 'rgba(0,166,166,0.1)' : '#E8F7F5' }]}>
                  <Text style={styles.timelineActionText}>View Full Timetable</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.teal} />
                </TouchableOpacity>
              </View>
            ))}

            {/* RIDESHARE */}
            {activeTab === 'rideshare' && FALLBACK_ROUTES.map((route) => (
              <View key={route.id} style={[styles.timelineCard, { backgroundColor: isDark ? '#121414' : '#FFFFFF', borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#E5E7EB' }]}>
                <View style={styles.timelineHeader}>
                  <Text style={[styles.timelineRouteTitle, { color: isDark ? '#FFF' : '#111' }]}>{route.from} to {route.to}</Text>
                  <View style={styles.fareBadge}>
                    <Text style={styles.fareBadgeText}>{route.pickme_uber_estimate}</Text>
                  </View>
                </View>
                <Text style={[styles.rideshareDesc, { color: isDark ? '#999' : '#666' }]}>Direct drop-off. Prices may vary based on traffic and demand.</Text>
                
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.primaryBtn} onPress={() => openPickMe(route.dest_lat, route.dest_lng)}>
                    <LinearGradient colors={['#E65100', '#FF9800']} style={styles.primaryBtnGradient}>
                      <Text style={styles.primaryBtnText}>Book PickMe</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.secondaryBtn, { borderColor: isDark ? '#333' : '#E5E7EB' }]} onPress={() => openUber(route.dest_lat, route.dest_lng)}>
                    <Text style={[styles.secondaryBtnText, { color: isDark ? '#FFF' : '#111' }]}>Book Uber</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* RENTALS */}
            {activeTab === 'rentals' && FALLBACK_RENTALS.map((rental) => (
              <View key={rental.id} style={[styles.rentalCard, { backgroundColor: isDark ? '#121414' : '#FFFFFF', borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#E5E7EB' }]}>
                <View style={styles.rentalHeader}>
                  <View>
                    <Text style={[styles.rentalAgency, { color: isDark ? '#FFF' : '#111' }]}>{rental.agency}</Text>
                    <Text style={[styles.rentalLocation, { color: Colors.teal }]}>📍 {rental.district}</Text>
                  </View>
                  <Text style={styles.rentalPrice}>{rental.daily_rate_lkr} <Text style={{ fontSize: 12, color: isDark ? '#888' : '#666' }}>/day</Text></Text>
                </View>

                <View style={styles.rentalTypes}>
                  {rental.types.map((type, i) => (
                    <View key={i} style={[styles.rentalTypeChip, { backgroundColor: isDark ? '#1A1A1A' : '#F3F4F6' }]}>
                      <Ionicons name="car-sport" size={14} color={isDark ? '#CCC' : '#444'} style={{ marginRight: 6 }} />
                      <Text style={[styles.rentalTypeText, { color: isDark ? '#CCC' : '#444' }]}>{type}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.primaryBtn} onPress={() => contactRental(rental.phone, false)}>
                    <LinearGradient colors={[Colors.teal, Colors.tealSoft]} style={styles.primaryBtnGradient}>
                      <Ionicons name="call" size={16} color="#FFF" style={{ marginRight: 8 }} />
                      <Text style={styles.primaryBtnText}>Call</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.secondaryBtn, { borderColor: isDark ? '#333' : '#E5E7EB', backgroundColor: '#25D366' }]} onPress={() => contactRental(rental.whatsapp, true)}>
                    <Ionicons name="logo-whatsapp" size={16} color="#FFF" style={{ marginRight: 8 }} />
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
  heroContainer: { width: '100%', height: Platform.OS === 'web' ? 400 : 320, minHeight: 300 },
  heroBgImage: { width: '100%', height: '100%', justifyContent: 'center' },
  heroContentWrapper: { paddingHorizontal: 40, alignItems: 'center', justifyContent: 'center', flex: 1, paddingTop: 40 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(245, 158, 11, 0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.3)' },
  badgeText: { color: '#F59E0B', fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  heroTitle: { fontSize: Platform.OS === 'web' ? 56 : 36, fontWeight: '900', letterSpacing: -1, marginBottom: 16, color: '#FFF', textAlign: 'center' },
  heroSubtitle: { fontSize: Platform.OS === 'web' ? 18 : 15, lineHeight: 26, fontWeight: '400', maxWidth: 600, color: '#E5E7EB', textAlign: 'center', marginBottom: 24 },
  
  mainContent: { width: '100%', alignSelf: 'center', paddingHorizontal: 20, marginTop: -40, paddingBottom: 80, zIndex: 10 },
  
  // Search Module
  searchModule: { borderRadius: 24, borderWidth: 1, padding: 32, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 30, shadowOffset: { width: 0, height: 15 }, marginBottom: 40 },
  searchRow: { gap: 16, alignItems: 'center' },
  inputWrapper: { flex: 1, width: '100%' },
  inputLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  inputBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14 },
  input: { flex: 1, fontSize: 16, fontWeight: '700' },
  swapIconDesktop: { paddingHorizontal: 8 },
  swapIconMobile: { marginVertical: -8 },
  searchBtn: { borderRadius: 16, overflow: 'hidden', width: Platform.OS === 'web' ? 'auto' : '100%', marginTop: Platform.OS === 'web' ? 24 : 16 },
  searchBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingVertical: 16 },
  searchBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  
  filterTabs: { flexDirection: 'row', marginTop: 32, borderBottomWidth: 1, borderBottomColor: 'rgba(150,150,150,0.1)' },
  filterTab: { paddingVertical: 12, paddingHorizontal: 24, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  filterTabText: { fontSize: 14, fontWeight: '700' },

  // Results Area
  resultsArea: { gap: 24 },
  
  timelineCard: { borderRadius: 24, borderWidth: 1, padding: 32, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15, shadowOffset: { width: 0, height: 5 } },
  timelineHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  timelineRouteTitle: { fontSize: 24, fontWeight: '900' },
  timelineDuration: { fontSize: 14, fontWeight: '800', color: Colors.orange, backgroundColor: 'rgba(245,158,11,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  
  timelineGraphic: { paddingLeft: 12, marginBottom: 24 },
  timelineStep: { position: 'relative', paddingLeft: 32, paddingBottom: 24 },
  timelineDot: { position: 'absolute', left: -14, top: 0, width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  timelineLine: { position: 'absolute', left: -1, top: 28, bottom: 0, width: 2, zIndex: 1 },
  timelineStepContent: { marginTop: 2 },
  timelineStepLabel: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  timelineStepDesc: { fontSize: 15, lineHeight: 22 },

  timelineAction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 16 },
  timelineActionText: { color: Colors.teal, fontSize: 14, fontWeight: '800' },

  fareBadge: { backgroundColor: 'rgba(0,166,166,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  fareBadgeText: { color: Colors.teal, fontSize: 14, fontWeight: '800' },
  rideshareDesc: { fontSize: 15, marginBottom: 24, lineHeight: 22 },

  rentalCard: { borderRadius: 24, borderWidth: 1, padding: 32, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15, shadowOffset: { width: 0, height: 5 } },
  rentalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  rentalAgency: { fontSize: 22, fontWeight: '900', marginBottom: 4 },
  rentalLocation: { fontSize: 14, fontWeight: '700' },
  rentalPrice: { fontSize: 24, fontWeight: '900', color: Colors.orange },
  rentalTypes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  rentalTypeChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  rentalTypeText: { fontSize: 13, fontWeight: '600' },

  actionRow: { flexDirection: 'row', gap: 12 },
  primaryBtn: { flex: 1, borderRadius: 16, overflow: 'hidden' },
  primaryBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14 },
  primaryBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  secondaryBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 16, borderWidth: 1 },
  secondaryBtnText: { fontSize: 15, fontWeight: '800' }
});
