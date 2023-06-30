import React from 'react';
import {SafeAreaView, Settings, StyleSheet, Text, View} from 'react-native';
import { FIREBASE_AUTH } from '../../config/firebase';
import { Button } from 'react-native';
import { ROUTES } from '../../constants';




const ProfileScreen = (props) => {
  const {navigation} = props;
  return (
    <View style= {{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate(ROUTES.SETTINGS)} title="Go to Settings"/>
      <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout from account" />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});