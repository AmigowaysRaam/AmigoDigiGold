import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    Animated,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../resources/colors';
import { hp, wp } from '../resources/dimensions';
import { useToast } from './constants/ToastContainer';

export default function MpinLoginScreen() {
    const navigation = useNavigation();
    const { showToast } = useToast();
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [mpin, setMpin] = useState(['', '', '', '']);
    const [mpinError, setMpinError] = useState('');
    const [focusedIndex, setFocusedIndex] = useState(0);
    const mpinInputs = useRef([]);
    const shakeAnimations = useRef(
        Array.from({ length: 4 }, () => new Animated.Value(0))
    ).current;

    useEffect(() => {
        const showSubscription = Keyboard.addListener(
            'keyboardDidShow',
            () => setKeyboardVisible(true)
        );

        const hideSubscription = Keyboard.addListener(
            'keyboardDidHide',
            () => setKeyboardVisible(false)
        );

        const timer = setTimeout(() => {
            // mpinInputs.current[0]?.focus();
        }, 300);

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
            clearTimeout(timer);
        };
    }, []);

    const shakeBox = index => {
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

    const handleLogin = () => {
        const enteredMpin = mpin.join('');

        setMpinError('');

        if (enteredMpin.length !== 4) {
            setMpinError('Please enter a valid 4-digit MPIN');
            return;
        }

        showToast('Login Successful', 'success');

        navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
        });
    };

    const handleChange = (
        text,
        index,
        values,
        setValues,
        inputsRef
    ) => {
        const value = text.replace(/[^0-9]/g, '').slice(-1);

        const updated = [...values];
        updated[index] = value;

        setValues(updated);
        setMpinError('');

        if (value && index < 3) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (
        e,
        index,
        values,
        inputsRef
    ) => {
        if (
            e.nativeEvent.key === 'Backspace' &&
            values[index] === '' &&
            index > 0
        ) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleFocus = index => {
        for (let i = 0; i < index; i++) {
            if (!mpin[i]) {
                shakeBox(i);
                mpinInputs.current[i]?.focus();
                return;
            }
        }

        setFocusedIndex(index);
    };

    return (
        <ImageBackground
            source={require('../../assets/bgImg.png')}
            style={styles.container}
            resizeMode="cover"
        >
            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : 'height'
                }
            >
                <View style={styles.contentContainer}>
                    <View style={styles.card}>
                        {!isKeyboardVisible && (
                            <Image
                                source={require('../../assets/otpverify.png')}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        )}

                        <Text style={styles.title}>
                            MPIN Login
                        </Text>

                        {!isKeyboardVisible && (
                            <Text style={styles.subtitle}>
                                Enter your 4-digit MPIN to continue
                            </Text>
                        )}

                        <Text style={styles.label}>
                            Enter MPIN
                        </Text>

                        <View style={styles.otpContainer}>
                            {mpin.map((digit, index) => (
                                <Animated.View
                                    key={index}
                                    style={{
                                        transform: [
                                            {
                                                translateX:
                                                    shakeAnimations[index],
                                            },
                                        ],
                                    }}
                                >
                                    <TextInput
                                        ref={ref =>
                                            (mpinInputs.current[index] = ref)
                                        }
                                        value={digit}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        secureTextEntry
                                        caretHidden
                                        contextMenuHidden
                                        selectTextOnFocus
                                        style={[
                                            styles.otpBox,
                                            focusedIndex === index &&
                                                styles.otpBoxFocused,
                                        ]}
                                        onFocus={() =>
                                            handleFocus(index)
                                        }
                                        onKeyPress={e =>
                                            handleKeyPress(
                                                e,
                                                index,
                                                mpin,
                                                mpinInputs
                                            )
                                        }
                                        onChangeText={text =>
                                            handleChange(
                                                text,
                                                index,
                                                mpin,
                                                setMpin,
                                                mpinInputs
                                            )
                                        }
                                    />
                                </Animated.View>
                            ))}
                        </View>

                        {!!mpinError && (
                            <Text style={styles.errorText}>
                                {mpinError}
                            </Text>
                        )}

                        <TouchableOpacity
                            style={styles.submitButton}
                            activeOpacity={0.8}
                            onPress={handleLogin}
                        >
                            <Text style={styles.submitText}>
                                Login
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={() => navigation?.navigate('LoginScreen')}
                            style={{ marginTop: hp(2) }}
                        >
                            <Text style={styles.forgotText}>
                                Forgot MPIN?
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    keyboardContainer: { flex: 1 },

    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: wp(5),
    },

    card: {
        backgroundColor: COLORS.white,
        borderRadius: wp(5),
        padding: wp(6),
    },

    image: {
        width: wp(45),
        height: wp(45),
        alignSelf: 'center',
        marginBottom: hp(2),
    },

    title: {
        fontSize: wp(6),
        fontWeight: '700',
        color: COLORS.primary,
        textAlign: 'center',
    },

    subtitle: {
        marginTop: hp(1),
        textAlign: 'center',
        color: '#666',
        fontSize: wp(3.5),
    },

    label: {
        marginTop: hp(4),
        marginBottom: hp(1.5),
        fontSize: wp(4),
        fontWeight: '600',
        color: COLORS.primary,
    },

    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    otpBox: {
        width: wp(16),
        height: wp(16),
        borderWidth: 1.5,
        borderColor: COLORS.primary,
        borderRadius: wp(3),
        textAlign: 'center',
        fontSize: wp(6),
        fontWeight: '700',
        color: COLORS.primary,
    },

    otpBoxFocused: {
        borderWidth: 2,
        borderColor: COLORS.primary,
        backgroundColor: 'rgba(0,122,255,0.08)',
    },

    errorText: {
        color: '#FF3B30',
        fontSize: wp(3.3),
        marginTop: hp(1),
    },

    submitButton: {
        marginTop: hp(5),
        height: hp(6.5),
        backgroundColor: COLORS.primary,
        borderRadius: wp(3),
        justifyContent: 'center',
        alignItems: 'center',
    },

    submitText: {
        color: COLORS.white,
        fontSize: wp(4.2),
        fontWeight: '700',
    },

    forgotText: {
        textAlign: 'center',
        color: COLORS.primary,
        fontSize: wp(3.8),
        fontWeight: '600',
    },
});