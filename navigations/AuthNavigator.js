import { createStackNavigator } from "@react-navigation/stack";
import ROUTES from "../constants/routes";
import ForgotPassword from "../screens/auth/ForgotPassword";
import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";
import { useNavigation } from "@react-navigation/native";
import BottomTabNavigator from "./BottomTabNavigator";

import COLORS from "../constants/colors";
import HomeScreen from "../screens/home/HomeScreen";

const Stack = createStackNavigator();

function AuthNavigator() {
    const navigation = useNavigation();
    return (
    <Stack.Navigator initialRouteName={ROUTES.LOGIN} 
    screenOptions={ {
        headerTintColor: COLORS.white,
        headerBackTitleVisible: false,
        headerStyle: {
            backgroundColor: COLORS.primary,
        }
    }
    } >
    <Stack.Screen 
    name={ROUTES.FORGOT_PASSWORD} 
    component={ForgotPassword} 
    options={ ({route}) => ({
        title: route.params.userID,
    }) }
    />
      <Stack.Screen name={ROUTES.LOGIN}  component={Login}/>
      <Stack.Screen name={ROUTES.REGISTER} component={Register} />
      <Stack.Screen name={ROUTES.HOME} component={BottomTabNavigator} />
    </Stack.Navigator>
  );
}   

export default AuthNavigator;
