import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, BackHandler } from 'react-native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';
import { FIREBASE_AUTH } from '../../config/firebase';

export default function MemoScreen({ navigation, route }) {
    const [memo, setMemo] = useState('');
    
    const { categoryName, taskId } = route.params;

    useEffect(() => {
        const fetchMemo = async () => {
            const docRef = doc(FIREBASE_DB, 'todo-list', FIREBASE_AUTH.currentUser.uid, categoryName, taskId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                setMemo(docSnap.data().memo || '');
            }
        };
        
        fetchMemo();
        
        // Add an event listener for the hardware back button
        const backAction = () => {
            handleSave();
            return false; // This will stop the back action from being executed
        };

        BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => {
            BackHandler.removeEventListener("hardwareBackPress", backAction);
        };
    }, [categoryName, taskId]);

    const handleSave = async () => {
        const docRef = doc(FIREBASE_DB, 'todo-list', FIREBASE_AUTH.currentUser.uid, categoryName, taskId);
        await setDoc(docRef, { memo: memo }, { merge: true });
    };

    return (
        <View style={styles.container}>
            <TextInput
                value={memo}
                onChangeText={setMemo}
                placeholder="Write a memo..."
                multiline={true}
                style={styles.memoInput}
                onBlur={handleSave}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    memoInput: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        height: '100%'
    }
});
