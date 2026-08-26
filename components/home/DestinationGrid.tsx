import React from 'react';
import { View, Text, TouchableOpacity, Image, Platform, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { DESTINATIONS } from '../../constants/homeData';

const IS_WEB = Platform.OS === 'web';

interface DestinationGridProps {
  textMain: string;
  textSub: string;
  switchHero: (idx: number) => void;
}

export const DestinationGrid = ({ textMain, textSub, switchHero }: DestinationGridProps) => {
  const router = useRouter();

  return (
    <>
      <View style={[styles.pageIntro, IS_WEB && styles.pageIntroWeb]}>
        <Text style={[styles.pageIntroOverline, { color: '#E8612A' }]}>DESTINATION GUIDE</Text>
        <Text style={[styles.pageIntroHeading, { color: textMain }]}>Discover Sri Lanka</Text>
        <Text style={[styles.pageIntroBody, { color: textSub }]}>
          A meeting place of ancient civilisations and pristine nature. Eight UNESCO World Heritage Sites and endless beaches await.
        </Text>
      </View>

      <View style={[styles.destGrid, IS_WEB && styles.destGridWeb]}>
        {DESTINATIONS.slice(0, IS_WEB ? 6 : 4).map((d, i) => (
          <TouchableOpacity key={d.id} style={styles.archCard} onPress={() => switchHero(i)} activeOpacity={0.88}>
            <View style={styles.archImgWrapper}>
              <Image source={d.image} style={styles.archImg} resizeMode="cover" />
              <View style={styles.archRatingBadge}>
                <Text style={styles.archRatingText}>★ {d.rating}</Text>
              </View>
            </View>
            <View style={styles.archCardBody}>
              <Text style={[styles.archCat, { color: '#E8612A' }]}>{d.cat.toUpperCase()}</Text>
              <Text style={[styles.archTitle, { color: textMain }]} numberOfLines={2}>{d.title}</Text>
              <Text style={[styles.archSub, { color: textSub }]}>{d.sub}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.ctaBanner}>
        <View style={[styles.ctaBannerInner, IS_WEB && styles.ctaBannerInnerWeb]}>
          <View style={styles.ctaLeft}>
            <Text style={styles.ctaEyebrow}>START YOUR ADVENTURE</Text>
            <Text style={styles.ctaHeading}>Sri Lanka Awaits{IS_WEB ? ' You' : ''}</Text>
          </View>
          <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/map')} activeOpacity={0.85}>
            <Text style={styles.ctaBtnText}>EXPLORE THE MAP  →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  pageIntro: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 0,
  },
  pageIntroWeb: {
    paddingHorizontal: 60,
    paddingTop: 80,
    alignItems: 'center',
    textAlign: 'center' as any,
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
  pageIntroBody: {
    fontSize: 16,
    lineHeight: 26,
    maxWidth: IS_WEB ? 560 : 9999,
    textAlign: IS_WEB ? 'center' : 'left',
    alignSelf: IS_WEB ? 'center' : 'flex-start',
    marginBottom: 8,
  },
  destGrid: {
    paddingHorizontal: 24,
    paddingTop: 60,
    flexDirection: 'column',
    gap: 24,
  },
  destGridWeb: {
    paddingHorizontal: 60,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 28,
  },
  archCard: {
    flex: IS_WEB ? undefined : undefined,
    width: IS_WEB ? 'calc(33% - 20px)' as any : '100%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  archImgWrapper: {
    width: '100%',
    height: IS_WEB ? 240 : 200,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    overflow: 'hidden',
    position: 'relative',
  },
  archImg: {
    width: '100%',
    height: '100%',
  },
  archRatingBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#E8612A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  archRatingText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  archCardBody: {
    padding: 20,
    paddingTop: 16,
  },
  archCat: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 6,
  },
  archTitle: {
    fontSize: IS_WEB ? 17 : 16,
    fontWeight: '800',
    letterSpacing: 0.2,
    marginBottom: 6,
    lineHeight: 22,
  },
  archSub: {
    fontSize: 12,
    lineHeight: 18,
  },
  ctaBanner: {
    marginTop: 60,
    backgroundColor: '#E8612A',
  },
  ctaBannerInner: {
    paddingHorizontal: 24,
    paddingVertical: 48,
    gap: 24,
  },
  ctaBannerInnerWeb: {
    paddingHorizontal: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 40,
  },
  ctaLeft: { gap: 8 },
  ctaEyebrow: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2.5,
  },
  ctaHeading: {
    color: '#FFF',
    fontSize: IS_WEB ? 40 : 30,
    fontWeight: '900',
    lineHeight: IS_WEB ? 44 : 36,
  },
  ctaBtn: {
    backgroundColor: '#FFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 6,
    alignSelf: IS_WEB ? 'center' : 'flex-start',
  },
  ctaBtnText: {
    color: '#E8612A',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
});
