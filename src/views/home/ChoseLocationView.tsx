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

Mapbox.setAccessToken(
  'pk.eyJ1IjoibnR0aGFuaGRhbmgiLCJhIjoiY21ldGhobmRwMDNrcTJscjg5YTRveGU0MyJ9.1-2B8UCQL1fjGqTd60Le9A',
);
// ================== CONSTANT ==================
const MAPBOX_TOKEN =
  'pk.eyJ1IjoibnR0aGFuaGRhbmgiLCJhIjoiY21ldGhobmRwMDNrcTJscjg5YTRveGU0MyJ9.1-2B8UCQL1fjGqTd60Le9A';

// ================== MAIN COMPONENT ==================
const ChoseLocationView = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { onSelectAddress } = route.params || {};

  // refs
  const cameraRef = useRef<Mapbox.Camera>(null);
  const mapRef = useRef<Mapbox.MapView>(null);

  // state
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [centerCoord, setCenterCoord] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState<string>('');

  // ================== EFFECT: LOCATION ==================
  useEffect(() => {
    let watchId: number | null = null;

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
          cameraRef.current?.moveTo(coords, 500);
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

  // ================== HANDLERS ==================
  const fetchAddress = async (lng: number, lat: number) => {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`,
      );
      const json = await res.json();
      if (json.features?.length > 0) {
        setAddress(json.features[0].place_name);
      } else {
        setAddress('');
      }
    } catch (err) {
      console.error(err);
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
      cameraRef.current.flyTo(userLocation, 1000);
    }
  };

  const handleConfirm = () => {
    if (address && centerCoord && onSelectAddress) {
      const [lng, lat] = centerCoord;
      onSelectAddress(address, String(lng), String(lat));
    }
    navigation.goBack();
  };
  // ================== RENDER ==================
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

      {/* Marker */}
      <View style={styles.centerMarker} />

      {/* Button: My Location */}
      <TouchableOpacity
        style={styles.myLocationBtn}
        onPress={moveToUserLocation}
      >
        <Text style={{ color: '#fff' }}>Vị trí của tôi</Text>
      </TouchableOpacity>

      {/* Popup: Address */}
      <View style={styles.popup}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <FastImage source={ic_chevron_left} style={styles.backIcon} />
        </TouchableOpacity>

        <Spacer width={10} />

        <View style={styles.addressBox}>
          <Text
            style={{
              ...DefaultStyles.textBold12Black,
              maxWidth: 300,
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {address}
          </Text>
        </View>
      </View>

      {/* Confirm Button */}
      <Button
        title="Xác nhận"
        onPress={handleConfirm}
        containerStyle={styles.confirmBtn}
      />
    </View>
  );
};

export default ChoseLocationView;

// ================== STYLES ==================
const styles = StyleSheet.create({
  page: { flex: 1 },
  map: { flex: 1 },

  centerMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -9,
    marginTop: -18,
    width: 18,
    height: 18,
    backgroundColor: 'red',
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#fff',
  },

  myLocationBtn: {
    position: 'absolute',
    right: 20,
    bottom: 120,
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },

  popup: {
    position: 'absolute',
    top: 30,
    left: 10,
    right: 20,
    padding: 12,
    flexDirection: 'row',
  },

  backBtn: {
    backgroundColor: Colors.whiteAE,
    borderRadius: 30,
    padding: 5,
  },
  backIcon: {
    height: 24,
    width: 24,
    alignSelf: 'center',
    justifyContent: 'center',
  },

  addressBox: {
    backgroundColor: Colors.whiteAE,
    borderRadius: 20,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  confirmBtn: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
});
