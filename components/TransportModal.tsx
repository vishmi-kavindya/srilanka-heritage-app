// components/TransportModal.tsx
import React from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity, Linking, Alert } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function TransportModal({ visible, onClose }: Props) {
  
  const openRideApp = async (appName: 'pickme' | 'uber') => {
    // Standard Deep Links / Web Fallbacks
    const urls = {
      pickme: 'https://pickme.lk/', 
      uber: 'https://m.uber.com/ul/',
    };

    const targetUrl = urls[appName];

    try {
      const supported = await Linking.canOpenURL(targetUrl);
      if (supported) {
        await Linking.openURL(targetUrl);
      } else {
        Alert.alert('Notice', `Unable to open ${appName}. Opening web fallback.`);
        await Linking.openURL(targetUrl);
      }
    } catch (error) {
      console.error(`Error opening ${appName}:`, error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>🚗 Heritage Transport</Text>
          <Text style={styles.subTitle}>Quick Booking to Heritage Sights</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.rideButton, { backgroundColor: '#ff5722' }]} 
              onPress={() => openRideApp('pickme')}
            >
              <Text style={styles.buttonText}>🚕 Book via PickMe</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.rideButton, { backgroundColor: '#000000' }]} 
              onPress={() => openRideApp('uber')}
            >
              <Text style={styles.buttonText}>🚘 Book via Uber</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tipBox}>
            <Text style={styles.tipText}>
              💡 Tip: Tuk-Tuks are widely available for short distances near cultural ruins!
            </Text>
          </View>

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
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  subTitle: { fontSize: 12, color: '#666', marginBottom: 20 },
  buttonContainer: { width: '100%', gap: 12, marginBottom: 16 },
  rideButton: { padding: 14, borderRadius: 10, alignItems: 'center', width: '100%' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  tipBox: { backgroundColor: '#fff8e1', padding: 10, borderRadius: 8, width: '100%', marginBottom: 16 },
  tipText: { fontSize: 12, color: '#856404', textAlign: 'center' },
  closeButton: { marginTop: 4 },
  closeButtonText: { color: '#888', fontWeight: '600' },
});