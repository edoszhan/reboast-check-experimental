import React from 'react';
import { BottomTabView, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ROUTES } from '../constants';
import { Home, Timer, Calendar, Profile} from '../screens';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import Settings from '../screens/home/Settings';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/home/ProfileScreen';
import TimerLogs from '../screens/home/TimerLogs';
import TimerScreen from '../screens/home/TimerScreen';
import BottomDrawerScreen from '../screens/home/BottomDrawerScreen';
import { View, Text } from 'react-native';

// import Animated from 'react-native-reanimated';
// import BottomSheet from 'reanimated-bottom-sheet';

const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();
const TimerStack = createStackNavigator();

import { StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';



function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="Settings" component={Settings}/>
      {/* <ProfileStack.Screen name="Add tasks" component={BottomDrawerScreen}/> */}
    </ProfileStack.Navigator>
  );
}

function TimerStackScreen() {
  return (
    <TimerStack.Navigator>
      <TimerStack.Screen name="Timer" component={Timer} />
      <TimerStack.Screen name="History" component={TimerLogs}/>
    </TimerStack.Navigator>
  );
}


// function CustomHeader() {
//   // const navigation = useNavigation();

//   // const handleSettingsPress = () => {
//   //   navigation.navigate(ROUTES.SETTINGS);
//   // };

//   return (
//     <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}>
//       <Ionicons name="settings-outline" size={24} color="black" />
//     </TouchableOpacity>
//   );
// }


function BottomTabNavigator() {
  // const renderContent = () => (
  //   <View
  //     style={{
  //       backgroundColor: 'white',
  //       padding: 16,
  //       height: 450,
  //     }}
  //   >
  //     <Text>Swipe down to close</Text>
  //   </View>
  // );

  // const sheetRef = React.useRef(null);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // header: () => <CustomHeader />,
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
              iconName = focused ? 'chatbubble-sharp' : 'chatbubble-outline';  //technically commuunity chats will be here; profile changes are not updated
              return <Ionicons name={iconName} size={size} color={color} />;
            case ROUTES.BOTTOM_DRAWER:  
              iconName = focused ? 'add-circle' : 'add-circle-outline';  //technically commuunity chats will be here; profile changes are not updated
              return <Ionicons name={iconName} size={size} color={color} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name={ROUTES.HOME_TAB} component={Home} />
      {/* <BottomSheet
        ref={sheetRef}
        snapPoints={[450, 300, 0]}
        borderRadius={10}
        renderContent={renderContent}
      /> */}
      <Tab.Screen name={ROUTES.TIMER} component={TimerStackScreen}/>
      <Tab.Screen name={ROUTES.BOTTOM_DRAWER} component={BottomDrawerScreen}/>
      <Tab.Screen name={ROUTES.CALENDAR} component={Calendar} />
      <Tab.Screen name={ROUTES.PROFILE} component={ProfileStackScreen}/>
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;

const styles = StyleSheet.create({
  settingsButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
  },
});
