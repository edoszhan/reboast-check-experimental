import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const ProfileSettings = () => {
  const [selectImage, setSelectImage] = useState("");
  const ImagePicker = () => {
    let options = {
      storageOptions: {
        path: 'images',
      },
    };

    launchImageLibrary(options, (response) => {
      setSelectImage(response.assets[0].uri);
      console.log(response.assets[0].uri);
    });
  };
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{height: 400, width:'100%'}}>
        <Image style={{height: 400, width:'100%'}} source={{uri: selectImage}} />
      </View>
        <TouchableOpacity onPress={() => 
        {ImagePicker();
        }}>
          <Text style={{fontSize: 20, textAlign: 'center'}}>Upload Image</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );

};

export default ProfileSettings;