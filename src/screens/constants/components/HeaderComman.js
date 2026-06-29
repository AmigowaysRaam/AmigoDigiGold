import React, { useEffect, useRef, useState } from 'react';
import {
    View, Text, StyleSheet, Pressable, Image, StatusBar, Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { wp } from '../../../resources/dimensions';
import { COLORS } from '../../../resources/colors';
import { Ionicons } from '@expo/vector-icons';
import LanguageModal from './LanguageModal';
const NotificationButton = ({
    count = 12, onPress,
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.05,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),
        );
        animation.start();
        return () => animation.stop();
    }, []);

    return (
        <Pressable
            onPress={onPress}
            style={styles.notificationWrapper}
        >
            <Animated.Image
                source={require('../../../../assets/notif.png')}
                style={[
                    styles.icon,
                    {
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            />

            {count > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                        {count > 99 ? '99+' : count}
                    </Text>
                </View>
            )}
        </Pressable>
    );
};

export default function HeaderComman({
    title = 'Title',
    showBackButton = true,
    onBackPress,
    rightComponent = null,
}) {
    const navigation = useNavigation();
    const [languageModalVisible, setLanguageModalVisible] = useState(false);
    const handleBack = () => {
        if (onBackPress) {
            onBackPress();
        } else if (navigation.canGoBack()) {
            navigation.goBack();
        }
    };

    return (
        <>
            <StatusBar
                backgroundColor={COLORS?.primary}
                barStyle="light-content"
            />

            <View
                style={[
                    styles.headerContainer,
                    { backgroundColor: COLORS?.primary },
                ]}
            >
                <View style={styles.sideContainer}>
                    {title !== 'home' && showBackButton ? (
                        <Pressable
                            onPress={handleBack}
                            style={styles.backButton}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={wp(6)}
                                color="#FFF"
                            />
                        </Pressable>
                    ) : (
                        <Image
                            source={require('../../../../assets/menuIcon.png')}
                            style={styles.icon}
                        />
                    )}
                </View>

                {title === 'home' ? (
                    <View>
                        <Image
                            source={require('../../../../assets/logo.png')}
                            style={styles.logo}
                        />
                    </View>
                ) : (
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                )}

                {title === 'home' && (
                    <View style={styles.rightIcons}>
                        <Pressable onPress={() => setLanguageModalVisible(true)}>
                            <Image
                                source={require('../../../../assets/lang.png')}
                                style={styles.icon}
                            />
                        </Pressable>

                        <Image
                            source={require('../../../../assets/cart.png')}
                            style={styles.icon}
                        />

                        <NotificationButton
                            count={12}
                            onPress={() =>
                                navigation?.navigate('NotificationList')
                                // NotificationList
                                // console.log('Notification Pressed')
                            }
                        />
                    </View>
                )}
                <LanguageModal
                    visible={languageModalVisible}
                    onClose={() => setLanguageModalVisible(false)}
                    onSelectLanguage={(language) => {
                        console.log('Selected Language:', language?.name);
                    }}
                />
                {title !== 'home' && (
                    <View style={styles.sideContainer}>
                        {rightComponent}
                    </View>
                )}
            </View>
        </>
    );
}
const styles = StyleSheet.create({
    headerContainer: {
        height: wp(16), flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: wp(4), elevation: 5, shadowColor: '#000',
        shadowOpacity: 0.15, shadowRadius: 4,
        shadowOffset: { width: 0, height: 2, },
    }, sideContainer: {
        width: wp(12), alignItems: 'center',
        justifyContent: 'center',
        marginRight: wp(2.5),
    }, backButton: {
        width: wp(10), height: wp(10), justifyContent: 'center', alignItems: 'center',
    }, titleContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', },
    rightIcons: {
        flex: 1, flexDirection: 'row', justifyContent: 'flex-end',
        alignItems: 'center',
    },

    notificationWrapper: {
        marginLeft: wp(0.5), justifyContent: 'center',
        alignItems: 'center',
    }, icon: {
        width: wp(7.5), height: wp(7.5), marginLeft: wp(2), resizeMode: 'contain',
    }, badge: {
        position: 'absolute', top: -2, right: -4, minWidth: wp(4), height: wp(4.2), borderRadius: wp(2),
        backgroundColor: '#FF3B30', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 1,
        borderWidth: 1,
        borderColor: '#FFF',
    },
    badgeText: {
        color: '#FFF', fontSize: wp(2.5),
        fontFamily: 'Poppins_600SemiBold',
    }, logo: { width: wp(25), height: wp(10), resizeMode: 'contain', },
    title: {
        color: '#FFF', fontSize: wp(5),
        fontFamily: 'Poppins_600SemiBold', textTransform: 'capitalize',
    },
});