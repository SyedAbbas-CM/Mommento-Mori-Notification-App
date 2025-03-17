// screens/HomeScreen.js - Enhanced main screen with reminder list
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import ReminderList from '../components/ReminderList';
import { getReminders } from '../services/StorageService';
import { formatReminderDate } from '../utils/timeUtils';

export default function HomeScreen({ navigation }) {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    loadReminders();
    
    // Refresh reminders when screen comes into focus
    const unsubscribe = navigation.addListener('focus', loadReminders);
    return unsubscribe;
  }, [navigation]);
  
  const loadReminders = async () => {
    try {
      setRefreshing(true);
      const savedReminders = await getReminders();
      setReminders(savedReminders);
    } catch (error) {
      console.error('Error loading reminders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const getUpcomingReminder = () => {
    if (reminders.length === 0) return null;
    
    const now = new Date();
    const upcoming = reminders
      .filter(r => new Date(r.datetime) > now)
      .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
    
    return upcoming.length > 0 ? upcoming[0] : null;
  };
  
  const upcomingReminder = getUpcomingReminder();
  
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Voice Reminders</Text>
      </View>
      
      {/* Upcoming Reminder Card */}
      {upcomingReminder && (
        <View style={styles.upcomingCard}>
          <Text style={styles.upcomingLabel}>Next Reminder:</Text>
          <Text style={styles.upcomingTitle}>{upcomingReminder.title}</Text>
          <Text style={styles.upcomingTime}>
            {formatReminderDate(upcomingReminder.datetime)}
          </Text>
          <View style={styles.voiceIndicator}>
            <Text style={styles.voiceIndicatorText}>Voice Enabled</Text>
          </View>
        </View>
      )}
      
      {/* Reminders List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading reminders...</Text>
        </View>
      ) : (
        <ReminderList 
          reminders={reminders} 
          onRefresh={loadReminders}
          refreshing={refreshing}
        />
      )}
      
      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddReminder')}
        >
          <Text style={styles.buttonText}>+ Add Reminder</Text>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  upcomingCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  upcomingLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  upcomingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  upcomingTime: {
    fontSize: 16,
    color: '#2196F3',
    marginBottom: 8,
  },
  voiceIndicator: {
    backgroundColor: '#e3f2fd',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  voiceIndicatorText: {
    color: '#2196F3',
    fontSize: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 3,
    flex: 3,
    marginRight: 8,
    alignItems: 'center',
  },
  settingsButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 3,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});