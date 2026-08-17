// components/CurrencyModal.tsx
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function CurrencyModal({ visible, onClose }: Props) {
  const [usdAmount, setUsdAmount] = useState<string>('10');
  const EXCHANGE_RATE = 305.5; // Example fixed exchange rate (1 USD = 305.5 LKR)

  const parsedUsd = parseFloat(usdAmount) || 0;
  const lkrAmount = (parsedUsd * EXCHANGE_RATE).toLocaleString('en-US', {
    maximumFractionDigits: 2,
  });

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>💵 Currency Converter</Text>
          <Text style={styles.subTitle}>Quick LKR to USD Conversion</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amount in USD ($):</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={usdAmount}
              onChangeText={setUsdAmount}
              placeholder="Enter USD"
            />
          </View>

          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>Estimated Sri Lankan Rupees:</Text>
            <Text style={styles.resultValue}>LKR {lkrAmount}</Text>
            <Text style={styles.rateNote}>1 USD ≈ {EXCHANGE_RATE} LKR</Text>
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
  subTitle: { fontSize: 12, color: '#666', marginBottom: 16 },
  inputContainer: { width: '100%', marginBottom: 16 },
  label: { fontSize: 14, color: '#333', marginBottom: 6, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16 },
  resultBox: { width: '100%', backgroundColor: '#f0f8ff', borderRadius: 10, padding: 16, alignItems: 'center', marginBottom: 16 },
  resultLabel: { fontSize: 13, color: '#555' },
  resultValue: { fontSize: 22, fontWeight: 'bold', color: '#007aff', marginVertical: 4 },
  rateNote: { fontSize: 11, color: '#888' },
  closeButton: { marginTop: 4 },
  closeButtonText: { color: '#888', fontWeight: '600' },
});