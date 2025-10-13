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
import FastImage from 'react-native-fast-image';
import ImageViewing from 'react-native-image-viewing';

import Spacer from '../components/Spacer';
import Header from '../components/Header';
import SwipeButton from 'rn-swipe-button';
import { Colors } from '../../styles/Colors';
import GlobalModalController from '../components/GlobalModal/GlobalModalController';
import { updateAppointmentAction } from '../../store/actions/appointmentAction';
import Input from '../components/Input';

const AppointmentInProgress4View = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { data: appointmentData } = useSelector(
    (store: any) => store.appointment,
  );

  const APPOINTMENT_UPDATE_IN_PROGRESS =
    appointmentData?.appointmentInProgress?.[0];

  const [imagesToView, setImagesToView] = useState<{ uri: string }[]>([]);
  const [imageViewIndex, setImageViewIndex] = useState(0);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);

  const images: any = APPOINTMENT_UPDATE_IN_PROGRESS?.afterImages?.images || [];

  const handleConfirm = async () => {
    const postData = {
      status: 5,
      afterImages: {
        note: APPOINTMENT_UPDATE_IN_PROGRESS?.afterImages?.note,
        images: images,
      },
    };
    const typeUpdate = 'APPOINTMENT_UPDATE_IN_PROGRESS';
    const dataUpdate = {
      id: APPOINTMENT_UPDATE_IN_PROGRESS._id,
      typeUpdate,
      postData,
    };
    dispatch(
      updateAppointmentAction(dataUpdate, (data: any) => {
        if (data) {
        }
      }),
    );
  };

  const handleOpenImageView = (index: number) => {
    setImagesToView(images.map((img: any) => ({ uri: img })));
    setImageViewIndex(index);
    setIsImageViewVisible(true);
  };

  const hasCompleteInfo =
    !!APPOINTMENT_UPDATE_IN_PROGRESS?.afterImages?.note && images.length > 0;

  return (
    <SafeAreaView style={DefaultStyles.container}>
      <Header title="Bàn giao" isBack />
      <ScrollView style={{ ...DefaultStyles.wrapBody, flex: 1 }}>
        <Spacer height={10} />

        <Input
          title="Mô tả vấn đề của Khách"
          area
          value={APPOINTMENT_UPDATE_IN_PROGRESS?.afterImages?.note}
          editable={false}
        />

        <Spacer height={20} />

        <Text style={{ ...DefaultStyles.textBold14Black, marginBottom: 8 }}>
          Tình trạng sau cùng
        </Text>
        <View style={styles.imagesWrapper}>
          {images.map((img: any, index: any) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleOpenImageView(index)}
            >
              <FastImage
                source={{ uri: img }}
                style={styles.capturedImage}
                resizeMode={FastImage.resizeMode.cover}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {!hasCompleteInfo && (
          <Text
            style={{
              ...DefaultStyles.textMedium14Black,
              color: Colors.red30,
              textAlign: 'center',
              marginBottom: 10,
            }}
          >
            Vui lòng nhập mô tả vấn đề và ít nhất 1 ảnh trước khi vuốt
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

      {/* Image Viewing Modal */}
      <ImageViewing
        images={imagesToView}
        imageIndex={imageViewIndex}
        visible={isImageViewVisible}
        onRequestClose={() => setIsImageViewVisible(false)}
      />
    </SafeAreaView>
  );
};

export default AppointmentInProgress4View;

const styles = StyleSheet.create({
  imagesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  capturedImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border01,
    marginRight: 8,
    marginBottom: 8,
  },
  inputWrapper: {
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border01,
    borderRadius: 8,
    backgroundColor: Colors.whiteAE,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: Colors.border01,
    paddingVertical: 10,
  },
});
