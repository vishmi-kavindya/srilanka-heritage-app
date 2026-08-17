import React, { useState, useMemo, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Platform, TextInput } from 'react-native';
import * as Location from 'expo-location';
import { FALLBACK_HERITAGE_SITES, HeritageSite, getTranslatedHeritageSites } from '../../constants/heritageData';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppTheme } from '../../contexts/ThemeContext';
import { getTranslation } from '../../constants/i18n';
import { Colors, Shadow } from '../../constants/theme';

const BACKEND_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

export default function HeritageMapScreen() {
  const { lang } = useLanguage();
  const { isDark, colors } = useAppTheme();
  const t = getTranslation(lang);
  const translatedSites = useMemo(() => getTranslatedHeritageSites(lang), [lang]);
  
  // Track selected ID only — so it stays correct when language changes
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

  const SITE_TRANSIT_INFO: { [key: number]: { bus: string; train: string } } = {
    1: {
      bus: "Bus #48 (Colombo Fort ➔ Dambulla) then local transfer to Sigiriya (~4.5 hrs, ~750 LKR)",
      train: "Express Train (Colombo Fort ➔ Habarana) then 20-min Tuk-Tuk (~5.0 hrs, ~600 LKR)"
    },
    2: {
      bus: "Bus #01 (Colombo Fort ➔ Kandy). Runs every 15 minutes (~3.5 hrs, ~450 LKR)",
      train: "Intercity Express Train (Colombo Fort ➔ Kandy Station) (~2.5 hrs, ~800 LKR)"
    },
    3: {
      bus: "Bus #48-1 (Colombo Fort ➔ Polonnaruwa direct) (~6.0 hrs, ~900 LKR)",
      train: "Galoya Express Train (Colombo Fort ➔ Polonnaruwa Station) (~5.5 hrs, ~700 LKR)"
    },
    4: {
      bus: "Highway Express Bus EX-01 (Colombo Makumbura ➔ Galle) (~2.0 hrs, ~700 LKR)",
      train: "Coastal Line Express (Colombo Fort ➔ Galle Station) (~2.5 hrs, ~500 LKR)"
    },
    5: {
      bus: "Bus #04 or #57 (Colombo Fort ➔ Anuradhapura) (~5.0 hrs, ~800 LKR)",
      train: "Yal Devi or Northern Express Train (Colombo Fort ➔ Anuradhapura) (~4.0 hrs, ~1000 LKR)"
    },
    6: {
      bus: "Bus #48 (Colombo Fort ➔ Kaduruwela, stop at Dambulla Town) (~4.0 hrs, ~700 LKR)",
      train: "Express Train (Colombo Fort ➔ Habarana) then local bus to Dambulla (~4.5 hrs, ~600 LKR)"
    },
    7: {
      bus: "Bus #98 (Colombo Fort ➔ Ratnapura) then local bus to Kalawana (~4.0 hrs, ~500 LKR)",
      train: "No direct train route available. Recommended to travel by bus or hire a private vehicle."
    },
    8: {
      bus: "Direct Luxury AC Sleeper Bus (Colombo Fort ➔ Jaffna Nallur) (~8.0 hrs, ~2500 LKR)",
      train: "Uttara Devi Intercity Express Train (Colombo Fort ➔ Jaffna Station) (~6.0 hrs, ~1800 LKR)"
    },
    9: {
      bus: "Bus #57 (Colombo Fort ➔ Anuradhapura, stop at Maho Town) (~4.0 hrs, ~600 LKR)",
      train: "Northern Railway Line Train (Colombo Fort ➔ Maho Junction Station) (~3.5 hrs, ~500 LKR)"
    },
    10: {
      bus: "Bus #57 (Colombo Fort ➔ Anuradhapura) then local shuttle to Mihintale (~5.5 hrs, ~850 LKR)",
      train: "Weekend Mihintale Special Train or Northern Train to Anuradhapura then Tuk-Tuk (~4.5 hrs, ~800 LKR)"
    }
  };

  const transitTimes = useMemo(() => {
    if (!routeDistance) return null;
    const distance = parseFloat(routeDistance);
    
    // Tuk-Tuk average speed ~ 35 km/h
    const tukHrs = distance / 35;
    const tukTime = tukHrs > 1 
      ? `${Math.floor(tukHrs)}h ${Math.round((tukHrs % 1) * 60)}m` 
      : `${Math.round(tukHrs * 60)}m`;

    // Bicycle average speed ~ 15 km/h
    const bikeHrs = distance / 15;
    const bikeTime = bikeHrs > 1 
      ? `${Math.floor(bikeHrs)}h ${Math.round((bikeHrs % 1) * 60)}m` 
      : `${Math.round(bikeHrs * 60)}m`;

    // Foot (Walking) average speed ~ 5 km/h
    const footHrs = distance / 5;
    const footTime = footHrs > 24 
      ? `${Math.floor(footHrs / 24)}d ${Math.round(footHrs % 24)}h` 
      : `${Math.floor(footHrs)}h ${Math.round((footHrs % 1) * 60)}m`;

    return { tukTime, bikeTime, footTime };
  }, [routeDistance]);

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
          // Fallback to Colombo Fort (Colombo center)
          setCurrentLocation({ latitude: 6.9348, longitude: 79.8489 });
          return;
        }

        const initial = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: initial.coords.latitude,
          longitude: initial.coords.longitude
        });

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 10000,
            distanceInterval: 10,
          },
          (location) => {
            setCurrentLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            });
          }
        );
      } catch (err) {
        // Fallback to Colombo Fort
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
    if (iframeRef.current && Platform.OS === 'web') {
      iframeRef.current.contentWindow?.postMessage(
        {
          type: 'SET_MAP_STATE',
          siteId: selectedSiteId,
          userLocation: currentLocation
        },
        '*'
      );
    }
  }, [selectedSiteId, currentLocation]);

  // Sync Leaflet Map messages to React Native State
  useEffect(() => {
    if (Platform.OS !== 'web') return;
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
        <style>
          html, body, #map {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            background: #0A0E27;
          }
          /* Custom marker icons */
          .custom-marker {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 32px !important;
            height: 32px !important;
            background: #12183A;
            border: 2px solid #F5A623;
            border-radius: 50%;
            color: #FFFFFF;
            font-size: 14px;
            box-shadow: 0 0 10px rgba(245, 166, 35, 0.6);
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .custom-marker.active {
            background: #F5A623;
            color: #0A0E27;
            border-color: #FFFFFF;
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.9);
          }
          /* User Location Pulsing Marker */
          .user-location-marker {
            width: 24px !important;
            height: 24px !important;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .user-pulse {
            width: 14px;
            height: 14px;
            background: #0288D1;
            border: 2px solid #FFFFFF;
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(2, 136, 209, 0.8);
            position: relative;
          }
          .user-pulse::after {
            content: '';
            width: 30px;
            height: 30px;
            border: 2px solid #0288D1;
            border-radius: 50%;
            position: absolute;
            top: -10px;
            left: -10px;
            animation: pulse 1.8s ease-out infinite;
            opacity: 0;
          }
          @keyframes pulse {
            0% {
              transform: scale(0.5);
              opacity: 0.8;
            }
            100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
          /* Flowing route line dashes */
          .route-line {
            stroke-dasharray: 8, 8;
            animation: routeFlow 1s linear infinite;
          }
          @keyframes routeFlow {
            to {
              stroke-dashoffset: -16;
            }
          }
          /* Dark theme Leaflet Popups */
          .leaflet-popup-content-wrapper {
            background: #12183A !important;
            color: #FFFFFF !important;
            border: 1px solid rgba(255,255,255,0.15) !important;
            border-radius: 12px !important;
            padding: 4px !important;
            box-shadow: 0 8px 16px rgba(0,0,0,0.5) !important;
          }
          .leaflet-popup-tip {
            background: #12183A !important;
            border: 1px solid rgba(255,255,255,0.15) !important;
          }
          .popup-title {
            font-family: sans-serif;
            font-size: 13px;
            font-weight: 800;
            color: #F5A623;
            margin-bottom: 3px;
          }
          .popup-desc {
            font-family: sans-serif;
            font-size: 11px;
            color: #B0BEC5;
          }
          /* Hide default leaflet attribution to save space */
          .leaflet-control-attribution {
            display: none !important;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map', {
            center: [7.8731, 80.7718],
            zoom: 7,
            zoomControl: true
          });

          L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19
          }).addTo(map);

          const sites = [
            { id: 1, name: 'Sigiriya Rock Fortress', lat: 7.9570, lng: 80.7603, category: 'Archaeology', emoji: '🏰' },
            { id: 2, name: 'Temple of the Tooth', lat: 7.2936, lng: 80.6413, category: 'Buddhist Heritage', emoji: '🛕' },
            { id: 3, name: 'Ancient Polonnaruwa', lat: 7.9645, lng: 81.0022, category: 'Archaeology', emoji: '🏛️' },
            { id: 4, name: 'Galle Dutch Fort', lat: 6.0267, lng: 80.2170, category: 'Colonial Heritage', emoji: '🧱' },
            { id: 5, name: 'Anuradhapura', lat: 8.3500, lng: 80.3960, category: 'Buddhist Heritage', emoji: '☸️' },
            { id: 6, name: 'Dambulla Golden Cave Temple', lat: 7.8564, lng: 80.6517, category: 'Buddhist Heritage', emoji: '🛖' },
            { id: 7, name: 'Sinharaja Rain Forest Reserve', lat: 6.3986, lng: 80.4194, category: 'Colonial Heritage', emoji: '🌳' },
            { id: 8, name: 'Nallur Kandaswamy Kovil (Jaffna)', lat: 9.6744, lng: 80.0309, category: 'Colonial Heritage', emoji: '🛕' },
            { id: 9, name: 'Yapahuwa Rock Fortress', lat: 7.8139, lng: 80.2589, category: 'Archaeology', emoji: '🏰' },
            { id: 10, name: 'Mihintale Sacred Mountain', lat: 8.3514, lng: 80.5181, category: 'Buddhist Heritage', emoji: '⛰️' }
          ];

          const markers = {};

          sites.forEach(site => {
            const customIcon = L.divIcon({
              className: 'custom-marker',
              html: '<span>' + site.emoji + '</span>',
              iconSize: [32, 32],
              iconAnchor: [16, 16]
            });

            const marker = L.marker([site.lat, site.lng], { icon: customIcon }).addTo(map);
            marker.bindPopup(\`
              <div class="popup-title">\${site.name}</div>
              <div class="popup-desc">\${site.category}</div>
            \`);
            
            marker.on('click', () => {
              window.parent.postMessage({ type: 'SELECT_SITE', siteId: site.id }, '*');
              
              // Highlight active marker visually
              Object.keys(markers).forEach(id => {
                const el = markers[id].getElement();
                if (el) el.classList.remove('active');
              });
              const el = marker.getElement();
              if (el) el.classList.add('active');
            });

            markers[site.id] = marker;
          });

          // Open default popup
          setTimeout(() => {
            if (markers[1]) {
              markers[1].openPopup();
              const el = markers[1].getElement();
              if (el) el.classList.add('active');
            }
          }, 500);

          let userMarker = null;
          let routeLine = null;

          window.addEventListener('message', function(event) {
            if (event.data && event.data.type === 'SET_MAP_STATE') {
              const { siteId, userLocation } = event.data;
              const site = sites.find(s => s.id === siteId);
              
              // 1. Handle User Location Marker
              if (userLocation) {
                const userLatLng = [userLocation.latitude, userLocation.longitude];
                if (!userMarker) {
                  const userIcon = L.divIcon({
                    className: 'user-location-marker',
                    html: '<div class="user-pulse"></div>',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                  });
                  userMarker = L.marker(userLatLng, { icon: userIcon }).addTo(map);
                  userMarker.bindPopup('<div style="font-family:sans-serif;color:#0288D1;font-weight:bold;font-size:12px;">📍 Your Location</div>');
                } else {
                  userMarker.setLatLng(userLatLng);
                }
              }

              // 2. Center/Open Popup and draw Route
              if (site) {
                const siteLatLng = [site.lat, site.lng];
                const marker = markers[site.id];
                
                // Draw route line
                if (userLocation) {
                  const userLatLng = [userLocation.latitude, userLocation.longitude];
                  
                  // Fetch vehicle road route from OSRM
                  fetch('https://router.project-osrm.org/route/v1/driving/' + userLocation.longitude + ',' + userLocation.latitude + ';' + site.lng + ',' + site.lat + '?overview=full&geometries=geojson')
                    .then(response => response.json())
                    .then(data => {
                      if (data.routes && data.routes.length > 0) {
                        const coords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
                        if (routeLine) {
                          map.removeLayer(routeLine);
                        }
                        routeLine = L.polyline(coords, {
                          color: '#F5A623',
                          weight: 5,
                          opacity: 0.9,
                          className: 'route-line'
                        }).addTo(map);

                        map.fitBounds(routeLine.getBounds(), {
                          padding: [50, 50],
                          animate: true
                        });

                        window.parent.postMessage({
                          type: 'ROUTE_CALCULATED',
                          distanceKm: (data.routes[0].distance / 1000).toFixed(1),
                          durationMinutes: Math.round(data.routes[0].duration / 60)
                        }, '*');
                      } else {
                        throw new Error('No route found');
                      }
                    })
                    .catch(err => {
                      // Fallback to straight line
                      if (routeLine) {
                        map.removeLayer(routeLine);
                      }
                      routeLine = L.polyline([userLatLng, siteLatLng], {
                        color: '#F5A623',
                        weight: 4,
                        opacity: 0.8,
                        className: 'route-line'
                      }).addTo(map);

                      map.fitBounds(L.latLngBounds([userLatLng, siteLatLng]), {
                        padding: [50, 50],
                        animate: true
                      });

                      // Straight line distance calculation using Haversine formula
                      const R = 6371; // km
                      const dLat = (site.lat - userLocation.latitude) * Math.PI / 180;
                      const dLon = (site.lng - userLocation.longitude) * Math.PI / 180;
                      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                                Math.cos(userLocation.latitude * Math.PI / 180) * Math.cos(site.lat * Math.PI / 180) *
                                Math.sin(dLon/2) * Math.sin(dLon/2);
                      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                      const distance = (R * c).toFixed(1);
                      window.parent.postMessage({
                        type: 'ROUTE_CALCULATED',
                        distanceKm: distance,
                        durationMinutes: Math.round(distance * 1.5)
                      }, '*');
                    });
                } else {
                  map.setView(siteLatLng, 9.5, { animate: true });
                }

                if (marker) {
                  marker.openPopup();
                }

                // Visual highlights
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
      // Fallback local plan generator
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
          { day: 5, location: 'Nuwara Eliya Tea Country', highlights: 'Scenic train ride, tea factory tour, Gregory Lake', distance: '78 km' },
          { day: 6, location: 'Ella Mountain Gap', highlights: 'Nine Arches Bridge & Little Adams Peak hike', distance: '55 km' },
          { day: 7, location: 'Galle Fort Coastal Citadel', highlights: 'Dutch Fort ramparts, lighthouse, turtle hatcheries', distance: '210 km' }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: 'transparent' }]} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.headerBg, borderColor: colors.cardBorder }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{t.mapHeader}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t.mapSub}</Text>
      </View>

      {/* Search Input Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
        <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Search heritage site, city, or district..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
            <Text style={{ color: colors.textSecondary, fontWeight: '800' }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search Results Dropdown */}
      {searchQuery.length > 0 && filteredSites.length > 0 && (
        <View style={[styles.searchResultsDropdown, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          {filteredSites.map((site) => (
            <TouchableOpacity
              key={site.id}
              style={[styles.searchResultItem, { borderBottomColor: colors.cardBorder }]}
              onPress={() => {
                setSelectedSiteId(site.id);
                setSearchQuery('');
              }}
            >
              <Text style={[styles.searchResultText, { color: colors.textPrimary }]}>📍 {site.name}</Text>
              <Text style={[styles.searchResultDistrict, { color: colors.textSecondary }]}>{site.district}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Visual Map Representation Banner */}
      {Platform.OS === 'web' ? (
        <View style={[styles.webMapContainer, { borderColor: colors.cardBorder }]}>
          {React.createElement('iframe', {
            ref: iframeRef,
            srcDoc: mapHtmlContent,
            style: { width: '100%', height: '100%', border: 'none', borderRadius: 20 }
          })}
        </View>
      ) : (
        <View style={[styles.mapVisualContainer, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <Text style={styles.mapBannerTitle}>{t.mapVisualTitle}</Text>
          <Text style={[styles.mapBannerSubtitle, { color: colors.textSecondary }]}>{t.mapVisualSub}</Text>
        </View>
      )}

      {/* Badges Selector under the map */}
      <View style={styles.siteBadgeSelectorContainer}>
        <View style={styles.mapBadgeGrid}>
          {translatedSites.map((site) => (
            <TouchableOpacity
              key={site.id}
              style={[styles.siteBadge, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }, selectedSite?.id === site.id && styles.activeSiteBadge]}
              onPress={() => setSelectedSiteId(site.id)}
            >
              <Text style={[styles.siteBadgeText, { color: colors.textSecondary }, selectedSite?.id === site.id && styles.activeSiteBadgeText]}>
                📍 {site.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Selected Site Details */}
      {selectedSite && (
        <View style={[styles.siteDetailCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <Text style={[styles.siteDetailName, { color: colors.textPrimary }]}>📍 {selectedSite.name}</Text>
          <Text style={[styles.siteDetailMeta, { color: colors.textSecondary }]}>
            District: <Text style={styles.bold}>{selectedSite.district}</Text> | Category: <Text style={styles.bold}>{selectedSite.category}</Text>
          </Text>
          <Text style={[styles.siteDetailMeta, { color: colors.textSecondary }]}>
            Operating Hours: <Text style={styles.bold}>{selectedSite.opening_hours}</Text>
          </Text>
          <Text style={[styles.siteDetailMeta, { color: colors.textSecondary }]}>
            Foreign Ticket Price: <Text style={styles.bold}>${selectedSite.ticket_price_usd} USD ({selectedSite.ticket_price_lkr} LKR)</Text>
          </Text>

          {/* Transportation Routes and Times */}
          <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />
          <Text style={[styles.transitHeader, { color: colors.textPrimary }]}>🧭 Travel Distance & Duration (from current location):</Text>
          
          {routeDistance ? (
            <View style={styles.routeStatsRow}>
              <View style={[styles.statBox, { backgroundColor: colors.softTeal, borderColor: colors.cardBorder }]}>
                <Text style={styles.statValue}>{routeDistance} km</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Distance</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: colors.softTeal, borderColor: colors.cardBorder }]}>
                <Text style={styles.statValue}>{routeDuration} mins</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Car/Taxis</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: colors.softTeal, borderColor: colors.cardBorder }]}>
                <Text style={styles.statValue}>{transitTimes?.tukTime}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Tuk-Tuk</Text>
              </View>
            </View>
          ) : (
            <Text style={[styles.calculatingText, { color: colors.textSecondary }]}>🔄 Loading driving route & distance...</Text>
          )}

          {transitTimes && (
            <View style={styles.altTransitRow}>
              <Text style={[styles.transitOption, { color: colors.textSecondary }]}>🚲 Bicycle: <Text style={styles.bold}>{transitTimes.bikeTime}</Text></Text>
              <Text style={[styles.transitOption, { color: colors.textSecondary }]}>🚶 Walking: <Text style={styles.bold}>{transitTimes.footTime}</Text></Text>
            </View>
          )}

          <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />
          
          {/* Public Transport */}
          <Text style={styles.transitOptionTitle}>🚌 Public Bus Option:</Text>
          <Text style={[styles.transitOptionDesc, { backgroundColor: colors.softTeal, borderColor: colors.cardBorder, color: colors.textSecondary }]}>
            {SITE_TRANSIT_INFO[selectedSite.id]?.bus || "No direct bus route listed."}
          </Text>

          <Text style={styles.transitOptionTitle}>🚆 Train Option:</Text>
          <Text style={[styles.transitOptionDesc, { backgroundColor: colors.softTeal, borderColor: colors.cardBorder, color: colors.textSecondary }]}>
            {SITE_TRANSIT_INFO[selectedSite.id]?.train || "No direct train route listed."}
          </Text>
        </View>
      )}

      {/* Smart Heritage Route & Itinerary Planner */}
      <View style={[styles.plannerSection, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
        <Text style={[styles.plannerTitle, { color: colors.textPrimary }]}>{t.routePlannerTitle}</Text>
        <Text style={[styles.plannerSub, { color: colors.textSecondary }]}>{t.routePlannerSub}</Text>

        {/* Duration Chips */}
        <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>{t.stayDuration}</Text>
        <View style={styles.chipRow}>
          {[1, 3, 7].map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.filterChip, { backgroundColor: colors.softTeal, borderColor: colors.cardBorder }, days === d && styles.activeFilterChip]}
              onPress={() => setDays(d)}
            >
              <Text style={[styles.filterChipText, { color: colors.textSecondary }, days === d && styles.activeFilterText]}>
                {d} {d === 1 ? t.dayTour : t.daysTour}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Category Chips */}
        <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>{t.preferredTheme}</Text>
        <View style={styles.chipRow}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterChip, { backgroundColor: colors.softTeal, borderColor: colors.cardBorder }, category === cat && styles.activeFilterChip]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.filterChipText, { color: colors.textSecondary }, category === cat && styles.activeFilterText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Generate Button */}
        <TouchableOpacity style={styles.generateButton} onPress={generatePlan}>
          <Text style={styles.generateButtonText}>{t.generateItinerary}</Text>
        </TouchableOpacity>

        {/* Itinerary Results */}
        {itinerary.length > 0 && (
          <View style={styles.itineraryResultContainer}>
            <Text style={[styles.resultHeading, { color: colors.textPrimary }]}>🚩 Your Custom {days}-Day Heritage Route Plan:</Text>
            {itinerary.map((item, idx) => (
              <View key={idx} style={[styles.dayCard, { backgroundColor: colors.softTeal }]}>
                <View style={styles.dayHeader}>
                  <Text style={styles.dayBadge}>DAY {item.day}</Text>
                  <Text style={[styles.dayLocation, { color: colors.textPrimary }]}>{item.location}</Text>
                </View>
                <Text style={[styles.dayHighlights, { color: colors.textSecondary }]}>✨ Key Sites: {item.highlights}</Text>
                <Text style={styles.dayDistance}>🚗 Travel Distance: {item.distance}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },

  // Search Bar Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginBottom: 14,
    borderWidth: 1,
    ...Shadow.card,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  clearSearchBtn: {
    padding: 6,
  },
  searchResultsDropdown: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
    ...Shadow.card,
  },
  searchResultItem: {
    padding: 14,
    borderBottomWidth: 1,
  },
  searchResultText: {
    fontSize: 14,
    fontWeight: '700',
  },
  searchResultDistrict: {
    fontSize: 11,
    marginTop: 2,
  },

  // Header
  header: {
    paddingTop: 56, paddingBottom: 24, paddingHorizontal: 20,
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
    marginBottom: 20,
    borderWidth: 1,
  },
  title: { fontSize: 24, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 4 },

  // Map Banner
  webMapContainer: {
    height: 380,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    ...Shadow.card,
  },
  siteBadgeSelectorContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  mapVisualContainer: {
    marginHorizontal: 16,
    borderRadius: 20, padding: 18, marginBottom: 16,
    borderWidth: 1,
  },
  mapBannerTitle: { color: Colors.secondary, fontSize: 12, fontWeight: '800', letterSpacing: 1.2, marginBottom: 4 },
  mapBannerSubtitle: { fontSize: 12, marginBottom: 14 },
  mapBadgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  siteBadge: {
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1,
  },
  activeSiteBadge: { backgroundColor: Colors.secondary, borderColor: Colors.secondary },
  siteBadgeText: { fontSize: 12, fontWeight: '600' },
  activeSiteBadgeText: { color: '#fff', fontWeight: '800' },

  // Site Detail Card
  siteDetailCard: {
    marginHorizontal: 16,
    padding: 18, borderRadius: 20, marginBottom: 20,
    borderLeftWidth: 4, borderLeftColor: Colors.secondary,
    borderWidth: 1,
  },
  siteDetailName: { fontSize: 18, fontWeight: '800', marginBottom: 10 },
  siteDetailMeta: { fontSize: 13, marginVertical: 3 },
  bold: { fontWeight: '700', color: Colors.accent },

  // Transit Styles
  divider: {
    height: 1,
    marginVertical: 14,
  },
  transitHeader: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
  },
  routeStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 10,
  },
  statBox: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.accent,
  },
  statLabel: {
    fontSize: 9,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  calculatingText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  altTransitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  transitOption: {
    fontSize: 12,
  },
  transitOptionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.secondary,
    marginTop: 8,
    marginBottom: 4,
  },
  transitOptionDesc: {
    fontSize: 12,
    lineHeight: 18,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },

  // Planner
  plannerSection: {
    marginHorizontal: 16,
    borderRadius: 20, padding: 20, marginBottom: 30,
    borderWidth: 1,
  },
  plannerTitle: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
  plannerSub: { fontSize: 12, marginBottom: 16 },
  filterLabel: { fontSize: 12, fontWeight: '700', marginTop: 10, marginBottom: 8, letterSpacing: 0.5 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: 20, borderWidth: 1,
  },
  activeFilterChip: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterChipText: { fontSize: 13, fontWeight: '600' },
  activeFilterText: { color: '#fff', fontWeight: '800' },
  generateButton: {
    backgroundColor: Colors.primary, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center', marginTop: 14,
  },
  generateButtonText: { color: '#fff', fontSize: 16, fontWeight: '800' },

  // Itinerary
  itineraryResultContainer: { marginTop: 20 },
  resultHeading: { fontSize: 15, fontWeight: '800', marginBottom: 12 },
  dayCard: {
    borderRadius: 14,
    padding: 16, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: Colors.accent,
  },
  dayHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dayBadge: {
    backgroundColor: Colors.accent, color: '#fff',
    fontSize: 10, fontWeight: '800',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginRight: 10,
  },
  dayLocation: { fontSize: 14, fontWeight: '700', flex: 1 },
  dayHighlights: { fontSize: 13, marginTop: 2, lineHeight: 18 },
  dayDistance: { fontSize: 12, color: Colors.primary, marginTop: 6 },
});
