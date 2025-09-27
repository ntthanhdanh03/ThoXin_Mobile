import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTab from './BottomTab';
import RegisterNameView from '../views/auth/RegisterNameView';
import CreateOderView from '../views/home/CreateOderView';
import ChoseLocationView from '../views/home/ChoseLocationView';
import DetailActivityView from '../views/activity/DetailActivityView';
import ChatViewVer2 from '../views/chat/ChatViewVer2';

export type RootStackParamList = {
  BottomTab: undefined;
  RegisterNameView: undefined;
  CreateOderView: undefined;
  ChoseLocationView: {
    onSelectAddress: (addr: string, lng: string, lat: string) => void;
  };
  DetailActivityView: { item: any };
  ChatViewVer2: { dataRoomChat: any };
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
    </InStack.Navigator>
  );
};

export default InsideStack;
