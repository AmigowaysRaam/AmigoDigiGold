import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { wp } from '../resources/dimensions';
import PriceHeader from './constants/components/PriceHeader';
import { COLORS } from '../resources/colors';
import { useNavigation } from '@react-navigation/native';

const actions = [
    {
        title: 'Join Plan',
        icon: 'wallet-outline',
        nav:'JoinPlan'
    },
    {
        title: 'Redeem Gold & Silver',
        icon: 'gift-outline',
        nav:'RedeemGold'
    },
    {
        title: 'My Plans',
        icon: 'book-outline',
        nav:'RedeemGold'

    },
    {
        title: 'Pay Due',
        icon: 'card-outline',
        nav:'JoinPlan'

    },
];

export const QuickAction = () => {
    const animations = useRef(
        actions.map(() => ({
            opacity: new Animated.Value(0),
            translateY: new Animated.Value(30),
            scale: new Animated.Value(0.9),
        })),
    ).current;
    const navigation = useNavigation();

    useEffect(() => {
        const animationSequence = animations.map((anim) =>
            Animated.parallel([
                Animated.timing(anim.opacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(anim.translateY, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.spring(anim.scale, {
                    toValue: 1,
                    friction: 6,
                    tension: 80,
                    useNativeDriver: true,
                }),
            ]),
        );

        Animated.stagger(100, animationSequence).start();
    }, []);

    return (
        <View style={styles.container}>
            {actions.map((item, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.actionWrapper,
                        {
                            // opacity: animations[index].opacity,
                            transform: [
                                {
                                    translateY:
                                        animations[index].translateY,
                                },
                                {
                                    scale:
                                        animations[index].scale,
                                },
                            ],
                        },
                    ]}
                >
                    <TouchableOpacity
                        onPress={
                            () => {
                                navigation?.navigate(item?.nav)
                            }
                        }
                        style={styles.actionBox}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name={item.icon}
                            size={wp(7)}
                            color={COLORS?.accent}
                        />

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
    );
};
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: wp(2),
        justifyContent: 'space-between',
        marginVertical: wp(4),
    },
    actionWrapper: {
        width: '23%',
        marginBottom: wp(2),
    },
    actionBox: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: COLORS?.primary,
        borderRadius: wp(2),
        justifyContent: 'center',
        alignItems: 'center',

    },

    actionText: {
        marginTop: wp(1.5),
        fontSize: wp(2.6),
        textAlign: 'center',
        color: COLORS?.accent,
        fontFamily: 'Poppins_500Medium',
        paddingHorizontal: wp(1),
    },
});