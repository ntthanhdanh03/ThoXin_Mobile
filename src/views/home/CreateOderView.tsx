import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FastImage from 'react-native-fast-image';

import Header from '../components/Header';
import Selection from '../components/Selection';
import Input from '../components/Input';
import Spacer from '../components/Spacer';
import Button from '../components/Button';
import DateSelection from '../components/DateSelection';
import PhotoOptionsPicker from '../components/PhotoOptionsPicker';

import { ic_balence } from '../../assets';
import { Colors } from '../../styles/Colors';
import { DefaultStyles } from '../../styles/DefaultStyles';
import { RootStackParamList } from '../../navigation/InsideStack';
import { scaleModerate } from '../../styles/scaleDimensions';

import {
  AIR_CONDITIONING,
  ELECTRICITY,
  ELECTRICITY_WATER,
  LOCKSMITH,
} from '../../constants/Constants';
import { uploadKycPhoto } from '../../services/uploadKycPhoto ';
import {
  createOrderAction,
  getOrderAction,
} from '../../store/actions/orderAction';
import GlobalModalController from '../components/GlobalModal/GlobalModalController';

type RawService = {
  key: string;
  nameService: string;
  rangePrice: string;
  Mota: string;
};

const CreateOrderView = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const route = useRoute<any>();
  const { typeService } = route.params || {};
  const { data: authData } = useSelector((store: any) => store.auth);

  const [address, setAddress] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [choseService, setChoseService] = useState<RawService | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [dateTimeOder, setDateTimeOder] = useState<string>(
    new Date().toISOString(),
  );
  const [showCameraOption, setShowCameraOption] = useState(false);

  const serviceData = useMemo(() => {
    let rawData: RawService[] = [];
    switch (typeService) {
      case 'electricity':
        rawData = ELECTRICITY;
        break;
      case 'water':
        rawData = ELECTRICITY_WATER;
        break;
      case 'air_conditioning':
        rawData = AIR_CONDITIONING;
        break;
      case 'locksmith':
        rawData = LOCKSMITH;
        break;
      default:
        rawData = [];
    }
    return rawData.map(item => ({
      key: item.key,
      name: item.nameService,
      origin: item,
    }));
  }, [typeService]);

  const handleNavigationMap = () => {
    navigation.navigate('ChoseLocationView', {
      onSelectAddress: (addr: string, lng: string, lat: string) => {
        setAddress(addr);
        setLongitude(lng);
        setLatitude(lat);
      },
    });
  };

  const handleUploadPhoto = async (image: any) => {
    const uploadedImage = await uploadKycPhoto(image, 'imageService');
    if (uploadedImage?.url) {
      setImages(prev => [...prev, uploadedImage.url]);
    }
  };

  const handleCreateOrder = () => {
    const dataOrder = {
      clientId: authData?.user?._id,
      service: choseService?.key,
      typeService,
      describe: choseService?.Mota,
      images,
      dateTimeOder,
      address,
      longitude,
      latitude,
      typeOder: 'select',
      rangePrice: choseService?.rangePrice,
    };
    console.log(dataOrder);
    dispatch(
      createOrderAction({ dataOrder }, (data: any, e: any) => {
        if (data) {
          GlobalModalController.showModal({
            title: 'Đã gửi thông báo tới Thợ',
            description: 'Vui lòng kiểm tra thông tin ở phần hoạt động',
            icon: 'success',
          });
          dispatch(
            getOrderAction({ clientId: authData?.users?._id }, (data: any) => {
              if (data) {
                navigation.goBack();
              }
            }),
          );
        } else {
          GlobalModalController.showModal({
            title: 'Tạo yêu cầu thất bại',
            description: e,
            icon: 'fail',
          });
          navigation.goBack();
        }
      }),
    );
  };

  const isDisabled =
    !choseService ||
    !choseService?.Mota?.trim() ||
    !address?.trim() ||
    !dateTimeOder;

  return (
    <SafeAreaView style={DefaultStyles.container}>
      <Header isBack title="Thông tin dịch vụ" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Spacer height={16} />
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔧 Dịch vụ</Text>
            <Selection
              data={serviceData}
              onSelect={(selectedItem: any) =>
                setChoseService(selectedItem.origin)
              }
              textStyle={{ ...DefaultStyles.textRegular14Black }}
            />
          </View>

          <Spacer height={20} />
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Mô tả vấn đề</Text>
            <Input
              value={choseService?.Mota || ''}
              area
              placeholder="Vui lòng mô tả chi tiết vấn đề của bạn..."
              onChangeText={(text: string) => {
                setChoseService(prev =>
                  prev
                    ? { ...prev, Mota: text }
                    : { key: '', nameService: '', rangePrice: '', Mota: text },
                );
              }}
            />
          </View>

          <Spacer height={20} />
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📍 Địa điểm</Text>
            <View style={styles.locationContainer}>
              <Input
                value={address}
                area
                placeholder="Chọn địa điểm trên bản đồ"
                containerStyle={styles.locationInput}
                editable={false}
              />
              <TouchableOpacity
                style={styles.mapButton}
                onPress={handleNavigationMap}
                activeOpacity={0.8}
              >
                <Text style={styles.mapIcon}>🗺️</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Spacer height={20} />

          {/* Date Time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⏰ Thời gian</Text>
            <DateSelection
              mode="datetime"
              maximumDate="yes"
              limitDays={7}
              message="Chỉ cho phép đặt hẹn trong vòng 7 ngày"
              onDateChange={(date: Date) => setDateTimeOder(date.toISOString())}
            />
          </View>

          <Spacer height={20} />

          {/* Images */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📸 Hình ảnh (Tối đa 4 ảnh)</Text>
            <View style={styles.imagesWrapper}>
              {images.map((img, index) => (
                <View key={index} style={styles.imageBox}>
                  <FastImage
                    source={{ uri: img }}
                    style={styles.capturedImage}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() =>
                      setImages(prev => prev.filter((_, i) => i !== index))
                    }
                    activeOpacity={0.8}
                  >
                    <Text style={styles.deleteText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}

              {images.length < 4 && (
                <TouchableOpacity
                  style={[styles.imageBox, styles.addBox]}
                  onPress={() => setShowCameraOption(true)}
                  activeOpacity={0.7}
                >
                  <View style={styles.addBoxContent}>
                    <Text style={styles.addIcon}>📷</Text>
                    <Text style={DefaultStyles.textMedium12Black}>
                      Thêm ảnh
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <Spacer height={20} />
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={DefaultStyles.textMedium14Black}>Giá tham khảo</Text>
          <Text style={styles.priceText}>
            {choseService?.rangePrice || 'Chọn dịch vụ để xem giá'}
          </Text>
        </View>

        <Button
          title="Tìm thợ ngay"
          containerStyle={styles.submitButton}
          disable={isDisabled}
          onPress={handleCreateOrder}
        />
      </View>

      <PhotoOptionsPicker
        isVisible={showCameraOption}
        onSelectPhoto={image => {
          handleUploadPhoto(image);
          setShowCameraOption(false);
        }}
        onClose={() => setShowCameraOption(false)}
      />
    </SafeAreaView>
  );
};

export default CreateOrderView;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.grayF5,
  },
  contentContainer: {
    paddingHorizontal: scaleModerate(16),
    paddingBottom: scaleModerate(20),
  },
  section: {
    backgroundColor: Colors.whiteFF,
    borderRadius: scaleModerate(16),
    padding: scaleModerate(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    ...DefaultStyles.textMedium14Black,
    marginBottom: scaleModerate(12),
    color: Colors.black1B,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleModerate(12),
  },
  locationInput: {
    flex: 1,
  },
  mapButton: {
    width: scaleModerate(56),
    height: scaleModerate(56),
    borderRadius: scaleModerate(16),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  mapIcon: {
    fontSize: 28,
  },
  imagesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scaleModerate(12),
  },
  imageBox: {
    width: scaleModerate(78),
    height: scaleModerate(78),
    borderRadius: scaleModerate(12),
    borderWidth: 1,
    borderColor: Colors.border01,
    overflow: 'hidden',
    position: 'relative',
  },
  capturedImage: {
    width: '100%',
    height: '100%',
  },
  addBox: {
    backgroundColor: Colors.grayF5,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: Colors.primary300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBoxContent: {
    alignItems: 'center',
    gap: scaleModerate(4),
  },
  addIcon: {
    fontSize: 32,
  },
  deleteBtn: {
    position: 'absolute',
    top: scaleModerate(6),
    right: scaleModerate(6),
    backgroundColor: Colors.redFD,
    borderRadius: scaleModerate(14),
    width: scaleModerate(22),
    height: scaleModerate(22),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  deleteText: {
    color: Colors.whiteFF,
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  bottomBar: {
    borderTopLeftRadius: scaleModerate(24),
    borderTopRightRadius: scaleModerate(24),
    paddingTop: scaleModerate(16),

    paddingHorizontal: scaleModerate(16),
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaleModerate(12),
  },
  priceText: {
    ...DefaultStyles.textBold16Black,
    color: Colors.green34,
  },
  submitButton: {
    marginHorizontal: 0,
  },
});
