import React, { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DefaultStyles } from '../../styles/DefaultStyles';
import Header from '../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/InsideStack';

const AppointmentView = ({ route }: any) => {
  const { item } = route.params;
  const dispatch = useDispatch();
  const { data: orderData } = useSelector((store: any) => store.order);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={DefaultStyles.container}>
      <Header isBack title="Cuộc hẹn" />
    </SafeAreaView>
  );
};

export default AppointmentView;

const styles = StyleSheet.create({});
