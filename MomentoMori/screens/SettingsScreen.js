// screens/SettingsScreen.js - Enhanced app settings
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Switch, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { getSettings, saveSettings } from '../services/StorageService';
import { testVoiceNotification } from '../services/NotificationService';
import { testTts } from '../services/ttsService';
import Slider from '@react-native-community/slider';

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    enableVoiceNotifications: true,
    enableVibration: true,
    notificationVolume: 0.7,
  });
  
  const [testMessage, setTestMessage] = useState('This is a test voice notification');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    loadSettings();
  }, []);
  
  const loadSettings = async () => {
    try {
      setLoading(true);
      const savedSettings = await getSettings();
      if (savedSettings) {
        setSettings(savedSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      Alert.alert('Error', 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };
  
  const updateSetting = async (key, value) => {
    try {
      const updatedSettings = { ...settings, [key]: value };
      setSettings(updatedSettings);
      await saveSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating setting:', error);
      Alert.alert('Error', 'Failed to save setting');
    }
  };
  
  const handleTestTts = async () => {
    try {
      setLoading(true);
      const result = await testTts();
      
      if (result.success) {
        Alert.alert('Success', 'TTS is working correctly!');
      } else {
        Alert.alert('Error', `TTS test failed: ${result.reason}`);
      }
    } catch (error) {
      console.error('TTS test error:', error);
      Alert.alert('Error', 'Failed to test TTS');
    } finally {
      setLoading(false);
    }
  };
  
  const handleTestNotification = async () => {
    try {
      setLoading(true);
      const success = await testVoiceNotification(testMessage);
      
      if (success) {
        Alert.alert('Success', 'Notification sent with voice message');
      } else {
        Alert.alert('Error', 'Failed to send notification');
      }
    } catch (error) {
      console.error('Notification test error:', error);
      Alert.alert('Error', 'Failed to test notification');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Voice Notification Settings</Text>
      
      <View style={styles.card}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Voice Notifications</Text>
          <Switch
            value={settings.enableVoiceNotifications}
            onValueChange={(value) => updateSetting('enableVoiceNotifications', value)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={settings.enableVoiceNotifications ? '#2196F3' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Vibration</Text>
          <Switch
            value={settings.enableVibration}
            onValueChange={(value) => updateSetting('enableVibration', value)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={settings.enableVibration ? '#2196F3' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.sliderContainer}>
          <Text style={styles.settingLabel}>Voice Volume: {Math.round(settings.notificationVolume * 100)}%</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            step={0.1}
            value={settings.notificationVolume}
            onValueChange={(value) => setSettings({ ...settings, notificationVolume: value })}
            onSlidingComplete={(value) => updateSetting('notificationVolume', value)}
            minimumTrackTintColor="#2196F3"
            maximumTrackTintColor="#000000"
            thumbTintColor="#2196F3"
          />
        </View>
      </View>
      
      <Text style={styles.header}>Test Voice Notifications</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Test Message</Text>
        <TextInput
          style={styles.input}
          value={testMessage}
          onChangeText={setTestMessage}
          placeholder="Enter a test message"
          multiline
        />
        
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.ttsButton]}
            onPress={handleTestTts}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Test TTS Only</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.notificationButton]}
            onPress={handleTestNotification}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Test Notification</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.header}>About</Text>
      
      <View style={styles.card}>
        <Text style={styles.aboutText}>
          This app uses your device's Text-to-Speech capabilities to give you voice notifications for your reminders.
        </Text>
        <Text style={styles.aboutText}>
          Create reminders by typing or speaking, and when it's time, your device will read them aloud!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  sliderContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  slider: {
    height: 40,
    marginTop: 4,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  ttsButton: {
    backgroundColor: '#FF9800',
  },
  notificationButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  aboutText: {
    fontSize: 15,
    color: '#555',
    marginBottom: 8,
    lineHeight: 22,
  },
  comingSoon: {
    fontSize: 16,
    marginLeft: 10,
    marginTop: 5,
    color: '#666',
  },
});