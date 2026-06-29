import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import TabNavigator from './TabNavigator';
import ChooseLang from '../screens/ChooseLang';
import WelcomeScreen from '../screens/WelcomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import FaceEmbeddingScreen from '../screens/CamerAuth';
import VerifyOtpScreen from '../screens/VerifyOtpScreen';
import LoginScreen from '../screens/LoginScreen';
import SetMpinScreen from '../screens/CreateMpin';
import MpinLogin from '../screens/MpinLogin';
import QuickSavingsScreen from '../screens/QuickSavingsScreen';
import NotificationList from '../screens/NotificationList';
import JoinPlan from '../screens/JoinPlan';
import TermsAndConditionsScreen from '../screens/TermsCondition';
import PrivacyPolicyScreen from '../screens/PrivacyPolicy';
import RedeemGold from '../screens/RedeemGold';
const Stack = createNativeStackNavigator();
export default function StackNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="ChooseLang" component={ChooseLang} />
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            <Stack.Screen name="FaceEmbeddingScreen" component={FaceEmbeddingScreen} />
            <Stack.Screen name="VerifyOtpScreen" component={VerifyOtpScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SetMpinScreen" component={SetMpinScreen} />
            <Stack.Screen name="MpinLogin" component={MpinLogin} />
            <Stack.Screen name="QuickSavingsScreen" component={QuickSavingsScreen} />
            <Stack.Screen name="JoinPlan" component={JoinPlan} />
            <Stack.Screen name="NotificationList" component={NotificationList} />
            <Stack.Screen name="TermsAndConditionsScreen" component={TermsAndConditionsScreen} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
            <Stack.Screen name="RedeemGold" component={RedeemGold} />
        </Stack.Navigator>
    );
}