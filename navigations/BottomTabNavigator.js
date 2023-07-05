import React, { useState } from 'react';
import { BottomTabView, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ROUTES } from '../constants';
import { Home, Timer, Calendar, Profile, UserProfile, AddPost } from '../screens';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import Settings from '../screens/home/Settings';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/home/ProfileScreen';
import TimerLogs from '../screens/home/TimerLogs';
import { TouchableOpacity, View, Text, Modal, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();
const TimerStack = createStackNavigator();
const HomeStack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

import { Dimensions } from 'react-native';
const { height } = Dimensions.get('window');


const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="User Profile" component={UserProfile} />
    </HomeStack.Navigator>
  );
};

const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator
    screenOptions={{ headerTitle: "" }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      {/* <ProfileStack.Screen name="Settings" component={Settings} /> */}
      <ProfileStack.Screen name="Add Post" component={AddPost} />
    </ProfileStack.Navigator>
  );
};

const TimerStackScreen = () => {
  return (
    <TimerStack.Navigator
    screenOptions={{ headerTitle: "" }} >
      <TimerStack.Screen name="Timer" component={Timer} />
      <TimerStack.Screen name="History" component={TimerLogs} />
    </TimerStack.Navigator>
  );
};

// function DrawerRoutes() {
//   return (
//     <Drawer.Navigator
//       initialRouteName="Home"
//       screenOptions={{ headerTitle: "" }}
//     >
//       <Drawer.Screen name="Home" component={Home} />
//       <Drawer.Screen name="Profile" component={UserProfile} />
//     </Drawer.Navigator>
//   );
// }

function StackRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="home"
        component={Home}
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
              <MaterialIcons name="menu" size={25} />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen name="User Profile" component={UserProfile} />
    </Stack.Navigator>
  );
}



const BottomTabNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{ headerTitle: "" }}
    >
      <Drawer.Screen name="Home" component={BottomTabNavigator2} />
      <Drawer.Screen name="Profile" component={UserProfile} />
    </Drawer.Navigator>
  );


};



// const BottomTabNavigator2 = () => {

function BottomTabNavigator2() {

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: 'green',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: [
            {
              display: 'flex',
            },
            null,
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
                iconName = focused ? 'chatbubble-sharp' : 'chatbubble-outline';
                return <Ionicons name={iconName} size={size} color={color} />;
              case ROUTES.BOTTOM_DRAWER:
                iconName = focused ? 'add-circle' : 'add-circle-outline';
                 return <Ionicons name={iconName} size={size} color={color} />;
              default:
                return null;
            }
          },
        })}
      >
        <Tab.Screen component={StackRoutes} name={ROUTES.HOME_TAB}  />
        <Tab.Screen 
          name={ROUTES.TIMER} component={TimerStackScreen} />
        <Tab.Screen
          name={ROUTES.BOTTOM_DRAWER}
          component={Calendar}
          options={{
            tabBarButton: () => (
              <TouchableOpacity onPress={togglePopup} style={styles.tabBarButton}>
                <Ionicons name='add-circle-outline' color='black' size={40} />
              </TouchableOpacity>
            ),
          }}
        />
        <Tab.Screen name={ROUTES.CALENDAR} component={Calendar} />
        <Tab.Screen name={ROUTES.PROFILE} component={ProfileStackScreen} />
      </Tab.Navigator>
      {isPopupVisible && (
        <Modal animationType="slide" transparent={true} visible={isPopupVisible} onRequestClose={togglePopup}>
          <View style={styles.modalContainer}>
            <View style={styles.popup}>
              <Text style={styles.popupText}>Popup Content</Text>
              <TouchableOpacity style={styles.closeButton} onPress={togglePopup}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              {/* <SelectList /> */}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(100,100,100, 0.5)',
  },
  popup: {   //some changes are needed to adjust the size
    backgroundColor: 'white',
    padding: 110,
    borderRadius: 10,
    alignItems: 'center',
    position: 'absolute',
    // bottom: 0,
    left: 0,
    right: 0,
    maxHeight: height / 3,
  },
  popupText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    // marginBottom: 1,
    padding: 10,
    backgroundColor: 'gray',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tabBarButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BottomTabNavigator;
