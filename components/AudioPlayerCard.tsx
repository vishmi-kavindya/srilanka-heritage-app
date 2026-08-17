import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { Colors } from '../constants/theme';
import { useAppTheme } from '../contexts/ThemeContext';

interface AudioPlayerCardProps {
  title: string;
  historicalSummary: string;
  audioUrl?: string;
  onClose?: () => void;
}

export default function AudioPlayerCard({ title, historicalSummary, audioUrl, onClose }: AudioPlayerCardProps) {
  const { colors } = useAppTheme();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  async function playSound() {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
        return;
      }

      setLoading(true);
      const uriToPlay = audioUrl || 'https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg';
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: uriToPlay },
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(true);
      setLoading(false);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.log('Error playing audio:', error);
      setIsPlaying(!isPlaying);
      setLoading(false);
    }
  }

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
      <View style={styles.headerRow}>
        <View style={styles.badgePill}>
          <Text style={styles.badgePillIcon}>🎧</Text>
          <Text style={styles.badgeText}>GEOFENCE AUDIO STORY</Text>
        </View>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.summary, { color: colors.textSecondary }]}>{historicalSummary}</Text>

      {/* Decorative Waveform Graphic */}
      <View style={styles.waveformContainer}>
        {[40, 65, 30, 85, 50, 95, 45, 75, 35, 90, 60, 40, 80, 55, 30, 70, 45, 85, 40].map((h, idx) => (
          <View
            key={idx}
            style={[
              styles.waveBar,
              {
                height: isPlaying ? h * 0.35 : 12,
                backgroundColor: isPlaying && idx % 3 === 0 ? Colors.accent : Colors.primary,
                opacity: isPlaying ? 0.9 : 0.4,
              },
            ]}
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.playButton, isPlaying && styles.playingButton]}
        onPress={playSound}
        disabled={loading}
        activeOpacity={0.88}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View style={styles.playBtnRow}>
            <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
            <Text style={styles.playButtonText}>
              {isPlaying ? 'Pause Audio Guide' : 'Listen to Audio Story'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 22,
    marginHorizontal: 16,
    marginVertical: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 140, 149, 0.22)',
    shadowColor: '#3B2F2F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 130, 32, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(245, 130, 32, 0.3)',
  },
  badgePillIcon: {
    fontSize: 12,
  },
  badgeText: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 4,
  },
  closeText: {
    color: Colors.textMuted,
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    color: Colors.textDark,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  summary: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 36,
    backgroundColor: Colors.softTeal,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  waveBar: {
    width: 3.5,
    borderRadius: 2,
  },
  playButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 22,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  playingButton: {
    backgroundColor: Colors.accent,
    shadowColor: Colors.accent,
  },
  playBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  playIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
