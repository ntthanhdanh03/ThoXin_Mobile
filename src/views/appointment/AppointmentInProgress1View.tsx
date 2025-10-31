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
  ActivityIndicator,
  StatusBar,
  Linking,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import MapboxGL from '@rnmapbox/maps';
import { Colors } from '../../styles/Colors';
import { DefaultStyles } from '../../styles/DefaultStyles';
import Spacer from '../components/Spacer';
import FastImage from 'react-native-fast-image';
import {
  ic_chat,
  ic_chevron_left,
  ic_phone_native,
  img_default_avatar,
  lottie_delivery,
  lottie_location,
} from '../../assets';
import { getLocationPartnerAction } from '../../store/actions/locationAction';
import LottieView from 'lottie-react-native';
import {
  MAPVIEW_CONFIG,
  CAMERA_CONFIG,
  fetchRoute,
  getDistance,
  getBounds,
  type Coordinate,
} from '../../utils/mapboxUtils';

const mapStyles = {
  routeLine: { lineColor: '#1E88E5', lineWidth: 6 },
};

const MapContent = React.memo(
  ({
    partnerLocation,
    destination,
    routeCoordinates,
    cameraRef,
  }: {
    partnerLocation: Coordinate;
    destination: Coordinate;
    routeCoordinates: number[][] | null;
    cameraRef: React.RefObject<MapboxGL.Camera | null>;
  }) => {
    return (
      <MapboxGL.MapView
        style={styles.map}
        // ✅ Áp dụng config từ utils
        styleURL={MAPVIEW_CONFIG.styleURL}
        compassEnabled={MAPVIEW_CONFIG.compassEnabled}
        scaleBarEnabled={MAPVIEW_CONFIG.scaleBarEnabled}
        logoEnabled={MAPVIEW_CONFIG.logoEnabled}
        attributionEnabled={MAPVIEW_CONFIG.attributionEnabled}
        pitchEnabled={MAPVIEW_CONFIG.pitchEnabled}
        rotateEnabled={MAPVIEW_CONFIG.rotateEnabled}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          animationMode="none"
          minZoomLevel={MAPVIEW_CONFIG.minZoomLevel}
          maxZoomLevel={MAPVIEW_CONFIG.maxZoomLevel}
        />

        {/* Route - update sau */}
        {routeCoordinates && routeCoordinates.length > 0 && (
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
            <MapboxGL.LineLayer id="routeLine" style={mapStyles.routeLine} />
          </MapboxGL.ShapeSource>
        )}

        {/* ✅ Partner marker - update ngay lập tức */}
        {partnerLocation && (
          <MapboxGL.MarkerView id="partnerMarker" coordinate={partnerLocation}>
            <LottieView
              source={lottie_delivery}
              autoPlay
              loop
              style={{
                width: 80,
                height: 80,
              }}
            />
          </MapboxGL.MarkerView>
        )}

        {destination && (
          <MapboxGL.MarkerView id="destinationMarker" coordinate={destination}>
            <LottieView
              source={lottie_location}
              autoPlay
              loop
              style={{
                width: 36,
                height: 36,
              }}
            />
          </MapboxGL.MarkerView>
        )}
      </MapboxGL.MapView>
    );
  },
);

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

  const lastRouteLocationRef = useRef<Coordinate | null>(null);
  const initialCameraSetRef = useRef(false);
  const fetchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isRouteFetchingRef = useRef(false);

  const [partnerLocation, setPartnerLocation] = useState<Coordinate | null>(
    null,
  );
  const [routeCoordinates, setRouteCoordinates] = useState<number[][] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const appointmentInProgress = appointmentData?.appointmentInProgress?.[0];

  const destination: Coordinate | null = useMemo(() => {
    if (!order?.longitude || !order?.latitude) return null;
    const lng = parseFloat(order.longitude);
    const lat = parseFloat(order.latitude);
    return !isNaN(lng) && !isNaN(lat) ? [lng, lat] : null;
  }, [order?.longitude, order?.latitude]);

  const partnerId = useMemo(
    () => appointmentInProgress?.partnerId?._id,
    [appointmentInProgress?.partnerId?._id],
  );

  // ✅ Polling location (giữ nguyên)
  useEffect(() => {
    if (!partnerId || !isFocused) return;

    const pollLocation = () => {
      dispatch(getLocationPartnerAction({ partnerId }));
    };

    pollLocation();
    const intervalId = setInterval(pollLocation, 3000);

    return () => clearInterval(intervalId);
  }, [partnerId, dispatch, isFocused]);

  // ✅ Fetch route sử dụng utils helper
  const fetchRouteInBackground = useCallback(
    async (fromLocation: Coordinate, toLocation: Coordinate) => {
      if (isRouteFetchingRef.current) return;

      isRouteFetchingRef.current = true;

      try {
        const routeData = await fetchRoute(fromLocation, toLocation);

        if (routeData) {
          setRouteCoordinates(routeData.coordinates);
          lastRouteLocationRef.current = fromLocation;
        }
      } catch (error) {
        console.error('❌ Error fetching route:', error);
      } finally {
        isRouteFetchingRef.current = false;
        setLoading(false);
      }
    },
    [],
  );

  // ✅ Update partner location với debounce 5m
  useEffect(() => {
    if (locationPartner?.latitude && locationPartner?.longitude) {
      const newLocation: Coordinate = [
        locationPartner.longitude,
        locationPartner.latitude,
      ];

      setPartnerLocation((prev: any) => {
        if (!prev) {
          return newLocation;
        }

        const dist = getDistance(prev, newLocation);

        // Chỉ update nếu di chuyển > 5m
        if (dist > 5) {
          return newLocation;
        }

        return prev;
      });
      moveToUserLocation();
    }
  }, [locationPartner?.latitude, locationPartner?.longitude]);

  // ✅ Fetch route khi partner di chuyển > 30m
  useEffect(() => {
    if (!isFocused || !partnerLocation || !destination) return;

    // Kiểm tra khoảng cách di chuyển
    if (lastRouteLocationRef.current) {
      const distanceMoved = getDistance(
        lastRouteLocationRef.current,
        partnerLocation,
      );
      if (distanceMoved < 30) {
        return;
      }
    }

    // Debounce 1s trước khi fetch
    if (fetchTimerRef.current) {
      clearTimeout(fetchTimerRef.current);
    }

    fetchTimerRef.current = setTimeout(() => {
      fetchRouteInBackground(partnerLocation, destination);
    }, 500);

    return () => {
      if (fetchTimerRef.current) {
        clearTimeout(fetchTimerRef.current);
      }
    };
  }, [partnerLocation, destination, isFocused, fetchRouteInBackground]);

  // ✅ Initial camera fit bounds (sử dụng utils helper)
  useEffect(() => {
    if (
      !initialCameraSetRef.current &&
      partnerLocation &&
      destination &&
      cameraRef.current
    ) {
      const bounds = getBounds([partnerLocation, destination]);

      cameraRef.current.fitBounds(
        [bounds.minLng, bounds.minLat],
        [bounds.maxLng, bounds.maxLat],
        [100, 50, 350, 50], // padding
        1000, // duration
      );
      initialCameraSetRef.current = true;
    }
  }, [partnerLocation, destination]);

  // ✅ Move to partner location
  const moveToUserLocation = useCallback(() => {
    if (partnerLocation && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: partnerLocation,
        zoomLevel: CAMERA_CONFIG.zoomLevel,
        animationDuration: CAMERA_CONFIG.animationDuration,
      });
    }
  }, [partnerLocation]);

  const handleNavigationChat = useCallback(
    (appointment: any) => {
      const dataRoomChat = {
        roomId: appointment?.roomId,
        avatarUrl: appointment?.partnerId?.avatarUrl,
        fullName: appointment?.partnerId?.fullName,
        partnerId: appointment?.partnerId?._id,
        orderId: appointment?.orderId?._id,
      };
      navigation.navigate(...(['ChatViewVer2', { dataRoomChat }] as never));
    },
    [navigation],
  );

  const handleCall = useCallback(() => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  }, [phoneNumber]);

  return (
    <View style={styles.mapContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {isFocused && destination ? (
        partnerLocation ? (
          <MapContent
            partnerLocation={partnerLocation}
            destination={destination}
            routeCoordinates={routeCoordinates}
            cameraRef={cameraRef}
          />
        ) : (
          <View style={styles.loadingMap}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Đang tìm vị trí thợ...</Text>
          </View>
        )
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
            source={
              appointment?.partnerId?.avatarUrl
                ? { uri: appointment.partnerId.avatarUrl }
                : img_default_avatar
            }
            style={{ width: 62, height: 62, borderRadius: 31 }}
          />
          <Spacer width={12} />
          <View>
            <Spacer height={5} />
            <Text style={DefaultStyles.textBold16Black}>
              {appointment?.partnerId?.fullName || 'Thợ'}
            </Text>

            <Spacer height={8} />
            <View style={{ flexDirection: 'row', marginBottom: 12 }}>
              <TouchableOpacity onPress={handleCall}>
                <FastImage source={ic_phone_native} style={styles.iconButton} />
              </TouchableOpacity>
              <Spacer width={14} />
              <TouchableOpacity
                onPress={() => handleNavigationChat(appointment)}
              >
                <FastImage source={ic_chat} style={styles.iconButton} />
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
  loadingText: {
    marginTop: 10,
    ...DefaultStyles.textRegular14Gray,
  },
  marker: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderColor: Colors.whiteAE,
    borderWidth: 2,
  },
  iconButton: { height: 28, width: 28 },
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
