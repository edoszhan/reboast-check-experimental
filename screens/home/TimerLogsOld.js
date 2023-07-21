import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { useState } from 'react';
import { collection, query, getDocs, orderBy, onSnapshot } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';
import { Image } from 'react-native';
import { ROUTES } from '../../constants';
import { Entypo } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { FIREBASE_AUTH } from '../../config/firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { setDoc, serverTimestamp } from 'firebase/firestore';
import { TextInput } from 'react-native';
import uuid from 'react-native-uuid';

const TimerLogsOld = ({ route }) => {
  const params = route.params ? route.params : 'no post';
  const navigation = useNavigation();
  const [sessions, setSessions] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState([]);
  const [replyEnabled, setReplyEnabled] = useState(false);
  const [ref, setRef] = useState(''); //used to pass the comment.postId to handleReply1level

  postId = params.postId;
  const fetchComments = async () => {
    const q = query(collection(FIREBASE_DB, 'community-comment', postId, 'comments'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        commentsData.push({ id: doc.id, ...data });
      });
      setComments(commentsData);
    });

    return unsubscribe; // Return the unsubscribe function for cleanup
  };

  const fetchSessions = async () => {
    const q = query(collection(FIREBASE_DB, 'community-chat'));
    const querySnapshot = await getDocs(q);
    const sessionData = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.postId === params.postId) {
        sessionData.push({ id: doc.id, ...data });
      }
    });
    setSessions(sessionData);
  };

  useEffect(() => {
    const fetchSessionsAndSetState = async () => {
      try {
        await fetchSessions();
        await fetchComments();
        await fetchReply1level(ref);
      } catch (error) {
        console.log('Error fetching sessions: ', error);
      }
    };

    fetchSessionsAndSetState();
  }, []);

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
          <MenuOption onSelect={() => navigation.navigate(ROUTES.ADD_POST_SCREEN)} text="Edit" />
          <MenuOption onSelect={() => deleteSession(session.postId, session.userId)}>
            <Text style={{ color: 'red' }}>Delete</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    );
  };
  const handleComment = (comment) => {
    if (FIREBASE_AUTH.currentUser.uid !== comment.userId) {
      return (
        <Menu>
          <MenuTrigger>
            <Entypo name="dots-three-vertical" size={24} color="black" />
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={() => [setReplyEnabled(true), setRef(comment.postId)]}>
              <Text style={{ color: 'blue' }}>Reply</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      );
    }
    if (FIREBASE_AUTH.currentUser.uid == comment.userId) {
      return (
        <Menu>
          <MenuTrigger>
            <Entypo name="dots-three-vertical" size={24} color="black" />
          </MenuTrigger>
          <MenuOptions>
          <MenuOption onSelect={() => setReplyEnabled(true)}>
              <Text style={{ color: 'blue' }}>Reply</Text>
            </MenuOption>
            <MenuOption onSelect={() => navigation.navigate(ROUTES.ADD_POST_SCREEN)} text="Edit" />
            <MenuOption onSelect={() => deleteSession(comment.id, comment.userId)}>
              <Text style={{ color: 'red' }}>Delete</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      );
    }
  };

  const deleteSession = async (postId, userId) => {
    try {
      if (FIREBASE_AUTH.currentUser.uid !== userId) {
        return;
      }
      await deleteDoc(doc(FIREBASE_DB, 'community-chat', postId));
      await deleteDoc(doc(FIREBASE_DB, 'community-comment', parentId, 'comments', postId));
      await fetchSessions();
    } catch (error) {
      console.log('Error deleting document: ', error);
    }
  };
  parentId = params.postId;
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
  const currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const commentCreatedDateTime = currentDay + ' ' + currentTime;

  const handleReply = async (postId) => {
    randomId = uuid.v4();
    try {
      await setDoc(doc(FIREBASE_DB, 'community-comment', parentId, 'comments', randomId), {
        parentId: params.postId,
        postId: randomId,
        replyAuthor: FIREBASE_AUTH.currentUser.displayName,
        replyContent: replyText,
        createdAt: serverTimestamp(),
        timeShown: commentCreatedDateTime,
        userId: FIREBASE_AUTH.currentUser.uid,
        photoURL: FIREBASE_AUTH.currentUser.photoURL,
      });
      console.log('Document successfully written!');
      setReplyText('');
      await fetchSessions();
    } catch (error) {
      console.log('Error writing document: ', error);
    }
  };

  const handleReply1level = async (param) => {
    randomId = uuid.v4();
    try {
      await setDoc(doc(FIREBASE_DB, 'community-comment', parentId, 'replies', randomId), {
        parentId: param, //comment.postId
        postId: randomId,    
        replyAuthor: FIREBASE_AUTH.currentUser.displayName,
        replyContent: replyText,
        createdAt: serverTimestamp(),
        timeShown: commentCreatedDateTime,
        userId: FIREBASE_AUTH.currentUser.uid,
        photoURL: FIREBASE_AUTH.currentUser.photoURL,
      });
      console.log('Document successfully written!');
      setReplyText('');
      await fetchSessions();
    } catch (error) {
      console.log('Error writing document: ', error);
    }
  };
  const fetchReply1level = async (postId) => {
    const q = query(collection(FIREBASE_DB, 'community-comment', postId, 'replies'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const repliesData = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.parentId === postId) {
        repliesData.push({ id: doc.id, ...data });
        }
      });
      setReplies(repliesData);
    });

    return unsubscribe; // Return the unsubscribe function for cleanup
  };

  return (
    <View style={styles.parentContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.container}>
          {sessions.map((session, index) => (
            <View key={index} style={styles.sessionContainer}>
              <View style={styles.sessionHeader}>
                <View style={styles.sessionHeaderLeft}>
                  {session.photoURL ? (
                    <Image source={{ uri: session.photoURL }} width={24} height={24} borderRadius={12} style={styles.mr7} />
                  ) : (
                    <Ionicons name="person-outline" size={20} color="gray" style={styles.profileIcon} />
                  )}
                  <Text style={{ fontSize: 16 }}>  u/{session.postAuthor ? session.postAuthor : 'No name'}</Text>
                </View>
                {handlePost(session)}
              </View>
              <View style={styles.sessionBlock}>
                <Text style={{ color: 'grey', fontSize: 11 }}>{session.postCreatedDateTime}</Text>
              </View>
              <View style={styles.sessionBlock}>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{session.postTopic}</Text>
              </View>
              <View style={styles.sessionBlock}>
                <Text style={styles.sessionText}>{session.postContent ? session.postContent : 'No content'}</Text>
              </View>
            </View>
          ))}
          <View style={styles.commentsContainer}>
            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentContainer}>
                <View style={styles.commentHeader}>
                  <View style={styles.commentHeaderLeft}>
                    {comment.photoURL ? (
                      <Image
                        source={{ uri: comment.photoURL }}
                        width={24}
                        height={24}
                        borderRadius={12}
                        style={styles.mr7}
                      />
                    ) : (
                      <Ionicons name="person-outline" size={20} color="gray" style={styles.profileIcon} />
                    )}
                    <Text style={styles.commentAuthor}> u/{comment.replyAuthor}</Text>
                  </View>
                  {handleComment(comment)}
                </View>
                <Text style={{ color: 'grey', fontSize: 10 }}>{comment.timeShown}</Text>
                <Text style={styles.commentContent}>{comment.replyContent}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
          <View style={styles.replyContainer}>
          <TextInput
            style={styles.replyInput}
            placeholder="Add a comment"
            value={replyText}
            onChangeText={setReplyText}
            multiline
          />  
          { replyEnabled ? (
          <TouchableOpacity
            style={{...styles.replyButton, backgroundColor: 'red'}}
            onPress={() => [handleReply1level(ref), setReplyEnabled(false), setRef('')]}
            disabled={!replyText}
          >
            <Text style={styles.replyButtonText}>Reply</Text>
          </TouchableOpacity>
          ) : (
            <TouchableOpacity
            style={{...styles.replyButton, backgroundColor: 'blue'}}
            onPress={() => handleReply(params.postId)}
            disabled={!replyText}
          >
            <Text style={styles.replyButtonText}>Send</Text>
          </TouchableOpacity>
          )}
        </View>
    </View>
  );
};

export default TimerLogsOld;

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: '#fff',
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
  replyContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  replyInput: {
    height: 50,
    padding: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  replyButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  replyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  commentsContainer: {
    marginTop: 10,
  },
  commentContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  commentAuthor: {
    fontWeight: 'bold',
  },
  commentContent: {
    marginTop: 5,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  commentHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
