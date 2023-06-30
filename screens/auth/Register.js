import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../config/firebase';
import { COLORS, ROUTES } from '../../constants';

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

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
      const response = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      console.log(response);
      Alert.alert('Registration Success');
      navigation.replace(ROUTES.HOME);
    } catch (error) {
      console.log(error);
      Alert.alert('Registration Failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Register</Text>

      <TextInput
        style={styles.input}
        value={email}
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
      />

      <TextInput
        style={styles.input}
        value={password}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      />

      <TextInput
        style={styles.input}
        value={repeatPassword}
        placeholder="Repeat Password"
        secureTextEntry={true}
        onChangeText={(text) => setRepeatPassword(text)}
      />

      <TouchableOpacity
        style={styles.checkBoxContainer}
        onPress={() => setAgreed(!agreed)}
      >
        {agreed ? (
          <Text style={styles.checkBoxText}>✓</Text>
        ) : (
          <Text style={styles.checkBoxText}></Text>
        )}
        <Text style={styles.checkBoxLabel}>I agree to the terms and conditions</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={signUp}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate(ROUTES.LOGIN)}>
        <Text style={styles.loginLink}>Already have an account? Log in</Text>
      </TouchableOpacity>
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
    marginBottom: 24,
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
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
  },
  checkBoxText: {
    fontSize: 20,
    marginRight: 10,
  },
  checkBoxLabel: {
    fontSize: 16,
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
    marginTop: 10,
  },
});

export default Register;
