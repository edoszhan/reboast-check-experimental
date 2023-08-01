import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useEffect } from 'react';
import { storage } from '../../config/firebase';
import { Image } from 'react-native';
import { ref } from 'firebase/storage';
import { getDownloadURL } from 'firebase/storage';
import { FIREBASE_AUTH } from '../../config/firebase';


export default function TodoInformation() {
    const [imageUrl, setImageUrl] = useState(null); // State to store the image URL
  
    useEffect(() => {
      // Function to fetch the image URL from Firebase Storage
      const fetchImage = async () => {
        try {
          const uidString = FIREBASE_AUTH.currentUser.uid;
          console.log('/ProfilePictures/' + uidString + ".png");
          const imageRef = ref(storage, '/ProfilePictures/' + uidString + ".png"); //firebase storage can be potentially used to store userPFP, and post images where names of those components is uid and postID respectively
          const url = await getDownloadURL(imageRef);
          setImageUrl(url);
        } catch (error) {
          console.log('Error fetching image URL: ', error);
        }
      };
  
      fetchImage();
    }, []);
  
    return (
      <View style={styles.container}>
        <Text style={styles.text}>TodoInformation</Text>
        {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
      </View>
    );
  }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            },
        text: {
            fontSize: 20,
            fontWeight: 'bold',
            },
        image: {
            width: 200,
            height: 200,
            marginTop: 20,
            },
        });

  
