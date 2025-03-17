// services/ttsService.js - Enhanced text-to-speech service
import Tts from 'react-native-tts';
import { getSettings } from './StorageService';

// Initialize TTS engine
export const initTts = async () => {
  try {
    // Check if TTS engine is available
    const engines = await Tts.engines();
    console.log('Available TTS engines:', engines);
    
    // Set default configuration
    Tts.setDefaultRate(0.5);     // Speech rate (slower for better comprehension)
    Tts.setDefaultPitch(1.0);    // Normal pitch
    
    // Get current settings for volume
    const settings = await getSettings();
    if (settings && settings.notificationVolume) {
      Tts.setDefaultVolume(settings.notificationVolume);
    } else {
      Tts.setDefaultVolume(1.0); // Maximum volume for notifications
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
    if (!settings || settings.enableVoiceNotifications) {
      // Format the message as a reminder
      const reminderMessage = formatReminderMessage(message);
      
      // Speak the message
      Tts.speak(reminderMessage);
      
      // Return success
      return {
        success: true,
        message: reminderMessage
      };
    }
    
    return {
      success: false,
      reason: 'Voice notifications disabled'
    };
  } catch (error) {
    console.error('Failed to play voice message', error);
    return {
      success: false,
      reason: error.message
    };
  }
};

// Format the reminder message for better TTS experience
const formatReminderMessage = (message) => {
  // Add a prefix if not already present
  if (!message.toLowerCase().includes('reminder')) {
    return `Reminder: ${message}`;
  }
  return message;
};

// Test TTS with a simple message
export const testTts = async () => {
  try {
    await initTts();
    return await playVoiceMessage('This is a test of the voice notification system');
  } catch (error) {
    console.error('TTS test failed', error);
    return {
      success: false,
      reason: error.message
    };
  }
};

// Stop current TTS playback
export const stopVoiceMessage = () => {
  Tts.stop();
  return true;
};

// Get the list of available voices
export const getAvailableVoices = async () => {
  try {
    const voices = await Tts.voices();
    return voices;
  } catch (error) {
    console.error('Failed to get voices', error);
    return [];
  }
};

// Set a specific voice
export const setVoice = async (voiceId) => {
  try {
    await Tts.setDefaultVoice(voiceId);
    return true;
  } catch (error) {
    console.error('Failed to set voice', error);
    return false;
  }
};