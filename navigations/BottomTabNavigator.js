import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ROUTES } from '../constants';
import { Home, Timer, Calendar, Profile } from '../screens';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: [
            {
              display: "flex"
            },
            null
          ],
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case ROUTES.HOME_TAB:
              iconName = focused ? 'home' : 'home-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            case ROUTES.TIMER:
              iconName = focused ? 'timer' : 'timer-outline';
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
            case ROUTES.CALENDAR:
              iconName = focused ? 'calendar' : 'calendar-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            case ROUTES.PROFILE:
              iconName = focused ? 'user' : 'user-o';
              return <FontAwesome name={iconName} size={size} color={color} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name={ROUTES.HOME_TAB} component={Home} />
      <Tab.Screen name={ROUTES.TIMER} component={Timer} />
      <Tab.Screen name={ROUTES.CALENDAR} component={Calendar} />
      <Tab.Screen name={ROUTES.PROFILE} component={Profile} />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;
