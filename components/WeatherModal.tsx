// components/WeatherModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function WeatherModal({ visible, onClose }: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [weatherData, setWeatherData] = useState<any>(null);

  useEffect(() => {
    if (visible) {
      fetchWeather();
    }
  }, [visible]);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      // Colombo/General SL coordinates lookup from Open-Meteo API
      const response = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=6.9271&longitude=79.8612&current_weather=true'
      );
      const data = await response.json();
      setWeatherData(data.current_weather);
    } catch (error) {
      console.error("Error fetching weather:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>🌤️ Heritage Site Weather</Text>
          <Text style={styles.subTitle}>Live Forecast for Tour Planning</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#007aff" style={{ marginVertical: 20 }} />
          ) : weatherData ? (
            <View style={styles.weatherInfoBox}>
              <Text style={styles.tempText}>{weatherData.temperature}°C</Text>
              <Text style={styles.conditionText}>
                Wind Speed: {weatherData.windspeed} km/h
              </Text>
              <View style={styles.tipBox}>
                <Text style={styles.tipText}>
                  💡 {weatherData.temperature > 28 ? 'Sunny & Warm: Wear sunscreen & bring water!' : 'Pleasant weather for exploring historical sites.'}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={{ marginVertical: 20 }}>Failed to load weather info.</Text>
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
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  subTitle: { fontSize: 12, color: '#666', marginBottom: 16 },
  weatherInfoBox: { width: '100%', backgroundColor: '#f0f8ff', borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 16 },
  tempText: { fontSize: 36, fontWeight: 'bold', color: '#007aff' },
  conditionText: { fontSize: 14, color: '#555', marginTop: 4 },
  tipBox: { marginTop: 12, backgroundColor: '#e6f2ff', padding: 10, borderRadius: 8, width: '100%' },
  tipText: { fontSize: 12, color: '#0056b3', textAlign: 'center' },
  closeButton: { marginTop: 4 },
  closeButtonText: { color: '#888', fontWeight: '600' },
});