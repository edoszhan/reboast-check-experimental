import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import AuthNavigator from './navigations/AuthNavigator';
import { MenuProvider } from 'react-native-popup-menu';
import { Provider } from 'react-redux';
import {store} from './redux/store';

export default function App() {

  return (
    <Provider store={store}>
    <MenuProvider>
    <NavigationContainer>
      <AuthNavigator />
     </NavigationContainer>
    </MenuProvider>
    </Provider>


  );
}
