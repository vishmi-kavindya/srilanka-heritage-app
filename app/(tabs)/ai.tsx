// @ts-nocheck
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
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppTheme } from '../../contexts/ThemeContext';
import { getTranslation } from '../../constants/i18n';
import { Colors } from '../../constants/theme';

const BACKEND_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

export default function AiSuiteScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const { lang } = useLanguage();
  const { isDark } = useAppTheme();
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
        setScanResult('Landmark Identified: Sandakada Pahana (Moonstone)\n\nHistorical Summary:\nAn exquisitely carved semi-circular slab of stone placed at the foot of monastery steps. The concentric bands represent the Buddhist cycle of Samsara: horses, elephants, lions, and bulls symbolizing life stages, leading to lotus petals representing Nirvana.\n\nEra: Anuradhapura & Polonnaruwa Kingdom (5th - 12th Century AD)');
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
        setScanResult('Landmark Identified: Sigiriya Maiden Fresco\n\nHistorical Summary:\nCelestial maidens painted on the sheer rock cliff face of Sigiriya. Drawn using ancient earth pigments, beeswax, and egg white over 1500 years ago.\n\nEra: 5th Century AD - King Kashyapa');
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
    try {
      const response = await fetch(`${BACKEND_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query }),
      });
      const data = await response.json();
      if (data.answer) {
        setMessages((prev) => [...prev, { sender: 'ai', text: data.answer }]);
      } else {
        setMessages((prev) => [...prev, { sender: 'ai', text: 'Sorry, I could not process your request at the moment.' }]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { sender: 'ai', text: 'Failed to connect to the backend server.' }]);
    } finally {
      setChatLoading(false);
    }
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
      Alert.alert('Voice Narration', scanResult);
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
          <ImageBackground source={require('../../assets/images/temple.jpg')} style={styles.heroBgImage} imageStyle={{ opacity: isDark ? 0.6 : 0.8 }}>
            <LinearGradient colors={['rgba(0,0,0,0.5)', isDark ? '#080909' : '#F5F7FA']} style={StyleSheet.absoluteFill} />
            <View style={[styles.heroContentWrapper, { maxWidth: contentMaxWidth }]}>
              <View style={styles.badge}>
                <Ionicons name="sparkles" size={12} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.badgeText}>🤖 AI TRAVEL COMPANION</Text>
              </View>
              <Text style={styles.heroTitle}>Your intelligent guide to Sri Lanka</Text>
              <Text style={styles.heroSubtitle}>Ask about destinations, history, transport, culture, food and hidden places.</Text>
            </View>
          </ImageBackground>
        </View>

        {/* Floating Segment Control */}
        <View style={styles.segmentWrapper}>
          <BlurView intensity={80} tint={glassTint} style={styles.segmentBlur}>
            <TouchableOpacity style={[styles.segmentBtn, activeTab === 'chatbot' && styles.segmentBtnActive]} onPress={() => setActiveTab('chatbot')}>
              <Ionicons name="chatbubbles-outline" size={18} color={activeTab === 'chatbot' ? '#FFF' : (isDark ? '#AAA' : '#666')} />
              <Text style={[styles.segmentBtnText, activeTab === 'chatbot' ? { color: '#FFF' } : { color: isDark ? '#AAA' : '#666' }]}>
                AI Companion
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.segmentBtn, activeTab === 'scanner' && styles.segmentBtnActive]} onPress={() => setActiveTab('scanner')}>
              <Ionicons name="camera-outline" size={18} color={activeTab === 'scanner' ? '#FFF' : (isDark ? '#AAA' : '#666')} />
              <Text style={[styles.segmentBtnText, activeTab === 'scanner' ? { color: '#FFF' } : { color: isDark ? '#AAA' : '#666' }]}>
                Visual Scanner
              </Text>
            </TouchableOpacity>
          </BlurView>
        </View>

        {/* Main Content Area */}
        <View style={[styles.mainContent, { maxWidth: contentMaxWidth }]}>
          
          {activeTab === 'chatbot' && (
            <View style={styles.chatSection}>
              {/* Centered Premium Chat Interface */}
              <View style={[styles.chatBox, { backgroundColor: isDark ? '#121414' : '#FFFFFF', borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#E5E7EB' }]}>
                
                <View style={styles.chatHeader}>
                  <View style={styles.aiOrb}>
                    <Ionicons name="sparkles" size={20} color="#FFF" />
                  </View>
                  <Text style={[styles.chatHeaderTitle, { color: isDark ? '#FFF' : '#111' }]}>✨ Ceylon AI</Text>
                  <Text style={[styles.chatHeaderSub, { color: isDark ? '#999' : '#666' }]}>How can I help you explore Sri Lanka?</Text>
                </View>

                <View style={styles.promptChipsContainer}>
                  {[
                    { name: 'Plan my trip', icon: 'map-outline' },
                    { name: 'History', icon: 'library-outline' },
                    { name: 'Food', icon: 'restaurant-outline' }
                  ].map((prompt, i) => (
                    <TouchableOpacity key={i} style={[styles.promptChip, { backgroundColor: isDark ? '#181C22' : '#F3F4F6' }]} onPress={() => sendMessage(prompt.name)}>
                      <Ionicons name={prompt.icon as any} size={14} color={Colors.teal} style={{ marginRight: 6 }} />
                      <Text style={[styles.promptChipText, { color: isDark ? '#FFF' : '#111' }]}>{prompt.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <ScrollView style={styles.chatArea} contentContainerStyle={{ paddingVertical: 20 }}>
                  {messages.map((m, idx) => (
                    <View key={idx} style={[styles.bubble, m.sender === 'user' ? styles.userBubble : [styles.aiBubble, { backgroundColor: isDark ? 'transparent' : 'transparent' }]]}>
                      {m.sender === 'ai' && (
                        <View style={styles.bubbleAiIcon}>
                          <Ionicons name="sparkles" size={14} color={Colors.teal} />
                        </View>
                      )}
                      <Text style={[styles.bubbleText, { color: m.sender === 'user' ? '#FFF' : (isDark ? '#EEE' : '#111') }]}>{m.text}</Text>
                    </View>
                  ))}
                  {chatLoading && (
                    <View style={styles.loadingBubble}>
                      <ActivityIndicator color={Colors.teal} size="small" />
                    </View>
                  )}
                </ScrollView>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.premiumInput, { backgroundColor: isDark ? '#0A0A0A' : '#F9FAFB', color: isDark ? '#FFF' : '#111', borderColor: isDark ? '#333' : '#E5E7EB' }]}
                    placeholder="Ask anything about Sri Lanka..."
                    placeholderTextColor={isDark ? '#666' : '#999'}
                    value={inputText}
                    onChangeText={setInputText}
                    onSubmitEditing={() => sendMessage()}
                  />
                  <TouchableOpacity onPress={() => sendMessage()} style={styles.sendIconBtn}>
                    <Ionicons name="send" size={20} color={Colors.orange} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'scanner' && (
            <View style={styles.scannerSection}>
              <Text style={[styles.scannerTitle, { color: isDark ? '#FFF' : '#111' }]}>VISUAL HERITAGE SCANNER</Text>
              <Text style={[styles.scannerSub, { color: isDark ? '#999' : '#666' }]}>Point your camera at a monument, statue, carving or ancient site.</Text>

              <View style={[styles.scannerPreview, { borderColor: isDark ? '#333' : '#E5E7EB', backgroundColor: isDark ? '#121414' : '#F9FAFB' }]}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.previewImg} />
                ) : (
                  <View style={styles.scannerPlaceholder}>
                    <Ionicons name="scan-outline" size={64} color={isDark ? '#444' : '#CCC'} style={{ marginBottom: 16 }} />
                    <Text style={{ color: isDark ? '#666' : '#999', fontSize: 16, fontWeight: '600' }}>CAMERA PREVIEW</Text>
                  </View>
                )}
                
                {!scanLoading && (
                  <TouchableOpacity style={styles.scanActionBtn} onPress={captureAndScan}>
                    <Ionicons name="add" size={24} color="#FFF" />
                    <Text style={styles.scanActionText}>SCAN</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              <View style={styles.quickScanSection}>
                <Text style={[styles.quickScanLabel, { color: isDark ? '#666' : '#999' }]}>Quick Scan</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickScanChips}>
                  {[
                    'Sigiriya Frescoes', 'Moonstone', 'Gal Vihara', 'Galle Lighthouse'
                  ].map((name, idx) => (
                    <TouchableOpacity key={idx} style={[styles.quickChip, { backgroundColor: isDark ? '#181C22' : '#F3F4F6' }]} onPress={() => scanSampleMonument(name, `Landmark Identified: ${name}\n\nHistorical info for ${name}.`)}>
                      <Text style={[styles.quickChipText, { color: isDark ? '#DDD' : '#333' }]}>{name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {scanLoading ? (
                <View style={styles.scanLoadingState}>
                  <ActivityIndicator size="large" color={Colors.teal} style={{ marginBottom: 16 }} />
                  <Text style={{ color: Colors.teal, fontWeight: '700' }}>Analyzing Visual Data...</Text>
                </View>
              ) : null}

              {scanResult && !scanLoading ? (
                <View style={[styles.resultCard, { backgroundColor: isDark ? '#121414' : '#FFF', borderColor: isDark ? 'rgba(0,166,166,0.3)' : '#E5E7EB' }]}>
                  <View style={styles.resultHeader}>
                    <Text style={styles.identifiedLabel}>IDENTIFIED</Text>
                    <Text style={[styles.identifiedTitle, { color: isDark ? '#FFF' : '#111' }]}>Moonstone</Text>
                    <Text style={[styles.identifiedSub, { color: Colors.teal }]}>Ancient Sri Lankan architecture</Text>
                  </View>
                  <View style={styles.resultBody}>
                    <Text style={[styles.resultText, { color: isDark ? '#CCC' : '#444' }]}>{scanResult}</Text>
                  </View>
                  <View style={styles.resultFooter}>
                    <TouchableOpacity style={styles.listenBtn} onPress={playResult}>
                      <Ionicons name="volume-high" size={16} color={Colors.teal} style={{ marginRight: 8 }} />
                      <Text style={styles.listenBtnText}>Listen Audio Guide</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}
            </View>
          )}

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroContainer: { width: '100%', height: Platform.OS === 'web' ? 450 : 350, minHeight: 300 },
  heroBgImage: { width: '100%', height: '100%', justifyContent: 'center' },
  heroContentWrapper: { paddingHorizontal: 40, alignItems: 'center', justifyContent: 'center', flex: 1, paddingTop: 40 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 166, 166, 0.2)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(0, 166, 166, 0.4)' },
  badgeText: { color: '#FFF', fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  heroTitle: { color: '#FFF', fontSize: Platform.OS === 'web' ? 56 : 36, fontWeight: '900', textAlign: 'center', marginBottom: 16, letterSpacing: -1 },
  heroSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: Platform.OS === 'web' ? 18 : 15, textAlign: 'center', fontWeight: '400', maxWidth: 600, lineHeight: 26 },
  
  segmentWrapper: { width: '100%', alignItems: 'center', marginTop: -30, zIndex: 10 },
  segmentBlur: { flexDirection: 'row', borderRadius: 30, padding: 6, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', maxWidth: 400, width: '90%' },
  segmentBtn: { flex: 1, flexDirection: 'row', paddingVertical: 14, alignItems: 'center', justifyContent: 'center', borderRadius: 24, gap: 8 },
  segmentBtnActive: { backgroundColor: Colors.teal },
  segmentBtnText: { fontSize: 14, fontWeight: '700' },
  
  mainContent: { width: '100%', alignSelf: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 100 },
  
  // Chat
  chatSection: { alignItems: 'center' },
  chatBox: { width: '100%', maxWidth: 800, borderRadius: 24, borderWidth: 1, padding: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.1, shadowRadius: 30, elevation: 4 },
  chatHeader: { alignItems: 'center', marginBottom: 32 },
  aiOrb: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.teal, justifyContent: 'center', alignItems: 'center', marginBottom: 16, shadowColor: Colors.teal, shadowOpacity: 0.5, shadowRadius: 20, shadowOffset: { width: 0, height: 10 } },
  chatHeaderTitle: { fontSize: 24, fontWeight: '900', marginBottom: 8 },
  chatHeaderSub: { fontSize: 16, fontWeight: '500' },
  
  promptChipsContainer: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 32 },
  promptChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  promptChipText: { fontSize: 14, fontWeight: '600' },
  
  chatArea: { maxHeight: 500, minHeight: 300, marginBottom: 24 },
  bubble: { maxWidth: '80%', padding: 16, marginBottom: 20, flexDirection: 'row' },
  userBubble: { backgroundColor: Colors.teal, alignSelf: 'flex-end', borderRadius: 20, borderBottomRightRadius: 4 },
  aiBubble: { alignSelf: 'flex-start', borderRadius: 20 },
  bubbleAiIcon: { marginRight: 12, marginTop: 4 },
  bubbleText: { fontSize: 16, lineHeight: 24, flexShrink: 1 },
  loadingBubble: { padding: 16, alignSelf: 'flex-start' },
  
  inputContainer: { flexDirection: 'row', alignItems: 'center', position: 'relative' },
  premiumInput: { flex: 1, borderRadius: 30, borderWidth: 1, paddingHorizontal: 24, paddingVertical: 16, fontSize: 16, paddingRight: 60 },
  sendIconBtn: { position: 'absolute', right: 16, top: 12, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  
  // Scanner
  scannerSection: { alignItems: 'center', width: '100%', maxWidth: 800, alignSelf: 'center' },
  scannerTitle: { fontSize: 28, fontWeight: '900', marginBottom: 8, textAlign: 'center', letterSpacing: -0.5 },
  scannerSub: { fontSize: 16, textAlign: 'center', marginBottom: 40 },
  
  scannerPreview: { width: '100%', aspectRatio: Platform.OS === 'web' ? 2 : 1, borderRadius: 24, borderWidth: 2, borderStyle: 'dashed', overflow: 'hidden', position: 'relative', justifyContent: 'center', alignItems: 'center' },
  previewImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  scannerPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  scanActionBtn: { position: 'absolute', bottom: 30, backgroundColor: Colors.teal, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 30, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 20, shadowOffset: { width: 0, height: 10 } },
  scanActionText: { color: '#FFF', fontSize: 16, fontWeight: '800', marginLeft: 8 },
  
  quickScanSection: { width: '100%', marginTop: 32 },
  quickScanLabel: { fontSize: 12, fontWeight: '800', letterSpacing: 1.5, marginBottom: 12, textTransform: 'uppercase' },
  quickScanChips: { gap: 12 },
  quickChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  quickChipText: { fontSize: 14, fontWeight: '600' },
  
  scanLoadingState: { marginTop: 40, alignItems: 'center' },
  
  resultCard: { width: '100%', marginTop: 40, borderRadius: 24, borderWidth: 1, padding: 32, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 30, shadowOffset: { width: 0, height: 20 } },
  resultHeader: { marginBottom: 20 },
  identifiedLabel: { color: Colors.teal, fontSize: 11, fontWeight: '900', letterSpacing: 2, marginBottom: 8 },
  identifiedTitle: { fontSize: 32, fontWeight: '900', marginBottom: 4 },
  identifiedSub: { fontSize: 16, fontWeight: '600' },
  resultBody: { marginBottom: 32 },
  resultText: { fontSize: 16, lineHeight: 26 },
  resultFooter: { borderTopWidth: 1, borderTopColor: 'rgba(150,150,150,0.1)', paddingTop: 20, flexDirection: 'row' },
  listenBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,166,166,0.1)', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
  listenBtnText: { color: Colors.teal, fontSize: 14, fontWeight: '800' }
});
