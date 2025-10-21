import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import AppointmentInProgress1View from './AppointmentInProgress1View';
import AppointmentInProgress2View from './AppointmentInProgress2View';
import AppointmentInProgress3View from './AppointmentInProgress3View';
import AppointmentInProgress4View from './AppointmentInProgress4View';
import AppointmentInProgress5View from './AppointmentInProgress5View';
import LoadingView from '../components/LoadingView';

const AppointmentInProgressView = () => {
  const { data: appointmentData } = useSelector(
    (store: any) => store.appointment,
  );
  const appointmentInProgress = appointmentData?.appointmentInProgress?.[0];
  const navigation = useNavigation();

  useEffect(() => {
    if (!appointmentInProgress) {
      navigation.navigate('BottomTab' as never);
    }
  }, [appointmentInProgress, navigation]);

  if (!appointmentInProgress) return <LoadingView loading={true} />;

  const status = appointmentInProgress.status;

  const statusMap: { [key: number]: React.ReactNode } = {
    1: <AppointmentInProgress1View />,
    2: <AppointmentInProgress2View />,
    3: <AppointmentInProgress3View />,
    4: <AppointmentInProgress4View />,
    5: <AppointmentInProgress5View />,
  };

  return <View style={styles.container}>{statusMap[status] || null}</View>;
};

export default AppointmentInProgressView;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
