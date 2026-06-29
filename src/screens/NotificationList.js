import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    ScrollView,
    RefreshControl,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import {
    SafeAreaProvider,
    SafeAreaView,
} from 'react-native-safe-area-context';

import HeaderComman from './constants/components/HeaderComman';
import { wp } from '../resources/dimensions';
import { COLORS } from '../resources/colors';

const dummyNotifications = [
    {
        id: '1',
        title: 'Order Delivered',
        message:
            'Your order #ORD12345 has been delivered successfully.',
        time: '5 min ago',
        unread: true,
        icon: '📦',
    },
    {
        id: '4',
        title: 'Profile Updated',
        message:
            'Your profile information has been updated successfully.',
        time: 'Yesterday',
        unread: false,
        icon: '👤',
    },
    {
        id: '5',
        title: 'Welcome',
        message:
            'Welcome to our application. Explore exciting features now.',
        time: '2 days ago',
        unread: false,
        icon: '👋',
    },
];

export default function NotificationList() {
    const [refreshing, setRefreshing] = useState(false);
    const [notifications, setNotifications] = useState(
        dummyNotifications,
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);

        setTimeout(() => {
            setNotifications([...dummyNotifications]);
            setRefreshing(false);
        }, 1000);
    }, []);

    const markAsRead = (id) => {
        const updatedData = notifications.map((item) =>
            item.id === id
                ? { ...item, unread: false }
                : item,
        );

        setNotifications(updatedData);
    };

    const renderNotificationItem = (item) => (
        <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            style={[
                styles.notificationCard,
                item.unread && styles.unreadCard,
            ]}
            onPress={() => markAsRead(item.id)}
        >
            <View style={styles.iconContainer}>
                <Text style={styles.icon}>{item.icon}</Text>
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>
                        {item.title}
                    </Text>

                    {item.unread && (
                        <View style={styles.unreadDot} />
                    )}
                </View>

                <Text style={styles.message}>
                    {item.message}
                </Text>

                <Text style={styles.time}>
                    {item.time}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={styles.container}
                edges={['top']}
            >
                <HeaderComman
                    title="Notifications"
                    showBackButton={true}
                />

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[COLORS?.primary]}
                            tintColor={COLORS?.primary}
                        />
                    }
                >
                    {notifications.length > 0 ? (
                        notifications.map(renderNotificationItem)
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyIcon}>
                                🔔
                            </Text>
                            <Text style={styles.emptyTitle}>
                                No Notifications
                            </Text>
                            <Text style={styles.emptyMessage}>
                                You don't have any notifications
                                yet.
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS?.accent + "22",
    },
    scrollContent: {
        padding: wp(2),
        paddingBottom: 40,
    },
    notificationCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
        padding: wp(1),
        marginBottom: wp(2),

    },

    unreadCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#4F46E5',
    },

    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
    },

    icon: {
        fontSize: 24,
    },

    contentContainer: {
        flex: 1,
        marginLeft: 14,
    },

    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    title: {
        flex: 1,
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },

    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4F46E5',
        marginLeft: 8,
    },

    message: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 6,
        lineHeight: 20,
    },

    time: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 8,
    },

    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 120,
    },

    emptyIcon: {
        fontSize: 60,
    },

    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginTop: 16,
    },

    emptyMessage: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: 40,
    },
});