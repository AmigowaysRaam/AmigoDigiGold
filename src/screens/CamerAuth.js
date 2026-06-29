import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';

import {
  CameraView,
  useCameraPermissions,
} from 'expo-camera';

import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

export default function BiometricTestScreen() {
  const cameraRef = useRef(null);

  const [permission, requestPermission] =
    useCameraPermissions();

  const [imageUri, setImageUri] = useState(null);
  const [publicKey, setPublicKey] = useState('');
  const [signature, setSignature] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    createBiometricKeys();
  }, []);
  const createBiometricKeys = async () => {
    try {
      const { keysExist } =
        await rnBiometrics.biometricKeysExist();
        const check = await rnBiometrics.isSensorAvailable();
console.log('Sensor:', check);
const keys = await rnBiometrics.biometricKeysExist();
console.log('Keys Exist:', keys);
      if (!keysExist) {
        const result =
          await rnBiometrics.createKeys();
        setPublicKey(result.publicKey);
      } else {
        setPublicKey(
          'Biometric keys already exist'
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const captureAndAuthenticate = async () => {
    try {
      setLoading(true);

      const photo =
        await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });

      setImageUri(photo.uri);

      const payload =
        `attendance-${Date.now()}`;

      const result =
        await rnBiometrics.createSignature({
          promptMessage: 'Verify Attendance',
          payload,
        });

      if (result.success) {
        setSignature(result.signature);
      } else {
        setSignature(
          'Authentication cancelled'
        );
      }
    } catch (error) {
      console.log(error);

      setSignature(
        `Error: ${error?.message || error}`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <TouchableOpacity
          style={styles.button}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>
            Grant Camera Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!imageUri ? (
        <>
          <CameraView
            ref={cameraRef}
            facing="front"
            style={styles.camera}
          />

          <TouchableOpacity
            style={styles.captureButton}
            disabled={loading}
            onPress={captureAndAuthenticate}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                Capture & Verify
              </Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <ScrollView
          contentContainerStyle={
            styles.resultContainer
          }
        >
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
          />

          <Text style={styles.heading}>
            Public Key
          </Text>

          <Text style={styles.dataText}>
            {publicKey}
          </Text>

          <Text style={styles.heading}>
            Signature
          </Text>

          <Text style={styles.dataText}>
            {signature}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setImageUri(null);
              setSignature('');
            }}
          >
            <Text style={styles.buttonText}>
              Capture Again
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  camera: {
    flex: 1,
  },

  captureButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#006D5B',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 10,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    backgroundColor: '#006D5B',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  resultContainer: {
    padding: 20,
    alignItems: 'center',
  },

  image: {
    width: 280,
    height: 350,
    borderRadius: 12,
    marginBottom: 20,
  },

  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },

  dataText: {
    fontSize: 12,
    width: '100%',
    marginBottom: 15,
  },
});