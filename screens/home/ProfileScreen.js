import React from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES } from '../../constants';

const ProfileScreen = ({ route, navigation }) => {
  const { posts } = route.params ?? { posts: [] };
  console.log('ProfileScreen posts:', posts);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.postListContainer}>
        {posts && posts.length > 0 ? (
          posts.map((post, index) => (
            <View style={styles.postBlock} key={index}>
              <Text style={styles.postTopic}>Hello</Text>
              <Text style={styles.postContent}>Bye</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noPostsText}>No posts yet</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button
          icon={<Ionicons name="pencil" size={24} color="white" />}
          onPress={() => navigation.navigate(ROUTES.ADD_POST_SCREEN)}
          buttonStyle={styles.button}
        />
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
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  button: {
    backgroundColor: 'blue',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

export default ProfileScreen;
