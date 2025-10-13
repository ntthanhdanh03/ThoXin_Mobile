import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DefaultStyles } from '../../styles/DefaultStyles';
import { Colors } from '../../styles/Colors';
import Header from '../components/Header';
import Spacer from '../components/Spacer';
import { ic_balence } from '../../assets';
import FastImage from 'react-native-fast-image';
import SocketUtil from '../../utils/socketUtil';
import { getAppointmentAction } from '../../store/actions/appointmentAction';

const AppointmentInProgress5View = () => {
  const navigation = useNavigation();
  const { data: authData } = useSelector((store: any) => store.auth);

  const dispatch = useDispatch();
  const route = useRoute<any>();
  const { data: appointmentData } = useSelector(
    (store: any) => store.appointment,
  );

  const appointmentInProgress = appointmentData?.appointmentInProgress?.[0];

  useEffect(() => {
    const handleTopUpSuccess = (payload: any) => {
      dispatch(getAppointmentAction({ clientId: authData?.user?._id }));
    };
    SocketUtil.on('transaction.paid_appointment.success', handleTopUpSuccess);

    return () => {
      SocketUtil.off('transaction.top_up.success', handleTopUpSuccess);
    };
  }, []);

  const totalAmount = useMemo(() => {
    if (!appointmentInProgress) return 0;

    let total = appointmentInProgress.laborCost || 0;

    if (appointmentInProgress.additionalIssues?.length > 0) {
      const additionalCost = appointmentInProgress.additionalIssues.reduce(
        (sum: number, issue: any) => sum + (issue.cost || 0),
        0,
      );
      total += additionalCost;
    }

    return total;
  }, [appointmentInProgress]);

  return (
    <SafeAreaView style={DefaultStyles.container}>
      <Header title="Thanh toán" isBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Spacer height={24} />
        <View style={styles.summaryCard}>
          <View style={styles.cardHeader}>
            <FastImage
              source={ic_balence}
              style={styles.iconBalance}
              resizeMode="contain"
            />
            <Text style={styles.cardTitle}>Chi tiết thanh toán</Text>
          </View>

          <Spacer height={16} />

          {/* Labor Cost */}
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Chi phí lao động</Text>
            <Text style={styles.costValue}>
              {(appointmentInProgress.laborCost || 0).toLocaleString('vi-VN')} đ
            </Text>
          </View>

          {appointmentInProgress.additionalIssues?.length > 0 && (
            <>
              <Spacer height={12} />
              <View style={styles.divider} />
              <Spacer height={12} />

              {appointmentInProgress.additionalIssues.map(
                (issue: any, index: number) => (
                  <View key={issue._id || index}>
                    <View style={styles.costRow}>
                      <Text style={styles.costLabel}>{issue.note}</Text>
                      <Text style={styles.costValue}>
                        {(issue.cost || 0).toLocaleString('vi-VN')} đ
                      </Text>
                    </View>
                    {index <
                      appointmentInProgress.additionalIssues.length - 1 && (
                      <>
                        <Spacer height={12} />
                      </>
                    )}
                  </View>
                ),
              )}
            </>
          )}

          <Spacer height={16} />
          <View style={styles.divider} />
          <Spacer height={16} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalAmount}>
              {totalAmount.toLocaleString('vi-VN')} đ
            </Text>
          </View>
        </View>

        <Spacer height={32} />

        <View style={styles.statusBox}>
          <Text style={styles.statusText}>Bạn đã tới bước kề cuối rồi !!!</Text>
          <Spacer height={8} />
          <Text style={styles.statusSubText}>
            Hãy thanh toán số tiền trên với Thợ để hoàn thành yêu cầu của bạn
            của bạn nhé
          </Text>
        </View>

        <Spacer height={40} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AppointmentInProgress5View;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.black01,
  },
  summaryCard: {
    backgroundColor: Colors.whiteFF,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border01,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBalance: {
    width: 24,
    height: 24,
  },
  cardTitle: {
    ...DefaultStyles.textBold18Black,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costLabel: {
    ...DefaultStyles.textMedium14Black,
    flex: 1,
  },
  costValue: {
    ...DefaultStyles.textBold16Black,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border01,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    ...DefaultStyles.textBold16Black,
  },
  totalAmount: {
    ...DefaultStyles.textBold18Black,
    color: Colors.primary,
  },
  statusBox: {
    backgroundColor: Colors.whiteAE,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  statusText: {
    ...DefaultStyles.textBold16Black,
  },
  statusSubText: {
    ...DefaultStyles.textRegular14Black,
  },
  swipeContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  swipeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
});
