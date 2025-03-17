// utils/permissionUtils.js - Handle permissions for the app
import { Platform, PermissionsAndroid } from 'react-native';

// Request microphone permission for voice recording
export const requestMicrophonePermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'App needs access to your microphone to record voice reminders.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else if (Platform.OS === 'ios') {
      // For iOS, permissions are handled by the voice recognition library
      return true;
    }
    return false;
  } catch (err) {
    console.warn('Error requesting microphone permission:', err);
    return false;
  }
};

// Request notification permissions (mainly for iOS)
export const requestNotificationPermissions = async () => {
  // For Android, notifications permissions are requested when creating channel
  // For iOS, handled by react-native-push-notification
  return true;
};

// Request all needed permissions for the app
export const requestAllPermissions = async () => {
  const mic = await requestMicrophonePermission();
  const notifications = await requestNotificationPermissions();
  
  return {
    microphone: mic,
    notifications: notifications,
  };
};