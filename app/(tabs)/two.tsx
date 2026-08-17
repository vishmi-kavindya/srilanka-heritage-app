import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';

const HERITAGE_SITES = [
  {
    id: '1',
    name: 'Sigiriya Rock Fortress',
    location: 'Dambulla',
    coords: { lat: 7.9570, lng: 80.7603 },
    desc: 'Ancient palace complex & fortress built by King Kashyapa in the 5th century AD.',
  },
  {
    id: '2',
    name: 'Temple of the Sacred Tooth Relic',
    location: 'Kandy',
    coords: { lat: 7.2936, lng: 80.6413 },
    desc: 'Venerated Buddhist temple housing the relic of the tooth of the Buddha.',
  },
  {
    id: '3',
    name: 'Galle Dutch Fort',
    location: 'Galle',
    coords: { lat: 6.0268, lng: 80.2170 },
    desc: 'UNESCO World Heritage site built first by the Portuguese and fortified by the Dutch.',
  },
  {
    id: '4',
    name: 'Anuradhapura Sacred City',
    location: 'Anuradhapura',
    coords: { lat: 8.3114, lng: 80.4037 },
    desc: 'Ancient capital renowned for well-preserved ruins of ancient Sri Lankan civilization.',
  },
];

export default function MapTabScreen() {
  const openInGoogleMaps = (lat: number, lng: number, name: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open Google Maps');
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🗺️ Heritage Sites Map</Text>
        <Text style={styles.subtitle}>Explore Historical Landmarks across Sri Lanka</Text>
      </View>

      {HERITAGE_SITES.map((site) => (
        <View key={site.id} style={styles.siteCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.siteName}>{site.name}</Text>
            <Text style={styles.siteLocation}>📍 {site.location}</Text>
          </View>
          <Text style={styles.siteDesc}>{site.desc}</Text>

          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => openInGoogleMaps(site.coords.lat, site.coords.lng, site.name)}
          >
            <Text style={styles.buttonText}>🧭 Open in Google Maps</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f7', padding: 16 },
  header: { marginTop: 40, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1d1d1f' },
  subtitle: { fontSize: 14, color: '#86868b', marginTop: 4 },
  siteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  siteName: { fontSize: 16, fontWeight: 'bold', color: '#1d1d1f', flex: 1 },
  siteLocation: { fontSize: 13, color: '#007aff', fontWeight: '600' },
  siteDesc: { fontSize: 13, color: '#555', lineHeight: 18, marginBottom: 14 },
  mapButton: {
    backgroundColor: '#34c759',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
});