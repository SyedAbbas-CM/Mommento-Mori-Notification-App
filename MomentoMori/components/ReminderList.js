// components/ReminderList.js - Enhanced reminder list display
import React from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { format } from 'date-fns';
import { deleteReminder } from '../services/StorageService';
import { cancelNotification } from '../services/NotificationService';
import { formatReminderDate, getTimeRemaining } from '../utils/timeUtils';

export default function ReminderList({ reminders, onRefresh, refreshing = false }) {
  
  const handleDeleteReminder = async (id, title) => {
    // Ask for confirmation
    Alert.alert(
      'Delete Reminder',
      `Are you sure you want to delete "${title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              // Delete from storage
              await deleteReminder(id);
              
              // Cancel scheduled notification
              await cancelNotification(id);
              
              // Refresh the list
              if (onRefresh) {
                onRefresh();
              }
              
              // Show success message
              Alert.alert('Success', 'Reminder deleted successfully');
            } catch (error) {
              console.error('Error deleting reminder:', error);
              Alert.alert('Error', 'Failed to delete reminder');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  const isPastDue = (datetime) => {
    return new Date(datetime) < new Date();
  };
  
  const renderItem = ({ item }) => {
    const reminderDate = new Date(item.datetime);
    const pastDue = isPastDue(item.datetime);
    
    return (
      <View style={[styles.reminderItem, pastDue && styles.pastDueItem]}>
        <View style={styles.reminderContent}>
          <Text style={styles.reminderTitle}>{item.title}</Text>
          
          <Text style={[styles.reminderDateTime, pastDue && styles.pastDueText]}>
            {formatReminderDate(item.datetime)}
          </Text>
          
          <Text style={styles.reminderMessage}>{item.message}</Text>
          
          <View style={styles.badgeContainer}>
            {item.isVoice && (
              <View style={styles.voiceBadge}>
                <Text style={styles.voiceBadgeText}>Voice</Text>
              </View>
            )}
            
            {!pastDue && (
              <View style={styles.timeRemainingBadge}>
                <Text style={styles.timeRemainingText}>
                  In {getTimeRemaining(item.datetime)}
                </Text>
              </View>
            )}
            
            {pastDue && (
              <View style={styles.pastDueBadge}>
                <Text style={styles.pastDueBadgeText}>Past Due</Text>
              </View>
            )}
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteReminder(item.id, item.title)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const sortReminders = (reminders) => {
    const now = new Date();
    const upcoming = reminders.filter(r => new Date(r.datetime) > now);
    const past = reminders.filter(r => new Date(r.datetime) <= now);
    
    // Sort upcoming by date (closest first)
    upcoming.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
    
    // Sort past by date (most recent first)
    past.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
    
    // Return upcoming first, then past
    return [...upcoming, ...past];
  };
  
  const renderSectionHeader = () => {
    const now = new Date();
    const hasUpcoming = reminders.some(r => new Date(r.datetime) > now);
    const hasPast = reminders.some(r => new Date(r.datetime) <= now);
    
    if (hasUpcoming && hasPast) {
      return (
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeader}>Upcoming Reminders</Text>
        </View>
      );
    }
    
    return null;
  };
  
  const renderPastSection = () => {
    const now = new Date();
    const hasUpcoming = reminders.some(r => new Date(r.datetime) > now);
    const hasPast = reminders.some(r => new Date(r.datetime) <= now);
    
    if (hasUpcoming && hasPast) {
      return (
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeader}>Past Reminders</Text>
        </View>
      );
    }
    
    return null;
  };
  
  return (
    <View style={styles.container}>
      {reminders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No reminders yet</Text>
          <Text style={styles.emptyStateSubtext}>Create your first voice reminder!</Text>
        </View>
      ) : (
        <FlatList
          data={sortReminders(reminders)}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#2196F3']}
              tintColor={'#2196F3'}
            />
          }
          ListHeaderComponent={renderSectionHeader}
          ListFooterComponent={renderPastSection}
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
    paddingBottom: 80,  // Space for the add button
    paddingHorizontal: 16,
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
  emptyStateSubtext: {
    color: '#666',
  },
  sectionHeaderContainer: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 4,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
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
  pastDueItem: {
    backgroundColor: '#fff8f8',
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
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
    color: '#2196F3',
    marginBottom: 8,
    fontWeight: '500',
  },
  pastDueText: {
    color: '#f44336',
  },
  reminderMessage: {
    fontSize: 14,
    marginBottom: 8,
    color: '#444',
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  voiceBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  voiceBadgeText: {
    color: '#2196F3',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timeRemainingBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  timeRemainingText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pastDueBadge: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  pastDueBadgeText: {
    color: '#f44336',
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