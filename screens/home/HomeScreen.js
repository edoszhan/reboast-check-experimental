import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';

const HomeScreen = (props) => {
  const [tasks, setTasks] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    const q = query(collection(FIREBASE_DB, 'todo-list', user.uid, 'category_learning'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = [];
      snapshot.forEach((doc) => {
        const taskData = doc.data();
        taskList.push(taskData);
      });
      setTasks(taskList);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ ...styles.heading, alignItems: 'center', marginLeft: 120 }}>Todo Tasks</Text>
      {tasks.map((task) => (
        <View key={task.id} style={{...styles.taskBlock, backgroundColor: task.categoryColor}}>
          <Text style={styles.categoryName}>{task.categoryName}</Text>
          <Text style={styles.categoryItems}>{task.categoryItems}</Text>
        </View>
      ))}
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
  },
  taskBlock: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  categoryItems: {
    fontSize: 16,
  },
});

export default HomeScreen;
