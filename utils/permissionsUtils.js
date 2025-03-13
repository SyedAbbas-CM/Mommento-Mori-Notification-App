// App.js - Main navigation container
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AddReminderScreen from './screens/AddReminderScreen';
import SettingsScreen from './screens/SettingsScreen';
import { initNotifications } from './services/notificationService';

const Stack = createStackNavigator();

export default function App() {
  React.useEffect(() => {
    // Initialize push notifications when app starts
    initNotifications();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Voice Reminders' }} />
        <Stack.Screen name="AddReminder" component={AddReminderScreen} options={{ title: 'New Reminder' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}