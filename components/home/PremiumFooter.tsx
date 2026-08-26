import React from 'react';
import { View, Text, TouchableOpacity, Animated, Platform, StyleSheet } from 'react-native';

const IS_WEB = Platform.OS === 'web';

interface PremiumFooterProps {
  dest: any;
  kenBurns: Animated.Value;
}

export const PremiumFooter = ({ dest, kenBurns }: PremiumFooterProps) => {
  return (
    <View style={styles.footerBackground}>
      <Animated.Image
        source={dest.image}
        style={[StyleSheet.absoluteFill, { transform: [{ scale: kenBurns }] }]}
        resizeMode="cover"
      />
      <View style={styles.footerOverlay}>
        <View style={styles.footerContainer}>

          {/* Newsletter / Call to Action */}
          <View style={styles.footerCta}>
            <Text style={styles.footerCtaTitle}>BEGIN YOUR JOURNEY</Text>
            <Text style={styles.footerCtaSub}>Subscribe to our newsletter for exclusive travel secrets and hidden gems of Sri Lanka.</Text>
            <View style={[styles.footerCtaInputRow, IS_WEB && styles.footerCtaInputRowWeb]}>
              <View style={styles.footerInputWrapper}>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>Enter your email address...</Text>
              </View>
              <TouchableOpacity style={styles.footerSubscribeBtn}>
                <Text style={styles.footerSubscribeText}>SUBSCRIBE</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.footerContent, IS_WEB && styles.footerContentWeb]}>
            {/* Left Brand Area */}
            <View style={styles.footerBrand}>
              <Text style={styles.footerBrandText}>SRI LANKA{'\n'}HERITAGE</Text>
              <Text style={styles.footerTagline}>Curated journeys through the pearl of the Indian Ocean. Discover ancient wonders, vibrant cultures, and untouched landscapes.</Text>
            </View>

            {/* Quick Links */}
            <View style={styles.footerLinksGrid}>
              <View style={styles.footerLinksColumn}>
                <Text style={styles.footerLinkHeader}>EXPLORE</Text>
                <TouchableOpacity><Text style={styles.footerLink}>Destinations</Text></TouchableOpacity>
                <TouchableOpacity><Text style={styles.footerLink}>Experiences</Text></TouchableOpacity>
                <TouchableOpacity><Text style={styles.footerLink}>Heritage Sites</Text></TouchableOpacity>
              </View>
              <View style={styles.footerLinksColumn}>
                <Text style={styles.footerLinkHeader}>PLAN</Text>
                <TouchableOpacity><Text style={styles.footerLink}>Itineraries</Text></TouchableOpacity>
                <TouchableOpacity><Text style={styles.footerLink}>Travel Guide</Text></TouchableOpacity>
                <TouchableOpacity><Text style={styles.footerLink}>Interactive Map</Text></TouchableOpacity>
              </View>
              <View style={styles.footerLinksColumn}>
                <Text style={styles.footerLinkHeader}>CONNECT</Text>
                <TouchableOpacity><Text style={styles.footerLink}>Instagram</Text></TouchableOpacity>
                <TouchableOpacity><Text style={styles.footerLink}>Facebook</Text></TouchableOpacity>
                <TouchableOpacity><Text style={styles.footerLink}>Twitter</Text></TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.footerBottom}>
            <Text style={styles.footerCopyright}>© 2026 Sri Lanka Heritage. All Rights Reserved.</Text>
            <View style={styles.footerLegal}>
              <TouchableOpacity><Text style={styles.footerLegalLink}>Privacy Policy</Text></TouchableOpacity>
              <TouchableOpacity><Text style={styles.footerLegalLink}>Terms of Service</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerBackground: {
    width: '100%',
    marginTop: 60,
    overflow: 'hidden',
    position: 'relative',
  },
  footerOverlay: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)', // Deep slate overlay
    width: '100%',
    height: '100%',
  },
  footerContainer: {
    paddingHorizontal: IS_WEB ? 60 : 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  footerCta: {
    alignItems: 'center',
    marginBottom: 80,
  },
  footerCtaTitle: {
    color: '#FFF',
    fontSize: IS_WEB ? 32 : 24,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 16,
    textAlign: 'center',
  },
  footerCtaSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    maxWidth: 600,
  },
  footerCtaInputRow: {
    flexDirection: 'column',
    width: '100%',
    maxWidth: 500,
    gap: 16,
  },
  footerCtaInputRowWeb: {
    flexDirection: 'row',
  },
  footerInputWrapper: {
    flex: 1,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  footerSubscribeBtn: {
    height: 50,
    backgroundColor: '#00B496',
    borderRadius: 25,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerSubscribeText: {
    color: '#FFF',
    fontWeight: '800',
    letterSpacing: 1,
  },
  footerContent: {
    flexDirection: 'column',
    gap: 60,
    paddingBottom: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  footerContentWeb: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerBrand: {
    flex: 1,
    maxWidth: IS_WEB ? 400 : '100%',
  },
  footerBrandText: {
    color: '#FFFFFF',
    fontSize: IS_WEB ? 42 : 32,
    fontWeight: '900',
    letterSpacing: 2,
    lineHeight: IS_WEB ? 46 : 36,
    marginBottom: 16,
  },
  footerTagline: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    lineHeight: 24,
  },
  footerLinksGrid: {
    flexDirection: 'row',
    gap: IS_WEB ? 80 : 40,
    flexWrap: 'wrap',
  },
  footerLinksColumn: {
    gap: 16,
  },
  footerLinkHeader: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
  },
  footerLink: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  footerBottom: {
    flexDirection: IS_WEB ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: IS_WEB ? 'center' : 'flex-start',
    paddingTop: 40,
    gap: 20,
  },
  footerCopyright: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
  },
  footerLegal: {
    flexDirection: 'row',
    gap: 24,
  },
  footerLegalLink: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
  },
});
