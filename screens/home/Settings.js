import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { FIREBASE_AUTH } from '../../config/firebase';
import { FIREBASE_DB } from '../../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';


const Settings = () => {
  const navigation = useNavigation();
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
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Change your Display Name to:</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={userName}
          onChangeText={text => setUserName(text)}
          placeholder="Enter your name"
        />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    marginTop: 30,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    width: '80%',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    width: '100%',
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
