import { createStackNavigator } from "@react-navigation/stack";
import ROUTES from "../constants/routes";
import ForgotPassword from "../screens/auth/ForgotPassword";
import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";

import CalendarScreen from "../screens/home/CalendarScreen";
// import BottomTabNavigator from "./BottomTabNavigator";
import TimerScreen from "../screens/home/TimerScreen";
import { Text } from 'react-native';
import HomeScreen from "../screens/home/HomeScreen";

const Stack = createStackNavigator();

function AuthNavigator(navigation) {
    console.log(4),
    console.log(ROUTES.FORGOT_PASSWORD)
    return (
    <Stack.Navigator initialRouteName={ROUTES.LOGIN} 
    screenOptions={ {
        headerTintColor: 'black',
        headerStyle: {
            backgroundColor: 'green',
        }
    }
    } >
    <Stack.Screen name={ROUTES.FORGOT_PASSWORD} component={ForgotPassword} />
      <Stack.Screen name={ROUTES.LOGIN}  component={Login}/>
      <Stack.Screen name={ROUTES.HOME_TAB}  component={TimerScreen} />
      <Stack.Screen name={ROUTES.REGISTER} component={Register} />
      {/* <Stack.Screen name={ROUTES.HOME} component={BottomTabNavigator} /> */}
    </Stack.Navigator>
    // <Text>AuthNavigator</Text>  
  );
}   

export default AuthNavigator;
