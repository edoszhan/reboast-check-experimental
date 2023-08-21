import React from 'react';
import { View, Text } from 'react-native';
import Reply from './Reply';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';
import { getDoc, doc } from 'firebase/firestore';



export default function Comment() {
    const [comments, setComments] = useState([]);


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

    useEffect(() => {
    const fetchComments = async () => {
        const q = query(collection(FIREBASE_DB, 'community-comment', postId, 'comments'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, snapshot => {
        const commentData = [];
        snapshot.docs.forEach(doc => {
            commentData.push({ id: doc.id, ...doc.data() });
        });
        setComments(commentData);
        });
        return unsubscribe;
    };
    
    fetchComments();
    }, [postId]);

    return (
        <View style={styles.commentsContainer}>
        {comments.map((comment) => (
            <View style={{borderWidth: 10, borderColor: 'white', padding: 0}}>
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
                  <Text style={styles.commentAuthor}> {comment.replyAuthor}</Text>
                </View>
              </View>
              <Text style={{ color: 'grey', fontSize: 10 }}>{comment.timeShown}</Text>
              <Text style={styles.commentContent}>{comment.replyContent}</Text>
            </View>  
            <Reply postId={postId} />
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

