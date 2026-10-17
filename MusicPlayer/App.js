import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';

export default function App() {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songName, setSongName] = useState('មិនទាន់មានបទចម្រៀងបានជ្រើសរើស');

  // អនុគមន៍សម្រាប់ជ្រើសរើសឯកសារចម្រៀងពីទូរស័ព្ទ (.mp3, .wav, .m4a)
  async function pickAndPlayAudio() {
    try {
      // បញ្ឈប់បទចម្រៀងចាស់ប្រសិនបើកំពុងលេង
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
      }

      // បើក File Manager ក្នុងទូរស័ព្ទដើម្បីជ្រើសរើសអូឌីយ៉ូ
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/mpeg', 'audio/wav', 'audio/x-m4a', 'audio/mp4'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        const fileName = result.assets[0].name;

        setSongName(fileName);

        // កំណត់ Audio Mode
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });

        // បង្កើត Sound Object និងចាក់វា
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: fileUri },
          { shouldPlay: true }
        );
        
        setSound(newSound);
        setIsPlaying(true);
      }
    } catch (error) {
      console.log('Error picking or playing file:', error);
    }
  }

  // អនុគមន៍ Play / Pause បទដែលកំពុងជ្រើសរើសស្រាប់
  async function togglePlayPause() {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎵 កម្មវិធីចាក់ចម្រៀងផ្ទាល់ខ្លួន 🎵</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>បទកំពុងរើស:</Text>
        <Text style={styles.songName} numberOfLines={2}>{songName}</Text>
      </View>
      
      {/* ប៊ូតុងរើសបទចម្រៀងពីទូរស័ព្ទ */}
      <TouchableOpacity style={styles.pickButton} onPress={pickAndPlayAudio}>
        <Text style={styles.buttonText}>📁 ជ្រើសរើសបទចម្រៀង (MP3, WAV, M4A)</Text>
      </TouchableOpacity>

      {/* ប៊ូតុង Play / Pause */}
      {sound && (
        <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
          <Text style={styles.buttonText}>{isPlaying ? '⏸️ ផ្អាក (Pause)' : '▶️ ចាក់បន្ត (Play)'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#313244',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#a6adc8',
    marginBottom: 5,
  },
  songName: {
    fontSize: 16,
    color: '#f38ba8',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pickButton: {
    backgroundColor: '#89b4fa',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  playButton: {
    backgroundColor: '#a6e3a1',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    color: '#11111b',
    fontWeight: 'bold',
  },
});
