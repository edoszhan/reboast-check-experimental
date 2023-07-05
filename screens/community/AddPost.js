import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View, Text } from 'react-native';
import { ROUTES } from '../../constants';

const AddPost = ({navigation}) => {
  const [postContent, setPostContent] = useState('');
  const [postTopic, setPostTopic] = useState('');

  const handlePostCreation = () => {
    if (postTopic && postContent) {
      // Perform post creation logic heres
      console.log('Creating post...');
      console.log('Post Topic:', postTopic);
      console.log('Post Content:', postContent);

      // Navigate to ProfileScreen with post data
      navigation.navigate(ROUTES.PROFILE, { posts: [{ topic: postTopic, content: postContent }] });
      navigation.goBack();
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
          style={styles.textInput}
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
