import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, ImageBackground, Pressable,
    StyleSheet, TextInput, ScrollView, Alert, Animated, Keyboard,
    KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../resources/colors';
import { hp, wp } from '../resources/dimensions';
import CountryCodeModal from './CountryCodeModal';
import { useToast } from './constants/ToastContainer';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
    const navigation = useNavigation();
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [referral, setReferral] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [errors, setErrors] = useState({});
    const validateEmail = (emailValue) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
    };
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [countryModal, setCountryModal] =
        useState(false);

    const [selectedCountry, setSelectedCountry] =
        useState({
            name: 'India',
            code: '+91',
            iso: 'IN',
        });

    const fullNameRef = useRef(null);
    const phoneRef = useRef(null);
    const emailRef = useRef(null);

    const nameShake = useRef(new Animated.Value(0)).current;
    const phoneShake = useRef(new Animated.Value(0)).current;
    const emailShake = useRef(new Animated.Value(0)).current;
    const termsShake = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        if (__DEV__) {
            setPhone('9876543210');
            setAcceptedTerms(true);
            setFullName('John Doe');
            setEmail('test@gmail.com');

        }
        const showSubscription = Keyboard.addListener(
            Platform.OS === 'ios'
                ? 'keyboardWillShow'
                : 'keyboardDidShow',
            (event) => {
                setKeyboardHeight(event.endCoordinates.height);
            }
        );

        const hideSubscription = Keyboard.addListener(
            Platform.OS === 'ios'
                ? 'keyboardWillHide'
                : 'keyboardDidHide',
            () => {
                setKeyboardHeight(0);
            }
        );

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);
    const shakeField = (animation) => {
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

        if (!fullName.trim()) {
            newErrors.fullName = 'Please enter your full name';

            fullNameRef.current?.focus();
            shakeField(nameShake);

            setErrors(newErrors);
            return false;
        }

        if (!phone.trim()) {
            newErrors.phone = 'Please enter mobile number';

            phoneRef.current?.focus();
            shakeField(phoneShake);

            setErrors(newErrors);
            return false;
        }

        if (!/^\d{10}$/.test(phone)) {
            newErrors.phone = 'Mobile number must be 10 digits';

            phoneRef.current?.focus();
            shakeField(phoneShake);

            setErrors(newErrors);
            return false;
        }

        if (!email.trim()) {
            newErrors.email = 'Please enter email address';

            emailRef.current?.focus();
            shakeField(emailShake);

            setErrors(newErrors);
            return false;
        }

        if (!validateEmail(email)) {
            newErrors.email = 'Enter valid email address';

            emailRef.current?.focus();
            shakeField(emailShake);

            setErrors(newErrors);
            return false;
        }

        if (!acceptedTerms) {
            newErrors.terms = 'Please accept Terms & Conditions';

            shakeField(termsShake);

            setErrors(newErrors);
            return false;
        }

        setErrors({});
        return true;
    };
    const { showToast } = useToast();

    const handleGetOTP = () => {
        showToast('Validating details...', 'success');
        if (!validate()) return;
        // Alert.alert(
        //     'Success',
        //     'OTP will be sent to your mobile number.'
        // );
        navigation.navigate('VerifyOtpScreen', {
            phone: selectedCountry.code + phone,
            flag: 'register'
        });
    };
    return (
        <ImageBackground
            source={require('../../assets/bgImg.png')}
            resizeMode="cover"
            style={styles.background}
        >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.overlay}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom:
                                keyboardHeight > 0
                                    ? keyboardHeight + hp(0)
                                    : hp(4),
                        }}
                    >
                        <View style={styles.formContainer}>
                            <Text style={styles.formTitle}>
                                Create Account
                            </Text>

                            <Text style={styles.formSubTitle}>
                                Start your digital gold journey
                                today
                            </Text>

                            {/* Full Name */}
                            <Animated.View
                                style={{
                                    transform: [{ translateX: nameShake }],
                                }}
                            >
                                <TextInput
                                    ref={fullNameRef}
                                    placeholder="Full Name"
                                    placeholderTextColor="white"
                                    value={fullName}
                                    onChangeText={(text) => {
                                        setFullName(text);
                                        setErrors({
                                            ...errors,
                                            fullName: '',
                                        });
                                    }}
                                    style={styles.input}
                                />
                            </Animated.View>
                            {!!errors.fullName && (
                                <Text style={styles.errorText}>
                                    {errors.fullName}
                                </Text>
                            )}
                            <Animated.View
                                style={{
                                    transform: [{ translateX: phoneShake }],
                                }}
                            >
                                <View style={styles.phoneContainer}>
                                    <Pressable
                                        style={styles.countryCode}
                                        onPress={() =>
                                            setCountryModal(true)
                                        }
                                    >
                                        <Text style={styles.countryCodeText}>
                                            {selectedCountry.code}
                                        </Text>
                                    </Pressable>

                                    <TextInput
                                        ref={phoneRef}
                                        placeholder="Mobile Number"
                                        placeholderTextColor="white"
                                        keyboardType="number-pad"
                                        maxLength={10}
                                        value={phone}
                                        onChangeText={(text) => {
                                            setPhone(
                                                text.replace(/[^0-9]/g, '')
                                            );

                                            setErrors({
                                                ...errors,
                                                phone: '',
                                            });
                                        }}
                                        style={styles.phoneInput}
                                    />
                                </View>
                            </Animated.View>
                            {!!errors.phone && (
                                <Text style={styles.errorText}>
                                    {errors.phone}
                                </Text>
                            )}

                            {/* Email */}


                            <Animated.View
                                style={{
                                    transform: [{ translateX: emailShake }],
                                }}
                            >
                                <TextInput
                                    ref={emailRef}
                                    placeholder="Email Address"
                                    placeholderTextColor="white"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                        setErrors({
                                            ...errors,
                                            email: '',
                                        });
                                    }}
                                    style={styles.input}
                                />
                            </Animated.View>

                            {!!errors.email && (
                                <Text style={styles.errorText}>
                                    {errors.email}
                                </Text>
                            )}
                            <TextInput
                                placeholder="Referral Code (Optional)"
                                placeholderTextColor="white"
                                value={referral}
                                onChangeText={setReferral}
                                style={styles.input}
                            />
                            <Animated.View
                                style={{
                                    transform: [{ translateX: termsShake }],
                                }}
                            >
                                <Pressable
                                    style={styles.termsContainer}
                                    onPress={() => {
                                        setAcceptedTerms(
                                            !acceptedTerms
                                        );

                                        setErrors({
                                            ...errors,
                                            terms: '',
                                        });
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.checkbox,
                                            // acceptedTerms &&
                                            // styles.checkboxActive,
                                            {
                                                borderWidth: 1,
                                                borderColor: COLORS?.white,
                                            }
                                        ]}
                                    >
                                        {/* {acceptedTerms && (
                                            <Text
                                                style={{
                                                    // color: '#FFF',
                                                    fontSize: 12,
                                                }}
                                            >
                                                ✓
                                            </Text>
                                        )} */}

                                        {
                                            acceptedTerms &&
                                            <Ionicons name="checkmark" size={16} color={COLORS?.white} />
                                        }

                                    </View>
                                    <Text style={[styles.termsText]}>
                                        I agree to <Text style={{
                                            textDecorationLine: "underline",
                                            fontFamily: 'Poppins_600SemiBold',
                                            fontSize: wp(3),
                                        }}>
                                            Terms &
                                            Conditions
                                        </Text>
                                    </Text>
                                </Pressable>
                            </Animated.View>
                            {!!errors.terms && (
                                <Text style={styles.errorText}>
                                    {errors.terms}
                                </Text>
                            )}

                            {/* OTP Button */}

                            <Pressable
                                style={styles.otpButton}
                                onPress={handleGetOTP}
                            >
                                <Text style={styles.otpButtonText}>
                                    Get OTP
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={() =>
                                    navigation.navigate(
                                        'LoginScreen'
                                    )
                                }
                            >
                                <Text
                                    style={styles.loginText}
                                >
                                    {`Already have an account? `}
                                    <Text style={{
                                        textDecorationLine: "underline", fontFamily: 'Poppins_600SemiBold',
                                        fontSize: wp(3.5)
                                    }}>
                                        Sign In
                                    </Text>
                                </Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
            <CountryCodeModal
                visible={countryModal}
                onClose={() =>
                    setCountryModal(false)
                }
                onSelect={country => {
                    setSelectedCountry(country);
                }}
            />
        </ImageBackground>
    );
}
const styles = StyleSheet.create({
    background: { flex: 1, }, overlay: {
        flex: 1, justifyContent: 'flex-end',
    }, formContainer: {
        position: 'relative', top: hp(10), backgroundColor: COLORS?.primary,
        borderTopLeftRadius: 35, borderTopRightRadius: 35, paddingHorizontal: wp(6),
        paddingVertical: hp(4), minHeight: hp(90),
    },
    formTitle: {
        fontSize: wp(6), color: COLORS?.white, fontFamily: 'Poppins_600SemiBold',
    },
    formSubTitle: {
        color: '#fff', marginTop: hp(0.5), marginBottom: hp(3),
        fontSize: wp(3.4),
    }, input: {
        height: hp(6.5), borderWidth: 1, borderColor: '#fff', borderRadius: 5, paddingHorizontal: wp(4),
        color: '#fff', marginTop: hp(1.5),
    },
    phoneContainer: { flexDirection: 'row', marginTop: hp(1.5), },
    countryCode: {
        width: wp(18), height: hp(6.5), borderWidth: 1, borderColor: '#E5E5E5', borderRadius: 5,
        justifyContent: 'center', alignItems: 'center', marginRight: wp(2),
    }, countryCodeText: { color: '#fff', fontWeight: '600', }, phoneInput: {
        flex: 1, height: hp(6.5), borderWidth: 1,
        borderColor: '#E5E5E5', borderRadius: 5, paddingHorizontal: wp(4),
        color: '#FFF',
    }, termsContainer: {
        flexDirection: 'row', alignItems: 'center',
        marginTop: hp(3),
    },
    checkbox: {
        width: wp(5.5), height: wp(5.5), borderRadius: wp(1), borderWidth: 2,
        borderColor: COLORS?.white, justifyContent: 'center', alignItems: 'center',
    }, checkboxActive: { backgroundColor: COLORS?.white, },
    termsText: {
        marginLeft: wp(3), color: '#fff', flex: 1, fontSize: wp(3.3),
    }, otpButton: {
        backgroundColor: COLORS?.white, height: hp(6.5), borderRadius: 16,
        justifyContent: 'center', alignItems: 'center',
        marginTop: hp(4),
    }, otpButtonText: {
        color: COLORS?.primary, fontSize: wp(4.2), fontFamily: 'Poppins_600SemiBold',
    }, loginText: {
        textAlign: 'center', marginTop: hp(3), color: COLORS?.white,
        fontSize: wp(3.5),
    }, errorText: {
        color: '#E53935', marginTop: hp(0.5), marginLeft: wp(1),
        fontSize: wp(3),
    },
});