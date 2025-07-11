import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native'
import React, { useState } from 'react'
import FastImage from 'react-native-fast-image'
import { ic_eye, ic_eye_off, ic_search } from '../../assets'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { scaleModerate } from '../../styles/scaleDimensions'
import { Colors } from '../../styles/Colors'

interface IInput extends TextInputProps {
    type?: 'password' | 'search'
    title?: string
    error?: boolean
    message?: string
    containerStyle?: ViewStyle
    area?: boolean
}
const Input = (props: IInput) => {
    const [showPassword, setShowPassword] = useState(true)
    return (
        <View style={[props?.containerStyle]}>
            {props?.title && (
                <View style={styles.wrapTitle}>
                    <Text
                        style={[
                            styles.title,
                            props?.editable === false && {
                                color: '#706f6f',
                            },
                        ]}
                    >
                        {props?.title}
                    </Text>
                </View>
            )}
            <View
                style={[
                    styles.wrapInput,
                    props?.editable === false && {
                        borderColor: '#706f6f',
                    },
                    props?.error && {
                        borderColor: Colors.redFD,
                    },
                    props?.area && {
                        height: scaleModerate(100),
                    },
                ]}
            >
                {props?.type === 'search' && (
                    <FastImage source={ic_search} style={styles.leftIcon} />
                )}
                <TextInput
                    multiline={props?.area}
                    selectionColor={'#626161'}
                    secureTextEntry={props?.type === 'password' && showPassword}
                    style={[
                        styles.input,
                        Boolean(props?.title) && { marginTop: scaleModerate(5) },
                        props?.editable === false && {
                            color: '#706f6f',
                        },
                        {
                            paddingLeft:
                                props?.type === 'search' ? scaleModerate(13) : scaleModerate(16),
                            paddingRight: props?.type === 'password' ? 0 : scaleModerate(26),
                        },
                        props?.area && {
                            height: scaleModerate(70),
                            marginTop: scaleModerate(-10),
                            textAlignVertical: 'top',
                        },
                    ]}
                    {...props}
                />
                {props?.type === 'password' && (
                    <TouchableOpacity
                        style={{ padding: scaleModerate(15) }}
                        onPress={() => {
                            setShowPassword(!showPassword)
                        }}
                    >
                        <FastImage
                            source={!showPassword ? ic_eye : ic_eye_off}
                            style={styles.rightIcon}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {props?.message && <Text style={styles.message}>{props?.message}</Text>}
        </View>
    )
}

export default Input

const styles = StyleSheet.create({
    wrapTitle: {
        marginBottom: scaleModerate(-10),
        marginLeft: scaleModerate(10),
        zIndex: 2,
        alignItems: 'flex-start',
    },
    title: {
        ...DefaultStyles.textRegular14Black,
        backgroundColor: Colors.whiteFF,
        paddingHorizontal: scaleModerate(5),
    },
    wrapInput: {
        flexDirection: 'row',
        borderWidth: scaleModerate(1),
        height: scaleModerate(40),
        borderRadius: scaleModerate(8),
        borderColor: Colors.whiteE6,
        backgroundColor: Colors.whiteFF,
        alignItems: 'center',
        marginHorizontal: 0,
    },
    leftIcon: {
        width: scaleModerate(20),
        height: scaleModerate(20),
        marginLeft: scaleModerate(14),
    },
    input: {
        flex: 1,
        height: scaleModerate(40),
        ...DefaultStyles.textRegular13Black,
        letterSpacing: 1,
    },
    rightIcon: {
        width: scaleModerate(18),
        height: scaleModerate(18),
    },
    message: {
        marginTop: scaleModerate(5),
        marginLeft: scaleModerate(10),
        ...DefaultStyles.textRegular12Red,
    },
})
