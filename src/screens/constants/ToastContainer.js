import React, {
    createContext, useContext, useRef, useState,
} from "react";
import {
    Animated, Easing, Image, StyleSheet, Text, View,
} from "react-native";
import { hp, wp } from "../../resources/dimensions";
const appIcon = require("../../../assets/amigoLogo.png");
const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const slideAnim = useRef(new Animated.Value(-100)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;

    const hideTimer = useRef(null);

    const pulseLoop = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 800,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const showToast = (
        message,
        type = "info",
        duration = 3000
    ) => {
        if (hideTimer.current) {
            clearTimeout(hideTimer.current);
        }

        setToast({ message, type });

        slideAnim.setValue(-100);
        opacityAnim.setValue(0);
        overlayOpacity.setValue(0);
        pulseAnim.setValue(1);

        pulseLoop();

        Animated.parallel([
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 7,
                tension: 70,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 350,
                useNativeDriver: true,
            }),
            Animated.timing(overlayOpacity, {
                toValue: 0.1, // slight dim background
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start();

        hideTimer.current = setTimeout(() => {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -100,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(overlayOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                pulseAnim.stopAnimation();
                pulseAnim.setValue(1);
                setToast(null);
            });
        }, duration);
    };

    const getToastStyle = (type) => {
        switch (type) {
            case "success":
                return {
                    backgroundColor: "#1f8f5f",
                    shadowColor: "#2ecc71",
                };

            case "error":
                return {
                    backgroundColor: "#b9382a",
                    shadowColor: "#ff4d4d",
                };

            default:
                return {
                    backgroundColor: "#34495e",
                    shadowColor: "#4da6ff",
                };
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {toast && (
                <>
                    {/* Slight Dim Overlay */}
                    <Animated.View
                        pointerEvents="none"
                        style={[
                            styles.overlay,
                            {
                                opacity: overlayOpacity,
                            },
                        ]}
                    />

                    {/* Toast */}
                    <Animated.View
                        style={[
                            styles.toast,
                            getToastStyle(toast.type),
                            {
                                opacity: opacityAnim,
                                transform: [
                                    { translateY: slideAnim },
                                    { scale: pulseAnim },
                                ],
                            },
                        ]}
                    >
                        <Image
                            source={appIcon}
                            style={styles.icon}
                        />

                        <View style={styles.textContainer}>
                            <Text
                                numberOfLines={2}
                                style={styles.text}
                            >
                                {toast.message}
                            </Text>
                        </View>
                    </Animated.View>
                </>
            )}
        </ToastContext.Provider>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#000", zIndex: 9998,
    },
    toast: {
        position: "absolute", top: hp(8), alignSelf: "center",
        flexDirection: "row", alignItems: "center", minHeight: hp(8),
        maxWidth: wp(92),
        paddingHorizontal: wp(5), paddingVertical: hp(1.5), borderRadius: wp(4),
        zIndex: 9999,
        elevation: 20, shadowOffset: {
            width: 0, height: 0,
        },
        shadowOpacity: 0.9, shadowRadius: 15, borderWidth: 1,
        borderColor: "rgba(255,255,255,0.15)",
    },
    icon: {
        width: wp(8), height: wp(8), borderRadius: wp(4), marginRight: wp(3),
        resizeMode: "contain",
    }, textContainer: { flex: 1, },
    text: {
        color: "#fff", fontSize: wp(3.7), fontFamily: "Poppins_500Medium", lineHeight: wp(5.2),
    },
});