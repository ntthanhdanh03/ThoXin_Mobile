import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Mapbox from '@rnmapbox/maps';
import Geolocation from 'react-native-geolocation-service';
import FastImage from 'react-native-fast-image';
import { useNavigation, useRoute } from '@react-navigation/native';
import Button from '../components/Button';
import { ic_chevron_left } from '../../assets';
import { DefaultStyles } from '../../styles/DefaultStyles';
import { Colors } from '../../styles/Colors';
import { scaleModerate } from '../../styles/scaleDimensions';
import {
  MAPVIEW_CONFIG,
  CAMERA_CONFIG,
  HCMC_CENTER,
  HCMC_BOUNDS,
  fetchAddress,
  type Coordinate,
} from '../../utils/mapboxUtils';

const ChoseLocationView = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { onSelectAddress } = route.params || {};

  const mapRef = useRef<Mapbox.MapView>(null);
  const cameraRef = useRef<Mapbox.Camera>(null);

  const [userLocation, setUserLocation] = useState<Coordinate | null>(null);
  const [centerCoord, setCenterCoord] = useState<Coordinate | null>(null);
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchKey = useRef<string>('');

  /** 🧭 Lấy vị trí 1 lần duy nhất khi vào màn hình */
  useEffect(() => {
    const getPermissionAndLocation = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Location permission denied');
            setUserLocation(HCMC_CENTER);
            setLoading(false);
            return;
          }
        }

        Geolocation.getCurrentPosition(
          pos => {
            const coords: Coordinate = [
              pos.coords.longitude,
              pos.coords.latitude,
            ];
            setUserLocation(coords);
            setLoading(false);

            // ✅ Dùng config từ utils
            cameraRef.current?.setCamera({
              centerCoordinate: coords,
              zoomLevel: CAMERA_CONFIG.zoomLevel,
              animationDuration: CAMERA_CONFIG.animationDuration,
            });
          },
          err => {
            console.log('Error getting location:', err);
            setUserLocation(HCMC_CENTER);
            setLoading(false);
          },
          { enableHighAccuracy: true, timeout: 10000 },
        );
      } catch (e) {
        console.error(e);
        setUserLocation(HCMC_CENTER);
        setLoading(false);
      }
    };

    getPermissionAndLocation();
  }, []);

  /** 🧩 Fetch địa chỉ (có kiểm duplicate & debounce) */
  const handleFetchAddress = useCallback(async (lng: number, lat: number) => {
    // Kiểm tra duplicate request
    const key = `${lng.toFixed(5)},${lat.toFixed(5)}`;
    if (key === lastFetchKey.current) return;
    lastFetchKey.current = key;

    // Gọi utils helper
    const result = await fetchAddress(lng, lat);
    setAddress(result);
  }, []);

  /** 🗺️ Xử lý khi map dừng di chuyển */
  const handleRegionChange = useCallback(async () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // ✅ Debounce từ config
    debounceRef.current = setTimeout(async () => {
      if (!mapRef.current) return;

      const center = await mapRef.current.getCenter();
      if (!center) return;

      const coords: Coordinate = [center[0], center[1]];
      setCenterCoord(coords);
      handleFetchAddress(coords[0], coords[1]);
    }, MAPVIEW_CONFIG.regionDidChangeDebounceTime || 800);
  }, [handleFetchAddress]);

  /** 🎯 Di chuyển về vị trí của tôi */
  const moveToUser = () => {
    if (userLocation && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: userLocation,
        zoomLevel: CAMERA_CONFIG.zoomLevel,
        animationDuration: CAMERA_CONFIG.animationDuration,
      });
    }
  };

  /** ✅ Xác nhận địa chỉ */
  const handleConfirm = () => {
    if (address && centerCoord && onSelectAddress) {
      const [lng, lat] = centerCoord;
      onSelectAddress(address, String(lng), String(lat));
    }
    navigation.goBack();
  };

  return (
    <View style={styles.page}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text>Đang lấy vị trí...</Text>
        </View>
      ) : (
        <Mapbox.MapView
          ref={mapRef}
          style={styles.map}
          onRegionDidChange={handleRegionChange}
          // ✅ Áp dụng config từ utils để giảm tiles
          styleURL={MAPVIEW_CONFIG.styleURL}
          compassEnabled={MAPVIEW_CONFIG.compassEnabled}
          logoEnabled={MAPVIEW_CONFIG.logoEnabled}
          attributionEnabled={MAPVIEW_CONFIG.attributionEnabled}
          scaleBarEnabled={MAPVIEW_CONFIG.scaleBarEnabled}
          pitchEnabled={MAPVIEW_CONFIG.pitchEnabled}
          rotateEnabled={MAPVIEW_CONFIG.rotateEnabled}
        >
          <Mapbox.Camera
            ref={cameraRef}
            zoomLevel={CAMERA_CONFIG.zoomLevel}
            centerCoordinate={userLocation || HCMC_CENTER}
            minZoomLevel={MAPVIEW_CONFIG.minZoomLevel}
            maxZoomLevel={MAPVIEW_CONFIG.maxZoomLevel}
            // ✅ Giới hạn bounds để không pan ra ngoài HCM
            bounds={{
              ne: HCMC_BOUNDS.ne,
              sw: HCMC_BOUNDS.sw,
            }}
            padding={{
              paddingTop: 50,
              paddingBottom: 50,
              paddingLeft: 50,
              paddingRight: 50,
            }}
          />
          <Mapbox.UserLocation visible={true} />
        </Mapbox.MapView>
      )}

      {/* 📍 Pin marker */}
      <View style={styles.markerContainer}>
        <View style={styles.pinTop}>
          <Text style={styles.pinIcon}>📍</Text>
        </View>
        <View style={styles.pinShadow} />
      </View>

      {/* 🔙 Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <FastImage source={ic_chevron_left} style={styles.backIcon} />
        </TouchableOpacity>

        <View style={styles.addressCard}>
          <Text style={styles.addressLabel}>📌 Địa chỉ đã chọn</Text>
          <Text style={styles.addressText} numberOfLines={2}>
            {address || 'Di chuyển bản đồ để chọn địa chỉ'}
          </Text>
        </View>
      </View>

      {/* 🎯 Nút về vị trí của tôi */}
      <TouchableOpacity
        style={styles.myLocationBtn}
        onPress={moveToUser}
        activeOpacity={0.8}
      >
        <Text style={styles.locationIcon}>🎯</Text>
        <Text style={styles.locationText}>Vị trí của tôi</Text>
      </TouchableOpacity>

      {/* 🧾 Nút xác nhận */}
      <View style={styles.bottomContainer}>
        <Button
          title="Xác nhận địa chỉ"
          onPress={handleConfirm}
          containerStyle={styles.confirmBtn}
        />
      </View>
    </View>
  );
};

export default ChoseLocationView;

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: Colors.whiteFF },
  map: { flex: 1 },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  markerContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    alignItems: 'center',
  },
  pinTop: {
    marginLeft: -20,
    marginTop: -40,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinIcon: { fontSize: 36 },
  pinShadow: {
    width: 16,
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
    marginTop: 2,
  },

  header: {
    position: 'absolute',
    top: scaleModerate(40),
    left: scaleModerate(16),
    right: scaleModerate(16),
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  backBtn: {
    backgroundColor: Colors.whiteFF,
    borderRadius: scaleModerate(24),
    width: scaleModerate(40),
    height: scaleModerate(40),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  backIcon: { height: scaleModerate(24), width: scaleModerate(24) },

  addressCard: {
    flex: 1,
    backgroundColor: Colors.whiteFF,
    borderRadius: scaleModerate(16),
    padding: scaleModerate(16),
    marginLeft: scaleModerate(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  addressLabel: {
    ...DefaultStyles.textMedium12Black,
    color: Colors.gray72,
    marginBottom: scaleModerate(6),
  },
  addressText: {
    ...DefaultStyles.textMedium14Black,
    color: Colors.black1B,
    lineHeight: 20,
  },

  myLocationBtn: {
    position: 'absolute',
    right: scaleModerate(16),
    bottom: scaleModerate(100),
    backgroundColor: Colors.whiteFF,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scaleModerate(16),
    paddingVertical: scaleModerate(12),
    borderRadius: scaleModerate(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  locationIcon: { fontSize: 20, marginRight: scaleModerate(8) },
  locationText: {
    ...DefaultStyles.textMedium14Black,
    color: Colors.primary,
  },

  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: scaleModerate(16),
    paddingBottom: scaleModerate(30),
    paddingHorizontal: scaleModerate(16),
    borderTopLeftRadius: scaleModerate(24),
    borderTopRightRadius: scaleModerate(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  confirmBtn: { marginTop: 0 },
});
