// App.js - Updated with new screens
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Requires installing expo vector icons

// Core Screens
import HomeScreen from './screens/HomeScreen';
import AddReminderScreen from './screens/AddReminderScreen';
import SettingsScreen from './screens/SettingsScreen';

// Additional Feature Screens
import HouseManagementScreen from './screens/HouseManagementScreen';
import MementoMoriScreen from './screens/MementoMoriScreen';

// Services
import { initNotifications } from './services/NotificationService';
import { initTts } from './services/ttsService';
import { requestAllPermissions } from './utils/permissionUtils';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack navigator for reminders section
const RemindersStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Reminders" component={HomeScreen} options={{ title: 'Voice Reminders' }} />
      <Stack.Screen name="AddReminder" component={AddReminderScreen} options={{ title: 'New Reminder' }} />
    </Stack.Navigator>
  );
};

// Main tab navigator
const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'RemindersTab') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'House') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'MementoMori') {
            iconName = focused ? 'hourglass' : 'hourglass-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="RemindersTab" 
        component={RemindersStack} 
        options={{ 
          headerShown: false,
          title: 'Reminders'
        }} 
      />
      <Tab.Screen 
        name="House" 
        component={HouseManagementScreen} 
        options={{ 
          title: 'House'
        }} 
      />
      <Tab.Screen 
        name="MementoMori" 
        component={MementoMoriScreen} 
        options={{ 
          title: 'Life Goals'
        }} 
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ 
          title: 'Settings'
        }} 
      />
    </Tab.Navigator>
  );
};

export default function App() {
  React.useEffect(() => {
    // Initialize services and request permissions when app starts
    const setupApp = async () => {
      // Request needed permissions
      const permissions = await requestAllPermissions();
      console.log('Permissions status:', permissions);
      
      // Initialize push notifications
      initNotifications();
      
      // Initialize text-to-speech
      initTts();
    };
    
    setupApp();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={AppTabs} />
        <Stack.Screen 
          name="AddReminder" 
          component={AddReminderScreen} 
          options={{ 
            headerShown: true,
            title: 'New Reminder'
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}