// import React from 'react';
// import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

// const Login = (navigation) => {
//   return (
//     <SafeAreaView
//       // eslint-disable-next-line react-native/no-inline-styles
//       style={{
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//       }}>
//       <Text>Login</Text>
//     </SafeAreaView>
//   );
// };

// export default Login;

// const styles = StyleSheet.create({});

import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { ROUTES } from '../../constants';

const Login = (navigation) => {
    <View style={styles.container}>
        <Text> Login Screen </Text>
        <Button title="Go to Details" onPress={() => alert('Button is initiated')} />
    </View>


    return (
        console.log(3),
        console.log(ROUTES),
        nav = ROUTES.default.FORGOT_PASSWORD,
        console.log(nav),
        <View style={styles.container}>
            <Text> Login Screen </Text>
            <Button title="Forgot Password?" onPress={() => navigation.navigate(nav)} />
            <Button title="Go back" onPress={() => navigation.goBack()} />

        </View>
    );

};

export default Login;  

const styles = StyleSheet.create({  
    container: { 
        flex: 1,    
        alignItems: 'center',   
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
});