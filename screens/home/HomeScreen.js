import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy, where, doc} from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../constants';
import { AntDesign } from '@expo/vector-icons';
import CalendarStrip  from 'react-native-calendar-strip';
import { updateDoc } from 'firebase/firestore';


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
  }, [tasksByCategory]);

  function formatDateToYYYYMMDD(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    
    // JavaScript's getMonth() returns 0-11. Add 1 to get 1-12 and pad with 0 if needed
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Pad day with 0 if needed
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}.${month}.${day}`;

  }

  useEffect(() => {
    const today = searchDay;
    const dayPrefix = today.slice(0, 3);
    const todayDay = koreanDaysOfWeekTable[dayPrefix];
    const user = auth.currentUser;
    const categoryNames = ['Sport', 'Learning', 'Morning Routine']; //can be appended later if the "add category" feature is added

    const chosen = formatDateToYYYYMMDD(selectDate);

    const unsubscribeTasks = categoryNames.map((categoryName) => {
      const categoryRef = collection(FIREBASE_DB, 'todo-list', user.uid, categoryName);
      const q = query(categoryRef, where("date", "==", chosen));
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
      unsubscribeTasks.forEach((unsubscribe) => {
        unsubscribe();
      });
    };
  }, [searchDay]);
  
  const toggleTaskChecked = async (categoryName, taskId) => {
    const taskRef = doc(FIREBASE_DB, 'todo-list', auth.currentUser.uid, categoryName, taskId);
    
    const taskToUpdate = tasksByCategory[categoryName].find(task => task.categoryId === taskId);
    if (!taskToUpdate) return;
  
    const newCheckedState = !taskToUpdate.isChecked;
    
    try {
      await updateDoc(taskRef, {
        isChecked: newCheckedState
      });
  
      setTasksByCategory((prevTasksByCategory) => {
        const updatedTasks = prevTasksByCategory[categoryName].map((task) => {
          if (task.categoryId === taskId) {
            return { ...task, isChecked: newCheckedState };
          }
          return task;
        });
        return {
          ...prevTasksByCategory,
          [categoryName]: updatedTasks,
        };
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  function resetDate() {
  const today = new Date().toDateString();
    setSelectedDate(today.toLocaleString('ko-KR', { weekday: 'long' }));
    setSearchDay(today.toLocaleString('ko-KR', { weekday: 'long' }));
  }
  
    return (
    <SafeAreaView style={styles.container}>
      <Text style={{...styles.heading, marginBottom: 20}}>Todo Tasks</Text>
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
          selectedDate={new Date(selectDate)} 
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
      <TouchableOpacity style={styles.resetButton} onPress={resetDate}>
        <Text style={styles.resetButtonText}>Show Todo for Today</Text>
      </TouchableOpacity>
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
                  <CustomCheckbox checked={task.isChecked}/>
                  <View style={styles.taskContent}>
                  <Text
                    style={[
                      styles.categoryItems,
                      { textDecorationLine: task.isChecked ? 'line-through' : 'none', color: task.isChecked ? 'gray' : 'black' },
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
  resetButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8,
  },
  resetButtonText: {
    fontSize: 16,
    color: 'black', // You can change this to whatever color you prefer
  },
});

export default HomeScreen;
