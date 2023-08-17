import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { collection, query, getDocs, doc, where } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';
import { FIREBASE_AUTH } from '../../config/firebase';
import { getDoc } from 'firebase/firestore';
import { deleteDoc } from 'firebase/firestore';
import { Alert } from 'react-native';
import { orderBy } from 'firebase/firestore';


export default function TodoList() {
    const [todos, setTodos] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const uid = FIREBASE_AUTH.currentUser.uid;

    const categories = [
        'All',
        'Morning Routine',
        'Sport',
        'Learning'
    ];

    const getCategoryDisplayName = (category) => {
        switch (category) {
            case 'Morning Routine':
                return '☀️ Morning Routine';
            case 'Sport':
                return '🏃 Sport';
            case 'Learning':
                return '📚 Learning';
            default:
                return category; // 'All' or any other category that doesn't have a specific emoji
        }
    };

    const fetchTodos = async () => {
        let q;
        if (selectedCategory !== 'All') {
        q = query(collection(FIREBASE_DB, 'todo-list', uid, 'All'), where("categoryName", "==", selectedCategory));
        } else {
        q = query(collection(FIREBASE_DB, 'todo-list', uid, 'All'));
        }
    
        const querySnapshot = await getDocs(q);
        const todosData = [];

        for (const docSnap of querySnapshot.docs) {
            const data = docSnap.data();
            const categoryName = data.categoryName;
            const categoryDocRef = doc(FIREBASE_DB, 'constants', categoryName);

            try {
                const categoryDocSnapshot = await getDoc(categoryDocRef);
                const color = categoryDocSnapshot.exists() ? categoryDocSnapshot.data().color : 'defaultColor';
                todosData.push({ ...data, color });
            } catch (error) {
                console.log('Error fetching category document:', error);
            }
        }

        setTodos(todosData);
    };

    useEffect(() => {
        fetchTodos();
    }, [selectedCategory]);

    const renderCategoryFilter = () => (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryFilter}
            contentContainerStyle={styles.categoryFilterContent}
        >
            {categories.map(category => (
                <TouchableOpacity
                    key={category}
                    style={[styles.categoryButton, selectedCategory === category && styles.selectedCategory]}
                    onPress={() => setSelectedCategory(category)}
                >
                    <Text style={styles.categoryButtonText}>{getCategoryDisplayName(category)}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    const handleDeleteTodo = async (categoryId, category) => {
        // Confirmation alert
        Alert.alert(
            "Delete Todo",
            "Are you sure you want to delete this todo and its instances?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Yes", onPress: async () => {
                        // Delete the todo
                        await deleteDoc(doc(FIREBASE_DB, 'todo-list', uid, 'All', categoryId));
                        // Delete its instances
                        const q = query(collection(FIREBASE_DB, 'todo-list', uid, category), where("parentId", "==", categoryId));
                        const querySnapshot = await getDocs(q);
                        for (const docSnap of querySnapshot.docs) {
                            await deleteDoc(doc(FIREBASE_DB, 'todo-list', uid, category, docSnap.id));
                        }
                        // Refresh the todos list
                        fetchTodos();
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            {renderCategoryFilter()}
            <ScrollView style={styles.todoList}>
            {
                todos.length === 0
                ? <Text style={styles.noTodosText}>There are no todos created.</Text>
                : todos.map((todo, index) => (
                    <View key={index} style={{ ...styles.todoContainer, backgroundColor: todo.color }}>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTodo(todo.categoryId, todo.categoryName)}>
                            <Text style={styles.deleteButtonText}>X</Text>
                        </TouchableOpacity>
                        <Text style={styles.todoText}>{todo.categoryItems} ({todo.categoryDays})</Text>
                    </View>
                ))
            }
            </ScrollView>  
            <View style={styles.informationContainer}>
                <Text style={styles.informationText}>
                    You can freely delete todo items from the list.
                    Please note that it will delete all todo item instances.
                </Text>
            </View> 
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    categoryFilter: {
        flexDirection: 'row',
        marginTop: -240,
        marginBottom: -200,
    },
    categoryFilterContent: {
        alignItems: 'center',
    },
    categoryButton: {
        marginRight: 15,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'black',
    },
    selectedCategory: {
        backgroundColor: '#8fd400',
    },
    categoryButtonText: {
        fontSize: 14,
    },
    todoList: {
        flex: 1,
    },
    todoContainer: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
    },
    todoText: {
        fontSize: 16,
    },
    deleteButton: {
        position: 'absolute',
        right: 8,
        top: '40%',
        padding: 5,
        backgroundColor: 'red',
        borderRadius: 4,
        zIndex: 1,
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 12
    },
    noTodosText: {
        fontSize: 18,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'italic',
    },
    informationContainer: {
        backgroundColor: '#f9f9f9',  
        padding: 15,                
        borderRadius: 10,           
        marginBottom: 20,           
        shadowColor: "#000",       
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2.2,
        elevation: 3,
    },
    
    informationText: {
        fontSize: 16,      
        fontWeight: '600', 
        marginBottom: 10,   
        color: '#333'      
    },
});
