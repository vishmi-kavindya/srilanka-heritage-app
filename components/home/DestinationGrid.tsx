import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DESTINATIONS } from '../../constants/homeData';

const IS_WEB = Platform.OS === 'web';

interface DestinationGridProps {
  textMain: string;
  textSub: string;
  switchHero: (idx: number) => void;
}

export const DestinationGrid = ({ textMain, textSub, switchHero }: DestinationGridProps) => {
  const items = DESTINATIONS.slice(0, 10);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const animatedValues = useRef(items.map(() => new Animated.Value(0.96))).current;

  useEffect(() => {
    items.forEach((_, index) => {
      const isActive = index === selectedIndex;
      const isHovered = index === hoveredIndex;
      const target = isActive ? 1.08 : isHovered ? 1.02 : 0.96;

      Animated.spring(animatedValues[index], {
        toValue: target,
        friction: 8,
        tension: 70,
        useNativeDriver: true,
      }).start();
    });
  }, [animatedValues, hoveredIndex, items, selectedIndex]);

  const handleCardPress = (index: number) => {
    setSelectedIndex(index);
    switchHero(index);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.pageIntro}>
        <Text style={[styles.pageIntroHeading, { color: textMain }]}>Popular Now</Text>
      </View>

      <View style={styles.carouselWrap}>
        <TouchableOpacity style={styles.sideButton} activeOpacity={0.8}>
          <Text style={styles.sideButtonText}>{'<'}</Text>
        </TouchableOpacity>

        <View style={styles.destGrid}>
          {items.map((d, i) => {
            const isActive = i === selectedIndex;
            const isHovered = i === hoveredIndex;
            const scale = animatedValues[i];
            const translateY = scale.interpolate({
              inputRange: [0.96, 1.02, 1.08],
              outputRange: [10, 4, 0],
            });
            const translateX = isActive ? 0 : isHovered ? 1 : 0;
            const opacity = scale.interpolate({
              inputRange: [0.96, 1.02, 1.08],
              outputRange: [0.9, 0.96, 1],
            });

            const hoverHandlers = IS_WEB
              ? {
                  onHoverIn: () => setHoveredIndex(i),
                  onHoverOut: () => setHoveredIndex(null),
                }
              : {};

            return (
              <Animated.View
                key={d.id}
                style={[
                  styles.archCardWrap,
                  {
                    transform: [{ scale }, { translateY }, { translateX }],
                    opacity,
                    shadowOpacity: isActive || isHovered ? 0.22 : 0.14,
                  },
                ]}
              >
                <TouchableOpacity
                  {...hoverHandlers}
                  style={[styles.archCard, (isActive || isHovered) && styles.archCardActive]}
                  onPress={() => handleCardPress(i)}
                  onPressIn={() => setHoveredIndex(i)}
                  onPressOut={() => setHoveredIndex(null)}
                  activeOpacity={0.9}
                >
                  <Image source={d.image} style={styles.archImg} resizeMode="cover" />

                  <View style={styles.overlayLayer} pointerEvents="none">
                    <Text style={styles.numberText}>{i + 1}</Text>
                    <Text style={styles.titleText}>{d.title}</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <TouchableOpacity style={styles.sideButtonRight} activeOpacity={0.8}>
          <Text style={styles.sideButtonText}>{'>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#070707',
    paddingBottom: 24,
  },
  pageIntro: {
    paddingHorizontal: 32,
    paddingTop: 4,
    marginBottom: 12,
  },
  pageIntroHeading: {
    fontSize: IS_WEB ? 30 : 24,
    fontWeight: '900',
    letterSpacing: -2.2,
    lineHeight: IS_WEB ? 74 : 48,
    textAlign: 'left',
  },
  carouselWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  destGrid: {
    flexDirection: 'row',
    flex: 1,
    gap: 18,
    alignItems: 'flex-end',
    overflow: 'visible',
  },
  archCardWrap: {
    shadowColor: '#000',
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  archCard: {
    width: IS_WEB ? 180 : 150,
    height: IS_WEB ? 280 : 230,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#111',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    opacity: 1,
  },
  archCardActive: {
    shadowColor: '#ff7a18',
    shadowOpacity: 0.2,
    shadowRadius: 18,
    borderColor: 'rgba(255,122,24,0.45)',
  },
  archImg: {
    width: '100%',
    height: '100%',
  },
  overlayLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 14,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  numberText: {
    color: '#F5F5F5',
    fontSize: IS_WEB ? 58 : 44,
    fontWeight: '900',
    lineHeight: 58,
    letterSpacing: -2,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  titleText: {
    color: '#F5F5F5',
    fontSize: 15,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    maxWidth: 90,
    textAlign: 'right',
  },
  sideButton: {
    width: 32,
    height: 120,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  sideButtonRight: {
    width: 32,
    height: 120,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sideButtonText: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '300',
    lineHeight: 38,
  },
});
