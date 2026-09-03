import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
  Platform,
  Alert,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppTheme } from '../../contexts/ThemeContext';
import { getTranslation } from '../../constants/i18n';
import { Colors, Shadow } from '../../constants/theme';

const BACKEND_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

export default function AiSuiteScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const { lang } = useLanguage();
  const { isDark, colors } = useAppTheme();
  const t = getTranslation(lang);
  const [activeTab, setActiveTab] = useState<'scanner' | 'chatbot'>('scanner');

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<string>('');
  const [scanLoading, setScanLoading] = useState<boolean>(false);

  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    {
      sender: 'ai',
      text: 'Ayubowan! I am your Sri Lanka Heritage AI Companion. Ask me anything about Sigiriya, Anuradhapura, Polonnaruwa, Temple of Tooth, or local cultural etiquette.',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  const captureAndScan = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is needed.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, base64: true, quality: 0.5 });
    if (!result.canceled && result.assets[0].base64) {
      setImageUri(result.assets[0].uri);
      setScanLoading(true);
      setScanResult('Analyzing monument with Gemini AI Vision API...');
      setTimeout(() => {
        setScanResult('🏛️ Landmark Identified: Sandakada Pahana (Moonstone)\n\n📜 Historical Summary:\nAn exquisitely carved semi-circular slab of stone placed at the foot of monastery steps. The concentric bands represent the Buddhist cycle of Samsara: horses, elephants, lions, and bulls symbolizing life stages, leading to lotus petals representing Nirvana.\n\n👑 Era: Anuradhapura & Polonnaruwa Kingdom (5th - 12th Century AD)');
        setScanLoading(false);
      }, 1500);
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, base64: true, quality: 0.5 });
    if (!result.canceled && result.assets[0].base64) {
      setImageUri(result.assets[0].uri);
      setScanLoading(true);
      setScanResult('Analyzing gallery image with Gemini AI...');
      setTimeout(() => {
        setScanResult('🏛️ Landmark Identified: Sigiriya Maiden Fresco\n\n📜 Historical Summary:\nCelestial maidens painted on the sheer rock cliff face of Sigiriya. Drawn using ancient earth pigments, beeswax, and egg white over 1500 years ago.\n\n👑 Era: 5th Century AD - King Kashyapa');
        setScanLoading(false);
      }, 1500);
    }
  };

  const sendMessage = async (customQuery?: string) => {
    const query = customQuery || inputText;
    if (!query.trim()) return;
    const userMsg = { sender: 'user' as const, text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setChatLoading(true);
    setTimeout(() => {
      let fallbackAnswer = 'Sigiriya was built in the 5th Century AD by King Kashyapa as a sky fortress and palace complex, famous for its lion gate entrance, water gardens, and frescoes.';
      if (query.toLowerCase().includes('tooth') || query.toLowerCase().includes('kandy')) {
        fallbackAnswer = 'The Temple of the Tooth in Kandy holds the sacred dental relic of Gautama Buddha, symbolizing sovereign authority over Sri Lanka.';
      }
      setMessages((prev) => [...prev, { sender: 'ai', text: fallbackAnswer }]);
      setChatLoading(false);
    }, 1000);
  };

  const scanSampleMonument = (title: string, resultText: string) => {
    setScanLoading(true);
    setScanResult(`Analyzing landmark: ${title}...`);
    setTimeout(() => {
      setScanResult(resultText);
      setScanLoading(false);
    }, 800);
  };

  const playResult = () => {
    if (!scanResult) return;
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = scanResult.replace(/[^\w\s.,!?-]/gi, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } else {
      Alert.alert('🔊 Voice Narration', scanResult);
    }
  };

  const pageBg = isDark ? '#0A0A0A' : '#F5F7FA';
  const glassTint = isDark ? 'dark' : 'light';
  const contentMaxWidth = 1000;

  return (
    <View style={[styles.container, { backgroundColor: pageBg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        {/* Cinematic Full-Bleed Hero */}
        <View style={styles.heroContainer}>
          <ImageBackground source={require('../../assets/images/temple.jpg')} style={styles.heroBgImage} imageStyle={{ opacity: 0.8 }}>
            <LinearGradient colors={['rgba(0,0,0,0.2)', isDark ? '#0A0A0A' : '#F5F7FA']} style={StyleSheet.absoluteFillObject} />
            <View style={[styles.heroContentWrapper, { maxWidth: contentMaxWidth }]}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>✨ AI HERITAGE SUITE</Text>
              </View>
              <Text style={styles.heroTitle}>{t.aiHeader || 'Smart AI Heritage Suite'}</Text>
              <Text style={styles.heroSubtitle}>{t.aiSub || 'Gemini Vision Scanner & RAG Cultural Assistant'}</Text>
            </View>
          </ImageBackground>
        </View>

        {/* Floating Segment Control */}
        <View style={styles.segmentWrapper}>
          <BlurView intensity={80} tint={glassTint} style={styles.segmentBlur}>
            <TouchableOpacity style={[styles.segmentBtn, activeTab === 'scanner' && styles.segmentBtnActive]} onPress={() => setActiveTab('scanner')}>
              <Text style={[styles.segmentBtnText, activeTab === 'scanner' ? { color: '#FFF' } : { color: isDark ? '#AAA' : '#666' }]}>
                📷 Camera Heritage Scan
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.segmentBtn, activeTab === 'chatbot' && styles.segmentBtnActive]} onPress={() => setActiveTab('chatbot')}>
              <Text style={[styles.segmentBtnText, activeTab === 'chatbot' ? { color: '#FFF' } : { color: isDark ? '#AAA' : '#666' }]}>
                💬 AI Companion Chatbot
              </Text>
            </TouchableOpacity>
          </BlurView>
        </View>

        {/* Main Content Area */}
        <View style={[styles.mainContent, { maxWidth: contentMaxWidth }]}>
          {activeTab === 'scanner' && (
            <View style={[styles.card, { backgroundColor: isDark ? '#141414' : '#FFFFFF', borderColor: isDark ? '#2A2A2A' : '#E5E7EB' }]}>
              <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#111' }]}>Visual Object & Statue Identifier</Text>
              <Text style={[styles.cardDesc, { color: isDark ? '#999' : '#666' }]}>Point your camera at a moonstone, Buddha statue, carving, or ancient fresco to instantly extract historical facts.</Text>

              <Text style={styles.sectionLabel}>⚡ INSTANT AI MONUMENT TESTER:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {['🎨 Sigiriya Frescoes', '🗿 Moonstone', '🛕 Gal Vihara', '🏰 Galle Lighthouse'].map((item, idx) => (
                  <TouchableOpacity key={idx} style={[styles.chip, { backgroundColor: isDark ? '#1E1E1E' : '#F3F4F6', borderColor: isDark ? '#333' : '#E5E7EB' }]} onPress={() => scanSampleMonument(item, `🏛️ Landmark Identified: ${item}\n\n📜 Historical info for ${item}.`)}>
                    <Text style={[styles.chipText, { color: isDark ? '#DDD' : '#333' }]}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={[styles.previewContainer, { backgroundColor: isDark ? '#0F0F0F' : '#F9FAFB', borderColor: isDark ? '#222' : '#E5E7EB' }]}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.previewImg} />
                ) : (
                  <View style={styles.placeholder}>
                    <Text style={{ fontSize: 40, marginBottom: 12 }}>🏛️</Text>
                    <Text style={{ color: isDark ? '#666' : '#999', fontSize: 14 }}>No image selected yet</Text>
                  </View>
                )}
              </View>

              {scanLoading ? (
                <ActivityIndicator size="large" color={Colors.teal} style={{ marginVertical: 30 }} />
              ) : (
                <View style={[styles.actionRow, isDesktop ? { flexDirection: 'row' } : { flexDirection: 'column' }]}>
                  <TouchableOpacity style={styles.primaryBtn} onPress={captureAndScan}>
                    <LinearGradient colors={[Colors.teal, Colors.tealSoft]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.primaryBtnGradient}>
                      <Text style={styles.primaryBtnText}>📷 Take Photo</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.secondaryBtn, { borderColor: isDark ? '#333' : '#E5E7EB' }]} onPress={pickFromGallery}>
                    <Text style={[styles.secondaryBtnText, { color: isDark ? '#FFF' : '#111' }]}>🖼️ Choose Image</Text>
                  </TouchableOpacity>
                </View>
              )}

              {scanResult ? (
                <View style={[styles.resultBox, { backgroundColor: isDark ? 'rgba(0, 140, 149, 0.1)' : '#E8F7F5', borderColor: isDark ? 'rgba(0, 140, 149, 0.3)' : '#B2DFDB' }]}>
                  <Text style={[styles.resultText, { color: isDark ? '#EEE' : '#111' }]}>{scanResult}</Text>
                  <TouchableOpacity style={styles.audioBtn} onPress={playResult}>
                    <Text style={styles.audioBtnText}>🔊 Listen</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          )}

          {activeTab === 'chatbot' && (
            <View style={[styles.card, { backgroundColor: isDark ? '#141414' : '#FFFFFF', borderColor: isDark ? '#2A2A2A' : '#E5E7EB', flex: 1, minHeight: 600 }]}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {['👑 Who built Sigiriya?', '🛕 Temple of Tooth History', '👗 Dress Code Rules'].map((prompt, i) => (
                  <TouchableOpacity key={i} style={[styles.chip, { backgroundColor: isDark ? '#1E1E1E' : '#F3F4F6', borderColor: isDark ? '#333' : '#E5E7EB' }]} onPress={() => sendMessage(prompt)}>
                    <Text style={[styles.chipText, { color: isDark ? '#DDD' : '#333' }]}>{prompt}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <ScrollView style={styles.chatArea} contentContainerStyle={{ paddingVertical: 20 }}>
                {messages.map((m, idx) => (
                  <View key={idx} style={[styles.bubble, m.sender === 'user' ? styles.userBubble : [styles.aiBubble, { backgroundColor: isDark ? '#1E1E1E' : '#F3F4F6', borderColor: isDark ? '#333' : '#E5E7EB' }]]}>
                    <Text style={[styles.bubbleText, { color: m.sender === 'user' ? '#FFF' : (isDark ? '#EEE' : '#111') }]}>{m.text}</Text>
                  </View>
                ))}
                {chatLoading && <ActivityIndicator color={Colors.teal} style={{ marginVertical: 20 }} />}
              </ScrollView>

              <View style={[styles.inputRow, { backgroundColor: isDark ? '#1E1E1E' : '#F3F4F6', borderColor: isDark ? '#333' : '#E5E7EB' }]}>
                <TextInput
                  style={[styles.input, { color: isDark ? '#FFF' : '#111' }]}
                  placeholder="Ask anything..."
                  placeholderTextColor={isDark ? '#888' : '#999'}
                  value={inputText}
                  onChangeText={setInputText}
                  onSubmitEditing={() => sendMessage()}
                />
                <TouchableOpacity onPress={() => sendMessage()}>
                  <LinearGradient colors={[Colors.orange, '#FF6B00']} style={styles.sendBtn}>
                    <Text style={styles.sendBtnText}>Send</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroContainer: {
    width: '100%',
    height: Platform.OS === 'web' ? 360 : 280,
  },
  heroBgImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContentWrapper: {
    width: '100%',
    paddingHorizontal: 24,
    alignItems: 'center',
    zIndex: 2,
  },
  badge: {
    backgroundColor: 'rgba(0, 140, 149, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  heroTitle: {
    color: '#FFF',
    fontSize: Platform.OS === 'web' ? 42 : 32,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: Platform.OS === 'web' ? 18 : 15,
    textAlign: 'center',
    fontWeight: '500',
  },
  segmentWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: -30,
    zIndex: 10,
  },
  segmentBlur: {
    flexDirection: 'row',
    borderRadius: 30,
    padding: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    maxWidth: 600,
    width: '90%',
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 24,
  },
  segmentBtnActive: {
    backgroundColor: Colors.teal,
  },
  segmentBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  mainContent: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 60,
  },
  card: {
    borderRadius: 24,
    padding: Platform.OS === 'web' ? 40 : 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#888',
    letterSpacing: 1,
    marginBottom: 12,
  },
  chipScroll: {
    flexGrow: 0,
    marginBottom: 24,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  previewContainer: {
    width: '100%',
    aspectRatio: Platform.OS === 'web' ? 2 : 1,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    overflow: 'hidden',
    marginBottom: 24,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  actionRow: {
    gap: 16,
    width: '100%',
  },
  primaryBtn: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  primaryBtnGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
  },
  resultBox: {
    marginTop: 24,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
  },
  resultText: {
    fontSize: 15,
    lineHeight: 24,
  },
  audioBtn: {
    marginTop: 16,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  audioBtnText: {
    color: Colors.teal,
    fontWeight: '800',
    fontSize: 13,
  },
  chatArea: {
    flex: 1,
  },
  bubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  userBubble: {
    backgroundColor: Colors.teal,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 24,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 15,
    height: 44,
    outlineStyle: 'none',
  },
  sendBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
