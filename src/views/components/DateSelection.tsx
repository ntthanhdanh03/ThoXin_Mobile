import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { useState } from 'react'
import FastImage from 'react-native-fast-image'
import { ic_calendar, ic_chevron_down } from '../../assets'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { scaleModerate } from '../../styles/scaleDimensions'
import { Colors } from '../../styles/Colors'
import DatePicker from 'react-native-date-picker'
import moment from 'moment'

interface IDateSelection {
    title: string
    date?: any
    onDateChange?: any
    containerStyle?: ViewStyle
    mode?: 'date' | 'datetime'
    dob? : 'yes' | 'no'
}
const DateSelection = (props: IDateSelection) => {
    const [isOpen, setIsOpen] = useState(false)
    const [datetime, setDatetime] = useState(
        props?.date
            ? moment(props?.date).format('DD/MM/YYYY')
            : moment(new Date()).format('DD/MM/YYYY')
    )

    return (
        <View style={[props?.containerStyle]}>
            {props?.title && (
                <View style={styles.wrapTitle}>
                    <Text style={styles.title}>{props?.title}</Text>
                </View>
            )}
            <Pressable
                onPress={() => {
                    setIsOpen(true)
                }}
                style={styles.wrap}
            >
                <Text style={styles.date}>{datetime}</Text>
                <FastImage source={ic_calendar} style={styles.icon} />
            </Pressable>
            <DatePicker
                modal
                open={isOpen}
                // minimumDate={new Date()}
                locale={'vi'}
                mode={props?.mode || 'date'}
                title={'Chọn ngày'}
                confirmText={'Xác nhận'}
                cancelText={'Đóng'}
                maximumDate={props?.dob === 'yes' ? new Date() : undefined}
                date={props?.date ? props?.date : new Date()}
                onConfirm={(date) => {
                    setIsOpen(false)
                    setDatetime(moment(date).format('DD/MM/YYYY'))
                    props?.onDateChange && props.onDateChange(date)
                }}
                onCancel={() => {
                    setIsOpen(false)
                }}
            />
        </View>
    )
}

export default DateSelection

const styles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        borderWidth: scaleModerate(1),
        height: scaleModerate(45),
        borderRadius: scaleModerate(10),
        borderColor: Colors.border01,
        backgroundColor: Colors.whiteFF,
        alignItems: 'center',
    },
    icon: {
        width: scaleModerate(20),
        height: scaleModerate(20),
        marginRight: scaleModerate(14),
    },
    date: {
        flex: 1,
        marginLeft: scaleModerate(16),
        ...DefaultStyles.textRegular14Black,
    },
    wrapTitle: {
        marginBottom: scaleModerate(-10),
        marginLeft: scaleModerate(16),
        zIndex: 2,
        alignItems: 'flex-start',
    },
    title: {
        ...DefaultStyles.textRegular14Black,
        backgroundColor: Colors.whiteFF,
        paddingHorizontal: scaleModerate(5),
    },
})
