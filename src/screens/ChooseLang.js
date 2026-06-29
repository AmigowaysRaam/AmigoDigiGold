import React, { useRef, useState, useCallback } from 'react';
import {
    View, Text, Image, Pressable, StyleSheet, Animated,
} from 'react-native';
import { COLORS } from '../resources/colors';
import { hp, wp } from '../resources/dimensions';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useToast } from './constants/ToastContainer';

export default function ChooseLang() {
    
    const [selectedLanguage, setSelectedLanguage] = useState('English');
    const bounceAnim = useRef(new Animated.Value(0)).current;
    const cardScale = useRef(new Animated.Value(1)).current;
    const languages = ['English', 'Hindi', 'Tamil'];
    const imageScale = useRef(new Animated.Value(0.8)).current;
    const navigator = useNavigation();
    const {showToast} = useToast();

    const startImageAnimation = useCallback(() => {
        bounceAnim.setValue(0);
        imageScale.setValue(0.8);

        Animated.parallel([
            Animated.sequence([
                Animated.timing(bounceAnim, {
                    toValue: -20,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.spring(bounceAnim, {
                    toValue: 0,
                    friction: 4,
                    tension: 80,
                    useNativeDriver: true,
                }),
            ]),
            Animated.spring(imageScale, {
                toValue: 1,
                friction: 4,
                tension: 80,
                useNativeDriver: true,
            }),
        ]).start();
    }, [bounceAnim, imageScale]);

    useFocusEffect(
        useCallback(() => {
            startImageAnimation();
        }, [startImageAnimation])
    );

    const handleLanguageSelect = (language) => {
        setSelectedLanguage(language);

        cardScale.setValue(0.95);

        Animated.spring(cardScale, {
            toValue: 1,
            friction: 4,
            tension: 100,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Select Language
            </Text>

            <Text style={styles.subtitle}>
                You can change the language anytime from settings
            </Text>

            <Animated.View
                style={{
                    transform: [
                        { translateY: bounceAnim },
                        { scale: imageScale },
                    ],
                }}
            >
                <Image
                    source={require('../../assets/langScreen.png')}
                    style={styles.image}
                    resizeMode="contain"
                />
            </Animated.View>

            <View style={styles.languageContainer}>
                {languages.map((item) => {
                    const isSelected = selectedLanguage === item;

                    return (
                        <Animated.View
                            key={item}
                            style={{
                                transform: [
                                    {
                                        scale: isSelected
                                            ? cardScale
                                            : 1,
                                    },
                                ],
                            }}
                        >
                            <Pressable
                                style={[
                                    styles.languageCard,
                                    isSelected &&
                                    styles.selectedCard,
                                ]}
                                android_ripple={{
                                    color:
                                        COLORS?.primary + '20',
                                }}
                                onPress={() =>
                                    handleLanguageSelect(item)
                                }
                            >
                                <View
                                    style={[
                                        styles.radioOuter,
                                        isSelected &&
                                        styles.radioOuterSelected,
                                    ]}
                                >
                                    {isSelected && (
                                        <Animated.View
                                            style={
                                                styles.radioInner
                                            }
                                        />
                                    )}
                                </View>

                                <Text
                                    style={[
                                        styles.languageText,
                                        isSelected &&
                                        styles.selectedText,
                                    ]}
                                >
                                    {item}
                                </Text>
                            </Pressable>
                        </Animated.View>
                    );
                })}
            </View>
            <Pressable
                style={styles.continueButton}
                onPress={() =>
                    // showToast('Validating details', 'success')
                    navigator.navigate('WelcomeScreen')
                    // navigator.navigate('FaceEmbeddingScreen')                    
                }
            >
                <Text style={styles.continueText}>
                    Continue
                </Text>
            </Pressable>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: COLORS?.background, alignItems: 'center',
        paddingTop: hp(6),
        paddingHorizontal: wp(6),
    }, title: {
        fontSize: wp(6), color: COLORS?.primary,
        fontFamily: 'Poppins_600SemiBold',
    }, subtitle: {
        marginTop: hp(1),
        fontSize: wp(3.4),
        color: '#777', textAlign: 'center', fontFamily: 'Poppins_400Regular',
    },
    image: {
        width: wp(55), height: wp(55),
        marginTop: hp(4), marginBottom: hp(4),
    },

    languageContainer: {
        width: '100%',
        gap: hp(2),
    },

    languageCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS?.background,
        borderWidth: 1,
        borderColor: COLORS?.primary,
        borderRadius: wp(10),
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(5),
    },

    selectedCard: {
        backgroundColor: COLORS?.primary + '10',
        borderWidth: 2,
        shadowColor: COLORS?.primary,
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 4,
    },

    radioOuter: {
        width: wp(6),
        height: wp(6),
        borderRadius: wp(3),
        borderWidth: 2,
        borderColor: COLORS?.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp(4),
    },

    radioOuterSelected: {
        borderColor: COLORS?.primary,
    },
    radioInner: {
        width: wp(3),
        height: wp(3),
        borderRadius: wp(1.5),
        backgroundColor: COLORS?.primary,
    },
    languageText: {
        fontSize: wp(4.2),
        color: COLORS?.primary,
        fontFamily: 'Poppins_600SemiBold',
    },
    selectedText: {
        color: COLORS?.primary,
    },
    continueButton: {
        marginTop: hp(5),
        width: '100%',
        backgroundColor: COLORS?.primary,
        paddingVertical: hp(2),
        borderRadius: wp(10),
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },

    continueText: {
        color: '#FFF',
        fontSize: wp(4.2),
        fontFamily: 'Poppins_600SemiBold',
    },
});