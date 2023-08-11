import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { collection, query, getDocs, orderBy, getDoc, deleteDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';
import { FIREBASE_AUTH } from '../../config/firebase';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Entypo } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native-paper';


const TimerLogs = () => {
  const [sessions, setSessions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
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

  const openModal = (session) => {
    setSelectedSession(session);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const editSession = (sessionId) => {
    // Add your logic to edit the session
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="small" color="blue" />
        <Text style={{ marginTop: 10 }}>Loading history...</Text>
      </View>
    );
  }

  const renderMenu = () => (
    <View style={styles.menuContainer}>
    <Menu>
      <MenuTrigger>
        <Entypo name="dots-three-vertical" size={24} color="black" />
      </MenuTrigger>
      <MenuOptions customStyles={{ optionsContainer: styles.menuOptions }}>
        <MenuOption onSelect={() => console.log("Function for Edit")} text='Edit' />
        <MenuOption onSelect={() => deleteSession(selectedSession?.sessionId)} text='Delete' />
      </MenuOptions>
    </Menu>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
          <View style={styles.popup}>
            {renderMenu()} 
            <Text style={styles.modalTitle}>Topic: {selectedSession?.sessionTopic}</Text>
            <Text>Memo: {selectedSession?.sessionMemo || 'No memo'}</Text>
            <Text>
              Duration: {`${Math.floor(selectedSession?.sessionDuration / 60)} minutes ${
                selectedSession?.sessionDuration % 60
              } seconds`}
            </Text>
            <Text>Finished time: {selectedSession?.sessionFinishTime}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
          </View>
        </Modal>
        {sessions.length < 1 ? (
          <Text style={styles.noSessionsText}>No current timer sessions</Text>
        ) : (
          sessions.map((session, index) => (
            <TouchableOpacity key={index} onPress={() => openModal(session)}>
              <View style={{ ...styles.sessionContainer, backgroundColor: session.color }}>
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
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteSession(session.id)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
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
  deleteButton: {
    marginTop: 10,
    backgroundColor: 'black',
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
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    borderWidth: 5,
    backgroundColor: 'rgba(100,100,100, 0.5)',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  popup: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 8,
  },
  menuContainer: {
    alignItems: 'flex-end', // Align the menu to the right
    marginBottom: 10, // Add some margin if needed
    zIndex: 1,
  },
  menuOptions: {
    position: 'absolute', // this will take the menuOptions out of the flow
    right: 0, // align to the right
    top: 0, // align to the top
    backgroundColor: 'white', // give it a background color
    zIndex: 10, // even higher than the menuContainer
  },
});
