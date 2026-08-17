import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking, Platform } from 'react-native';
import { HeritageSite } from '../constants/heritageData';
import { useAppTheme } from '../contexts/ThemeContext';
import { Colors, Shadow } from '../constants/theme';

export type CurrencyCode = 'USD' | 'LKR' | 'EUR' | 'GBP' | 'AUD' | 'INR' | 'JPY';

export const CURRENCY_RATES: Record<CurrencyCode, { symbol: string; rate: number; label: string }> = {
  USD: { symbol: '$', rate: 1.0, label: 'USD ($)' },
  LKR: { symbol: 'Rs. ', rate: 305.5, label: 'LKR (Rs.)' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.78, label: 'GBP (£)' },
  AUD: { symbol: 'A$', rate: 1.52, label: 'AUD ($)' },
  INR: { symbol: '₹', rate: 83.5, label: 'INR (₹)' },
  JPY: { symbol: '¥', rate: 155.0, label: 'JPY (¥)' },
};

export function formatTicketPrice(priceUsd: number, currency: CurrencyCode): string {
  if (priceUsd === 0) return 'FREE Admission 🎉';
  const info = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const converted = priceUsd * info.rate;
  
  if (currency === 'LKR' || currency === 'JPY' || currency === 'INR') {
    return `${info.symbol}${Math.round(converted).toLocaleString()} ${currency}`;
  }
  return `${info.symbol}${converted.toFixed(2)} ${currency}`;
}

interface HeritageSiteCardProps {
  site: HeritageSite;
  currency: CurrencyCode;
  onSelectMap?: (site: HeritageSite) => void;
}

export default function HeritageSiteCard({ site, currency, onSelectMap }: HeritageSiteCardProps) {
  const { colors, isDark } = useAppTheme();
  const [showRules, setShowRules] = useState(false);
  const [showScams, setShowScams] = useState(false);

  const formattedPrice = formatTicketPrice(site.ticket_price_usd, currency);

  const openGoogleMaps = () => {
    const url = site.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${site.latitude},${site.longitude}`;
    Linking.openURL(url).catch((err) => console.log('Failed to open Maps:', err));
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBg,
          borderColor: colors.cardBorder,
        },
        Platform.OS === 'web' && (styles.webHoverCard as any),
      ]}
    >
      {/* Top Badge Strip: UNESCO + District + Category */}
      <View style={styles.topBadgeRow}>
        {site.is_unesco ? (
          <View style={styles.unescoBadge}>
            <Text style={styles.unescoBadgeIcon}>🏛️</Text>
            <Text style={styles.unescoBadgeText}>UNESCO WORLD HERITAGE</Text>
          </View>
        ) : (
          <View style={[styles.categoryBadge, { backgroundColor: colors.softTeal }]}>
            <Text style={[styles.categoryBadgeText, { color: colors.textSecondary }]}>{site.category}</Text>
          </View>
        )}

        <View style={[styles.districtBadge, { backgroundColor: colors.softTeal }]}>
          <Text style={[styles.districtBadgeText, { color: colors.textSecondary }]}>📍 {site.district}</Text>
        </View>
      </View>

      {/* Site Name */}
      <Text style={[styles.siteName, { color: colors.textPrimary }]}>{site.name}</Text>

      {/* Historical Story / Summary */}
      <Text style={[styles.storyText, { color: colors.textSecondary }]}>{site.summary_story}</Text>

      {/* Ticket Price & Opening Hours Meta Row */}
      <View style={[styles.metaBox, { backgroundColor: colors.softTeal, borderColor: colors.cardBorder }]}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>🎟️ TICKET PRICE ({currency}):</Text>
          <Text style={[styles.priceValue, { color: site.ticket_price_usd === 0 ? Colors.secondary : Colors.accent }]}>
            {formattedPrice}
          </Text>
        </View>

        <View style={styles.metaDivider} />

        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>⏰ OPENING HOURS:</Text>
          <Text style={[styles.metaValue, { color: colors.textPrimary }]}>{site.opening_hours}</Text>
        </View>
      </View>

      {/* Expandable Dress Code & Cultural Rules */}
      <TouchableOpacity
        style={[styles.accordionHeader, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,140,149,0.08)' }]}
        onPress={() => setShowRules(!showRules)}
        activeOpacity={0.8}
      >
        <Text style={[styles.accordionTitle, { color: colors.textPrimary }]}>
          👗 Dress Code & Cultural Etiquette {showRules ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {showRules && (
        <View style={[styles.accordionBody, { backgroundColor: colors.inputBg }]}>
          {site.dress_code_rules.map((rule, idx) => (
            <View key={idx} style={styles.ruleBulletRow}>
              <Text style={styles.ruleBullet}>•</Text>
              <Text style={[styles.ruleText, { color: colors.textSecondary }]}>{rule}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Expandable Scam Warnings */}
      {site.scam_warning_notes ? (
        <>
          <TouchableOpacity
            style={[styles.accordionHeader, styles.scamHeader]}
            onPress={() => setShowScams(!showScams)}
            activeOpacity={0.8}
          >
            <Text style={styles.scamHeaderTitle}>
              ⚠️ Tourist Safety & Scam Alert {showScams ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>

          {showScams && (
            <View style={[styles.accordionBody, styles.scamBody]}>
              <Text style={styles.scamWarningText}>{site.scam_warning_notes}</Text>
            </View>
          )}
        </>
      ) : null}

      {/* Action Buttons: Google Maps Link + Interactive Map */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.googleMapsBtn}
          onPress={openGoogleMaps}
          activeOpacity={0.85}
        >
          <Text style={styles.googleMapsBtnText}>🗺️ Open Google Maps</Text>
        </TouchableOpacity>

        {onSelectMap && (
          <TouchableOpacity
            style={[styles.interactiveMapBtn, { backgroundColor: colors.softTeal, borderColor: colors.cardBorder }]}
            onPress={() => onSelectMap(site)}
            activeOpacity={0.85}
          >
            <Text style={[styles.interactiveMapBtnText, { color: colors.textPrimary }]}>🧭 Explore Route</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    ...Shadow.card,
  },
  webHoverCard: Platform.OS === 'web' ? ({
    transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease',
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-6px) scale(1.015)',
      boxShadow: '0 16px 32px rgba(0, 0, 0, 0.18)',
    },
  } as any) : {},

  topBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  unescoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(245, 130, 32, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(245, 130, 32, 0.4)',
  },
  unescoBadgeIcon: {
    fontSize: 12,
  },
  unescoBadgeText: {
    color: Colors.accent,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  districtBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  districtBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  siteName: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
    lineHeight: 26,
  },
  storyText: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },

  metaBox: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flex: 1,
  },
  metaDivider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 12,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '700',
  },

  accordionHeader: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 6,
  },
  accordionTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  accordionBody: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  ruleBulletRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  ruleBullet: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  ruleText: {
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },

  scamHeader: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
  },
  scamHeaderTitle: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '800',
  },
  scamBody: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
  },
  scamWarningText: {
    color: '#B91C1C',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
  },

  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  googleMapsBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleMapsBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  interactiveMapBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  interactiveMapBtnText: {
    fontWeight: '700',
    fontSize: 13,
  },
});
