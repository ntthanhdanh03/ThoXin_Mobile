import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import ImageViewing from 'react-native-image-viewing';

import Header from '../components/Header';
import Spacer from '../components/Spacer';
import StarsView from '../components/StarsView';
import { DefaultStyles } from '../../styles/DefaultStyles';
import { Colors } from '../../styles/Colors';
import { scaleModerate } from '../../styles/scaleDimensions';
import { img_default_avatar } from '../../assets';
import { getRateAction } from '../../store/actions/rateAction';

const DetailApplicantView = ({ route }: any) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { applicantData } = route.params;

  const [ratingData, setRatingData] = useState<any>(null);

  useEffect(() => {
    dispatch(
      getRateAction({ partnerId: applicantData.partnerId }, (data: any) => {
        if (data) setRatingData(data);
      }),
    );
  }, [applicantData.partnerId, dispatch]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const renderRateItem = ({ item }: any) => {
    const createdDate = formatDate(item.createdAt);

    return (
      <View style={styles.rateCard}>
        <View style={styles.rateHeader}>
          <FastImage
            source={
              item.clientId?.avatarUrl
                ? { uri: item.clientId.avatarUrl }
                : img_default_avatar
            }
            style={styles.avatarImage}
          />
          <View style={styles.headerInfo}>
            <Text style={DefaultStyles.textMedium16Black}>
              {item.clientId?.fullName || 'Khách hàng'}
            </Text>
            <Text style={[DefaultStyles.textRegular13Gray, { marginTop: 2 }]}>
              {createdDate}
            </Text>
          </View>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.starSmall}>⭐</Text>
          </View>
        </View>

        <Spacer height={8} />
        <StarsView number={item.rating} />

        {item.comment && (
          <>
            <Spacer height={10} />
            <Text style={DefaultStyles.textRegular14Black}>{item.comment}</Text>
          </>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={DefaultStyles.container}>
      <Header isBack title="Chi tiết Thợ" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: scaleModerate(20) }}
      >
        {/* --- Hồ sơ thợ --- */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            {applicantData.avatarUrl ? (
              <FastImage
                source={{ uri: applicantData.avatarUrl }}
                style={styles.profileAvatar}
              />
            ) : (
              <View style={[styles.profileAvatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarText}>
                  {applicantData.name?.charAt(0).toUpperCase() || 'T'}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.name}>{applicantData.name}</Text>
        </View>

        {/* --- Danh sách đánh giá --- */}
        {ratingData?.rates?.length > 0 ? (
          <View style={styles.reviewsSection}>
            <Text style={styles.reviewsTitle}>Đánh giá từ khách hàng</Text>
            <FlatList
              data={ratingData.rates}
              renderItem={renderRateItem}
              keyExtractor={item => item._id}
              scrollEnabled={false}
            />
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Spacer height={10} />
            <Text style={DefaultStyles.textMedium16Black}>
              Chưa có đánh giá nào
            </Text>
            <Spacer height={6} />
            <Text
              style={[DefaultStyles.textRegular14Gray, { textAlign: 'center' }]}
            >
              Các đánh giá của khách hàng sẽ hiển thị tại đây
            </Text>
          </View>
        )}

        <ImageViewing
          images={[]}
          imageIndex={0}
          visible={false}
          onRequestClose={() => {}}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailApplicantView;

const styles = StyleSheet.create({
  profileSection: {
    alignItems: 'center',
    paddingTop: scaleModerate(10),
    paddingBottom: scaleModerate(10),
    backgroundColor: Colors.whiteFF,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border01,
  },
  avatarWrapper: {
    marginBottom: scaleModerate(12),
  },
  profileAvatar: {
    width: scaleModerate(80),
    height: scaleModerate(80),
    borderRadius: scaleModerate(50),
    backgroundColor: Colors.grayF5,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary300,
  },
  avatarText: {
    fontSize: scaleModerate(40),
    fontWeight: '700',
    color: Colors.whiteFF,
  },
  name: {
    ...DefaultStyles.textMedium18Black,
  },
  reviewsSection: {
    paddingHorizontal: scaleModerate(16),
    paddingTop: scaleModerate(20),
  },
  reviewsTitle: {
    ...DefaultStyles.textBold16Black,
  },
  rateCard: {
    backgroundColor: Colors.whiteFF,
    borderRadius: 12,
    padding: scaleModerate(16),
    marginTop: scaleModerate(12),
    borderWidth: 1,
    borderColor: Colors.border01,
  },
  rateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: scaleModerate(48),
    height: scaleModerate(48),
    borderRadius: scaleModerate(24),
    marginRight: scaleModerate(10),
  },
  headerInfo: {
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.yellowFFF,
    paddingHorizontal: scaleModerate(10),
    paddingVertical: scaleModerate(4),
    borderRadius: 20,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.yellowDC,
  },
  starSmall: {
    fontSize: 13,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scaleModerate(60),
  },
  emptyIcon: {
    fontSize: 60,
  },
});
