    // components/VoiceRecorder.js - Voice input component
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Voice from 'react-native-voice';

export default function VoiceRecorder({ isRecording, setIsRecording, onResult }) {
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Initialize voice recognition
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;
    
    return () => {
      // Cleanup
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);
  
  const onSpeechStart = () => {
    setResults([]);
    setError('');
  };
  
  const onSpeechEnd = () => {
    setIsRecording(false);
  };
  
  const onSpeechResults = (event) => {
    setResults(event.value);
    
    // Pass the best result to parent component
    if (event.value && event.value.length > 0) {
      onResult(event.value[0]);
    }
  };
  
  const onSpeechError = (event) => {
    setError(event.error.message);
    setIsRecording(false);
  };
  
  const startRecording = async () => {
    try {
      await Voice.start('en-US');
      setIsRecording(true);
    } catch (e) {
      setError(e);
    }
  };
  
  const stopRecording = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
    } catch (e) {
      setError(e);
    }
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          isRecording ? styles.recordingButton : null
        ]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>
          {isRecording ? 'Stop Recording' : 'Start Voice Recording'}
        </Text>
      </TouchableOpacity>
      
      {results.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsLabel}>I heard:</Text>
          <Text style={styles.resultsText}>{results[0]}</Text>
        </View>
      )}
      
      {error ? (
        <Text style={styles.errorText}>Error: {error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  recordingButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultsContainer: {
    marginTop: 16,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  resultsLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultsText: {
    fontSize: 16,
  },
  errorText: {
    color: '#f44336',
    marginTop: 8,
  },
});