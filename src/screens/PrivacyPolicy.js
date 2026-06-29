// PrivacyPolicy.js
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import {
    SafeAreaView,
} from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { wp } from '../resources/dimensions';
import { COLORS } from '../resources/colors';

const PrivacyPolicyScreen = () => {
    const navigation = useNavigation();

    const policies = [
        {
            title: '1. Information Collection',
            description:
                'We collect personal information such as your name, mobile number, email address, and account details when you register or use our services.',
        },
        {
            title: '2. Use of Information',
            description:
                'Your information is used to provide services, manage savings plans, process transactions, and improve user experience.',
        },
        {
            title: '3. Data Security',
            description:
                'We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.',
        },
        {
            title: '4. Payment Information',
            description:
                'Payment transactions are processed through secure payment gateways. We do not store sensitive card or banking credentials on our servers.',
        },
        {
            title: '5. Information Sharing',
            description:
                'We do not sell or rent your personal information to third parties. Information may be shared only when required by law or for service delivery.',
        },
        {
            title: '6. Cookies & Analytics',
            description:
                'The application may use analytics tools and cookies to understand user behavior and improve application performance.',
        },
        {
            title: '7. User Rights',
            description:
                'Users may request updates, corrections, or deletion of their personal information, subject to applicable legal requirements.',
        },
        {
            title: '8. Policy Updates',
            description:
                'This Privacy Policy may be updated periodically. Continued use of the application indicates acceptance of any revised policy.',
        },
        {
            title: '9. Contact Us',
            description:
                'For privacy-related concerns or questions, please contact our customer support team.',
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={COLORS.white}
                    />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Privacy Policy
                </Text>

                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
              

                {policies.map((item, index) => (
                    <View
                        key={index}
                        style={styles.policyCard}
                    >
                        <Text style={styles.policyTitle}>
                            {item.title}
                        </Text>

                        <Text style={styles.policyDescription}>
                            {item.description}
                        </Text>
                    </View>
                ))}

                <View style={{ height: wp(5) }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default PrivacyPolicyScreen;

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

    topCard: {
        backgroundColor: COLORS.white,
        borderRadius: wp(4),
        padding: wp(5),
        alignItems: 'center',
        marginBottom: wp(4),

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 4,
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

    policyCard: {
        backgroundColor: COLORS.white,
        borderRadius: wp(3),
        padding: wp(4),
        marginBottom: wp(3),

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },

    policyTitle: {
        fontSize: wp(3.8),
        color: COLORS.primary,
        marginBottom: wp(1.5),
        fontFamily: 'Poppins_600SemiBold',
    },

    policyDescription: {
        fontSize: wp(3.2),
        color: '#555',
        lineHeight: wp(5),
        fontFamily: 'Poppins_400Regular',
    },

    acceptButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: wp(4),
        borderRadius: wp(3),
        alignItems: 'center',
        marginTop: wp(3),
    },

    acceptButtonText: {
        color: COLORS.white,
        fontSize: wp(4),
        fontFamily: 'Poppins_600SemiBold',
    },
});