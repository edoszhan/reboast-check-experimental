import { createStackNavigator } from "@react-navigation/stack";
import ROUTES from "../constants/routes";
import ForgotPassword from "../screens/auth/ForgotPassword";
import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";
import Register2  from "../screens/auth/Register2";
import BottomTabNavigator from "./BottomTabNavigator";
import COLORS from "../constants/colors";
import { User } from "../config/firebase"
import { FIREBASE_AUTH } from "../config/firebase";
import { useState, useEffect} from "react";
import { onAuthStateChanged } from "firebase/auth";
const Stack = createStackNavigator();
const RegisterStack = createStackNavigator();

const RegisterStackNavigator = () => {
  return (
    <RegisterStack.Navigator
      initialRouteName="Register Step1"
      screenOptions={{ headerShown: false }} // Assuming you want to hide the header, adjust as necessary
    >
      <RegisterStack.Screen name="Register" component={Register} />
      <RegisterStack.Screen name="Register2" component={Register2} />
    </RegisterStack.Navigator>
  );
};

function AuthNavigator() {
    const [user, setUser] = useState(User);
    useEffect(() => {
      onAuthStateChanged(FIREBASE_AUTH, (user) => {
        console.log('user',user);
        setUser(user);
      });
    }, []);


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
      {user ? (
        <Stack.Screen name={ROUTES.HOME} component={BottomTabNavigator} options={{headerShown: false }}  />
      ) : (
        <>
        <Stack.Screen name={ROUTES.LOGIN} component={Login} 
                    options={ ({route}) => ({
                      title: " ",
                  }) }
        />
        {/* <Stack.Screen name={ROUTES.REGISTER} component={Register}
        options={ ({route}) => ({
          title: "Register - Step 1",
      }) }
        /> */}
        <Stack.Screen name="Register" component={RegisterStackNavigator} />
        </>
      )} 
    <Stack.Screen 
    name={ROUTES.FORGOT_PASSWORD} 
    component={ForgotPassword} 
    options={ ({route}) => ({
        title: " ",
    }) }
    />
    </Stack.Navigator>
  );
}   

export default AuthNavigator;
