import React from 'react';
import { View, Text, TouchableOpacity, Animated, Platform, StyleSheet, Dimensions, Alert } from 'react-native';
import { Colors } from '../../constants/theme';
import { DESTINATIONS } from '../../constants/homeData';

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
  return (
    <Animated.View style={[styles.hero, { opacity: heroOpacity }]}>
      <Animated.Image
        source={dest.image}
        style={[styles.heroImg, { transform: [{ scale: kenBurns }] }]}
        resizeMode="cover"
      />
      {/* Gradient overlay */}
      <View style={styles.heroOverlay}>
        {/* Small tag */}
        <View style={styles.heroTag}>
          <Text style={styles.heroTagText}>{dest.tag}</Text>
        </View>

        {/* Main title */}
        <View style={styles.heroBottom}>
          <View style={IS_WEB ? styles.heroBottomInner : {}}>
            <Text style={styles.heroTitle}>{dest.title}</Text>
            <Text style={styles.heroSub}>📍 {dest.sub}</Text>

            <View style={styles.heroActions}>
              <TouchableOpacity style={styles.btnExplore} onPress={onExplore} activeOpacity={0.85}>
                <Text style={styles.btnExploreText}>EXPLORE SITE  →</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnAudio} onPress={() => Alert.alert('🎧 Audio Guide', `Playing: ${dest.title}`)} activeOpacity={0.85}>
                <Text style={styles.btnAudioText}>🎧 Listen</Text>
              </TouchableOpacity>
            </View>

            {/* Destination chips */}
            <View style={styles.heroChips}>
              {DESTINATIONS.map((d, i) => (
                <TouchableOpacity
                  key={d.id}
                  style={[styles.heroChip, i === heroIdx && styles.heroChipActive]}
                  onPress={() => switchHero(i)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.heroChipText, i === heroIdx && styles.heroChipTextActive]}>
                    {d.title.split(' ').slice(0, 2).join(' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  hero: {
    height: IS_WEB ? SH * 0.88 : SH * 0.72,
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
