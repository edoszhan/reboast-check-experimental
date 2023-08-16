import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';
import { ROUTES } from '../../constants';

const EditPost = ({route}) => {
  const params = route.params ? route.params : {};
  const [postContent, setPostContent] = useState('');
  const [postTopic, setPostTopic] = useState('');
  const [isPost, setIsPost] = useState(false);
  const navigation = useNavigation();

  const handleTopicChange = (text) => {
    setPostTopic(text);
    setIsPost(true);
  };

  const handlePostEdit = async () => {
    if (postContent) {
      try {
        const postId = params.postId;
        if (isPost) {
          const postRef = doc(FIREBASE_DB, 'community-chat', postId);
          await updateDoc(postRef, {
            postTopic: postTopic ? postTopic : null,
            postContent: postContent,
            postModifiedDateTime: serverTimestamp(),
          });
          setIsPost(false);
        } else if (!isPost) {
          const postRef = doc(FIREBASE_DB, 'community-comment', params.parentId, 'comments', postId);
          await updateDoc(postRef, {
            replyContent: postContent,
            postModifiedDateTime: serverTimestamp(),
          });
        }
        navigation.navigate(ROUTES.COMMUNITY_MAIN);
      } catch (error) {
        console.log("Error writing document: ", error);
      }
    }
  };

  const isPostButtonDisabled = !(postContent);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        {params.postTopic ?
          <TextInput
            style={styles.textInput}
            placeholder={params.postTopic ? params.postTopic : "Enter post topic..."}
            value={postTopic}
            onChangeText={handleTopicChange}
          />
          :
          <View></View>
        }
        <TextInput
          style={styles.contentTextInput}
          multiline
          placeholder={params.postContent ? params.postContent : "Enter post content..."}
          value={postContent}
          onChangeText={setPostContent}
        />
      </View>
      <TouchableOpacity
        style={[styles.postButton, isPostButtonDisabled && styles.postButtonDisabled]}
        onPress={handlePostEdit}
        disabled={isPostButtonDisabled}
      >
        <Text style={styles.postButtonText}>Change</Text>
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

export default EditPost;
