import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../config/firebase';
import { COLORS, ROUTES } from '../../constants';
import { doc, setDoc } from 'firebase/firestore';
import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const Register2 = ({ route, navigation }) => {
  const { name, email } = route.params;

  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [agreed, setAgreed] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const isPasswordValid = (password) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
    return regex.test(password);
  }

  const create = async (uid, name) => {
    console.log("uid", uid);
    try {
      await setDoc(doc(FIREBASE_DB, "users-info", uid), {
        displayName: name,
        email: email,
        userId: uid,
        photoURL: null,
      });
      console.log("Document successfully written!");
    } catch (error) {
      console.log("Error writing document: ", error);
    }
  };

  const signUp = async () => {
    if (password !== repeatPassword) {
      Alert.alert('Passwords do not match');
      return;
    }

    if (!isPasswordValid(password)) {
      Alert.alert('Password should be at least 8 characters long, include at least 1 number, 1 character, and 1 letter.');
      return;
    }

    if (!agreed) {
      Alert.alert('Please agree to the terms and conditions');
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      console.log(user);

      await updateProfile(user, {
        displayName: name,
      });

      console.log(name);
      Alert.alert('Registration Success');

      const uid = user.uid;

      await create(uid, name);

      navigation.replace(ROUTES.HOME);
    } catch (error) {
      console.log(error);
      Alert.alert('Registration Failed');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            <Text style={styles.inputLabel}>Password
              <Text style={styles.mandatoryApostrophe}>*</Text>
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={{...styles.input, flex: 1}}
                value={password}
                placeholder="Password"
                secureTextEntry={!isPasswordVisible}
                onChangeText={(text) => setPassword(text)}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <Text style={{right: 10, position: 'absolute', marginTop: -5}}>{isPasswordVisible ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>
            <Text style={{...styles.inputLabel}}>Confirm Password
              <Text style={styles.mandatoryApostrophe}>*</Text>
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={{...styles.input, flex: 1}}
                value={repeatPassword}
                placeholder="Repeat Password"
                secureTextEntry={!isConfirmPasswordVisible}
                onChangeText={(text) => setRepeatPassword(text)}
              />
              <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                <Text style={{right: 10, position: 'absolute', marginTop: -5}}>{isConfirmPasswordVisible ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>
        <View style={styles.checkBoxContainer}>
            <TouchableOpacity
            style={styles.checkBox}
            onPress={() => setAgreed(!agreed)}
            >
            {!agreed ? (
                <View style={styles.checkBoxBox} />
            ) : (
                <Text style={styles.checkBoxTick}>✓</Text>
            )}
            </TouchableOpacity>
            <Text>I agree to the <Text style={{textDecorationLine: 'underline'}}>Terms and Conditions</Text> </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={signUp}>
            <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    bottom: 10,
    },
    header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    },
    input: {
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    backgroundColor: COLORS.grayLight,
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    height: 55,
    width: '100%',
    },
    inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginRight: 'auto',
    marginLeft: 4,
    },
    button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 5,
    bottom: -10,
    },
    buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    },
    mandatoryApostrophe: {
    color: 'red',
    fontSize: 20,
    marginLeft: 5,
    },
    checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
    },
    checkBox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    },
    checkBoxBox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    borderRadius: 2,
    },
    checkBoxTick: {
    fontSize: 16,
    color: COLORS.primary,
    },
    checkBoxLabel: {
    fontSize: 16,
    },
    footer: {
    position: 'absolute',
    bottom: 0,
    textAlign: 'center',
    flexDirection: 'row',
    },
    footerText: {
    color: COLORS.gray,
    fontWeight: 'bold',
    },
    logInBtn: {
    color: COLORS.primary,
    fontWeight: 'bold',
    },
    passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    }
});

export default Register2;

