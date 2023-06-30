// import React from 'react';
// import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

// const HomeScreen = () => {
//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//       }}>
//       <Text>Home Screen</Text>
//     </SafeAreaView>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({});

import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';

const HomeScreen = () => {
  const [userName, setUserName] = useState('');

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
            setUserName(userData.name);
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
      <Text style={styles.text}>Home Screen</Text>
      <Text style={styles.text}>Hello {userName}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default HomeScreen;
