import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Animated,
} from 'react-native';
import { COLORS } from '../resources/colors';
import { hp, wp } from '../resources/dimensions';

export default function OTPVerificationModal({
  visible,
  phone,
  onClose,
  onVerifySuccess,
}) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const inputRefs = useRef([]);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleOTPChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (
      e.nativeEvent.key === 'Backspace' &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const validateOTP = () => {
    const enteredOTP = otp.join('');

    if (enteredOTP.length !== 6) {
      setError('Please enter valid 6 digit OTP');
      shake();
      return;
    }

    /**
     * Replace with API OTP verification
     */
    if (enteredOTP !== '123456') {
      setError('Invalid OTP');
      shake();
      return;
    }

    setOtp(['', '', '', '', '', '']);
    setError('');
    onVerifySuccess();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Verify OTP</Text>

          <Text style={styles.subtitle}>
            OTP sent to {phone}
          </Text>

          <Animated.View
            style={{
              flexDirection: 'row',
              transform: [{ translateX: shakeAnim }],
            }}
          >
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => (inputRefs.current[index] = ref)}
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={value =>
                  handleOTPChange(value, index)
                }
                onKeyPress={e =>
                  handleKeyPress(e, index)
                }
              />
            ))}
          </Animated.View>

          {!!error && (
            <Text style={styles.errorText}>
              {error}
            </Text>
          )}

          <Pressable
            style={styles.verifyButton}
            onPress={validateOTP}
          >
            <Text style={styles.verifyText}>
              Verify OTP
            </Text>
          </Pressable>

          <Pressable onPress={onClose}>
            <Text style={styles.cancelText}>
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    width: '90%',
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 20,
  },

  title: {
    color: '#FFF',
    fontSize: wp(5),
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
  },

  subtitle: {
    color: '#FFF',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 25,
  },

  otpInput: {
    width: wp(11),
    height: hp(7),
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 10,
    marginHorizontal: wp(1),
    textAlign: 'center',
    color: '#FFF',
    fontSize: wp(5),
  },

  verifyButton: {
    backgroundColor: '#FFF',
    height: hp(6),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(3),
  },

  verifyText: {
    color: COLORS.primary,
    fontFamily: 'Poppins_600SemiBold',
  },

  cancelText: {
    textAlign: 'center',
    color: '#FFF',
    marginTop: hp(2),
  },

  errorText: {
    color: '#ff4d4d',
    marginTop: 10,
    textAlign: 'center',
  },
});