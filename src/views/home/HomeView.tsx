import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { DefaultStyles } from '../../styles/DefaultStyles';
import { Colors } from '../../styles/Colors';
import { img_default_avatar } from '../../assets';
import Spacer from '../components/Spacer';
import { scaleModerate } from '../../styles/scaleDimensions';
import { getLocationPartnerAction } from '../../store/actions/locationAction';
import Input from '../components/Input';

const HomeView = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { data: authData } = useSelector((store: any) => store.auth);
  const { data: appointmentData } = useSelector(
    (store: any) => store.appointment,
  );
  const [showCard, setShowCard] = useState(false);

  const appointmentInProgress = appointmentData?.appointmentInProgress?.[0];

  useEffect(() => {
    if (appointmentInProgress) setShowCard(true);
  }, [appointmentInProgress]);

  const handleContinue = () => {
    navigation.navigate(...([`AppointmentInProgressView`] as never));
  };

  const handleNavigation = (type: string) => {
    navigation.navigate(
      ...(['CreateOderView', { typeService: type }] as never),
    );
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return 'Thợ đang di chuyển đến';
      case 2:
        return 'Đang kiểm tra lần cuối';
      case 3:
        return 'Đang sửa chữa';
      case 4:
        return 'Bàn giao cho khách kiểm tra';
      case 5:
        return 'Chờ thanh toán';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={DefaultStyles.container}>
      <ScrollView style={[{ flex: 1 }, DefaultStyles.wrapBody]}>
        <View style={styles.headerBox}>
          <FastImage
            style={styles.avatar}
            source={
              authData?.user?.avatarUrl
                ? { uri: authData.user.avatarUrl }
                : img_default_avatar
            }
          />
          <Spacer width={10} />
          <Text style={DefaultStyles.textBold14Black}>
            Xin chào {authData?.user?.fullName}
          </Text>
        </View>

        <Spacer height={20} />

        <Text style={DefaultStyles.textBold16Black}>Dịch vụ</Text>
        <View style={styles.menuRow}>
          <MenuItem
            label="Điện"
            onPress={() => handleNavigation('electricity')}
          />
          <MenuItem label="Nước" onPress={() => handleNavigation('water')} />
          <MenuItem
            label="Điện lạnh"
            onPress={() => handleNavigation('air_conditioning')}
          />
          <MenuItem
            label="Khóa"
            onPress={() => handleNavigation('locksmith')}
          />
        </View>

        <Spacer height={120} />
      </ScrollView>

      {showCard && appointmentInProgress && (
        <View style={styles.bottomCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Cuộc hẹn đang xử lý</Text>
            <Text style={styles.cardText}>
              Dịch vụ:{' '}
              {appointmentInProgress?.orderId?.service || 'Không xác định'}
            </Text>
            <Text style={styles.cardText}>
              Trạng thái: {getStatusText(appointmentInProgress?.status)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.cardButton}
            onPress={() => handleContinue()}
          >
            <Text style={styles.cardButtonText}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const MenuItem = ({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.menuIcon} />
    <Text style={styles.menuText}>{label}</Text>
  </TouchableOpacity>
);

export default HomeView;

const styles = StyleSheet.create({
  headerBox: {
    width: '100%',
    borderWidth: 1,
    height: scaleModerate(50),
    alignSelf: 'center',
    borderRadius: 6,
    padding: 10,
    flexDirection: 'row',
    borderColor: Colors.border01,
    alignItems: 'center',
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 20,
  },
  menuRow: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  menuItem: {
    alignItems: 'center',
    width: '25%',
  },
  menuIcon: {
    height: 44,
    width: 44,
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  menuText: {
    paddingTop: 5,
    textAlign: 'center',
    ...DefaultStyles.textBold12Black,
  },

  bottomCard: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 15,
    color: Colors.primary,
  },
  cardText: {
    fontSize: 13,
    color: '#333',
    marginTop: 2,
  },
  cardButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginLeft: 10,
  },
  cardButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});
