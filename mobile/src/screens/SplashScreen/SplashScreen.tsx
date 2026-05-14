import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuthStore} from '@/stores/authStore';

type NavProp = NativeStackNavigationProp<any>;

export function SplashScreen() {
  const navigation = useNavigation<NavProp>();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const glowAnim = React.useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {toValue: 1, duration: 1000, useNativeDriver: true}),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {toValue: 1, duration: 1500, useNativeDriver: true}),
          Animated.timing(glowAnim, {toValue: 0.3, duration: 1500, useNativeDriver: true}),
        ]),
      ),
    ]).start();

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigation.reset({index: 0, routes: [{name: 'Main'}]});
      } else {
        navigation.replace('Auth');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.glow, {opacity: glowAnim}]} />
      <Animated.View style={[styles.content, {opacity: fadeAnim}]}>
        <View style={styles.iconContainer}>
          <Animated.View style={[styles.iconGlow, {opacity: glowAnim}]} />
          <Text style={styles.icon}>🍽</Text>
        </View>
        <Text style={styles.title}>FoodAI</Text>
        <Text style={styles.subtitle}>Snap. Analyze. Track.</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    top: '30%',
  },
  content: {alignItems: 'center'},
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: '#141428',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,230,118,0.2)',
  },
  iconGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: 'rgba(0,230,118,0.15)',
  },
  icon: {fontSize: 48},
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#F5F5FF',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#00E676',
    fontWeight: '500',
    marginTop: 8,
    letterSpacing: 2,
  },
});
