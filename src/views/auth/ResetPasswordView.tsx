import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { DefaultStyles } from '../../styles/DefaultStyles'
import Spacer from '../components/Spacer'
import { SafeAreaView } from 'react-native-safe-area-context'
import Input from '../components/Input'
import Button from '../components/Button'
import { IForm } from '../../interfaces'
import { defaultField } from '../../utils/formUtils'
import _ from 'lodash'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import GlobalModalController from '../components/GlobalModal/GlobalModalController'
import LoadingView from '../components/LoadingView'
import { scaleModerate } from '../../styles/scaleDimensions'
import HeaderV2 from '../components/HeaderV2'
import { useNavigation } from '@react-navigation/native'


const ResetPasswordView = ({ route }: any) => {

    const navigation = useNavigation()
    const [form, setForm] = useState<IForm>({
        passwordNew: defaultField,
        reTypePassword: defaultField,
    })
    const { infoChangePassword } = route?.params
    const [isLoading, setIsLoading] = useState(false)
    const isValidData = () => {
        let isValid = true
        let passwordNewCheck = { error: false, message: '' }
        let reTypePasswordCheck = { error: false, message: '' }

        if (!form.passwordNew.value) {
            passwordNewCheck = { error: true, message: '' }
            isValid = false
        }
        if (!form.reTypePassword.value) {
            reTypePasswordCheck = { error: true, message: '' }
            isValid = false
        }
        if (!isValid) {
            setForm({
                passwordNew: { ...form.password, error: passwordNewCheck.error },
                reTypePassword: { ...form.reTypePassword, error: reTypePasswordCheck.error },
            })
        }
        if (isValid && form.passwordNew.value !== form.reTypePassword.value) {
            GlobalModalController.showModal({
                title: ('fail'),
                description: ('confirmPasswordNotMatch'),
                icon: 'fail',
            })
            isValid = false
        }
        return isValid
    }

    const handlePressResetPassword = () => {
        if (isValidData()) {
            setIsLoading(true)
            const updateData = {
                password: form?.passwordNew?.value,
            }
            console.log(form?.passwordNew?.value)

            if (infoChangePassword[0]?.userType === 'lawyer') {
                console.log('user')
            
            } else {
                
            }
        }
    }

    return (
        <SafeAreaView style={DefaultStyles.container}>
            <HeaderV2 title={('changePassword')} isBack={true} type="simple" />
            <KeyboardAwareScrollView>
                <View style={DefaultStyles.wrapBody}>
                    <Spacer height={6} />
                    <View style={{ alignItems: 'center' }}></View>

                    <View style={{ paddingHorizontal: scaleModerate(20) }}>
                        <Spacer height={10} />
                        <Input
                            title={('newPassword')}
                            type="password"
                            value={form.passwordNew.value}
                            onChangeText={(text) => {
                                setForm({
                                    ...form,
                                    passwordNew: { value: text, error: false, message: '' },
                                })
                            }}
                            error={form.passwordNew.error}
                            message={form.passwordNew.message}
                        />
                        <Spacer height={20} />
                        <Input
                            title={('reNewPassword')}
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
                </View>
            </KeyboardAwareScrollView>
            <Button
                isColor
                title={('save')}
                onPress={handlePressResetPassword}
                containerStyle={{ marginBottom: 10, marginHorizontal: 10 }}
            />
            <LoadingView loading={isLoading} />
        </SafeAreaView>
    )
}
export default ResetPasswordView
const styles = StyleSheet.create({})
