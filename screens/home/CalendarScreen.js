import React, { useState } from "react";
import { View, Text, StyleSheet} from "react-native";
import { Calendar } from 'react-native-calendars';
import { getAuth } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { FIREBASE_DB } from "../../config/firebase";

const koreanDaysOfWeekTable = {
  Sun: '일',
  Mon: '월',
  Tue: '화',
  Wed: '수',
  Thu: '목',
  Fri: '금',
  Sat: '토',
};

const CalendarScreen = (props) => {
  const { navigation } = props;
  const [selected, setSelected] = useState('');
  const [showTasks, setShowTasks] = useState(false);
  const [categoryRatios, setCategoryRatios] = useState({});

  const handleDayPress = (day) => {
    setSelected(day.dateString);
    setShowTasks(true);
    fetchTasksForDate(day.dateString);
  };

  const fetchTasksForDate = (date) => {
    const formattedDate = date.replace(/-/g, '.');
    const dayPrefix = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).slice(0, 3);
    const todayDay = koreanDaysOfWeekTable[dayPrefix];
    const auth = getAuth();
    const user = auth.currentUser;

    const categoryNames = ['Sport', 'Learning', 'Morning Routine'];
    categoryNames.forEach((categoryName) => {
      const categoryRef = collection(FIREBASE_DB, 'todo-list', user.uid, categoryName);
      const q = query(categoryRef, orderBy('createdAt', 'desc'));

      onSnapshot(q, (snapshot) => {
        const tasksForCategory = [];
        snapshot.forEach((doc) => {
          const taskData = doc.data();
          if (taskData.categoryDays.includes(todayDay) && taskData.date === formattedDate) {
            tasksForCategory.push(taskData);
          }
        });

        const checkedCount = tasksForCategory.filter(task => task.isChecked).length;
        const ratio = `${checkedCount}/${tasksForCategory.length}`;

        setCategoryRatios(prev => ({
          ...prev,
          [categoryName]: ratio
        }));
      });
    });
  };

  const renderTaskList = () => {
    if (showTasks) {
      return (
        <View style={styles.taskListContainer}>
          <Text style={styles.taskListTitle}>Tasks for {selected}:</Text>
          {Object.entries(categoryRatios).map(([categoryName, ratio]) => {
            const [completed, total] = ratio.split('/').map(Number);
            const percentage = total ? Math.round((completed / total) * 100) : 0;
  
            // Only return the task items if the percentage, completed, or total are non-zero.
            if (total !== 0) {
              return (
                <Text key={categoryName} style={styles.taskItem}>
                  {categoryName}: {ratio} completed → {percentage}%
                </Text>
              );
            } else {
              return null;  // Return null if the conditions are not met.
            }
          })}
        </View>
      );
    }
    return null;
  };
  

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendar}
        onDayPress={handleDayPress}
        markedDates={{
          [selected]: { selected: true, disableTouchEvent: true }
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
    width: '100%',
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
