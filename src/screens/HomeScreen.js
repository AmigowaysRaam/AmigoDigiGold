import React, { useState, useCallback } from 'react';
import {
    StyleSheet, ScrollView, RefreshControl
} from 'react-native';
import { SafeAreaProvider, SafeAreaView, } from 'react-native-safe-area-context';
import HeaderComman from './constants/components/HeaderComman';
import GoldPriceCards from './GoldPrice';
import Carousel from './Carousel';
import { QuickAction } from './QuickAction';
import HomeLoader from './HomescreeLoader';
import { SavingsQuickAction } from './SavingsQuickAction';
import { hp } from '../resources/dimensions';

export default function HomeScreen({ navigation }) {

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 500);
    }, []);

    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={styles.container}
                edges={['top']}
            >
                <HeaderComman
                    title="home"
                    showBackButton={false}
                />
                {
                    refreshing ?
                        <HomeLoader />
                        :
                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    onRefresh={onRefresh}
                                />
                            }
                        >
                            <GoldPriceCards />
                            <Carousel />
                            <QuickAction />
                            <SavingsQuickAction />
                        </ScrollView>
                }
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: { paddingBottom: hp(10), },
});