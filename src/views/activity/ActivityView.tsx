import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { DefaultStyles } from '../../styles/DefaultStyles';
import { getOrderAction } from '../../store/actions/orderAction';
import EmptyView from '../components/EmptyView';
import { Colors } from '../../styles/Colors';
import Spacer from '../components/Spacer';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/InsideStack';
const { width } = Dimensions.get('window');

const ActivityView = () => {
  const { data: authData } = useSelector((store: any) => store.auth);
  const dispatch = useDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: orderData } = useSelector((store: any) => store.order);

  const handleNavigationDetailOrder = (item: any) => {
    navigation.navigate('DetailActivityView', { item });
  };

  const handleNavigationAppointmentHistory = (item: any) => {
    navigation.navigate(...([`AppointmentView`, { item }] as never));
  };
  const handleNavigationAppointmentInProcessing = () => {
    navigation.navigate(...([`AppointmentInProgressView`] as never));
  };

  const getStatusColor = (status: string) => {
    const statusColors: any = {
      pending: '#FF9500',
      completed: '#30D158',
      cancelled: '#FF3B30',
      processing: '#3f82cfff',
    };
    return statusColors[status?.toLowerCase()] || statusColors.default;
  };

  const getStatusText = (status: string) => {
    const statusTexts: any = {
      pending: 'Chờ bạn chọn Thợ',
      processing: 'Xem tiến trình',
      completed: 'Xem chi tiết',
      cancelled: 'Đã hủy',
    };
    return statusTexts[status?.toLowerCase()] || status;
  };

  const renderItem = ({ item, index }: any) => (
    <View style={[styles.itemContainer, { marginTop: index === 0 ? 0 : 12 }]}>
      <View style={styles.cardHeader}>
        <Text style={DefaultStyles.textMedium16Black} numberOfLines={2}>
          {item.service}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={DefaultStyles.textMedium14White}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>

      <Text style={DefaultStyles.textRegular14Black} numberOfLines={3}>
        {item.describe}
      </Text>
      <Spacer height={10} />

      <View>
        <View>
          <Text style={DefaultStyles.textMedium14Black}>Địa chỉ:</Text>
          <Text style={DefaultStyles.textRegular14Black} numberOfLines={2}>
            {item.address}
          </Text>
        </View>
        <Spacer height={10} />
        <View style={{ flexDirection: 'row' }}>
          <Text style={DefaultStyles.textMedium14Black}> Giá:</Text>
          <Spacer width={5} />
          <Text
            style={{ ...DefaultStyles.textBold14Black, color: Colors.green34 }}
          >
            {item.rangePrice}
          </Text>
        </View>
      </View>

      <Spacer height={10} />

      {item.status === 'pending' ? (
        <View style={styles.cardFooter}>
          <View style={styles.orderInfo}>
            <Text style={DefaultStyles.textRegular13Gray}>
              #{item._id?.slice(-6)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => handleNavigationDetailOrder(item)}
          >
            <Text style={styles.viewButtonText}>Xem chi tiết</Text>
          </TouchableOpacity>
        </View>
      ) : item.status === 'completed' ? (
        <View style={styles.cardFooter}>
          <Text style={DefaultStyles.textRegular13Gray}>
            #{item._id?.slice(-6)}
          </Text>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => handleNavigationAppointmentHistory(item)}
          >
            <Text style={styles.viewButtonText}>Xem cuộc hẹn</Text>
          </TouchableOpacity>
        </View>
      ) : item.status === 'processing' ? (
        <View style={styles.cardFooter}>
          <Text style={DefaultStyles.textRegular13Gray}>
            #{item._id?.slice(-6)}
          </Text>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => handleNavigationAppointmentInProcessing()}
          >
            <Text style={styles.viewButtonText}>Xem tiến trình</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <View style={styles.header}>
        <Text style={DefaultStyles.textBold16Black}>Hoạt động của tôi</Text>
        <Text style={DefaultStyles.textRegular12Gray}>
          {orderData?.length || 0} hoạt động
        </Text>
      </View>

      <View style={styles.container}>
        <FlatList
          data={orderData}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          refreshing={false}
          onRefresh={() => {
            dispatch(getOrderAction({ clientId: authData?.user?._id }));
          }}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <>
              <EmptyView />
            </>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default ActivityView;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F5',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    flex: 1,
    marginRight: 12,
    lineHeight: 24,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F5',
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
    fontFamily: 'monospace',
  },
  viewButton: {
    backgroundColor: Colors.whiteAE,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.blue11,
  },
  viewButtonText: {
    ...DefaultStyles.textMedium14Black,
    color: Colors.blue11,
  },
});
