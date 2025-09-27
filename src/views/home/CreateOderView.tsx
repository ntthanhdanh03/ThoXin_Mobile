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
  const [dateTimeOder, setDateTimeOder] = useState<string>();
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
            getOrderAction({}, (data: any) => {
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

      <ScrollView style={{ ...DefaultStyles.wrapBody, flex: 1 }}>
        <Spacer height={10} />

        <Selection
          title="Dịch vụ"
          data={serviceData}
          onSelect={(selectedItem: any) => setChoseService(selectedItem.origin)}
        />
        <Spacer height={10} />

        <Input
          title="Mô tả dịch vụ"
          value={choseService?.Mota || ''}
          area
          onChangeText={(text: string) => {
            setChoseService(prev =>
              prev
                ? { ...prev, Mota: text }
                : { key: '', nameService: '', rangePrice: '', Mota: text },
            );
          }}
        />
        <Spacer height={10} />

        <View style={{ flexDirection: 'row' }}>
          <Input
            title="Địa điểm"
            value={address}
            area
            containerStyle={{ width: '90%' }}
            editable={false}
          />
          <TouchableOpacity onPress={handleNavigationMap}>
            <Text style={{ color: Colors.black01 }}>Map</Text>
          </TouchableOpacity>
        </View>
        <Spacer height={10} />

        <DateSelection
          title="Thời gian"
          mode="datetime"
          maximumDate="yes"
          limitDays={7}
          message="Chỉ cho phép đặt hẹn trong vòng 7 ngày"
          onDateChange={(date: Date) => setDateTimeOder(date.toISOString())}
        />

        <Spacer height={20} />

        <Text style={{ ...DefaultStyles.textBold14Black, marginBottom: 8 }}>
          Ảnh (Tối đa 4 ảnh)
        </Text>
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
              <FastImage
                source={ic_balence}
                style={styles.image}
                resizeMode={FastImage.resizeMode.contain}
              />
              <Text style={DefaultStyles.textMedium12Black}>Thêm ảnh</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <View style={{ borderTopWidth: 1, borderColor: Colors.border01 }}>
        <Spacer height={10} />
        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
          <Text style={{ ...DefaultStyles.textMedium14Black }}>
            Giá tham khảo:
          </Text>
          <Spacer width={5} />
          <Text
            style={{
              ...DefaultStyles.textMedium14Black,
              color: Colors.green34,
            }}
          >
            {choseService?.rangePrice || ' Vui lòng chọn dịch vụ'}
          </Text>
        </View>
        <Spacer height={10} />

        <Button
          title="Tìm thợ"
          containerStyle={{ marginHorizontal: 10 }}
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
  imagesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageBox: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border01,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  capturedImage: {
    width: '100%',
    height: '100%',
  },
  addBox: {
    backgroundColor: Colors.whiteAE,
  },
  image: {
    width: 36,
    height: 36,
    marginBottom: 4,
  },
  deleteBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
  },
});
