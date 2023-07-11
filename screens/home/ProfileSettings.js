import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { launchImageLibrary } from 'react-native-image-picker';

const ProfileSettings = () => {
  const [profileImage, setProfileImage] = useState(null);
  
  const handleChooseImage = () => {
    launchImageLibrary({ title: 'Select Profile Picture' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.uri };
        setProfileImage(source);
      }
    });
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.profileImageContainer} onPress={handleChooseImage}>
        {profileImage ? (
          <Image source={profileImage} style={styles.profileImage} />
        ) : (
          <Text style={styles.selectImageText}>Select Profile Picture</Text>
        )}
      </TouchableOpacity>
      <Text>Profile Settings and PFP Upload</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 196,
    height: 196,
    borderRadius: 98,
  },
  selectImageText: {
    fontSize: 16,
    color: 'gray',
  },
});

export default ProfileSettings;
