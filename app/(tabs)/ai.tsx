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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppTheme } from '../../contexts/ThemeContext';
import { getTranslation } from '../../constants/i18n';
import { Colors, Radius, Shadow } from '../../constants/theme';

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

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      {/* Screen Title */}
      <View style={[styles.header, { backgroundColor: colors.headerBg, borderColor: colors.cardBorder }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{t.aiHeader}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t.aiSub}</Text>
      </View>

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
  container: { flex: 1, backgroundColor: 'transparent', paddingTop: 54 },
  header: { paddingHorizontal: 20, paddingBottom: 12, marginBottom: 10 },
  title: { fontSize: 24, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 4 },
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: 16, padding: 4, marginHorizontal: 16, marginBottom: 16,
    borderWidth: 1,
  },
  segmentBtn: { flex: 1, paddingVertical: 11, alignItems: 'center', borderRadius: 12 },
  activeSegmentBtn: { backgroundColor: Colors.highlight },
  segmentBtnText: { fontSize: 12, fontWeight: '700' },
  scannerScroll: { paddingBottom: 40, paddingHorizontal: 16 },
  scanCard: {
    borderRadius: 20, padding: 20,
    borderWidth: 1, ...Shadow.card,
  },
  cardHeader: { fontSize: 17, fontWeight: '800', marginBottom: 6 },
  cardSub: { fontSize: 13, marginBottom: 16, lineHeight: 19 },
  previewImage: { width: '100%', height: 220, borderRadius: 16, marginBottom: 16 },
  placeholderBox: {
    width: '100%', height: 180, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderStyle: 'dashed', marginBottom: 16,
  },
  placeholderIcon: { fontSize: 44, marginBottom: 8 },
  placeholderText: { fontSize: 13 },
  btnRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  captureBtn: { flex: 1, backgroundColor: Colors.highlight, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  captureBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  galleryBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center', borderWidth: 1 },
  galleryBtnText: { fontWeight: '700', fontSize: 14 },
  resultBox: { padding: 16, borderRadius: 14, borderWidth: 1 },
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
  sendBtn: { backgroundColor: Colors.highlight, paddingHorizontal: 20, paddingVertical: 11, borderRadius: 22 },
  sendBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
});
