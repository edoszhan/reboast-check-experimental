import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AuthNavigator from './navigations/AuthNavigator';

export default function App() {
  return (
    <NavigationContainer>
        {/* <SafeAreaView
        style={{
         flex: 1,
           justifyContent: 'center',
           alignItems: 'center',
      }}>
       <Text>App</Text>
      </SafeAreaView> */}
      <AuthNavigator />
     {/* <AuthNavigator />  */}
     </NavigationContainer>

  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
