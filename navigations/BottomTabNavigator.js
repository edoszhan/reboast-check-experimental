import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ROUTES } from '../constants';
import { Home, Timer, Calendar, UserProfile, AddPost, PostInformation, TodoInformation } from '../screens';
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import TimerLogs from '../screens/home/TimerLogs';
import { TouchableOpacity, View, Text, Modal, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ProfileSettings from '../screens/home/ImageUpload';
import { Input } from 'react-native-elements';
import { Dropdown } from 'react-native-element-dropdown';
import uuid from 'react-native-uuid';
import { FIREBASE_DB } from '../config/firebase';
import { FIREBASE_AUTH } from '../config/firebase';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();
const TimerStack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const UserProfileStack = createStackNavigator();
const HomeScreenStack = createStackNavigator();

import CommunityScreen from '../screens/home/CommunityScreen'; 
import { ActivityIndicator } from 'react-native-paper';
import HomeScreen from '../screens/home/HomeScreen';

const HomeStackScreen = () => {
  return (
    <HomeScreenStack.Navigator screenOptions={{ headerTitle: "" }}>
      <HomeScreenStack.Screen name={ROUTES.HOME} component={HomeScreen} />
      <HomeScreenStack.Screen name={ROUTES.TODO_INFORMATION} component={TodoInformation} />
      </HomeScreenStack.Navigator>
  );
};

const CommunityStackScreen = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: true }} id="tabs">
      <ProfileStack.Screen name={ROUTES.COMMUNITY_MAIN} component={CommunityScreen} /> 
      <ProfileStack.Screen name={ROUTES.ADD_POST_SCREEN} component={AddPost} />
      <ProfileStack.Screen name={ROUTES.POST_INFORMATION} component={PostInformation} />
    </ProfileStack.Navigator>
  );
};

const TimerStackScreen = () => {
  return (
    <TimerStack.Navigator screenOptions={{ headerShown: true }}>
      <TimerStack.Screen name="Timers" component={Timer} />
      <TimerStack.Screen name="History" component={TimerLogs} />
    </TimerStack.Navigator>
  );
};

const UserProfileStackScreen = () => {
  return (
    <UserProfileStack.Navigator>
      <UserProfileStack.Screen name="User Profile" component={UserProfile} />
      <UserProfileStack.Screen name="User Profile Settings" component={ProfileSettings} />
    </UserProfileStack.Navigator>
  );
};

function StackRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="home"
        component={Home}  
      />
      <Stack.Screen name="UserProfile" component={UserProfile} />
    </Stack.Navigator>
  );
}

const BottomTabNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { 
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="blue" />
        <Text style={{ marginTop: 10 }}>Loading...</Text> 
      </View>
    );
  }

  return (
    <Drawer.Navigator initialRouteName="Home" screenOptions={{ headerTitle: '' }}>
      <Drawer.Screen name="Home" component={MainComponent} />
      <Drawer.Screen name="Profile" component={UserProfileStackScreen} />
    </Drawer.Navigator>
  );
};

function MainComponent() {
  const [taskName, setTaskName] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [dailyPressed, setDailyPressed] = useState(false);

  const togglePopup = () => {
    setSelectedDays([]); 
    setIsPopupVisible(!isPopupVisible);
  };

  const handleTaskNameChange = (text) => {
    setTaskName(text);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleDayPress = (index) => {
    const updatedCheckboxes = [...checkboxes];
    updatedCheckboxes[index].checked = !updatedCheckboxes[index].checked;
    setCheckboxes(updatedCheckboxes);
  };

  const handleDailyPress = () => {
    setDailyPressed(!dailyPressed);
    const allChecked = checkboxes.every((checkbox) => checkbox.checked);
    const updatedCheckboxes = checkboxes.map((checkbox) => ({
      ...checkbox,
      checked: !allChecked,
    }));
    setCheckboxes(updatedCheckboxes);
  };

  const data = [
    { label: 'Morning Routine', value: '1' },
    { label: 'Sport', value: '2' },
    { label: 'Learning', value: '3' },
    // { label:  "Add category +", value: "Add category +" },
  ];

  const [checkboxes, setCheckboxes] = useState([
    { day: '월', checked: false },
    { day: '화', checked: false },
    { day: '수', checked: false },
    { day: '목', checked: false },
    { day: '금', checked: false },
    { day: '토', checked: false },
    { day: '일', checked: false },
  ]);

  useEffect(() => {
    if (!isPopupVisible) {
      setCheckboxes(checkboxes.map((checkbox) => ({ ...checkbox, checked: false })));
      setDailyPressed(false);
    }
  }, [isPopupVisible]);

  const category_random_Id= uuid.v4();
  const auth = FIREBASE_AUTH;
  const uid = auth.currentUser.uid;

  //sending todo data to firebase
  const create = async (uid, categoryName) => {
    console.log(categoryName);
    console.log("reached here too")
    try {
      await setDoc(doc(FIREBASE_DB, 'todo-list', uid, categoryName, category_random_Id), {  //session3 should not be manually entered, we need to update number of sessions  
        categoryName: selectedCategory,
        categoryColor: selectedColor,
        isChecked: false,
        categoryItems: taskName,
        categoryDays: selectedDays,
        categoryId: category_random_Id,
        createdAt: serverTimestamp(),
      }); 
      await setDoc(doc(FIREBASE_DB, 'todo-list', uid, "All", category_random_Id), {  //session3 should not be manually entered, we need to update number of sessions  
        categoryName: selectedCategory,
        categoryColor: selectedColor,
        isChecked: false,
        categoryItems: taskName,
        categoryDays: selectedDays,
        categoryId: category_random_Id,
        createdAt: serverTimestamp(),
      }); 

    } catch (error) {
      console.log("Error writing document: ", error);
    }
  };

  const sendData = async () => {
    console.log("reached here")
    await create(uid, selectedCategory);
  };

  const handleSave = () => {  
    // Save the session details to the database
    togglePopup(); // Close the popup
    sendData();
    setSelectedDays([]); 
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
              case ROUTES.COMMUNITY:
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
        <Tab.Screen component={HomeStackScreen} name={ROUTES.HOME_TAB} />
        <Tab.Screen name={ROUTES.TIMER} component={TimerStackScreen} />
        <Tab.Screen
          name={ROUTES.BOTTOM_DRAWER}
          component={Calendar}
          options={{
            tabBarButton: () => (
              <TouchableOpacity onPress={togglePopup} style={styles.tabBarButton}>
                <Ionicons name="add-circle-outline" color="black" size={40} />
              </TouchableOpacity>
            ),
          }}
        />
        <Tab.Screen name={ROUTES.CALENDAR} component={Calendar} />
        <Tab.Screen name={ROUTES.COMMUNITY} component={CommunityStackScreen} />
      </Tab.Navigator>
      {isPopupVisible && (
        <Modal transparent={true} animationType="slide" visible={isPopupVisible} onRequestClose={togglePopup}>
          <View style={styles.modalContainer}>
            <View style={styles.popup}>
              <TouchableOpacity style={styles.closeButton} onPress={togglePopup}>
                <Ionicons name="close" size={25} color="black" />
              </TouchableOpacity>
              <View style={styles.dayButtonsContainer}>
                {checkboxes.map((checkbox, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.dayButton, checkbox.checked && styles.checkedDayButton]}
                    onPress={() => [handleDayPress(index), setSelectedDays(selectedDays => [checkboxes[index].day,])]}
                  >
                    <Text style={[styles.dayButtonText, checkbox.checked && styles.checkedDayButtonText]}>
                      {checkbox.day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={[styles.dailyButton, dailyPressed && styles.dailyButtonPressed]}
                onPress={handleDailyPress}
              >
                <Text style={styles.dailyButtonText}>Daily</Text>
              </TouchableOpacity>
              <Text style={styles.popupText}>Task</Text>
              <Input
                style={{ borderColor: 'black', borderWidth: 1, borderRadius: 5, marginLeft: -10 }}
                placeholder=" Enter task name"
                onChangeText={handleTaskNameChange}
              >
              </Input>
              <Text style={styles.popupText}>Color</Text>
              <Input
                style={{ borderColor: 'black', borderWidth: 1, borderRadius: 5, marginLeft: -10 }}
                placeholder=" Enter color name"
                onChangeText={handleColorSelect}
              >
              </Input>
              <Text style={styles.popupText}>Category</Text>
              <Dropdown
                labelField="label"
                valueField="value"
                onChange={(item) => {
                  setSelectedCategory(item.label);
                  console.log('selected days:', selectedDays);
                }}
                placeholder=" Select category"
                style={{ width: 330, borderColor: 'black', borderWidth: 1, borderRadius: 10 }}
                data={data}
                // value={selectedCategory} //attemp to fix the dropdown items unselect
                onChangeText={handleCategorySelect}
              />
              <TouchableOpacity style={styles.closeButton} onPress={togglePopup}>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    borderWidth: 5,
    backgroundColor: 'rgba(100,100,100, 0.5)',
  },
  popup: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    position: 'absolute',
    left: 0,
    right: 0,
  },
  popupText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 240,
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10,
    zIndex: 1,
  },
  closeButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  tabBarButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 20,
  },
  dayButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkedDayButton: {
    backgroundColor: 'green',
    borderColor: 'green',
  },
  dayButtonText: {
    fontSize: 16,
    color: 'gray',
  },
  checkedDayButtonText: {
    color: 'white',
  },
  dailyButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'black', 
    borderRadius: 5,
    marginBottom: 20,
  },
  dailyButtonPressed: {
    backgroundColor: 'green',
  },
  dailyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  saveButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 5,
    marginLeft: 140,
    width: 60,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 4,
    
  },
});

export default BottomTabNavigator;
