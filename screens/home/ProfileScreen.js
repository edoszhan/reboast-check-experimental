import React from 'react';
import {SafeAreaView, Settings, StyleSheet, Text, View} from 'react-native';
import { FIREBASE_AUTH } from '../../config/firebase';
import { Button } from 'react-native';
import { ROUTES } from '../../constants';
import { TouchableOpacity } from 'react-native-gesture-handler';




const ProfileScreen = (props) => {
  const {navigation} = props;
  return (
    <View style= {{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate(ROUTES.SETTINGS)} title="Go to Settings"/>
      {/* <Button onPress={() => navigation.navigate(ROUTES.BOTTOM_DRAWER)} title="Add tasks"/> */}
      <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout from account" />
      <Button
              style={[styles.button, styles.startButton]}
              onPress={navigation.navigate(ROUTES.TIMER)}
              title="Timer"
            >
              <Text style={styles.buttonText}>Add post</Text>
            </Button>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 30,
  },
  startButton: {
    backgroundColor: "#32CD32",
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});