// import React, { useState, useEffect, useRef } from 'react'
// import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { DefaultStyles } from '../../styles/DefaultStyles'
// import { useTranslation } from 'react-i18next'
// import Spacer from '../components/Spacer'
// import { scaleModerate } from '../../styles/scaleDimensions'
// import Header from '../components/Header'
// import { OtpInput, OtpInputRef } from 'react-native-otp-entry'
// import { Colors } from '../../styles/Colors'
// import Button from '../components/Button'

// import GlobalModalController from '../components/GlobalModal/GlobalModalController'
// import { useNavigation } from '@react-navigation/native'

// const OtpVerificationView = ({ route }: any) => {
//     const { t } = useTranslation()
//     const [countdown, setCountdown] = useState(0)
//     const [otp, setOtp] = useState('')
//     const { infoRegisterLawyer, infoRegisterCustomer, infoChangePassword } = route.params
//     const navigation = useNavigation()
//     const [isLoading, setIsLoading] = useState(true)
//     const otpRef = useRef<OtpInputRef>(null)
//     const OTP = '12345'

//     const clearOtp = () => {
//         if (otpRef.current) {
//             otpRef.current.clear()
//         }
//     }

//     useEffect(() => {
//         let timer: any
//         if (countdown > 0) {
//             timer = setInterval(() => {
//                 setCountdown((prev) => prev - 1)
//             }, 1000)
//         }
//         return () => clearInterval(timer)
//     }, [countdown])

//     useEffect(() => {
       
//     }, [])

//     const handleResendOtp = () => {
     
//     }

//     const handleConfirmOtp = () => {
//         // if (otp === OTP) {
//         //     if (infoChangePassword) {
//         //         console.log(infoChangePassword)
//         //         navigation.navigate(...(['ResetPasswordView', { infoChangePassword }] as never))
//         //     }
//         // }
//         setIsLoading(true)
//         const checkOTP = {
//             phoneNumber: infoRegisterLawyer?.phone
//                 ? `+84${infoRegisterLawyer.phone.slice(1)}`
//                 : `+84${infoRegisterCustomer?.phone.slice(1)}`,
//             code: otp,
//         }
      
//     }

//     return (
//         <SafeAreaView style={DefaultStyles.container}>
//             <ScrollView>
//                 <Header title={''} isBack={true} />
//                 <Spacer height={20} />
//                 <View style={[DefaultStyles.wrapBody, { alignItems: 'center', flex: 1 }]}>
//                     <Spacer height={100} />

//                     <Text style={DefaultStyles.textBold22Black}>{t('enterVerification')}</Text>

//                     <Spacer height={10} />

//                     <View style={{ width: '70%' }}>
//                         <Text style={[styles.label, { textAlign: 'center' }]}>
//                             {t('automaticallyMessages')}
//                         </Text>
//                     </View>

//                     <Spacer height={20} />

//                     <OtpInput
//                         numberOfDigits={5}
//                         ref={otpRef}
//                         onTextChange={(text) => setOtp(text)}
//                         theme={{
//                             focusStickStyle: {
//                                 backgroundColor: Colors.primary,
//                             },
//                             focusedPinCodeContainerStyle: {
//                                 borderColor: Colors.primary,
//                                 borderWidth: 1,
//                             },
//                             filledPinCodeContainerStyle: {
//                                 borderColor: Colors.green34,
//                                 borderWidth: 1,
//                             },
//                             pinCodeTextStyle: {
//                                 ...DefaultStyles.textRegular16Black,
//                                 fontSize: 32,
//                             },
//                             pinCodeContainerStyle: {
//                                 height: scaleModerate(50),
//                                 width: scaleModerate(50),
//                             },
//                         }}
//                     />

//                     <Spacer height={20} />

//                     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                         <Text style={styles.label}>{t('notOTP')}</Text>

//                         {countdown > 0 ? (
//                             <Text style={[styles.label]}> ({countdown}s)</Text>
//                         ) : (
//                             <TouchableOpacity onPress={handleResendOtp}>
//                                 <Text
//                                     style={[
//                                         DefaultStyles.textBold16Black,
//                                         { color: Colors.primary, marginStart: 5 },
//                                     ]}
//                                 >
//                                     {t('resendCode')}
//                                 </Text>
//                             </TouchableOpacity>
//                         )}
//                     </View>
//                 </View>
//             </ScrollView>
//             <Button
//                 isColor
//                 disable={otp.length < 5}
//                 title={t('confirmAppointment')}
//                 onPress={handleConfirmOtp}
//                 containerStyle={{ marginHorizontal: 15, marginBottom: 10 }}
//             />
//         </SafeAreaView>
//     )
// }

// export default OtpVerificationView

// const styles = StyleSheet.create({
//     text: {
//         fontSize: scaleModerate(14),
//         marginBottom: scaleModerate(10),
//     },
//     label: {
//         ...DefaultStyles.textRegular16Black,
//     },
// })
