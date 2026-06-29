import React, { useEffect } from 'react';
import {
  View,
  Text, StyleSheet, Image, TouchableOpacity,
  NativeModules, PermissionsAndroid, Platform,
  Alert,
} from 'react-native';
import { hp, wp } from '../resources/dimensions';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing,
} from 'react-native-reanimated';
const { ReminderNotifier } = NativeModules;
const ensureNotificationPermission = async () => {
  if (Platform.OS !== 'android') return true;

  if (Platform.Version < 33) return true;

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    {
      title: 'Notification Permission',
      message: 'Allow Amigo Digi Gold to show reminder notifications.',
      buttonPositive: 'Allow',
      buttonNegative: 'Deny',
    }
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
};
const ensureFullScreenIntentPermission = async () => {
  if (Platform.OS !== 'android') return true;
  if (!ReminderNotifier?.hasFullScreenIntentPermission) return true;

  const granted = await ReminderNotifier.hasFullScreenIntentPermission();
  if (!granted) {
    Alert.alert(
      'Permission Required',
      'Please allow "Display over other apps / full-screen alerts" for this app in Settings.',
      [
        {
          text: 'Open Settings',
          onPress: () => ReminderNotifier.openFullScreenIntentSettings(),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
    return false;
  }
  return true;
};

export default function SplashScreen({ navigation }) {
  /* Animation shared values */
  const logoScale = useSharedValue(0.6);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  useEffect(() => {
    logoScale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.exp) });
    logoOpacity.value = withTiming(1, { duration: 800 });
    textOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
    textTranslateY.value = withDelay(500, withTiming(0, { duration: 600 }));
  }, []);
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('MainTabs');
    }
      , 3000);
  }, []);


  const handleReminderPress = async () => {
    try {
      // ── Guard: native module present ────────────────────────
      if (!ReminderNotifier?.showReminderNow) {
        console.warn('❌ ReminderNotifier native module not found');
        Alert.alert('Error', 'ReminderNotifier module is not linked. Rebuild the app.');
        return;
      }

      // ── Guard: POST_NOTIFICATIONS ───────────────────────────
      const notifOk = await ensureNotificationPermission();
      if (!notifOk) {
        console.warn('❌ POST_NOTIFICATIONS denied');
        return;
      }
      // ── Guard: USE_FULL_SCREEN_INTENT ───────────────────────
      const fsiOk = await ensureFullScreenIntentPermission();
      if (!fsiOk) {
        console.warn('❌ USE_FULL_SCREEN_INTENT not granted — redirected to settings');
        return;
      }
      // ── Fire: schedule full-screen intent in 4 seconds ──────
      //   showReminderNow(title, description, soundName, loopSound, delaySeconds)
      //   soundName: pass "" (empty string) for default alarm tone
      await ReminderNotifier.showReminderNow(
        'Test Reminder',          // title
        'Runs after 1 seconds',   // description
        '',                       // soundName  ← "" means default alarm tone
        true,                     // loopSound
        3,                        // delaySeconds  ← alarm fires in 4 s
      );
    } catch (e) {
      console.error('❌ Reminder error:', e);
      Alert.alert('Reminder Error', e?.message ?? String(e));
    }
  };

  /* ── Animated styles ── */
  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  /* ── Render ── */
  return (
    <View style={styles.container}>

      <Animated.View style={logoStyle}>
        <Image
          source={require('../../assets/amigoLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <TouchableOpacity style={styles.button} onPress={handleReminderPress}>
        <Text style={styles.buttonText}>Trigger Reminder (4 sec)</Text>
      </TouchableOpacity>

      <Animated.View style={textStyle}>
        <Text style={styles.text}>Amigo Digi Gold</Text>
      </Animated.View>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#006D5B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: wp(40),
    height: hp(20),
    marginBottom: wp(3),
  },
  button: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    marginVertical: 20,
  },
  buttonText: {
    color: '#006D5B',
    fontWeight: '700',
    fontSize: wp(4),
  },
  text: {
    color: '#fff',
    letterSpacing: 1,
    fontSize: wp(6),
    fontFamily: 'Poppins_600SemiBold',
  },
});
