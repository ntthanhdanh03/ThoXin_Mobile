import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { DefaultStyles } from '../../styles/DefaultStyles';
import { getOrderAction } from '../../store/actions/orderAction';

const ActivityView = () => {
  const dispatch = useDispatch();
  const { data: orderData } = useSelector((store: any) => store.order);

  useEffect(() => {
    console.log('orderData', orderData);
  }, [orderData]);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Text style={styles.title}>{item.service}</Text>
      <Text>{item.describe}</Text>
      <Text>{item.address}</Text>
      <Text>{item.rangePrice}</Text>
      <Text>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[DefaultStyles.container]}>
      <View style={[DefaultStyles.wrapBody]}>
        <FlatList
          data={orderData}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          refreshing={false}
          onRefresh={() => {
            dispatch(getOrderAction({}));
          }}
          onEndReachedThreshold={0.5}
        />
      </View>
    </SafeAreaView>
  );
};

export default ActivityView;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  itemContainer: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
    borderWidth: 1,
  },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
});
