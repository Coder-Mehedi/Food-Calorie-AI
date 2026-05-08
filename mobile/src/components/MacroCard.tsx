import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface Props {
  label: string;
  value: number;
  unit: string;
  color: string;
}

export function MacroCard({label, value, unit, color}: Props) {
  return (
    <View style={styles.container}>
      <View style={[styles.indicator, {backgroundColor: color}]} />
      <Text style={styles.value}>{value}{unit}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {alignItems: 'center', flex: 1},
  indicator: {width: 8, height: 8, borderRadius: 4, marginBottom: 6},
  value: {fontSize: 18, fontWeight: '700', color: '#1A1A2E'},
  label: {fontSize: 12, color: '#6B7280', marginTop: 2},
});
