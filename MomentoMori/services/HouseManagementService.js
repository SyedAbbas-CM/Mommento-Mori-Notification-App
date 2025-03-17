// -------------------------------------------------
// HOUSE MANAGEMENT REGISTER
// -------------------------------------------------

// screens/HouseManagementScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import { getHouseTasks, saveHouseTask, completeHouseTask } from '../services/HouseManagementService';

export default function HouseManagementScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    area: '',
    frequency: 'weekly',
    lastCompleted: null,
  });
  
  useEffect(() => {
    loadTasks();
    
    const unsubscribe = navigation.addListener('focus', loadTasks);
    return unsubscribe;
  }, [navigation]);
  
  const loadTasks = async () => {
    const houseTasks = await getHouseTasks();
    setTasks(houseTasks);
  };
  
  const handleSaveTask = async () => {
    if (!newTask.title || !newTask.area) return;
    
    await saveHouseTask({
      ...newTask,
      id: Date.now().toString(),
    });
    
    setModalVisible(false);
    setNewTask({
      title: '',
      area: '',
      frequency: 'weekly',
      lastCompleted: null,
    });
    
    loadTasks();
  };
  
  const handleCompleteTask = async (taskId) => {
    await completeHouseTask(taskId);
    loadTasks();
  };
  
  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <View style={styles.taskDetails}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskArea}>{item.area}</Text>
        <Text style={styles.taskFrequency}>
          {item.frequency.charAt(0).toUpperCase() + item.frequency.slice(1)}
        </Text>
        {item.lastCompleted && (
          <Text style={styles.taskLastCompleted}>
            Last done: {new Date(item.lastCompleted).toLocaleDateString()}
          </Text>
        )}
      </View>
      
      <TouchableOpacity
        style={styles.completeButton}
        onPress={() => handleCompleteTask(item.id)}
      >
        <Text style={styles.completeButtonText}>Complete</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>House Management</Text>
      
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </TouchableOpacity>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>New House Task</Text>
            
            <Text style={styles.label}>Task</Text>
            <TextInput
              style={styles.input}
              value={newTask.title}
              onChangeText={(text) => setNewTask({...newTask, title: text})}
              placeholder="Task name"
            />
            
            <Text style={styles.label}>Area</Text>
            <TextInput
              style={styles.input}
              value={newTask.area}
              onChangeText={(text) => setNewTask({...newTask, area: text})}
              placeholder="Kitchen, Bathroom, etc."
            />
            
            <Text style={styles.label}>Frequency</Text>
            <View style={styles.frequencyButtons}>
              {['daily', 'weekly', 'monthly', 'quarterly'].map((freq) => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles.frequencyButton,
                    newTask.frequency === freq && styles.frequencyButtonActive
                  ]}
                  onPress={() => setNewTask({...newTask, frequency: freq})}
                >
                  <Text
                    style={[
                      styles.frequencyButtonText,
                      newTask.frequency === freq && styles.frequencyButtonTextActive
                    ]}
                  >
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveTask}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  list: {
    paddingBottom: 80, // Space for the add button
  },
  taskItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    elevation: 2,
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  taskArea: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  taskFrequency: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  taskLastCompleted: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  completeButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#673AB7',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 3,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
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
  },
  frequencyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  frequencyButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  frequencyButtonActive: {
    backgroundColor: '#673AB7',
    borderColor: '#673AB7',
  },
  frequencyButtonText: {
    color: '#666',
  },
  frequencyButtonTextActive: {
    color: 'white',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    marginRight: 12,
    padding: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 4,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});