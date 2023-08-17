import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { collection, query, getDocs, doc, where } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';
import { FIREBASE_AUTH } from '../../config/firebase';
import { getDoc } from 'firebase/firestore';


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

    return (
        <View style={styles.container}>
            {renderCategoryFilter()}
            <ScrollView style={styles.todoList}>
                {todos.map((todo, index) => (
                    <View key={index} style={{ ...styles.todoContainer, backgroundColor: todo.color }}>
                        <Text style={styles.todoText}>{todo.categoryItems}</Text>
                    </View>
                ))}
            </ScrollView>
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
        marginBottom: -240,
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
});
