import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, ROUTES} from '../../constants';

import Logo from '../../assets/icons/LOGO.svg';
import {FIREBASE_AUTH} from '../../config/firebase';
import { Button } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';



// Inside the component

const Login = (props) => {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      alert("Login Success");
      navigation.replace(ROUTES.HOME);
    } catch (error) {
      console.log(error);
      alert("Login Failed" + error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email,password);
      console.log(response);
      alert("Sign Up Success");
    } catch (error) {
      console.log(error);
      alert("Sign Up Failed");
    } finally {
      setLoading(false);
    }
  };

  const {navigation} = props;
  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.container}>
        <View style={styles.wFull}>
          <View style={styles.row}>
            <Logo width={60} height={55} style={styles.mr7} />
             {/* <SvgUri  width={55} height={55} uri={require('../../assets/icons/LOGO.svg')} style={styles.mr7}/> */}
            <Text style={styles.brandName}>Rough</Text>
          </View>

          <Text style={styles.loginContinueTxt}>Login in to continue</Text>
          <TextInput style={styles.input} value={email} placeholder="Email" autoCapitalize="none" onChangeText={(text) => setEmail(text)} />
          <TextInput secureTextEntry={true}
          style={styles.input} value={password} placeholder="Password" autoCapitalize="none" onChangeText={(text) => setPassword(text)}/>

          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <>
              <Button title="Sign In" onPress={signIn} />
              <Button title="Sign Up" onPress={signUp} />
            </>
          )}

          <View style={styles.loginBtnWrapper}>
            <LinearGradient
              colors={[COLORS.gradientForm, COLORS.primary]}
              style={styles.linearGradient}
              start={{y: 0.0, x: 0.0}}
              end={{y: 1.0, x: 0.0}}>
              {/******************** LOGIN BUTTON *********************/}
              <TouchableOpacity activeOpacity={0.7} style={styles.loginBtn}
              onPress={signIn}>
                <Text style={styles.loginText}>Log In</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/***************** FORGOT PASSWORD BUTTON *****************/}
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.FORGOT_PASSWORD, {
            userID: "UserId123",
          })
        }
          style={styles.forgotPassBtn}>
            <Text style={styles.forgotPassText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}> Don't have an account? </Text>
          {/******************** REGISTER BUTTON *********************/}
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.REGISTER)}>
            <Text style={styles.signupBtn}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    padding: 15,
    width: '100%',
    position: 'relative',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 42,
    textAlign: 'center',
    fontWeight: 'bold',
    color: COLORS.primary,
    opacity: 0.9,
  },
  loginContinueTxt: {
    fontSize: 21,
    textAlign: 'center',
    color: COLORS.gray,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    backgroundColor: COLORS.grayLight,  
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    height: 55,
    paddingVertical: 0,
  },
  // Login Btn Styles
  loginBtnWrapper: {
    height: 55,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  linearGradient: {
    width: '100%',
    borderRadius: 50,
  },
  loginBtn: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 55,
  },
  loginText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '400',
  },
  forgotPassText: {
    color: COLORS.primary,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 15,
  },
  // footer
  footer: {
    position: 'absolute',
    bottom: 20,
    textAlign: 'center',
    flexDirection: 'row',
  },
  footerText: {
    color: COLORS.gray,
    fontWeight: 'bold',
  },
  signupBtn: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  // utils
  wFull: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  mr7: {
    marginRight: 7,
  },
});