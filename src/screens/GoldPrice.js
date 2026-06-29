import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    Animated,
    Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { wp } from '../resources/dimensions';

const GoldPriceCards = () => {
    const imageCardBg = require('../../assets/bgImg.png');

    // Price Data
    const priceData = {
        gold: [
            {
                id: 1,
                title: '24KT per gram',
                price: '₹16,555',
                icon: 'diamond',
                iconSize: wp(5),
            },
            {
                id: 2,
                title: '22KT per gram',
                price: '₹16,555',
                icon: 'diamond',
                iconSize: wp(4),
            },
        ],
        silver: {
            title: 'Silver',
            price: '₹250',
            icon: 'medal',
            iconSize: wp(4),
        },
    };

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(30)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    // Flash animation for live indicator
    const flashAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease),
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 700,
                useNativeDriver: true,
                easing: Easing.out(Easing.exp),
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                tension: 60,
                useNativeDriver: true,
            }),
        ]).start();

        // Continuous flashing effect
        Animated.loop(
            Animated.sequence([
                Animated.timing(flashAnim, {
                    toValue: 0.2,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(flashAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [
                        { translateY },
                        { scale: scaleAnim },
                    ],
                },
            ]}
        >
            {/* Gold Card */}
            <ImageBackground
                source={imageCardBg}
                imageStyle={styles.bgImage}
                style={[styles.card, styles.goldCard]}
            >
                <View style={styles.liveIndicator}>
                    <Animated.Text
                        style={[
                            styles.liveHint,
                            {
                                opacity: flashAnim,
                            },
                        ]}
                    >
                        ●
                    </Animated.Text>
                </View>

                {priceData.gold.map((item, index) => (
                    <React.Fragment key={item.id}>
                        <View style={styles.goldSection}>
                            <View style={styles.row}>
                                <Ionicons
                                    name={item.icon}
                                    size={item.iconSize}
                                    color="#555"
                                    style={styles.iconSpacing}
                                />

                                <Text style={styles.price}>
                                    {item.price}
                                </Text>
                            </View>

                            <Text style={styles.title}>
                                {item.title}
                            </Text>
                        </View>

                        {index !== priceData.gold.length - 1 && (
                            <View style={styles.divider} />
                        )}
                    </React.Fragment>
                ))}
            </ImageBackground>

            {/* Silver Card */}
            <ImageBackground
                source={imageCardBg}
                imageStyle={styles.bgImage}
                style={[styles.card, styles.silverCard]}
            >
                <View style={styles.row}>
                    <Ionicons
                        name={priceData.silver.icon}
                        size={priceData.silver.iconSize}
                        color="#555"
                        style={styles.iconSpacing}
                    />

                    <Text
                        style={[
                            styles.price,
                            { color: '#555' },
                        ]}
                    >
                        {priceData.silver.price}
                    </Text>
                </View>

                <Text style={styles.title}>
                    {priceData.silver.title}
                </Text>
            </ImageBackground>
        </Animated.View>
    );
};

export default GoldPriceCards;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: wp(3),
        marginTop: wp(4),
        marginBottom: wp(2),
    },

    card: {
        overflow: 'hidden',
    },

    bgImage: {
        borderRadius: wp(2),
        resizeMode: 'cover',
    },
    goldCard: {
        flex: 2.2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginRight: wp(2),
        paddingVertical: wp(2),
        borderRadius: wp(2),
    },
    silverCard: {
        flex: 0.8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: wp(4),
        borderRadius: wp(2),
    },
    goldSection: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    iconSpacing: {
        marginRight: wp(1),
    },

    divider: {
        width: 2,
        height: '70%',
        backgroundColor: 'rgba(212,175,55,0.55)',
    },

    title: {
        marginTop: wp(0.8),
        fontSize: wp(2.8),
        lineHeight: wp(3.8),
        letterSpacing: 0.4,
        color: '#5F5F5F',
        fontFamily: 'Poppins_500Medium',
        includeFontPadding: false,
        textAlign: 'center',
        textShadowColor: 'rgba(255,255,255,0.35)',
        textShadowOffset: {
            width: 0,
            height: 1,
        },
        textShadowRadius: 1,
    },

    price: {
        fontSize: wp(3.3),
        letterSpacing: 0.6,
        color: '#555',
        fontFamily: 'Poppins_700Bold',
        includeFontPadding: false,
        textShadowColor: 'rgba(0,0,0,0.18)',
        textShadowOffset: {
            width: 0,
            height: 1,
        },
        textShadowRadius: 2,
    },

    liveIndicator: {
        position: 'absolute',
        top: wp(2),
        right: wp(2),
        zIndex: 10,
    },

    liveHint: {
        color: '#ff0000',
        fontSize: wp(3),
    },
});