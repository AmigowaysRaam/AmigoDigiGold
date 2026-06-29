import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    ScrollView,
    Alert,
    ImageBackground,
} from 'react-native';
import {
    SafeAreaProvider,
    SafeAreaView,
} from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../resources/colors';
import { hp, wp } from '../resources/dimensions';

import PriceHeader from './constants/components/PriceHeader';
import CommonBottomSheet from './constants/components/SummaryModal';

const GOLD_RATE = 9500;

const QUICK_PERCENTAGES = [25, 50, 75, 100, 150];

export default function RedeemGold() {
    const navigation = useNavigation();

    const [selectedTab, setSelectedTab] = useState('gold');
    const [amount, setAmount] = useState('500');
    const [acceptedTerms, setAcceptedTerms] = useState(true);
    const [showSummaryConfirm, setShowSummaryConfirm] =
        useState(false);

    const numericAmount = Number(amount || 0);

    const grams = useMemo(() => {
        return (numericAmount / GOLD_RATE).toFixed(4);
    }, [numericAmount]);

    const handlePercentageSelect = value => {
        setAmount(String(value));
    };

    const handlePayNow = () => {
        if (!amount.trim()) {
            Alert.alert(
                'Validation',
                'Please enter an amount',
            );
            return;
        }

        if (!acceptedTerms) {
            Alert.alert(
                'Validation',
                'Please accept Terms & Conditions',
            );
            return;
        }

        setShowSummaryConfirm(true);
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={styles.container}
                edges={['top']}
            >
                <PriceHeader title="Redeem Gold" />

                {/* GREEN STATS BAR */}

                <View style={styles.summaryContainer}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>
                            My Savings
                        </Text>

                        <Text style={styles.summaryValue}>
                            0.0524 gm
                        </Text>
                    </View>

                    <View style={styles.summaryDivider} />

                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>
                            Sell Gold Price
                        </Text>

                        <Text style={styles.summaryValue}>
                            ₹ 7,830.92
                        </Text>
                    </View>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainer}
                >
                    <ImageBackground
                        source={require('../../assets/cardBg.png')}
                        style={styles.card}
                        imageStyle={styles.cardImage}
                    >
                        {/* GOLD SILVER TAB */}

                        <View style={styles.metalTabs}>
                            <Pressable
                                onPress={() =>
                                    setSelectedTab('gold')
                                }
                                style={styles.metalTab}
                            >
                                <Text
                                    style={[
                                        styles.metalText,
                                        selectedTab === 'gold' &&
                                        styles.activeMetalText,
                                    ]}
                                >
                                    ✨ Digi Gold
                                </Text>

                                {selectedTab === 'gold' && (
                                    <View
                                        style={styles.activeLine}
                                    />
                                )}
                            </Pressable>

                            <Pressable
                                onPress={() =>
                                    setSelectedTab('silver')
                                }
                                style={styles.metalTab}
                            >
                                <Text
                                    style={[
                                        styles.metalText,
                                        selectedTab === 'silver' &&
                                        styles.activeMetalText,
                                    ]}
                                >
                                    ✨ Digi Silver
                                </Text>

                                {selectedTab === 'silver' && (
                                    <View
                                        style={styles.activeLine}
                                    />
                                )}
                            </Pressable>
                        </View>

                        {/* AMOUNT */}

                        <Text style={styles.label}>
                            Amount
                        </Text>

                        <View style={styles.amountRow}>
                            <TextInput
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="numeric"
                                placeholder="₹500"
                                placeholderTextColor="#999"
                                style={styles.amountInput}
                            />

                            <Text style={styles.gramText}>
                                gm|{grams}
                            </Text>
                        </View>

                        <Text style={styles.infoText}>
                            Total ₹{amount || 0} money
                            {' '}
                            ( Inclusive all of taxes )
                        </Text>

                        {/* QUICK PERCENTAGES */}

                        <View
                            style={
                                styles.quickPercentageContainer
                            }
                        >
                            {QUICK_PERCENTAGES.map(item => (
                                <Pressable
                                    key={item}
                                    onPress={() =>
                                        handlePercentageSelect(item)
                                    }
                                    style={[
                                        styles.percentChip,
                                        amount === String(item) &&
                                        styles.selectedChip,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.percentText,
                                            amount === String(item) &&
                                            styles.selectedChipText,
                                        ]}
                                    >
                                        {item}%
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        {/* TERMS */}

                        <Pressable
                            style={styles.termsContainer}
                            onPress={() =>
                                setAcceptedTerms(prev => !prev)
                            }
                        >
                            <Ionicons
                                name={
                                    acceptedTerms
                                        ? 'checkbox'
                                        : 'square-outline'
                                }
                                size={wp(5)}
                                color={COLORS.primary}
                            />

                            <View
                                style={styles.termsContent}
                            >
                                <Text style={styles.termsText}>
                                    I agree to the
                                </Text>

                                <Pressable
                                    onPress={() =>
                                        navigation.navigate(
                                            'TermsAndConditionsScreen',
                                        )
                                    }
                                >
                                    <Text
                                        style={styles.linkText}
                                    >
                                        {' '}
                                        T&C
                                    </Text>
                                </Pressable>

                                <Text style={styles.termsText}>
                                    {' '}and{' '}
                                </Text>

                                <Pressable
                                    onPress={() =>
                                        navigation.navigate(
                                            'PrivacyPolicy',
                                        )
                                    }
                                >
                                    <Text
                                        style={styles.linkText}
                                    >
                                        Privacy Policy
                                    </Text>
                                </Pressable>
                            </View>
                        </Pressable>
                    </ImageBackground>
                </ScrollView>

                <CommonBottomSheet
                    visible={showSummaryConfirm}
                    onClose={() =>
                        setShowSummaryConfirm(false)
                    }
                    title="Redeem Gold Summary"
                    subtitle="Please review before proceeding"
                    data={[
                        {
                            label: 'Metal',
                            value:
                                selectedTab === 'gold'
                                    ? 'Digi Gold'
                                    : 'Digi Silver',
                        },
                        {
                            label: 'Amount',
                            value: `₹ ${amount}`,
                        },
                        {
                            label: 'Weight',
                            value: `${grams} gm`,
                        },
                        {
                            label: 'Payable',
                            value: `₹ ${amount}`,
                        },
                    ]}
                    onConfirm={() => {
                        setShowSummaryConfirm(false);
                    }}
                />

                {/* BOTTOM CTA */}

                <View style={styles.bottomContainer}>
                    <View style={styles.bottomInfo}>
                        <Text style={styles.bottomGram}>
                            {grams} gm
                        </Text>

                        <Text style={styles.bottomAmount}>
                            ₹{amount || 0}
                        </Text>

                        <Text style={styles.bottomGST}>
                            Incl. (GST)
                        </Text>
                    </View>

                    <Pressable
                        style={styles.payButton}
                        onPress={handlePayNow}
                    >
                        <Text style={styles.payButtonText}>
                            Pay Now!
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </SafeAreaProvider >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F3F3',
    },

    contentContainer: {
        padding: wp(3),
    },
    summaryContainer: {
        flexDirection: 'row',
        backgroundColor: '#00796B',
        paddingVertical: hp(1),
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    summaryLabel: {
        color: '#FFF',
        fontSize: wp(2.8),
        fontFamily: 'Poppins_400Regular',
    },
    summaryValue: {
        color: '#FFF',
        marginTop: hp(0.5),
        fontSize: wp(4.2),
        fontFamily: 'Poppins_600SemiBold',
    },

    /* ==========================
       CARD
    ========================== */

    card: {
        borderWidth: 1,
        borderColor: '#E6D27A',
        borderRadius: wp(1.5),
        padding: wp(4),
        overflow: 'hidden',
        backgroundColor: '#FFF',
    },

    cardImage: {
        borderRadius: wp(1.5),
        resizeMode: 'cover',
    },

    metalTabs: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#DDD',
        paddingBottom: hp(1),
        marginBottom: hp(3),
    },

    metalTab: {
        marginHorizontal: wp(6),
        alignItems: 'center',
    },

    metalText: {
        fontSize: wp(3.6),
        color: '#888',
        fontFamily: 'Poppins_500Medium',
    },

    activeMetalText: {
        color: '#222',
    },

    activeLine: {
        marginTop: hp(0.7),
        width: wp(10),
        height: 2,
        backgroundColor: '#00796B',
    },

    /* ==========================
       INPUT
    ========================== */

    label: {
        color: '#222',
        fontSize: wp(3.4),
        marginBottom: hp(1),
        fontFamily: 'Poppins_500Medium',
    },

    amountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#888',
        paddingBottom: hp(0.8),
    },

    amountInput: {
        flex: 1,
        color: '#000',
        fontSize: wp(5.2),
        paddingVertical: 0,
        fontFamily: 'Poppins_600SemiBold',
    },

    gramText: {
        color: '#333',
        fontSize: wp(3.2),
    },

    infoText: {
        marginTop: hp(1),
        color: '#444',
        fontSize: wp(2.7),
    },

    /* ==========================
       PERCENT BUTTONS
    ========================== */

    quickPercentageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp(3),
    },

    percentChip: {
        minWidth: wp(14),
        height: hp(3),
        borderRadius: hp(1.5),
        borderWidth: 1,
        borderColor: '#BDBDBD',
        justifyContent: 'center',
        alignItems: 'center',
    },

    percentText: {
        color: '#555',
        fontSize: wp(2.8),
    },

    selectedChip: {
        backgroundColor: '#00796B',
        borderColor: '#00796B',
    },

    selectedChipText: {
        color: '#FFF',
    },

    /* ==========================
       TERMS
    ========================== */

    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp(3),
    },

    termsContent: {
        flexDirection: 'row',
        marginLeft: wp(2),
        alignItems: 'center',
        flexWrap: 'wrap',
    },

    termsText: {
        color: '#333',
        fontSize: wp(3),
    },

    linkText: {
        color: '#00796B',
        fontSize: wp(3),
        fontFamily: 'Poppins_600SemiBold',
    },

    /* ==========================
       BOTTOM BAR
    ========================== */

    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F4DD6C',
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.5),
    },

    bottomInfo: {
        flex: 1,
    },

    bottomGram: {
        color: '#00796B',
        fontSize: wp(4),
        fontFamily: 'Poppins_600SemiBold',
    },

    bottomAmount: {
        color: '#000',
        fontSize: wp(6),
        lineHeight: wp(7),
        fontFamily: 'Poppins_700Bold',
    },

    bottomGST: {
        color: '#333',
        fontSize: wp(2.8),
    },

    payButton: {
        width: wp(42),
        height: hp(5.5),
        backgroundColor: '#00796B',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp(2),
    },

    payButtonText: {
        color: '#FFF',
        fontSize: wp(4),
        fontFamily: 'Poppins_600SemiBold',
    },
});