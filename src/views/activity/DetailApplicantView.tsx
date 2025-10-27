import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { DefaultStyles } from '../../styles/DefaultStyles';
import Spacer from '../components/Spacer';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../styles/Colors';
import { scaleModerate } from '../../styles/scaleDimensions';
import Header from '../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { getRateAction } from '../../store/actions/rateAction';

const DetailApplicantView = ({ route }: any) => {
  const dispatch = useDispatch();

  const { applicantData } = route.params;
  const { data: authData } = useSelector((store: any) => store.auth);
  const navigation = useNavigation();
  const [ratingData, setRatingData] = useState<any>(null);

  useEffect(() => {
    console.log('applicantData', applicantData);
    dispatch(
      getRateAction({ partnerId: applicantData.partnerId }, (data: any) => {
        if (data) {
          console.log(data);
          setRatingData(data);
        }
      }),
    );
  }, []);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(parseFloat(price));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map(star => (
          <Text key={star} style={styles.star}>
            {star <= rating ? '★' : '☆'}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={DefaultStyles.container}>
      <Header isBack title="Chi tiết Thợ" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            {applicantData.avatarUrl ? (
              <Image
                source={{ uri: applicantData.avatarUrl }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarText}>
                  {applicantData.name?.charAt(0).toUpperCase() || 'T'}
                </Text>
              </View>
            )}
            {ratingData && (
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingBadgeText}>
                  ★ {parseFloat(ratingData.averageRating).toFixed(1)}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.name}>{applicantData.name}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Giá đề nghị</Text>
              <Text style={styles.infoValue}>
                {formatPrice(applicantData.offeredPrice)}
              </Text>
            </View>
            {ratingData && <View style={styles.divider} />}
            {ratingData && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Đánh giá</Text>
                <Text style={styles.infoValue}>{ratingData.total} lượt</Text>
              </View>
            )}
          </View>
        </View>

        {/* Reviews List */}
        {ratingData && ratingData.rates && ratingData.rates.length > 0 && (
          <View style={styles.reviewsSection}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.reviewsTitle}>Đánh giá từ khách hàng</Text>
              <View style={styles.ratingChip}>
                <Text style={styles.ratingChipText}>
                  ★ {parseFloat(ratingData.averageRating).toFixed(1)}
                </Text>
              </View>
            </View>

            {ratingData.rates.map((review: any, index: number) => (
              <View key={review._id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewerInfo}>
                    {review.clientId?.avatarUrl ? (
                      <Image
                        source={{ uri: review.clientId.avatarUrl }}
                        style={styles.reviewerAvatar}
                      />
                    ) : (
                      <View
                        style={[
                          styles.reviewerAvatar,
                          styles.reviewerAvatarPlaceholder,
                        ]}
                      >
                        <Text style={styles.reviewerAvatarText}>
                          {review.clientId?.fullName?.charAt(0).toUpperCase() ||
                            'K'}
                        </Text>
                      </View>
                    )}
                    <View style={styles.reviewerDetails}>
                      <Text style={styles.reviewerName}>
                        {review.clientId?.fullName || 'Khách hàng'}
                      </Text>
                      <View style={styles.ratingRow}>
                        {renderStars(review.rating)}
                        <Text style={styles.reviewDate}>
                          {' '}
                          • {formatDate(review.createdAt)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {review.comment && review.comment.trim() !== '' && (
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                )}

                {review.images && review.images.length > 0 && (
                  <ScrollView
                    horizontal
                    style={styles.reviewImagesContainer}
                    showsHorizontalScrollIndicator={false}
                  >
                    {review.images.map((img: string, imgIndex: number) => (
                      <Image
                        key={imgIndex}
                        source={{ uri: img }}
                        style={styles.reviewImage}
                      />
                    ))}
                  </ScrollView>
                )}
              </View>
            ))}
          </View>
        )}

        <Spacer height={30} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailApplicantView;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.grayF5,
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: scaleModerate(32),
    paddingBottom: scaleModerate(24),
    paddingHorizontal: scaleModerate(20),
    backgroundColor: Colors.whiteFF,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: scaleModerate(16),
  },
  avatar: {
    width: scaleModerate(110),
    height: scaleModerate(110),
    borderRadius: scaleModerate(55),
    borderWidth: 4,
    borderColor: Colors.whiteFF,
    shadowColor: Colors.black1B,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.primary300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: scaleModerate(44),
    fontWeight: '700',
    color: Colors.whiteFF,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.yellow00,
    paddingHorizontal: scaleModerate(10),
    paddingVertical: scaleModerate(4),
    borderRadius: scaleModerate(20),
    borderWidth: 3,
    borderColor: Colors.whiteFF,
  },
  ratingBadgeText: {
    fontSize: scaleModerate(14),
    fontWeight: '700',
    color: Colors.whiteFF,
  },
  name: {
    fontSize: scaleModerate(26),
    fontWeight: '700',
    color: Colors.black1B,
    marginBottom: scaleModerate(20),
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grayF5F,
    borderRadius: scaleModerate(16),
    padding: scaleModerate(16),
    width: '100%',
    marginBottom: scaleModerate(16),
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: scaleModerate(13),
    color: Colors.gray72,
    marginBottom: scaleModerate(6),
    fontWeight: '500',
  },
  infoValue: {
    fontSize: scaleModerate(18),
    fontWeight: '700',
    color: Colors.primary300,
  },
  divider: {
    width: 1,
    height: scaleModerate(40),
    backgroundColor: Colors.border01,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    padding: scaleModerate(16),
    backgroundColor: Colors.yellowFFF,
    borderRadius: scaleModerate(12),
    borderLeftWidth: 4,
    borderLeftColor: Colors.yellow00,
  },
  noteIcon: {
    fontSize: scaleModerate(20),
    marginRight: scaleModerate(10),
  },
  noteText: {
    flex: 1,
    fontSize: scaleModerate(14),
    color: Colors.gray444,
    lineHeight: scaleModerate(20),
  },
  reviewsSection: {
    paddingHorizontal: scaleModerate(16),
    paddingTop: scaleModerate(20),
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaleModerate(16),
  },
  reviewsTitle: {
    fontSize: scaleModerate(20),
    fontWeight: '700',
    color: Colors.black1B,
  },
  ratingChip: {
    backgroundColor: Colors.yellow00,
    paddingHorizontal: scaleModerate(12),
    paddingVertical: scaleModerate(6),
    borderRadius: scaleModerate(20),
  },
  ratingChipText: {
    fontSize: scaleModerate(14),
    fontWeight: '700',
    color: Colors.whiteFF,
  },
  reviewCard: {
    backgroundColor: Colors.whiteFF,
    padding: scaleModerate(16),
    borderRadius: scaleModerate(16),
    marginBottom: scaleModerate(12),
    shadowColor: Colors.black1B,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  reviewHeader: {
    marginBottom: scaleModerate(12),
  },
  reviewerInfo: {
    flexDirection: 'row',
  },
  reviewerAvatar: {
    width: scaleModerate(48),
    height: scaleModerate(48),
    borderRadius: scaleModerate(24),
    marginRight: scaleModerate(12),
  },
  reviewerAvatarPlaceholder: {
    backgroundColor: Colors.gray82,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewerAvatarText: {
    fontSize: scaleModerate(20),
    fontWeight: '700',
    color: Colors.whiteFF,
  },
  reviewerDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  reviewerName: {
    fontSize: scaleModerate(16),
    fontWeight: '600',
    color: Colors.black1B,
    marginBottom: scaleModerate(4),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: scaleModerate(16),
    color: Colors.yellow00,
    marginRight: scaleModerate(2),
  },
  reviewDate: {
    fontSize: scaleModerate(13),
    color: Colors.gray72,
  },
  reviewComment: {
    fontSize: scaleModerate(15),
    color: Colors.gray444,
    lineHeight: scaleModerate(22),
    marginBottom: scaleModerate(12),
  },
  reviewImagesContainer: {
    marginTop: scaleModerate(8),
  },
  reviewImage: {
    width: scaleModerate(100),
    height: scaleModerate(100),
    borderRadius: scaleModerate(12),
    marginRight: scaleModerate(8),
  },
  signUp: {
    ...DefaultStyles.textRegular16Black,
    color: Colors.primary300,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
