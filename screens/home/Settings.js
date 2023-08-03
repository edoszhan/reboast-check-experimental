import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { FIREBASE_AUTH } from '../../config/firebase';
import { FIREBASE_DB } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onSnapshot} from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

const Settings = () => {
  const user = FIREBASE_AUTH.currentUser;
  const [userName, setUserName] = useState('');

  // Fetch current user's name from Firestore
  useEffect(() => {
    if (user) {
      const userRef = doc(FIREBASE_DB, 'users-info', user.uid);
      const unsubscribe = onSnapshot(userRef, documentSnapshot => {
        if (documentSnapshot.exists()) {
          setUserName(documentSnapshot.data().name);
        }
      });
  
      // Return the unsubscribe function to clean up the listener when the component is unmounted
      return () => unsubscribe();
    }
  }, [user]);
  

  const handleSave = () => {
    if (user && userName.trim() !== '') {
      const userRef = doc(FIREBASE_DB, 'users-info', user.uid);
      
      // Update the name in Firestore
      updateDoc(userRef, { displayName: userName })
        .then(() => {
          // Update the name in the user's authentication profile
          const user = FIREBASE_AUTH.currentUser;
          updateProfile(user, {
            displayName: userName,
          });
        })
        .then(() => {
          Alert.alert('Success', 'Name updated successfully');
        })
        .catch(error => {
          Alert.alert('Error', error.message);
        });
    } else {
      Alert.alert('Warning', 'Please enter a valid name');
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <Text>Profile Settings</Text>
      <TextInput
        style={styles.input}
        value={userName}
        onChangeText={text => setUserName(text)}
        placeholder="Enter your name"
      />
      <Button title="Save" onPress={handleSave} />
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '80%',
    padding: 10,
    marginBottom: 15,
  }
});
