import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Svg, {Circle, G} from 'react-native-svg';

interface Props {
  progress: number; // 0 to 1
  consumed: number;
  target: number;
  remaining: number;
}

export function CalorieRing({progress, consumed, target, remaining}: Props) {
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - Math.min(progress, 1));

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2},${size / 2}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E8F5E9"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#4CAF50"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <View style={styles.center}>
        <Text style={styles.consumed}>{consumed}</Text>
        <Text style={styles.label}>of {target} kcal</Text>
        <Text style={styles.remaining}>{remaining} remaining</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {alignItems: 'center', justifyContent: 'center'},
  center: {position: 'absolute', alignItems: 'center'},
  consumed: {fontSize: 22, fontWeight: 'bold', color: '#1A1A2E'},
  label: {fontSize: 10, color: '#6B7280', marginTop: 2},
  remaining: {fontSize: 9, color: '#4CAF50', fontWeight: '600', marginTop: 2},
});
