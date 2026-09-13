import { Platform, StyleSheet, Text, View } from 'react-native';

const IS_WEB = Platform.OS === 'web';

interface KeyExperiencesProps {
  textMain: string;
}

const featureCards = [
  {
    title: 'Enjoy on your TV',
    description: 'Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.',
    graphic: 'tv',
  },
  {
    title: 'Download your shows to watch offline',
    description: 'Save your favorites easily and always have something to watch.',
    graphic: 'download',
  },
  {
    title: 'Watch everywhere',
    description: 'Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.',
    graphic: 'watch',
  },
  {
    title: 'Create profiles for kids',
    description: 'Send kids on adventures with their favorite characters in a space made just for them — free with your membership.',
    graphic: 'kids',
  },
];

export const KeyExperiences = ({ textMain }: KeyExperiencesProps) => {
  return (
    <View style={styles.sectionWrap}>
      <Text style={[styles.heading, { color: textMain }]}>More Reasons to Join</Text>

      <View style={styles.cardRow}>
        {featureCards.map((card, index) => (
          <View key={index} style={styles.cardWrapper}>
            <View style={styles.featureCard}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardText}>{card.description}</Text>

              <View style={styles.graphicWrap}>
                {card.graphic === 'tv' && (
                  <View style={styles.tvGraphic}>
                    <View style={styles.tvScreen} />
                    <View style={styles.tvStand} />
                  </View>
                )}

                {card.graphic === 'download' && (
                  <View style={styles.downloadGraphic}>
                    <View style={styles.downloadCircle}>
                      <Text style={styles.arrowText}>↓</Text>
                    </View>
                  </View>
                )}

                {card.graphic === 'watch' && (
                  <View style={styles.watchGraphic}>
                    <View style={styles.watchOrb} />
                    <View style={styles.watchSpark} />
                  </View>
                )}

                {card.graphic === 'kids' && (
                  <View style={styles.kidsGraphic}>
                    <View style={styles.kidsFace}>
                      <View style={styles.kidsEyeLeft} />
                      <View style={styles.kidsEyeRight} />
                      <View style={styles.kidsSmile} />
                    </View>
                    <View style={styles.kidsBadge} />
                  </View>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionWrap: {
    backgroundColor: '#020305',
    paddingTop: 32,
    paddingBottom: 40,
    paddingHorizontal: IS_WEB ? 32 : 18,
  },
  heading: {
    fontSize: IS_WEB ? 30 : 24,
    fontWeight: '900',
    letterSpacing: -.5,
    lineHeight: IS_WEB ? 96 : 46,
    marginBottom: 20,
    textAlign: 'left',
  },
  cardRow: {
    flexDirection: IS_WEB ? 'row' : 'column',
    alignItems: 'stretch',
    gap: 20,
  },
  cardWrapper: {
    flex: 1,
  },
  featureCard: {
    flex: 1,
    minHeight: 330,
    backgroundColor: 'rgba(20, 27, 52, 0.95)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  cardTitle: {
    color: '#F5F5F7',
    fontSize: IS_WEB ? 22 : 20,
    fontWeight: '800',
    lineHeight: IS_WEB ? 30 : 28,
    letterSpacing: -0.8,
    marginBottom: 10,
  },
  cardText: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: IS_WEB ? 16 : 15,
    lineHeight: IS_WEB ? 26 : 22,
    fontWeight: '400',
    marginBottom: 20,
  },
  graphicWrap: {
    marginTop: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
  },
  tvGraphic: {
    width: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tvScreen: {
    width: 108,
    height: 82,
    borderRadius: 10,
    backgroundColor: '#171b2e',
    borderWidth: 3,
    borderColor: '#f4b9ff',
    shadowColor: '#ff7be6',
    shadowOpacity: 0.55,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  tvStand: {
    width: 16,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#dfe2ff',
    marginTop: 8,
    opacity: 0.85,
  },
  downloadGraphic: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#f59ad8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f59ad8',
    shadowOpacity: 0.6,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  arrowText: {
    fontSize: 42,
    color: '#2b0a1b',
    fontWeight: '700',
    lineHeight: 42,
  },
  watchGraphic: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  watchOrb: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#f46acb',
    transform: [{ rotate: '20deg' }],
    shadowColor: '#f46acb',
    shadowOpacity: 0.6,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  watchSpark: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#f9d9ff',
    top: 18,
    right: 20,
    opacity: 0.9,
  },
  kidsGraphic: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  kidsFace: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: '#ff6da1',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff6da1',
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  kidsEyeLeft: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1c0b14',
    top: 22,
    left: 16,
  },
  kidsEyeRight: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1c0b14',
    top: 22,
    right: 16,
  },
  kidsSmile: {
    position: 'absolute',
    width: 22,
    height: 12,
    borderBottomWidth: 4,
    borderBottomColor: '#1c0b14',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    bottom: 14,
  },
  kidsBadge: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ff9fc4',
    bottom: 10,
    right: 14,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
});

export default KeyExperiences;
