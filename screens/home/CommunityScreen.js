import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { collection, query, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';
import {FIREBASE_AUTH} from '../../config/firebase';

import { ScrollView } from 'react-native-gesture-handler';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { deleteDoc, doc } from 'firebase/firestore';

import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../constants';

const CommunityScreen = () => {
  const navigation = useNavigation();
  const [sessions, setSessions] = useState([]);

  const fetchSessions = async () => {
    const q = query(collection(FIREBASE_DB, 'community-chat'));
    const querySnapshot = await getDocs(q);
    const sessionData = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      sessionData.push({ id: doc.id, ...data });
    });
    setSessions(sessionData);
  };

  useEffect(() => {
    console.log('useEffect is working');
    fetchSessions();
  }, []);

  // const deleteSession = async (postId) => {
  //   try {
  //     await deleteDoc(doc(FIREBASE_DB, 'community-chat', postId));
  //     await fetchSessions();
  //   } catch (error) {
  //     console.log('Error deleting document: ', error);
  //   }
  // };

  return (
    <ScrollView style={styles.container}>
    <View style={styles.container}>
      {sessions.map((session, index) => (
        <View key={index} style={styles.sessionContainer}>
          <View style={styles.sessionBlock}>
            <Text style={styles.sessionTitle}>Topic:</Text>
            <Text style={styles.sessionText}>{session.postTopic}</Text>
          </View>
          <View style={styles.sessionBlock}>
            <Text style={styles.sessionTitle}>Post content:</Text>
            <Text style={styles.sessionText}>
              {session.postContent ? session.postContent : 'No content'}
            </Text>
          </View>
          <View style={styles.sessionBlock}>
            <Text style={styles.sessionTitle}>Author author:</Text>
            <Text style={styles.sessionText}>
              {session.postAuthor ? session.postAuthor : 'No email'}
            </Text>
          </View>
          {/* <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteSession(session.postId)} // Call deleteSession function with session ID
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity> */}

        </View>
        
      ))}
    </View>
    <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate(ROUTES.ADD_POST_SCREEN)} 
            >
              <Text style={styles.deleteButtonText}>Add post</Text>
    </TouchableOpacity>
    {/* <View style={styles.buttonContainer}>
              <Button onPress={navigation.navigate(ROUTES.ADD_POST_SCREEN)} title="Add Post" />
    </View> */}
    </ScrollView>
  );
};

export default CommunityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sessionContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: '110%',    //change the sessioncontainer width because finished time was cut off
    marginLeft: -10,  //change the marginleft because finished time was cut off
  },
  sessionBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  sessionText: {
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addButton: {
    marginTop: 10,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 16,
  },
});
