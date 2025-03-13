// screens/SettingsScreen.js - App settings
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Switch, TouchableOpacity } from 'react-native';
import { getSettings, saveSettings } from '../services/StorageService';

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    enableVoiceNotifications: true,
    enableVibration: true,
    notificationVolume: 0.7,
  });
  
  useEffect(() => {
    loadSettings();
  }, []);
  
  const loadSettings = async () => {
    const savedSettings = await getSettings();
    if (savedSettings) {
      setSettings(savedSettings);
    }
  };
  
  const updateSetting = async (key, value) => {
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    await saveSettings(updatedSettings);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notification Settings</Text>
      
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Voice Notifications</Text>
        <Switch
          value={settings.enableVoiceNotifications}
          onValueChange={(value) => updateSetting('enableVoiceNotifications', value)}
        />
      </View>
      
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Vibration</Text>
        <Switch
          value={settings.enableVibration}
          onValueChange={(value) => updateSetting('enableVibration', value)}
        />
      </View>
      
      <Text style={styles.header}>Coming Soon</Text>
      <Text style={styles.comingSoon}>• House Management Register</Text>
      <Text style={styles.comingSoon}>• Memento Mori Self-Improvement Tracker</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
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
  },
  comingSoon: {
    fontSize: 16,
    marginLeft: 10,
    marginTop: 5,
    color: '#666',
  },
});