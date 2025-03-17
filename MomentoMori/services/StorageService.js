// services/StorageService.js - Data persistence
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for storage
const REMINDERS_KEY = '@VoiceReminder:reminders';
const SETTINGS_KEY = '@VoiceReminder:settings';

// Default settings
const DEFAULT_SETTINGS = {
  enableVoiceNotifications: true,
  enableVibration: true,
  notificationVolume: 0.7,
};

// Get all reminders
export const getReminders = async () => {
  try {
    const remindersJson = await AsyncStorage.getItem(REMINDERS_KEY);
    if (remindersJson !== null) {
      // Sort reminders by datetime
      const reminders = JSON.parse(remindersJson);
      return reminders.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
    }
    return [];
  } catch (error) {
    console.error('Error getting reminders:', error);
    return [];
  }
};

// Save a new reminder
export const saveReminder = async (reminder) => {
  try {
    // Get existing reminders
    const reminders = await getReminders();
    
    // Add new reminder
    reminders.push(reminder);
    
    // Save to storage
    await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
    
    return true;
  } catch (error) {
    console.error('Error saving reminder:', error);
    return false;
  }
};

// Delete a reminder by ID
export const deleteReminder = async (id) => {
  try {
    // Get existing reminders
    const reminders = await getReminders();
    
    // Filter out the reminder to delete
    const updatedReminders = reminders.filter(item => item.id !== id);
    
    // Save updated list
    await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(updatedReminders));
    
    return true;
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return false;
  }
};

// Get app settings
export const getSettings = async () => {
  try {
    const settingsJson = await AsyncStorage.getItem(SETTINGS_KEY);
    if (settingsJson !== null) {
      return JSON.parse(settingsJson);
    }
    
    // Return default settings if none exist
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error getting settings:', error);
    return DEFAULT_SETTINGS;
  }
};

// Save app settings
export const saveSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};