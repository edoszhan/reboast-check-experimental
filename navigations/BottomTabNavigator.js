import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ROUTES } from '../constants';
import { Home, Timer, Calendar, UserProfile, AddPost, PostInformation, TodoInformation, Settings, EditPost, MemoScreen, TodoList} from '../screens';
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
import { setDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';
const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();
const TimerStack = createStackNavigator();
const Drawer = createDrawerNavigator();
const UserProfileStack = createStackNavigator();
const HomeScreenStack = createStackNavigator();
const CalendarScreenStack = createStackNavigator();
const TodoListStack = createStackNavigator();

import CommunityScreen from '../screens/home/CommunityScreen'; 
import { ActivityIndicator } from 'react-native-paper';
import HomeScreen from '../screens/home/HomeScreen';
import { useNavigation } from '@react-navigation/native';

const CalendarStackScreen = () => {
  const navigation = useNavigation();
  return (
    <CalendarScreenStack.Navigator screenOptions={{ headerTitle: "Calendar",
    headerTitleAlign: 'left',
    headerLeft: () => (
      <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 10 }}>
        <Ionicons name="menu" size={30} color="black" />
      </TouchableOpacity>
    ),
    }}>
      <CalendarScreenStack.Screen name=" " component={Calendar} />
    </CalendarScreenStack.Navigator>
  );
};

const HomeStackScreen = () => {
  const navigation = useNavigation();
  return (
    <HomeScreenStack.Navigator screenOptions={{ headerTitle: "Home",
    headerTitleAlign: 'left',
    }}>
      <HomeScreenStack.Screen name={ROUTES.HOME} component={HomeScreen} options={{ headerLeft: () => (
      <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 10 }}>
        <Ionicons name="menu" size={30} color="black" />
      </TouchableOpacity>
    ),}}/>
      <HomeScreenStack.Screen name={ROUTES.TODO_INFORMATION} component={TodoInformation} 
      options={{
        headerTitle: "Todo Information",
        headerTitleAlign: 'center',
      }}/>
      <HomeScreenStack.Screen name={ROUTES.MEMO_SCREEN} component={MemoScreen}
      options={{
        headerTitle: "Memo",
        headerTitleAlign: 'center',
        headerBackTitle: 'Back',
      }}/>
      </HomeScreenStack.Navigator>
  );
};

const CommunityStackScreen = () => {
  const navigation = useNavigation();
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: true, 
      headerTitleAlign: 'left',
    }}>
      <ProfileStack.Screen name={ROUTES.COMMUNITY_MAIN} component={CommunityScreen} 
      options={{headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 10 }}>
          <Ionicons name="menu" size={30} color="black" />
        </TouchableOpacity>
      ),}}/> 
      <ProfileStack.Screen name={ROUTES.ADD_POST_SCREEN} component={AddPost} 
      options={{
        headerTitleAlign: 'center',
      }}/>
      <ProfileStack.Screen name={ROUTES.EDIT_POST_SCREEN} component={EditPost} 
      options={{
        headerTitleAlign: 'center',
        headerBackTitle: 'Back',
      }}/>
      <ProfileStack.Screen name={ROUTES.POST_INFORMATION} component={PostInformation} 
      options={{
        headerTitleAlign: 'center',
      }} />
    </ProfileStack.Navigator>
  );
};

const TimerStackScreen = () => {
  const navigation = useNavigation();
  return (
    <TimerStack.Navigator screenOptions={{
    headerTitleAlign: 'left',
    }}>
      <TimerStack.Screen name="Timer " component={Timer} options={{headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 10 }}>
          <Ionicons name="menu" size={30} color="black" />
        </TouchableOpacity>
      ),}} />
      <TimerStack.Screen name="History" component={TimerLogs} options={{
          headerTitle: "History",
          headerTitleAlign: 'center',
        }}/>
    </TimerStack.Navigator>
  );
};

const UserProfileStackScreen = () => {
  const navigation = useNavigation();
  return (
    <UserProfileStack.Navigator screenOptions={{
    headerTitleAlign: 'left',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 10 }}>
          <Ionicons name="menu" size={30} color="black" />
        </TouchableOpacity>
      ),
    }} >
      <UserProfileStack.Screen name="User Profile" component={UserProfile} />
      <UserProfileStack.Screen name="Settings" component={Settings}/>
      <UserProfileStack.Screen name="User Profile Settings" component={ProfileSettings} />
    </UserProfileStack.Navigator>
  );
};

  const TodoListStackScreen = () => {
    const navigation = useNavigation();
    return (
      <TodoListStack.Navigator>
        <TodoListStack.Screen name="Todo List " component={TodoList} options={{headerTitleAlign: 'left', headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 10 }}>
            <Ionicons name="menu" size={30} color="black" />
          </TouchableOpacity>
        ),}} />
      </TodoListStack.Navigator>
    );
  };


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
    <Drawer.Navigator initialRouteName="Home" screenOptions={{ headerShown: false}}>
      <Drawer.Screen name="Home" component={MainComponent} />
      <Drawer.Screen name="Todo List" component={TodoListStackScreen}  />
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

  const fetchCategoryColor = async (categoryName) => {
    const categoryDocRef = doc(FIREBASE_DB, 'constants', categoryName);

    try {
        const categoryDocSnapshot = await getDoc(categoryDocRef);
        if (categoryDocSnapshot.exists()) {
            return categoryDocSnapshot.data().color;
        } else {
            return 'beige';
        }
    } catch (error) {
        console.log('Error getting document:', error);
    }
};
  const handleTaskNameChange = (text) => {
    setTaskName(text);
  };

  const handleColorSelect = async (category) => {
    const color = await fetchCategoryColor(category);
    setSelectedColor(color);
  };

  const handleDayPress = (index) => {
    const updatedCheckboxes = checkboxes.map((checkbox, idx) => {
      if (idx === index) {
        return { ...checkbox, checked: !checkbox.checked };
      }
      return checkbox;
    });
  
    setCheckboxes(updatedCheckboxes);

  
    const updatedSelectedDays = updatedCheckboxes
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.day);
  
    setSelectedDays(updatedSelectedDays);
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

  const auth = FIREBASE_AUTH;
  const uid = auth.currentUser.uid;

  const getNextTwoMonthsDatesForDay = (day) => {
    const daysMap = {
      '일': 0,
      '월': 1,
      '화': 2,
      '수': 3,
      '목': 4,
      '금': 5,
      '토': 6,
    };
  
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(startDate.getMonth() + 1);  // Move 1 months into the future
    
    const dates = [];
    while (startDate <= endDate) {
      if (startDate.getDay() === daysMap[day]) {
        dates.push(new Date(startDate));  // Save a copy of the current date
      }
      startDate.setDate(startDate.getDate() + 1);  // Move to the next day
    }
    
    return dates;
  };

  function formatDateToYYYYMMDD(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    
    // JavaScript's getMonth() returns 0-11. Add 1 to get 1-12 and pad with 0 if needed
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Pad day with 0 if needed
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}.${month}.${day}`;
}

  //sending todo data to firebase
  const create = async (uid, categoryName) => {
    try {
      for (const day of selectedDays) {
        const datesForNextTwoMonths = getNextTwoMonthsDatesForDay(day);
        
        const parentId = uuid.v4();
        await setDoc(doc(FIREBASE_DB, 'todo-list', uid, "All", parentId), {
          categoryName: selectedCategory,
          categoryColor: selectedColor,
          categoryItems: taskName,
          categoryDays: [day],
          categoryId: parentId,
          createdAt: serverTimestamp(),
        });
        
        for (const date of datesForNextTwoMonths) {
          const uniqueId = uuid.v4();  
          
          // Data specific to category name path
          const childData = {
            categoryName: selectedCategory,
            categoryColor: selectedColor,
            categoryItems: taskName,
            categoryDays: [day],
            memo: '',  // Initialize it with an empty string or whatever default value you want
            date: formatDateToYYYYMMDD(date),
            isChecked: false,
            categoryId: uniqueId,
            parentId: parentId,
            createdAt: serverTimestamp(),
          };
          
          // Store under the categoryName path
          await setDoc(doc(FIREBASE_DB, 'todo-list', uid, categoryName, uniqueId), childData);
        }
      }
    } catch (error) {
      console.log("Error writing document: ", error);
    }
  };  

  const sendData = async () => {
    await create(uid, selectedCategory);
  };

  const handleSave = () => {  
    // Save the session details to the database
    if (!canSave()) return;
    togglePopup(); // Close the popup
    sendData();
    setSelectedDays([]); 
  };

  const canSave = () => {
    const isDaySelected = checkboxes.some(checkbox => checkbox.checked);
    return isDaySelected && taskName.trim() !== '';
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
        <Tab.Screen name={ROUTES.CALENDAR} component={CalendarStackScreen} />
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
                    onPress={() => [handleDayPress(index)]}
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
              <Text style={styles.popupText}>Category</Text>
              <Dropdown
                labelField="label"
                valueField="value"
                onChange={(item) => {
                  setSelectedCategory(item.label);
                  handleColorSelect(item.label);
                }}
                value={selectedCategory}
                placeholder=" Select category"
                style={{ width: 300, borderColor: 'black', borderWidth: 1, borderRadius: 10 }}
                data={data}
              />
              <TouchableOpacity style={styles.closeButton} onPress={togglePopup}>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveButton, !canSave() && styles.disabledSaveButton]} 
                onPress={handleSave} 
                disabled={!canSave()}
              >
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
    padding: 15,
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
  disabledSaveButton: {
    backgroundColor: '#ccc',
  }
});

export default BottomTabNavigator;
