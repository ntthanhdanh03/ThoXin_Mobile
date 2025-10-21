import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  Pressable,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { ic_close } from '../../assets';
import Line from '../components/Line';
import Spacer from '../components/Spacer';

const { height } = Dimensions.get('window');

const CustomModal = ({ visible, onClose, children, configHeight }: any) => {
  const translateY = useRef(new Animated.Value(height)).current;
  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShow(true);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShow(false));
    }
  }, [visible]);

  if (!show) return null;

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={{ flex: 1 }} />
      </Pressable>

      <Animated.View
        style={[styles.container, { transform: [{ translateY }] }]}
      >
        <View
          style={[styles.content, { height: height * (configHeight || 0.5) }]}
        >
          <TouchableOpacity style={{ width: 30 }} onPress={onClose}>
            <FastImage style={{ height: 26, width: 26 }} source={ic_close} />
          </TouchableOpacity>
          <Spacer height={6} />
          <Line />
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  container: {
    width: '100%',
  },
  content: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
});
