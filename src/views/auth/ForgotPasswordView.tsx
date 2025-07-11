// import {
//     Keyboard,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     TouchableWithoutFeedback,
//     View,
//     KeyboardAvoidingView,
//     Platform,
//     ScrollViewBase,
// } from 'react-native'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import React, { useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { checkExistedPhoneNumberAction, findInfoByPhoneNumberAction, loginAction } from '../../store/actions/authAction'
// import Header from '../components/Header'
// import { useTranslation } from 'react-i18next'
// import { DefaultStyles } from '../../styles/DefaultStyles'
// import Spacer from '../components/Spacer'
// import Input from '../components/Input'
// import Button from '../components/Button'
// import { IForm } from '../../interfaces'
// import { useNavigation } from '@react-navigation/native'
// import { defaultField, getFormValues } from '../../utils/formUtils'
// import LanguageView from '../components/LanguageView'
// import GlobalModalController from '../components/GlobalModal/GlobalModalController'
// import LoadingView from '../components/LoadingView'
// import { Colors } from '../../styles/Colors'
// import { scaleModerate } from '../../styles/scaleDimensions'
// import FastImage from 'react-native-fast-image'
// import { ic_home } from '../../assets'

// const ForgotPasswordView = () => {
//     const { t } = useTranslation()
//     const navigation = useNavigation()
//     const [form, setForm] = useState<IForm>({
//         username: defaultField,
//         password: defaultField,
//     })
//     const [loading, setLoading] = useState(false)
//     const dispatch = useDispatch()

//     const isValidData = () => {
//         let isValid = true
//         let usernameCheck = { error: false, message: '' }

//         if (!form.username.value) {
//             usernameCheck = { error: true, message: '' }
//             isValid = false
//         }

//         if (!isValid) {
//             setForm({
//                 username: { ...form.username, error: usernameCheck.error },
//             })
//         }
//         return isValid
//     }

//     const handlePressCheckOTP = () => {
//         if (isValidData()) {
//             const forgetPassword = {
//                 phone: form?.username?.value,
//             }
//             dispatch(
//                 findInfoByPhoneNumberAction(forgetPassword, (data: any, error: any) => {
//                     if (data) {
//                         setLoading(false)
//                         console.log("datadatadata" , data)
//                         const infoChangePassword = data
//                         navigation.navigate(
//                             ...(['OtpVerificationView', { infoChangePassword }] as never)
//                         )
//                     } else {
//                         GlobalModalController.showModal({
//                             title: t('Không tìm thấy số tồn tại'),
//                             icon: 'fail',
//                         })
//                     }
//                 })
//             )
//         }
//     }
//     return (
//         <SafeAreaView style={DefaultStyles.container}>
//             <Header isBack={true} title={''} />
//             <ScrollView style={DefaultStyles.wrapBody}>
//                 <Spacer height={20} />
//                 <Text style={[DefaultStyles.textBold16Black, { fontSize: scaleModerate(25) }]}>
//                     {t('Quên mật khẩu')}
//                 </Text>
//                 <Text style={[DefaultStyles.textRegular14Black]}>
//                     {t('Nhập số di động của bạn')}
//                 </Text>
//                 <Spacer height={20} />

//                 <Input
//                     title={t('phoneNumber') + '*'}
//                     keyboardType="phone-pad"
//                     value={form.username.value}
//                     onChangeText={(text) => {
//                         setForm({
//                             ...form,
//                             username: { value: text, error: false, message: '' },
//                         })
//                     }}
//                     error={form.username.error}
//                     message={form.username.message}
//                 />
//                 <Spacer height={5} />
//                 <Text style={[DefaultStyles.textRegular12Gray, { textAlign: 'center' }]}>
//                     {t('automaticallyMessages')}
//                 </Text>
//                 <Spacer height={20} />

//                 <Button isColor title={t('Tiếp tục')} onPress={handlePressCheckOTP} />

//                 <Spacer height={300} />
//             </ScrollView>
//             <LoadingView loading={loading} />
//         </SafeAreaView>
//     )
// }

// export default ForgotPasswordView

// const styles = StyleSheet.create({
//     signUp: {
//         ...DefaultStyles.textRegular16Black,
//         color: Colors.primary300,
//     },
//     footerContainer: {
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         alignItems: 'center',
//     },
// })
