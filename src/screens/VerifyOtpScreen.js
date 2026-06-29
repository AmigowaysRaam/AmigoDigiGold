import React, { useEffect, useRef, useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, Pressable, Alert, Image, ImageBackground, ScrollView, KeyboardAvoidingView, Platform,
    Keyboard,
    Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '../resources/colors';
import { hp, wp } from '../resources/dimensions';
import { useToast } from './constants/ToastContainer';
export default function VerifyOtpScreen() {
    const navigation = useNavigation();
    const { phone, flag } = useRoute().params || {};
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    useEffect(() => {
        const showSubscription = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            }
        );

        const hideSubscription = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            }
        );

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);
    const [otp, setOtp] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(60);
    const [focusedIndex, setFocusedIndex] = useState(0);
    const inputs = useRef([]);
    const { showToast } = useToast();
    useEffect(() => {
        const timerFocus = setTimeout(() => {
            inputs.current[0]?.focus();
        }, 300);
        setTimer(60);
        return () => clearTimeout(timerFocus);
    }, []);
    useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);
    const shakeAnimations = useRef(
        otp.map(() => new Animated.Value(0))
    ).current;

    const handleFocus = (index) => {
        for (let i = 0; i < index; i++) {
            if (!otp[i]) {
                shakeBox(i); // Shake missing box
                setFocusedIndex(i);
                inputs.current[i]?.focus();
                return;
            }
        }

        setFocusedIndex(index);
    };
    const shakeBox = (index) => {
        Animated.sequence([
            Animated.timing(shakeAnimations[index], {
                toValue: 10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimations[index], {
                toValue: -10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimations[index], {
                toValue: 10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimations[index], {
                toValue: 0,
                duration: 50,
                useNativeDriver: true,
            }),
        ]).start();
    };
    const handleVerify = (enteredOtp) => {
        if (enteredOtp.length !== 4) {
            Alert.alert('Invalid OTP', 'Please enter 4 digit OTP');
            return;
        }
        setOtp(['', '', '', '']);
        inputs.current[0]?.focus();
        showToast(`OTP Verified`, "success");
        navigation.navigate('SetMpinScreen', { phone, flag });
        // navigation.reset({
        //     index: 0,
        //     // routes: [{ name: 'MainTabs' }],
        //     routes: [{ name: 'SetMpinScreen' }],
        //   });
    };
    const handleChange = (text, index) => {
        const value = text.replace(/[^0-9]/g, '').slice(-1);
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 3) {
            inputs.current[index + 1]?.focus();
        }
        const finalOtp = newOtp.join('');
        if (finalOtp.length === 4) {
            setTimeout(() => {
                handleVerify(finalOtp);
            }, 150);
        }
    };
    const handleKeyPress = (e, index) => {
        if (
            e.nativeEvent.key === 'Backspace' &&
            otp[index] === '' &&
            index > 0
        ) {
            setFocusedIndex(index - 1);
            inputs.current[index - 1]?.focus();
        }
    };
    const handleResend = () => {
        setOtp(['', '', '', '']);
        setTimer(60);

        inputs.current[0]?.focus();

        Alert.alert('Success', 'OTP Sent Again');
    };

    return (
        <ImageBackground
            source={require('../../assets/bgImg.png')}
            style={styles.container}
            resizeMode="cover"
        >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        flexGrow: 1,
                        padding: wp(5),
                    }}
                >

                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            minHeight: hp(100),
                        }}
                    >
                        <View style={styles.card}>
                            {
                                !isKeyboardVisible &&
                                <Image
                                    source={require('../../assets/otpverify.png')}
                                    style={styles.image}
                                    resizeMode="contain"
                                />

                            }

                            <Text style={styles.title}>
                                Verify OTP
                            </Text>

                            <Text style={styles.subtitle}>
                                Enter the OTP sent to
                            </Text>

                            <Text style={styles.phoneText}>
                                {phone || 'Mobile Number'}
                            </Text>
                            <View style={styles.otpContainer}>
                                {otp.map((digit, index) => (
                                    <Animated.View
                                        style={{
                                            transform: [
                                                {
                                                    translateX: shakeAnimations[index],
                                                },
                                            ],
                                        }}
                                    >
                                        <TextInput
                                            key={index}
                                            ref={ref => (inputs.current[index] = ref)}
                                            value={digit}
                                            keyboardType="number-pad"
                                            maxLength={1}
                                            style={[
                                                styles.otpBox,
                                                focusedIndex === index && styles.otpBoxFocused,
                                            ]}
                                            onChangeText={text => handleChange(text, index)}
                                            onKeyPress={e => handleKeyPress(e, index)}
                                            onFocus={() => handleFocus(index)}
                                            caretHidden={true}
                                            contextMenuHidden={true}
                                            selectTextOnFocus
                                        />
                                    </Animated.View>
                                ))}
                            </View>
                            <Text style={styles.timerText}>
                                {timer > 0
                                    ? `Resend OTP in ${timer}s`
                                    : 'OTP Expired'}
                            </Text>
                            <Pressable
                                disabled={timer > 0}
                                onPress={handleResend}
                                style={[
                                    styles.resendBtn,
                                    {
                                        opacity:
                                            timer > 0 ? 0.5 : 1,
                                    },
                                ]}
                            >
                                <Text style={styles.resendText}>
                                    Resend OTP
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, },
    scrollContainer: {
        flexGrow: 1, justifyContent: 'center', padding: wp(5),
    }, card: {
        backgroundColor: COLORS.white, borderRadius: wp(5),
        padding: wp(6), minHeight: hp(80),
    },
    image: {
        width: wp(45), height: wp(45), alignSelf: 'center',
        marginBottom: hp(2),
    }, title: {
        fontSize: wp(6), fontWeight: '700', color: COLORS.primary, textAlign: 'center',
    }, subtitle: { marginTop: hp(1), textAlign: 'center', color: '#666', fontSize: wp(3.5), }, phoneText: {
        textAlign: 'center', marginTop: hp(1), color: COLORS.primary,
        fontSize: wp(4), fontWeight: '600',
    }, otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', marginTop: hp(4),
    }, otpBox: {
        width: wp(18), height: wp(18), borderWidth: 1.5, borderColor: COLORS.primary,
        borderRadius: wp(3), textAlign: 'center', fontSize: wp(6), fontWeight: '700', color: COLORS.primary,
    }, timerText: {
        marginTop: hp(3), textAlign: 'center', color: '#555', fontSize: wp(3.6),
    }, resendBtn: { marginTop: hp(2), alignItems: 'center', }, resendText: { color: COLORS.primary, fontWeight: '700', fontSize: wp(4), },
    otpBoxFocused: {
        borderWidth: 2,
        borderColor: COLORS.primary,
        backgroundColor: 'rgba(0,122,255,0.08)',
    },
});