
import React, { useEffect, useState } from 'react';
import {
  StatusBar, View, StyleSheet, Text, Modal, TouchableOpacity,
} from 'react-native';
import {
  Poppins_100Thin, Poppins_100Thin_Italic,
  Poppins_200ExtraLight, Poppins_200ExtraLight_Italic,
  Poppins_300Light, Poppins_300Light_Italic,
  Poppins_400Regular, Poppins_400Regular_Italic,
  Poppins_500Medium, Poppins_500Medium_Italic,
  Poppins_600SemiBold, Poppins_600SemiBold_Italic,
  Poppins_700Bold, Poppins_700Bold_Italic,
  Poppins_800ExtraBold, Poppins_800ExtraBold_Italic,
  Poppins_900Black, Poppins_900Black_Italic,
  useFonts,
} from "@expo-google-fonts/poppins";
import NetInfo from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from './src/screens/constants/ToastContainer';
export default function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [fontsLoaded] = useFonts({
    Poppins_100Thin, Poppins_100Thin_Italic,
    Poppins_200ExtraLight, Poppins_200ExtraLight_Italic,
    Poppins_300Light, Poppins_300Light_Italic,
    Poppins_400Regular, Poppins_400Regular_Italic,
    Poppins_500Medium, Poppins_500Medium_Italic,
    Poppins_600SemiBold, Poppins_600SemiBold_Italic,
    Poppins_700Bold, Poppins_700Bold_Italic,
    Poppins_800ExtraBold, Poppins_800ExtraBold_Italic,
    Poppins_900Black, Poppins_900Black_Italic,
  });


  // ✅ FORCE INITIAL CHECK
  useEffect(() => {
    const check = async () => {
      const state = await NetInfo.fetch();
      const online = !!state.isConnected;

      setShowPopup(!online);
    };

    check();
  }, []);

  // ✅ LIVE LISTENER
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = !!state.isConnected;
      setShowPopup(!online);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0B1220" />

      <View style={styles.container}>
        <ToastProvider>

          <NavigationContainer>
            <StackNavigator />
          </NavigationContainer>
        </ToastProvider>
        <Modal
          visible={showPopup}
          transparent
          animationType="fade"
          statusBarTranslucent
        >
          <View style={styles.overlay}>
            <View style={styles.popup}>

              <Text style={styles.title}>No Internet Connection</Text>

              <Text style={styles.message}>
                Please check your network and try again.
              </Text>

              <TouchableOpacity
                style={styles.button}
                onPress={async () => {
                  const state = await NetInfo.fetch();
                  const online = !!state.isConnected;

                  if (online) {
                    setShowPopup(false);
                  }
                }}
              >
                <Text style={styles.buttonText}>Retry</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B1220',
  },

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, // 🔥 important
  },

  popup: {
    width: '85%',
    backgroundColor: '#1C1F2E',
    padding: 22,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF4C4C',
    marginBottom: 10,
  },

  message: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },

  button: {
    backgroundColor: '#FF4C4C',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },

  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});