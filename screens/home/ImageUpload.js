import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { FIREBASE_DB } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH } from '../../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../constants';
import { updateDoc } from 'firebase/firestore';
import { storage } from '../../config/firebase';
import { Alert } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { uploadBytesResumable } from 'firebase/storage';
import { ref } from 'firebase/storage';

const ImageUpload = () => {
  const navigation = useNavigation();
  const [selectImage, setSelectImage] = useState("");
  const [uploading, setUploading] = useState(false);
  
  const [image, setImage] = useState("");
  const ImagePicker = () => {
    let options = {
      storageOptions: {
        path: 'images',
      },
    };
    launchImageLibrary(options, async (response) => {
      if (response.assets && response.assets.length > 0) {
        setSelectImage(response.assets[0].uri);
        const auth = FIREBASE_AUTH;

        // Update Firestore with the new photoURL
        try {
          const uid = auth.currentUser.uid;
          await updateDoc(doc(FIREBASE_DB, 'users-info', uid), {
            photoURL: response.assets[0].uri,
          });
          console.log('Document successfully updated!');
        } catch (error) {
          console.log('Error updating document: ', error);
        }
        // console.log("user", auth.currentUser);
        navigation.navigate(ROUTES.USER_PROFILE, {refresh: "true"});
      }
    });
  };

  
    // async function pickImage() {
    //   let result = await launchImageLibrary({
    //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //     allowsEditing: true,
    //     aspect: [4, 3],
    //     quality: 1,
    //   });
  
    //   console.log(result);

    //   if (!result.canceled) {
    //     setImage(result.assets[0].uri);
    //     //upload image to firebase
    //     await uploadImage(result.assets[0].uri, "image");
    //   }
    // }

    // async function uploadImage(uri, fileType) {
    //   const response = await fetch(uri);
    //   const blob = await response.blob();

    //   const storageRef = ref(storage, "ProfilePictures/" + new Date().toString());
    //   const uploadTask = uploadBytesResumable(storageRef, blob);

    // }



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
      {/* <TouchableOpacity onPress={pickImage}> */}
        <Text style={{ fontSize: 20, textAlign: 'center' }}>Upload Image</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ImageUpload;
