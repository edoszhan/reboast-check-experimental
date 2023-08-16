import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { ROUTES } from '../../constants';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../config/firebase';
import { doc, deleteDoc, setDoc } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';

export default function TodoInformation({ route, navigation }) {
    const params = route.params ? route.params : {};
    const [currentMemo, setCurrentMemo] = useState(params.memo || "");
    const [categoryItem, setCategoryItem] = useState(params.categoryItems || "");
    const [isEditing, setIsEditing] = useState(false);  
    const [editedCategory, setEditedCategory] = useState(params.categoryItems || "");  
    
    useEffect(() => {
        const docRef = doc(FIREBASE_DB, 'todo-list', FIREBASE_AUTH.currentUser.uid, params.categoryName, params.taskId);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.memo) setCurrentMemo(data.memo);
                if (data.categoryItems) setCategoryItem(data.categoryItems);  
            }
        });
        return () => {
            unsubscribe();
        };
    }, [params.categoryName, params.taskId]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        const docRef = doc(FIREBASE_DB, 'todo-list', FIREBASE_AUTH.currentUser.uid, params.categoryName, params.taskId);
        await setDoc(docRef, { categoryItems: editedCategory }, { merge: true });
        setIsEditing(false); 
    };

    const handleMemoNavigation = () => {
        navigation.navigate(ROUTES.MEMO_SCREEN, {taskId: params.taskId, categoryName: params.categoryName, memo: currentMemo});
    };

    const handleDelete = async () => {
        const docRef = doc(FIREBASE_DB, 'todo-list', FIREBASE_AUTH.currentUser.uid, params.categoryName, params.taskId);
        try {
            await deleteDoc(docRef);
            console.log("Document successfully deleted!");
            navigation.goBack();
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={{...styles.categoryContainer, height: 80}}>
                {
                    isEditing ?
                    (
                        <TextInput 
                            value={editedCategory} 
                            onChangeText={setEditedCategory} 
                            style={styles.categoryTextInput}
                        />
                    ) :
                    <Text style={styles.categoryText}>{categoryItem}</Text>
                }
                <TouchableOpacity onPress={isEditing ? handleSave : handleEdit}>
                    {
                        isEditing ? 
                        <Entypo name="check" size={24} color="green" /> :
                        <Entypo name="edit" size={24} color="black" />
                    }
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.memoButton} onPress={handleMemoNavigation}>
                <Text style={styles.memoButtonText}>{currentMemo ? currentMemo : "Write a memo"}</Text> 
            </TouchableOpacity>
            <View style={styles.dateContainer}>
                <Text style={styles.dateText}>
                    Created At {params.createdAt.toDate().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </Text>
                <TouchableOpacity onPress={handleDelete}>
                    <Entypo name="trash" size={24} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        backgroundColor: 'white',
        padding: 10
    },
    categoryText: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    categoryTextInput: {
        flex: 1,
        fontSize: 22,
        borderBottomWidth: 1,
        borderColor: '#ddd'
    },
    memoButton: {
        flex: 4,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        marginVertical: 10,
        paddingLeft: 10
    },
    memoButtonText: {
        fontSize: 18,
        paddingLeft: 5,
        paddingTop: 5,
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ddd',
        padding: 5
    },
    dateText: {
        fontSize: 16,
        color: '#888'
    }
});
