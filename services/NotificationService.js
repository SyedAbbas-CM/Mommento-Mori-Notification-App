// services/NotificationService.js - Enhanced push notification handling
import PushNotification from 'react-native-push-notification';
import { playVoiceMessage, stopVoiceMessage } from './ttsService';
import { getSettings } from './StorageService';

export const initNotifications = () => {
  // Configure the notification service
  PushNotification.configure({
    // Called when a notification is received or opened
    onNotification: async function (notification) {
      console.log('NOTIFICATION RECEIVED:', notification);
      
      // Check if this is a voice notification
      if (notification.data && notification.data.isVoice) {
        // Get settings to check if voice notifications are enabled
        const settings = await getSettings();
        
        if (!settings || settings.enableVoiceNotifications !== false) {  // Default to enabled if settings don't exist
          // First stop any currently playing message
          stopVoiceMessage();
          
          // Format the message for TTS
          let ttsMessage = notification.message || '';
          
          // Play the voice message
          const result = await playVoiceMessage(ttsMessage);
          console.log('TTS result:', result);
        }
      }
      
      // Handle notification click
      if (notification.userInteraction) {
        console.log('User clicked notification', notification.id);
        // Navigate or perform actions as needed
      }
    },
    
    // Called when Token is generated (iOS and Android)
    onRegister: function (token) {
      console.log('DEVICE TOKEN:', token);
    },
    
    // Called when registration fails
    onRegistrationError: function(err) {
      console.error('Notification registration error:', err);
    },
    
    // Should the initial notification be popped automatically (default: true)
    popInitialNotification: true,
    
    // Request permissions (iOS and Android >= 13)
    requestPermissions: true,
  });
  
  // Create a notification channel for Android
  PushNotification.createChannel(
    {
      channelId: 'voice-reminders',           // Required
      channelName: 'Voice Reminders',         // Required
      channelDescription: 'Voice reminder notifications with TTS feedback',
      playSound: true,
      soundName: 'default',
      importance: 5,                          // Max importance to ensure delivery
      vibrate: true,
    },
    (created) => console.log(`Notification channel created: ${created}`)
  );
  
  return true;
};

// Schedule a notification
export const scheduleNotification = async (reminder) => {
  try {
    // Get app settings
    const settings = await getSettings();
    
    // Schedule the notification with proper formatting
    PushNotification.localNotificationSchedule({
      channelId: 'voice-reminders',
      id: reminder.id,
      title: reminder.title,
      message: reminder.message,
      date: new Date(reminder.datetime),
      allowWhileIdle: true,          // Show notification even when app is closed
      importance: 'high',            // (Android) Importance level
      priority: 'high',              // (Android) Priority level
      playSound: true,               // Play a sound
      soundName: 'default',          // Sound to play
      vibrate: settings?.enableVibration !== false, // Vibrate on notification
      
      // Custom data
      data: {
        id: reminder.id,
        isVoice: true,               // Flag this as a voice notification
        createdAt: new Date().toISOString(),
      },
    });
    
    console.log('Notification scheduled for:', new Date(reminder.datetime));
    return true;
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    return false;
  }
};

// Cancel a scheduled notification
export const cancelNotification = (id) => {
  try {
    PushNotification.cancelLocalNotification(id);
    console.log('Notification canceled:', id);
    return true;
  } catch (error) {
    console.error('Failed to cancel notification:', error);
    return false;
  }
};

// Cancel all scheduled notifications
export const cancelAllNotifications = () => {
  try {
    PushNotification.cancelAllLocalNotifications();
    console.log('All notifications canceled');
    return true;
  } catch (error) {
    console.error('Failed to cancel all notifications:', error);
    return false;
  }
};

// Get all scheduled notifications
export const getScheduledNotifications = async () => {
  return new Promise((resolve) => {
    PushNotification.getScheduledLocalNotifications((notifications) => {
      resolve(notifications);
    });
  });
};

// Immediately trigger a test notification with TTS
export const testVoiceNotification = async (message = 'This is a test voice notification') => {
  try {
    PushNotification.localNotification({
      channelId: 'voice-reminders',
      title: 'Test Notification',
      message: message,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      priority: 'high',
      
      // Custom data
      data: {
        id: 'test-notification',
        isVoice: true,
        createdAt: new Date().toISOString(),
      },
    });
    
    return true;
  } catch (error) {
    console.error('Test notification failed:', error);
    return false;
  }
};