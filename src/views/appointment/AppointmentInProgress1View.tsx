import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import MapboxGL from '@rnmapbox/maps';
import Geolocation from 'react-native-geolocation-service';
import { Colors } from '../../styles/Colors';
import { DefaultStyles } from '../../styles/DefaultStyles';
import Spacer from '../components/Spacer';
import FastImage from 'react-native-fast-image';
import {
  ic_check_select,
  ic_chevron_left,
  ic_eye_off,
  img_default_avatar,
} from '../../assets';
import { getLocationPartnerAction } from '../../store/actions/locationAction';

const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoibnR0aGFuaGRhbmgiLCJhIjoiY21ldGhobmRwMDNrcTJscjg5YTRveGU0MyJ9.1-2B8UCQL1fjGqTd60Le9A';
MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

const AppointmentInProgress1View = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const { data: appointmentData } = useSelector(
    (store: any) => store.appointment,
  );
  const { data: locationPartner } = useSelector((store: any) => store.location);

  const appointment = appointmentData?.appointmentInProgress?.[0];
  const order = appointment?.orderId;
  const phoneNumber = appointment?.partnerId?.phoneNumber;

  const cameraRef = useRef<MapboxGL.Camera>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [partnerLocation, setPartnerLocation] = useState<
    [number, number] | null
  >(null);
  const [routeCoordinates, setRouteCoordinates] = useState<number[][] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const appointmentInProgress = appointmentData?.appointmentInProgress?.[0];

  const destination: [number, number] | null = useMemo(() => {
    if (!order?.longitude || !order?.latitude) return null;
    const lng = parseFloat(order.longitude);
    const lat = parseFloat(order.latitude);
    return !isNaN(lng) && !isNaN(lat) ? [lng, lat] : null;
  }, [order]);
  useEffect(() => {
    dispatch(
      getLocationPartnerAction({
        partnerId: appointmentInProgress.partnerId._id,
      }),
    );
  }, []);

  useEffect(() => {
    if (locationPartner?.latitude && locationPartner?.longitude) {
      setPartnerLocation([locationPartner.longitude, locationPartner.latitude]);
    }
  }, [locationPartner]);

  useEffect(() => {
    if (!isFocused) return;
    let watchId: number | null = null;

    const requestPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setLoading(false);
          return;
        }
      }

      watchId = Geolocation.watchPosition(
        pos => {
          setUserLocation([pos.coords.longitude, pos.coords.latitude]);
        },
        err => {
          console.error('📍 Location error:', err);
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 10,
          interval: 5000,
          fastestInterval: 3000,
        },
      );
    };

    requestPermission();
    return () => {
      if (watchId != null) Geolocation.clearWatch(watchId);
    };
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused || !partnerLocation || !destination) return;

    const fetchRoute = async () => {
      try {
        setLoading(true);
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${partnerLocation[0]},${partnerLocation[1]};${destination[0]},${destination[1]}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.routes?.length > 0) {
          const route = data.routes[0];
          setRouteCoordinates(route.geometry.coordinates);
          if (cameraRef.current) {
            const bounds = getBounds([partnerLocation, destination]);
            cameraRef.current.fitBounds(
              [bounds.minLng, bounds.minLat],
              [bounds.maxLng, bounds.maxLat],
              [100, 50, 350, 50],
              1000,
            );
          }
        }
      } catch (error) {
        console.error('❌ Error fetching route:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [partnerLocation, destination, isFocused]);

  const getBounds = (coords: [number, number][]) => {
    const lngs = coords.map(c => c[0]);
    const lats = coords.map(c => c[1]);
    return {
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
    };
  };

  const moveToUserLocation = useCallback(() => {
    if (partnerLocation && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: partnerLocation,
        zoomLevel: 16,
        animationDuration: 1000,
      });
    }
  }, [userLocation]);

  const handleNavigationChat = (appointment: any) => {
    const dataRoomChat = {
      roomId: appointment?.roomId,
      avatarUrl: appointment?.partnerId?.avatarUrl,
      fullName: appointment?.partnerId?.fullName,
      partnerId: appointment?.partnerId?._id,
      orderId: appointment?.orderId?._id,
    };
    navigation.navigate(...(['ChatViewVer2', { dataRoomChat }] as never));
  };

  return (
    <View style={styles.mapContainer}>
      {isFocused && partnerLocation && destination ? (
        <MapboxGL.MapView style={styles.map}>
          <MapboxGL.Camera ref={cameraRef} />

          {routeCoordinates && (
            <MapboxGL.ShapeSource
              id="routeSource"
              shape={{
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: routeCoordinates,
                },
              }}
            >
              <MapboxGL.LineLayer
                id="routeLine"
                style={{ lineColor: '#1E88E5', lineWidth: 6 }}
              />
            </MapboxGL.ShapeSource>
          )}

          {partnerLocation && (
            <MapboxGL.PointAnnotation
              id="partnerMarker"
              coordinate={partnerLocation}
            >
              <View
                style={[styles.marker, { backgroundColor: Colors.primary }]}
              />
            </MapboxGL.PointAnnotation>
          )}

          {destination && (
            <MapboxGL.PointAnnotation
              id="destinationMarker"
              coordinate={destination}
            >
              <View style={[styles.marker, { backgroundColor: '#FF3B30' }]} />
            </MapboxGL.PointAnnotation>
          )}
        </MapboxGL.MapView>
      ) : (
        <View style={styles.loadingMap}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}

      <TouchableOpacity
        style={styles.infoCard}
        onPress={() => navigation.goBack()}
      >
        <FastImage source={ic_chevron_left} style={styles.iconButton} />
      </TouchableOpacity>

      <View style={styles.bottomContainer}>
        <View style={{ flexDirection: 'row' }}>
          <FastImage
            source={img_default_avatar}
            style={{ width: 62, height: 62, borderRadius: 31 }}
          />
          <Spacer width={12} />
          <View>
            <Spacer height={5} />
            <Text style={DefaultStyles.textBold16Black}>
              {appointment?.partnerId?.fullName || 'Thợ'}
            </Text>
            <Spacer height={10} />
            <View style={{ flexDirection: 'row', marginBottom: 12 }}>
              <TouchableOpacity
                onPress={() =>
                  phoneNumber && Linking.openURL(`tel:${phoneNumber}`)
                }
              >
                <FastImage source={ic_eye_off} style={styles.iconButton} />
              </TouchableOpacity>
              <Spacer width={10} />
              <TouchableOpacity
                onPress={() => handleNavigationChat(appointment)}
              >
                <FastImage source={ic_check_select} style={styles.iconButton} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={moveToUserLocation} style={styles.meButton}>
        <Text style={styles.meButtonText}>📍</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AppointmentInProgress1View;

const styles = StyleSheet.create({
  mapContainer: { flex: 1, position: 'relative' },
  map: { flex: 1 },
  loadingMap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.whiteAE,
  },
  marker: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderColor: Colors.whiteAE,
    borderWidth: 2,
  },
  iconButton: { height: 24, width: 24 },
  infoCard: {
    position: 'absolute',
    top: 50,
    left: 10,
    backgroundColor: Colors.whiteAE,
    borderRadius: 30,
    padding: 10,
    shadowColor: Colors.black01,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 30,
    left: 10,
    right: 10,
    padding: 15,
    backgroundColor: Colors.whiteAE,
    borderRadius: 12,
    shadowColor: Colors.black01,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  meButton: {
    position: 'absolute',
    bottom: 150,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  meButtonText: { fontSize: 20 },
});
