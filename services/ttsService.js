// services/ttsService.js - Text-to-speech service
import Tts from 'react-native-tts';
import { getSettings } from './StorageService';

// Initialize TTS engine
export const initTts = async () => {
  try {
    // Check if TTS engine is available
    const engines = await Tts.engines();
    console.log('Available TTS engines:', engines);
    
    // Set default configuration
    Tts.setDefaultRate(0.5);
    Tts.setDefaultPitch(1.0);
    
    // Get current settings for volume
    const settings = await getSettings();
    if (settings && settings.notificationVolume) {
      Tts.setDefaultVolume(settings.notificationVolume);
    }
    
    // Event listeners
    Tts.addEventListener('tts-start', (event) => console.log('TTS start', event));
    Tts.addEventListener('tts-finish', (event) => console.log('TTS finish', event));
    Tts.addEventListener('tts-cancel', (event) => console.log('TTS cancel', event));
    Tts.addEventListener('tts-error', (event) => console.log('TTS error', event));
    
    return true;
  } catch (error) {
    console.error('Failed to initialize TTS', error);
    return false;
  }
};

// Play a message using TTS
export const playVoiceMessage = async (message) => {
  try {
    // Initialize TTS if not already
    await initTts();
    
    // Get current settings
    const settings = await getSettings();
    
    // Only proceed if voice notifications are enabled
    if (settings.enableVoiceNotifications) {
      // Speak the message
      Tts.speak(message);
    }
  } catch (error) {
    console.error('Failed to play voice message', error);
  }
};

// Stop current TTS playback
export const stopVoiceMessage = () => {
  Tts.stop();
};

// services/storageService.js - Data persistence
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
      return reminders.sort