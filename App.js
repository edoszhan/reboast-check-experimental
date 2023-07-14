import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import AuthNavigator from './navigations/AuthNavigator';
import { MenuProvider } from 'react-native-popup-menu';
export default function App() {

  return (

    <MenuProvider>
    <NavigationContainer>
      <AuthNavigator />
     </NavigationContainer>
    </MenuProvider>

  );
}
