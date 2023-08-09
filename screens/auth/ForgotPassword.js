import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import { FIREBASE_AUTH } from '../../config/firebase';
import { useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { sendPasswordResetEmail } from 'firebase/auth';
import { fetchSignInMethodsForEmail } from 'firebase/auth';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  const changePassword = async () => {

    // Check if email is in valid format
    const isValidEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
    if (!isValidEmail) {
        Alert.alert(
            "Invalid Email Format",
            "Please enter a valid email address.",
            [{ text: "OK" }]
        );
        return;
    }

    try {
      const signInMethods = await fetchSignInMethodsForEmail(FIREBASE_AUTH, email);

      if (signInMethods.length === 0) {
        // If no sign-in methods are returned, the email is not registered
        Alert.alert(
          "Email Not Found", // Title of the alert
          "This email is not registered in the system.", // Message
          [{ text: "OK" }] // Array of buttons, in this case, just one "OK" button
        );
        return;
      }

      await sendPasswordResetEmail(FIREBASE_AUTH, email)
      console.log("Email sent");

      // Alert the user about successful email
      Alert.alert(
        "Success",
        "Password reset email has been sent!",
        [{ text: "OK" }]
      );
      navigation.goBack();
    } catch(error) {
      console.log(error);
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Password Reset</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Enter your email address below to reset your password</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
         style={styles.input}
         value={email}
         onChangeText={text => setEmail(text)}
         placeholder="Enter your email"
         autoCapitalize="none"
         keyboardType="email-address"
        />
        <TouchableOpacity style={styles.button} onPress={changePassword}>
          <Text style={styles.buttonText}>Send Email</Text>
        </TouchableOpacity>
      </View> 
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    alignItems: 'center',
    justifyContent: 'center', // Centers content vertically
    marginBottom: 10,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  textContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#7A7A7A',
    lineHeight: 24, 
  },
  inputContainer: {
    width: '80%',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 8,
    width: '100%',
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});