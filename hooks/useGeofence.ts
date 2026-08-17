// hooks/useGeofence.ts
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';

// ⚠️ IMPORTANT: PC එකෙන් Test කරද්දී IP address එක දෙන්න (Mobile Phone එකෙන් Test කරන්නේ නම් PC එකේ IP එක යොදන්න, උදා: 192.168.x.x)
const BACKEND_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

export const useGeofence = (onEnterGeofence: (poi: any) => void) => {
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    let subscription: any = null;

    const startLocationUpdates = async () => {
      // 1. Location Permission ඉල්ලීම
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      // 2. Real-time Location Track කිරීම
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000, // සෑම තත්පර 3කට වරක්
          distanceInterval: 5, // මීටර් 5ක් ගමන් කළ විට
        },
        (location) => {
          const coords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          setCurrentLocation(coords);
          checkNearbyPois(coords.latitude, coords.longitude);
        }
      );
    };

    startLocationUpdates();

    return () => {
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, []);

  let isBackendOffline = false;

  // 3. Backend එකට Coordinates යවා මීටර් 20 සීමාවේ POIs පරීක්ෂා කිරීම
  const checkNearbyPois = async (lat: number, lng: number) => {
    if (isBackendOffline) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/pois/nearby?lat=${lat}&lng=${lng}`);
      const pois = await response.json();

      if (pois && pois.length > 0) {
        const topPoi = pois[0];
        if (topPoi.distance_in_meters <= topPoi.geofence_radius_meters) {
          onEnterGeofence(topPoi);
        }
      }
    } catch (error) {
      isBackendOffline = true;
      console.log('Backend POIs offline (simulation mode fallback active)');
    }
  };

  return { currentLocation };
};