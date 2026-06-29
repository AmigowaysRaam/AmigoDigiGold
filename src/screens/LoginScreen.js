import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    ImageBackground,
    Pressable,
    StyleSheet,
    TextInput,
    ScrollView,
    Animated,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { COLORS } from '../resources/colors';
import { hp, wp } from '../resources/dimensions';

import CountryCodeModal from './CountryCodeModal';
import { useToast } from './constants/ToastContainer';

export default function LoginScreen() {
    const navigation = useNavigation();
    const { showToast } = useToast();

    const [phone, setPhone] = useState('');
    const [errors, setErrors] = useState({});
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [countryModal, setCountryModal] = useState(false);

    const [selectedCountry, setSelectedCountry] = useState({
        name: 'India',
        code: '+91',
        iso: 'IN',
    });

    const phoneRef = useRef(null);
    const phoneShake = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (__DEV__) {
            setPhone('9876543210');
        }

        const showSubscription = Keyboard.addListener(
            Platform.OS === 'ios'
                ? 'keyboardWillShow'
                : 'keyboardDidShow',
            event => {
                setKeyboardHeight(
                    event.endCoordinates.height
                );
            }
        );

        const hideSubscription = Keyboard.addListener(
            Platform.OS === 'ios'
                ? 'keyboardWillHide'
                : 'keyboardDidHide',
            () => setKeyboardHeight(0)
        );

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const shakeField = animation => {
        Animated.sequence([
            Animated.timing(animation, {
                toValue: 10,
                duration: 60,
                useNativeDriver: true,
            }),
            Animated.timing(animation, {
                toValue: -10,
                duration: 60,
                useNativeDriver: true,
            }),
            Animated.timing(animation, {
                toValue: 10,
                duration: 60,
                useNativeDriver: true,
            }),
            Animated.timing(animation, {
                toValue: 0,
                duration: 60,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const validate = () => {
        let newErrors = {};

        if (!phone.trim()) {
            newErrors.phone =
                'Please enter mobile number';

            phoneRef.current?.focus();
            shakeField(phoneShake);

            setErrors(newErrors);
            return false;
        }

        if (!/^\d{10}$/.test(phone)) {
            newErrors.phone =
                'Mobile number must be 10 digits';

            phoneRef.current?.focus();
            shakeField(phoneShake);

            setErrors(newErrors);
            return false;
        }
        setErrors({});
        return true;
    };
    const handleGetOTP = () => {
        if (!validate()) return;
        showToast(
            'OTP Sent Successfully',
            'success'
        );
        navigation.navigate(
            'VerifyOtpScreen',
            {
                phone:
                    selectedCountry.code +
                    phone,
                flag: 'login'
            }
        );
    };
    return (
        <ImageBackground
            source={require('../../assets/bgImg.png')}
            resizeMode="cover"
            style={styles.background}
        >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : undefined
                }
            >
                <View style={styles.overlay}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom:
                                keyboardHeight > 0
                                    ? keyboardHeight
                                    : hp(4),
                        }}
                    >
                        <View
                            style={
                                styles.formContainer
                            }
                        >
                            <Text
                                style={
                                    styles.formTitle
                                }
                            >
                                Login
                            </Text>

                            <Text
                                style={
                                    styles.formSubTitle
                                }
                            >
                                Enter your mobile
                                number to receive OTP
                            </Text>

                            <Animated.View
                                style={{
                                    transform: [
                                        {
                                            translateX:
                                                phoneShake,
                                        },
                                    ],
                                }}
                            >
                                <View
                                    style={
                                        styles.phoneContainer
                                    }
                                >
                                    <Pressable
                                        style={
                                            styles.countryCode
                                        }
                                        onPress={() =>
                                            setCountryModal(
                                                true
                                            )
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.countryCodeText
                                            }
                                        >
                                            {
                                                selectedCountry.code
                                            }
                                        </Text>
                                    </Pressable>

                                    <TextInput
                                        ref={
                                            phoneRef
                                        }
                                        value={
                                            phone
                                        }
                                        maxLength={
                                            10
                                        }
                                        keyboardType="number-pad"
                                        placeholder="Mobile Number"
                                        placeholderTextColor="#FFF"
                                        style={
                                            styles.phoneInput
                                        }
                                        onChangeText={text => {
                                            setPhone(
                                                text.replace(
                                                    /[^0-9]/g,
                                                    ''
                                                )
                                            );

                                            setErrors(
                                                {}
                                            );
                                        }}
                                    />
                                </View>
                            </Animated.View>

                            {!!errors.phone && (
                                <Text
                                    style={
                                        styles.errorText
                                    }
                                >
                                    {
                                        errors.phone
                                    }
                                </Text>
                            )}

                            <Pressable
                                style={
                                    styles.otpButton
                                }
                                onPress={
                                    handleGetOTP
                                }
                            >
                                <Text
                                    style={
                                        styles.otpButtonText
                                    }
                                >
                                    Get OTP
                                </Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>

            <CountryCodeModal
                visible={countryModal}
                onClose={() =>
                    setCountryModal(
                        false
                    )
                }
                onSelect={country =>
                    setSelectedCountry(
                        country
                    )
                }
            />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1 },

    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },

    formContainer: {
        position: 'relative',
        top: hp(10),
        backgroundColor:
            COLORS.primary,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        paddingHorizontal: wp(6),
        paddingVertical: hp(4),
        minHeight: hp(90),
    },

    formTitle: {
        fontSize: wp(6),
        color: COLORS.white,
        fontFamily:
            'Poppins_600SemiBold',
    },
    formSubTitle: {
        color: '#FFF',
        marginTop: hp(0.5),
        marginBottom: hp(3), fontSize: wp(3.4),
    },
    phoneContainer: {
        flexDirection: 'row', marginTop: hp(1.5),
    },
    countryCode: {
        width: wp(18), height: hp(6.5), borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 5,
        justifyContent: 'center', alignItems: 'center', marginRight: wp(2),
    },

    countryCodeText: {
        color: '#FFF',
        fontWeight: '600',
    },

    phoneInput: {
        flex: 1, height: hp(6.5),
        borderWidth: 1, borderColor: '#E5E5E5', borderRadius: 5,
        paddingHorizontal: wp(4),
        color: '#FFF',
    },
    otpButton: {
        backgroundColor:
            COLORS.white,
        height: hp(6.5),
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp(4),
    },

    otpButtonText: {
        color: COLORS.primary,
        fontSize: wp(4.2),
        fontFamily:
            'Poppins_600SemiBold',
    },

    errorText: {
        color: '#E53935',
        marginTop: hp(0.5),
        marginLeft: wp(1),
        fontSize: wp(3),
    },
});