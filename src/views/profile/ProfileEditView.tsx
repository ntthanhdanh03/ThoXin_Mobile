import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { DefaultStyles } from '../../styles/DefaultStyles';
import { Colors } from '../../styles/Colors';
import Header from '../components/Header';
import Spacer from '../components/Spacer';
import Input from '../components/Input';
import DateSelection from '../components/DateSelection';
import Selection from '../components/Selection';
import Button from '../components/Button';
import { scaleModerate } from '../../styles/scaleDimensions';
import { updateUserAction } from '../../store/actions/authAction';
import { GENDER } from '../../constants/Constants';
import moment from 'moment';
import Toast from 'react-native-root-toast';
import { showSuccessToast } from '../../utils/alertUtils';

const ProfileEditView: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { data: authData } = useSelector((store: any) => store.auth);

  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState<Date | null>(null);
  const [gender, setGender] = useState('');

  useEffect(() => {
    if (authData?.user) {
      setFullName(authData.user.fullName || '');
      setGender(authData.user.gender || '');
      if (authData.user.dateOfBirth) {
        setDob(new Date(authData.user.dateOfBirth));
      }
    }
  }, [authData?.user]);

  const handleSave = () => {
    if (!authData?.user?._id) return;

    dispatch(
      updateUserAction(
        {
          id: authData.user._id,
          updateData: {
            fullName,
            // gender,
            // dateOfBirth: dob ? moment(dob).format('YYYY-MM-DD') : null,
          },
        },
        (data: any, error: any) => {
          if (data) {
            showSuccessToast('Cập nhật thông tin cá nhân thành công');
          }
        },
      ),
    );
  };

  return (
    <SafeAreaView style={DefaultStyles.container}>
      <Header isBack title="Thông tin cá nhân" />
      <Spacer height={4} />

      <ScrollView style={[DefaultStyles.wrapBody, { flex: 1 }]}>
        <Text style={DefaultStyles.textBold12Black}>THÔNG TIN CƠ BẢN</Text>
        <Spacer height={10} />

        {/* Họ và tên */}
        <Input
          title="HỌ VÀ TÊN"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Nhập họ và tên"
        />
        <Spacer height={16} />

        <Spacer height={40} />
      </ScrollView>

      <Button
        title="Lưu"
        containerStyle={{ marginHorizontal: 16, marginBottom: 12 }}
        onPress={handleSave}
      />
    </SafeAreaView>
  );
};

export default ProfileEditView;

const styles = StyleSheet.create({});
