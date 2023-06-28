import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import AuthNavigator from './navigations/AuthNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <AuthNavigator />
     </NavigationContainer>

  );
}
