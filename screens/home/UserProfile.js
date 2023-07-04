import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FIREBASE_AUTH } from '../../config/firebase';

const UserProfile = () => {
  const user = {
    name: 'Kim Minsook',
  };

  const handleSettingsPress = () => {
    // Implement the action when the settings button is pressed   
    console.log('Profile Settings button pressed');
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
