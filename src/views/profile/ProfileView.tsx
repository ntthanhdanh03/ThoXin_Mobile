import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Spacer from '../components/Spacer';
import { DefaultStyles } from '../../styles/DefaultStyles';
import { ic_arrow_right, ic_balence, img_default_avatar } from '../../assets';
import FastImage from 'react-native-fast-image';
import { scaleModerate } from '../../styles/scaleDimensions';
import { Colors } from '../../styles/Colors';
import LanguageView from '../components/LanguageView';
import { useNavigation } from '@react-navigation/native';
import VersionCheck from 'react-native-version-check';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  deleteInstallationAction,
  logoutAction,
} from '../../store/actions/authAction';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileView = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { data: authData } = useSelector((store: any) => store.auth);
  const navigation = useNavigation();
  const [showCameraOption, setShowCameraOption] = useState(false);
  const currentVersion = VersionCheck.getCurrentVersion();

  const handlePressLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    if (authData?.user?.deviceToken?.token) {
      dispatch(
        deleteInstallationAction({
          userId: authData?.user?._id,
          token: authData?.user?.deviceToken?.token,
        }),
      );
    }

    dispatch(logoutAction());
  };

  return (
    <SafeAreaView style={DefaultStyles.container} edges={['top']}>
      <Header
        title={t('Thông tin cá nhân')}
        renderRight={() => (
          <View
            style={{
              borderWidth: 1,
              borderColor: Colors.border01,
              borderRadius: 25,
            }}
          ></View>
        )}
      />

      <ScrollView style={[DefaultStyles.wrapBody, { flex: 1 }]}>
        <View style={{ alignItems: 'center' }}>
          <Spacer height={20} />
          <FastImage
            source={
              authData?.user?.avatarUrl
                ? { uri: authData?.user?.avatarUrl }
                : img_default_avatar
            }
            style={{
              height: scaleModerate(80),
              width: scaleModerate(80),
              borderRadius: 40,
            }}
          />
          <Spacer height={5} />
          <Text style={{ ...DefaultStyles.textBold16Black }}>
            {authData?.user?.fullName || 'Chưa cập nhật'}
          </Text>
          <Text
            style={{ ...DefaultStyles.textRegular16Black, color: '#344054' }}
          >
            {authData?.user?.phoneNumber}
          </Text>
          <Spacer height={20} />
        </View>
        <View>
          {authData && (
            <View>
              <TouchableOpacity
                style={styles.row}
                onPress={() => {
                  navigation.navigate('ProfileEditView' as never);
                }}
              >
                <Text style={styles.text}>{t('Thông tin cá nhân')}</Text>
                <FastImage
                  source={ic_arrow_right}
                  style={{ height: 24, width: 24 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.row}
                onPress={() => {
                  navigation.navigate('PromotionView' as never);
                }}
              >
                <Text style={styles.text}>{t('Mã khuyến mãi')}</Text>
                <FastImage
                  source={ic_arrow_right}
                  style={{ height: 24, width: 24 }}
                />
              </TouchableOpacity>

              {/* <TouchableOpacity
                style={styles.row}
                onPress={() => {
                  navigation.navigate('ChangePasswordView' as never);
                }}
              >
                <Text style={styles.text}>{t('Đổi mật khẩu')}</Text>
                <FastImage
                  source={ic_arrow_right}
                  style={{ height: 24, width: 24 }}
                />
              </TouchableOpacity> */}
            </View>
          )}

          <TouchableOpacity style={styles.row} onPress={handlePressLogout}>
            <Text style={styles.text}>{t('Đăng xuất')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Text
        style={[DefaultStyles.textRegular13Gray, { textAlign: 'center' }]}
      >{`v${currentVersion}`}</Text>
      <Spacer height={10} />
    </SafeAreaView>
  );
};

export default ProfileView;

const styles = StyleSheet.create({
  row: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    marginTop: 10,
  },
  iconRow: {
    height: scaleModerate(30),
    width: scaleModerate(30),
    borderRadius: scaleModerate(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: scaleModerate(18),
    width: scaleModerate(18),
  },
  rightIcon: {
    height: scaleModerate(24),
    width: scaleModerate(24),
  },
  text: {
    flex: 1,
    marginLeft: scaleModerate(10),
    ...DefaultStyles.textMedium14Black,
  },
  camera: {
    backgroundColor: Colors.blue11,
    position: 'absolute',
    bottom: 0,
    right: -5,
  },
});
