import { AppState, DeviceEventEmitter, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import OutsideStack from './OutsideStack';
import { navigationRef } from './NavigationService';
import InsideStack from './InsideStack';
import { useDispatch, useSelector } from 'react-redux';
import {
  FirebaseMessagingTypes,
  getMessaging,
} from '@react-native-firebase/messaging';
import {
  createInstallationAction,
  refreshTokenAction,
} from '../store/actions/authAction';
import {
  getFCMToken,
  initNotificationConfig,
} from '../utils/notificationUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getOrderAction } from '../store/actions/orderAction';
import SocketUtil from '../utils/socketUtil';
import NotificationModal from './NotificationModal';

const Stack = createNativeStackNavigator();
const RootNavigator = () => {
  const dispatch = useDispatch();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const { data: authData } = useSelector((store: any) => store.auth);
  const [prevUserState, setPrevUserState] = useState<any>(null);
  const [notif, setNotif] = useState<{
    title?: string;
    message?: string;
    visible: boolean;
  }>({
    visible: false,
  });

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
    const events = [
      { name: 'connect', handler: () => console.log('CONNECT') },
      { name: 'disconnect', handler: () => console.log('DISCONNECT') },
      {
        name: 'order_addApplicant',
        handler: () => console.log('order_addApplicant'),
      },
    ];
    const subscriptions = events.map(e =>
      DeviceEventEmitter.addListener(e.name, e.handler),
    );

    return () => {
      subscriptions.forEach(sub => sub.remove());
    };
  }, []);

  useEffect(() => {
    if (authData) {
      if (prevUserState === null) {
        initNotificationConfig((installationData: any) => {
          handleCreateInstallation(authData, installationData);
          SocketUtil.connect(authData?.user?._id, 'client');
          const unsubscribe = getMessaging().onMessage(
            (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
              console.log('Foreground notification:', remoteMessage);
              setNotif({
                visible: true,
                title: remoteMessage.notification?.title,
                message: remoteMessage.notification?.body,
              });
            },
          );
        });

        dispatch(getOrderAction({}));
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
      <NotificationModal
        visible={notif.visible}
        title={notif.title}
        message={notif.message}
        onHide={() => setNotif({ ...notif, visible: false })}
      />
    </>
  );
};

export default RootNavigator;

const styles = StyleSheet.create({});
