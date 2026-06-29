import React, { useRef, useState } from 'react';
import {
    View, Text, ImageBackground, Pressable, StyleSheet,
    Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../resources/colors';
import { hp, wp } from '../resources/dimensions';
const { width } = require('react-native').Dimensions.get('window');

export default function WelcomeScreen() {

    const navigation = useNavigation();
    const flatListRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slides = [
        {
            image: require('../../assets/welcome1.png'),
            title: 'Welcome to Amigo Digigold',
            description:
                'Discover the timeless beauty of gold and diamond jewellery. Your trusted destination for purity, elegance, and tradition.',
            textColor: '#000',
        },
        {
            image: require('../../assets/welcome2.png'),
            title: 'Trusted Gold Savings',
            textColor: '#FFF',
            description:
                'Start your digital gold journey with secure investments and flexible savings plans.',
        },
        {
            image: require('../../assets/welcome3.png'),
            title: 'Shop With Confidence',
            textColor: '#000',
            description:
                'Explore premium collections and enjoy a seamless jewellery buying experience.',
        },
    ];

    const onViewRef = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    });
    const viewConfigRef = useRef({
        viewAreaCoveragePercentThreshold: 50,
    });
    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        } else {
            navigation.navigate('RegisterScreen');
        }
    };

    const renderItem = ({ item }) => (
        <ImageBackground
            source={item.image}
            resizeMode="cover"
            style={styles.slide}
        >
            <View style={styles.overlay}>
                <View />

                <View style={styles.content}>
                    <Text style={[styles.title, {
                        color: item.textColor || '#FFF',
                    }]}>
                        {item.title}
                    </Text>

                    <Text style={[styles.description, {
                        color: item.textColor || '#FFF',
                    }]}>
                        {item.description}
                    </Text>
                </View>
            </View>
        </ImageBackground>
    );

    return (
        <View style={{ flex: 1 }}>
            <Animated.FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                onViewableItemsChanged={onViewRef.current}
                viewabilityConfig={viewConfigRef.current}
                onScroll={Animated.event(
                    [
                        {
                            nativeEvent: {
                                contentOffset: {
                                    x: scrollX,
                                },
                            },
                        },
                    ],
                    {
                        useNativeDriver: false,
                    }
                )}
                scrollEventThrottle={16}
            />

            <View style={styles.bottomContainer}>
                <View style={styles.dotsContainer}>
                    {slides.map((_, index) => {
                        const inputRange = [
                            (index - 1) * width,
                            index * width,
                            (index + 1) * width,
                        ];

                        const dotWidth = scrollX.interpolate({
                            inputRange,
                            outputRange: [10, 28, 10],
                            extrapolate: 'clamp',
                        });

                        const opacity = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: 'clamp',
                        });

                        return (
                            <Animated.View
                                key={index}
                                style={[
                                    styles.dot,
                                    {
                                        width: dotWidth,
                                        opacity,
                                    },
                                ]}
                            />
                        );
                    })}
                </View>

                <Pressable
                    style={styles.button}
                    onPress={handleNext}
                >
                    <Text style={styles.buttonText}>
                        {currentIndex === slides.length - 1
                            ? 'Continue'
                            : 'Next'}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    slide: {
        width, flex: 1,
    },
    overlay: {
        flex: 1, justifyContent: 'space-between', paddingHorizontal: wp(6),
        paddingTop: hp(8),
        paddingBottom: hp(18),
    }, content: { alignItems: 'center', },

    title: { color: '#FFF', fontSize: wp(5), textAlign: 'center', fontFamily: 'Poppins_600SemiBold', }, description: {
        marginTop: hp(2), color: '#FFF',
        textAlign: 'center',
        fontSize: wp(3), lineHeight: 24, paddingHorizontal: wp(5), fontFamily: 'Poppins_400Regular',
    }, bottomContainer: {
        position: 'absolute', bottom: hp(5), left: wp(6),
        right: wp(6),
    },
    dotsContainer: {
        flexDirection: 'row', justifyContent: 'center', marginBottom: hp(3),
    }, dot: {
        height: 10, borderRadius: 5, backgroundColor: COLORS?.primary,
        marginHorizontal: 4,
    }, button: { backgroundColor: COLORS?.primary, paddingVertical: hp(2), borderRadius: wp(10), alignItems: 'center', },

    buttonText: {
        color: '#FFF', fontSize: wp(4.4), fontFamily: 'Poppins_600SemiBold',
    },
});