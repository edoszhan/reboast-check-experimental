import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDoc, doc, serverTimestamp } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';



import {
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Agenda } from 'react-native-calendars';


const HomeScreen = (props) => {
  const {navigation} = props;
  const [userName, setUserName] = useState('');
  const auth = getAuth();
  const user = auth.currentUser;
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const userId = user.uid;
          const userDocRef = doc(FIREBASE_DB, 'users-info', userId);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUserName(userData.name);   // Hello message is here -> Hello {userName}
          } else {
            console.log('User document not found');
          }
        } else {
          console.log('No user is currently logged in');
        }
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };

    fetchUserName();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text style={styles.text}>Home Screen</Text> */}
      {/* <Button color="white" onPress={() => navigation.navigate(ROUTES.USER_PROFILE)} title="User Profile"/> */}
      {/* <Text style={styles.text} >Hello {userName}</Text> */}
      <Agenda
        selected="2023-10-13"

        items={{
          '2023-10-12': [{name: 'Coding'}, {name: 'Workout'}, {name: 'Dinner'}],
          '2023-10-13': [{name: 'Coding'}, {name: 'Workout'}, {name: 'Dinner'}],
        }}
        renderItem={(item, isFirst) => (
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // backgroundColor: '#0a8faf',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    justifyContent: 'center',
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  itemText: {
    color: '#888',
    fontSize: 16,
  }
});

export default HomeScreen;
