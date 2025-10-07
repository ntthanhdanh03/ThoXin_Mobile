import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTab from './BottomTab';
import RegisterNameView from '../views/auth/RegisterNameView';
import CreateOderView from '../views/home/CreateOderView';
import ChoseLocationView from '../views/home/ChoseLocationView';
import DetailActivityView from '../views/activity/DetailActivityView';
import ChatViewVer2 from '../views/chat/ChatViewVer2';
import AppointmentView from '../views/activity/AppointmentView';
import AppointmentInProgress1View from '../views/appointment/AppointmentInProgress1View';
import AppointmentInProgress2View from '../views/appointment/AppointmentInProgress2View';
import AppointmentInProgress3View from '../views/appointment/AppointmentInProgress3View';
import AppointmentInProgress4View from '../views/appointment/AppointmentInProgress4View';
import AppointmentInProgress5View from '../views/appointment/AppointmentInProgress5View';

export type RootStackParamList = {
  BottomTab: undefined;
  RegisterNameView: undefined;
  CreateOderView: undefined;
  ChoseLocationView: {
    onSelectAddress: (addr: string, lng: string, lat: string) => void;
  };
  DetailActivityView: { item: any };
  ChatViewVer2: { dataRoomChat: any };
  AppointmentView: {};
  AppointmentInProgress1View: undefined;
  AppointmentInProgress2View: undefined;
  AppointmentInProgress3View: undefined;
  AppointmentInProgress4View: undefined;
  AppointmentInProgress5View: undefined;
};

const InStack = createNativeStackNavigator<RootStackParamList>();

const InsideStack = () => {
  const { data: authData } = useSelector((store: any) => store.auth);
  const [initialRoute, setInitialRoute] = useState<
    keyof RootStackParamList | null
  >(null);

  useEffect(() => {
    if (authData?.user.fullName && authData?.user.fullName.trim().length > 0) {
      setInitialRoute('BottomTab');
    } else {
      setInitialRoute('RegisterNameView');
    }
  }, [authData]);

  if (!initialRoute) return null;

  return (
    <InStack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
      }}
    >
      <InStack.Screen name="BottomTab" component={BottomTab} />
      <InStack.Screen name="RegisterNameView" component={RegisterNameView} />
      <InStack.Screen name="CreateOderView" component={CreateOderView} />
      <InStack.Screen name="ChoseLocationView" component={ChoseLocationView} />
      <InStack.Screen
        name="DetailActivityView"
        component={DetailActivityView}
      />
      <InStack.Screen name="ChatViewVer2" component={ChatViewVer2} />
      <InStack.Screen name="AppointmentView" component={AppointmentView} />
      <InStack.Screen
        name="AppointmentInProgress1View"
        component={AppointmentInProgress1View}
      />
      <InStack.Screen
        name="AppointmentInProgress2View"
        component={AppointmentInProgress2View}
      />
      <InStack.Screen
        name="AppointmentInProgress3View"
        component={AppointmentInProgress3View}
      />
      <InStack.Screen
        name="AppointmentInProgress4View"
        component={AppointmentInProgress4View}
      />
      <InStack.Screen
        name="AppointmentInProgress5View"
        component={AppointmentInProgress5View}
      />
    </InStack.Navigator>
  );
};

export default InsideStack;
