import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { img_default_avatar } from '../../assets';
import { DefaultStyles } from '../../styles/DefaultStyles';
import { scaleModerate } from '../../styles/scaleDimensions';
import Spacer from '../components/Spacer';
import { Colors } from '../../styles/Colors';
import { useNavigation } from '@react-navigation/native';

const MenuItem = ({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.menuIcon}>
      <FastImage style={styles.iconImage} />
    </View>
    <Text style={styles.menuText}>{label}</Text>
  </TouchableOpacity>
);

const HomeView = () => {
  const navigation = useNavigation();
  const { data: authData } = useSelector((store: any) => store.auth);
  const handleNavigation = (key: string) => {
    const typeService = key;
    navigation.navigate(...(['CreateOderView', { typeService }] as never));
  };

  return (
    <SafeAreaView style={DefaultStyles.container}>
      <ScrollView style={[{ flex: 1 }, DefaultStyles.wrapBody]}>
        {/* Header chào user */}
        <View style={styles.headerBox}>
          <View style={styles.headerContent}>
            <FastImage
              style={styles.avatar}
              source={
                authData?.user?.avatarUrl
                  ? { uri: authData.user.avatarUrl }
                  : img_default_avatar
              }
            />
            <Spacer width={10} />
            <Text style={DefaultStyles.textBold14Black}>
              Xin chào {authData?.user?.fullName}
            </Text>
          </View>
        </View>

        <Spacer height={15} />

        {/* Dịch vụ */}
        <Text style={DefaultStyles.textBold16Black}>Dịch vụ</Text>
        <View style={styles.menuRow}>
          <View style={styles.menuRow}>
            <MenuItem
              label="Điện"
              onPress={() => handleNavigation('electricity')}
            />
            <MenuItem label="Nước" onPress={() => handleNavigation('water')} />
            <MenuItem
              label="Điện lạnh"
              onPress={() => handleNavigation('air_conditioning')}
            />
            <MenuItem
              label="Khóa"
              onPress={() => handleNavigation('locksmith')}
            />
          </View>
        </View>

        <Spacer height={20} />

        <Text style={DefaultStyles.textBold16Black}>Truy cập nhanh</Text>
        <View style={styles.menuRow}>
          <MenuItem label="Lịch sử" />
          <MenuItem label="Thợ yêu thích" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeView;

const styles = StyleSheet.create({
  headerBox: {
    width: '100%',
    borderWidth: 1,
    height: scaleModerate(50),
    alignSelf: 'center',
    borderRadius: 6,
    padding: 10,
    flexDirection: 'row',
    borderColor: Colors.border01,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 4,
  },

  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 20,
  },
  menuRow: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 10,
  },
  menuItem: {
    alignItems: 'center',
    width: '25%',
  },
  menuIcon: {
    height: 44,
    width: 44,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    height: 24,
    width: 24,
  },
  menuText: {
    paddingTop: 5,
    textAlign: 'center',
    ...DefaultStyles.textBold12Black,
  },
});
