import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { collection, query, getDocs, orderBy, getDoc, deleteDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';
import { FIREBASE_AUTH } from '../../config/firebase';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Entypo } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native-paper';


const TimerLogs = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const uid = FIREBASE_AUTH.currentUser.uid;

  const fetchSessions = async () => {
    const q = query(
      collection(FIREBASE_DB, 'timer-logs', uid, 'sessions'),
      orderBy('sessionFinishTime', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const sessionData = [];
  
    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data();
      if (data.userId === uid) {
        const categoryName = data.categoryName;
        const categoryDocRef = doc(FIREBASE_DB, 'constants', categoryName);

      try {
        const categoryDocSnapshot = await getDoc(categoryDocRef); 
        const color = categoryDocSnapshot.exists() ? categoryDocSnapshot.data().color : 'defaultColor';
        sessionData.push({ id: docSnap.id, ...data, color });
      } catch (error) {
        console.log('Error fetching category document:', error);
      }
    }
   };
   setSessions(sessionData);
   setIsLoading(false);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const deleteSession = async (sessionId) => {
    try {
      await deleteDoc(doc(FIREBASE_DB, 'timer-logs', uid, 'sessions', sessionId));
      await fetchSessions();
    } catch (error) {
      console.log('Error deleting document: ', error);
    }
  };


  const editSession = (sessionId) => {
    console.log('Function for Edit');
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="small" color="blue" />
        <Text style={{ marginTop: 10 }}>Loading history...</Text>
      </View>
    );
  }

  const renderMenu = (session) => (
    <Menu>
      <MenuTrigger>
        <Entypo name="dots-three-vertical" size={24} color="black" />
      </MenuTrigger>
      <MenuOptions customStyles={{ optionsContainer: styles.menuOptions }}>
        <MenuOption onSelect={() => editSession(session.sessionId)} text='Edit' />
        <MenuOption onSelect={() => deleteSession(session.sessionId)} text='Delete' />
      </MenuOptions>
    </Menu>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        {sessions.length < 1 ? (
          <Text style={styles.noSessionsText}>No current timer sessions</Text>
        ) : (
          sessions.map((session, index) => (
            <View key={index} style={{ ...styles.sessionContainer, backgroundColor: session.color }}>
              <View style={styles.topSection}>
                <View style={styles.topicContainer}>
                  <Text style={styles.sessionTitle}>Topic:</Text>
                  <Text style={styles.sessionText}>{session.sessionTopic}</Text>
                </View>
                {renderMenu(session)}
              </View>
              <View style={styles.sessionBlock}>
                <Text style={styles.sessionTitle}>Memo:</Text>
                <Text style={styles.sessionText}>
                  {session.sessionMemo ? session.sessionMemo : 'No memo'}
                </Text>
              </View>
              <View style={styles.sessionBlock}>
                <Text style={styles.sessionTitle}>Duration:</Text>
                <Text style={styles.sessionText}>
                  {`${Math.floor(session.sessionDuration / 60)} minutes ${session.sessionDuration % 60} seconds`}
                </Text>
              </View>
              <View style={styles.sessionBlock}>
                <Text style={styles.sessionTitle}>Finished time:</Text>
                <Text style={styles.sessionText}>{session.sessionFinishTime}</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default TimerLogs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sessionContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: '110%',
    marginLeft: -10,
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
  noSessionsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 200,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // aligns items vertically in center
  },
  topicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuOptions: {
    position: 'absolute', 
    right: 0,
    top: 0, 
    backgroundColor: 'white', 
  },
});