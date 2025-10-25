import { ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { DefaultStyles } from '../../styles/DefaultStyles';
import Spacer from '../components/Spacer';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../styles/Colors';
import { scaleModerate } from '../../styles/scaleDimensions';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserAction } from '../../store/actions/authAction';

const RegisterNameView = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { data: authData } = useSelector((store: any) => store.auth);
  const [name, setName] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleNext = () => {
    dispatch(
      updateUserAction(
        {
          id: authData?.user?._id,
          updateData: {
            fullName: name,
          },
        },
        (data: any, error: any) => {
          if (data) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'BottomTab' } as never],
            });
          }
        },
      ),
    );
  };

  return (
    <SafeAreaView style={DefaultStyles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon/Emoji Section */}
        <View style={styles.iconContainer}>
          <View style={styles.emojiCircle}>
            <Text style={styles.emojiText}>👋</Text>
          </View>
        </View>

        <Spacer height={24} />

        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Xin chào!</Text>
          <Spacer height={8} />
          <Text style={styles.subtitle}>
            Vui lòng cho chúng tôi biết tên của bạn để bắt đầu
          </Text>
        </View>

        <Spacer height={32} />

        {/* Input Section */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Họ và tên</Text>
          <Spacer height={8} />

          <View
            style={[
              styles.inputWrapper,
              isFocused && styles.inputWrapperFocused,
              name.length > 0 && name.length < 6 && styles.inputWrapperError,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Nhập họ và tên của bạn"
              placeholderTextColor={Colors.gray72}
              value={name}
              onChangeText={setName}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          {/* Character count */}
          <View style={styles.helperContainer}>
            {name.length > 0 && name.length < 6 ? (
              <Text style={styles.errorText}>
                ⚠️ Tên phải có ít nhất 6 ký tự
              </Text>
            ) : (
              <Text style={styles.helperText}>
                {name.length > 0 ? `${name.length} ký tự` : 'Tối thiểu 6 ký tự'}
              </Text>
            )}
          </View>
        </View>

        <Spacer height={32} />

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Gợi ý</Text>
            <Text style={styles.infoText}>
              Sử dụng tên thật của bạn để dễ dàng giao tiếp với thợ
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <Button
          title="Tiếp tục"
          onPress={handleNext}
          disable={name.length < 6}
          containerStyle={styles.buttonContainer}
        />
      </View>
    </SafeAreaView>
  );
};

export default RegisterNameView;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.whiteFF,
  },
  contentContainer: {
    paddingHorizontal: scaleModerate(20),
    paddingTop: scaleModerate(40),
    paddingBottom: scaleModerate(20),
  },
  iconContainer: {
    alignItems: 'center',
  },
  emojiCircle: {
    width: scaleModerate(80),
    height: scaleModerate(80),
    borderRadius: scaleModerate(40),
    backgroundColor: Colors.whiteE5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: scaleModerate(40),
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    ...DefaultStyles.textBold24Black,
    color: Colors.black1B,
  },
  subtitle: {
    ...DefaultStyles.textRegular16Black,
    color: Colors.gray72,
    textAlign: 'center',
    lineHeight: scaleModerate(24),
  },
  inputSection: {
    width: '100%',
  },
  inputLabel: {
    ...DefaultStyles.textMedium14Black,
    color: Colors.black1B,
    marginLeft: scaleModerate(4),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border01,
    borderRadius: scaleModerate(16),
    backgroundColor: Colors.whiteFF,
    paddingHorizontal: scaleModerate(16),
    paddingVertical: scaleModerate(14),
    gap: scaleModerate(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputWrapperFocused: {
    borderColor: Colors.primary300,
    backgroundColor: Colors.whiteE5,
  },
  inputWrapperError: {
    borderColor: Colors.redFD,
    backgroundColor: '#FFF5F5',
  },
  inputIcon: {
    fontSize: scaleModerate(20),
  },
  input: {
    flex: 1,
    ...DefaultStyles.textRegular16Black,
    color: Colors.black1B,
    padding: 0,
  },
  helperContainer: {
    marginTop: scaleModerate(8),
    marginLeft: scaleModerate(4),
  },
  helperText: {
    ...DefaultStyles.textRegular12Gray,
    color: Colors.gray72,
  },
  errorText: {
    ...DefaultStyles.textRegular12Red,
    color: Colors.redFD,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.grayF5,
    borderRadius: scaleModerate(16),
    padding: scaleModerate(16),
    gap: scaleModerate(12),
    borderWidth: 1,
    borderColor: Colors.border01,
  },
  infoIcon: {
    fontSize: scaleModerate(24),
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    ...DefaultStyles.textMedium14Black,
    color: Colors.black1B,
    marginBottom: scaleModerate(4),
  },
  infoText: {
    ...DefaultStyles.textRegular13Black,
    color: Colors.gray72,
    lineHeight: scaleModerate(20),
  },
  bottomContainer: {
    paddingHorizontal: scaleModerate(16),
    paddingVertical: scaleModerate(16),
    backgroundColor: Colors.whiteFF,
    borderTopWidth: 1,
    borderTopColor: Colors.border01,
  },
  buttonContainer: {
    marginHorizontal: 0,
  },
});
