import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { scaleModerate } from '../styles/scaleDimensions';
import { Colors } from '../styles/Colors';
import FastImage from 'react-native-fast-image';
import { ic_close } from '../assets';
import Spacer from '../views/components/Spacer';
import StarsView from '../views/components/StarsView';
import { DefaultStyles } from '../styles/DefaultStyles';
import Button from '../views/components/Button';
import Input from '../views/components/Input';
import { useDispatch } from 'react-redux';
import { rateAppointmentAction } from '../store/actions/appointmentAction';
import { showSuccessToast } from '../utils/alertUtils';

const { width, height } = Dimensions.get('window');

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  data?: any;
}

const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  onClose,
  data,
}) => {
  const dispatch = useDispatch();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [images, setImages] = useState<any>();
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
      setRating(0);
      setComment('');
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 250,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => onClose());
  };

  if (!visible) return null;

  const handleSubmit = () => {
    if (rating === 0) return;
    const postData = {
      appointmentId: data?._id,
      partnerId: data?.partnerId?._id,
      clientId: data?.clientId,
      rating: rating,
      comment: comment,
    };

    console.log('postDataaaaaaaaaaa', postData);

    dispatch(
      rateAppointmentAction(postData, (data: any) => {
        if (data) {
          showSuccessToast('Cảm ơn ! Quý khách đã dánh giá 🎉');
          handleClose();
        }
      }),
    );
  };

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={handleClose}
      presentationStyle="overFullScreen"
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <Animated.View
            style={[
              styles.container,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
              <FastImage style={{ height: 24, width: 24 }} source={ic_close} />
            </TouchableOpacity>

            <ScrollView
              contentContainerStyle={{ paddingBottom: 100 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Spacer height={10} />

              <Text style={styles.message}>
                Cuộc hẹn đã hoàn tất! Hãy đánh giá thợ để giúp cải thiện trải
                nghiệm của bạn.
              </Text>

              <View style={styles.centerBox}>
                <Spacer height={10} />
                <FastImage
                  style={styles.avatar}
                  source={{ uri: data?.partnerId?.avatarUrl }}
                />
                <Text style={styles.name}>{data?.partnerId?.fullName}</Text>

                <Spacer height={8} />
                <StarsView type="action" number={rating} onChange={setRating} />
              </View>

              <Spacer height={10} />

              <Input
                title=""
                area
                placeholder="Nhập đánh giá .."
                value={comment}
                onChangeText={setComment}
              />
            </ScrollView>

            <Button
              title="Đánh giá"
              onPress={handleSubmit}
              disable={rating === 0}
              containerStyle={{
                position: 'absolute',
                bottom: 30,
                width: '100%',
                alignSelf: 'center',
                opacity: rating === 0 ? 0.5 : 1,
              }}
            />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default RatingModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  container: {
    width: width,
    height: height * 0.86,
    backgroundColor: Colors.whiteFF,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  closeBtn: {
    alignSelf: 'flex-start',
  },
  message: {
    ...DefaultStyles.textMedium14Black,
    textAlign: 'center',
    alignSelf: 'center',
    width: '90%',
    lineHeight: 22,
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    height: 90,
    width: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  name: {
    marginTop: 10,
    ...DefaultStyles.textBold16Black,
    textAlign: 'center',
  },
});
