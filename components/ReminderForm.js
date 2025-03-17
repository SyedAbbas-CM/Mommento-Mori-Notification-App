// components/ReminderForm.js - Form for creating/editing reminders
import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

export default function ReminderForm({ 
  title, 
  setTitle, 
  message, 
  setMessage, 
  date, 
  setDate, 
  time, 
  setTime 
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };
  
  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Reminder title"
      />
      
      <Text style={styles.label}>Message</Text>
      <TextInput
        style={[styles.input, styles.messageInput]}
        value={message}
        onChangeText={setMessage}
        placeholder="What you want to be reminded about"
        multiline
      />
      
      <Text style={styles.label}>Date</Text>
      <TouchableOpacity
        style={styles.dateTimeButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>{format(date, 'MMMM d, yyyy')}</Text>
      </TouchableOpacity>
      
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      
      <Text style={styles.label}>Time</Text>
      <TouchableOpacity
        style={styles.dateTimeButton}
        onPress={() => setShowTimePicker(true)}
      >
        <Text>{format(time, 'h:mm a')}</Text>
      </TouchableOpacity>
      
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={onTimeChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateTimeButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
});