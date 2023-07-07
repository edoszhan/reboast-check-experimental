import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FIREBASE_AUTH } from '../../config/firebase';
import { FIREBASE_DB } from '../../config/firebase';
import { useState, useEffect } from 'react';


const UserProfile = () => {
  const auth = FIREBASE_AUTH;
  console.log("some data", auth.currentUser.email);
  const email = auth.currentUser.email;
  // const [userName, setUserName] = useState('');
  
  // useEffect(() => {
  //   const fetchUserName = async () => {
  //     try {
  //       const nameRef = FIREBASE_DB.collection('users-info');
  //       const snapshot = await nameRef.get();
  //       console.log('snapshot', snapshot);
  //       if (snapshot.exists) {
  //         const { name } = snapshot.data();
  //         setUserName(name);
  //       }
  //     } catch (error) {
  //       console.log('Error fetching user name:', error);
  //     }
  //   };

  //     fetchUserName();
  //   }, []);
  // const nameRef = FIREBASE_DB.collection('users-info');
  // useEffect(async () => {
  //   nameRef
  //   .onSnapshot((querySnapshot) => {
  //     const name = [];
  //     querySnapshot.forEach((doc) => {  
  //       name.push(doc.data());
  //     });
  //     console.log('name', name);
  //     setUserName(name);
  //   });
  // }, []
  // );

  const handleLogOut = () => {
    auth.signOut();
  };

  const handleSettingsPress = () => {
    // Implement the action when the settings button is pressed   
    console.log('Profile Settings button pressed');
  };

  const user = {
    name: email,
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileInfo}>
        <Ionicons name="person-outline" size={100} color="gray" style={styles.profileIcon} />
        <Text style={styles.profileName}>{user.name}</Text>
      </View>
      <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}>
        <Text style={styles.settingsButtonText}>Profile Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingsButton} onPress={handleLogOut}>
        <Text style={styles.settingsButtonText}>Log out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileIcon: {
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingsButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  settingsButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default UserProfile;
