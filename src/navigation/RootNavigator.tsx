import { useState, useEffect } from 'react';
import { AppState, DeviceEventEmitter, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import {
  getMessaging,
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { navigationRef } from './NavigationService';
import OutsideStack from './OutsideStack';
import InsideStack from './InsideStack';
import NotificationModal from './NotificationModal';

import {
  createInstallationAction,
  refreshTokenAction,
} from '../store/actions/authAction';
import {
  getChatRoomByOrderAction,
  getMessageAction,
} from '../store/actions/chatAction';
import { getOrderAction } from '../store/actions/orderAction';
import { getAppointmentAction } from '../store/actions/appointmentAction';
import { getLocationPartnerAction } from '../store/actions/locationAction';

import {
  getFCMToken,
  initNotificationConfig,
} from '../utils/notificationUtils';
import SocketUtil from '../utils/socketUtil';
import '../utils/appStateUtil';
import RatingModal from './RatingModal';
import CallModal, { CallModalComponent } from './CallModal';

const Stack = createNativeStackNavigator();

interface NotificationState {
  title?: string;
  message?: string;
  visible: boolean;
}

const RootNavigator = () => {
  const dispatch = useDispatch();
  const { data: authData } = useSelector((store: any) => store.auth);

  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [notif, setNotif] = useState<NotificationState>({ visible: false });
  const [prevUserState, setPrevUserState] = useState<any>(null);

  const [ratingVisible, setRatingVisible] = useState(false);
  const [ratingData, setRatingData] = useState<any>();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          dispatch(
            refreshTokenAction(
              { refreshToken: token },
              (data: any, error?: any) => {
                if (!data) {
                  AsyncStorage.removeItem('authToken');
                }
                setIsAuthChecked(true);
              },
            ),
          );
        } else {
          setIsAuthChecked(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthChecked(true);
      }
    };

    checkAuth();
  }, [dispatch]);

  const handleOrder = (clientId: string) => {
    dispatch(
      getOrderAction({ clientId }, (orders: any[], error?: any) => {
        if (!orders) return;

        const pendingOrder = orders.find(order => order.status === 'pending');
        if (pendingOrder) {
          const { _id: orderId } = pendingOrder;
          dispatch(getChatRoomByOrderAction({ _orderId: orderId }));
          dispatch(getMessageAction({ _orderId: orderId }));
        }
      }),
    );
  };

  useEffect(() => {
    const listeners = [
      {
        name: 'order_addApplicant',
        handler: (data: any) => handleOrder(data),
      },
      {
        name: 'appointment_updated',
        handler: (data: any) => {
          dispatch(getAppointmentAction({ clientId: data.clientId }));
        },
      },

      {
        name: 'chat.newMessage',
        handler: (event: any) => {
          dispatch(getMessageAction({ _orderId: event.orderId }));
        },
      },
      {
        name: 'partner.locationUpdate',
        handler: (event: any) => {
          dispatch(getLocationPartnerAction({ partnerId: event.partnerId }));
        },
      },

      {
        name: 'appointment.updateComplete',
        handler: (event: any) => {
          dispatch(
            getAppointmentAction(
              { clientId: event?.appointment?.clientId },
              (data: any) => {
                if (data) {
                  setRatingData(event?.appointment);
                  setRatingVisible(true);
                }
              },
            ),
          );
          handleOrder(event?.appointment?.clientId);
        },
      },

      {
        name: 'call.incoming',
        handler: (data: any) => {
          console.log('call.incoming', data);
          CallModal.show({
            type: 'incoming',
            role_Receiver: 'client',

            from_userId: data.from_userId,
            form_name: data?.form_name,
            form_avatar: data?.form_name,
            to_userId: data.to_userId,
          });
        },
      },
      {
        name: 'call.request_cancel',
        handler: (data: any) => {
          console.log('call.request_cancel', data);
          CallModal.hide();
        },
      },
      {
        name: 'call.declined',
        handler: (data: any) => {
          console.log('call.declined', data);
          CallModal.hide();
        },
      },
      {
        name: 'call.ended',
        handler: (data: any) => {
          console.log('call.ended', data);
          CallModal.hide();
        },
      },
    ];

    const subscriptions = listeners.map(({ name, handler }) =>
      DeviceEventEmitter.addListener(name, handler),
    );

    return () => subscriptions.forEach(sub => sub.remove());
  }, [dispatch]);

  useEffect(() => {
    if (!authData) return;
    if (prevUserState !== null) return;
    const userId = authData?.user?._id;
    initNotificationConfig((installationData: any) => {
      handleCreateInstallation(authData, installationData);
      SocketUtil.connect(userId, 'client');
      getMessaging().onMessage(
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

    handleOrder(userId);
    dispatch(getAppointmentAction({ clientId: userId }));

    setPrevUserState(authData);
  }, [authData, dispatch]);

  useEffect(() => {
    const userId = authData?.user?._id;
    if (!userId) return;

    const handleForeground = () => {
      if (authData) {
        dispatch(getAppointmentAction({ clientId: userId }));
        handleOrder(userId);
      }
    };

    const subForeground = DeviceEventEmitter.addListener(
      'APP_FOREGROUND',
      handleForeground,
    );

    const subBackground = DeviceEventEmitter.addListener(
      'APP_BACKGROUND',
      () => {},
    );

    return () => {
      subForeground.remove();
      subBackground.remove();
    };
  }, [authData, dispatch]);

  const handleCreateInstallation = async (
    userData: any,
    installationData: any,
  ) => {
    if (
      !installationData?.token ||
      userData?.user?.deviceToken === installationData?.token
    ) {
      return;
    }

    const fcmToken = await getFCMToken();
    dispatch(
      createInstallationAction({
        userId: userData?.user?._id,
        deviceToken: {
          token: installationData?.token,
          osVersion: installationData?.os,
          fcmToken,
        },
      }),
    );
  };

  if (!isAuthChecked) {
    return null;
  }

  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'none',
          }}
        >
          {authData ? (
            <Stack.Screen name="InsideStack" component={InsideStack} />
          ) : (
            <Stack.Screen name="OutsideStack" component={OutsideStack} />
          )}
        </Stack.Navigator>
      </NavigationContainer>

      <RatingModal
        visible={ratingVisible}
        data={ratingData}
        onClose={() => setRatingVisible(false)}
      />

      <NotificationModal
        visible={notif.visible}
        title={notif.title}
        message={notif.message}
        onHide={() => setNotif(prev => ({ ...prev, visible: false }))}
      />

      <CallModalComponent ref={ref => CallModal.setRef(ref)} />
    </>
  );
};

export default RootNavigator;
