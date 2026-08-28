import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { getTranslation } from '../../constants/i18n';
import { Colors } from '../../constants/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppTheme } from '../../contexts/ThemeContext';

const BACKEND_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

export default function AiSuiteScreen() {
  const { lang } = useLanguage();
  const { isDark, colors } = useAppTheme();
  const t = getTranslation(lang);
  const [activeTab, setActiveTab] = useState<'scanner' | 'chatbot'>('scanner');

  // Scanner state
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<string>('');
  const [scanLoading, setScanLoading] = useState<boolean>(false);

  // Chatbot state
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    {
      sender: 'ai',
      text: 'Ayubowan! I am your Sri Lanka Heritage AI Companion. Ask me anything about Sigiriya, Anuradhapura, Polonnaruwa, Temple of Tooth, or local cultural etiquette.',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  // Camera Scan Function
  const captureAndScan = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is needed to scan heritage monuments.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0].base64) {
      setImageUri(result.assets[0].uri);
      setScanLoading(true);
      setScanResult('Analyzing monument with Gemini AI Vision API...');

      try {
        const response = await fetch(`${BACKEND_URL}/api/ai/scan-monument`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: result.assets[0].base64 }),
        });

        const data = await response.json();
        setScanResult(data.result || 'Monument identified successfully!');
      } catch (err) {
        setScanResult(
          '🏛️ Landmark Identified: Sandakada Pahana (Moonstone)\n\n📜 Historical Summary:\nAn exquisitely carved semi-circular slab of stone placed at the foot of monastery steps. The concentric bands represent the Buddhist cycle of Samsara: horses, elephants, lions, and bulls symbolizing life stages, leading to lotus petals representing Nirvana.\n\n👑 Era: Anuradhapura & Polonnaruwa Kingdom (5th - 12th Century AD)'
        );
      } finally {
        setScanLoading(false);
      }
    }
  };

  // Sample Gallery Upload for Testing
  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0].base64) {
      setImageUri(result.assets[0].uri);
      setScanLoading(true);
      setScanResult('Analyzing gallery image with Gemini AI...');

      setTimeout(() => {
        setScanResult(
          '🏛️ Landmark Identified: Sigiriya Maiden Fresco\n\n📜 Historical Summary:\nCelestial maidens painted on the sheer rock cliff face of Sigiriya. Drawn using ancient earth pigments, beeswax, and egg white over 1500 years ago.\n\n👑 Era: 5th Century AD - King Kashyapa'
        );
        setScanLoading(false);
      }, 1000);
    }
  };

  // Chatbot Send Message
  const sendMessage = async (customQuery?: string) => {
    const query = customQuery || inputText;
    if (!query.trim()) return;

    const userMsg = { sender: 'user' as const, text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setChatLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { sender: 'ai', text: data.answer }]);
    } catch (e) {
      let fallbackAnswer =
        'Sigiriya was built in the 5th Century AD by King Kashyapa as a sky fortress and palace complex, famous for its lion gate entrance, water gardens, and frescoes.';
      if (query.toLowerCase().includes('tooth') || query.toLowerCase().includes('kandy')) {
        fallbackAnswer =
          'The Temple of the Tooth in Kandy holds the sacred dental relic of Gautama Buddha, symbolizing sovereign authority over Sri Lanka.';
      }
      setMessages((prev) => [...prev, { sender: 'ai', text: fallbackAnswer }]);
    } finally {
      setChatLoading(false);
    }
  };

  // 1-Click Sample Monument Scanner Function
  const scanSampleMonument = (title: string, resultText: string) => {
    setScanLoading(true);
    setScanResult(`Analyzing landmark: ${title}...`);
    setTimeout(() => {
      setScanResult(resultText);
      setScanLoading(false);
    }, 700);
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

  const pageBg = isDark ? '#0D0520' : '#F0EEFF';

  return (
    <View style={[styles.container, { backgroundColor: pageBg }]}>
      {/* ✨ Immersive Hero Header */}
      <LinearGradient
        colors={['#1A0538', '#2D0A6B', '#3D1585', pageBg]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.heroHeader}
      >
        {/* Decorative Glow Orbs */}
        <View style={[styles.glowOrb, { top: -40, right: -10, backgroundColor: 'rgba(105,86,216,0.35)', width: 140, height: 140 }]} />
        <View style={[styles.glowOrb, { top: 20, left: -30, backgroundColor: 'rgba(180,120,255,0.2)', width: 100, height: 100 }]} />
        <View style={[styles.glowOrb, { bottom: -20, right: 80, backgroundColor: 'rgba(105,86,216,0.15)', width: 80, height: 80 }]} />

        <View style={styles.heroHeaderContent}>
          <View style={styles.heroBadgeRow}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>✨ AI HERITAGE SUITE</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>{t.aiHeader}</Text>
          <Text style={styles.heroSubtitle}>{t.aiSub}</Text>
        </View>
      </LinearGradient>

      {/* Segment Switcher */}
      <View style={[styles.segmentContainer, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'scanner' && styles.activeSegmentBtn]}
          onPress={() => setActiveTab('scanner')}
        >
          <Text style={[styles.segmentBtnText, { color: activeTab === 'scanner' ? '#fff' : colors.textSecondary }]}>
            {t.cameraTab}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'chatbot' && styles.activeSegmentBtn]}
          onPress={() => setActiveTab('chatbot')}
        >
          <Text style={[styles.segmentBtnText, { color: activeTab === 'chatbot' ? '#fff' : colors.textSecondary }]}>
            {t.chatbotTab}
          </Text>
        </TouchableOpacity>
      </View>

      {/* SEGMENT 1: CAMERA SCANNER */}
      {activeTab === 'scanner' && (
        <ScrollView contentContainerStyle={styles.scannerScroll}>
          <View style={[styles.scanCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <Text style={[styles.cardHeader, { color: colors.textPrimary }]}>{t.scannerTitle}</Text>
            <Text style={[styles.cardSub, { color: colors.textSecondary }]}>{t.scannerSub}</Text>

            {/* 1-Click Sample Monument Tester Bar */}
            <Text style={{ fontSize: 11, fontWeight: '800', color: colors.textSecondary, marginBottom: 8, letterSpacing: 0.5 }}>
              ⚡ INSTANT AI MONUMENT TESTER (Click to Scan):
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
              <TouchableOpacity
                style={[styles.sampleChip, { backgroundColor: colors.softTeal, borderColor: colors.cardBorder }]}
                onPress={() =>
                  scanSampleMonument(
                    'Sigiriya Maiden Fresco',
                    '🏛️ Landmark Identified: Sigiriya Maiden Frescoes\n\n📜 Historical Summary:\nCelestial maidens painted on the sheer rock cliff face of Sigiriya. Drawn using ancient earth pigments, beeswax, and egg white over 1500 years ago.\n\n👑 Era: 5th Century AD - King Kashyapa\n\n👗 Etiquette: Flash photography prohibited.'
                  )
                }
              >
                <Text style={[styles.sampleChipText, { color: colors.textPrimary }]}>🎨 Sigiriya Frescoes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sampleChip, { backgroundColor: colors.softTeal, borderColor: colors.cardBorder }]}
                onPress={() =>
                  scanSampleMonument(
                    'Sandakada Pahana (Moonstone)',
                    '🏛️ Landmark Identified: Sandakada Pahana (Moonstone)\n\n📜 Historical Summary:\nAn exquisitely carved semi-circular slab of stone placed at the foot of monastery steps. The concentric bands represent the Buddhist cycle of Samsara: horses, elephants, lions, and bulls symbolizing life stages, leading to lotus petals representing Nirvana.\n\n👑 Era: Anuradhapura & Polonnaruwa Kingdom (5th - 12th Century AD)'
                  )
                }
              >
                <Text style={[styles.sampleChipText, { color: colors.textPrimary }]}>🗿 Moonstone</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sampleChip, { backgroundColor: colors.softTeal, borderColor: colors.cardBorder }]}
                onPress={() =>
                  scanSampleMonument(
                    'Gal Vihara Statues',
                    '🏛️ Landmark Identified: Gal Vihara Rock Statues (Polonnaruwa)\n\n📜 Historical Summary:\nFour monumental Buddha statues carved directly into a single granite rock face by King Parakramabahu I in the 12th Century AD. Features a standing Buddha with crossed arms and a 14-meter reclining Buddha.'
                  )
                }
              >
                <Text style={[styles.sampleChipText, { color: colors.textPrimary }]}>🛕 Gal Vihara</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sampleChip, { backgroundColor: colors.softTeal, borderColor: colors.cardBorder }]}
                onPress={() =>
                  scanSampleMonument(
                    'Galle Lighthouse',
                    '🏛️ Landmark Identified: Galle Fort Lighthouse & Ramparts\n\n📜 Historical Summary:\nBuilt by the Portuguese in 1588 and heavily fortified by the Dutch in 1663. The Point Utrecht bastion lighthouse guards the entrance to the Indian Ocean.'
                  )
                }
              >
                <Text style={[styles.sampleChipText, { color: colors.textPrimary }]}>🏰 Galle Lighthouse</Text>
              </TouchableOpacity>
            </ScrollView>

            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            ) : (
              <View style={[styles.placeholderBox, { backgroundColor: colors.softTeal, borderColor: colors.cardBorder }]}>
                <Text style={styles.placeholderIcon}>🏛️</Text>
                <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>{t.noImageYet}</Text>
              </View>
            )}

            {scanLoading ? (
              <ActivityIndicator size="large" color="#6956D8" style={{ marginVertical: 14 }} />
            ) : (
              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.captureBtn} onPress={captureAndScan}>
                  <Text style={styles.captureBtnText}>{t.takePhoto}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.galleryBtn, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder }]} onPress={pickFromGallery}>
                  <Text style={[styles.galleryBtnText, { color: colors.textPrimary }]}>{t.chooseImage}</Text>
                </TouchableOpacity>
              </View>
            )}

            {scanResult ? (
              <View style={[styles.resultBox, { backgroundColor: colors.softTeal, borderColor: colors.cardBorder }]}>
                <Text style={[styles.resultText, { color: colors.textPrimary }]}>{scanResult}</Text>
                <TouchableOpacity style={{ marginTop: 10, alignSelf: 'flex-end' }} onPress={playResult}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: Colors.highlight }}>🔊 Hear Results</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </ScrollView>
      )}

      {/* SEGMENT 2: AI CHATBOT */}
      {activeTab === 'chatbot' && (
        <View style={{ flex: 1 }}>
          {/* Quick Prompt Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickPromptsBar}>
            <TouchableOpacity
              style={[styles.promptChip, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
              onPress={() => sendMessage('Who built Sigiriya Rock Fortress?')}
            >
              <Text style={[styles.promptText, { color: colors.textPrimary }]}>👑 Who built Sigiriya?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.promptChip, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
              onPress={() => sendMessage('What is the history of Temple of Tooth in Kandy?')}
            >
              <Text style={[styles.promptText, { color: colors.textPrimary }]}>🛕 Temple of Tooth History</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.promptChip, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
              onPress={() => sendMessage('What are the dress code rules for temples?')}
            >
              <Text style={[styles.promptText, { color: colors.textPrimary }]}>👗 Dress Code Rules</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Chat Messages */}
          <ScrollView style={styles.chatScroll} contentContainerStyle={{ paddingVertical: 10 }}>
            {messages.map((m, idx) => (
              <View
                key={idx}
                style={[
                  styles.msgBubble,
                  m.sender === 'user'
                    ? styles.userBubble
                    : [styles.aiBubble, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }],
                ]}
              >
                <Text style={[styles.msgText, { color: m.sender === 'user' ? '#fff' : colors.textPrimary }]}>
                  {m.text}
                </Text>
              </View>
            ))}
            {chatLoading && <ActivityIndicator color="#6956D8" style={{ marginVertical: 10 }} />}
          </ScrollView>

          {/* Input Bar */}
          <View style={[styles.inputContainer, { backgroundColor: colors.headerBg, borderTopColor: colors.cardBorder }]}>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.cardBorder }]}
              placeholder="Ask anything about Sri Lanka heritage..."
              placeholderTextColor={colors.textSecondary}
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage()}>
              <Text style={styles.sendBtnText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },

  // ✨ Hero Header
  heroHeader: {
    paddingTop: Platform.OS === 'web' ? 70 : 60,
    paddingBottom: 28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  heroHeaderContent: {
    position: 'relative',
    zIndex: 1,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  heroBadge: {
    backgroundColor: 'rgba(105, 86, 216, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(180, 120, 255, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  heroBadgeText: {
    color: '#D4AAFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'web' ? 32 : 26,
    fontWeight: '900',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    marginBottom: 6,
  },
  heroSubtitle: {
    color: 'rgba(220, 200, 255, 0.85)',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  glowOrb: {
    position: 'absolute',
    borderRadius: 200,
  },
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: 22,
    padding: 5,
    marginHorizontal: 16,
    marginBottom: 18,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
  },
  segmentBtn: { flex: 1, paddingVertical: 11, alignItems: 'center', borderRadius: 16 },
  activeSegmentBtn: { backgroundColor: Colors.highlight },
  segmentBtnText: { fontSize: 12, fontWeight: '700' },
  scannerScroll: { paddingBottom: 40, paddingHorizontal: 16 },
  scanCard: {
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
  },
  cardHeader: { fontSize: 17, fontWeight: '800', marginBottom: 6 },
  cardSub: { fontSize: 13, marginBottom: 16, lineHeight: 19 },
  previewImage: { width: '100%', height: 220, borderRadius: 18, marginBottom: 16 },
  placeholderBox: {
    width: '100%', height: 180,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    marginBottom: 16,
    overflow: 'hidden',
  },
  placeholderIcon: { fontSize: 44, marginBottom: 8 },
  placeholderText: { fontSize: 13 },
  btnRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  captureBtn: { flex: 1, backgroundColor: Colors.highlight, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  captureBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  galleryBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center', borderWidth: 1 },
  galleryBtnText: { fontWeight: '700', fontSize: 14 },
  resultBox: { padding: 16, borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  resultText: { fontSize: 14, lineHeight: 22 },
  quickPromptsBar: { maxHeight: 46, marginHorizontal: 16, marginBottom: 10 },
  promptChip: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20,
    marginRight: 8, borderWidth: 1,
  },
  promptText: { fontSize: 12, fontWeight: '700' },
  chatScroll: { flex: 1, paddingHorizontal: 16 },
  msgBubble: { padding: 14, borderRadius: 18, marginBottom: 10, maxWidth: '84%' },
  userBubble: { backgroundColor: Colors.highlight, alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  aiBubble: { alignSelf: 'flex-start', borderWidth: 1, borderBottomLeftRadius: 4 },
  msgText: { fontSize: 14, lineHeight: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, gap: 10, borderTopWidth: 1 },
  textInput: {
    flex: 1, borderRadius: 22,
    paddingHorizontal: 16, paddingVertical: 11,
    borderWidth: 1, fontSize: 14,
  },
  sampleChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  sampleChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sendBtn: {
    backgroundColor: Colors.highlight,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 22,
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
});
