import { ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { DefaultStyles } from '../../styles/DefaultStyles';
import Spacer from '../components/Spacer';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../styles/Colors';
import { scaleModerate } from '../../styles/scaleDimensions';
import Header from '../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import {
  partnerRegisterAction,
  updateUserAction,
} from '../../store/actions/authAction';
import GlobalModalController from '../components/GlobalModal/GlobalModalController';

const RegisterNameView = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { data: authData } = useSelector((store: any) => store.auth);
  const [name, setName] = useState('');

  const handleNext = () => {
    dispatch(
      updateUserAction(
        {
          id: authData?.user?._id,
          updateData: {
            fullName: name,
          },
        },
        (data: any, error: any) => {
          if (data) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'BottomTab' } as never],
            });
          }
        },
      ),
    );
  };

  return (
    <SafeAreaView style={DefaultStyles.container}>
      <View style={[DefaultStyles.wrapBody, { flex: 1, padding: 16 }]}>
        <Text style={[DefaultStyles.textBold16Black]}>
          Vui lòng nhập tên của bạn
        </Text>
        <Spacer height={10} />
        <TextInput
          style={styles.input}
          placeholder="Nhập tên..."
          value={name}
          onChangeText={setName}
        />

        <Spacer height={20} />
      </View>
      <Button
        title="Tiếp tục"
        onPress={handleNext}
        disable={name.length < 6}
        containerStyle={{ marginHorizontal: 10 }}
      />
    </SafeAreaView>
  );
};

export default RegisterNameView;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1.5,
    borderColor: Colors.black01,
    borderRadius: 20,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
});
