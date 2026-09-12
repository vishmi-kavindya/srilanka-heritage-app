import { useState } from 'react';
import { Animated, Dimensions, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';

const { height: SH } = Dimensions.get('window');
const IS_WEB = Platform.OS === 'web';

interface HeroSectionProps {
  dest: any;
  heroIdx: number;
  heroOpacity: Animated.Value;
  kenBurns: Animated.Value;
  switchHero: (idx: number) => void;
  onExplore: () => void;
}

export const HeroSection = ({ dest, heroIdx, heroOpacity, kenBurns, switchHero, onExplore }: HeroSectionProps) => {
  const [email, setEmail] = useState('');

  return (
    <Animated.View style={[styles.hero, { opacity: heroOpacity }]}>
      <Animated.Image
        source={dest.image}
        style={[styles.heroImg, { transform: [{ scale: kenBurns }] }]}
        resizeMode="cover"
      />
      {/* Gradient overlay */}
      <View style={styles.heroOverlay}>
        <View style={styles.heroSignup}>
          <Text style={styles.heroSignupText}>Ready to travel? Enter your email to create or restart your membership.</Text>
          <View style={styles.heroSignupRow}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email address"
              placeholderTextColor="rgba(255,255,255,0.7)"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.heroEmailInput}
            />
            <TouchableOpacity style={styles.heroGetStarted} onPress={onExplore} activeOpacity={0.85}>
              <Text style={styles.heroGetStartedText}>Get Started</Text>
              <Text style={styles.heroGetStartedArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.heroBottomCurve} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  hero: {
    height: IS_WEB ? SH * 0.99 : SH * 0.90,
    overflow: 'hidden',
    position: 'relative',
  },
  heroImg: {
    width: '100%', height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(8,6,4,0.45)',
    justifyContent: 'space-between',
    paddingHorizontal: IS_WEB ? 60 : 24,
    paddingTop: IS_WEB ? 24 : 18,
    paddingBottom: 28,
  },
  heroBottomCurve: {
    position: 'absolute',
    left: '-18%',
    bottom: -46,
    width: '136%',
    height: 88,
    backgroundColor: '#000000',
    borderTopWidth: 2,
    borderTopColor: '#e5005a',
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    shadowColor: '#162d86',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -12 },
    elevation: 8,
  },
  heroSignup: {
    position: 'absolute',
    left: IS_WEB ? 0 : 20,
    right: IS_WEB ? 0 : 20,
    bottom: 78,
    alignItems: 'center',
  },
  heroSignupText: {
    color: '#FFFFFF',
    fontSize: IS_WEB ? 20 : 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroSignupRow: {
    flexDirection: 'row',
    width: IS_WEB ? 650 : '100%',
    gap: 10,
  },
  heroEmailInput: {
    flex: 1,
    minHeight: 56,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    backgroundColor: 'rgba(20,20,20,0.72)',
    color: '#FFFFFF',
    fontSize: 17,
  },
  heroGetStarted: {
    minHeight: 56,
    paddingHorizontal: 22,
    borderRadius: 5,
    backgroundColor: Colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  heroGetStartedText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  heroGetStartedArrow: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '300',
    lineHeight: 34,
  },
  heroTag: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  heroTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.8,
  },
  heroBottom: { justifyContent: 'flex-end' },
  heroBottomInner: { maxWidth: 640 },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: IS_WEB ? 52 : 32,
    fontWeight: '900',
    letterSpacing: IS_WEB ? 2 : 1,
    lineHeight: IS_WEB ? 58 : 36,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginBottom: 6,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.4,
    marginBottom: 20,
  },
  heroActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  btnExplore: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 4,
  },
  btnExploreText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  btnAudio: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  btnAudioText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  heroChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  heroChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  heroChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  heroChipText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  heroChipTextActive: { color: '#FFFFFF' },
});
