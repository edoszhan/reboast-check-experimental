import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useRoute} from '@react-navigation/native';

const NoticeScreen = () => {
  const route = useRoute();
  return (
    <View style={styles.container}>
      <Text>ForgotPassword  </Text>
      <Text>  </Text>
      {/* <Text> Params: {route.params.userID}</Text> */}
      <Text> N/A </Text>
    </View>
  );
};

export default NoticeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});