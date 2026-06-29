import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TextInput,
    Pressable, ScrollView, Alert, ImageBackground
} from 'react-native';
import {
    SafeAreaProvider, SafeAreaView,
} from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../resources/colors';
import { hp, wp } from '../resources/dimensions';
import PriceHeader from './constants/components/PriceHeader';
import { Ionicons } from '@expo/vector-icons';
import CommonBottomSheet from './constants/components/SummaryModal';
export default function JoinPlan() {
    const navigation = useNavigation();
    const [selectedTab, setSelectedTab] = useState('gold');
    const [selectedUnit, setSelectedUnit] = useState('rupee');
    const [amount, setAmount] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [showSummaryConfirm, setshowSummaryConfirm] = useState(false)
    const quickAmounts = [100, 500, 1000, 5000];
    const plansArr = [
        { title: "Quick Saving", key: "quicksaving" },
        { title: "SIP", key: "sip" },
        { title: "Sell Gold & Silver", key: "sellgoldsilver" },
    ];
    const [selectedPlan, setselectedPlan] = useState(plansArr[0])

    const GOLD_RATE = 9500; // ₹ per gram
    const numericAmount = Number(amount || 0);

    const grams =
        selectedUnit === 'rupee'
            ? (numericAmount / GOLD_RATE).toFixed(4)
            : numericAmount.toFixed(4);

    const rupees =
        selectedUnit === 'gram'
            ? (numericAmount * GOLD_RATE).toFixed(2)
            : numericAmount.toFixed(2);

    const handleAmountSelect = value => {
        setAmount(String(value));
    };

    const handlePayNow = () => {
        if (!amount.trim()) {
            Alert.alert('Validation', 'Please enter an amount');
            return;
        }
        if (!acceptedTerms) {
            Alert.alert('Validation', 'Please accept Terms & Conditions');
            return;
        }
        console.log({
            metal: selectedTab,
            unit: selectedUnit,
            amount,
            grams,
            rupees,
        });
        setshowSummaryConfirm(true)
    };
    const RadioButton = ({ title, selected, onPress }) => (
        <Pressable style={styles.radioWrapper} onPress={onPress}>
            <Ionicons name={selected ? "radio-button-on" : "radio-button-off"} size={wp(5)} color={COLORS?.primary} />
            <Text style={styles.radioText}>{title}</Text>
        </Pressable>
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['top']}>
                <PriceHeader title="Join Plan" />

                <ScrollView
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Gold / Silver Tabs */}
                    <View style={styles.tabContainer}>
                        <Pressable
                            style={[
                                styles.tab,
                                selectedTab === 'gold' && styles.activeTab,
                            ]}
                            onPress={() => setSelectedTab('gold')}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    selectedTab === 'gold' && styles.activeTabText,
                                ]}
                            >
                                Digi Gold
                            </Text>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.tab,
                                selectedTab === 'silver' && styles.activeTab,
                            ]}
                            onPress={() => setSelectedTab('silver')}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    selectedTab === 'silver' && styles.activeTabText,
                                ]}
                            >
                                Digi Silver
                            </Text>
                        </Pressable>
                    </View>


                    <ImageBackground
                        source={require('../../assets/cardBg.png')} // your image path
                        style={styles.card}
                        imageStyle={{
                            borderRadius: wp(4),
                            resizeMode: 'cover', // or 'stretch', 'contain'
                        }}
                    >
                        <View style={styles.radioContainer}>
                            <RadioButton
                                title="Rupee"
                                selected={selectedUnit === 'rupee'}
                                onPress={() => {
                                    setSelectedUnit('rupee');
                                    setAmount('');
                                }}
                            />

                            <RadioButton
                                title="Gram"
                                selected={selectedUnit === 'gram'}
                                onPress={() => {
                                    setSelectedUnit('gram');
                                    setAmount('');
                                }}
                            />
                        </View>
                        <View style={[styles.quickAmountContainer, {
                        }]}>
                            {plansArr.map(item => (
                                <Pressable
                                    key={item?.key}
                                    onPress={() => setselectedPlan(item)}
                                    style={[
                                        {
                                            borderWidth: 1,
                                            borderColor: '#DDD',
                                            paddingHorizontal: wp(6),
                                            borderRadius: wp(4),
                                            marginRight: wp(2),
                                            marginBottom: hp(1.5),
                                        },
                                        selectedPlan?.key === String(item?.key) && styles.selectedChip,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.amountChipText,
                                            selectedPlan?.key === String(item?.key) &&
                                            styles.selectedChipText, {
                                                fontSize: wp(2.5)
                                            }
                                        ]}
                                    >
                                        {item?.title}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        <Text style={styles.label}>
                            {selectedUnit === 'rupee'
                                ? 'Enter Amount'
                                : 'Enter Grams'}
                        </Text>

                        <View style={styles.inputWrapper}>
                            <TextInput
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="numeric"
                                placeholder={
                                    selectedUnit === 'rupee'
                                        ? '₹ Enter amount'
                                        : 'Enter grams'
                                }
                                placeholderTextColor="#999"
                                style={styles.input}
                            />

                            <View style={styles.topRightValue}>
                                <Text style={styles.topRightText}>
                                    {selectedUnit === 'rupee'
                                        ? `${grams} gm`
                                        : `₹ ${rupees}`}
                                </Text>
                            </View>
                        </View>

                        {amount ? (
                            <Text style={styles.infoText}>
                                {selectedUnit === 'rupee'
                                    ? `${grams} gm (Inclusive of all taxes)`
                                    : `₹ ${rupees} (Inclusive of all taxes)`}
                            </Text>
                        ) : null}

                        <Text style={styles.quickTitle}>Quick Select</Text>

                        <View style={styles.quickAmountContainer}>
                            {quickAmounts.map(item => (
                                <Pressable
                                    key={item}
                                    onPress={() => handleAmountSelect(item)}
                                    style={[
                                        styles.amountChip,
                                        amount === String(item) && styles.selectedChip,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.amountChipText,
                                            amount === String(item) &&
                                            styles.selectedChipText,
                                        ]}
                                    >
                                        {selectedUnit === 'rupee'
                                            ? `₹${item}`
                                            : `${item} gm`}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </ImageBackground>

                    <Pressable
                        style={[styles.termsContainer, {
                            marginTop: hp(3)
                        }]}
                        onPress={() =>
                            setAcceptedTerms(prev => !prev)
                        }
                    >
                        {
                            acceptedTerms ?
                                <Ionicons name="checkbox" size={wp(5)} color={COLORS?.primary} />
                                :
                                <Ionicons name="square-outline" size={wp(5)} color={COLORS?.primary} />

                        }

                        <View
                            style={{ flexDirection: 'row' }}
                        >
                            <Text style={styles.termsText}>
                                I accept the
                                {/* PrivacyPolicy naviate */}
                            </Text>
                            <Pressable onPress={() => { navigation?.navigate('TermsAndConditionsScreen') }}>
                                <Text style={[styles.termsText, {
                                    color: COLORS?.primary,
                                    textDecorationLine: "underline"
                                }]}>
                                    Terms & Conditions and
                                    {/* PrivacyPolicy naviate */}
                                </Text>
                            </Pressable>
                            <Pressable onPress={() => { navigation?.navigate('PrivacyPolicy') }}>
                                <Text style={[styles.termsText, {
                                    textDecorationLine: "underline",
                                    color: COLORS?.primary, marginLeft: wp(4)
                                }]}>
                                    Privacy
                                </Text>
                            </Pressable>

                        </View>
                    </Pressable>
                </ScrollView>
                <CommonBottomSheet
                    visible={showSummaryConfirm}
                    onClose={() => setshowSummaryConfirm(false)}
                    title="Quick Saving Summary"
                    subtitle="Please review before proceeding"
                    data={[
                        {
                            label: 'Metal',
                            value: selectedTab,
                        },
                        {
                            label: 'Unit',
                            value: selectedUnit,
                        },
                        {
                            label: 'Amount',
                            value: amount,
                        },
                        {
                            label: 'Gold Weight',
                            value: `${grams} gm`,
                        },
                        {
                            label: 'Payable',
                            value: `₹ ${rupees}`,
                        },
                    ]}
                    onConfirm={() => {
                        console.log({
                            selectedTab,
                            selectedUnit,
                            amount,
                            grams,
                            rupees,
                        });

                        setshowSummaryConfirm(false);
                    }}
                />
                <View style={styles.bottomContainer}>
                    <View style={styles.bottomInfo}>
                        <Text style={styles.bottomLabel}>
                            {selectedUnit === 'rupee'
                                ? 'Gold Weight'
                                : 'Amount'}
                        </Text>
                        <Text style={styles.bottomValue}>
                            {selectedUnit === 'rupee'
                                ? `${grams} gm`
                                : `₹ ${rupees}`}
                        </Text>
                    </View>
                    <Pressable
                        disabled={!acceptedTerms}
                        style={[
                            styles.payButton,
                            !acceptedTerms &&
                            styles.disabledButton,
                        ]}
                        onPress={() => setshowSummaryConfirm(true)}
                    >
                        <Text style={styles.payButtonText}>
                            Pay Now
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    contentContainer: { padding: wp(2), }, tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#ECECEC', marginBottom: hp(1), borderRadius: wp(3)
    },
    tab: {
        flex: 1, paddingVertical: hp(1.5), alignItems: 'center',
        borderRadius: wp(3)
    }, activeTab: { backgroundColor: COLORS.primary, },
    tabText: {
        fontSize: wp(3.8), color: '#666', fontFamily: 'Poppins_500Medium',
    }, activeTabText: {
        color: '#FFF', fontFamily: 'Poppins_600SemiBold',
    },
    card: {
        backgroundColor: '#FFF', borderRadius: 18, padding: wp(5), overflow: 'hidden', // important for borderRadius
    },
    radioContainer: { flexDirection: 'row', marginBottom: hp(2), },
    radioWrapper: { flexDirection: 'row', alignItems: 'center', marginRight: wp(5), }, radioOuter: {
        width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: COLORS.primary,
        justifyContent: 'center', alignItems: 'center',
    }, radioInner: {
        width: 10,
        height: 10, borderRadius: 5, backgroundColor: COLORS.primary,
    },
    radioText: {
        marginLeft: wp(2), fontFamily: 'Poppins_500Medium', color: '#333',
    }, label: {
        fontSize: wp(4), color: '#444', marginBottom: hp(1), fontFamily: 'Poppins_500Medium',
    }, inputWrapper: { position: 'relative', }, input: {
        borderWidth: 1, borderColor: '#E2E2E2', borderRadius: 12,
        paddingHorizontal: wp(4), height: hp(7), fontSize: wp(4.5), color: '#000',
    },
    topRightValue: {
        position: 'absolute', right: wp(3), top: hp(0.8),
    }, topRightText: {
        color: COLORS.primary, fontFamily: 'Poppins_600SemiBold', fontSize: wp(3.2),
    }, infoText: {
        marginTop: hp(1), color: '#666', fontSize: wp(3), fontFamily: 'Poppins_500Medium',
    },
    quickTitle: {
        marginTop: hp(3), marginBottom: hp(1.5), fontSize: wp(4), color: '#444',
        fontFamily: 'Poppins_500Medium',
    }, quickAmountContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    }, amountChip: {
        borderWidth: 1, borderColor: '#DDD',
        paddingHorizontal: wp(4), borderRadius: 30, marginRight: wp(3), marginBottom: hp(1.5),
    },
    selectedChip: {
        backgroundColor: COLORS.primary, borderColor: COLORS.primary,
    },
    amountChipText: {
        color: '#333', lineHeight: wp(8), fontSize: wp(3.2),
    },
    selectedChipText: {
        color: '#FFF',
    }, termsContainer: {
        flexDirection: 'row', alignItems: 'center',
        margin: hp(1), marginTop: wp(4)
    }, termsText: {
        marginLeft: wp(1), color: '#555',
        fontSize: wp(3.2),
    },
    bottomContainer: {
        backgroundColor: COLORS.accent, paddingHorizontal: wp(5),
        paddingVertical: hp(2), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingBottom: hp(4)
    }, bottomInfo: { flex: 1, }, bottomLabel: {
        color: COLORS?.primary,
        fontSize: wp(3),
    }, bottomValue: {
        color: COLORS?.primary, fontSize: wp(4.5),
        fontFamily: 'Poppins_600SemiBold',
    }, payButton: {
        width: '50%',
        height: hp(6.5),
        backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
        borderRadius: 12,
    },
    disabledButton: { opacity: 0.5, }, payButtonText: {
        color: '#FFF', fontSize: wp(4),
        fontFamily: 'Poppins_600SemiBold',
    },
});