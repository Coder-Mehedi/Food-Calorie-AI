import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import {useAuthStore} from '@/stores/authStore';
import {SplashScreen} from '@/screens/SplashScreen/SplashScreen';
import {AuthScreen} from '@/screens/AuthScreen/AuthScreen';
import {DashboardScreen} from '@/screens/DashboardScreen/DashboardScreen';
import {CameraScreen} from '@/screens/CameraScreen/CameraScreen';
import {HistoryScreen} from '@/screens/HistoryScreen/HistoryScreen';
import {ProfileScreen} from '@/screens/ProfileScreen/ProfileScreen';
import {AnalysisScreen} from '@/screens/AnalysisScreen/AnalysisScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, [string, string]> = {
  Home: ['home', 'home-outline'],
  Camera: ['camera', 'camera-outline'],
  History: ['time', 'time-outline'],
  Profile: ['person', 'person-outline'],
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => {
        const icons = TAB_ICONS[route.name] || ['restaurant', 'restaurant-outline'];
        return {
          headerShown: false,
          tabBarActiveTintColor: '#00E676',
          tabBarInactiveTintColor: '#606080',
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: 'rgba(14, 14, 30, 0.95)',
            borderTopWidth: 0,
            paddingBottom: 8,
            paddingTop: 10,
            height: 64,
            elevation: 0,
          },
          tabBarLabelStyle: {fontSize: 10, fontWeight: '600', marginTop: 2},
          tabBarIcon: ({color, focused}) => (
            <Ionicons
              name={focused ? icons[0] : icons[1]}
              size={focused ? 26 : 22}
              color={color}
            />
          ),
        };
      }}>
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Camera" component={CameraScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: '#0A0A1A',
        contentStyle: {backgroundColor: '#0A0A1A'},
      }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{animation: 'fade'}}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen
            name="Analysis"
            component={AnalysisScreen}
            options={{
              headerShown: true,
              headerTitle: 'Analysis',
              headerTintColor: '#F5F5FF',
              headerStyle: {backgroundColor: '#0A0A1A'},
              headerTitleStyle: {fontWeight: '700'},
              animation: 'slide_from_right',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
