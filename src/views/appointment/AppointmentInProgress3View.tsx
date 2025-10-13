import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import ImageViewing from 'react-native-image-viewing';

import { DefaultStyles } from '../../styles/DefaultStyles';
import { Colors } from '../../styles/Colors';
import { ic_balence } from '../../assets';
import SwipeButton from 'rn-swipe-button';

import Spacer from '../components/Spacer';
import Input from '../components/Input';
import PhotoOptionsPicker from '../components/PhotoOptionsPicker';
import Header from '../components/Header';
import { updateAppointmentAction } from '../../store/actions/appointmentAction';
import Button from '../components/Button';
import { uploadKycPhoto } from '../../services/uploadKycPhoto ';
import GlobalModalController from '../components/GlobalModal/GlobalModalController';

const AppointmentInProgress3View = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { data: appointmentData } = useSelector(
    (store: any) => store.appointment,
  );

  const APPOINTMENT_UPDATE_IN_PROGRESS =
    appointmentData?.appointmentInProgress?.[0];

  const [laborCost, setLaborCost] = useState<number>(0);
  const [additionalIssues, setAdditionalIssues] = useState<
    { note: string; images: string[]; cost: number }[]
  >([]);
  const [currentIssueIndex, setCurrentIssueIndex] = useState<number | null>(
    null,
  );
  const [showCameraOption, setShowCameraOption] = useState(false);

  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [imagesToView, setImagesToView] = useState<{ uri: string }[]>([]);
  const [imageViewIndex, setImageViewIndex] = useState(0);

  const totalPartsCost = additionalIssues.reduce(
    (sum, issue) => sum + (issue.cost || 0),
    0,
  );
  const grandTotal = laborCost + totalPartsCost;
  const agreedPrice = APPOINTMENT_UPDATE_IN_PROGRESS?.agreedPrice || 0;
  const difference = grandTotal - agreedPrice;

  useEffect(() => {
    if (APPOINTMENT_UPDATE_IN_PROGRESS?.additionalIssues?.length) {
      setAdditionalIssues(
        APPOINTMENT_UPDATE_IN_PROGRESS.additionalIssues.map((item: any) => ({
          note: item.note,
          images: item.images || [],
          cost: item.cost || 0,
        })),
      );
    }
    if (APPOINTMENT_UPDATE_IN_PROGRESS?.laborCost) {
      setLaborCost(APPOINTMENT_UPDATE_IN_PROGRESS?.laborCost);
    }
  }, [APPOINTMENT_UPDATE_IN_PROGRESS]);

  const handleUploadPhoto = async (image: any) => {
    if (currentIssueIndex === null) return;
    const uploadedImage = await uploadKycPhoto(image, 'imageService');
    if (uploadedImage?.url) {
      setAdditionalIssues(prev => {
        const newIssues = [...prev];
        newIssues[currentIssueIndex].images.push(uploadedImage.url);
        return newIssues;
      });
    }
  };

  const handleConfirm = () => {
    const postData = {
      status: 4,
      additionalIssuesApproved: true,
    };
    const typeUpdate = 'APPOINTMENT_UPDATE_IN_PROGRESS';
    const dataUpdate = {
      id: APPOINTMENT_UPDATE_IN_PROGRESS._id,
      typeUpdate,
      postData,
    };
    dispatch(updateAppointmentAction(dataUpdate, (data: any) => {}));
  };

  // Khi bấm vào ảnh
  const handleOpenImageView = (images: string[], index: number) => {
    setImagesToView(images.map(img => ({ uri: img })));
    setImageViewIndex(index);
    setIsImageViewVisible(true);
  };

  const hasCompleteInfo =
    laborCost > 0 &&
    additionalIssues.every(
      issue => issue.note && issue.cost > 0 && issue.images?.length > 0,
    );

  return (
    <SafeAreaView style={DefaultStyles.container}>
      <Header title="Tiến hành sửa chữa" isBack />

      <ScrollView style={{ ...DefaultStyles.wrapBody, flex: 1 }}>
        <Spacer height={10} />

        <Input
          title="Tiền công"
          containerStyle={{ width: '100%' }}
          keyboardType="numeric"
          editable={false}
          value={laborCost.toLocaleString('vi-VN') || '123'}
          onChangeText={txt => {
            const raw = txt.replace(/\D/g, '');
            setLaborCost(raw ? Number(raw) : 0);
          }}
        />

        <Spacer height={10} />

        <Text style={{ ...DefaultStyles.textBold14Black, marginBottom: 10 }}>
          Phát sinh / Phụ tùng
        </Text>

        {additionalIssues.map((issue, index) => (
          <View key={index} style={styles.issueBox}>
            <Input
              title={`Ghi chú phụ tùng ${index + 1}`}
              area
              value={issue.note}
              onChangeText={txt => {
                setAdditionalIssues(prev => {
                  const newIssues = [...prev];
                  newIssues[index].note = txt;
                  return newIssues;
                });
              }}
            />

            <Spacer height={10} />

            <Input
              title={`Chi phí phụ tùng ${index + 1}`}
              keyboardType="numeric"
              value={issue.cost ? issue.cost.toLocaleString('vi-VN') : ''}
              onChangeText={txt => {
                const raw = txt.replace(/\D/g, '');
                setAdditionalIssues(prev => {
                  const newIssues = [...prev];
                  newIssues[index].cost = raw ? Number(raw) : 0;
                  return newIssues;
                });
              }}
            />

            <Spacer height={10} />

            <Text style={{ ...DefaultStyles.textBold14Black, marginBottom: 8 }}>
              Ảnh phụ tùng {index + 1}
            </Text>
            <View style={styles.imagesWrapper}>
              {issue.images.map((img, imgIndex) => (
                <TouchableOpacity
                  key={imgIndex}
                  onPress={() => handleOpenImageView(issue.images, imgIndex)}
                >
                  <FastImage
                    source={{ uri: img }}
                    style={styles.capturedImageSmall}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <Spacer height={20} />
      </ScrollView>

      <View style={styles.footer}>
        <Text style={DefaultStyles.textRegular14Black}>
          Tiền công: {laborCost.toLocaleString('vi-VN')} VND
        </Text>
        <Text style={DefaultStyles.textRegular14Black}>
          Phụ tùng: {totalPartsCost.toLocaleString('vi-VN')} VND
        </Text>
        <Text style={DefaultStyles.textRegular14Black}>
          Tổng tiền: {grandTotal.toLocaleString('vi-VN')} VND
        </Text>
        <Text style={DefaultStyles.textRegular14Black}>
          Tiền thỏa thuận: {agreedPrice.toLocaleString('vi-VN')} VND
        </Text>
        <Text
          style={{
            ...DefaultStyles.textRegular14Black,
            color: difference === 0 ? Colors.green34 : Colors.red30,
          }}
        >
          Chênh lệch: {difference.toLocaleString('vi-VN')} VND
        </Text>
        <Spacer height={10} />
        {!hasCompleteInfo && (
          <Text
            style={{
              ...DefaultStyles.textMedium14Black,
              color: Colors.red30,
              textAlign: 'center',
              marginBottom: 10,
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
              if (value) handleConfirm();
              else GlobalModalController.hideModal();
            });
            GlobalModalController.showModal({
              title: 'Vuốt để xác nhận !',
              description:
                'Hãy chắc chắn rằng bạn đã kiểm tra kỹ tình trạng công việc .',
              type: 'yesNo',
              icon: 'warning',
            });
          }}
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

export default AppointmentInProgress3View;

const styles = StyleSheet.create({
  issueBox: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border01,
    borderRadius: 8,
    position: 'relative',
  },
  imagesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  capturedImageSmall: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border01,
    marginRight: 8,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border01,
    padding: 16,
  },
});
