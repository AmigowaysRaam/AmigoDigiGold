import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { hp, wp } from '../../../resources/dimensions';
import { COLORS } from '../../../resources/colors';
import { Ionicons } from '@expo/vector-icons';

export default function PriceHeader({
    title = 'Gold & Silver Rates',
}) {
    const navigation = useNavigation();

    return (
        <>
            <StatusBar
                backgroundColor={COLORS?.primary}
                barStyle="light-content"
            />

            {/* Header Logo */}
            <View
                style={[
                    styles.headerContainer,
                    { backgroundColor: COLORS?.primary },
                ]}
            >
                <Image
                    source={require('../../../../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            {/* Rate Bar */}
            <View
                style={[
                    styles.rateContainer,
                    {
                        backgroundColor: COLORS?.accent,
                    },
                ]}
            >
                <View style={styles.rateItem}>
                    <Ionicons
                        name="trending-up"
                        size={wp(4)}
                        color={COLORS?.primary}
                    />

                    <Text style={styles.rateLabel}>
                        Silver Rate:
                    </Text>

                    <Text style={styles.rateValue}>
                        ₹100/g
                    </Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.rateItem}>
                    <Ionicons
                        name="diamond"
                        size={wp(4)}
                        color={COLORS?.primary}
                    />

                    <Text style={styles.rateLabel}>
                        Gold Rate:
                    </Text>

                    <Text style={styles.rateValue}>
                        ₹100/g
                    </Text>
                </View>
            </View>

            {/* Back Button + Title */}
            <View style={styles.titleContainer}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons
                        name="arrow-back"
                        size={wp(6)}
                        color={COLORS?.primary}
                    />
                </TouchableOpacity>

                <Text style={styles.screenTitle}>
                    {title}
                </Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        height: wp(16),
        alignItems: 'center',
        justifyContent: 'center',
    },

    logo: {
        width: wp(30),
        height: wp(12),
    },

    rateContainer: {
        height: wp(8),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: wp(4),
    },

    rateItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    separator: {
        width: 1,
        height: wp(4),
        backgroundColor: '#D9D9D9',
        marginHorizontal: wp(5),
    },

    rateLabel: {
        marginLeft: wp(1),
        fontSize: wp(3),
        fontFamily: 'Poppins_500Medium',
        color: '#666',
    },

    rateValue: {
        marginLeft: wp(1),
        fontSize: wp(3.2),
        fontFamily: 'Poppins_600SemiBold',
        color: COLORS?.primary,
    },

    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp(4),
        paddingVertical: wp(3),
        backgroundColor: '#FFF',
    },

    backButton: {
        paddingRight: wp(3),
        justifyContent: 'center',
        alignItems: 'center',
    },
    screenTitle: {
        fontSize: wp(4.5),
        fontFamily: 'Poppins_600SemiBold',
        color: '#000',
        flex: 1, lineHeight: hp(4)
    },
});