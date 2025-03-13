// services/notificationService.js - Push notification handling
import PushNotification from 'react-native-push-notification';
import { playVoiceMessage } from './ttsService';
import { getSettings } from './StorageService';

export const initNotifications = () => {
  // Configure the notification service
  PushNotification.configure({
    // (required) Called when a remote or local notification is opened or received
    onNotification: async function (notification) {
      console.log('NOTIFICATION:', notification);
      
      // Check if this is a voice notification
      if (notification.data && notification.data.isVoice) {
        // Get settings to check if voice notifications are enabled
        const settings = await getSettings();
        
        if (settings.enableVoiceNotifications) {
          // Play the voice message
          playVoiceMessage(notification.message);
        }
      }
      
      // If you need to handle clicking on the notification
      if (notification.userInteraction) {
        // Navigate to a specific screen or perform action
      }
    },
    
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function (token) {
      console.log('TOKEN:', token);
    },
    
    // (optional) Called when the user fails to register for notifications
    onRegistrationError: function(err) {
      console.error(err.message, err);
    },
    
    // Should the initial notification be popped automatically (default: true)
    popInitialNotification: true,
    
    // If permissions are requested automatically (default: true)
    requestPermissions: true,
  });
  
  // Create a notification channel for Android
  PushNotification.createChannel(
    {
      channelId: 'voice-reminders', // (required)
      channelName: 'Voice Reminders', // (required)
      channelDescription: 'Voice reminder notifications',
      playSound: true,
      soundName: 'default',
      importance: 4, // (optional) default: 4. Values: 1-5.
      vibrate: true,
    },
    (created) => console.log(`Channel created: ${created}`)
  );
};

export const scheduleNotification = async (reminder) => {
  // Get app settings
  const settings = await getSettings();
  
  // Schedule the notification
  PushNotification.localNotificationSchedule({
    channelId: 'voice-reminders',
    id: reminder.id,
    title: reminder.title,
    message: reminder.message,
    date: new Date(reminder.datetime),
    allowWhileIdle: true, // (optional) notifications even when app is closed
    playSound: true,
    vibrate: settings.enableVibration,
    
    // Custom data
    data: {
      id: reminder.id,
      isVoice: reminder.isVoice,
    },
  });
};

export const cancelNotification = (id) => {
  PushNotification.cancelLocalNotification(id);
};
