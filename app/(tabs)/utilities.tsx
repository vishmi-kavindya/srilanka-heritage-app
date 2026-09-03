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
    { site: 'Sigiriya', temp: '29°C', condition: 'Partly Cloudy ⛅', rainPercent: 15 },
    { site: 'Kandy', temp: '24°C', condition: 'Light Showers 🌦️', rainPercent: 40 },
    { site: 'Galle', temp: '31°C', condition: 'Sunny ☀️', rainPercent: 5 },
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
          <ImageBackground source={require('../../assets/images/beach.AVIF')} style={styles.heroBgImage} imageStyle={{ opacity: 0.85 }}>
            <LinearGradient colors={['rgba(0,0,0,0.2)', isDark ? '#0A0A0A' : '#F5F7FA']} style={StyleSheet.absoluteFillObject} />
            <View style={[styles.heroContentWrapper, { maxWidth: contentMaxWidth }]}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>🛡️ SAFETY & TOOLS</Text>
              </View>
              <Text style={styles.heroTitle}>{t.utilitiesTitle || 'Travel Utilities'}</Text>
              <Text style={styles.heroSubtitle}>{t.utilitiesSub || 'Essential tools, guides, and cultural rules'}</Text>
            </View>
          </ImageBackground>
        </View>

        <View style={[styles.mainContent, { maxWidth: contentMaxWidth }]}>
          <View style={styles.cardsGrid}>
            
            {/* Currency Converter */}
            <View style={[styles.card, { backgroundColor: isDark ? '#141414' : '#FFFFFF', borderColor: isDark ? '#2A2A2A' : '#E5E7EB', width: isDesktop ? '48%' : '100%' }]}>
              <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#111' }]}>{t.currencyTitle || 'Currency Converter'}</Text>
              <Text style={[styles.rateSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t.currentRate || 'Rate:'} {exchangeRateLkr} LKR</Text>
              
              <View style={styles.calcRow}>
                <View style={styles.inputBox}>
                  <Text style={[styles.inputLabel, { color: isDark ? '#CCC' : '#666' }]}>USD ($):</Text>
                  <TextInput
                    style={[styles.currencyInput, { backgroundColor: isDark ? '#0A0A0A' : '#F9FAFB', color: isDark ? '#FFF' : '#111', borderColor: isDark ? '#333' : '#E5E7EB' }]}
                    keyboardType="numeric"
                    value={usdAmount}
                    onChangeText={setUsdAmount}
                  />
                </View>
                <Text style={[styles.equalsSign, { color: isDark ? '#666' : '#CCC' }]}>=</Text>
                <View style={styles.inputBox}>
                  <Text style={[styles.inputLabel, { color: isDark ? '#CCC' : '#666' }]}>LKR (Rs.):</Text>
                  <Text style={[styles.lkrOutput, { backgroundColor: isDark ? 'rgba(0,140,149,0.1)' : '#E0F2F1', color: isDark ? '#FFF' : '#111', borderColor: isDark ? 'rgba(0,140,149,0.3)' : Colors.teal }]}>
                    {lkrConverted}
                  </Text>
                </View>
              </View>
            </View>

            {/* Weather */}
            <View style={[styles.card, { backgroundColor: isDark ? '#141414' : '#FFFFFF', borderColor: isDark ? '#2A2A2A' : '#E5E7EB', width: isDesktop ? '48%' : '100%' }]}>
              <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#111' }]}>{t.weatherTitle || 'Weather Forecast'}</Text>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                {weatherSites.map((w, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.weatherChip, { backgroundColor: selectedWeatherIndex === idx ? Colors.teal : (isDark ? '#1A1A1A' : '#F9FAFB'), borderColor: isDark ? '#333' : '#E5E7EB' }]}
                    onPress={() => setSelectedWeatherIndex(idx)}
                  >
                    <Text style={[styles.weatherChipText, { color: selectedWeatherIndex === idx ? '#FFF' : (isDark ? '#AAA' : '#666') }]}>
                      {w.site}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={[styles.weatherStatusBox, { backgroundColor: isDark ? '#0A0A0A' : '#F9FAFB', borderColor: isDark ? '#222' : '#E5E7EB' }]}>
                <View style={styles.weatherMainRow}>
                  <Text style={styles.tempText}>{weatherSites[selectedWeatherIndex].temp}</Text>
                  <View>
                    <Text style={[styles.condText, { color: isDark ? '#FFF' : '#111' }]}>{weatherSites[selectedWeatherIndex].condition}</Text>
                    <Text style={[styles.rainText, { color: isDark ? '#AAA' : '#666' }]}>{t.rainProbability || 'Rain:'} {weatherSites[selectedWeatherIndex].rainPercent}%</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Cultural Rules */}
            <View style={[styles.card, { backgroundColor: isDark ? '#141414' : '#FFFFFF', borderColor: isDark ? '#2A2A2A' : '#E5E7EB', width: isDesktop ? '48%' : '100%' }]}>
              <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#111' }]}>{t.culturalRulesTitle || 'Cultural Etiquette'}</Text>
              {[
                { icon: '👟', title: t.removeFootwearTitle || 'Footwear', desc: t.removeFootwearDesc || 'Remove before entering temples.' },
                { icon: '👕', title: t.coverageTitle || 'Clothing', desc: t.coverageDesc || 'Cover shoulders and knees.' },
                { icon: '📸', title: t.photographyTitle || 'Photography', desc: t.photographyDesc || 'No selfies with Buddha statues.' },
              ].map((rule, i) => (
                <View key={i} style={styles.ruleItem}>
                  <Text style={styles.ruleIcon}>{rule.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.ruleTitle, { color: isDark ? '#FFF' : '#111' }]}>{rule.title}</Text>
                    <Text style={[styles.ruleDesc, { color: isDark ? '#AAA' : '#666' }]}>{rule.desc}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Festivals */}
            <View style={[styles.card, { backgroundColor: isDark ? '#141414' : '#FFFFFF', borderColor: isDark ? '#2A2A2A' : '#E5E7EB', width: isDesktop ? '48%' : '100%' }]}>
              <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#111' }]}>{t.festivalsTitle || 'Key Festivals'}</Text>
              <View style={[styles.festivalBox, { backgroundColor: isDark ? 'rgba(245, 130, 32, 0.1)' : '#FFF3E0', borderColor: isDark ? 'rgba(245, 130, 32, 0.2)' : '#FFE0B2' }]}>
                <Text style={styles.festivalTitle}>{t.peraheraTitle || 'Kandy Perahera'}</Text>
                <Text style={[styles.festivalDesc, { color: isDark ? '#CCC' : '#666' }]}>{t.peraheraDesc || 'Grand festival in August.'}</Text>
              </View>
              <View style={[styles.festivalBox, { backgroundColor: isDark ? 'rgba(245, 130, 32, 0.1)' : '#FFF3E0', borderColor: isDark ? 'rgba(245, 130, 32, 0.2)' : '#FFE0B2' }]}>
                <Text style={styles.festivalTitle}>{t.posonTitle || 'Poson Poya'}</Text>
                <Text style={[styles.festivalDesc, { color: isDark ? '#CCC' : '#666' }]}>{t.posonDesc || 'Buddhist festival in June.'}</Text>
              </View>
            </View>

            {/* Scam Protection */}
            <View style={[styles.card, { backgroundColor: isDark ? '#141414' : '#FFFFFF', borderColor: isDark ? '#2A2A2A' : '#E5E7EB', width: '100%' }]}>
              <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#111' }]}>{t.scamAlerts || 'Tourist Protection & Rates'}</Text>
              
              <View style={[styles.actionRow, isDesktop ? { flexDirection: 'row' } : { flexDirection: 'column' }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.ticketSectionTitle, { color: isDark ? '#AAA' : '#666' }]}>{t.officialTicketRates || 'Official Monument Tickets'}</Text>
                  {translatedSites.map((site) => (
                    <View key={site.id} style={[styles.ticketRow, { borderBottomColor: isDark ? '#222' : '#E5E7EB' }]}>
                      <Text style={[styles.ticketSiteName, { color: isDark ? '#DDD' : '#444' }]}>{site.name}</Text>
                      <Text style={[styles.ticketPrice, { color: Colors.teal }]}>${site.ticket_price_usd} / {site.ticket_price_lkr} LKR</Text>
                    </View>
                  ))}
                </View>

                <View style={{ flex: 1 }}>
                  <View style={[styles.scamBox, { backgroundColor: isDark ? 'rgba(220, 38, 38, 0.1)' : '#FEF2F2', borderColor: isDark ? 'rgba(220, 38, 38, 0.3)' : '#FECACA' }]}>
                    <Text style={styles.scamTitle}>{t.scamWarnings || 'Common Scams'}</Text>
                    <Text style={[styles.scamText, { color: isDark ? '#CCC' : '#666' }]}>• {t.scamGuide1 || 'Beware of unofficial guides.'}</Text>
                    <Text style={[styles.scamText, { color: isDark ? '#CCC' : '#666' }]}>• {t.scamGuide2 || 'Always use meter in Tuk Tuks.'}</Text>
                    <Text style={[styles.scamText, { color: isDark ? '#CCC' : '#666' }]}>• {t.scamGuide3 || 'Buy tickets only at counters.'}</Text>
                  </View>
                  <TouchableOpacity style={styles.policeCallBtn} onPress={() => Linking.openURL('tel:1912')}>
                    <Text style={styles.policeCallBtnText}>📞 {t.touristPolice || 'Tourist Police (1912)'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

            </View>

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
    backgroundColor: 'rgba(0, 140, 149, 0.8)',
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
  mainContent: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: -40,
    marginTop: -40,
    paddingBottom: 60,
    zIndex: 10,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    borderRadius: 24,
    padding: Platform.OS === 'web' ? 32 : 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
  },
  rateSubtitle: {
    fontSize: 14,
    marginBottom: 20,
    fontWeight: '600',
  },
  calcRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  inputBox: { flex: 1 },
  inputLabel: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  currencyInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontWeight: '900',
    borderWidth: 1,
  },
  equalsSign: {
    fontSize: 24,
    fontWeight: '900',
    marginTop: 24,
  },
  lkrOutput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    borderWidth: 1,
  },
  weatherChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 10,
    borderWidth: 1,
  },
  weatherChipText: {
    fontSize: 13,
    fontWeight: '800',
  },
  weatherStatusBox: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
  },
  weatherMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  tempText: {
    fontSize: 48,
    fontWeight: '900',
    color: Colors.orange,
  },
  condText: {
    fontSize: 16,
    fontWeight: '800',
  },
  rainText: {
    fontSize: 14,
    marginTop: 4,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginTop: 20,
  },
  ruleIcon: { fontSize: 28 },
  ruleTitle: { fontSize: 16, fontWeight: '900' },
  ruleDesc: { fontSize: 14, marginTop: 4, lineHeight: 20 },
  festivalBox: {
    padding: 20,
    borderRadius: 16,
    marginTop: 16,
    borderWidth: 1,
  },
  festivalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.orange,
  },
  festivalDesc: {
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
  actionRow: {
    gap: 24,
    width: '100%',
    marginTop: 10,
  },
  ticketSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  ticketSiteName: {
    fontSize: 15,
    fontWeight: '600',
  },
  ticketPrice: {
    fontSize: 15,
    fontWeight: '900',
  },
  scamBox: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  scamTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#DC2626',
    marginBottom: 12,
  },
  scamText: {
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
  policeCallBtn: {
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  policeCallBtnText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 15,
  },
});
