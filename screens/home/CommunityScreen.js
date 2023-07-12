import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { collection, query, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';
import { FIREBASE_AUTH } from '../../config/firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../constants';
import { orderBy } from 'firebase/firestore';

import Logo from '../../assets/icons/LOGO.svg';
import { Entypo } from '@expo/vector-icons'; 
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { RefreshControl } from 'react-native';

const CommunityScreen = ({route}) => {
  const params = route.params ? route.params : "false";
  const navigation = useNavigation();
  const [sessions, setSessions] = useState([]);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {   //refreshing the page
    setRefreshing(true);
    try {
      await fetchSessions();
    } catch (error) {
      console.log('Error fetching sessions: ', error);
    } finally {
      setRefreshing(false);
    }
  }, []);


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


  if (params.refresh == true) {
    fetchSessions();
    console.log("i did the thing");
    params.refresh = "false";
  }


  useEffect(() => {
    const fetchSessionsAndSetState = async () => {
      try {
        await fetchSessions();
      } catch (error) { 
        console.log('Error fetching sessions: ', error);
      }
    };
  
    fetchSessionsAndSetState();
  }, []);

  const deleteSession = async (postId, userId) => {
    try {
      if (FIREBASE_AUTH.currentUser.uid !== userId) {
        // alert('You can only delete your own post');
        return;
      }
      await deleteDoc(doc(FIREBASE_DB, 'community-chat', postId));
      await fetchSessions();
    } catch (error) {
      console.log('Error deleting document: ', error);
    }
  };

  const handlePost = (session) => {
    if (FIREBASE_AUTH.currentUser.uid !== session.userId) {
      return;
    }
    return (
      <Menu>
        <MenuTrigger>
          <Entypo name="dots-three-vertical" size={24} color="black" />
        </MenuTrigger>
        <MenuOptions>
          <MenuOption onSelect={() => navigation.navigate(ROUTES.ADD_POST_SCREEN)} text='Edit' />
          <MenuOption onSelect={() => deleteSession(session.postId, session.userId)}>
            <Text style={{ color: 'red' }}>Delete</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    );
  };

  return (
    <ScrollView style={styles.container}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate(ROUTES.ADD_POST_SCREEN)}>
        <Text style={styles.deleteButtonText}>Add post</Text>
      </TouchableOpacity> 
      <View style={styles.container}>
        {sessions.map((session, index) => (
          <View key={index} style={styles.sessionContainer}>
            <View style={styles.sessionHeader}>
              <View style={styles.sessionHeaderLeft}>
                <Logo width={24} height={24} style={styles.mr7} />
                <Text style={{ fontSize: 16 }}>u/{session.postAuthor ? session.postAuthor : 'No name'}</Text>
              </View>
              {handlePost(session)}
            </View>
            <View style={styles.sessionBlock}>
              <Text style={{ color: 'grey', fontSize: 11 }}>{session.postCreatedDateTime}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate(ROUTES.POST_INFORMATION, { postId: session.id })}>
              <View style={styles.sessionBlock}>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{session.postTopic}</Text>
              </View>
              <View style={styles.sessionBlock}>
                <Text style={styles.sessionText}>{session.postContent ? session.postContent : 'No content'}</Text>
              </View>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.deleteButton} onPress={() => deleteSession(session.postId, session.userId)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity> */}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
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
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sessionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CommunityScreen;
