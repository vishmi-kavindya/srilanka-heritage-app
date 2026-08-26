import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Platform, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const IS_WEB = Platform.OS === 'web';

interface KeyExperiencesProps {
  textMain: string;
}

export const KeyExperiences = ({ textMain }: KeyExperiencesProps) => {
  const router = useRouter();

  return (
    <View style={styles.quickNavSection}>
      <Text style={[styles.pageIntroOverline, { color: '#E8612A' }]}>EXPLORE THE APP</Text>
      <Text style={[styles.pageIntroHeading, { color: textMain }]}>Key Experiences</Text>
      <View style={[styles.quickNavGrid, IS_WEB && styles.quickNavGridWeb]}>
        {[
          { icon: '🗺️', label: 'Heritage Map', sub: 'UNESCO sites & routes', route: '/map', img: require('../../assets/images/beach.AVIF') },
          { icon: '✨', label: 'AI Assistant', sub: 'Scan & identify monuments', route: '/ai', img: require('../../assets/images/temple.jpg') },
          { icon: '🚕', label: 'Transport Hub', sub: 'PickMe, buses, trains', route: '/transport', img: require('../../assets/images/nine.jpg') },
          { icon: '🛡️', label: 'Safety & Tools', sub: 'Currency, weather, tips', route: '/utilities', img: require('../../assets/images/coco.AVIF') },
        ].map((item, i) => (
          <TouchableOpacity key={i} style={styles.quickCardWrapper} onPress={() => router.push(item.route as any)} activeOpacity={0.85}>
            <ImageBackground source={item.img} style={styles.quickCardImage} imageStyle={{ borderRadius: 12 }}>
              <View style={styles.quickCardOverlay}>
                <Text style={styles.quickCardIcon}>{item.icon}</Text>
                <View style={{ marginTop: 'auto' }}>
                  <Text style={styles.quickCardLabel}>{item.label}</Text>
                  <Text style={styles.quickCardSub}>{item.sub}</Text>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  quickNavSection: {
    paddingHorizontal: IS_WEB ? 60 : 24,
    paddingTop: 60,
  },
  pageIntroOverline: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2.5,
    marginBottom: 12,
    textAlign: IS_WEB ? 'center' : 'left',
  },
  pageIntroHeading: {
    fontSize: IS_WEB ? 56 : 38,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: IS_WEB ? 62 : 44,
    marginBottom: 16,
    textAlign: IS_WEB ? 'center' : 'left',
  },
  quickNavGrid: { flexDirection: 'column', gap: 20, marginTop: 32 },
  quickNavGridWeb: { flexDirection: 'row', flexWrap: 'wrap' },
  quickCardWrapper: {
    flex: IS_WEB ? 1 : undefined,
    minWidth: IS_WEB ? 220 : '100%',
    height: 180,
    marginRight: IS_WEB ? 20 : 0,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  quickCardImage: {
    width: '100%',
    height: '100%',
  },
  quickCardOverlay: {
    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    padding: 20,
  },
  quickCardIcon: { fontSize: 32, marginBottom: 8 },
  quickCardLabel: { color: '#FFFFFF', fontSize: 18, fontWeight: '900', marginBottom: 4, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  quickCardSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
});
