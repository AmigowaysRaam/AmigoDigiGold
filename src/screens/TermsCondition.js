import React from 'react';
import {
    View, Text,
    StyleSheet, ScrollView,
    TouchableOpacity,
} from 'react-native'; import {
    SafeAreaProvider,
    SafeAreaView,
} from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { wp } from '../resources/dimensions';
import { COLORS } from '../resources/colors';

const TermsAndConditionsScreen = () => {
    const navigation = useNavigation();

    const terms = [
        {
            title: '1. Membership Eligibility',
            description:
                'Users must provide accurate information while enrolling in any savings or investment plan.',
        },
        {
            title: '2. Plan Subscription',
            description:
                'Customers are required to make payments as per the selected plan schedule. Delayed payments may affect benefits.',
        },
        {
            title: '3. Gold & Silver Redemption',
            description:
                'Redeemed products are subject to market availability and prevailing rates at the time of redemption.',
        },
        {
            title: '4. Payment Policy',
            description:
                'All payments made through the application are non-refundable unless otherwise specified.',
        },
        {
            title: '5. Account Responsibility',
            description:
                'Users are responsible for maintaining the confidentiality of their account credentials.',
        },
        {
            title: '6. Modification of Terms',
            description:
                'The company reserves the right to update these terms at any time without prior notice.',
        },
        {
            title: '7. Privacy',
            description:
                'Personal information collected through the app is protected and used according to our privacy policy.',
        },
        {
            title: '8. Contact Information',
            description:
                'For support or clarification regarding plans and services, contact our customer support team.',
        },
    ];

    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={styles.container}
                edges={['top']}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={wp(6)}
                            color={COLORS.white}
                        />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        Terms & Conditions
                    </Text>

                    <View style={{ width: 40 }} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                >
                    {terms.map((item, index) => (
                        <View
                            key={index}
                            style={styles.termCard}
                        >
                            <Text style={styles.termTitle}>
                                {item.title}
                            </Text>

                            <Text style={styles.termDescription}>
                                {item.description}
                            </Text>
                        </View>
                    ))}
                    <View style={{ height: wp(5) }} />
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default TermsAndConditionsScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FC',
    },

    header: {
        height: wp(15),
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(4),
        elevation: 5,
    },

    backButton: {
        width: 40,
        alignItems: 'center',
    },

    headerTitle: {
        color: COLORS.white,
        fontSize: wp(4.5),
        fontFamily: 'Poppins_600SemiBold',
    },

    scrollContainer: {
        padding: wp(4),
    },
    title: {
        fontSize: wp(5),
        color: '#222',
        marginTop: wp(2),
        fontFamily: 'Poppins_600SemiBold',
    },

    subtitle: {
        textAlign: 'center',
        marginTop: wp(2),
        color: '#666',
        fontSize: wp(3.3),
        lineHeight: wp(5),
        fontFamily: 'Poppins_400Regular',
    },

    termCard: {
        backgroundColor: COLORS.white,
        borderRadius: wp(3),
        padding: wp(4),
        marginBottom: wp(3),

    },

    termTitle: {
        fontSize: wp(3.8),
        color: COLORS.primary,
        marginBottom: wp(1.5),
        fontFamily: 'Poppins_600SemiBold',
    },

    termDescription: {
        fontSize: wp(3.2),
        color: '#555',
        lineHeight: wp(5),
        fontFamily: 'Poppins_400Regular',
    },
});