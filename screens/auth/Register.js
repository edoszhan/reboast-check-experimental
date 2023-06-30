import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../config/firebase';
import { COLORS, ROUTES } from '../../constants';
import { doc, setDoc } from 'firebase/firestore';

import uuid from 'react-native-uuid';

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const [name, setName] = useState('');
  const userId_random = uuid.v4();

  // function create () {
  //   setDoc(doc(FIREBASE_DB, "users-info", userId_random), {
  //     name: name,
  //     email: email,
  // }).then(() => {
  //     console.log("Document successfully written!");

  // }).catch((error) => {
  //   console.log("Error writing document: ", error);
  // });
  // }


  // const signUp = async () => {
  //   if (password !== repeatPassword) {
  //     Alert.alert('Passwords do not match');
  //     return;
  //   }

  //   if (!agreed) {
  //     Alert.alert('Please agree to the terms and conditions');
  //     return;
  //   }

  //   try {
  //     const response = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
  //     console.log(response);
  //     Alert.alert('Registration Success');

  //     create();

  //     navigation.replace(ROUTES.HOME);
  //   } catch (error) {
  //     console.log(error);
  //     Alert.alert('Registration Failed');
  //   }
  // };
  const create = async (uid) => {
    try {
      await setDoc(doc(FIREBASE_DB, "users-info", uid), {
        name: name,
        email: email,
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

    if (!agreed) {
      Alert.alert('Please agree to the terms and conditions');
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      console.log(user);
      Alert.alert('Registration Success');

      const uid = user.uid;
      await create(uid);

      navigation.replace(ROUTES.HOME);
    } catch (error) {
      console.log(error);
      Alert.alert('Registration Failed');
    }
  };



  return (
    <View style={styles.container}>
      <Text style={styles.header}>Register</Text>

      <Text style={styles.inputLabel}>Name
      
      <Text style={styles.mandatoryApostrophe}>*</Text></Text>
      <TextInput
        style={styles.input}
        value={name}
        placeholder="Enter your name"
        autoCapitalize="none"
        onChangeText={(name) => setName(name)}
        />

      <Text style={styles.inputLabel}>Email 
      
      <Text style={styles.mandatoryApostrophe}>*</Text></Text>
      <TextInput
        style={styles.input}
        value={email}
        placeholder="Enter email"
        autoCapitalize="none"
        onChangeText={(email) => setEmail(email)}
      />

      <Text style={styles.inputLabel}>Password 
      <Text style={styles.mandatoryApostrophe}>*</Text></Text>
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      />
      <Text style={styles.inputLabel}>Confirm Password
      <Text style={styles.mandatoryApostrophe}>*</Text></Text>
      <TextInput
        style={styles.input}
        value={repeatPassword}
        placeholder="Repeat Password"
        secureTextEntry={true}
        onChangeText={(text) => setRepeatPassword(text)}
      />
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
        <Text style={styles.checkBoxLabel}>I agree to the terms and conditions</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={signUp}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
          <Text style={styles.footerText}> Already have an account? </Text>
          {/******************** LOG IN BUTTON *********************/}
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.LOGIN)}>
            <Text style={styles.logInBtn}>Login</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
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
    marginBottom: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginLink: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 20,
  },
  mandatoryApostrophe: {
    color: "red",
    fontSize: 20,
    marginLeft: 5,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
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
    bottom: 55,
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
});

export default Register;
