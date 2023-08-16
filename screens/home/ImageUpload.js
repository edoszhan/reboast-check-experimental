import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { FIREBASE_DB } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH } from '../../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../constants';
import { updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase';
import { useEffect } from 'react';
import { uploadBytesResumable } from 'firebase/storage';


const ImageUpload = () => {
  const navigation = useNavigation();
  const [selectImage, setSelectImage] = useState("");
  
  const ImagePicker = () => {
    let options = {
      storageOptions: {
        path: 'images',
      },
    };
    launchImageLibrary(options, async (response) => {
  
      if (response.assets && response.assets.length > 0) {
        setSelectImage(response.assets[0].uri);
        const user = FIREBASE_AUTH.currentUser;
        const uidString = FIREBASE_AUTH.currentUser.uid;
        const storageRef = ref(storage, '/ProfilePictures/' + uidString + '.png');
  
        // Fetch the file
        const file = await fetch(response.assets[0].uri);
        const blob = await file.blob();
  
        // Upload the file to Firebase Storage
        const uploadTask = uploadBytesResumable(storageRef, blob);
  
        uploadTask.on('state_changed', 
          (snapshot) => {
            // You can add code to handle progress, pause, and resume events here
          }, 
          (error) => {
            // Handle unsuccessful uploads
            console.log('Error uploading image: ', error);
          }, 
          async () => {
            // Handle successful uploads on complete
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  
            // Update the user's profile with the new photoURL
            await updateProfile(user, {
              photoURL: downloadURL,
            });
  
            // Update Firestore with the new photoURL
            try {
              await updateDoc(doc(FIREBASE_DB, 'users-info', uidString), {
                photoURL: downloadURL,
              });
              console.log('Document successfully updated!');
            } catch (error) {
              console.log('Error updating document: ', error);
            }
  
            navigation.navigate(ROUTES.USER_PROFILE, { refresh: 'true' });
          }
        );
      }
    });
  };
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ height: 400, width: '100%' }}>
        {selectImage ? (
          <Image style={{ height: 400, width: '100%' }} source={{ uri: selectImage }} />
        ) : (
          <Text style={{fontSize: 16,
            textAlign: 'center',
            marginTop: 200}}
           >{""}</Text>
        )}
      </View>
      <TouchableOpacity onPress={ImagePicker}>
        <Text style={{ fontSize: 20, textAlign: 'center' }}>Upload Image</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ImageUpload;
