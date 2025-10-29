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
import AppointmentInProgressView from '../views/appointment/AppointmentInProgressView';
import PromotionView from '../views/profile/PromotionView';
import ProfileEditView from '../views/profile/ProfileEditView';
import DetailApplicantView from '../views/activity/DetailApplicantView';
import RNBootSplash from 'react-native-bootsplash';

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
  AppointmentInProgressView: undefined;
  PromotionView: undefined;
  ProfileEditView: undefined;
  DetailApplicantView: { applicantData: any };
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
      <InStack.Screen name="ProfileEditView" component={ProfileEditView} />

      <InStack.Screen name="ChatViewVer2" component={ChatViewVer2} />
      <InStack.Screen name="AppointmentView" component={AppointmentView} />
      <InStack.Screen
        name="AppointmentInProgressView"
        component={AppointmentInProgressView}
      />
      <InStack.Screen name="PromotionView" component={PromotionView} />
      <InStack.Screen
        name="DetailApplicantView"
        component={DetailApplicantView}
      />
    </InStack.Navigator>
  );
};

export default InsideStack;
