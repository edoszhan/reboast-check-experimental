import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';
import { getDoc, doc } from 'firebase/firestore';
import { FIREBASE_AUTH } from '../../config/firebase';
import { Entypo } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { updateDoc, deleteDoc, arrayRemove } from 'firebase/firestore';
import { Alert } from 'react-native';
import { ROUTES } from '../../constants/routes';
import { getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';


export default function Reply({postId, parentId}) {
    const navigation = useNavigation();
    const [replies, setReplies] = useState([]);
    const [replyEnabled, setReplyEnabled] = useState(false);
    const [replyToComment, setReplyToComment] = useState('');

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
        return userDoc.data()?.photoURL || null;
      } catch (error) {
        console.log('Error fetching user photo: ', error);
      }
    };
    
    const fetchReplies = async () => {
      try {
        const q = query(
          collection(FIREBASE_DB, 'community-comment', postId, 'comments', parentId, 'replies'),
          orderBy('createdAt', 'asc')
        );
    
        const snapshot = await getDocs(q);
        const replyDataPromises = snapshot.docs.map(async doc => {
          const data = doc.data();
          const displayName = await fetchUserName(data.userId);
          const photoURL = await fetchUserPhoto(data.userId);
          return { id: doc.id, ...data, displayName, photoURL };
        });
    
        const replyData = await Promise.all(replyDataPromises);
        setReplies(replyData);
      } catch (error) {
        console.log('Error fetching replies: ', error);
      }
    };
    
    useEffect(() => {
      fetchReplies();
      const q = query(
        collection(FIREBASE_DB, 'community-comment', postId, 'comments', parentId, 'replies'),
        orderBy('createdAt', 'asc')
      );
    
      const unsubscribe = onSnapshot(q, snapshot => {
        fetchReplies(); // This will update replies whenever there's a change in the data
      });
      return unsubscribe;
    }, [postId, parentId]);
    

    const handleComment = (comment) => {
      const postAuthorName = `${comment.replyAuthor} `;
      if (FIREBASE_AUTH.currentUser.uid !== comment.userId) {
        return (
          <Menu>
            <MenuTrigger>
              <Entypo name="dots-three-vertical" size={24} color="black" />
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onSelect={() => [setReplyEnabled(true), setReplyToComment(comment.postId), setReplyingTo(postAuthorName)]} onPress={() => setReplyEnabled(false)} >
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
  
    const deleteSession = async (replyId, userId) => {
      try {
          if (FIREBASE_AUTH.currentUser.uid !== userId) {
              return;
          }
          
          // Alert for Confirmation
          Alert.alert(
              'Confirm Deletion',
              'Are you sure you want to delete this reply?',
              [
                  {
                      text: 'Cancel',
                      style: 'cancel',
                  },
                  {
                      text: 'Delete',
                      onPress: async () => {
                          try {
                              // Remove the postId from the commentsIds array in 'community-chat'
                              const communityChatRef = doc(FIREBASE_DB, 'community-chat', postId);
                              await updateDoc(communityChatRef, { commentsIds: arrayRemove(replyId) });
                              
                              // Delete the document from 'community-comment'
                              await deleteDoc(doc(FIREBASE_DB, 'community-comment', postId, 'comments', parentId, 'replies', replyId));
                              
                              // Uncomment the below if you want to fetch replies after deletion
                              // await fetchReplies();
                          } catch (error) {
                              console.log('Error deleting document: ', error);
                          }
                      },
                      style: 'destructive',
                  },
              ]
          );
      } catch (error) {
          console.log('Error deleting document: ', error);
      }
  };
  

    return (
        <View style={styles.commentsContainer}>
        {replies && replies.map((reply) => (
            <View key={reply.id} style={styles.commentContainer}>
              <View style={styles.commentHeader}>
                <View style={styles.commentHeaderLeft}>
                {reply.photoURL ? (
                    <Image
                      source={{ uri: reply.photoURL }}
                      width={24}
                      height={24}
                      borderRadius={12}
                      style={styles.mr7}
                    />
                  ) : (
                    <Ionicons name="person-outline" size={20} color="gray" style={styles.profileIcon} />
                  )}
                  <Text style={styles.commentAuthor}> {reply.replyAuthor}</Text>
                </View>
                {handleComment(reply)}
              </View>
              <Text style={{ color: 'grey', fontSize: 10 }}>{reply.timeShown}</Text>
              <Text style={styles.commentContent}>{reply.replyContent}</Text>
            </View>    
          ))}
           </View>
    )
}

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
      height: 40,
      padding: 5,
      marginBottom: 4,
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
    commentContainer: {
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 5,
      marginLeft: 10,
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

