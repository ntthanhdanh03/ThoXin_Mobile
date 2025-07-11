import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import React, { useCallback } from 'react'
import FastImage from 'react-native-fast-image'
import { ic_chevron_left, ic_search } from '../../assets'
import { scaleModerate } from '../../styles/scaleDimensions'
import { useNavigation } from '@react-navigation/native'
import { Colors } from '../../styles/Colors'
import Input from './Input'
import { debounce } from 'lodash'

interface IHeader {
    title?: string
    isBack?: boolean
    isCenter?: boolean
    onPressBack?: any
    containerStyle?: ViewStyle
    renderRight?: any
    renderLeft?: any
    searchPlaceholder?: string
    onSearchChange?: any
}
const Header = (props: IHeader) => {
    const navigation = useNavigation()
    const [showSearch, setShowSearch] = React.useState(false)

    const handleGoBack = () => {
        if (Boolean(props?.onPressBack)) {
            props?.onPressBack()
        } else {
            navigation.canGoBack() && navigation.goBack()
        }
    }

    const pushChange = useCallback(
        debounce((text: string) => {
            props?.onSearchChange && props?.onSearchChange(text)
        }, 500),
        []
    )

    return (
        <View>
            <View
                style={[
                    styles.container,
                    {
                        paddingLeft: props?.isBack ? scaleModerate(10) : scaleModerate(14),
                        paddingBottom: props?.isBack ? 0 : scaleModerate(12),
                        paddingTop: props?.isBack ? 0 : scaleModerate(12),
                    },
                    props?.containerStyle,
                ]}
            >
                {props?.renderLeft && props?.renderLeft()}
                {props?.isBack && (
                    <TouchableOpacity style={{ padding: scaleModerate(10) }} onPress={handleGoBack}>
                        <FastImage source={ic_chevron_left} style={styles.iconBack} />
                    </TouchableOpacity>
                )}
                <Text
                    style={[
                        styles.text,
                        props?.isCenter && { textAlign: 'center' },
                        props?.isCenter && props?.isBack && { marginRight: scaleModerate(30) },
                    ]}
                >
                    {props?.title}
                </Text>
                {props?.renderRight && props?.renderRight()}
                {props?.onSearchChange && (
                    <TouchableOpacity
                        onPress={() => {
                            if (showSearch) {
                                props?.onSearchChange && props?.onSearchChange('')
                            }
                            setShowSearch(!showSearch)
                        }}
                    >
                        <FastImage
                            source={ic_search}
                            style={{
                                width: scaleModerate(22),
                                height: scaleModerate(22),
                                marginRight: scaleModerate(5),
                            }}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {showSearch && (
                <Input
                    type="search"
                    placeholder={props?.searchPlaceholder}
                    onChangeText={(text: string) => {
                        props?.onSearchChange && props?.onSearchChange(text)
                    }}
                    containerStyle={{ marginHorizontal: scaleModerate(20) }}
                />
            )}
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingRight: scaleModerate(20),
        alignItems: 'center',
    },
    text: {
        flex: 1,
        marginLeft: scaleModerate(6),
        fontSize: scaleModerate(16),
        fontWeight: 'bold',
        color: Colors.primary,
    },
    iconBack: {
        height: scaleModerate(24),
        width: scaleModerate(24),
    },
})
