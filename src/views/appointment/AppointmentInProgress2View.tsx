import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { DefaultStyles } from '../../styles/DefaultStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

import Spacer from '../components/Spacer';
import Input from '../components/Input';
import FastImage from 'react-native-fast-image';
import { Colors } from '../../styles/Colors';
import SwipeButton from 'rn-swipe-button';
import Header from '../components/Header';
import GlobalModalController from '../components/GlobalModal/GlobalModalController';
import ImageViewing from 'react-native-image-viewing';
import { updateAppointmentAction } from '../../store/actions/appointmentAction';

const AppointmentInProgress2View = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { data: appointmentData } = useSelector(
    (store: any) => store.appointment,
  );
  const APPOINTMENT_UPDATE_IN_PROGRESS =
    appointmentData?.appointmentInProgress?.[0];

  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const handleConfirm = async () => {
    const postData = {
      status: 3,
      beforeImages: {
        images: APPOINTMENT_UPDATE_IN_PROGRESS?.beforeImages?.images,
        note: APPOINTMENT_UPDATE_IN_PROGRESS?.beforeImages?.note,
        approve: true,
      },
    };
    const typeUpdate = 'APPOINTMENT_UPDATE_IN_PROGRESS';
    const dataUpdate = {
      id: appointmentData.appointmentInProgress[0]._id,
      typeUpdate,
      postData,
    };
    dispatch(
      updateAppointmentAction(dataUpdate, (data: any) => {
        if (data) {
          if (APPOINTMENT_UPDATE_IN_PROGRESS?.beforeImages?.approve === false) {
            // setLoading(true)
          }

          // navigation.navigate(...(['AppointmentInProgress3View'] as never))
        }
      }),
    );
  };

  const images = APPOINTMENT_UPDATE_IN_PROGRESS?.beforeImages?.images || [];
  const hasCompleteInfo =
    !!APPOINTMENT_UPDATE_IN_PROGRESS?.beforeImages?.note &&
    !!APPOINTMENT_UPDATE_IN_PROGRESS?.agreedPrice &&
    APPOINTMENT_UPDATE_IN_PROGRESS?.beforeImages?.images?.length > 0;

  return (
    <SafeAreaView style={DefaultStyles.container}>
      <Header title="Kiểm tra tình trạng" isBack />

      <ScrollView style={{ ...DefaultStyles.wrapBody, flex: 1 }}>
        <Spacer height={10} />

        <Input
          title="Mô tả vấn đề của Khách"
          area
          value={
            APPOINTMENT_UPDATE_IN_PROGRESS?.beforeImages?.note || 'Chờ cập nhật'
          }
          editable={false}
        />
        <Spacer height={10} />

        <Input
          title="Giá tiền cho công việc (Giá cuối cùng thỏa thuận)"
          containerStyle={{ width: '100%' }}
          editable={false}
          value={
            APPOINTMENT_UPDATE_IN_PROGRESS?.agreedPrice?.toLocaleString() ||
            'Chờ cập nhật'
          }
        />

        <Spacer height={20} />

        <Text style={{ ...DefaultStyles.textBold14Black, marginBottom: 8 }}>
          Tình trạng trước
        </Text>
        <View style={styles.imagesWrapper}>
          {images.map((img: string, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setImageIndex(index);
                setIsImageViewVisible(true);
              }}
            >
              <FastImage
                source={{ uri: img }}
                style={styles.imageBox}
                resizeMode={FastImage.resizeMode.cover}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={{ borderTopWidth: 1, borderColor: Colors.border01 }}>
        <Spacer height={10} />
        {!hasCompleteInfo && (
          <Text
            style={{
              ...DefaultStyles.textMedium14Black,
              color: Colors.red30,
              textAlign: 'center',
            }}
          >
            Đợi thợ cập nhật đầy đủ thông tin mới có thể vuốt
          </Text>
        )}

        <SwipeButton
          containerStyles={{
            borderRadius: 8,
            overflow: 'hidden',
            marginHorizontal: 16,
            marginBottom: 10,
          }}
          disabled={!hasCompleteInfo}
          railBackgroundColor={Colors.whiteAE}
          railFillBackgroundColor={'rgba(0,0,0,0.4)'}
          railBorderColor={Colors.gray72}
          railFillBorderColor={Colors.whiteAE}
          railStyles={{ borderRadius: 8 }}
          thumbIconBorderColor="transparent"
          thumbIconBackgroundColor={Colors.gray44}
          thumbIconStyles={{ borderRadius: 4, width: 40, height: 40 }}
          title="Vuốt để xác nhận"
          titleStyles={{ ...DefaultStyles.textBold16Black }}
          titleColor={Colors.black01}
          onSwipeSuccess={() => {
            GlobalModalController.onActionChange((value: boolean) => {
              if (value) {
                handleConfirm();
              } else {
                GlobalModalController.hideModal();
              }
            });
            GlobalModalController.showModal({
              title: 'Xác nhận kiểm tra lần cuối?',
              description:
                'Hãy chắc chắn rằng bạn đã kiểm tra kỹ tình trạng công việc của khách hàng trước khi bắt đầu công việc.',
              type: 'yesNo',
              icon: 'warning',
            });
          }}
        />
      </View>

      {/* Modal hiển thị ảnh zoom với indicator */}
      <ImageViewing
        images={images.map((uri: any) => ({ uri }))}
        imageIndex={imageIndex}
        visible={isImageViewVisible}
        onRequestClose={() => setIsImageViewVisible(false)}
        // Hiển thị indicator dạng "1 / 3"
        HeaderComponent={({ imageIndex }) => (
          <View style={styles.headerIndicator}>
            <Text style={styles.indicatorText}>
              {imageIndex + 1} / {images.length}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default AppointmentInProgress2View;

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
  },
  headerIndicator: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  indicatorText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
