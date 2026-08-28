import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { getTranslatedHeritageSites } from '../../constants/heritageData';
import { getTranslation } from '../../constants/i18n';
import { Colors } from '../../constants/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppTheme } from '../../contexts/ThemeContext';

export default function UtilitiesSafetyScreen() {
  const { lang } = useLanguage();
  const { isDark, colors } = useAppTheme();
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

  const pageBg = isDark ? '#000A1A' : '#EEF6FF';

  return (
    <ScrollView style={[styles.container, { backgroundColor: pageBg }]} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* 🛡️ Immersive Hero Header */}
      <LinearGradient
        colors={['#001A38', '#003268', '#004E99', pageBg]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.heroHeader}
      >
        {/* Decorative Glow Orbs */}
        <View style={[styles.glowOrb, { top: -50, right: 0, backgroundColor: 'rgba(0,140,149,0.3)', width: 160, height: 160 }]} />
        <View style={[styles.glowOrb, { top: 20, left: -20, backgroundColor: 'rgba(30,120,220,0.2)', width: 100, height: 100 }]} />
        <View style={[styles.glowOrb, { bottom: -15, right: 100, backgroundColor: 'rgba(0,78,153,0.25)', width: 80, height: 80 }]} />

        <View style={styles.heroHeaderContent}>
          <View style={styles.heroBadgeRow}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>🛡️ SAFETY & TOOLS</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>{t.utilitiesTitle}</Text>
          <Text style={styles.heroSubtitle}>{t.utilitiesSub}</Text>
        </View>
      </LinearGradient>

      {/* Currency Converter */}
      <View style={[styles.sectionCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
        <Text style={[styles.cardHeader, { color: colors.textPrimary }]}>{t.currencyTitle}</Text>
        <Text style={[styles.rateSubtitle, { color: colors.textSecondary }]}>{t.currentRate} {exchangeRateLkr} LKR</Text>
        <View style={styles.calcRow}>
          <View style={styles.inputBox}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>USD ($):</Text>
            <TextInput
              style={[styles.currencyInput, { backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.cardBorder }]}
              keyboardType="numeric"
              value={usdAmount}
              onChangeText={setUsdAmount}
            />
          </View>
          <Text style={[styles.equalsSign, { color: colors.textSecondary }]}>=</Text>
          <View style={styles.outputBox}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>LKR (Rs.):</Text>
            <Text style={[styles.lkrOutput, { backgroundColor: isDark ? 'rgba(0, 140, 149, 0.25)' : 'rgba(0, 140, 149, 0.15)', color: colors.textPrimary }]}>{lkrConverted} LKR</Text>
          </View>
        </View>
      </View>

      {/* Weather */}
      <View style={[styles.sectionCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
        <Text style={[styles.cardHeader, { color: colors.textPrimary }]}>{t.weatherTitle}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          {weatherSites.map((w, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.weatherChip, { backgroundColor: colors.softTeal, borderColor: colors.cardBorder }, selectedWeatherIndex === idx && styles.activeWeatherChip]}
              onPress={() => setSelectedWeatherIndex(idx)}
            >
              <Text style={[styles.weatherChipText, { color: colors.textSecondary }, selectedWeatherIndex === idx && styles.activeWeatherText]}>
                {w.site}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={[styles.weatherStatusBox, { backgroundColor: colors.softTeal }]}>
          <View style={styles.weatherMainRow}>
            <Text style={styles.tempText}>{weatherSites[selectedWeatherIndex].temp}</Text>
            <View>
              <Text style={[styles.condText, { color: colors.textPrimary }]}>{weatherSites[selectedWeatherIndex].condition}</Text>
              <Text style={[styles.rainText, { color: colors.textSecondary }]}>{t.rainProbability} {weatherSites[selectedWeatherIndex].rainPercent}%</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Cultural Rules */}
      <View style={[styles.sectionCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
        <Text style={[styles.cardHeader, { color: colors.textPrimary }]}>{t.culturalRulesTitle}</Text>
        <View style={styles.ruleItem}>
          <Text style={styles.ruleIcon}>👟</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.ruleTitle, { color: colors.textPrimary }]}>{t.removeFootwearTitle}</Text>
            <Text style={[styles.ruleDesc, { color: colors.textSecondary }]}>{t.removeFootwearDesc}</Text>
          </View>
        </View>
        <View style={styles.ruleItem}>
          <Text style={styles.ruleIcon}>👕</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.ruleTitle, { color: colors.textPrimary }]}>{t.coverageTitle}</Text>
            <Text style={[styles.ruleDesc, { color: colors.textSecondary }]}>{t.coverageDesc}</Text>
          </View>
        </View>
        <View style={styles.ruleItem}>
          <Text style={styles.ruleIcon}>📸</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.ruleTitle, { color: colors.textPrimary }]}>{t.photographyTitle}</Text>
            <Text style={[styles.ruleDesc, { color: colors.textSecondary }]}>{t.photographyDesc}</Text>
          </View>
        </View>
      </View>

      {/* Festivals */}
      <View style={[styles.sectionCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
        <Text style={[styles.cardHeader, { color: colors.textPrimary }]}>{t.festivalsTitle}</Text>
        <View style={[styles.festivalBox, { backgroundColor: isDark ? 'rgba(245, 130, 32, 0.2)' : 'rgba(245, 130, 32, 0.12)' }]}>
          <Text style={styles.festivalTitle}>{t.peraheraTitle}</Text>
          <Text style={[styles.festivalDesc, { color: colors.textSecondary }]}>{t.peraheraDesc}</Text>
        </View>
        <View style={[styles.festivalBox, { backgroundColor: isDark ? 'rgba(245, 130, 32, 0.2)' : 'rgba(245, 130, 32, 0.12)' }]}>
          <Text style={styles.festivalTitle}>{t.posonTitle}</Text>
          <Text style={[styles.festivalDesc, { color: colors.textSecondary }]}>{t.posonDesc}</Text>
        </View>
      </View>

      {/* Scam Protection */}
      <View style={[styles.sectionCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
        <Text style={[styles.cardHeader, { color: colors.textPrimary }]}>{t.scamAlerts}</Text>
        <Text style={[styles.ticketSectionTitle, { color: colors.textSecondary }]}>{t.officialTicketRates}</Text>
        {translatedSites.map((site) => (
          <View key={site.id} style={[styles.ticketRow, { borderBottomColor: colors.cardBorder }]}>
            <Text style={[styles.ticketSiteName, { color: colors.textSecondary }]}>{site.name}:</Text>
            <Text style={styles.ticketPrice}>${site.ticket_price_usd} USD ({site.ticket_price_lkr} LKR)</Text>
          </View>
        ))}
        <View style={[styles.scamBox, { backgroundColor: isDark ? 'rgba(184, 93, 25, 0.25)' : 'rgba(184, 93, 25, 0.12)' }]}>
          <Text style={styles.scamTitle}>{t.scamWarnings}</Text>
          <Text style={[styles.scamText, { color: colors.textSecondary }]}>{t.scamGuide1}</Text>
          <Text style={[styles.scamText, { color: colors.textSecondary }]}>{t.scamGuide2}</Text>
          <Text style={[styles.scamText, { color: colors.textSecondary }]}>{t.scamGuide3}</Text>
        </View>
        <TouchableOpacity style={styles.policeCallBtn} onPress={() => Linking.openURL('tel:1912')}>
          <Text style={styles.policeCallBtnText}>📞 {t.touristPolice} (1912)</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },

  // 🛡️ Hero Header
  heroHeader: {
    paddingTop: Platform.OS === 'web' ? 70 : 60,
    paddingBottom: 28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  heroHeaderContent: {
    position: 'relative',
    zIndex: 1,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  heroBadge: {
    backgroundColor: 'rgba(0, 140, 149, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(0, 200, 220, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  heroBadgeText: {
    color: '#80EEFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'web' ? 32 : 26,
    fontWeight: '900',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    marginBottom: 6,
  },
  heroSubtitle: {
    color: 'rgba(170, 230, 255, 0.85)',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  glowOrb: {
    position: 'absolute',
    borderRadius: 200,
  },
  sectionCard: {
    borderRadius: 28,
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
  },
  cardHeader: { fontSize: 15, fontWeight: '800', marginBottom: 8 },
  rateSubtitle: { fontSize: 12, marginBottom: 14 },
  calcRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  inputBox: { flex: 1 },
  outputBox: { flex: 1 },
  inputLabel: { fontSize: 11, fontWeight: '700', marginBottom: 5, letterSpacing: 0.5 },
  currencyInput: {
    borderRadius: 12, padding: 12,
    fontSize: 18, fontWeight: '800', borderWidth: 1,
  },
  equalsSign: { fontSize: 22, fontWeight: '800', marginTop: 20 },
  lkrOutput: {
    borderRadius: 12, padding: 12,
    fontSize: 16, fontWeight: '800', textAlign: 'center',
    borderWidth: 1, borderColor: Colors.sapphire + '44',
  },
  weatherChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, marginRight: 8, borderWidth: 1 },
  activeWeatherChip: { backgroundColor: Colors.sapphire, borderColor: Colors.sapphire },
  weatherChipText: { fontSize: 12, fontWeight: '600' },
  activeWeatherText: { color: '#fff', fontWeight: '800' },
  weatherStatusBox: { padding: 16, borderRadius: 18, overflow: 'hidden' },
  weatherMainRow: { flexDirection: 'row', alignItems: 'center', gap: 18, marginBottom: 8 },
  tempText: { fontSize: 36, fontWeight: '800', color: Colors.saffron },
  condText: { fontSize: 14, fontWeight: '700' },
  rainText: { fontSize: 12, marginTop: 3 },
  ruleItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginTop: 12 },
  ruleIcon: { fontSize: 22 },
  ruleTitle: { fontSize: 14, fontWeight: '800' },
  ruleDesc: { fontSize: 12, marginTop: 3, lineHeight: 17 },
  festivalBox: {
    padding: 14, borderRadius: 14,
    marginTop: 10, borderWidth: 1, borderColor: Colors.saffron + '33',
  },
  festivalTitle: { fontSize: 14, fontWeight: '800', color: Colors.saffron },
  festivalDesc: { fontSize: 12, marginTop: 5, lineHeight: 17 },
  ticketSectionTitle: { fontSize: 13, fontWeight: '700', marginVertical: 8 },
  ticketRow: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8,
    borderBottomWidth: 1,
  },
  ticketSiteName: { fontSize: 13 },
  ticketPrice: { fontSize: 13, fontWeight: '800', color: Colors.sapphire },
  scamBox: {
    padding: 14, borderRadius: 14,
    marginTop: 14, borderWidth: 1, borderColor: Colors.temple + '44',
  },
  scamTitle: { fontSize: 13, fontWeight: '800', color: Colors.coral, marginBottom: 6 },
  scamText: { fontSize: 12, marginTop: 3, lineHeight: 17 },
  policeCallBtn: {
    backgroundColor: Colors.temple, paddingVertical: 14, borderRadius: 14,
    alignItems: 'center', marginTop: 16,
  },
  policeCallBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
});
