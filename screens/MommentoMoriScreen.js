
// -------------------------------------------------
// MEMENTO MORI - SELF IMPROVEMENT APP
// -------------------------------------------------

// screens/MementoMoriScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { getUserLifeData, saveUserLifeData, addLifeGoal, completeLifeGoal } from '../services/lifeTrackerService';

export default function MementoMoriScreen() {
  const [lifeData, setLifeData] = useState({
    birthDate: null,
    lifeExpectancy: 80,
    goals: [],
  });
  
  const [modalVisible, setModalVisible] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'personal',
  });
  
  useEffect(() => {
    loadLifeData();
  }, []);
  
  const loadLifeData = async () => {
    const data = await getUserLifeData();
    setLifeData(data);
  };
  
  const handleSaveGoal = async () => {
    if (!newGoal.title) return;
    
    await addLifeGoal({
      ...newGoal,
      id: Date.now().toString(),
      dateCreated: new Date().toISOString(),
      completed: false,
    });
    
    setModalVisible(false);
    setNewGoal({
      title: '',
      description: '',
      category: 'personal',
    });
    
    loadLifeData();
  };
  
  const handleCompleteGoal = async (goalId) => {
    await completeLifeGoal(goalId);
    loadLifeData();
  };
  
  const calculateTimeRemaining = () => {
    if (!lifeData.birthDate) return null;
    
    const birthDate = new Date(lifeData.birthDate);
    const now = new Date();
    
    // Calculate age in years
    const ageInMs = now - birthDate;
    const ageInYears = ageInMs / (1000 * 60 * 60 * 24 * 365.25);
    
    // Calculate remaining years
    const remainingYears = lifeData.lifeExpectancy - ageInYears;
    
    return {
      ageYears: Math.floor(ageInYears),
      remainingYears: Math.max(0, Math.floor(remainingYears)),
      livedPercentage: Math.min(100, (ageInYears / lifeData.lifeExpectancy) * 100).toFixed(1),
      remainingPercentage: Math.max(0, (100 - ((ageInYears / lifeData.lifeExpectancy) * 100))).toFixed(1),
    };
  };
  
  const timeRemaining = calculateTimeRemaining();
  
  const renderLifeVisualizer = () => {
    if (!timeRemaining) return null;
    
    return (
      <View style={styles.visualizerContainer}>
        <Text style={styles.visualizerTitle}>Life Progress</Text>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${timeRemaining.livedPercentage}%` }
            ]} 
          />
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{timeRemaining.ageYears}</Text>
            <Text style={styles.statLabel}>Years Lived</Text>
          </View>
          
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{timeRemaining.remainingYears}</Text>
            <Text style={styles.statLabel}>Years Left</Text>
          </View>
          
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{timeRemaining.livedPercentage}%</Text>
            <Text style={styles.statLabel}>Complete</Text>
          </View>
        </View>
      </View>
    );
  };
  
  const renderGoalsByCategory = (category) => {
    const filteredGoals = lifeData.goals.filter(goal => goal.category === category);
    
    if (filteredGoals.length === 0) {
      return (
        <Text style={styles.emptyGoals}>No {category} goals yet</Text>
      );
    }
    
    return filteredGoals.map(goal => (
      <View key={goal.id} style={styles.goalItem}>
        <View style={styles.goalDetails}>
          <Text style={styles.goalTitle}>{goal.title}</Text>
          {goal.description ? (
            <Text style={styles.goalDescription}>{goal.description}</Text>
          ) : null}
          <Text style={styles.goalDate}>
            Created: {new Date(goal.dateCreated).toLocaleDateString()}
          </Text>
        </View>
        
        {!goal.completed ? (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => handleCompleteGoal(goal.id)}
          >
            <Text style={styles.completeButtonText}>Complete</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>Completed</Text>
          </View>
        )}
      </View>
    ));
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Memento Mori</Text>
      <Text style={styles.subheader}>Remember that you are mortal</Text>
      
      {renderLifeVisualizer()}
      
      <View style={styles.goalsSection}>
        <Text style={styles.sectionTitle}>Life Goals</Text>
        
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>Personal</Text>
          {renderGoalsByCategory('personal')}
        </View>
        
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>Professional</Text>
          {renderGoalsByCategory('professional')}
        </View>
        
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>Health</Text>
          {renderGoalsByCategory('health')}
        </View>
        
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>Relationships</Text>
          {renderGoalsByCategory('relationships')}
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add Life Goal</Text>
      </TouchableOpacity>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>New Life Goal</Text>
            
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={newGoal.title}
              onChangeText={(text) => setNewGoal({...newGoal, title: text})}
              placeholder="Goal title"
            />
            
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newGoal.description}
              onChangeText={(text) => setNewGoal({...newGoal, description: text})}
              placeholder="Optional description"
              multiline
            />
            
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryButtons}>
              {['personal', 'professional', 'health', 'relationships'].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    newGoal.category === category && styles.categoryButtonActive
                  ]}
                  onPress={() => setNewGoal({...newGoal, category})}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      newGoal.category === category && styles.categoryButtonTextActive
                    ]}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
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
                onPress={handleSaveGoal}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </Modal>
    </ScrollView>
  );
}