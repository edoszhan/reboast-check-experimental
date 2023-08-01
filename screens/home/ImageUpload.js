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


const ImageUpload = () => {
  const navigation = useNavigation();
  const [selectImage, setSelectImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  
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

        const user = auth.currentUser;
        console.log(user);
        await updateProfile(user, {
          photoURL: response.assets[0].uri,
        });
        console.log(user);
        // Update Firestore with the new photoURL
        try {
          const uid = auth.currentUser.uid;
          await updateDoc(doc(FIREBASE_DB, 'users-info', uid), {
            // photoURL: response.assets[0].uri,
            photoURL: response.assets[0].uri,
          });
          console.log('Document successfully updated!');
        } catch (error) {
          console.log('Error updating document: ', error);
        }
        navigation.navigate(ROUTES.USER_PROFILE, {refresh: "true"});
      }
    });
  };
  // useEffect(() => {
  //   // Function to fetch the image URL from Firebase Storage
  //   const fetchImage = async () => {
  //     try {
  //       const uidString = FIREBASE_AUTH.currentUser.uid;
  //       // console.log('/ProfilePictures/' + uidString + ".png");
  //       const imageRef = ref(storage, '/ProfilePictures/' + uidString + ".png"); //firebase storage can be potentially used to store userPFP, and post images where names of those components is uid and postID respectively
  //       const url = await getDownloadURL(imageRef);
  //       setImageUrl(url);
  //     } catch (error) {
  //       console.log('Error fetching image URL: ', error);
  //     }
  //   };

  //   fetchImage();
  // }, []);
  

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
