import {
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollViewBase,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import Header from '../components/Header'
import { useTranslation } from 'react-i18next'
import { DefaultStyles } from '../../styles/DefaultStyles'
import Spacer from '../components/Spacer'
import Input from '../components/Input'
import Button from '../components/Button'
import { IForm } from '../../interfaces'
import { useNavigation } from '@react-navigation/native'
import { defaultField, getFormValues } from '../../utils/formUtils'
import LanguageView from '../components/LanguageView'
import GlobalModalController from '../components/GlobalModal/GlobalModalController'
import LoadingView from '../components/LoadingView'
import { Colors } from '../../styles/Colors'
import { scaleModerate } from '../../styles/scaleDimensions'
import FastImage from 'react-native-fast-image'
import { ic_home } from '../../assets'

const LoginView = () => {

      const navigation = useNavigation()
    const [form, setForm] = useState<IForm>({
        username: defaultField,
        password: defaultField,
    })
    const [loading, setLoading] = useState(false)
  

    const isValidData = () => {
        let isValid = true
        let usernameCheck = { error: false, message: '' }
        let passwordCheck = { error: false, message: '' }
        if (!form.username.value) {
            usernameCheck = { error: true, message: '' }
            isValid = false
        }
        if (!form.password.value) {
            passwordCheck = { error: true, message: '' }
            isValid = false
        }
        if (!isValid) {
            setForm({
                username: { ...form.username, error: usernameCheck.error },
                password: { ...form.password, error: passwordCheck.error },
            })
        }
        return isValid
    }

    const handlePressLogin = () => {
        if (isValidData()) {
            setLoading(true)
            const data = getFormValues(form)
         
        }
    }

    const handlePressSignUp = () => {
      navigation.navigate('RegisterView' as never)
    }

    const handledForgetPassword = () => {
        
    }

    return (
        <SafeAreaView style={DefaultStyles.container}>
          
            <ScrollView style={DefaultStyles.wrapBody}>
                <Spacer height={100} />
                <View style={{ alignItems: 'center' }}>
                    <Text style={[DefaultStyles.textRegular14Black, { fontSize: 17 }]}>
                        {('Chào mừng bạn trở lại')}
                    </Text>
                    <Spacer height={6} />
                    <Text
                        style={[DefaultStyles.textRegular16Black, { fontSize: scaleModerate(32) }]}
                    >
                        {('Đăng nhập')}
                    </Text>
                    <Spacer height={30} />
                </View>

                <View style={{ paddingHorizontal: scaleModerate(20) }}>
                    <Input
                        title={('Số điện thoại') + '*'}
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
                </View>
                <Spacer height={20} />
        
                <Button isColor title={('Đăng nhập')} onPress={handlePressLogin} />
                <Spacer height={10} />
                <Text
                    onPress={handledForgetPassword}
                    style={[styles.signUp, { textAlign: 'center' }]}
                >
                    {('Quên mật khẩu?')}
                </Text>

                <Spacer height={300} />
                <View style={styles.footerContainer}>
                    <Text style={DefaultStyles.textRegular14Black}>
                        {('Bạn chưa có tài khoản?') + ' '}
                    </Text>
                    <Text onPress={handlePressSignUp} style={styles.signUp}>
                        {('Đăng ký')}
                    </Text>
                   
                </View>
            </ScrollView>
            <LoadingView loading={loading} />
        </SafeAreaView>
    )
}

export default LoginView

const styles = StyleSheet.create({
    signUp: {
        ...DefaultStyles.textRegular16Black,
        color: Colors.primary300,
    },
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
})
