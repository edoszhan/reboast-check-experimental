import { createStackNavigator } from "@react-navigation/stack";
import ROUTES from "../constants/routes";
import ForgotPassword from "../screens/auth/ForgotPassword";
import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";
import BottomTabNavigator from "./BottomTabNavigator";
import COLORS from "../constants/colors";
import { User } from "../config/firebase"
import { FIREBASE_AUTH } from "../config/firebase";
import { useState } from "react";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

const Stack = createStackNavigator();

// const InsideStack = createNativeStackNavigator();

// function InsideLayout () {
//   return (
//     <InsideStack.Navigator>
//       <InsideStack.Screen name={ROUTES.TIMER} component={Timer} />
//     </InsideStack.Navigator>
//   );
// }

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
        // <Stack.Screen name={ROUTES.LOGIN}  component={Login} options={{headerShown: true }}/>
        <Stack.Screen name={ROUTES.HOME} component={BottomTabNavigator} options={{headerShown: false }}  />
      ) : (
        <>
        <Stack.Screen name={ROUTES.LOGIN}  component={Login} options={{headerShown: true }}/>
        <Stack.Screen name={ROUTES.REGISTER} component={Register} />
        {/* <Stack.Screen name={ROUTES.SETTINGS} component={Settings} options={{headerShown: false }}  /> */}
        </>
      )} 
    <Stack.Screen 
    name={ROUTES.FORGOT_PASSWORD} 
    component={ForgotPassword} 
    options={ ({route}) => ({
        title: route.params.userID,
    }) }
    />
      {/* <Stack.Screen name={ROUTES.LOGIN}  component={Login}/> */}
      {/* <Stack.Screen name={ROUTES.REGISTER} component={Register} /> */}
      {/* <Stack.Screen name={ROUTES.HOME} component={BottomTabNavigator} /> */}
    </Stack.Navigator>
  );
}   

export default AuthNavigator;
