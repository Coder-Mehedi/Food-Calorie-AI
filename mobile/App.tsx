import React, {useEffect} from 'react';
import {StatusBar} from 'expo-status-bar';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {AppNavigator} from '@/navigation/AppNavigator';
import {useAuthStore} from '@/stores/authStore';
import {darkTheme} from '@/theme/colors';

export default function App() {
  const checkAuth = useAuthStore(s => s.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={darkTheme}>
        <StatusBar style="light" />
        <AppNavigator />
      </NavigationContainer>
      <Toast />
    </SafeAreaProvider>
  );
}
