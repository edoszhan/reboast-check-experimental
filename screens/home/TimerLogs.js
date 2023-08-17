import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { collection, query, getDocs, orderBy, getDoc, deleteDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';
import { FIREBASE_AUTH } from '../../config/firebase';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Entypo } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native-paper';

const TimerLogs = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const uid = FIREBASE_AUTH.currentUser.uid;

  const getCategoryDisplayName = (category) => {
    switch (category) {
      case 'Morning Routine':
        return '☀️ Morning Routine';
      case 'Sport':
        return '🏃 Sport';
      case 'Learning':
        return '📚 Learning';
      default:
        return category; // 'All' or any other category that doesn't have a specific emoji
    }
  };
  

  // Category state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = [
    'All',
    'Morning Routine',
    'Sport',
    'Learning'
  ];

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
    
    // If there is a selected category other than "All", filter the sessions by category
    if (selectedCategory !== 'All') {
      const filteredSessions = sessionData.filter(session => session.categoryName === selectedCategory);
      setSessions(filteredSessions);
    } else {
      setSessions(sessionData);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSessions();
  }, [selectedCategory]);

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

  const renderCategoryFilter = () => (
  <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.categoryFilter}
      contentContainerStyle={styles.categoryFilterContent}
    >
      {categories.map(category => (
        <TouchableOpacity
          key={category}
          style={[styles.categoryButton, selectedCategory === category && styles.selectedCategory]}
          onPress={() => setSelectedCategory(category)}
        >
          <Text style={styles.categoryButtonText}>{getCategoryDisplayName(category)}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

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
        {/* <MenuOption onSelect={() => editSession(session.sessionId)} text='Edit' /> */}
        <MenuOption onSelect={() => deleteSession(session.sessionId)} text='Delete' />
      </MenuOptions>
    </Menu>
  );

  return (
    <View style={styles.container}>
      {renderCategoryFilter()}
      <ScrollView style={styles.sessionList}>
        {sessions.length < 1 ? (
          <Text style={styles.noSessionsText}>No current timer sessions</Text>
        ) : (
          sessions.map((session, index) => (
            <View key={index} style={{ ...styles.sessionContainer, backgroundColor: session.color }}>
              <View style={styles.topSection}>
                <View style={styles.topicContainer}>
                  <Text style={styles.sessionTitle}> {session.todoName ? session.todoName : null} </Text>
                </View>
                {renderMenu(session)}
              </View>
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
                  {`${Math.floor(session.sessionDuration / 60)} minutes ${session.sessionDuration % 60} seconds`}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  categoryFilter: {
    flexDirection: 'row',
    marginBottom: -240,
    marginTop: -240,
  },
  categoryFilterContent: {
    alignItems: 'center',
  },
  categoryButton: {
    marginRight: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,  // Rounded corners
    borderWidth: 1,    // Black border
    borderColor: 'black',
  },
  selectedCategory: {
    backgroundColor: '#8fd400',
  },
  categoryButtonText: {
    fontSize: 14,
  },
  sessionList: {
    flex: 1,
  },
  sessionContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: '105%',
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
    marginRight: 7,
    marginLeft: 10,
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
    marginBottom: 10,
  },
  menuOptions: {
    position: 'absolute', 
    right: 0,
    top: 10, 
    backgroundColor: 'white', 
  },
  topicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '90%',  // set a maximum width
  },
});

export default TimerLogs;