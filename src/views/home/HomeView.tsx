import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { DefaultStyles } from '../../styles/DefaultStyles';
import { Colors } from '../../styles/Colors';
import {
  banner_1,
  banner_2,
  ic_air_conditioning,
  ic_electricity,
  ic_locksmith,
  ic_water,
  img_default_avatar,
} from '../../assets';
import Spacer from '../components/Spacer';
import { scaleModerate } from '../../styles/scaleDimensions';
import { getLocationPartnerAction } from '../../store/actions/locationAction';
import Input from '../components/Input';
import { SwiperFlatList } from 'react-native-swiper-flatlist';

const { width } = Dimensions.get('window');

const HomeView = () => {
  const images = [banner_1, banner_2];

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
        <Spacer height={16} />
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
          <View>
            <Text style={DefaultStyles.textMedium16Black}>Xin Chào !</Text>
            <Text style={DefaultStyles.textMedium16Black}>
              {authData?.user?.fullName}
            </Text>
          </View>
        </View>

        <Spacer height={20} />

        <Text style={DefaultStyles.textBold16Black}>Dịch vụ</Text>
        <View style={styles.menuRow}>
          <MenuItem
            label="Điện"
            onPress={() => handleNavigation('electricity')}
            icon={ic_electricity}
          />
          <MenuItem
            label="Nước"
            onPress={() => handleNavigation('water')}
            icon={ic_water}
          />
          <MenuItem
            label="Điện lạnh"
            onPress={() => handleNavigation('air_conditioning')}
            icon={ic_air_conditioning}
          />
          <MenuItem
            label="Khóa"
            onPress={() => handleNavigation('locksmith')}
            icon={ic_locksmith}
          />
        </View>

        <Spacer height={24} />

        {/* SwiperFlatList đã được thiết kế lại */}
        <View style={styles.swiperContainer}>
          <SwiperFlatList
            autoplay
            autoplayDelay={3}
            autoplayLoop
            index={0}
            showPagination
            paginationStyle={styles.pagination}
            paginationStyleItem={styles.paginationItem}
            paginationStyleItemActive={styles.paginationItemActive}
          >
            {images.map((imageUrl, index) => (
              <View key={index} style={styles.cardContainer}>
                <FastImage
                  source={imageUrl}
                  style={styles.cardImage}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </View>
            ))}
          </SwiperFlatList>
        </View>

        <Spacer height={120} />
      </ScrollView>

      {showCard && appointmentInProgress && (
        <View style={styles.bottomCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Cuộc hẹn đang xử lý</Text>
            <Spacer height={6} />
            <Text style={styles.cardService}>
              Dịch vụ:{' '}
              <Text style={styles.cardServiceValue}>
                {appointmentInProgress?.orderId?.service || 'Không xác định'}
              </Text>
            </Text>
            <Spacer height={4} />
            <Text style={styles.cardStatus}>
              Trạng thái:{' '}
              <Text style={styles.cardStatusValue}>
                {getStatusText(appointmentInProgress?.status) ||
                  'Không xác định'}
              </Text>
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
  icon,
}: {
  label: string;
  onPress?: () => void;
  icon: string;
}) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <FastImage
      style={{ height: 60, width: 52 }}
      source={icon || ic_air_conditioning}
    />
    <Text style={styles.menuText}>{label}</Text>
  </TouchableOpacity>
);

export default HomeView;

const styles = StyleSheet.create({
  // Swiper Container
  swiperContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
  },

  // Card Container - thiết kế mới
  cardContainer: {
    width: width - 32, // full width trừ padding
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },

  cardImage: {
    width: '100%',
    height: '100%',
  },

  // Pagination Style - đẹp hơn
  pagination: {
    bottom: 12,
  },

  paginationItem: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },

  paginationItemActive: {
    width: 24,
    backgroundColor: '#fff',
  },

  // Header Box
  headerBox: {
    backgroundColor: Colors.whiteFF,
    borderRadius: scaleModerate(16),
    padding: scaleModerate(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 6,
    flexDirection: 'row',
  },

  avatar: {
    height: 44,
    width: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.green36,
  },

  // Menu
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

  // Bottom Card
  bottomCard: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,

    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },

  // Card Text Styles - Font rõ ràng hơn
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: 0.2,
  },

  cardService: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
    lineHeight: 20,
  },

  cardServiceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },

  cardStatus: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
    lineHeight: 20,
  },

  cardStatusValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },

  cardButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginLeft: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  cardButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.3,
  },
});
