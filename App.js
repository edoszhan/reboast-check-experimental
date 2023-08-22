import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import AuthNavigator from './navigations/AuthNavigator';
import { MenuProvider } from 'react-native-popup-menu';
import { DefaultTheme} from '@react-navigation/native';


const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  },
};
export default function App() {

  return (
      <MenuProvider>
        <NavigationContainer theme={navTheme}> 
          <AuthNavigator />
        </NavigationContainer>
      </MenuProvider>


  );
}
