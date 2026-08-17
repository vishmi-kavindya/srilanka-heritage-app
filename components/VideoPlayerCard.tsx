import React, { useRef } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Colors } from '../constants/theme';
import { useAppTheme } from '../contexts/ThemeContext';

interface VideoPlayerCardProps {
  title: string;
  historicalSummary: string;
  videoUrl: any;
}

export default function VideoPlayerCard({ title, historicalSummary, videoUrl }: VideoPlayerCardProps) {
  const { colors } = useAppTheme();
  const videoRef = useRef<Video>(null);

  // Resolve source for web HTML5 player
  let resolvedSourceWeb = videoUrl;
  if (typeof videoUrl === 'object' && videoUrl !== null) {
    resolvedSourceWeb = videoUrl.uri || videoUrl.default || videoUrl;
  }

  // Resolve source for native expo-av player
  const nativeSource = typeof videoUrl === 'number' ? videoUrl : { uri: videoUrl };

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
      <View style={styles.headerRow}>
        <Text style={styles.badge}>🎬 GEOFENCE VIDEO EXPLORER</Text>
      </View>

      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.summary, { color: colors.textSecondary }]}>{historicalSummary}</Text>

      <View style={styles.videoWrapper}>
        {Platform.OS === 'web' ? (
          <video
            src={typeof resolvedSourceWeb === 'string' ? resolvedSourceWeb : undefined}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            controls
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <Video
            ref={videoRef}
            source={nativeSource}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={true}
            isLooping={true}
            isMuted={true}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 12,
    borderLeftWidth: 5,
    borderLeftColor: Colors.accent, // Sunset Orange (#F58220)
    borderWidth: 1,
    borderColor: 'rgba(245, 130, 32, 0.25)',
    shadowColor: Colors.textDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    color: Colors.accent, // Sunset Orange
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    color: Colors.textDark, // Deep Brown
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  summary: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
  },
  videoWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: Colors.borderTeal,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
