import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';
import { FIREBASE_AUTH } from '../../config/firebase';
import uuid from 'react-native-uuid';


const AddPost = () => {
  const [postContent, setPostContent] = useState('');
  const [postTopic, setPostTopic] = useState('');
  const navigation = useNavigation();


  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', {weekday: "long"});
  const currentTime = now.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});

  const postCreatedDateTime = currentDay + " " + currentTime;  //we might change the formatting later
  const handlePostCreation = async () => {
    if (postTopic && postContent) {
      const auth = FIREBASE_AUTH;
      const uid = auth.currentUser.uid;
      const photo = auth.currentUser.photoURL;  //null right now
      const postId = uuid.v4();

      try {
        await setDoc(doc(FIREBASE_DB, 'community-chat', postId), {
          postTopic: postTopic,
          postContent: postContent,
          postAuthor: auth.currentUser.displayName,
          postCreatedDateTime: postCreatedDateTime,
          userId: uid,
          postId: postId,
          createdAt: serverTimestamp() ? serverTimestamp() : postCreatedDateTime,
          photoURL: photo,
          likesCount: 0,
        });
      } catch (error) {
        console.log("Error writing document: ", error);
      } 
      navigation.goBack(); //passing params was removed in favor of onSnapshot

    }
  };

  const isPostButtonDisabled = !(postTopic && postContent);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter post topic..."
          value={postTopic}
          onChangeText={setPostTopic}
        />
        <TextInput
          style={styles.contentTextInput}
          multiline
          placeholder="Enter post content..."
          value={postContent}
          onChangeText={setPostContent}
        />
      </View>
      <TouchableOpacity
        style={[styles.postButton, isPostButtonDisabled && styles.postButtonDisabled]}
        onPress={handlePostCreation}
        disabled={isPostButtonDisabled}
      >
        <Text style={styles.postButtonText}>Post</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  textInput: {
    fontSize: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  contentTextInput: {
    fontSize: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingBottom: 100,
  },
  postButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postButtonDisabled: {
    backgroundColor: '#ccc',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddPost;
