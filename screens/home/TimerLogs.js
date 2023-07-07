// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';


// const TimerLogs = ({ route }) => {

//     const params = route.params ? route.params : {};
//     const sessionData = [
//       {
//         title: 'Topic',
//         value: params.sessionTopic,
//       },
//       {
//         title: 'Memo',
//         value: params.sessionMemo ? params.sessionMemo : 'No memo',
//       },
//       {
//         title: 'Duration',
//         value: `${Math.floor(params.sessionDuration / 60)} minutes ${params.sessionDuration % 60} seconds`,
//       },
//       {
//         title: 'Finished time',
//         value: params.sessionFinishTime,
//       },
//     ];
  
//     return (
//       <View style={styles.container}>
//         <Text style={styles.title}>History of Timer Sessions</Text>
//         {sessionData.map((session, index) => (
//           <View key={index} style={styles.sessionBlock}>
//             <Text style={styles.sessionTitle}>{session.title}:</Text>
//             <Text style={styles.sessionText}>{session.value}</Text>
//           </View>
//         ))}
//       </View>
//     );
//   };

// export default TimerLogs;
//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       padding: 20,
//     },
//     title: {
//       fontSize: 24,
//       fontWeight: 'bold',
//       marginBottom: 20,
//     },
//     sessionBlock: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginBottom: 10,
//     },
//     sessionTitle: {
//       fontSize: 16,
//       fontWeight: 'bold',
//       marginRight: 10,
//     },
//     sessionText: {
//       fontSize: 16,
//     },
//   });

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { collection, query, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';
import { where } from 'firebase/firestore';
import {FIREBASE_AUTH} from '../../config/firebase';
const TimerLogs = () => {
  const [sessions, setSessions] = useState([]);
  const uid = FIREBASE_AUTH.currentUser.uid;

  useEffect(() => {
    const fetchSessions = async () => {
      const q = query(collection(FIREBASE_DB, 'timer-logs'));
      const querySnapshot = await getDocs(q);
      const sessionData = [];  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId === uid) {
          sessionData.push(data);
        }
      });
      setSessions(sessionData);
    };

    fetchSessions();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>History of Timer Sessions</Text>
      {sessions.map((session, index) => (
        <View key={index} style={styles.sessionContainer}>
          <View style={styles.sessionBlock}>
            <Text style={styles.sessionTitle}>Topic:</Text>
            <Text style={styles.sessionText}>{session.sessionTopic}</Text>
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
              {`${Math.floor(session.sessionDuration / 60)} minutes ${
                session.sessionDuration % 60
              } seconds`}
            </Text>
          </View>
          <View style={styles.sessionBlock}>
            <Text style={styles.sessionTitle}>Finished time:</Text>
            <Text style={styles.sessionText}>{session.sessionFinishTime}</Text>
          </View>
        </View>
      ))}
    </View>
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
});
