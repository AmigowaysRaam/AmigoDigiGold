import React, { useEffect, useRef, useState } from 'react';
import {
    View, StyleSheet, ImageBackground, Animated, FlatList,
    Dimensions,
} from 'react-native';
import { wp } from '../resources/dimensions';
import { COLORS } from '../resources/colors';
const { width } = Dimensions.get('window');
const Carousel = () => {
    const flatListRef = useRef(null);
    const currentIndex = useRef(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const banners = [
        {
            id: '1',
            image: require('../../assets/carousel.png'),
        },
        {
            id: '2',
            image: require('../../assets/langScreen.png'),
        },
        {
            id: '3',
            image: require('../../assets/carousel.png'),
        },
    ];
    useEffect(() => {
        const interval = setInterval(() => {
            currentIndex.current =
                (currentIndex.current + 1) % banners.length;

            flatListRef.current?.scrollToIndex({
                index: currentIndex.current,
                animated: true,
            });

            setActiveIndex(currentIndex.current);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.slideContainer}>
            <ImageBackground
                source={item.image}
                resizeMode="cover"
                imageStyle={styles.imageStyle}
                style={styles.banner}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={banners}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToAlignment="center"
                decelerationRate="fast"
                onMomentumScrollEnd={event => {
                    const index = Math.round(
                        event.nativeEvent.contentOffset.x /
                        (width - wp(4))
                    );

                    currentIndex.current = index;
                    setActiveIndex(index);
                }}
            />

            { <View style={styles.pagination}>
                {banners.map((_, index) => (
                    <Animated.View
                        key={index}
                        style={[
                            banners?.length > 1 &&
                            styles.dot,
                            activeIndex === index &&
                            styles.activeDot,
                        ]}
                    />
                ))}
            </View>}
        </View>
    );
};
export default Carousel;
const styles = StyleSheet.create({
    container: {
        marginVertical: wp(2),
    }, slideContainer: {
        width: width,
        paddingHorizontal: wp(2),
    }, banner: {
        width: '100%', height: wp(40),
        borderRadius: wp(3), overflow: 'hidden',
        borderWidth: wp(0.1), borderColor: '#E0E0E0',
        backgroundColor: COLORS?.primary+"90",

    }, imageStyle: {
        borderRadius: wp(3),
    }, pagination: {
        flexDirection: 'row', justifyContent: 'center',
        alignItems: 'center', marginTop: wp(2),
    }, dot: {
        width: wp(2), height: wp(2),
        borderRadius: wp(1), backgroundColor: '#D0D0D0', marginHorizontal: wp(1),
    }, activeDot: {
        width: wp(5), backgroundColor: '#D4AF37',
    },
});