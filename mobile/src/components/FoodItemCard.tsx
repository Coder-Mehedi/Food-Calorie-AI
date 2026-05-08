import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import type {FoodItem} from '@/types';

interface Props {
  food: FoodItem;
  isDark: boolean;
}

export function FoodItemCard({food, isDark}: Props) {
  return (
    <View style={[styles.card, isDark && styles.cardDark]}>
      <View style={styles.header}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, isDark && styles.textLight]}>{food.name}</Text>
          {food.confidence > 0 && (
            <Text style={styles.confidence}>{Math.round(food.confidence * 100)}%</Text>
          )}
        </View>
        <Text style={[styles.quantity, isDark && styles.textMuted]}>
          {food.quantity} ({food.servingSize}{food.servingUnit})
        </Text>
      </View>
      <View style={styles.macroRow}>
        <View style={styles.macroItem}>
          <Text style={[styles.macroValue, {color: '#4CAF50'}]}>{food.calories}</Text>
          <Text style={[styles.macroLabel, isDark && styles.textMuted]}>kcal</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={[styles.macroValue, {color: '#EF5350'}]}>{food.protein}g</Text>
          <Text style={[styles.macroLabel, isDark && styles.textMuted]}>Protein</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={[styles.macroValue, {color: '#FFC107'}]}>{food.carbs}g</Text>
          <Text style={[styles.macroLabel, isDark && styles.textMuted]}>Carbs</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={[styles.macroValue, {color: '#2196F3'}]}>{food.fat}g</Text>
          <Text style={[styles.macroLabel, isDark && styles.textMuted]}>Fat</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {backgroundColor: '#FFF', borderRadius: 14, padding: 16, marginBottom: 10, elevation: 1},
  cardDark: {backgroundColor: '#1A1A2E'},
  header: {marginBottom: 12},
  nameRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  name: {fontSize: 16, fontWeight: '700', color: '#1A1A2E'},
  confidence: {fontSize: 12, color: '#4CAF50', fontWeight: '600', backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8},
  quantity: {fontSize: 13, color: '#6B7280', marginTop: 4},
  macroRow: {flexDirection: 'row', justifyContent: 'space-between'},
  macroItem: {alignItems: 'center'},
  macroValue: {fontSize: 15, fontWeight: '700'},
  macroLabel: {fontSize: 11, color: '#6B7280', marginTop: 2},
  textLight: {color: '#F1F5F9'},
  textMuted: {color: '#94A3B8'},
});
