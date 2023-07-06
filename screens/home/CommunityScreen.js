import React, { useState } from 'react';
import { Text, View, StyleSheet, Button, FlatList } from 'react-native';

export default function CommunityScreen({ route }) {
  const { posts: initialPosts } = route.params ? route.params : { posts: [] };
  const [posts, setPosts] = useState(initialPosts);

  const addPost = () => {
    const newPost = { topic: 'New Post', content: 'New Post Content' };
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
  };

  const renderItem = ({ item }) => (
    <View style={styles.postBlock}>
      <Text style={styles.postTopic}>{item.topic}</Text>
      <Text style={styles.postContent}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {posts.length > 0 ? (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text style={styles.noPostsText}>No posts yet</Text>
      )}
      <Button title="Add Post" onPress={addPost} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  postBlock: {
    backgroundColor: '#f2f2f2',
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
});
