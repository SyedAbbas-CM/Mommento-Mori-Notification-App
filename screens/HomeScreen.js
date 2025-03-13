// screens/HomeScreen.js - Main screen with reminder list
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import ReminderList from '../components/ReminderList';
import { getReminders } from '../services/StorageService';

export default function HomeScreen({ navigation }) {
  const [reminders, setReminders] = useState([]);
  
  useEffect(() => {
    loadReminders();
    
    // Refresh reminders when screen comes into focus
    const unsubscribe = navigation.addListener('focus', loadReminders);
    return unsubscribe;
  }, [navigation]);
  
  const loadReminders = async () => {
    const savedReminders = await getReminders();
    setReminders(savedReminders);
  };
  
  return (
    <View style={styles.container}>
      <ReminderList reminders={reminders} />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddReminder')}
        >
          <Text style={styles.buttonText}>+ Add Voice Reminder</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 30,
    elevation: 3,
  },
  settingsButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 30,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});