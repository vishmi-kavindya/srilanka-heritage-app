import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  LanguageCode,
  LanguageItem,
  TARGET_13_LANGUAGES,
  getTranslation,
} from '../constants/i18n';

interface Props {
  visible: boolean;
  currentLang: LanguageCode;
  onCompleteOnboarding: (selectedLang: LanguageCode, userProfile?: any) => void;
}

// 4 Iconic Sri Lanka Heritage Scenery Images for Automated Crossfade Background
const BACKGROUND_IMAGES = [
  require('../assets/images/temple.jpg'),
  require('../assets/images/nine.jpg'),
  require('../assets/images/coco.AVIF'),
  require('../assets/images/beach.AVIF'),
];

export default function PearlExplorerWelcomeModal({
  visible,
  currentLang,
  onCompleteOnboarding,
}: Props) {
  // Navigation Steps: 'intro' ➔ 'language' ➔ 'auth'
  const [step, setStep] = useState<'intro' | 'language' | 'auth'>('intro');
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(currentLang);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Background Slideshow Index & Fade Animations
  const [currentBgIndex, setCurrentBgIndex] = useState<number>(0);
  const bgFadeAnim = useRef(new Animated.Value(1)).current;

  // Auth State
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Card Onboarding Animations
  const cardFadeAnim = useRef(new Animated.Value(0)).current;
  const cardScaleAnim = useRef(new Animated.Value(0.92)).current;

  // Intro Splash Dedicated Animations
  const introTextScale = useRef(new Animated.Value(0.65)).current;
  const introTextOpacity = useRef(new Animated.Value(0)).current;
  const introTagOpacity = useRef(new Animated.Value(0)).current;
  const introLogoOpacity = useRef(new Animated.Value(0)).current;
  const logoPulseAnim = useRef(new Animated.Value(1)).current;
  const introFloatAnim = useRef(new Animated.Value(0)).current;
  const welcomeLetters = useRef("WELCOME".split('').map(() => new Animated.Value(0))).current;

  // Helper Function for Female / Girl Voice Audio Speech Output
  const playWelcomeVoice = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        // Warm, elegant, tourism-style voice script (~4-5 seconds duration)
        const utterance = new SpeechSynthesisUtterance("Welcome to Pearl Explorer... Discover the beauty of Sri Lanka.");
        utterance.rate = 0.82; // Soft, relaxed tourism-style pace for ~4.5s duration
        utterance.pitch = 1.2; // Warm, welcoming, elegant female tone
        utterance.volume = 1.0;
        utterance.lang = 'en-US';

        const getAndSetFemaleVoice = () => {
          const voices = window.speechSynthesis.getVoices();
          const femaleVoice =
            voices.find(
              (v) =>
                v.lang.startsWith('en') &&
                (v.name.toLowerCase().includes('female') ||
                  v.name.toLowerCase().includes('zira') ||
                  v.name.toLowerCase().includes('samantha') ||
                  v.name.toLowerCase().includes('jenny') ||
                  v.name.toLowerCase().includes('aria') ||
                  v.name.toLowerCase().includes('victoria') ||
                  v.name.toLowerCase().includes('karen') ||
                  v.name.toLowerCase().includes('siri') ||
                  v.name.toLowerCase().includes('google us english') ||
                  v.name.toLowerCase().includes('natural'))
            ) || voices.find((v) => v.lang.startsWith('en'));

          if (femaleVoice) {
            utterance.voice = femaleVoice;
          }
        };

        getAndSetFemaleVoice();

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.log('Voice synthesis error:', e);
        setIsSpeaking(false);
      }
    }
  };

  // Pre-load female voice list when browser speech synthesis is ready
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Voice list ready in browser
      };
    }
  }, []);

  // Automated 4-Image Background Crossfade Slideshow
  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      Animated.timing(bgFadeAnim, {
        toValue: 0.1,
        duration: 1200,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.quad),
      }).start(() => {
        setCurrentBgIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
        Animated.timing(bgFadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }).start();
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [visible]);

  // Card and Intro Voice Animation Trigger
  useEffect(() => {
    if (visible) {
      cardFadeAnim.setValue(0);
      cardScaleAnim.setValue(0.92);

      Animated.parallel([
        Animated.timing(cardFadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(cardScaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]).start();

      if (step === 'intro') {
        introTextScale.setValue(0.65);
        introTextOpacity.setValue(0);
        introTagOpacity.setValue(0);
        introLogoOpacity.setValue(0);
        introFloatAnim.setValue(0);
        welcomeLetters.forEach(val => val.setValue(0));

        // Animate Welcome Pearl Explorer text entrance sequentially
        Animated.sequence([
          Animated.timing(introTagOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          // Staggered letter animation for WELCOME
          Animated.stagger(100, welcomeLetters.map(val =>
            Animated.spring(val, {
              toValue: 1,
              friction: 4,
              tension: 40,
              useNativeDriver: true
            })
          )),
          Animated.timing(introLogoOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.parallel([
            Animated.spring(introTextScale, {
              toValue: 1,
              friction: 5,
              tension: 40,
              useNativeDriver: true,
            }),
            Animated.timing(introTextOpacity, {
              toValue: 1,
              duration: 850,
              useNativeDriver: true,
            }),
          ])
        ]).start();

        // Continuous Logo Halo Loop
        Animated.loop(
          Animated.sequence([
            Animated.timing(logoPulseAnim, {
              toValue: 1.08,
              duration: 1200,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.quad),
            }),
            Animated.timing(logoPulseAnim, {
              toValue: 1,
              duration: 1200,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.quad),
            }),
          ])
        ).start();

        Animated.loop(
          Animated.sequence([
            Animated.timing(introFloatAnim, {
              toValue: -10,
              duration: 1400,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.quad),
            }),
            Animated.timing(introFloatAnim, {
              toValue: 10,
              duration: 1600,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.quad),
            }),
            Animated.timing(introFloatAnim, {
              toValue: 0,
              duration: 1200,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.quad),
            }),
          ])
        ).start();

        // Auto play female voice when Welcome text appears
        const voiceTimer = setTimeout(() => {
          playWelcomeVoice();
        }, 350);

        return () => clearTimeout(voiceTimer);
      }
    }
  }, [visible, step]);

  const t = getTranslation(selectedLang);
  const currentLangItem =
    TARGET_13_LANGUAGES.find((l) => l.code === selectedLang) || TARGET_13_LANGUAGES[0];

  const handleLanguageSelect = (code: LanguageCode) => {
    setSelectedLang(code);
    setIsDropdownOpen(false);
  };

  const handleContinueToAuth = () => {
    setStep('auth');
  };

  const handleFinish = () => {
    onCompleteOnboarding(selectedLang, { email, fullName });
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View style={styles.fullscreenBg}>
        {/* Animated Crossfade Background Image */}
        <Animated.Image
          source={BACKGROUND_IMAGES[currentBgIndex]}
          style={[styles.backgroundImage, { opacity: bgFadeAnim }]}
          resizeMode="cover"
        />

        {/* Dark Overlay Gradient for High Contrast */}
        <View style={styles.darkOverlay}>
          <Animated.View
            style={[
              styles.animatedContainer,
              { opacity: cardFadeAnim, transform: [{ scale: cardScaleAnim }] },
            ]}
          >
            {/* STEP 0: EXCLUSIVE ANIMATED INTRO "WELCOME PEARL EXPLORER" WITH FEMALE VOICE */}
            {step === 'intro' ? (
              <View style={styles.cardContent}>
                <Animated.View
                  style={[
                    styles.glassCardIntro,
                    { transform: [{ translateY: introFloatAnim }] },
                  ]}
                >
                  {/* Top Content: Text and Logo */}
                  <View style={styles.introTopContent}>
                    {/* Crown Tagline */}
                    <Animated.Text style={[styles.introCrownTag, { opacity: introTagOpacity }]}>
                      SRI LANKA HERITAGE EXPLORER
                    </Animated.Text>

                    {/* Animated Main Title: WELCOME (Letter by Letter) */}
                    <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                      {"WELCOME".split('').map((char, index) => (
                        <Animated.Text
                          key={index}
                          style={[
                            styles.introPearlTitle,
                            {
                              opacity: welcomeLetters[index],
                              transform: [
                                { scale: welcomeLetters[index] },
                                { translateY: welcomeLetters[index].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }
                              ]
                            }
                          ]}
                        >
                          {char}
                        </Animated.Text>
                      ))}
                    </View>

                    {/* Logo GIF (Background Removed) */}
                    <Animated.View
                      style={[
                        styles.logoBadgeContainer,
                        { opacity: introLogoOpacity, transform: [{ scale: logoPulseAnim }] },
                      ]}
                    >
                      <Image
                        source={require('../assets/images/output-onlinegiftools.gif')}
                        style={styles.logoBadgeImage}
                        resizeMode="contain"
                      />
                    </Animated.View>
                  </View>

                  {/* Bottom Content: Buttons and Dots */}
                  <View style={styles.introBottomContent}>
                    {/* Primary Continue Buttons */}
                    <View style={styles.authButtonsRow}>
                      <TouchableOpacity
                        style={[styles.goldContinueButton, { flex: 1, marginRight: 6 }]}
                        onPress={() => { setAuthMode('signin'); setStep('auth'); }}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.goldButtonText}>SIGN IN</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.goldContinueButton, { flex: 1, marginLeft: 6, backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#d4af37' }]}
                        onPress={() => { setAuthMode('signup'); setStep('auth'); }}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.goldButtonText, { color: '#d4af37' }]}>SIGN UP</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Slideshow Dots */}
                    <View style={styles.slideshowDotsRow}>
                      {BACKGROUND_IMAGES.map((_, idx) => (
                        <View
                          key={idx}
                          style={[
                            styles.dot,
                            currentBgIndex === idx ? styles.activeDot : styles.inactiveDot,
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                </Animated.View>
              </View>
            ) : step === 'language' ? (
              /* STEP 1: LANGUAGE SELECTION DROPDOWN */
              <View style={styles.cardContent}>
                <View style={styles.glassCard}>
                  <TouchableOpacity style={styles.backButton} onPress={() => setStep('intro')}>
                    <Text style={styles.backButtonText}>← Replay Welcome Intro</Text>
                  </TouchableOpacity>

                  <View style={styles.logoBadgeContainerSmall}>
                    <Image
                      source={require('../assets/images/logo.jpeg')}
                      style={styles.logoBadgeImageSmall}
                      resizeMode="cover"
                    />
                  </View>
                  <Text style={styles.subtitleBrand}>AFFINITY PROMISE & HERITAGE</Text>
                  <Text style={styles.heroGoldTitle}>PEARL EXPLORER</Text>
                  <View style={styles.goldDivider} />
                  <Text style={styles.welcomeSubtitle}>{t.welcomeSub}</Text>

                  {/* Language Selection Dropdown Box */}
                  <View style={styles.dropdownSection}>
                    <Text style={styles.chooseLangLabel}>🌐 {t.chooseLang}:</Text>

                    <TouchableOpacity
                      style={styles.dropdownHeader}
                      onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.dropdownFlag}>{currentLangItem.flag}</Text>
                      <Text style={styles.dropdownText}>
                        {currentLangItem.name} ({currentLangItem.nativeName})
                      </Text>
                      <Text style={styles.dropdownArrow}>{isDropdownOpen ? '▲' : '▼'}</Text>
                    </TouchableOpacity>

                    {/* Dropdown Options List */}
                    {isDropdownOpen && (
                      <View style={styles.dropdownBody}>
                        <ScrollView style={{ maxHeight: 200 }}>
                          {TARGET_13_LANGUAGES.map((item: LanguageItem) => (
                            <TouchableOpacity
                              key={item.code}
                              style={[
                                styles.dropdownOption,
                                selectedLang === item.code && styles.selectedDropdownOption,
                              ]}
                              onPress={() => handleLanguageSelect(item.code)}
                            >
                              <Text style={styles.optionFlag}>{item.flag}</Text>
                              <Text
                                style={[
                                  styles.optionText,
                                  selectedLang === item.code && styles.goldOptionText,
                                ]}
                              >
                                {item.name} <Text style={styles.nativeSpan}>({item.nativeName})</Text>
                              </Text>
                              {selectedLang === item.code && <Text style={styles.goldCheck}>✓</Text>}
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    )}
                  </View>

                  {/* Continue Button */}
                  <TouchableOpacity
                    style={styles.goldContinueButton}
                    onPress={handleContinueToAuth}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.goldButtonText}>{t.continueBtn}</Text>
                  </TouchableOpacity>

                  {/* Slideshow Indicator Dots */}
                  <View style={styles.slideshowDotsRow}>
                    {BACKGROUND_IMAGES.map((_, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.dot,
                          currentBgIndex === idx ? styles.activeDot : styles.inactiveDot,
                        ]}
                      />
                    ))}
                  </View>
                </View>
              </View>
            ) : (
              /* STEP 2: AUTHENTICATION (SIGN IN / SIGN UP) */
              <View style={styles.cardContent}>
                <View style={styles.glassCard}>
                  <TouchableOpacity style={styles.backButton} onPress={() => setStep('language')}>
                    <Text style={styles.backButtonText}>← {currentLangItem.flag} {currentLangItem.name}</Text>
                  </TouchableOpacity>

                  <View style={styles.logoBadgeContainerSmall}>
                    <Image
                      source={require('../assets/images/logo.jpeg')}
                      style={styles.logoBadgeImageSmall}
                      resizeMode="cover"
                    />
                  </View>

                  <Text style={styles.heroGoldTitle}>
                    {authMode === 'signin' ? t.loginTitle : t.signupTitle}
                  </Text>
                  <Text style={styles.welcomeSubtitle}>{t.authSubtitle}</Text>

                  {/* Auth Form */}
                  <View style={styles.formContainer}>
                    {authMode === 'signup' && (
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>{t.nameLabel}</Text>
                        <TextInput
                          style={styles.darkInput}
                          placeholder="e.g. Alexander Wright"
                          placeholderTextColor="#999"
                          value={fullName}
                          onChangeText={setFullName}
                        />
                      </View>
                    )}

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>{t.emailLabel}</Text>
                      <TextInput
                        style={styles.darkInput}
                        placeholder="explorer@srilanka.com"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>{t.passwordLabel}</Text>
                      <TextInput
                        style={styles.darkInput}
                        placeholder="••••••••"
                        placeholderTextColor="#999"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                      />
                    </View>

                    {/* Primary Auth Action Button */}
                    <TouchableOpacity
                      style={styles.goldContinueButton}
                      onPress={handleFinish}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.goldButtonText}>
                        {authMode === 'signin' ? t.signInBtn : t.signUpBtn}
                      </Text>
                    </TouchableOpacity>

                    {/* Switch Signin / Signup */}
                    <TouchableOpacity
                      style={styles.toggleAuthBtn}
                      onPress={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                    >
                      <Text style={styles.toggleAuthText}>
                        {authMode === 'signin' ? t.noAccountText : t.hasAccountText}
                      </Text>
                    </TouchableOpacity>

                    {/* Skip / Continue as Guest */}
                    <TouchableOpacity style={styles.guestSkipBtn} onPress={handleFinish}>
                      <Text style={styles.guestSkipText}>{t.skipGuestBtn}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fullscreenBg: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#05050a',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  darkOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 5, 12, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  animatedContainer: {
    width: '100%',
    maxWidth: 480,
    alignItems: 'center',
  },
  cardContent: {
    width: '100%',
    alignItems: 'center',
  },
  glassCardIntro: {
    width: '100%',
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: 40,
    height: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  introTopContent: {
    alignItems: 'center',
    width: '100%',
  },
  introBottomContent: {
    alignItems: 'center',
    width: '100%',
  },
  glassCard: {
    width: '100%',
    backgroundColor: 'rgba(10, 10, 15, 0.88)',
    borderRadius: 24,
    padding: 26,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.5)',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 10,
  },
  introCrownTag: {
    color: '#d4af37',
    fontSize: 16,
    letterSpacing: 5,
    fontWeight: '900',
    marginBottom: 24,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  logoBadgeContainer: {
    width: 320,
    height: 140,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadgeImage: {
    width: '100%',
    height: '100%',
  },
  introPearlTitle: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(212, 175, 55, 0.6)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 30,
  },
  introPearlGoldTitle: {
    color: '#f3e5ab',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 3,
    textAlign: 'center',
    marginTop: 2,
    textShadowColor: 'rgba(212, 175, 55, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  goldDividerWide: {
    width: 90,
    height: 2.5,
    backgroundColor: '#d4af37',
    marginVertical: 18,
    borderRadius: 2,
  },
  introSubtitle: {
    color: '#d1d1d6',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 28,
  },
  logoBadgeContainerSmall: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: '#d4af37',
    padding: 2,
    backgroundColor: '#0a0a0f',
    marginBottom: 8,
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadgeImageSmall: {
    width: '100%',
    height: '100%',
    borderRadius: 23,
  },
  subtitleBrand: {
    color: '#d4af37',
    fontSize: 11,
    letterSpacing: 4,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroGoldTitle: {
    color: '#ffffff',
    fontSize: 25,
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'center',
    marginVertical: 4,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  goldDivider: {
    width: 60,
    height: 2,
    backgroundColor: '#d4af37',
    marginVertical: 12,
  },
  welcomeSubtitle: {
    color: '#d1d1d6',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  dropdownSection: {
    width: '100%',
    marginBottom: 22,
  },
  chooseLangLabel: {
    color: '#d4af37',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderWidth: 1.5,
    borderColor: '#d4af37',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownFlag: { fontSize: 24, marginRight: 12 },
  dropdownText: { flex: 1, color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
  dropdownArrow: { color: '#d4af37', fontSize: 12, fontWeight: 'bold' },
  dropdownBody: {
    backgroundColor: '#0a0a0f',
    borderWidth: 1.5,
    borderColor: '#d4af37',
    borderRadius: 12,
    marginTop: 6,
    overflow: 'hidden',
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#22222a',
  },
  selectedDropdownOption: {
    backgroundColor: '#262215',
  },
  optionFlag: { fontSize: 22, marginRight: 12 },
  optionText: { color: '#ffffff', fontSize: 14, fontWeight: '500' },
  nativeSpan: { color: '#aaaaaa', fontSize: 12 },
  goldOptionText: { color: '#d4af37', fontWeight: 'bold' },
  goldCheck: { color: '#d4af37', fontWeight: 'bold', marginLeft: 'auto' },
  goldContinueButton: {
    width: '100%',
    backgroundColor: '#d4af37',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#d4af37',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  goldButtonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  authButtonsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  slideshowDotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 20,
    backgroundColor: '#d4af37',
  },
  inactiveDot: {
    width: 6,
    backgroundColor: '#555555',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backButtonText: {
    color: '#d4af37',
    fontSize: 14,
    fontWeight: '600',
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    color: '#e5e5ea',
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '500',
  },
  darkInput: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 14,
  },
  toggleAuthBtn: {
    marginTop: 16,
    alignItems: 'center',
  },
  toggleAuthText: {
    color: '#aeaeb2',
    fontSize: 13,
  },
  guestSkipBtn: {
    marginTop: 16,
    alignItems: 'center',
  },
  guestSkipText: {
    color: '#d4af37',
    fontSize: 14,
    fontWeight: '600',
  },
});
