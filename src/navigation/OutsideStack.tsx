import { StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginView from '../views/auth/LoginView';
import LoginViewPW from '../views/auth/LoginViewPW';
import ForgotPasswordView from '../views/auth/ForgotPasswordView';
import ResetPasswordView from '../views/auth/ResetPasswordView';
import RegisterOTPView from '../views/auth/RegisterOTPView';
import NewPasswordView from '../views/auth/NewPasswordView';
import RNBootSplash from 'react-native-bootsplash';

const OutStack = createNativeStackNavigator();
const OutsideStack = () => {
  useEffect(() => {
    //RNBootSplash.hide({ fade: true });
  }, []);
  return (
    <OutStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <OutStack.Screen name="LoginView" component={LoginView} />
      <OutStack.Screen name="LoginViewPW" component={LoginViewPW} />
      <OutStack.Screen name="RegisterOTPView" component={RegisterOTPView} />
      <OutStack.Screen name="NewPasswordView" component={NewPasswordView} />

      <OutStack.Screen
        name="ForgotPasswordView"
        component={ForgotPasswordView}
      />
      <OutStack.Screen name="ResetPasswordView" component={ResetPasswordView} />
    </OutStack.Navigator>
  );
};

export default OutsideStack;

const styles = StyleSheet.create({});
