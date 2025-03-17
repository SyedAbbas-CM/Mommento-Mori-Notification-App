// screens/AddReminderScreen.js - Enhanced screen to create reminders
import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Switch } from 'react-native';
import { format, addMinutes } from 'date-fns';
import VoiceRecorder from '../components/VoiceRecorder';
import ReminderForm from '../components/ReminderForm';
import { saveReminder } from '../services/StorageService';
import { scheduleNotification } from '../services/NotificationService';
import { parseTimeString } from '../utils/timeUtils';

export default function AddReminderScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [isRecording, setIsRecording] = useState(false);
  const [useVoiceInput, setUseVoiceInput] = useState(false);
  const [quickTime, setQuickTime] = useState(null);
  
  const handleQuickTime = (minutes) => {
    const newTime = addMinutes(new Date(), minutes);
    setDate(newTime);
    setTime(newTime);
    setQuickTime(minutes);
  };
  
  const handleSaveReminder = async () => {
    if (!message.trim()) {
      alert('Please enter a reminder message');
      return;
    }
    
    // Combine date and time
    const reminderDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes()
    );
    
    // If the time is in the past, show alert
    if (reminderDateTime < new Date()) {
      alert('Please select a future time for your reminder');
      return;
    }
    
    const newReminder = {
      id: Date.now().toString(),
      title: title || message.substring(0, 30) + (message.length > 30 ? '...' : ''),
      message,
      datetime: reminderDateTime.toISOString(),
      isVoice: true,
    };
    
    // Save reminder to storage
    await saveReminder(newReminder);
    
    // Schedule notification
    await scheduleNotification(newReminder);
    
    // Show confirmation
    alert('Reminder saved! Your notification will be played by your device at the scheduled time.');
    
    // Return to home screen
    navigation.goBack();
  };

  // Function to parse text input for time information
  const parseTextInput = (text) => {
    setMessage(text);
    
    // Try to extract time information
    const lowerText = text.toLowerCase();
    
    // Look for "at X" or "in X minutes" patterns
    const atTimeMatch = lowerText.match(/\bat\s+(\d+)(?::(\d+))?\s*(am|pm)?/i);
    const inMinutesMatch = lowerText.match(/\bin\s+(\d+)\s+minute(?:s)?/i);
    
    if (atTimeMatch) {
      let hours = parseInt(atTimeMatch[1], 10);
      const minutes = atTimeMatch[2] ? parseInt(atTimeMatch[2], 10) : 0;
      const period = atTimeMatch[3] ? atTimeMatch[3].toLowerCase() : null;
      
      // Adjust hours for am/pm
      if (period === 'pm' && hours < 12) {
        hours += 12;
      } else if (period === 'am' && hours === 12) {
        hours = 0;
      }
      
      // Set the time
      const newTime = new Date();
      newTime.setHours(hours);
      newTime.setMinutes(minutes);
      setTime(newTime);
      
      // Generate title
      setTitle(text.substring(0, 30).trim() + (text.length > 30 ? '...' : ''));
    } else if (inMinutesMatch) {
      const minutes = parseInt(inMinutesMatch[1], 10);
      const newTime = addMinutes(new Date(), minutes);
      setDate(newTime);
      setTime(newTime);
      
      // Generate title
      setTitle(text.substring(0, 30).trim() + (text.length > 30 ? '...' : ''));
    }
  };
  
  // Function to parse voice input into reminder details
  const parseVoiceInput = (text) => {
    setMessage(text);
    
    // Try to extract time information
    const parsedTime = parseTimeString(text);
    if (parsedTime) {
      setDate(parsedTime);
      setTime(parsedTime);
    }
    
    // Generate title
    setTitle(text.substring(0, 30).trim() + (text.length > 30 ? '...' : ''));
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create Reminder</Text>
      
      {/* Input Method Toggle */}
      <View style={styles.inputToggle}>
        <Text style={styles.toggleLabel}>Use voice input</Text>
        <Switch
          value={useVoiceInput}
          onValueChange={setUseVoiceInput}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={useVoiceInput ? '#2196F3' : '#f4f3f4'}
        />
      </View>
      
      {/* Voice Input or Text Input */}
      {useVoiceInput ? (
        <VoiceRecorder 
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          onResult={(text) => parseVoiceInput(text)}
        />
      ) : (
        <View style={styles.textInputContainer}>
          <Text style={styles.label}>Reminder Message</Text>
          <TextInput
            style={styles.textInput}
            value={message}
            onChangeText={parseTextInput}
            placeholder="Type your reminder (e.g., 'Go to the gym at 8 am')"
            multiline
          />
        </View>
      )}
      
      {/* Quick Time Selection */}
      <View style={styles.quickTimeContainer}>
        <Text style={styles.label}>Quick Time:</Text>
        <View style={styles.quickTimeButtons}>
          <TouchableOpacity 
            style={[styles.quickTimeButton, quickTime === 5 && styles.quickTimeButtonSelected]}
            onPress={() => handleQuickTime(5)}
          >
            <Text style={[styles.quickTimeText, quickTime === 5 && styles.quickTimeTextSelected]}>5 min</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.quickTimeButton, quickTime === 15 && styles.quickTimeButtonSelected]}
            onPress={() => handleQuickTime(15)}
          >
            <Text style={[styles.quickTimeText, quickTime === 15 && styles.quickTimeTextSelected]}>15 min</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.quickTimeButton, quickTime === 30 && styles.quickTimeButtonSelected]}
            onPress={() => handleQuickTime(30)}
          >
            <Text style={[styles.quickTimeText, quickTime === 30 && styles.quickTimeTextSelected]}>30 min</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.quickTimeButton, quickTime === 60 && styles.quickTimeButtonSelected]}
            onPress={() => handleQuickTime(60)}
          >
            <Text style={[styles.quickTimeText, quickTime === 60 && styles.quickTimeTextSelected]}>1 hour</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Date/Time Form */}
      <ReminderForm
        title={title}
        setTitle={setTitle}
        message={message}
        setMessage={setMessage}
        date={date}
        setDate={setDate}
        time={time}
        setTime={setTime}
      />
      
      {/* Save Button */}
      <TouchableOpacity 
        style={styles.saveButton}
        onPress={handleSaveReminder}
      >
        <Text style={styles.buttonText}>Save Reminder</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    elevation: 1,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  textInputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#333',
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  quickTimeContainer: {
    marginVertical: 16,
  },
  quickTimeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickTimeButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  quickTimeButtonSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  quickTimeText: {
    color: '#333',
    fontWeight: '500',
  },
  quickTimeTextSelected: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});