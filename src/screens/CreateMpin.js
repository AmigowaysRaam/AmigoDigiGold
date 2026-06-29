import React, { useEffect, useRef, useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, Image, ImageBackground,
    KeyboardAvoidingView, Platform, Keyboard, Animated, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../resources/colors';
import { hp, wp } from '../resources/dimensions';
import { useToast } from './constants/ToastContainer';
export default function SetMpinScreen() {
    const navigation = useNavigation();
    const { showToast } = useToast();
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [mpin, setMpin] = useState(['', '', '', '']);
    const [confirmMpin, setConfirmMpin] = useState(['', '', '', '']);
    const [mpinError, setMpinError] = useState('');
    const [confirmError, setConfirmError] = useState('');
    const [focusedIndex, setFocusedIndex] = useState(0);
    const [focusedSection, setFocusedSection] = useState('mpin');
    const mpinInputs = useRef([]);
    const confirmInputs = useRef([]);
    const shakeAnimations = useRef(
        Array.from({ length: 8 }, () => new Animated.Value(0))
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

    const handleVerify = () => {
        const enteredMpin = mpin.join('');
        const enteredConfirm = confirmMpin.join('');

        let valid = true;

        setMpinError('');
        setConfirmError('');

        if (enteredMpin.length !== 4) {
            setMpinError('Please enter a valid 4-digit MPIN');
            valid = false;
        }

        if (enteredConfirm.length !== 4) {
            setConfirmError('Please confirm your 4-digit MPIN');
            valid = false;
        }

        if (
            enteredMpin.length === 4 &&
            enteredConfirm.length === 4 &&
            enteredMpin !== enteredConfirm
        ) {
            setConfirmError('MPIN and Confirm MPIN do not match');
            valid = false;

            setConfirmMpin(['', '', '', '']);
            confirmInputs.current[0]?.focus();
        }

        if (!valid) {
            return;
        }
        showToast('MPIN Created Successfully', 'success');

        navigation.reset({
            index: 0,
            routes: [{ name: 'MpinLogin' }],
        });
    };
    const handleChange = (text,
        index, values, setValues, inputsRef,
        nextRef, section
    ) => {
        const value = text.replace(/[^0-9]/g, '').slice(-1);

        const updated = [...values];
        updated[index] = value;

        setValues(updated);

        if (section === 'mpin') {
            setMpinError('');
        } else {
            setConfirmError('');
        }

        if (value && index < 3) {
            inputsRef.current[index + 1]?.focus();
        }

        if (value && index === 3 && nextRef) {
            setTimeout(() => {
                nextRef.current[0]?.focus();
            }, 100);
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

    const handleFocus = (
        index,
        values,
        inputsRef,
        section
    ) => {
        for (let i = 0; i < index; i++) {
            if (!values[i]) {
                shakeBox(
                    section === 'mpin'
                        ? i
                        : i + 4
                );

                inputsRef.current[i]?.focus();
                return;
            }
        }

        setFocusedSection(section);
        setFocusedIndex(index);
    };

    const renderInputRow = (
        values,
        setValues,
        inputsRef,
        nextRef,
        section,
        offset = 0
    ) => {
        return (
            <View style={styles.otpContainer}>
                {values.map((digit, index) => (
                    <Animated.View
                        key={`${section}-${index}`}
                        style={{
                            transform: [
                                {
                                    translateX:
                                        shakeAnimations[offset + index],
                                },
                            ],
                        }}
                    >
                        <TextInput
                            ref={ref =>
                                (inputsRef.current[index] = ref)
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
                                focusedSection === section &&
                                focusedIndex === index &&
                                styles.otpBoxFocused,
                            ]}
                            onFocus={() =>
                                handleFocus(
                                    index,
                                    values,
                                    inputsRef,
                                    section
                                )
                            }
                            onKeyPress={e =>
                                handleKeyPress(
                                    e,
                                    index,
                                    values,
                                    inputsRef
                                )
                            }
                            onChangeText={text =>
                                handleChange(
                                    text,
                                    index,
                                    values,
                                    setValues,
                                    inputsRef,
                                    nextRef,
                                    section
                                )
                            }
                        />
                    </Animated.View>
                ))}
            </View>
        );
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
                            Create MPIN
                        </Text>
                        {
                            !isKeyboardVisible && (
                                <Text style={styles.subtitle}>
                                    Set a secure 4-digit MPIN for your
                                    account
                                </Text>
                            )
                        }
                        <Text style={styles.label}>
                            Enter MPIN
                        </Text>
                        {renderInputRow(
                            mpin,
                            setMpin,
                            mpinInputs,
                            confirmInputs,
                            'mpin',
                            0
                        )}
                        {!!mpinError && (
                            <Text style={styles.errorText}>
                                {mpinError}
                            </Text>
                        )}

                        <Text
                            style={[
                                styles.label,
                                { marginTop: hp(4) },
                            ]}
                        >
                            Confirm MPIN
                        </Text>

                        {renderInputRow(
                            confirmMpin,
                            setConfirmMpin,
                            confirmInputs,
                            null,
                            'confirm',
                            4
                        )}
                        {!!confirmError && (
                            <Text style={styles.errorText}>
                                {confirmError}
                            </Text>
                        )}
                        <TouchableOpacity
                            style={styles.submitButton}
                            activeOpacity={0.8}
                            onPress={handleVerify}
                        >
                            <Text style={styles.submitText}>
                                Submit
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, }, keyboardContainer: {
        flex: 1,
    }, contentContainer: {
        flex: 1, justifyContent: 'center',
        padding: wp(5),
    }, card: {
        backgroundColor: COLORS.white,
        borderRadius: wp(5), padding: wp(6),
    }, image: {
        width: wp(45), height: wp(45), alignSelf: 'center',
        marginBottom: hp(2),
    }, title: {
        fontSize: wp(6), fontWeight: '700', color: COLORS.primary,
        textAlign: 'center',
    }, subtitle: {
        marginTop: hp(1), textAlign: 'center', color: '#666', fontSize: wp(3.5), lineHeight: hp(2.6),
    }, label: {
        marginTop: hp(4), marginBottom: hp(1.5), fontSize: wp(4),
        fontWeight: '600', color: COLORS.primary,
    }, otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    }, otpBox: {
        width: wp(16), height: wp(16),
        borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: wp(3), textAlign: 'center', fontSize: wp(6), fontWeight: '700',
        color: COLORS.primary,
    },
    otpBoxFocused: {
        borderWidth: 2, borderColor: COLORS.primary, backgroundColor: 'rgba(0,122,255,0.08)',
    }, errorText: {
        color: '#FF3B30', fontSize: wp(3.3), marginTop: hp(1),
        marginLeft: wp(1),
    }, submitButton: {
        marginTop: hp(5), height: hp(6.5),
        backgroundColor: COLORS.primary,
        borderRadius: wp(3), justifyContent: 'center', alignItems: 'center',
    },
    submitText: {
        color: COLORS.white, fontSize: wp(4.2),
        fontWeight: '700',
    },
});