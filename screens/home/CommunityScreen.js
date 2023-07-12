import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { collection, query, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';
import { FIREBASE_AUTH } from '../../config/firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../constants';
import { orderBy } from 'firebase/firestore';

// import DefaultLogo from '../../assets/icons/DEFAULT_USER_IMAGE.svg';  //not properly being displayed
import Logo from '../../assets/icons/LOGO.svg';

const CommunityScreen = () => {
  const navigation = useNavigation();
  const [sessions, setSessions] = useState([]);

  const fetchSessions = async () => {
    const q = query(collection(FIREBASE_DB, 'community-chat'), orderBy('postCreatedDateTime', 'desc'));
    const querySnapshot = await getDocs(q);
    const sessionData = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      sessionData.push({ id: doc.id, ...data });
    });
    setSessions(sessionData);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const deleteSession = async (postId, userId) => {
    try {
      if (FIREBASE_AUTH.currentUser.uid !== userId) {
        alert('You can only delete your own post');
        return;
      }
      await deleteDoc(doc(FIREBASE_DB, 'community-chat', postId));
      await fetchSessions();
    } catch (error) {
      console.log('Error deleting document: ', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate(ROUTES.ADD_POST_SCREEN)}>
        <Text style={styles.deleteButtonText}>Add post</Text>
      </TouchableOpacity> 
      <View style={styles.container}>
        {sessions.map((session, index) => (
            <View style={styles.sessionContainer}>
              <View style={styles.sessionBlock}>
                <Logo width={24} height={24} style={styles.mr7}/>
                <Text style={styles.sessionText}>u/{session.postAuthor ? session.postAuthor : 'No name'}</Text>
              </View>
              <View style={styles.sessionBlock}>
                <Text style={{color: "grey", fontSize: 11}}>{session.postCreatedDateTime}</Text>  
              </View>
              <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate(ROUTES.POST_INFORMATION, { postId: session.id })}
          >
              <View style={styles.sessionBlock}>
              <Text style={{fontWeight:'bold', fontSize: 18}}>{session.postTopic}</Text>
              </View>
              <View style={styles.sessionBlock}>
                <Text style={styles.sessionText}>{session.postContent ? session.postContent : 'No content'}</Text>
              </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteSession(session.postId, session.userId)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,  //can be used effficiently to adjust size of the posts
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
  mr7: {
    marginRight: 7,
  },
});

export default CommunityScreen;
