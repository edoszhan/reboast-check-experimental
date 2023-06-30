import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Calendar } from 'react-native-calendars';
import { ROUTES } from "../../constants";

const CalendarScreen = (props) => {
  const {navigation} = props;
  const [selected, setSelected] = useState('');
  const [showTasks, setShowTasks] = useState(false);

  const tasksForSelectedDay = [
    { id: 1, title: 'English' },
    { id: 2, title: 'Spanish' },
    { id: 3, title: 'Math' },
  ];

  const handleDayPress = (day) => {
    setSelected(day.dateString);
    setShowTasks(true);
  };
  
  const renderTaskList = () => {
    if (showTasks) {
      return (
        <View style={styles.taskListContainer}>
          <Text style={styles.taskListTitle}>Tasks for {selected}:</Text>
          {tasksForSelectedDay.map((task) => (
            <Text key={task.id} style={styles.taskItem}>{task.title}</Text>
          ))}
        <Button title="Go to Timer" onPress={() => navigation.navigate(ROUTES.TIMER)} />
    
        </View>


       
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendar} // Add this style prop to modify the calendar's size
        onDayPress={handleDayPress}
        markedDates={{
          [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
        }}
      />
      {renderTaskList()}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  calendar: {
    width: '100%', // Adjust the width as needed
    marginBottom: 20,
    height: 400,
  },
  taskListContainer: {
    paddingHorizontal: 20,
  },
  taskListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taskItem: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default CalendarScreen;