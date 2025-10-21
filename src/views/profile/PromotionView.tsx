import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { getPromotionAction } from '../../store/actions/appointmentAction';
import { Colors } from '../../styles/Colors';
import { DefaultStyles } from '../../styles/DefaultStyles';
import Header from '../components/Header';
import Spacer from '../components/Spacer';
import { scaleModerate } from '../../styles/scaleDimensions';

const PromotionView = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { data: authData } = useSelector((store: any) => store.auth);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(
      getPromotionAction({ clientId: authData?.user?._id }, (data: any) => {
        if (data) setPromotions(data);
        setLoading(false);
      }),
    );
  }, []);

  const renderPromoItem = (promo: any) => {
    const valueText =
      promo.type === 'fixed'
        ? `Giảm ${promo.value.toLocaleString()}₫`
        : `Giảm ${promo.value}%`;

    return (
      <View key={promo.code} style={styles.card}>
        <View style={{ flex: 1 }}>
          <Text style={styles.code}>{promo.code}</Text>
          <Text style={DefaultStyles.textRegular14Black}>{valueText}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.applyBtn}
          onPress={() => console.log('Áp dụng', promo.code)}
        >
          <Text style={styles.applyText}>Áp dụng</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={DefaultStyles.container}>
      <Header title="Mã khuyến mãi" isBack />
      <Spacer height={10} />

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary300} />
      ) : promotions.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={{ ...DefaultStyles.textBold14Black }}>
            Hiện tại bạn không có mã nào
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: scaleModerate(10), gap: 12 }}
        >
          {promotions.map(renderPromoItem)}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default PromotionView;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.whiteFF,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  code: {
    ...DefaultStyles.textBold16Black,
    color: Colors.primary,
  },

  applyBtn: {
    backgroundColor: Colors.primary300,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  applyText: {
    ...DefaultStyles.textMedium14White,
  },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
});
