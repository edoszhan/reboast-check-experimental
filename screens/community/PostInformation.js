import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput, Image} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { useState } from 'react';
import { collection, query, getDocs, orderBy, onSnapshot, deleteDoc, doc, getDoc, updateDoc, arrayRemove, setDoc, serverTimestamp} from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';
import { ROUTES } from '../../constants';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { FIREBASE_AUTH } from '../../config/firebase';
import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons';
import uuid from 'react-native-uuid';



const PostInformation = ({ route }) => {
  const params = route.params ? route.params : 'no post';
  const navigation = useNavigation(); 
  // const nav = navigation.getParent()?.setOptions({ tabBarBUtton: () => null }); //SOLELY TO REMOVE TABS ON THIS PAGE
  const [sessions, setSessions] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState([]);
  const [replyEnabled, setReplyEnabled] = useState(false);
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);

  const [replyingTo, setReplyingTo] = useState('');

  postId = params.postId;
  const fetchUserName = async (userId) => {
    try {
      const userDoc = await getDoc(doc(FIREBASE_DB, 'users-info', userId)); 
      return userDoc.data()?.displayName; 
    } catch (error) {
      console.log('Error fetching user name: ', error);
    }
  };

  const fetchUserPhoto = async (userId) => {
    try {
      const userDoc = await getDoc(doc(FIREBASE_DB, 'users-info', userId));
      return userDoc.data()?.photoURL;
    } catch (error) {
      console.log('Error fetching user photo: ', error);
    }
  };

  const fetchComments = async () => { 
    const q = query(collection(FIREBASE_DB, 'community-comment', postId, 'comments'), orderBy('createdAt', 'desc')); //PREVIOUSLY ASC
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const commentsData = [];
      for (const doc of snapshot.docs) {
        const data = doc.data();
        data.replyAuthor = await fetchUserName(data.userId);
        data.photoURL = await fetchUserPhoto(data.userId);
        commentsData.push({ id: doc.id, ...data });
      }
      setComments(commentsData);
    });

    return unsubscribe; // Return the unsubscribe function for cleanup
  };

  const fetchSessions = async () => {
    const q = query(collection(FIREBASE_DB, 'community-chat'));
    const querySnapshot = await getDocs(q);
    const sessionData = [];
    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      if (data.postId === params.postId) {
        // Here we fetch the user photo
        data.postAuthor = await fetchUserName(data.userId);
        data.photoURL = await fetchUserPhoto(data.userId);
        sessionData.push({ id: doc.id, ...data });
      }
    }
    setSessions(sessionData);
  };
  

  useEffect(() => {
    const fetchSessionsAndSetState = async () => {
      try {
        await fetchSessions();
        await fetchComments();
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
          <MenuOption onSelect={() => navigation.navigate(ROUTES.EDIT_POST_SCREEN, {postId: session.postId, postContent: session.postContent, postTopic: session.postTopic})} text="Edit" />
          <MenuOption onSelect={() => deleteSession(session.postId, session.userId)}>
            <Text style={{ color: 'red' }}>Delete</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    );
  };
  const handleComment = (comment) => {
    const postAuthorName = `u/${comment.replyAuthor} `;
    if (FIREBASE_AUTH.currentUser.uid !== comment.userId) {
      return (
        <Menu>
          <MenuTrigger>
            <Entypo name="dots-three-vertical" size={24} color="black" />
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={() => [setReplyEnabled(true), setReplyingTo(postAuthorName)]} onPress={() => setReplyEnabled(false)} >
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
          <MenuOption onSelect={() => [setReplyEnabled(true), setReplyingTo(postAuthorName)]} onPress={() => setReplyEnabled(false)}>
              <Text style={{ color: 'blue' }}>Reply</Text>
            </MenuOption>
            <MenuOption onSelect={() => navigation.navigate(ROUTES.EDIT_POST_SCREEN, {postId: comment.postId, postContent: comment.replyContent, parentId: comment.parentId})} text="Edit" />
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
      // Delete the document from 'community-chat'
      await deleteDoc(doc(FIREBASE_DB, 'community-chat', postId));
          
      // Remove the postId from the commentsIds array in 'community-chat'
      const communityChatRef = doc(FIREBASE_DB, 'community-chat', params.postId);
      await updateDoc(communityChatRef, {
        commentsIds: arrayRemove(postId)
      });

      // Delete the document from 'community-comment'
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
    randomId = FIREBASE_AUTH.currentUser.displayName + "-" + uuid.v4();
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
        isLiked: [],
      });
      console.log('Document successfully written!');
      setReplyText('');
      await fetchSessions();
    } catch (error) {
      console.log('Error writing document: ', error);
    }

    try {
      const docRef = doc(FIREBASE_DB, 'community-chat', parentId);
      const docSnapshot = await getDoc(docRef);
  
      if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          let commentsIds = data.commentsIds || []; // Ensure it's an array, even if the field doesn't exist yet
          
          // Check if postId is not already in the array, then push it
          if (!commentsIds.includes(randomId)) {
              commentsIds.push(randomId);
          }
  
          // Update the document with the new array
          await updateDoc(docRef, { commentsIds: commentsIds });
      }
      } catch (error) {
          console.log('Error updating commentIds: ', error);
      }
  };

  const handleLike = async (postId, session) => {
    const uid = FIREBASE_AUTH.currentUser.uid;
    const sessionToUpdate = sessions.find((session) => session.id === postId);

    if (sessionToUpdate) {
      let updatedLikesCount = sessionToUpdate.likesCount;
      let updatedIsLiked = sessionToUpdate.isLiked;
      
      const likedIndex = updatedIsLiked.indexOf(uid);
      
      if (likedIndex !== -1) {
        updatedIsLiked.splice(likedIndex, 1);
        updatedLikesCount--;
      } else {
        updatedIsLiked.push(uid);
        updatedLikesCount++;
      }
  
      // Update the likesCount and isLiked in the database 
      const postRef = doc(FIREBASE_DB, 'community-chat', postId);
      updateDoc(postRef, {
        likesCount: updatedLikesCount,
        isLiked: updatedIsLiked,
      });

      fetchSessions();
    }
  }

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
                  <Text style={{ fontSize: 16 }}>  u/{session.postAuthor}</Text>
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
              <View style={{alignItems: 'center'}}>
              {session.postFile ? (
                <Image source={{ uri: session.postFile }} style={{ width: 200, height: 200 }} />
              ) : null}
              </View>

            <View style={styles.interactionBar}>
            <TouchableOpacity style={styles.interactionButton} onPress={() => handleLike(session.id, session)}>
            {session.isLiked.includes(FIREBASE_AUTH.currentUser.uid) ? (
              <AntDesign name="like1" size={20} color="black" />
            ) : (
              <AntDesign name="like2" size={20} color="black" />
            )}
            <Text style={styles.interactionText}>{session.likesCount}</Text>
          </TouchableOpacity>
          
            <TouchableOpacity style={styles.interactionButton}>
              <Ionicons name="chatbubbles-outline" size={20} color="black" />
              <Text style={styles.interactionText}>{session.commentsIds ? session.commentsIds.length : 0}</Text> 
            </TouchableOpacity>
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
          {replyText.length > 0 && isKeyboardActive && (
          <>
            {replyEnabled ? (
            <View style={{marginBottom: 8, flexDirection: 'row', alignItems: 'center',justifyContent: 'space-between'}}>
              <Text> Replying to <Text style={{ fontWeight: 'bold' }}>{replyingTo}</Text></Text>
              <TouchableOpacity
                  style={{...styles.cancelButton}}
                  onPress={() => setReplyEnabled(false)}
                >
                  <Text style={{color: 'gray', padding: 5}}>Cancel</Text>
                </TouchableOpacity>
                </View>
                ) : null}
              </>
            )}
          <TextInput
            style={styles.replyInput}
            placeholder="Add a comment"
            value={replyText}
            onChangeText={setReplyText}
            onFocus={() => setIsKeyboardActive(true)}
            onBlur={() => setIsKeyboardActive(false)}
            multiline
          />  
        {replyText.length > 0 && isKeyboardActive && (
          <>
            {replyEnabled ? (
              <>
                <TouchableOpacity
                  style={{ ...styles.replyButton, backgroundColor: 'red' }}
                  onPress={() => [handleReply(params.postId), setReplyEnabled(false)]}
                >
                  <Text style={styles.replyButtonText}>Reply</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={{ ...styles.replyButton, backgroundColor: 'blue' }}
                onPress={() => handleReply(params.postId)}
              >
                <Text style={styles.replyButtonText}>Send</Text>
              </TouchableOpacity>
            )}
          </>
        )}
        </View>
    </View>
  );
};

export default PostInformation;

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
  interactionBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10, // You can adjust this value
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15, // Space between the like and comment buttons
  },
  interactionText: {
    marginLeft: 5, // Space between the icon and its text
    fontSize: 14,
  },
});