import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const TimerLogs = ({ route }) => {
    const params = route.params ? route.params : {};
  
    const sessionData = [
      {
        title: 'Topic',
        value: params.sessionTopic,
      },
      {
        title: 'Memo',
        value: params.sessionMemo ? params.sessionMemo : 'No memo',
      },
      {
        title: 'Duration',
        value: `${Math.floor(params.sessionDuration / 60)} minutes ${params.sessionDuration % 60} seconds`,
      },
    ];
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>History of Timer Sessions</Text>
        {sessionData.map((session, index) => (
          <View key={index} style={styles.sessionBlock}>
            <Text style={styles.sessionTitle}>{session.title}:</Text>
            <Text style={styles.sessionText}>{session.value}</Text>
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
  