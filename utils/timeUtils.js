// utils/timeUtils.js - Time-related utilities
import { format, isToday, isTomorrow, addDays, parseISO } from 'date-fns';

// Format a date for display
export const formatReminderDate = (dateString) => {
  const date = parseISO(dateString);
  
  if (isToday(date)) {
    return `Today at ${format(date, 'h:mm a')}`;
  } else if (isTomorrow(date)) {
    return `Tomorrow at ${format(date, 'h:mm a')}`;
  } else {
    return format(date, 'MMM d, yyyy \'at\' h:mm a');
  }
};

// Parse a natural language time string
export const parseTimeString = (input) => {
  const now = new Date();
  
  // Regular expressions for common time patterns
  const timeRegex = /(\d{1,2})(?::(\d{1,2}))?(?:\s*(am|pm))?/i;
  const dayRegex = /\b(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i;
  
  // Try to match time
  const timeMatch = input.match(timeRegex);
  let hours = now.getHours();
  let minutes = now.getMinutes();
  
  if (timeMatch) {
    hours = parseInt(timeMatch[1], 10);
    minutes = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    
    // Handle AM/PM
    const period = timeMatch[3] ? timeMatch[3].toLowerCase() : null;
    if (period === 'pm' && hours < 12) {
      hours += 12;
    } else if (period === 'am' && hours === 12) {
      hours = 0;
    }
  }
  
  // Try to match day
  const dayMatch = input.match(dayRegex);
  let resultDate = new Date();
  
  if (dayMatch) {
    const day = dayMatch[1].toLowerCase();
    
    if (day === 'tomorrow') {
      resultDate = addDays(now, 1);
    } else if (day !== 'today') {
      // Handle weekdays
      const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const targetDay = weekdays.indexOf(day);
      const currentDay = now.getDay();
      
      if (targetDay !== -1) {
        // Calculate days to add (handle the case where target day is earlier in the week)
        const daysToAdd = (targetDay + 7 - currentDay) % 7;
        resultDate = addDays(now, daysToAdd === 0 ? 7 : daysToAdd);
      }
    }
  }
  
  // Set the time on the result date
  resultDate.setHours(hours);
  resultDate.setMinutes(minutes);
  resultDate.setSeconds(0);
  resultDate.setMilliseconds(0);
  
  return resultDate;
};

// Check if a time is in the past
export const isTimeInPast = (dateTime) => {
  const now = new Date();
  return dateTime < now;
};

// Get a human-readable time remaining string
export const getTimeRemaining = (dateString) => {
  const targetDate = parseISO(dateString);
  const now = new Date();
  
  // Calculate time difference in milliseconds
  const diff = targetDate - now;
  
  if (diff <= 0) {
    return 'Now';
  }
  
  // Convert to various time units
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else {
    return 'Less than a minute';
  }
};