import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Image,
} from 'react-native';

import { hp, wp } from '../resources/dimensions';
import { COLORS } from '../resources/colors';
import { useNavigation } from '@react-navigation/native';

const title = 'Kickstart Your Jewellery Savings Today!';

const description =
    'Turn your dreams into reality with our flexible chit plans. Pick a savings plan that suits your lifestyle and enjoy owning timeless treasures.';
const actions = [
    { title: '₹10', popular: false },
    { title: '₹30', popular: false },
    { title: '₹50', popular: false },
    { title: '₹100', popular: true },
    { title: '₹1100', popular: false },
];

export const SavingsQuickAction = () => {
    const containerOpacity = useRef(new Animated.Value(0)).current;
    const containerTranslateY = useRef(new Animated.Value(25)).current;

    const badgeScale = useRef(new Animated.Value(0)).current;

    const animations = useRef(
        actions.map(() => ({
            opacity: new Animated.Value(0),
            translateY: new Animated.Value(50),
            scale: new Animated.Value(0.7),
        })),
    ).current;

  const navigation = useNavigation();

    useEffect(() => {
        Animated.parallel([
            Animated.timing(containerOpacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.spring(containerTranslateY, {
                toValue: 0,
                damping: 18,
                stiffness: 140,
                mass: 1,
                useNativeDriver: true,
            }),
        ]).start();

        const cards = animations.map((anim) =>
            Animated.parallel([
                Animated.timing(anim.opacity, {
                    toValue: 1,
                    duration: 450,
                    useNativeDriver: true,
                }),

                Animated.spring(anim.translateY, {
                    toValue: 0,
                    damping: 14,
                    stiffness: 150,
                    mass: 0.8,
                    useNativeDriver: true,
                }),

                Animated.spring(anim.scale, {
                    toValue: 1,
                    damping: 12,
                    stiffness: 180,
                    mass: 0.8,
                    useNativeDriver: true,
                }),
            ]),
        );
        Animated.stagger(90, cards).start(() => {
            Animated.loop(
                Animated.sequence([
                    Animated.spring(badgeScale, {
                        toValue: 1.08,
                        useNativeDriver: true,
                    }),
                    Animated.spring(badgeScale, {
                        toValue: 1,
                        useNativeDriver: true,
                    }),
                ]),
            ).start();
        });

        Animated.spring(badgeScale, {
            toValue: 1,
            damping: 10,
            stiffness: 200,
            useNativeDriver: true,
        }).start();
    }, []);
    return (
        <Animated.View
            style={[
                styles.mainContainer,
                {
                    opacity: containerOpacity,
                    transform: [
                        {
                            translateY: containerTranslateY,
                        },
                    ],
                },
            ]}
        >
            <View style={styles.headerContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>

            {/* Plans */}

            <View style={styles.container}>
                {actions.map((item, index) => (
                    <Animated.View
                        key={index}
                        style={[
                            styles.actionWrapper,
                            {
                                opacity: animations[index].opacity,
                                transform: [
                                    {
                                        translateY:
                                            animations[index].translateY,
                                    },
                                    {
                                        scale: animations[index].scale,
                                    },
                                ],
                            },
                        ]}
                    >
                        {item.popular && (
                            <Animated.View
                                style={[
                                    styles.popularBadge,
                                    {
                                        transform: [
                                            {
                                                scale: badgeScale,
                                            },
                                        ],
                                    },
                                ]}
                            >
                                <Text style={styles.popularText}>
                                    Popular
                                </Text>
                            </Animated.View>
                        )}

                        <TouchableOpacity
                        onPress={()=>navigation?.navigate('QuickSavingsScreen')}
                            activeOpacity={0.85}
                            style={[
                                styles.actionBox,
                                item.popular && styles.popularBox,
                            ]}
                        >
                            <View style={styles.iconContainer}>
                                <Image
                                    source={require('../../assets/jar.png')}
                                    style={{
                                        width: wp(6.5),
                                        height: wp(6.5),
                                    }}
                                    resizeMode="contain"
                                />
                            </View>

                            <Text
                                style={styles.actionText}
                                numberOfLines={2}
                            >
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        marginVertical: wp(2),
        borderWidth: 1,
        borderColor: '#E5E7EB',
        width: '95%',
        borderRadius: wp(3),
        paddingVertical: wp(2),
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
    },

    headerContainer: {
        paddingHorizontal: wp(4),
        marginBottom: wp(4),
    },

    title: {
        fontSize: wp(3.2), fontFamily: 'Poppins_700Bold',
        color: '#1F2937', marginBottom: wp(1), alignSelf: 'center',
    },
    description: {
        fontSize: wp(2.5), lineHeight: wp(4.8), color: '#6B7280',
        fontFamily: 'Poppins_400Regular',
    }, container: {
        flexDirection: 'row', flexWrap: 'wrap',
        paddingHorizontal: wp(2), justifyContent: 'space-between',
    }, actionWrapper: {
        width: '20%', marginBottom: wp(3),
        height: wp(25),
    }, actionBox: {
        width: '92%', height: '100%', borderRadius: wp(3),
        justifyContent: 'center', alignItems: 'center', backgroundColor: '#E9CB95',
        shadowColor: '#000', shadowOffset: {
            width: 0, height: 4,
        }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
    }, popularBox: {
        borderWidth: 1.5, borderColor: COLORS.primary, elevation: 8,
    }, popularBadge: {
        position: 'absolute', top: -wp(2),
        right: hp(2), zIndex: 10, backgroundColor: COLORS.primary,
        borderRadius: wp(4), paddingHorizontal: wp(2), paddingVertical: wp(0.7),
    }, popularText: {
        color: '#FFFFFF', fontSize: wp(1.7),
        fontFamily: 'Poppins_600SemiBold',
    },
    iconContainer: {
        width: wp(11),
        height: wp(12), borderRadius: wp(2),
        backgroundColor: COLORS.primary, justifyContent: 'center',
        alignItems: 'center',
    }, actionText: {
        marginTop: wp(1.5), fontSize: wp(2.5),
        textAlign: 'center', color: '#222222', fontFamily: 'Poppins_600SemiBold',
        paddingHorizontal: wp(1),
    },
});