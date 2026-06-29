import React, { useEffect, useRef } from 'react';
import {
  View, Text, Animated, TouchableOpacity,  StyleSheet,
} from 'react-native'; import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailScreen';
import ShopScreen from '../screens/ShopScreen';
import { hp, wp } from '../resources/dimensions';
import { COLORS } from '../resources/colors';

const Tab = createBottomTabNavigator();

const TABS = [
  {
    name: 'Home',
    icon: 'home',
    outline: 'home-outline',
    component: HomeScreen,
  },
  {
    name: 'My Orders',
    icon: 'bag',
    outline: 'bag-outline',
    component: DetailsScreen,
  },
  {
    name: 'Saving',
    icon: 'wallet',
    outline: 'wallet-outline',
    component: ShopScreen,
  },
  {
    name: 'Transaction',
    icon: 'swap-horizontal',
    outline: 'swap-horizontal-outline',
    component: DetailsScreen,
  },
  {
    name: 'Profile',
    icon: 'person',
    outline: 'person-outline',
    component: HomeScreen,
  },
];

function TabItem({
  route, focused, navigation, iconName,
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    navigation.navigate(route.name);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.tabItem}
      onPress={handlePress}
    >
      <View style={styles.iconContainer}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.glow,
            {
              opacity: focused ? glowAnim : 0,
              transform: [
                {
                  scale: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.8],
                  }),
                },
              ],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.iconWrapper,
            focused && styles.activeIconWrapper,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Ionicons
            name={iconName}
            size={wp(4.8)}
            color={
              focused
                ? '#FFF'
                : COLORS.primary
            }
          />
        </Animated.View>
      </View>

      <Text
        numberOfLines={1}
        style={[
          styles.label,
          {
            color: focused
              ? COLORS.primary
              : '#999',
          },
        ]}
      >
        {route.name}
      </Text>
    </TouchableOpacity>
  );
}

function CustomTabBar({ state, navigation }) {
  const TAB_COUNT = TABS.length;
  const tabWidth = wp(90) / TAB_COUNT;

  const indicatorAnim = useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
    Animated.spring(indicatorAnim, {
      toValue: state.index * tabWidth,
      useNativeDriver: true,
      stiffness: 120,
      damping: 15,
    }).start();
  }, [state.index]);

  return (
    <View style={[styles.wrapper, {}]}>
      <View style={styles.tabBar}>
        <Animated.View
          style={[
            styles.indicator,
            {
              width: tabWidth - 10,
              transform: [
                {
                  translateX: indicatorAnim,
                },
              ],
            },
          ]}
        />

        {state.routes.map((route, index) => {
          const focused = state.index === index;

          const currentTab = TABS.find(
            item => item.name === route.name
          );

          const iconName = focused
            ? currentTab.icon
            : currentTab.outline;

          return (
            <TabItem
              key={route.key}
              route={route}
              focused={focused}
              navigation={navigation}
              iconName={iconName}
            />
          );
        })}
      </View>
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => (
        <CustomTabBar {...props} />
      )}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      <Tab.Screen
        name="My Orders"
        component={DetailsScreen}
      />

      <Tab.Screen
        name="Saving"
        component={ShopScreen}
      />

      <Tab.Screen
        name="Transaction"
        component={DetailsScreen}
      />

      <Tab.Screen
        name="Profile"
        component={HomeScreen}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: wp(3), right: wp(3), bottom: hp(1.5),

  },
  glow: {
    position: 'absolute', width: wp(12), height: wp(12),
    borderRadius: wp(6), backgroundColor: 'yellow', shadowColor: 'yellow',
    shadowOffset: { width: 0, height: 0, }, shadowOpacity: 0.8, shadowRadius: 15,
    elevation: 15,
  }, tabBar: {
    flexDirection: 'row', height: hp(9), backgroundColor: '#FFF',
    borderRadius: 20, alignItems: 'center', shadowColor: '#000',
    shadowOffset: { width: 0, height: 5, }, shadowOpacity: 0.12,
    shadowRadius: 10, elevation: 10, overflow: 'hidden',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center', justifyContent: 'center', zIndex: 2,
  },
  iconContainer: {
    justifyContent: 'center', alignItems: 'center',
  },
  glow: {
    position: 'absolute', width: wp(11), height: wp(11), borderRadius: wp(5.5),
    backgroundColor: COLORS.primary + '20', shadowColor: COLORS.accent + '20', shadowOffset: {
      width: 0,
      height: 0,
    }, shadowOpacity: 0.9, shadowRadius: 12, elevation: 12,
  },
  iconWrapper: {
    width: wp(8.9), height: wp(8.9), borderRadius: wp(4.25), alignItems: 'center',
    justifyContent: 'center',
  }, activeIconWrapper: {
    backgroundColor: COLORS.primary,
  }, label: {
    marginTop: hp(0.3), fontSize: wp(1.9), fontFamily: 'Poppins_500Medium',
    textAlign: 'center',
  }, indicator: {
    position: 'absolute', bottom: 0, left: 5,
    height: 3, borderTopLeftRadius: 10, borderTopRightRadius: 10,
  },
});