import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import React, { useState, useEffect } from 'react';
import FastImage from 'react-native-fast-image';
import { ic_calendar } from '../../assets';
import { DefaultStyles } from '../../styles/DefaultStyles';
import { scaleModerate } from '../../styles/scaleDimensions';
import { Colors } from '../../styles/Colors';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

interface IDateSelection {
  title: string;
  date?: Date;
  onDateChange?: (date: Date) => void;
  containerStyle?: ViewStyle;
  mode?: 'date' | 'datetime';
  dob?: 'yes' | 'no';
  maximumDate?: 'yes';
  message?: string;
  limitDays?: number;
}

const DateSelection = (props: IDateSelection) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    props.date || new Date(),
  );
  const [displayDate, setDisplayDate] = useState<string>(
    props.date
      ? formatDate(props.date, props.mode)
      : formatDate(new Date(), props.mode),
  );

  useEffect(() => {
    // Khi props.date thay đổi từ bên ngoài
    if (props.date) {
      setSelectedDate(props.date);
      setDisplayDate(formatDate(props.date, props.mode));
    }
  }, [props.date, props.mode]);

  function formatDate(date: Date, mode?: 'date' | 'datetime') {
    if (mode === 'datetime') return moment(date).format('DD/MM/YYYY HH:mm');
    return moment(date).format('DD/MM/YYYY');
  }

  const getMaxDate = () => {
    if (props.dob === 'yes') return new Date();
    if (props.limitDays) return moment().add(props.limitDays, 'days').toDate();
    return undefined;
  };

  return (
    <View style={[props.containerStyle]}>
      {props.title && (
        <View style={styles.wrapTitle}>
          <Text style={styles.title}>{props.title}</Text>
        </View>
      )}

      <Pressable onPress={() => setIsOpen(true)} style={styles.wrap}>
        <Text style={styles.date}>{displayDate}</Text>
        <FastImage source={ic_calendar} style={styles.icon} />
      </Pressable>

      {props.message && <Text style={styles.message}>{props.message}</Text>}

      <DatePicker
        modal
        open={isOpen}
        date={selectedDate}
        locale="vi"
        mode={props.mode || 'date'}
        minimumDate={props.maximumDate === 'yes' ? new Date() : undefined}
        maximumDate={getMaxDate()}
        title="Chọn thời gian"
        confirmText="Xác nhận"
        cancelText="Đóng"
        onConfirm={date => {
          setIsOpen(false);
          setSelectedDate(date);
          setDisplayDate(formatDate(date, props.mode));
          props.onDateChange && props.onDateChange(date);
        }}
        onCancel={() => setIsOpen(false)}
      />
    </View>
  );
};

export default DateSelection;

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 16,
    flexDirection: 'row',
    borderWidth: scaleModerate(1),
    height: scaleModerate(54),
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
    ...DefaultStyles.textBold12Black,
  },
  wrapTitle: {
    position: 'absolute',
    top: scaleModerate(10),
    marginBottom: scaleModerate(-10),
    marginLeft: scaleModerate(16),
    zIndex: 2,
    alignItems: 'flex-start',
  },
  title: {
    ...DefaultStyles.textBold12Black,
    backgroundColor: Colors.whiteFF,
  },
  message: {
    marginTop: scaleModerate(4),
    marginLeft: scaleModerate(4),
    ...DefaultStyles.textRegular12Gray,
  },
});
