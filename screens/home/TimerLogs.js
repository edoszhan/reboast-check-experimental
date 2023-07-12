import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';
import { FIREBASE_AUTH } from '../../config/firebase';

import { ScrollView } from 'react-native-gesture-handler';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { deleteDoc, doc } from 'firebase/firestore';

const TimerLogs = () => {
  const [sessions, setSessions] = useState([]);
  const uid = FIREBASE_AUTH.currentUser.uid;

  const fetchSessions = async () => {
    const q = query(
      collection(FIREBASE_DB, 'timer-logs', uid, 'sessions'),
      orderBy('sessionFinishTime', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const sessionData = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.userId === uid) {
        sessionData.push({ id: doc.id, ...data });
      }
    });
    setSessions(sessionData);
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>History of Timer Sessions</Text>
        {sessions.length < 1 ? ( // Check if sessions array is empty
          <Text style={styles.noSessionsText}>No current timer sessions</Text>
        ) : (
          sessions.map((session, index) => (
            <View key={index} style={styles.sessionContainer}>
              <View style={styles.sessionBlock}>
                <Text style={styles.sessionTitle}>Topic:</Text>
                <Text style={styles.sessionText}>{session.sessionTopic}</Text>
              </View>
          {/* <View style={styles.sessionBlock}> //memo only shown when you click on the session
            <Text style={styles.sessionTitle}>Memo:</Text>
            <Text style={styles.sessionText}>
              {session.sessionMemo ? session.sessionMemo : 'No memo'}
            </Text>
          </View> */}
              <View style={styles.sessionBlock}>
                <Text style={styles.sessionTitle}>Duration:</Text>
                <Text style={styles.sessionText}>
                  {`${Math.floor(session.sessionDuration / 60)} minutes ${
                    session.sessionDuration % 60
                  } seconds`}
                </Text>
              </View>
              <View style={styles.sessionBlock}>
                <Text style={styles.sessionTitle}>Finished time:</Text>
                <Text style={styles.sessionText}>{session.sessionFinishTime}</Text>
              </View>
          {/* <View style={styles.sessionBlock}>
            <Text style={styles.sessionTitle}>Session Id:</Text>
            <Text style={styles.sessionText}>{session.sessionId}</Text>
          </View> */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteSession(session.sessionId)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
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
  noSessionsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 200,
  },
});
