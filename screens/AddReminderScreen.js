// screens/AddReminderScreen.js - Screen to create new reminders
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { format } from 'date-fns';
import VoiceRecorder from '../components/VoiceRecorder';
import ReminderForm from '../components/ReminderForm';
import { saveReminder } from '../services/StorageService';
import { scheduleNotification } from '../services/NotificationService';

export default function AddReminderScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [isRecording, setIsRecording] = useState(false);
  
  const handleSaveReminder = async () => {
    // Combine date and time
    const reminderDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes()
    );
    
    const newReminder = {
      id: Date.now().toString(),
      title,
      message,
      datetime: reminderDateTime.toISOString(),
      isVoice: true,
    };
    
    // Save reminder to storage
    await saveReminder(newReminder);
    
    // Schedule notification
    await scheduleNotification(newReminder);
    
    // Return to home screen
    navigation.goBack();
  };

  // Function to parse voice input into reminder details
  const parseVoiceInput = (text) => {
    // Example: "Remind me to get up at 8" -> try to extract time and message
    // This is a simple implementation; could be enhanced with NLP
    
    const lowerText = text.toLowerCase();
    
    // Try to find time in the string
    const timeMatch = lowerText.match(/\bat\s+(\d+)(?::(\d+))?\s*(am|pm)?/i);
    
    if (timeMatch) {
      let hours = parseInt(timeMatch[1], 10);
      const minutes = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
      const period = timeMatch[3] ? timeMatch[3].toLowerCase() : null;
      
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
      
      // Remove the time part from the message
      const cleanMessage = lowerText.replace(/\bat\s+\d+(?::\d+)?\s*(?:am|pm)?/i, '');
      setMessage(cleanMessage.trim());
      setTitle(cleanMessage.substring(0, 30).trim() + '...');
    } else {
      // If no time found, just use the whole text as message
      setMessage(text);
      setTitle(text.substring(0, 30).trim() + '...');
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Voice Reminder</Text>
      
      <VoiceRecorder 
        isRecording={isRecording}
        setIsRecording={setIsRecording}
        onResult={(text) => parseVoiceInput(text)}
      />
      
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
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});