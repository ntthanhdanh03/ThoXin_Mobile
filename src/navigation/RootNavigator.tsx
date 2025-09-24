import { AppState, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import OutsideStack from './OutsideStack';
import { navigationRef } from './NavigationService';
import InsideStack from './InsideStack';
import { useDispatch, useSelector } from 'react-redux';
import {
  createInstallationAction,
  refreshTokenAction,
} from '../store/actions/authAction';
import {
  getFCMToken,
  initNotificationConfig,
} from '../utils/notificationUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();
const RootNavigator = () => {
  const dispatch = useDispatch();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const { data: authData } = useSelector((store: any) => store.auth);
  const [prevUserState, setPrevUserState] = useState<any>(null);

  useEffect(() => {
    const bootstrap = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        dispatch(
          refreshTokenAction(
            { refreshToken: token },
            async (data: any, error?: any) => {
              if (data) {
                setIsAuthChecked(true);
              } else {
                await AsyncStorage.removeItem('authToken');
                setIsAuthChecked(true);
              }
            },
          ),
        );
      } else {
        setIsAuthChecked(true);
      }
    };
    bootstrap();
  }, []);

  useEffect(() => {
    if (authData) {
      if (prevUserState === null) {
        initNotificationConfig((installationData: any) => {
          handleCreateInstallation(authData, installationData);
          // SocketUtil.connect(authData?.user?._id)
          // return () => {
          //     SocketUtil.disconnect()
          // }
        });
      }
    }
    setPrevUserState(authData);
  }, [authData]);

  const handleCreateInstallation = async (
    userData: any,
    installationData: any,
  ) => {
    if (
      installationData?.token &&
      userData?.user?.deviceToken !== installationData?.token
    ) {
      const fcmToken = await getFCMToken();
      dispatch(
        createInstallationAction({
          userId: userData?.user?._id,
          deviceToken: {
            token: installationData?.token,
            osVersion: installationData?.os,
            fcmToken: fcmToken,
          },
        }),
      );
    }
  };
  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'none',
          }}
        >
          <>
            {authData ? (
              <Stack.Screen name="InsideStack" component={InsideStack} />
            ) : (
              <Stack.Screen name="OutsideStack" component={OutsideStack} />
            )}
          </>
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default RootNavigator;

const styles = StyleSheet.create({});
