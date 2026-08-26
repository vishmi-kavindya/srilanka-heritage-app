import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground, Platform, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { THINGS_TO_DO } from '../../constants/homeData';

const IS_WEB = Platform.OS === 'web';

interface ThingsToDoSectionProps {
  textMain: string;
  textSub: string;
  cardBg: string;
  borderCol: string;
}

export const ThingsToDoSection = ({ textMain, textSub, cardBg, borderCol }: ThingsToDoSectionProps) => {
  const router = useRouter();
  const [activeThingId, setActiveThingId] = useState(1);

  return (
    <View style={styles.thingsToDoSection}>
      <View style={[styles.thingsToDoLayout, IS_WEB && styles.thingsToDoLayoutWeb]}>
        {/* Left Column */}
        <View style={styles.thingsToDoLeft}>
          <Text style={[styles.thingsToDoTitle, { color: textMain }]}>THINGS{'\n'}TO DO</Text>
          <Text style={[styles.thingsToDoSubtitle, { color: textMain }]}>IN SRI LANKA</Text>
          <Text style={[styles.thingsToDoBody, { color: textSub }]}>
            Sri Lanka is a land of endless discovery, with something to captivate every traveller. From sun-kissed beaches to misty hills, bustling markets to serene temples, every corner tells a story. We're here to help you explore it all, local insights, expert tips, the best food, hidden gems, and experiences that turn every day into your next unforgettable memory. No matter your pace or passion, there's always something new to see, taste, do, or experience.
          </Text>
        </View>

        {/* Center Map */}
        <View style={styles.thingsToDoCenter}>
          <ImageBackground
            source={require('../../assets/images/sri-lankan-travel-map.png')}
            style={styles.abstractMapContainer}
            imageStyle={{ resizeMode: 'contain' }}
          >
            {THINGS_TO_DO.map((item) => {
              const isActive = item.id === activeThingId;
              return (
                <View key={item.id} style={[styles.mapPinWrapper, { top: item.top as any, left: item.left as any }]}>
                  <TouchableOpacity
                    style={[styles.mapPin, isActive && styles.mapPinActive]}
                    onPress={() => setActiveThingId(item.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.mapPinInner, isActive && styles.mapPinInnerActive]} />
                  </TouchableOpacity>
                  <Text style={[styles.mapPinLabel, { color: textMain }, isActive && styles.mapPinLabelActive]}>
                    {item.name}
                  </Text>
                </View>
              );
            })}
          </ImageBackground>
        </View>

        {/* Right Card */}
        <View style={styles.thingsToDoRight}>
          {(() => {
            const activeThing = THINGS_TO_DO.find(t => t.id === activeThingId) || THINGS_TO_DO[0];
            return (
              <View style={[styles.thingCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
                <Image source={activeThing.img} style={styles.thingCardImg} resizeMode="cover" />
                <View style={styles.thingCardContent}>
                  <Text style={[styles.thingCardTitle, { color: textMain }]}>{activeThing.title}</Text>
                  <Text style={[styles.thingCardType, { color: textSub }]}>{activeThing.name}</Text>
                  <Text style={[styles.thingCardDesc, { color: textSub }]}>{activeThing.desc}</Text>

                  <TouchableOpacity style={styles.thingCardBtn} onPress={() => router.push('/map')} activeOpacity={0.8}>
                    <Text style={[styles.thingCardBtnText, { color: textMain }]}>➔</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })()}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  thingsToDoSection: {
    paddingHorizontal: IS_WEB ? 60 : 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  thingsToDoLayout: {
    flexDirection: 'column',
    gap: 40,
  },
  thingsToDoLayoutWeb: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 60,
  },
  thingsToDoLeft: {
    flex: 1,
    maxWidth: IS_WEB ? 380 : '100%',
  },
  thingsToDoTitle: {
    fontSize: IS_WEB ? 48 : 36,
    fontWeight: '900',
    lineHeight: IS_WEB ? 52 : 40,
    letterSpacing: -1,
  },
  thingsToDoSubtitle: {
    fontSize: IS_WEB ? 28 : 22,
    fontWeight: '400',
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  thingsToDoBody: {
    fontSize: 14,
    lineHeight: 24,
  },
  thingsToDoCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
  },
  abstractMapContainer: {
    width: IS_WEB ? 420 : 320,
    height: IS_WEB ? 600 : 480,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPinWrapper: {
    position: 'absolute',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  mapPin: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  mapPinActive: {
    backgroundColor: '#EF4444',
    borderColor: '#FFF',
    transform: [{ scale: 1.2 }],
  },
  mapPinInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
  mapPinInnerActive: {
    backgroundColor: '#FFF',
  },
  mapPinLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  mapPinLabelActive: {
    fontWeight: '900',
  },
  thingsToDoRight: {
    flex: 1,
    maxWidth: IS_WEB ? 340 : '100%',
    alignItems: 'center',
  },
  thingCard: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    backgroundColor: '#FFF',
  },
  thingCardImg: {
    width: '100%',
    height: 200,
  },
  thingCardContent: {
    padding: 24,
  },
  thingCardTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 4,
  },
  thingCardType: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  thingCardDesc: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 24,
  },
  thingCardBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thingCardBtnText: {
    fontSize: 18,
    fontWeight: '300',
  },
});
