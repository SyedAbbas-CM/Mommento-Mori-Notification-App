// components/ReminderList.js - Display list of reminders
import React from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { deleteReminder } from '../services/StorageService';
import { cancelNotification } from '../services/NotificationService';

export default function ReminderList({ reminders, onRefresh }) {
  const handleDeleteReminder = async (id) => {
    // Delete from storage
    await deleteReminder(id);
    
    // Cancel scheduled notification
    await cancelNotification(id);
    
    // Refresh the list
    if (onRefresh) {
      onRefresh();
    }
  };
  
  const renderItem = ({ item }) => {
    const reminderDate = new Date(item.datetime);
    
    return (
      <View style={styles.reminderItem}>
        <View style={styles.reminderContent}>
          <Text style={styles.reminderTitle}>{item.title}</Text>
          <Text style={styles.reminderDateTime}>
            {format(reminderDate, 'MMM d, yyyy • h:mm a')}
          </Text>
          <Text style={styles.reminderMessage}>{item.message}</Text>
          {item.isVoice && (
            <View style={styles.voiceBadge}>
              <Text style={styles.voiceBadgeText}>Voice</Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteReminder(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      {reminders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No reminders yet</Text>
          <Text>Create your first voice reminder!</Text>
        </View>
      ) : (
        <FlatList
          data={reminders}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingBottom: 80, // Space for the add button
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  reminderItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reminderDateTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  reminderMessage: {
    fontSize: 14,
    marginBottom: 8,
  },
  voiceBadge: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  voiceBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    justifyContent: 'center',
    paddingLeft: 16,
  },
  deleteButtonText: {
    color: '#f44336',
    fontWeight: '500',
  },
});
