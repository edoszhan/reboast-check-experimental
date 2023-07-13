import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FIREBASE_AUTH } from '../../config/firebase';
import { FIREBASE_DB } from '../../config/firebase';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../constants';

const UserProfile = ({route}) => {
  const params = route.params ? route.params : "false"; //refreshing the page

  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;
  const uid = auth.currentUser.uid;

  const [info, setInfo] = useState([]);


  const fetchSessions = async () => {
    const q = query(collection(FIREBASE_DB, 'users-info'));
    const querySnapshot = await getDocs(q);
    const sessionData = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.userId === uid) {
        sessionData.push(data);
      }
    });
    setInfo(sessionData);
  };

  if (params.refresh == "true") {
    fetchSessions();
    console.log("i did the thing but in another page");
    params.refresh = "false";
  }

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleLogOut = () => {
    auth.signOut();
  };

  const handleSettingsPress = () => {
    navigation.navigate(ROUTES.USER_PROFILE_SETTINGS);
  };
  const user = {
    name: info.length > 0 ? info[0].displayName : 'Not found',
    photoURL: info.length > 0 ? info[0].photoURL : null,

  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileInfo}>
        {user.photoURL ? (
          <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
        ) : (
          <Ionicons name="person-outline" size={100} color="gray" style={styles.profileIcon} />
        )}
        <Text style={styles.profileName}>{user.name}</Text>
      </View>
      <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}>
        <Text style={styles.settingsButtonText}>Upload Image</Text>
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
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
