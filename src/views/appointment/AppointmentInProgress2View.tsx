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
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import SwipeButton from 'rn-swipe-button';
import ImageViewing from 'react-native-image-viewing';

import { DefaultStyles } from '../../styles/DefaultStyles';
import { Colors } from '../../styles/Colors';
import Spacer from '../components/Spacer';
import Input from '../components/Input';
import Header from '../components/Header';
import GlobalModalController from '../components/GlobalModal/GlobalModalController';
import {
  getPromotionAction,
  updateAppointmentAction,
} from '../../store/actions/appointmentAction';
import CustomModal from '../home/CustomModal';

const AppointmentInProgress2View = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { data: appointmentData } = useSelector(
    (store: any) => store.appointment,
  );
  const appointment = appointmentData?.appointmentInProgress?.[0];
  const { data: authData } = useSelector((store: any) => store.auth);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [codePromotion, setCodePromotion] = useState<string>('');

  const images = appointment?.beforeImages?.images || [];
  const hasCompleteInfo =
    !!appointment?.beforeImages?.note &&
    !!appointment?.agreedPrice &&
    images.length > 0;

  const handleConfirm = async () => {
    const postData = {
      status: 3,
      beforeImages: {
        images: appointment?.beforeImages?.images,
        note: appointment?.beforeImages?.note,
        approve: true,
      },
      promotionCode: codePromotion,
    };

    const dataUpdate = {
      id: appointmentData.appointmentInProgress[0]._id,
      typeUpdate: 'APPOINTMENT_UPDATE_IN_PROGRESS',
      postData,
    };

    dispatch(
      updateAppointmentAction(dataUpdate, (data: any) => {
        if (data && appointment?.beforeImages?.approve === false) {
          // Handle callback if needed
        }
      }),
    );
  };

  const handleSwipeSuccess = () => {
    GlobalModalController.onActionChange((value: boolean) => {
      if (value) {
        handleConfirm();
      } else {
        GlobalModalController.hideModal();
      }
    });

    GlobalModalController.showModal({
      title: 'Xác nhận kiểm tra lần cuối?',
      description: 'Hãy chắc chắn rằng Thợ đã mô tả đúng vấn đề của bạn.',
      type: 'yesNo',
      icon: 'warning',
    });
  };

  const handleOpenPromotionModal = () => {
    dispatch(
      getPromotionAction({ clientId: authData?.user?._id }, (data: any) => {
        if (data) setPromotions(data);
        setLoading(false);
      }),
    );
  };
  const renderPromoItem = (promo: any) => {
    const valueText =
      promo.type === 'fixed'
        ? `Giảm ${promo.value.toLocaleString()}₫`
        : `Giảm ${promo.value}%`;

    return (
      <View key={promo.code} style={styles.card}>
        <View style={{ flex: 1 }}>
          <Text style={styles.code}>{promo.code}</Text>
          <Text style={DefaultStyles.textRegular14Black}>{valueText}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.applyBtn}
          onPress={() => {
            setCodePromotion(promo.code);
            setIsModalVisible(false);
          }}
        >
          <Text style={styles.applyText}>Sử dụng</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const openImageViewer = (index: number) => {
    setImageIndex(index);
    setIsImageViewVisible(true);
  };

  return (
    <SafeAreaView style={DefaultStyles.container}>
      <Header title="Kiểm tra tình trạng" isBack />
      <ScrollView style={{ ...DefaultStyles.wrapBody, flex: 1 }}>
        <Spacer height={10} />

        <Input
          title="Mô tả vấn đề của Khách"
          area
          value={appointment?.beforeImages?.note || 'Chờ cập nhật'}
          editable={false}
        />

        <Spacer height={10} />

        <Input
          title="Giá tiền cho công việc (Giá cuối cùng thỏa thuận)"
          containerStyle={{ width: '100%' }}
          editable={false}
          value={appointment?.agreedPrice?.toLocaleString() || 'Chờ cập nhật'}
        />

        <Spacer height={20} />

        <Text style={{ ...DefaultStyles.textBold14Black, marginBottom: 8 }}>
          Mã khuyến mãi
        </Text>

        <View style={styles.promoCodeWrapper}>
          <TouchableOpacity
            style={{ width: '76%' }}
            disabled={!hasCompleteInfo}
            onPress={() => {
              setIsModalVisible(true);
              handleOpenPromotionModal();
            }}
          >
            <Input editable={false} value={codePromotion} />
          </TouchableOpacity>
        </View>

        <Spacer height={4} />

        <Text style={DefaultStyles.textRegular12Red}>
          Bạn có thể dùng mã sau khi Thợ cập nhật thông tin *
        </Text>

        <Spacer height={20} />

        <Text style={{ ...DefaultStyles.textBold14Black, marginBottom: 8 }}>
          Tình trạng trước
        </Text>

        <View style={styles.imagesWrapper}>
          {images.map((img: string, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => openImageViewer(index)}
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
      <View style={styles.bottomContainer}>
        <Spacer height={10} />

        {!hasCompleteInfo && (
          <Text style={styles.warningText}>
            Đợi thợ cập nhật đầy đủ thông tin mới có thể vuốt
          </Text>
        )}

        <SwipeButton
          containerStyles={styles.swipeButtonContainer}
          disabled={!hasCompleteInfo}
          railBackgroundColor={Colors.whiteAE}
          railFillBackgroundColor="rgba(0,0,0,0.4)"
          railBorderColor={Colors.gray72}
          railFillBorderColor={Colors.whiteAE}
          railStyles={{ borderRadius: 8 }}
          thumbIconBorderColor="transparent"
          thumbIconBackgroundColor={Colors.gray44}
          thumbIconStyles={{ borderRadius: 4, width: 40, height: 40 }}
          title="Vuốt để xác nhận"
          titleStyles={DefaultStyles.textBold16Black}
          titleColor={Colors.black01}
          onSwipeSuccess={handleSwipeSuccess}
        />
      </View>
      <ImageViewing
        images={images.map((uri: any) => ({ uri }))}
        imageIndex={imageIndex}
        visible={isImageViewVisible}
        onRequestClose={() => setIsImageViewVisible(false)}
        HeaderComponent={({ imageIndex }) => (
          <View style={styles.headerIndicator}>
            <Text style={styles.indicatorText}>
              {imageIndex + 1} / {images.length}
            </Text>
          </View>
        )}
      />
      <CustomModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        configHeight={0.85}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {loading ? (
            <Text style={DefaultStyles.textRegular14Black}>Đang tải...</Text>
          ) : promotions.length > 0 ? (
            <View style={{ gap: 12 }}>
              <Spacer height={6} />
              {promotions.map(promo => renderPromoItem(promo))}
            </View>
          ) : (
            <View style={styles.emptyBox}>
              <Text style={DefaultStyles.textRegular14Black}>
                Hiện chưa có mã khuyến mãi nào khả dụng
              </Text>
            </View>
          )}
        </ScrollView>
      </CustomModal>
    </SafeAreaView>
  );
};

export default AppointmentInProgress2View;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.whiteFF,
    borderRadius: 16,
    padding: 16,
    margin: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  code: {
    ...DefaultStyles.textBold16Black,
    color: Colors.primary,
  },

  applyBtn: {
    backgroundColor: Colors.primary300,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  applyText: {
    ...DefaultStyles.textMedium14White,
  },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
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
  promoCodeWrapper: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  applyButton: {
    borderWidth: 1,
    padding: 10,
    marginStart: 10,
    borderRadius: 10,
    backgroundColor: Colors.primary,
  },
  bottomContainer: {
    borderTopWidth: 1,
    borderColor: Colors.border01,
  },
  warningText: {
    ...DefaultStyles.textMedium14Black,
    color: Colors.red30,
    textAlign: 'center',
  },
  swipeButtonContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 10,
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
    ...DefaultStyles.textBold14BWhite,
  },
});
