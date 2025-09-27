import React, { useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DefaultStyles } from '../../styles/DefaultStyles';
import Header from '../components/Header';
import Spacer from '../components/Spacer';
import FastImage from 'react-native-fast-image';
import { Colors } from '../../styles/Colors';
import { ic_balence } from '../../assets';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/InsideStack';

const DetailActivityView = ({ route }: any) => {
  const { item } = route.params;
  const { data: orderData } = useSelector((store: any) => store.order);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const currentOrder = useMemo(
    () => orderData.find((o: any) => o._id === item._id),
    [orderData, item._id],
  );

  const handleNavigationChatView = (applicant: any) => {
    const dataRoomChat = {
      roomId: applicant?.roomId,
      avatarUrl: applicant?.avatarUrl,
      fullName: applicant?.name,
      partnerId: applicant?.partnerId,
      orderId: item?._id,
    };
    navigation.navigate('ChatViewVer2', { dataRoomChat });
  };

  const renderApplicant = ({ item: applicant }: any) => (
    <TouchableOpacity style={styles.applicantCard} onPress={() => {}}>
      <View style={styles.applicantHeader}>
        <FastImage
          source={{ uri: applicant.avatarUrl }}
          style={styles.avatar}
        />
        <View style={styles.applicantInfo}>
          <Text style={DefaultStyles.textMedium14Black}>{applicant.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={DefaultStyles.textMedium12Black}>Giá đề xuất:</Text>
            <Spacer width={5} />
            <Text
              style={[
                DefaultStyles.textMedium14Black,
                { color: Colors.green34 },
              ]}
            >
              {applicant.offeredPrice}
            </Text>
          </View>
          <Text style={styles.note}>Ghi chú: {applicant.note || 'Trống'}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            handleNavigationChatView(applicant);
          }}
        >
          <FastImage
            source={ic_balence}
            style={{
              width: 32,
              height: 32,
              borderRadius: 25,
              marginRight: 12,
              borderWidth: 1,
            }}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (!currentOrder) {
    return (
      <SafeAreaView style={DefaultStyles.container}>
        <Header isBack title="Danh sách thợ báo giá" />
        <Text style={{ textAlign: 'center', marginTop: 50 }}>
          Không tìm thấy đơn hàng
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={DefaultStyles.container}>
      <Header isBack title="Danh sách thợ báo giá" />

      <View style={[DefaultStyles.wrapBody, { flex: 1 }]}>
        <View style={styles.serviceInfo}>
          <Text style={DefaultStyles.textMedium16Black}>
            {currentOrder.describe}
          </Text>
          <Spacer height={3} />
          <Text style={DefaultStyles.textRegular14Black}>
            Giá tham khảo: {currentOrder.rangePrice}
          </Text>
          <Spacer height={3} />
          <Text style={DefaultStyles.textRegular14Black}>
            Địa chỉ: {currentOrder.address}
          </Text>
        </View>

        <View style={styles.applicantsSection}>
          <Text style={DefaultStyles.textBold16Black}>
            Danh sách thợ báo giá ({currentOrder.applicants?.length || 0})
          </Text>

          {currentOrder.applicants && currentOrder.applicants.length > 0 ? (
            <FlatList
              data={currentOrder.applicants}
              renderItem={renderApplicant}
              keyExtractor={applicant => applicant._id}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text style={styles.noApplicants}>Chưa có thợ nào báo giá</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DetailActivityView;

const styles = StyleSheet.create({
  serviceInfo: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },

  applicantsSection: {
    flex: 1,
  },

  applicantCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  applicantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
  },
  applicantInfo: {
    flex: 1,
  },

  note: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  noApplicants: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 50,
  },
});
