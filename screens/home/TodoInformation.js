import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';
import { FIREBASE_AUTH } from '../../config/firebase';

export default function TodoInformation({ route }) {
    const params = route.params ? route.params : {};
    const taskId = params.taskId;
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        // Subscribe to Todo details
        const categoryName = params.categoryName;
        const todoRef = doc(FIREBASE_DB, 'todo-list', FIREBASE_AUTH.currentUser.uid, categoryName, taskId);

        const unsubscribe = onSnapshot(todoRef, (docSnap) => {
            if (docSnap.exists()) {
                setTodos([docSnap.data()]);
            } else {
                console.log("No such document!");
            }
        });
        // Cleanup the subscription
        return () => {
            unsubscribe();
        }
    }, [taskId]);
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Todo Information</Text>
            {todos.map((todo, index) => (
                <View key={index}>
                    <Text style={styles.heading}>{todo.categoryItems}</Text>
                    {/* <Text style={styles.heading}>Created At {todo.createdAt}</Text> */}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 10
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8
    }
});
