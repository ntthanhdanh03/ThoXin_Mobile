import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Header from '../components/Header'
import { useTranslation } from 'react-i18next'
import { DefaultStyles } from '../../styles/DefaultStyles'
import Spacer from '../components/Spacer'
import { SafeAreaView } from 'react-native-safe-area-context'
import Input from '../components/Input'
import Button from '../components/Button'
import { IForm } from '../../interfaces'
import { useNavigation } from '@react-navigation/native'
import { defaultField, getFormValues } from '../../utils/formUtils'
import _ from 'lodash'
import LanguageView from '../components/LanguageView'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import GlobalModalController from '../components/GlobalModal/GlobalModalController'
import { Colors } from '../../styles/Colors'
import LoadingView from '../components/LoadingView'
import { scaleModerate } from '../../styles/scaleDimensions'

const RegisterView = () => {
    const navigation = useNavigation()
   
    const phoneRegex = /^(0(9|7|8|3|5)[0-9]{8})$/
    const [form, setForm] = useState<IForm>({
        name: defaultField,
        username: defaultField,
        password: defaultField,
        reTypePassword: defaultField,
    })
    const [loading, setLoading] = useState(false)

    const isValidData = () => {
        let isValid = true
        let nameCheck = { error: false, message: '' }
        let emailCheck = { error: false, message: '' }
        let usernameCheck = { error: false, message: '' }
        let passwordCheck = { error: false, message: '' }
        let reTypePasswordCheck = { error: false, message: '' }

        if (!form.name.value) {
            nameCheck = { error: true, message: '' }
            isValid = false
        }
        if (form.email?.value ) {
            emailCheck = { error: true, message: '' }
            isValid = false
        }
        if (!form.username.value) {
            usernameCheck = { error: true, message: '' }
            isValid = false
        }
        if (!form.password.value) {
            passwordCheck = { error: true, message: '' }
            isValid = false
        }
        if (!form.reTypePassword.value) {
            reTypePasswordCheck = { error: true, message: '' }
            isValid = false
        }
        if (!isValid) {
            setForm({
                name: { ...form.name, error: nameCheck.error },
                username: { ...form.username, error: usernameCheck.error },
                email: { ...form.email, error: emailCheck.error },
                password: { ...form.password, error: passwordCheck.error },
                reTypePassword: { ...form.reTypePassword, error: reTypePasswordCheck.error },
            })
        }
        if (isValid && form.password.value !== form.reTypePassword.value) {
            GlobalModalController.showModal({
                title: ('signUp'),
                description: ('confirmPasswordNotMatch'),
                icon: 'fail',
            })
            isValid = false
        }

        if (isValid && !phoneRegex.test(form.username.value)) {
            GlobalModalController.showModal({
                title: ('fail'),
                description: ('invalidPhone'),
                icon: 'fail',
            })
            isValid = false
        }

        return isValid
    }
    const handlePressSignUp = () => {
        if (isValidData()) {
          
            const infoRegisterCustomer = {
                name: form?.name?.value,
                phone: form?.username?.value,
                password: form?.password?.value,
                email: form?.email?.value,
               
            }
            console.log(infoRegisterCustomer)
            navigation.navigate(...(['OtpVerificationView', { infoRegisterCustomer }] as never))
        }
    }

    return (
        <SafeAreaView style={DefaultStyles.container}>
            <Header title={''} isBack={true}  />
            <KeyboardAwareScrollView>
                <View style={DefaultStyles.wrapBody}>
                    <Spacer height={6} />
                    <View style={{ alignItems: 'center' }}>
                        <Text style={DefaultStyles.textBold22Black}>
                           
                        </Text>
                    </View>
                    <Spacer height={35} />
                    <View style={{ paddingHorizontal: scaleModerate(20) }}>
                        <Input
                            title={('Họ và tên') + '*'}
                            value={form.name?.value}
                            onChangeText={(text) => {
                                setForm({
                                    ...form,
                                    name: { value: text, error: false, message: '' },
                                })
                            }}
                            error={form.name?.error}
                            message={form.name?.message}
                        />
                        <Spacer height={20} />
                        <Input
                            title={('Số điện thoại') + '* (Tên đăng nhập)'}
                            keyboardType="phone-pad"
                            value={form.username.value}
                            onChangeText={(text) => {
                                setForm({
                                    ...form,
                                    username: { value: text, error: false, message: '' },
                                })
                            }}
                            error={form.username.error}
                            message={form.username.message}
                        />
                        <Spacer height={20} />
                        <Input
                            title={('Mật khẩu') + '*'}
                            type="password"
                            value={form.password.value}
                            onChangeText={(text) => {
                                setForm({
                                    ...form,
                                    password: { value: text, error: false, message: '' },
                                })
                            }}
                            error={form.password.error}
                            message={form.password.message}
                        />
                        <Spacer height={20} />
                        <Input
                            title={('Nhập lại mật khẩu') + '*'}
                            type="password"
                            value={form.reTypePassword.value}
                            onChangeText={(text) => {
                                setForm({
                                    ...form,
                                    reTypePassword: { value: text, error: false, message: '' },
                                })
                            }}
                            error={form.reTypePassword.error}
                            message={form.reTypePassword.message}
                        />
                    </View>
                    <Spacer height={20} />
                    <View style={{ alignItems: 'center' }}>
                       
                        
                    </View>

                    <Spacer height={16} />
                    <Button isColor title={('Đăng ký')} onPress={handlePressSignUp} />
                    <Spacer height={30} />
                    <View style={{ alignItems: 'center' }}>
                        <Text
                            style={{ textDecorationLine: 'underline', color: Colors.primary300 }}
                            onPress={() => {
                                navigation.navigate('LoginView' as never)
                            }}
                        >
                            {('Bạn đã có tài khoản? Đăng nhập')}
                        </Text>
                    </View>
                </View>
            </KeyboardAwareScrollView>
            <LoadingView loading={loading} />
        </SafeAreaView>
    )
}
export default RegisterView
const styles = StyleSheet.create({
    signUp: {
        ...DefaultStyles.textMedium13Black,
        textTransform: 'uppercase',
    },
})
