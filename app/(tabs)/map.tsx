// @ts-nocheck
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Platform, TextInput, Linking, ImageBackground, Image, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { FALLBACK_HERITAGE_SITES, HeritageSite, getTranslatedHeritageSites } from '../../constants/heritageData';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppTheme } from '../../contexts/ThemeContext';
import { getTranslation } from '../../constants/i18n';
import { Colors } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const IS_WEB = Platform.OS === 'web';
const BACKEND_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

// Beautiful images for each category or specific sites
const SITE_IMAGES: { [key: number]: string } = {
  1: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&q=80', // Sigiriya
  2: 'https://images.unsplash.com/photo-1625736300986-5384666d40df?auto=format&fit=crop&q=80', // Kandy Temple
  3: 'https://images.unsplash.com/photo-1627850893345-0d02d847144e?auto=format&fit=crop&q=80', // Polonnaruwa
  4: 'https://images.unsplash.com/photo-1586521995568-39abaa0c2311?auto=format&fit=crop&q=80', // Galle
  5: 'https://images.unsplash.com/photo-1632057999881-2296068224dc?auto=format&fit=crop&q=80', // Anuradhapura
  6: 'https://images.unsplash.com/photo-1624838634563-360da8018e69?auto=format&fit=crop&q=80', // Dambulla
  7: 'https://images.unsplash.com/photo-1616235889700-11239bb49ec0?auto=format&fit=crop&q=80', // Sinharaja
  8: 'https://images.unsplash.com/photo-1582555307399-e68846ce24ec?auto=format&fit=crop&q=80', // Nallur
  9: 'https://images.unsplash.com/photo-1635317765106-cf0f95b369c3?auto=format&fit=crop&q=80', // Yapahuwa
  10: 'https://images.unsplash.com/photo-1621245050529-67d9f7831fdb?auto=format&fit=crop&q=80' // Mihintale
};

const MAP_BG = 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000'; // Abstract Map / Travel

export default function HeritageMapScreen() {
  const { lang } = useLanguage();
  const { isDark, colors } = useAppTheme();
  const t = getTranslation(lang);
  const translatedSites = useMemo(() => getTranslatedHeritageSites(lang), [lang]);

  const [selectedSiteId, setSelectedSiteId] = useState<number>(1);
  const selectedSite = useMemo(
    () => translatedSites.find(s => s.id === selectedSiteId) ?? translatedSites[0],
    [translatedSites, selectedSiteId]
  );
  const [days, setDays] = useState<number>(3);
  const [category, setCategory] = useState<string>('Archaeology');
  const [itinerary, setItinerary] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const [routeDistance, setRouteDistance] = useState<string | null>(null);
  const [routeDuration, setRouteDuration] = useState<number | null>(null);

  const categories = ['Archaeology', 'Buddhist Heritage', 'Colonial Heritage'];

  const filteredSites = useMemo(() => {
    if (!searchQuery) return [];
    return translatedSites.filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, translatedSites]);

  const iframeRef = useRef<any>(null);

  // Request Location & track user's position
  useEffect(() => {
    let subscription: any = null;
    const startTracking = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setCurrentLocation({ latitude: 6.9348, longitude: 79.8489 });
          return;
        }

        const initial = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: initial.coords.latitude,
          longitude: initial.coords.longitude
        });

        subscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Balanced, timeInterval: 10000, distanceInterval: 10 },
          (location) => {
            setCurrentLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            });
          }
        );
      } catch (err) {
        setCurrentLocation({ latitude: 6.9348, longitude: 79.8489 });
      }
    };
    startTracking();
    return () => {
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, []);

  // Sync selected site & user location to iframe Leaflet Map
  useEffect(() => {
    if (iframeRef.current && IS_WEB) {
      iframeRef.current.contentWindow?.postMessage(
        { type: 'SET_MAP_STATE', siteId: selectedSiteId, userLocation: currentLocation },
        '*'
      );
    }
  }, [selectedSiteId, currentLocation]);

  // Sync Leaflet Map messages to React Native State
  useEffect(() => {
    if (!IS_WEB) return;
    const handleMapMessage = (event: MessageEvent) => {
      if (event.data) {
        if (event.data.type === 'SELECT_SITE') {
          setSelectedSiteId(Number(event.data.siteId));
          setRouteDistance(null);
          setRouteDuration(null);
        } else if (event.data.type === 'ROUTE_CALCULATED') {
          setRouteDistance(event.data.distanceKm);
          setRouteDuration(event.data.durationMinutes);
        }
      }
    };
    window.addEventListener('message', handleMapMessage);
    return () => window.removeEventListener('message', handleMapMessage);
  }, []);

  const mapHtmlContent = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
        <style>
          html, body, #map { width: 100%; height: 100%; margin: 0; padding: 0; background: #0A0E27; }
          .custom-marker {
            display: flex; justify-content: center; align-items: center;
            width: 36px !important; height: 36px !important;
            background: rgba(255, 255, 255, 0.9);
            border: 2px solid #19A974; border-radius: 50%;
            font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            cursor: pointer; transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          }
          .custom-marker.active {
            transform: scale(1.3) !important;
            background: #19A974; color: #FFFFFF;
            border-color: #FFFFFF; box-shadow: 0 8px 24px rgba(25,169,116,0.6);
            z-index: 1000 !important;
          }
          .user-pulse {
            width: 16px; height: 16px; background: #0288D1; border: 2.5px solid #FFFFFF;
            border-radius: 50%; box-shadow: 0 0 12px rgba(2, 136, 209, 0.8); position: relative;
          }
          .user-pulse::after {
            content: ''; width: 36px; height: 36px; border: 2px solid #0288D1;
            border-radius: 50%; position: absolute; top: -12.5px; left: -12.5px;
            animation: pulse 2s ease-out infinite; opacity: 0;
          }
          @keyframes pulse { 0% { transform: scale(0.5); opacity: 0.8; } 100% { transform: scale(1.5); opacity: 0; } }
          .route-line { stroke-dasharray: 10, 10; animation: routeFlow 1s linear infinite; }
          @keyframes routeFlow { to { stroke-dashoffset: -20; } }
          .leaflet-popup-content-wrapper {
            background: rgba(26,26,26,0.95) !important; color: #FFFFFF !important;
            border: 1px solid rgba(255,255,255,0.1) !important; border-radius: 16px !important;
            padding: 8px !important; box-shadow: 0 12px 32px rgba(0,0,0,0.4) !important; backdrop-filter: blur(8px);
          }
          .leaflet-popup-tip { background: rgba(26,26,26,0.95) !important; }
          .popup-title { font-family: -apple-system, system-ui, sans-serif; font-size: 14px; font-weight: 800; color: #5FFFB5; margin-bottom: 4px; }
          .popup-desc { font-family: -apple-system, system-ui, sans-serif; font-size: 12px; color: #B0BEC5; }
          .leaflet-control-attribution { display: none !important; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map', { center: [7.8731, 80.7718], zoom: 7, zoomControl: false });
          L.control.zoom({ position: 'bottomright' }).addTo(map);

          // Premium Dark Basemap
          L.tileLayer('https://maps.geoapify.com/v1/tile/dark-matter/{z}/{x}/{y}.png?apiKey=1c06f2d0292d4601b5cda6096980f16b', {
            maxZoom: 19,
            attribution: 'Map data © OpenStreetMap contributors, © Geoapify'
          }).addTo(map);

          const sites = [
            { id: 1, name: 'Sigiriya', lat: 7.9570, lng: 80.7603, category: 'Archaeology', icon: 'business-outline' },
            { id: 2, name: 'Kandy Temple', lat: 7.2936, lng: 80.6413, category: 'Buddhist', icon: 'flower-outline' },
            { id: 3, name: 'Polonnaruwa', lat: 7.9645, lng: 81.0022, category: 'Archaeology', icon: 'library-outline' },
            { id: 4, name: 'Galle Fort', lat: 6.0267, lng: 80.2170, category: 'Colonial', icon: 'shield-outline' },
            { id: 5, name: 'Anuradhapura', lat: 8.3500, lng: 80.3960, category: 'Buddhist', icon: 'compass-outline' },
            { id: 6, name: 'Dambulla', lat: 7.8564, lng: 80.6517, category: 'Buddhist', icon: 'home-outline' },
            { id: 7, name: 'Sinharaja', lat: 6.3986, lng: 80.4194, category: 'Nature', icon: 'leaf-outline' },
            { id: 8, name: 'Nallur (Jaffna)', lat: 9.6744, lng: 80.0309, category: 'Hindu', icon: 'flame-outline' },
            { id: 9, name: 'Yapahuwa', lat: 7.8139, lng: 80.2589, category: 'Archaeology', icon: 'business-outline' },
            { id: 10, name: 'Mihintale', lat: 8.3514, lng: 80.5181, category: 'Buddhist', icon: 'analytics-outline' }
          ];

          const markers = {};

          sites.forEach(site => {
            const customIcon = L.divIcon({ className: 'custom-marker', html: '<ion-icon name="' + site.icon + '"></ion-icon>', iconSize: [36, 36], iconAnchor: [18, 18] });
            const marker = L.marker([site.lat, site.lng], { icon: customIcon }).addTo(map);
            marker.bindPopup(\`<div class="popup-title">\${site.name}</div><div class="popup-desc">\${site.category}</div>\`);
            
            marker.on('click', () => {
              window.parent.postMessage({ type: 'SELECT_SITE', siteId: site.id }, '*');
              Object.keys(markers).forEach(id => {
                const el = markers[id].getElement();
                if (el) el.classList.remove('active');
              });
              const el = marker.getElement();
              if (el) el.classList.add('active');
            });
            markers[site.id] = marker;
          });

          let userMarker = null;
          let routeLine = null;

          window.addEventListener('message', function(event) {
            if (event.data && event.data.type === 'SET_MAP_STATE') {
              const { siteId, userLocation } = event.data;
              const site = sites.find(s => s.id === siteId);
              
              if (userLocation) {
                const userLatLng = [userLocation.latitude, userLocation.longitude];
                if (!userMarker) {
                  const userIcon = L.divIcon({ className: 'user-location-marker', html: '<div class="user-pulse"></div>', iconSize: [24, 24], iconAnchor: [12, 12] });
                  userMarker = L.marker(userLatLng, { icon: userIcon }).addTo(map);
                } else {
                  userMarker.setLatLng(userLatLng);
                }
              }

              if (site) {
                const siteLatLng = [site.lat, site.lng];
                const marker = markers[site.id];
                
                if (userLocation) {
                  const userLatLng = [userLocation.latitude, userLocation.longitude];
                  
                  fetch('https://api.geoapify.com/v1/routing?waypoints=' + userLocation.latitude + ',' + userLocation.longitude + '|' + site.lat + ',' + site.lng + '&mode=drive&apiKey=1c06f2d0292d4601b5cda6096980f16b')
                    .then(response => response.json())
                    .then(data => {
                      if (data.features && data.features.length > 0) {
                        const feature = data.features[0];
                        const coords = feature.geometry.coordinates[0].map(coord => [coord[1], coord[0]]);
                        if (routeLine) map.removeLayer(routeLine);
                        routeLine = L.polyline(coords, { color: '#19A974', weight: 4, opacity: 0.9, className: 'route-line' }).addTo(map);
                        map.fitBounds(routeLine.getBounds(), { padding: [50, 50], animate: true });
                        window.parent.postMessage({ type: 'ROUTE_CALCULATED', distanceKm: (feature.properties.distance / 1000).toFixed(1), durationMinutes: Math.round(feature.properties.time / 60) }, '*');
                      }
                    }).catch(err => {
                      if (routeLine) map.removeLayer(routeLine);
                      routeLine = L.polyline([userLatLng, siteLatLng], { color: '#19A974', weight: 4, opacity: 0.8, className: 'route-line' }).addTo(map);
                      map.fitBounds(L.latLngBounds([userLatLng, siteLatLng]), { padding: [50, 50], animate: true });
                    });
                } else {
                  map.setView(siteLatLng, 9.5, { animate: true });
                }

                if (marker) marker.openPopup();

                Object.keys(markers).forEach(id => {
                  const el = markers[id].getElement();
                  if (el) el.classList.remove('active');
                });
                if (marker) {
                  const el = marker.getElement();
                  if (el) el.classList.add('active');
                }
              }
            }
          });
        </script>
      </body>
      </html>
    `;
  }, []);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/itinerary/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days, category }),
      });
      const data = await response.json();
      setItinerary(data.itinerary || []);
    } catch (e) {
      if (days <= 3) {
        setItinerary([
          { day: 1, location: 'Cultural Triangle (Sigiriya & Dambulla)', highlights: 'Ascend Sigiriya Rock Fortress, explore Dambulla Cave Temple', distance: '160 km from Colombo' },
          { day: 2, location: 'Polonnaruwa Ancient Kingdom', highlights: 'Gal Vihara rock carvings, Parakrama Samudra lake', distance: '65 km from Dambulla' },
          { day: 3, location: 'Sacred Hill Capital - Kandy', highlights: 'Temple of the Tooth, Royal Botanical Gardens, Lake stroll', distance: '135 km from Polonnaruwa' }
        ]);
      } else {
        setItinerary([
          { day: 1, location: 'Cultural Triangle (Sigiriya & Dambulla)', highlights: 'Sigiriya Lion Fortress & Dambulla Golden Cave Temple', distance: '160 km' },
          { day: 2, location: 'Anuradhapura World Heritage City', highlights: 'Sri Maha Bodhi, Ruwanwelisaya, Twin Ponds', distance: '75 km' },
          { day: 3, location: 'Polonnaruwa & Minneriya Wildlife', highlights: 'Gal Vihara statues & Elephant safari gathering', distance: '100 km' },
          { day: 4, location: 'Kandy Sacred City', highlights: 'Temple of Tooth Relic & Esala Perahera grounds', distance: '140 km' },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const pageBg = isDark ? '#0E0E0E' : '#F8F9FA';
  const textMain = isDark ? '#FFFFFF' : '#1A1A1A';
  const textSub = isDark ? '#A0AEC0' : '#4A5568';
  const cardBg = isDark ? '#1A202C' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';

  return (
    <ScrollView style={[styles.container, { backgroundColor: pageBg }]} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* 📸 Cinematic Page Intro */}
      <View style={styles.heroContainer}>
        <ImageBackground source={{ uri: MAP_BG }} style={styles.heroBgImage} imageStyle={{ opacity: isDark ? 0.6 : 0.8 }}>
          <LinearGradient colors={['rgba(0,0,0,0.4)', isDark ? '#080909' : '#F8F9FA']} style={StyleSheet.absoluteFill} />
          <View style={styles.heroContentWrapper}>
            <View style={styles.badge}>
              <Ionicons name="map" size={12} color="#00A6A6" style={{ marginRight: 6 }} />
              <Text style={styles.badgeText}>INTERACTIVE MAP</Text>
            </View>
            <Text style={styles.heroTitle}>{t.mapHeader || "Explore Sri Lanka differently"}</Text>
            <Text style={styles.heroSubtitle}>
              {t.mapSub || "Discover heritage, attractions, transport, hotels and essential services across the island."}
            </Text>
            <TouchableOpacity style={styles.heroBtn} onPress={() => {
              // Scroll to map
            }}>
              <Text style={styles.heroBtnText}>Explore the Map</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>

      {/* 🗺️ LARGE FULL-WIDTH MAP WITH FLOATING UI */}
      <View style={styles.mapSection}>
        <View style={styles.mapWrapper}>
          {IS_WEB ? (
            <View style={styles.webIframeContainer}>
              {React.createElement('iframe', {
                ref: iframeRef,
                srcDoc: mapHtmlContent,
                style: { width: '100%', height: '100%', border: 'none' }
              })}
            </View>
          ) : (
            <View style={[styles.mobileMapFallback, { backgroundColor: isDark ? '#121414' : '#E5E7EB' }]}>
              <Ionicons name="map-outline" size={48} color={textSub} />
              <Text style={[styles.mobileMapText, { color: textMain }]}>Interactive Map Available on Web</Text>
            </View>
          )}

          {/* Floating Search */}
          <View style={styles.floatingSearchContainer}>
            <BlurView intensity={isDark ? 40 : 80} tint={isDark ? "dark" : "light"} style={styles.searchBarGlass}>
              <Ionicons name="search" size={20} color={isDark ? '#FFF' : '#4A5568'} style={{ marginRight: 12 }} />
              <TextInput
                style={[styles.searchInput, { color: isDark ? '#FFF' : '#1A1A1A' }]}
                placeholder="Search destinations..."
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)'}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color={isDark ? '#FFF' : '#4A5568'} />
                </TouchableOpacity>
              )}
            </BlurView>
            {/* Search Results */}
            {searchQuery.length > 0 && filteredSites.length > 0 && (
              <View style={[styles.searchResults, { backgroundColor: cardBg, borderColor }]}>
                {filteredSites.map((site) => (
                  <TouchableOpacity
                    key={site.id}
                    style={[styles.searchItem, { borderBottomColor: borderColor }]}
                    onPress={() => { setSelectedSiteId(site.id); setSearchQuery(''); }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="location" size={14} color={textMain} style={{ marginRight: 6 }} />
                      <Text style={[styles.searchItemName, { color: textMain }]}>{site.name}</Text>
                    </View>
                    <Text style={[styles.searchItemDist, { color: textSub, marginLeft: 20 }]}>{site.district}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Floating Filter Chips */}
          <View style={styles.floatingChipsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
              {translatedSites.map((site) => {
                const isActive = selectedSiteId === site.id;
                return (
                  <TouchableOpacity
                    key={site.id}
                    style={[
                      styles.siteChip,
                      { backgroundColor: isActive ? Colors.primary : (isDark ? 'rgba(18,20,20,0.9)' : 'rgba(255,255,255,0.9)'), borderColor: isActive ? Colors.primary : borderColor }
                    ]}
                    onPress={() => setSelectedSiteId(site.id)}
                  >
                    <Text style={[styles.siteChipText, { color: isActive ? '#FFFFFF' : textMain }]}>
                      {site.name.split(' ')[0]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Floating Destination Panel */}
          {selectedSite && (
            <View style={styles.floatingDestinationPanel}>
              <BlurView intensity={isDark ? 80 : 100} tint={isDark ? "dark" : "light"} style={[styles.panelBlur, { borderColor }]}>
                <View style={styles.panelContent}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.panelTitle, { color: textMain }]}>{selectedSite.name}</Text>
                    <Text style={[styles.panelMeta, { color: textSub }]}>⭐ 4.9 • 📍 {selectedSite.district}</Text>
                  </View>
                  <View style={styles.panelActions}>
                    <TouchableOpacity style={styles.panelBtnPrimary}>
                      <Text style={styles.panelBtnTextPrimary}>View Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.panelBtnSecondary, { borderColor }]}
                      onPress={() => Linking.openURL(selectedSite.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${selectedSite.latitude},${selectedSite.longitude}`)}
                    >
                      <Text style={[styles.panelBtnTextSecondary, { color: textMain }]}>Directions</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </BlurView>
            </View>
          )}
        </View>
      </View>

      {/* PLAN YOUR JOURNEY */}
      <View style={[styles.plannerSection, { maxWidth: 1200, alignSelf: 'center', width: '100%', paddingHorizontal: 20 }]}>
        <View style={styles.plannerHeader}>
          <Text style={[styles.sectionEyebrow, { color: Colors.primary }]}>ITINERARY BUILDER</Text>
          <Text style={[styles.sectionHeading, { color: textMain }]}>Plan Your Journey</Text>
          <Text style={[styles.sectionSub, { color: textSub }]}>Let our smart engine craft the perfect Sri Lankan itinerary tailored to your interests and time.</Text>
        </View>

        <View style={[styles.plannerCard, { backgroundColor: isDark ? '#121414' : '#FFFFFF', borderColor }]}>
          <View style={styles.plannerGrid}>
            <View style={styles.plannerCol}>
              <Text style={[styles.filterLabel, { color: textMain }]}>DURATION</Text>
              <View style={styles.filterRow}>
                {[1, 3, 7].map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.filterPill, { backgroundColor: days === d ? Colors.primary : isDark ? '#181C22' : '#F3F4F6' }]}
                    onPress={() => setDays(d)}
                  >
                    <Text style={[styles.filterPillText, { color: days === d ? '#FFF' : textMain }]}>{d} Days</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.plannerCol}>
              <Text style={[styles.filterLabel, { color: textMain }]}>INTEREST</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.filterPill, { backgroundColor: category === cat ? Colors.primary : isDark ? '#181C22' : '#F3F4F6' }]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={[styles.filterPillText, { color: category === cat ? '#FFF' : textMain }]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <TouchableOpacity style={styles.generateBtn} onPress={generatePlan}>
            <LinearGradient colors={[Colors.primary, '#D97706']} style={styles.generateBtnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Text style={styles.generateBtnText}>{loading ? 'Crafting...' : 'Generate Itinerary'}</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFF" style={{ marginLeft: 8 }} />
            </LinearGradient>
          </TouchableOpacity>

          {itinerary.length > 0 && (
            <View style={styles.itineraryContainer}>
              {itinerary.map((item, idx) => (
                <View key={idx} style={[styles.itineraryDay, { borderLeftColor: Colors.primary }]}>
                  <Text style={[styles.dayLabel, { color: Colors.primary }]}>DAY {item.day}</Text>
                  <Text style={[styles.dayLoc, { color: textMain }]}>{item.location}</Text>
                  <Text style={[styles.dayHigh, { color: textSub }]}>{item.highlights}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Hero
  heroContainer: { width: '100%', height: Platform.OS === 'web' ? 450 : 350, minHeight: 300 },
  heroBgImage: { width: '100%', height: '100%', justifyContent: 'center' },
  heroContentWrapper: { paddingHorizontal: 40, alignItems: 'center', justifyContent: 'center', flex: 1, paddingTop: 40 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 166, 166, 0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(0, 166, 166, 0.3)' },
  badgeText: { color: '#00A6A6', fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  heroTitle: { fontSize: Platform.OS === 'web' ? 56 : 36, fontWeight: '900', letterSpacing: -1, marginBottom: 16, color: '#FFF', textAlign: 'center' },
  heroSubtitle: { fontSize: Platform.OS === 'web' ? 18 : 15, lineHeight: 26, fontWeight: '400', maxWidth: 600, color: '#E5E7EB', textAlign: 'center', marginBottom: 24 },
  heroBtn: { backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 30 },
  heroBtnText: { color: '#FFF', fontSize: 14, fontWeight: '800', letterSpacing: 0.5 },

  // Map Section
  mapSection: { width: '100%', height: Platform.OS === 'web' ? 600 : 500, minHeight: 400, position: 'relative' },
  mapWrapper: { flex: 1 },
  webIframeContainer: { flex: 1 },
  mobileMapFallback: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mobileMapText: { marginTop: 12, fontSize: 14, fontWeight: '600' },

  // Floating UI
  floatingSearchContainer: { position: 'absolute', top: 20, left: '50%', transform: [{ translateX: Platform.OS === 'web' ? '-50%' : 0 }], width: Platform.OS === 'web' ? 400 : '90%', alignSelf: 'center', zIndex: 100 },
  searchBarGlass: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 20, shadowOffset: { width: 0, height: 10 } },
  searchInput: { flex: 1, fontSize: 15, fontWeight: '500' },
  searchResults: { position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 8, borderRadius: 16, borderWidth: 1, overflow: 'hidden', zIndex: 50, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 20 },
  searchItem: { padding: 16, borderBottomWidth: 1 },
  searchItemName: { fontSize: 15, fontWeight: '700' },
  searchItemDist: { fontSize: 12, marginTop: 2 },

  floatingChipsContainer: { position: 'absolute', top: 90, width: '100%', zIndex: 90 },
  siteChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, marginRight: 8 },
  siteChipText: { fontSize: 13, fontWeight: '700' },

  floatingDestinationPanel: { position: 'absolute', bottom: 30, left: '50%', transform: [{ translateX: Platform.OS === 'web' ? '-50%' : 0 }], width: Platform.OS === 'web' ? 500 : '90%', alignSelf: 'center', zIndex: 100 },
  panelBlur: { borderRadius: 24, borderWidth: 1, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 30, shadowOffset: { width: 0, height: 15 } },
  panelContent: { padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 },
  panelTitle: { fontSize: 20, fontWeight: '900', marginBottom: 4 },
  panelMeta: { fontSize: 13, fontWeight: '600' },
  panelActions: { flexDirection: 'row', gap: 10 },
  panelBtnPrimary: { backgroundColor: Colors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  panelBtnTextPrimary: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  panelBtnSecondary: { backgroundColor: 'transparent', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  panelBtnTextSecondary: { fontSize: 13, fontWeight: '800' },

  // Planner
  plannerSection: { paddingVertical: 80 },
  plannerHeader: { marginBottom: 40, alignItems: IS_WEB ? 'center' : 'flex-start' },
  sectionEyebrow: { fontSize: 12, fontWeight: '800', letterSpacing: 2, marginBottom: 8 },
  sectionHeading: { fontSize: 36, fontWeight: '900', marginBottom: 12, letterSpacing: -1 },
  sectionSub: { fontSize: 16, lineHeight: 24, maxWidth: 600, textAlign: IS_WEB ? 'center' : 'left' },

  plannerCard: { borderRadius: 24, padding: 32, borderWidth: 1, shadowOpacity: 0.05, shadowRadius: 24, shadowOffset: { width: 0, height: 12 } },
  plannerGrid: { flexDirection: IS_WEB ? 'row' : 'column', gap: 24, marginBottom: 32 },
  plannerCol: { flex: 1 },
  filterLabel: { fontSize: 12, fontWeight: '800', marginBottom: 12, letterSpacing: 1 },
  filterRow: { flexDirection: 'row', gap: 10 },
  filterPill: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 20 },
  filterPillText: { fontSize: 14, fontWeight: '700' },
  
  generateBtn: { borderRadius: 16, overflow: 'hidden' },
  generateBtnGradient: { flexDirection: 'row', paddingVertical: 18, justifyContent: 'center', alignItems: 'center' },
  generateBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },
  
  itineraryContainer: { marginTop: 40, paddingTop: 32, borderTopWidth: 1, borderTopColor: 'rgba(150,150,150,0.1)' },
  itineraryDay: { borderLeftWidth: 2, paddingLeft: 20, paddingBottom: 32 },
  dayLabel: { fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginBottom: 6 },
  dayLoc: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
  dayHigh: { fontSize: 15, lineHeight: 24 }
});
