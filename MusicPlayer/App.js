import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);

  // អ្នកអាចប្តូរ Link នេះទៅជា .mp3, .wav ឬ .m4a តាមចំណង់ចំណូលចិត្ត
  const audioUri = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

  async function playPauseAudio() {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } else {
      // កំណត់ Audio Mode ឱ្យស្គាល់ទម្រង់ឯកសារផ្សេងៗ
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true }
      );
      setSound(newSound);
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
      <Text style={styles.title}>🎵 កម្មវិធីចាក់ចម្រៀង 🎵</Text>
      <Text style={styles.songName}>รองรับ MP3, WAV, M4A</Text>
      
      <TouchableOpacity style={styles.button} onPress={playPauseAudio}>
        <Text style={styles.buttonText}>{isPlaying ? '⏸️ ផ្អាក (Pause)' : '▶️ ចាក់ (Play)'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  songName: {
    fontSize: 14,
    color: '#a6adc8',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#89b4fa',
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 18,
    color: '#11111b',
    fontWeight: 'bold',
  },
});
