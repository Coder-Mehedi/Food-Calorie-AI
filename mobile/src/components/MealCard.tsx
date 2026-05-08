import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {format, parseISO} from 'date-fns';
import type {Meal} from '@/types';

interface Props {
  meal: Meal;
  isDark: boolean;
  onDelete?: () => void;
}

const MEAL_ICONS: Record<string, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
};

export function MealCard({meal, isDark, onDelete}: Props) {
  return (
    <View style={[styles.card, isDark && styles.cardDark]}>
      <View style={styles.row}>
        <Text style={styles.icon}>{MEAL_ICONS[meal.mealType] || '🍽️'}</Text>
        <View style={styles.info}>
          <Text style={[styles.type, isDark && styles.textLight]}>
            {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}
          </Text>
          <Text style={[styles.date, isDark && styles.textMuted]}>
            {format(parseISO(meal.consumedAt), 'MMM d, h:mm a')}
          </Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.calories}>{Math.round(meal.totalCalories)}</Text>
          <Text style={[styles.calLabel, isDark && styles.textMuted]}>kcal</Text>
        </View>
      </View>
      <View style={styles.macroRow}>
        <Text style={[styles.macro, {color: '#EF5350'}]}>P: {meal.totalProtein.toFixed(1)}g</Text>
        <Text style={[styles.macro, {color: '#FFC107'}]}>C: {meal.totalCarbs.toFixed(1)}g</Text>
        <Text style={[styles.macro, {color: '#2196F3'}]}>F: {meal.totalFat.toFixed(1)}g</Text>
      </View>
      {onDelete && (
        <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardDark: {backgroundColor: '#1A1A2E'},
  row: {flexDirection: 'row', alignItems: 'center'},
  icon: {fontSize: 28, marginRight: 12},
  info: {flex: 1},
  type: {fontSize: 16, fontWeight: '600', color: '#1A1A2E'},
  date: {fontSize: 12, color: '#9CA3AF', marginTop: 2},
  right: {alignItems: 'flex-end'},
  calories: {fontSize: 20, fontWeight: 'bold', color: '#4CAF50'},
  calLabel: {fontSize: 11, color: '#9CA3AF'},
  macroRow: {flexDirection: 'row', gap: 16, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0F0F5'},
  macro: {fontSize: 13, fontWeight: '600'},
  deleteBtn: {position: 'absolute', top: 8, right: 8, padding: 4},
  deleteText: {color: '#EF5350', fontSize: 12},
  textLight: {color: '#F1F5F9'},
  textMuted: {color: '#94A3B8'},
});
