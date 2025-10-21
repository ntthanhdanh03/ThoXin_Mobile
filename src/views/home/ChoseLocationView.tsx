import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Mapbox from '@rnmapbox/maps';
import Geolocation from 'react-native-geolocation-service';
import FastImage from 'react-native-fast-image';
import { useNavigation, useRoute } from '@react-navigation/native';

import Button from '../components/Button';
import Spacer from '../components/Spacer';
import { ic_chevron_left } from '../../assets';
import { DefaultStyles } from '../../styles/DefaultStyles';
import { Colors } from '../../styles/Colors';
import { scaleModerate } from '../../styles/scaleDimensions';

Mapbox.setAccessToken(
  'pk.eyJ1IjoibnR0aGFuaGRhbmgiLCJhIjoiY21ldGhobmRwMDNrcTJscjg5YTRveGU0MyJ9.1-2B8UCQL1fjGqTd60Le9A',
);

const MAPBOX_TOKEN =
  'pk.eyJ1IjoibnR0aGFuaGRhbmgiLCJhIjoiY21ldGhobmRwMDNrcTJscjg5YTRveGU0MyJ9.1-2B8UCQL1fjGqTd60Le9A';

const ChoseLocationView = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { onSelectAddress } = route.params || {};

  const cameraRef = useRef<Mapbox.Camera>(null);
  const mapRef = useRef<Mapbox.MapView>(null);

  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [centerCoord, setCenterCoord] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    let watchId: number | null = null;
    let isFirstLocation = true;

    const requestPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission denied');
          return;
        }
      }

      watchId = Geolocation.watchPosition(
        pos => {
          const coords: [number, number] = [
            pos.coords.longitude,
            pos.coords.latitude,
          ];
          setUserLocation(coords);

          // Chỉ zoom vào lần đầu tiên
          if (isFirstLocation) {
            cameraRef.current?.setCamera({
              centerCoordinate: coords,
              zoomLevel: 15,
              animationDuration: 1000,
            });
            isFirstLocation = false;
          }
        },
        err => console.error(err),
        {
          enableHighAccuracy: true,
          distanceFilter: 1,
          interval: 2000,
          fastestInterval: 1000,
        },
      );
    };

    requestPermission();
    return () => {
      if (watchId != null) Geolocation.clearWatch(watchId);
    };
  }, []);

  const fetchAddress = async (lng: number, lat: number) => {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`,
      );
      const json = await res.json();
      if (json.features?.length > 0) {
        setAddress(json.features[0].place_name);
      } else {
        setAddress('Đang tải địa chỉ...');
      }
    } catch (err) {
      console.error(err);
      setAddress('Không thể tải địa chỉ');
    }
  };

  const handleRegionChange = async () => {
    if (mapRef.current) {
      const center = await mapRef.current.getCenter();
      if (center) {
        const coords: [number, number] = [center[0], center[1]];
        setCenterCoord(coords);
        fetchAddress(coords[0], coords[1]);
      }
    }
  };

  const moveToUserLocation = () => {
    if (cameraRef.current && userLocation) {
      cameraRef.current.setCamera({
        centerCoordinate: userLocation,
        zoomLevel: 16,
        animationDuration: 1000,
      });
    }
  };

  const handleConfirm = () => {
    if (address && centerCoord && onSelectAddress) {
      const [lng, lat] = centerCoord;
      onSelectAddress(address, String(lng), String(lat));
    }
    navigation.goBack();
  };

  return (
    <View style={styles.page}>
      {/* Map */}
      <Mapbox.MapView
        ref={mapRef}
        style={styles.map}
        onRegionDidChange={handleRegionChange}
      >
        <Mapbox.Camera ref={cameraRef} zoomLevel={16} />
        <Mapbox.UserLocation visible={true} />
      </Mapbox.MapView>

      <View style={styles.markerContainer}>
        <View style={styles.pinTop}>
          <Text style={styles.pinIcon}>📍</Text>
        </View>
        <View style={styles.pinShadow} />
      </View>

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
          <Text
            style={styles.addressText}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {address || 'Di chuyển bản đồ để chọn địa chỉ'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.myLocationBtn}
        onPress={moveToUserLocation}
        activeOpacity={0.8}
      >
        <Text style={styles.locationIcon}>🎯</Text>
        <Text style={styles.locationText}>Vị trí của tôi</Text>
      </TouchableOpacity>

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
  page: {
    flex: 1,
    backgroundColor: Colors.whiteFF,
  },
  map: { flex: 1 },

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
  pinIcon: {
    fontSize: 36,
  },
  pinShadow: {
    width: 16,
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
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
  backIcon: {
    height: scaleModerate(24),
    width: scaleModerate(24),
  },
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
  locationIcon: {
    fontSize: 20,
    marginRight: scaleModerate(8),
  },
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
  confirmBtn: {
    marginTop: 0,
  },
});
