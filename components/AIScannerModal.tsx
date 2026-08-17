// components/AIScannerModal.tsx
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const BACKEND_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function AIScannerModal({ visible, onClose }: Props) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const takeAndScanPhoto = async () => {
    // 1. Camera Permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permission is required to scan monuments.');
      return;
    }

    // 2. Open Camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0].base64) {
      setImageUri(result.assets[0].uri);
      setLoading(true);
      setAiResult('Analyzing heritage monument with Gemini AI...');

      try {
        // 3. Send to Backend AI API
        const response = await fetch(`${BACKEND_URL}/api/ai/scan-monument`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: result.assets[0].base64 }),
        });

        const data = await response.json();
        setAiResult(data.result || 'Could not identify monument.');
      } catch (err) {
        setAiResult('Error scanning image. Make sure Backend server is running.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>📷 AI Monument Scanner</Text>
          
          {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}

          <Text style={styles.resultText}>{aiResult || 'Take a photo of a Sri Lankan statue, painting, or ruin to identify it.'}</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#007aff" style={{ marginVertical: 10 }} />
          ) : (
            <TouchableOpacity style={styles.scanButton} onPress={takeAndScanPhoto}>
              <Text style={styles.scanButtonText}>📸 Capture & Scan</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '85%', backgroundColor: '#fff', borderRadius: 16, padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  previewImage: { width: 180, height: 180, borderRadius: 12, marginVertical: 10 },
  resultText: { fontSize: 14, color: '#333', textAlign: 'center', marginVertical: 12, lineHeight: 20 },
  scanButton: { backgroundColor: '#007aff', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, marginVertical: 8 },
  scanButtonText: { color: '#fff', fontWeight: 'bold' },
  closeButton: { marginTop: 8 },
  closeButtonText: { color: '#888', fontWeight: '600' },
});