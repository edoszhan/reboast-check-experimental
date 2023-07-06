import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../constants';

const CommunityScreen = ({ route }) => {
  const { posts } = route.params ? route.params : { posts: [] };
  const navigation = useNavigation();

  const navigateToAddPost = () => {
    navigation.navigate(ROUTES.ADD_POST_SCREEN);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.postListContainer}>
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <View style={styles.postBlock} key={index}>
              <Text style={styles.postTopic}>{post.topic}</Text>
              <Text style={styles.postContent}>{post.content}</Text>
            </View>
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