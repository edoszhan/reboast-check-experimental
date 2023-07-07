import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../constants';

const createPostArray = (posts) => {
  return posts.map((post, index) => ({ ...post, id: index.toString() }));
};

const PostItem = ({ post }) => {
  return (
    <View style={styles.postBlock}>
      <Text style={styles.postTopic}>{post.topic}</Text>
      <Text style={styles.postContent}>{post.content}</Text>
    </View>
  );
};

const CommunityScreen = ({ route }) => {
  const { posts } = route.params ? route.params : { posts: [] };
  const [postArray, setPostArray] = useState([]);

  useEffect(() => {
    if (posts.length > 0) {
      const updatedPostArray = createPostArray(posts);
      setPostArray(updatedPostArray);
    }
  }, [posts]);

  const navigation = useNavigation();

  const navigateToAddPost = () => {
    navigation.navigate(ROUTES.ADD_POST_SCREEN, { onPostCreated: addNewPost });
  };

  const addNewPost = (post) => {
    setPostArray((prevPostArray) => {
      const updatedPosts = [...posts, post];
      return createPostArray(updatedPosts);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.postListContainer}>
        {postArray.length > 0 ? (
          postArray.map((post) => (
            <PostItem key={post.id} post={post} />
          ))
        ) : (
          <Text style={styles.noPostsText}>No posts yet</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button onPress={navigateToAddPost} title="Add Post" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  postListContainer: {
    paddingHorizontal: 16,
  },
  postBlock: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  postTopic: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 16,
  },
  noPostsText: {
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 16,
  },
});

export default CommunityScreen;
