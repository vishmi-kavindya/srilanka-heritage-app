// @ts-nocheck
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Linking,
  Platform,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { getTranslatedHeritageSites } from '../../constants/heritageData';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppTheme } from '../../contexts/ThemeContext';
import { getTranslation } from '../../constants/i18n';
import { Colors } from '../../constants/theme';

export default function UtilitiesSafetyScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const { lang } = useLanguage();
  const { isDark } = useAppTheme();
  const t = getTranslation(lang);
  const translatedSites = getTranslatedHeritageSites(lang);

  const [usdAmount, setUsdAmount] = useState<string>('100');
  const exchangeRateLkr = 305.50;

  const weatherSites = [
    { site: 'Sigiriya', temp: '29°C', condition: 'Partly Cloudy', rainPercent: 15, icon: 'partly-sunny' },
    { site: 'Kandy', temp: '24°C', condition: 'Light Showers', rainPercent: 40, icon: 'rainy' },
    { site: 'Galle', temp: '31°C', condition: 'Sunny', rainPercent: 5, icon: 'sunny' },
  ];
  const [selectedWeatherIndex, setSelectedWeatherIndex] = useState<number>(0);

  const lkrConverted = (parseFloat(usdAmount || '0') * exchangeRateLkr).toLocaleString('en-US', {
    maximumFractionDigits: 2,
  });

  const pageBg = isDark ? '#0A0A0A' : '#F5F7FA';
  const contentMaxWidth = 1000;

  return (
    <View style={[styles.container, { backgroundColor: pageBg }]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Cinematic Full-Bleed Hero */}
        <View style={styles.heroContainer}>
          <ImageBackground source={require('../../assets/images/beach.AVIF')} style={styles.heroBgImage} imageStyle={{ opacity: isDark ? 0.6 : 0.8 }}>
            <LinearGradient colors={['rgba(0,0,0,0.4)', isDark ? '#080909' : '#F5F7FA']} style={StyleSheet.absoluteFill} />
            <View style={[styles.heroContentWrapper, { maxWidth: contentMaxWidth }]}>
              <View style={styles.badge}>
                <Ionicons name="shield-checkmark" size={12} color="#00A6A6" style={{ marginRight: 6 }} />
                <Text style={styles.badgeText}>SAFETY & TOOLS</Text>
              </View>
              <Text style={styles.heroTitle}>Travel Smart. Travel Safely.</Text>
              <Text style={styles.heroSubtitle}>Essential tools, guides, and cultural rules for your journey.</Text>
            </View>
          </ImageBackground>
        </View>

        {/* Horizontal Utility Strip */}
        <View style={styles.utilityStripWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.utilityStrip}>
            {[
              { name: 'Currency', icon: 'cash-outline' },
              { name: 'Weather', icon: 'partly-sunny-outline' },
              { name: 'Emergency', icon: 'alert-circle-outline' },
              { name: 'Transport', icon: 'car-outline' },
              { name: 'Safety', icon: 'shield-checkmark-outline' }
            ].map((item, idx) => (
              <TouchableOpacity key={idx} style={[styles.utilityBtn, { backgroundColor: isDark ? '#121414' : '#FFF', borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#E5E7EB' }]}>
                <Ionicons name={item.icon as any} size={18} color={Colors.teal} style={{ marginRight: 8 }} />
                <Text style={[styles.utilityBtnText, { color: isDark ? '#FFF' : '#111' }]}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.mainContent, { maxWidth: contentMaxWidth }]}>
          
          {/* 2-Column Tools Section */}
          <View style={styles.twoColSection}>
            {/* Currency Converter */}
            <View style={[styles.toolCard, { backgroundColor: isDark ? '#121414' : '#FFFFFF', borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#E5E7EB', flex: 1 }]}>
              <View style={styles.toolHeader}>
                <Ionicons name="cash" size={24} color={Colors.orange} style={{ marginRight: 12 }} />
                <View>
                  <Text style={[styles.toolTitle, { color: isDark ? '#FFF' : '#111' }]}>Currency Converter</Text>
                  <Text style={[styles.toolSub, { color: isDark ? '#999' : '#666' }]}>Live Rate: 1 USD = {exchangeRateLkr} LKR</Text>
                </View>
              </View>
              <View style={styles.toolBody}>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: isDark ? '#888' : '#666' }]}>USD ($)</Text>
                  <TextInput
                    style={[styles.premiumInput, { backgroundColor: isDark ? '#0A0A0A' : '#F9FAFB', color: isDark ? '#FFF' : '#111', borderColor: isDark ? '#333' : '#E5E7EB' }]}
                    keyboardType="numeric"
                    value={usdAmount}
                    onChangeText={setUsdAmount}
                  />
                </View>
                <Ionicons name="arrow-down" size={20} color={isDark ? '#444' : '#CCC'} style={{ alignSelf: 'center', marginVertical: 8 }} />
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: isDark ? '#888' : '#666' }]}>LKR (Rs)</Text>
                  <View style={[styles.premiumInputBox, { backgroundColor: isDark ? 'rgba(0,166,166,0.1)' : '#E8F7F5', borderColor: isDark ? 'rgba(0,166,166,0.3)' : '#B2DFDB' }]}>
                    <Text style={[styles.convertedText, { color: isDark ? '#FFF' : '#111' }]}>{lkrConverted}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Live Weather */}
            <View style={[styles.toolCard, { backgroundColor: isDark ? '#121414' : '#FFFFFF', borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#E5E7EB', flex: 1 }]}>
              <View style={styles.toolHeader}>
                <Ionicons name="cloudy-night" size={24} color={Colors.teal} style={{ marginRight: 12 }} />
                <View>
                  <Text style={[styles.toolTitle, { color: isDark ? '#FFF' : '#111' }]}>Live Weather</Text>
                  <Text style={[styles.toolSub, { color: isDark ? '#999' : '#666' }]}>Current conditions</Text>
                </View>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                {weatherSites.map((w, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.weatherChip, { backgroundColor: selectedWeatherIndex === idx ? Colors.teal : (isDark ? '#181C22' : '#F3F4F6') }]}
                    onPress={() => setSelectedWeatherIndex(idx)}
                  >
                    <Text style={[styles.weatherChipText, { color: selectedWeatherIndex === idx ? '#FFF' : (isDark ? '#AAA' : '#666') }]}>
                      {w.site}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={[styles.weatherDisplay, { backgroundColor: isDark ? '#0A0A0A' : '#F9FAFB', borderColor: isDark ? '#333' : '#E5E7EB' }]}>
                <Ionicons name={weatherSites[selectedWeatherIndex].icon as any} size={56} color={Colors.orange} />
                <View style={{ marginLeft: 20 }}>
                  <Text style={[styles.tempHuge, { color: isDark ? '#FFF' : '#111' }]}>{weatherSites[selectedWeatherIndex].temp}</Text>
                  <Text style={[styles.weatherCond, { color: isDark ? '#CCC' : '#444' }]}>{weatherSites[selectedWeatherIndex].condition}</Text>
                  <Text style={[styles.rainChance, { color: Colors.teal }]}>Rain Chance: {weatherSites[selectedWeatherIndex].rainPercent}%</Text>
                </View>
              </View>
            </View>
          </View>

          {/* CULTURAL ETIQUETTE - Vertical Timeline */}
          <View style={styles.sectionBlock}>
            <Text style={[styles.sectionHeading, { color: isDark ? '#FFF' : '#111' }]}>CULTURAL ETIQUETTE</Text>
            <Text style={[styles.sectionSubHeading, { color: isDark ? '#999' : '#666' }]}>Respect local customs to enrich your experience.</Text>
            
            <View style={styles.timelineWrapper}>
              <View style={[styles.timelineLine, { backgroundColor: isDark ? '#333' : '#E5E7EB' }]} />
              {[
                { num: '01', title: 'Dress respectfully', desc: 'Cover shoulders and knees when visiting religious sites. Remove hats.' },
                { num: '02', title: 'Remove footwear', desc: 'Always remove shoes and socks before entering any Buddhist or Hindu temple.' },
                { num: '03', title: 'Respect sacred spaces', desc: 'Do not touch or lean on statues. Keep your voice down in holy areas.' },
                { num: '04', title: 'Photography etiquette', desc: 'Never take a photograph with your back facing a Buddha statue. Do not use flash inside shrines.' }
              ].map((item, i) => (
                <View key={i} style={styles.timelineItem}>
                  <View style={[styles.timelineNode, { backgroundColor: isDark ? '#121414' : '#FFF', borderColor: Colors.orange }]}>
                    <Text style={styles.timelineNum}>{item.num}</Text>
                  </View>
                  <View style={[styles.timelineContent, { backgroundColor: isDark ? '#121414' : '#FFF', borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#E5E7EB' }]}>
                    <Text style={[styles.timelineTitle, { color: isDark ? '#FFF' : '#111' }]}>{item.title}</Text>
                    <Text style={[styles.timelineDesc, { color: isDark ? '#999' : '#666' }]}>{item.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* FESTIVALS & EVENTS - Timeline Cards */}
          <View style={styles.sectionBlock}>
            <Text style={[styles.sectionHeading, { color: isDark ? '#FFF' : '#111' }]}>FESTIVALS & EVENTS</Text>
            <Text style={[styles.sectionSubHeading, { color: isDark ? '#999' : '#666' }]}>Plan your visit around these spectacular cultural events.</Text>
            
            <View style={styles.eventCardsWrapper}>
              <View style={[styles.eventCard, { backgroundColor: isDark ? '#121414' : '#FFF', borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#E5E7EB' }]}>
                <View style={[styles.eventDateBox, { backgroundColor: 'rgba(0,166,166,0.1)' }]}>
                  <Text style={styles.eventDateMonth}>AUG</Text>
                  <Text style={styles.eventDateDay}>15</Text>
                </View>
                <View style={styles.eventInfo}>
                  <Text style={[styles.eventTitle, { color: isDark ? '#FFF' : '#111' }]}>Kandy Esala Perahera</Text>
                  <Text style={[styles.eventLocation, { color: Colors.teal }]}>Kandy, Central Province</Text>
                  <Text style={[styles.eventDesc, { color: isDark ? '#999' : '#666' }]}>One of the oldest and grandest of all Buddhist festivals featuring dancers, jugglers, musicians, fire-breathers, and lavishly decorated elephants.</Text>
                </View>
              </View>
              <View style={[styles.eventCard, { backgroundColor: isDark ? '#121414' : '#FFF', borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#E5E7EB' }]}>
                <View style={[styles.eventDateBox, { backgroundColor: 'rgba(0,166,166,0.1)' }]}>
                  <Text style={styles.eventDateMonth}>MAY</Text>
                  <Text style={styles.eventDateDay}>23</Text>
                </View>
                <View style={styles.eventInfo}>
                  <Text style={[styles.eventTitle, { color: isDark ? '#FFF' : '#111' }]}>Vesak Poya</Text>
                  <Text style={[styles.eventLocation, { color: Colors.teal }]}>Islandwide</Text>
                  <Text style={[styles.eventDesc, { color: isDark ? '#999' : '#666' }]}>A festival of lights celebrating the birth, enlightenment, and passing away of Lord Buddha. Streets are decorated with lanterns and pandals.</Text>
                </View>
              </View>
            </View>
          </View>

          {/* TRAVEL SAFETY */}
          <View style={[styles.sectionBlock, { marginBottom: 60 }]}>
            <Text style={[styles.sectionHeading, { color: isDark ? '#FFF' : '#111' }]}>TRAVEL SAFETY & ALERTS</Text>
            
            <View style={[styles.safetyCard, { backgroundColor: isDark ? '#121414' : '#FFF', borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#E5E7EB' }]}>
              <View style={styles.safetyHeader}>
                <Ionicons name="checkmark-circle" size={24} color={Colors.teal} style={{ marginRight: 12 }} />
                <Text style={[styles.safetyTitle, { color: isDark ? '#FFF' : '#111' }]}>Official Rates</Text>
              </View>
              <View style={styles.safetyGrid}>
                {translatedSites.slice(0, 4).map((site) => (
                  <View key={site.id} style={[styles.rateItem, { borderBottomColor: isDark ? '#222' : '#F3F4F6' }]}>
                    <Text style={[styles.rateName, { color: isDark ? '#CCC' : '#444' }]}>{site.name}</Text>
                    <Text style={styles.ratePrice}>${site.ticket_price_usd}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={[styles.safetyCard, { backgroundColor: isDark ? '#1A1010' : '#FEF2F2', borderColor: isDark ? '#3F1515' : '#FECACA' }]}>
              <View style={styles.safetyHeader}>
                <Ionicons name="warning" size={24} color="#EF4444" style={{ marginRight: 12 }} />
                <Text style={[styles.safetyTitle, { color: '#EF4444' }]}>Tourist Scam Alerts</Text>
              </View>
              <View style={styles.scamList}>
                <View style={styles.scamListItem}><Ionicons name="close" size={16} color="#EF4444" style={{ marginRight: 8 }}/><Text style={[styles.scamText, { color: isDark ? '#E5BDBD' : '#991B1B' }]}>Beware of "free" unofficial guides at monuments.</Text></View>
                <View style={styles.scamListItem}><Ionicons name="close" size={16} color="#EF4444" style={{ marginRight: 8 }}/><Text style={[styles.scamText, { color: isDark ? '#E5BDBD' : '#991B1B' }]}>Always negotiate tuk-tuk prices before the ride or use metered apps.</Text></View>
                <View style={styles.scamListItem}><Ionicons name="close" size={16} color="#EF4444" style={{ marginRight: 8 }}/><Text style={[styles.scamText, { color: isDark ? '#E5BDBD' : '#991B1B' }]}>Buy train tickets only at official station counters.</Text></View>
              </View>
            </View>

            <TouchableOpacity style={styles.emergencyBtn} onPress={() => Linking.openURL('tel:1912')}>
              <LinearGradient colors={['#DC2626', '#991B1B']} style={styles.emergencyGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Ionicons name="call" size={24} color="#FFF" style={{ marginRight: 12 }} />
                <View>
                  <Text style={styles.emergencyTitle}>Tourist Police</Text>
                  <Text style={styles.emergencySub}>Dial 1912 - Available 24/7</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroContainer: { width: '100%', height: Platform.OS === 'web' ? 450 : 350, minHeight: 300 },
  heroBgImage: { width: '100%', height: '100%', justifyContent: 'center' },
  heroContentWrapper: { paddingHorizontal: 40, alignItems: 'center', justifyContent: 'center', flex: 1, paddingTop: 40 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 166, 166, 0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(0, 166, 166, 0.4)' },
  badgeText: { color: '#00A6A6', fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  heroTitle: { color: '#FFF', fontSize: Platform.OS === 'web' ? 56 : 36, fontWeight: '900', textAlign: 'center', marginBottom: 16, letterSpacing: -1 },
  heroSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: Platform.OS === 'web' ? 18 : 15, textAlign: 'center', fontWeight: '400', maxWidth: 600, lineHeight: 26 },
  
  utilityStripWrapper: { width: '100%', alignItems: 'center', marginTop: -30, zIndex: 10, paddingHorizontal: 20 },
  utilityStrip: { gap: 12, paddingHorizontal: 10 },
  utilityBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 30, borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } },
  utilityBtnText: { fontSize: 14, fontWeight: '700' },
  
  mainContent: { width: '100%', alignSelf: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 60 },
  
  twoColSection: { flexDirection: Platform.OS === 'web' ? 'row' : 'column', gap: 24, marginBottom: 60 },
  toolCard: { borderRadius: 24, borderWidth: 1, padding: 32, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 20, shadowOffset: { width: 0, height: 10 } },
  toolHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  toolTitle: { fontSize: 24, fontWeight: '900' },
  toolSub: { fontSize: 14, fontWeight: '600', marginTop: 4 },
  
  toolBody: { gap: 16 },
  inputGroup: { flex: 1 },
  inputLabel: { fontSize: 12, fontWeight: '800', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' },
  premiumInput: { borderRadius: 16, borderWidth: 1, paddingHorizontal: 20, paddingVertical: 16, fontSize: 20, fontWeight: '800' },
  premiumInputBox: { borderRadius: 16, borderWidth: 1, paddingHorizontal: 20, paddingVertical: 16 },
  convertedText: { fontSize: 24, fontWeight: '900' },
  
  weatherChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  weatherChipText: { fontSize: 13, fontWeight: '700' },
  weatherDisplay: { flexDirection: 'row', alignItems: 'center', padding: 24, borderRadius: 16, borderWidth: 1 },
  tempHuge: { fontSize: 40, fontWeight: '900' },
  weatherCond: { fontSize: 16, fontWeight: '700', marginVertical: 4 },
  rainChance: { fontSize: 14, fontWeight: '800' },
  
  sectionBlock: { marginBottom: 60 },
  sectionHeading: { fontSize: 32, fontWeight: '900', letterSpacing: -1, marginBottom: 8 },
  sectionSubHeading: { fontSize: 16, marginBottom: 40 },
  
  timelineWrapper: { paddingLeft: 24, position: 'relative' },
  timelineLine: { position: 'absolute', left: 40, top: 0, bottom: 0, width: 2 },
  timelineItem: { flexDirection: 'row', marginBottom: 32, position: 'relative' },
  timelineNode: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginRight: 24, zIndex: 2 },
  timelineNum: { color: Colors.orange, fontSize: 12, fontWeight: '900' },
  timelineContent: { flex: 1, padding: 24, borderRadius: 16, borderWidth: 1 },
  timelineTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
  timelineDesc: { fontSize: 15, lineHeight: 24 },
  
  eventCardsWrapper: { gap: 24 },
  eventCard: { flexDirection: Platform.OS === 'web' ? 'row' : 'column', borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  eventDateBox: { width: Platform.OS === 'web' ? 120 : '100%', padding: 24, alignItems: 'center', justifyContent: 'center' },
  eventDateMonth: { color: Colors.teal, fontSize: 14, fontWeight: '800', letterSpacing: 2 },
  eventDateDay: { color: Colors.teal, fontSize: 36, fontWeight: '900' },
  eventInfo: { flex: 1, padding: 24 },
  eventTitle: { fontSize: 22, fontWeight: '900', marginBottom: 4 },
  eventLocation: { fontSize: 13, fontWeight: '800', textTransform: 'uppercase', marginBottom: 12 },
  eventDesc: { fontSize: 15, lineHeight: 24 },
  
  safetyCard: { borderRadius: 20, borderWidth: 1, padding: 32, marginBottom: 24 },
  safetyHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  safetyTitle: { fontSize: 20, fontWeight: '900' },
  safetyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  rateItem: { width: Platform.OS === 'web' ? '48%' : '100%', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1 },
  rateName: { fontSize: 15, fontWeight: '600' },
  ratePrice: { fontSize: 15, fontWeight: '800', color: Colors.teal },
  
  scamList: { gap: 16 },
  scamListItem: { flexDirection: 'row', alignItems: 'center' },
  scamText: { fontSize: 15, fontWeight: '600', flex: 1 },
  
  emergencyBtn: { borderRadius: 20, overflow: 'hidden', marginTop: 12 },
  emergencyGradient: { flexDirection: 'row', alignItems: 'center', padding: 24 },
  emergencyTitle: { color: '#FFF', fontSize: 20, fontWeight: '900', marginBottom: 4 },
  emergencySub: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '700' }
});
