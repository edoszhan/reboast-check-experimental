import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';
import { ScrollView } from 'react-native-gesture-handler';

const CustomCheckbox = ({ checked }) => {
  return (
    <View style={styles.checkboxContainer}>
      {checked && <View style={styles.checkboxInner} />}
    </View>
  );
};

const HomeScreen = (props) => {
  const [tasksByCategory, setTasksByCategory] = useState({});
  const auth = getAuth();

    // const todayDayoftheWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayDayoftheWeek = new Date().toLocaleDateString('kr-KO', { weekday: 'long' });

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

  useEffect(() => {
    const today = new Date().toLocaleDateString('kr-KO', { weekday: 'long' });
    const string = today.split(" ");
    const todayDay = string[3][0];
    const user = auth.currentUser;
    const categoryNames = ['Sport', 'Learning', 'Morning Routine'];
    const unsubscribeTasks = categoryNames.map((categoryName) => {
      const categoryRef = collection(FIREBASE_DB, 'todo-list', user.uid, categoryName);
      const q = query(categoryRef, orderBy('createdAt', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const taskList = [];
        snapshot.forEach((doc) => {
          const taskData = doc.data();
          if (todayDay.includes(taskData.categoryDays)) {
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
  }, []);

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

  // const getCheckedTaskNames = () => {
  //   const checkedTaskNames = [];
  //   Object.entries(tasksByCategory).forEach(([categoryName, tasks]) => {
  //     tasks.forEach((task) => {
  //       if (task.checked) {
  //         checkedTaskNames.push(task.categoryItems);
  //       }
  //     });
  //   });
  //   return checkedTaskNames;
  // };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.heading}>Todo Tasks</Text>
        <Text style={{...styles.heading, fontSize: 15, fontWeight: "normal"}}>{todayDayoftheWeek}</Text>
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
                  onPress={() => toggleTaskChecked(categoryName, task.categoryId)}
                >
                  <CustomCheckbox checked={task.checked} />
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
});

export default HomeScreen;
