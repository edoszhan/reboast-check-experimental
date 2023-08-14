import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../constants';
import { AntDesign } from '@expo/vector-icons';
import CalendarStrip  from 'react-native-calendar-strip';


const CustomCheckbox = ({ checked }) => {
  return (
    <View style={styles.checkboxContainer}>
      {checked && <View style={styles.checkboxInner} />}
    </View>
  );
};

const koreanDaysOfWeekTable = {
  Sun: '일',
  Mon: '월',
  Tue: '화',
  Wed: '수',
  Thu: '목',
  Fri: '금',
  Sat: '토',
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const [tasksByCategory, setTasksByCategory] = useState({});
  const auth = getAuth();
  const [selectDate, setSelectedDate] = useState(new Date().toDateString('en-US', { weekday: 'long' }));
  const [searchDay, setSearchDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }));


  useEffect(() => {
    const checkedTaskNames = [];
    Object.entries(tasksByCategory).forEach(([categoryName, tasks]) => {
      tasks.forEach((task) => {
        if (task.checked) { 
          checkedTaskNames.push(task.categoryItems);
        }
      });
    });
    console.log(checkedTaskNames);
  }, [tasksByCategory]);

  useEffect(() => {
    const today = searchDay;
    const dayPrefix = today.slice(0, 3);
    const todayDay = koreanDaysOfWeekTable[dayPrefix];
    const user = auth.currentUser;
    const categoryNames = ['Sport', 'Learning', 'Morning Routine']; //can be appended later if the "add category" feature is added
    const unsubscribeTasks = categoryNames.map((categoryName) => {
      const categoryRef = collection(FIREBASE_DB, 'todo-list', user.uid, categoryName);
      const q = query(categoryRef, orderBy('createdAt', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const taskList = [];
        snapshot.forEach((doc) => {
          const taskData = doc.data();
          if (taskData.categoryDays.includes(todayDay)) {
          taskList.push({ ...taskData, checked: false }); // Add checked property to task data
          }
        });
        setTasksByCategory((prevTasksByCategory) => ({
          ...prevTasksByCategory,
          [categoryName]: taskList,
        }));
      });
    });

    return () => {
      // Unsubscribe from task listeners for each category
      unsubscribeTasks.forEach((unsubscribe) => {
        unsubscribe();
      });
    };
  }, [searchDay]);
  
  const toggleTaskChecked = (categoryName, taskId) => {
    setTasksByCategory((prevTasksByCategory) => {
      const updatedTasks = prevTasksByCategory[categoryName].map((task) =>
        task.categoryId === taskId ? { ...task, checked: !task.checked } : task
      );
      return {
        ...prevTasksByCategory,
        [categoryName]: updatedTasks,
      };
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{...styles.heading, marginBottom: 20}}>Todo Tasks</Text>
      {/* <Text style={{...styles.heading, fontSize: 15, fontWeight: "normal"}}>Chosen date is {todayDayoftheWeek}</Text> */}
      <Text style={{...styles.heading, fontSize: 15, fontWeight: "normal"}}>Todo are shown for [{selectDate.slice(4,15)}]</Text>
      <View style={{height: 80}}>
      <ScrollView>
      <CalendarStrip 
          calendarColor={'#f2f2f2'}
          calendarHeaderStyle={{color: 'black'}}
          dateNumberStyle={{color: 'black'}}
          dateNameStyle={{color: 'black'}}
          highlightDateNumberStyle={{color: 'red'}}
          highlightDateNameStyle={{color: 'black'}}
          disabledDateNameStyle={{color: 'grey'}}
          disabledDateNumberStyle={{color: 'grey'}}
          iconContainer={{flex: 0.1}}
          iconStyle={{width: 20, height: 20}}
          // onDateSelected={(date) => [console.log(date.toLocaleString('ko-KR', { weekday: 'long' }))]}
          selectedDate={new Date()}
          // onDateSelected={(date) => [setSelectedDate(date.toLocaleString('ko-KR', { weekday: 'long' })), setSearchDay(date.toLocaleString('ko-KR', { weekday: 'long' }))]}
          onDateSelected={(date) => {
            const selectedDate = new Date(date).toDateString();
            setSelectedDate(selectedDate.toLocaleString('ko-KR', { weekday: 'long' }));
            setSearchDay(selectedDate.toLocaleString('ko-KR', { weekday: 'long' }));
          }}          
          startingDate={new Date()}
          scrollable
        />
      </ScrollView>
      </View>
      <ScrollView>
        {Object.entries(tasksByCategory).map(([categoryName, tasks]) => (
          <View key={categoryName} style={styles.categoryContainer}>
            <Text style={styles.categoryName}>{categoryName}</Text>
            {tasks.length === 0 ? (
              <Text style={styles.noTasksText}>No tasks available. Go add one now</Text>
            ) : (
              tasks.map((task) => ( 
                <TouchableOpacity
                  key={task.categoryId}
                  style={{ ...styles.taskBlock, backgroundColor: task.categoryColor.toLowerCase() }}
                  onPress={() => [toggleTaskChecked(categoryName, task.categoryId)]}
                >
                  <CustomCheckbox checked={task.checked}/>
                  <View style={styles.taskContent}>
                  <Text
                    style={[
                      styles.categoryItems,
                      { textDecorationLine: task.checked ? 'line-through' : 'none', color: task.checked ? 'gray' : 'black' },
                    ]}
                  >
                    {task.categoryItems}
                  </Text>
                  </View>
                  <TouchableOpacity onPress={() => navigation.navigate(ROUTES.TODO_INFORMATION, { taskId: task.categoryId, categoryName: task.categoryName, createdAt: task.createdAt, categoryItems: task.categoryItems })}>
                    <AntDesign name="caretright" size={20} color="black" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  taskContent: {
    flex: 1,
    flexShrink: 1,
    overflow: 'hidden',
  },
  taskBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 8,
    marginBottom: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
    marginLeft: 10,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 7,
  },
  categoryItems: {
    fontSize: 16,
    marginLeft: 10,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'black',
  },
  noTasksText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
  },
  showCheckedButton: {
    marginTop: 20,
    padding: 10,
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'black',
    borderRadius: 5,
  },

  daysOfWeekContainer: {
    marginBottom: 10,
  },
  dayButton: {
    paddingHorizontal: 30,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#f2f2f2',
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonText: {
    fontSize: 16,
  },
});

export default HomeScreen;
