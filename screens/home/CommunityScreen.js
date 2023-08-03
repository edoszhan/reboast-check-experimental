import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { collection, query, onSnapshot, orderBy, deleteDoc, doc, where, setDoc, updateDoc} from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';
import { FIREBASE_AUTH } from '../../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../constants';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase';


const CommunityScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [likeClicked, setLikeClicked] = useState(false);

  const [imageUrl, setImageUrl] = useState(null); // State to store the image URL

  useEffect(() => {
    const fetchSessions = async () => { 
      const q = query(collection(FIREBASE_DB, 'community-chat'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const sessionData = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          sessionData.push({ id: doc.id, ...data });
        });
        setSessions(sessionData);
        setIsLoading(false); 
      });

      return unsubscribe;
    };

    const loadData = async () => {
      try {
        await fetchSessions();
      } catch (error) {
        console.log('Error fetching sessions: ', error);
      }
    };

    setTimeout(loadData, 1000);
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchSessions();
    } catch (error) {
      console.log('Error fetching sessions: ', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const navigation = useNavigation();

  const deleteSession = async (postId, userId) => {
    try {
      if (FIREBASE_AUTH.currentUser.uid !== userId) {
        return;
      }
      Alert.alert(
        'Confirm Deletion',
        'Are you sure you want to delete this session?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              try {
                await deleteDoc(doc(FIREBASE_DB, 'community-chat', postId));
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

  const handlePost = (session) => {
    if (FIREBASE_AUTH.currentUser.uid !== session.userId) {
      return (
        <Menu>
          <MenuTrigger>
            <Entypo name="dots-three-vertical" size={24} color="black" />
          </MenuTrigger> 
          <MenuOptions>
            <MenuOption onSelect={() => navigation.navigate(ROUTES.POST_INFORMATION, { postId: session.id })}>
              <Text style={{ color: 'blue' }}>More details</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      );
    }
    if (FIREBASE_AUTH.currentUser.uid == session.userId) {
      return (
        <Menu>
          <MenuTrigger>
            <Entypo name="dots-three-vertical" size={24} color="black" />
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={() => navigation.navigate(ROUTES.EDIT_POST_SCREEN, {postId: session.postId, postContent: session.postContent, postTopic: session.postTopic})} text="Edit" />
            <MenuOption onSelect={() => deleteSession(session.id, session.userId)}>
              <Text style={{ color: 'red' }}>Delete</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      );
    }
  };
  
  useEffect(() => {
    // Function to fetch the image URL from Firebase Storage
    const fetchImage = async () => {
      try {
        const uidString = FIREBASE_AUTH.currentUser.uid;
        // console.log('/ProfilePictures/' + uidString + ".png");
        const imageRef = ref(storage, '/ProfilePictures/' + uidString + ".png"); //firebase storage can be potentially used to store userPFP, and post images where names of those components is uid and postID respectively
        const url = await getDownloadURL(imageRef);
        setImageUrl(url);
      } catch (error) {
        console.log('Error fetching image URL: ', error);
      }
    };

    fetchImage();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="small" color="blue" />
        <Text style={{ marginTop: 10 }}>Loading posts...</Text>
      </View>
    );
  }


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
    }
  }


  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate(ROUTES.ADD_POST_SCREEN)}>
        <Text style={styles.deleteButtonText}>Add post</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        {sessions.map((session, index) => (
          <View key={index} style={styles.sessionContainer}>
            <View style={styles.likeContainer}>
            <TouchableOpacity onPress={() => handleLike(session.id, session)}>
            {session.isLiked.includes(FIREBASE_AUTH.currentUser.uid) ? (
              <AntDesign name="like1" size={24} color="black" />
            ) : (
              <AntDesign name="like2" size={24} color="black" />
            )}
          </TouchableOpacity>
              <Text style={styles.likeText}>{session.likesCount}</Text>
            </View>
            <View style={styles.postContent}>
            <View style={styles.sessionHeader}>
              <View style={styles.sessionHeaderLeft}>
                {session.photoURL ? (
                  <Image
                    // source={{ uri: session.photoURL }}
                    source={{ uri: `${session.photoURL}?timestamp=${Date.now()}` }}
                    width={24}
                    height={24}
                    borderRadius={12}
                    style={styles.mr7}
                    // key={session.photoURL} // Prevents caching
                  />
                ) : (
                  <Ionicons name="person-outline" size={20} color="gray" style={styles.profileIcon} />
                )}
                {/* {session.photoURL && FIREBASE_AUTH.currentUser.uid == session.userId ? (
                  <Image
                    source={{ uri: imageUrl }}
                    width={24}
                    height={24}
                    borderRadius={12}
                    style={styles.mr7}
                  />
                ) : (
                  <Ionicons name="person-outline" size={20} color="gray" style={styles.profileIcon} />
                )} */}
                <Text style={{ fontSize: 16 }}> u/{session.postAuthor ? session.postAuthor : 'No name'}</Text>
              </View>
              {handlePost(session)}
            </View>
            <View style={styles.sessionBlock}>
              <Text style={{ color: 'grey', fontSize: 11 }}>{session.postCreatedDateTime}</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.POST_INFORMATION, { postId: session.id })}
            >
              <View style={styles.sessionBlock}>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{session.postTopic}</Text>
              </View>
              <View style={styles.sessionBlock}>
                <Text style={styles.sessionText}>{session.postContent ? session.postContent : 'No content'}</Text>
              </View>
              <View>
                {session.postFile ? (
                  <Image source={{ uri: session.postFile }} style={{ width: 200, height: 200 }} />
                ) : null}
              </View>
            </TouchableOpacity>
            </View>
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
    flexDirection: 'row',
    alignItems: 'center'
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
  likeContainer: {
    width: 40, // Width for the like container
    justifyContent: 'center', // To horizontally center the content
    alignItems: 'center', // To vertically center the content
    marginRight: 10, // Add some spacing between like container and post content
  },
  likeText: {
    fontSize: 10, // Size for the like text
  },
  postContent: {
    flex: 1, // Let the post content take the remaining width
  },
});

export default CommunityScreen;