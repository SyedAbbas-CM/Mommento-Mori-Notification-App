
// services/houseManagementService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const HOUSE_TASKS_KEY = '@VoiceReminder:houseTasks';

export const getHouseTasks = async () => {
  try {
    const tasksJson = await AsyncStorage.getItem(HOUSE_TASKS_KEY);
    if (tasksJson !== null) {
      return JSON.parse(tasksJson);
    }
    return [];
  } catch (error) {
    console.error('Error getting house tasks:', error);
    return [];
  }
};

export const saveHouseTask = async (task) => {
  try {
    const tasks = await getHouseTasks();
    tasks.push(task);
    await AsyncStorage.setItem(HOUSE_TASKS_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error('Error saving house task:', error);
    return false;
  }
};

export const completeHouseTask = async (taskId) => {
  try {
    const tasks = await getHouseTasks();
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          lastCompleted: new Date().toISOString(),
        };
      }
      return task;
    });
    
    await AsyncStorage.setItem(HOUSE_TASKS_KEY, JSON.stringify(updatedTasks));
    return true;
  } catch (error) {
    console.error('Error completing house task:', error);
    return false;
  }
};
