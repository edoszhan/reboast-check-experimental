import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { FIREBASE_DB } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH } from '../../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../constants';
import { updateDoc } from 'firebase/firestore';


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
        console.log(response.assets[0].uri);

        // Update Firestore with the new photoURL
        try {
          const auth = FIREBASE_AUTH;
          const uid = auth.currentUser.uid;
          await updateDoc(doc(FIREBASE_DB, 'users-info', uid), {
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
