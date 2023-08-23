import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { COLORS, ROUTES } from '../../constants';
import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const goToNextStep = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Please fill in all the fields.');
      return;
    }
    navigation.navigate(ROUTES.REGISTER2, { name, email });
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
            <Text style={styles.inputLabel}>Name
              <Text style={styles.mandatoryApostrophe}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={name}
              placeholder="Enter your name"
              autoCapitalize="none"
              onChangeText={(name) => setName(name)}
            />
            <Text style={styles.inputLabel}>Email
              <Text style={styles.mandatoryApostrophe}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={email}
              placeholder="Enter email"
              autoCapitalize="none"
              onChangeText={(email) => setEmail(email)}
            />

            <TouchableOpacity style={styles.button} onPress={goToNextStep}>
              <Text style={styles.buttonText}>Next</Text>
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

export default Register;
