import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {useThemeStore} from '@/stores/themeStore';
import {useFoodStore} from '@/stores/foodStore';
import type {AnalysisResult, MealType} from '@/types';
import {FoodItemCard} from '@/components/FoodItemCard';

const MEAL_TYPES: {label: string; value: MealType; icon: string}[] = [
  {label: 'Breakfast', value: 'breakfast', icon: '🌅'},
  {label: 'Lunch', value: 'lunch', icon: '☀️'},
  {label: 'Dinner', value: 'dinner', icon: '🌙'},
  {label: 'Snack', value: 'snack', icon: '🍎'},
];

export function AnalysisScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {isDark} = useThemeStore();
  const {saveMeal} = useFoodStore();
  const [selectedMeal, setSelectedMeal] = useState<MealType>('lunch');
  const [saving, setSaving] = useState(false);

  const result: AnalysisResult = route.params?.result ?? {
    foods: [],
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    imageUrl: '',
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveMeal(
        selectedMeal,
        result.foods.map(f => ({
          foodName: f.name,
          quantity: f.quantity,
          servingSize: f.servingSize,
          servingUnit: f.servingUnit,
          calories: f.calories,
          protein: f.protein,
          carbs: f.carbs,
          fat: f.fat,
          fiber: f.fiber,
          sugar: f.sugar,
        })),
        result.imageUrl,
      );
      Toast.show({type: 'success', text1: 'Meal saved!', visibilityTime: 2000});
      navigation.navigate('Main', {screen: 'Home'});
    } catch {
      Alert.alert('Error', 'Failed to save meal');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Total Summary */}
        <View style={[styles.totalCard, isDark && styles.cardDark]}>
          <Text style={[styles.totalLabel, isDark && styles.textMuted]}>Total Calories</Text>
          <Text style={styles.totalCalories}>{result.totalCalories}</Text>
          <Text style={[styles.totalUnit, isDark && styles.textMuted]}>kcal</Text>

          <View style={styles.macroRow}>
            <View style={styles.macroItem}>
              <Text style={[styles.macroValue, {color: '#EF5350'}]}>{result.totalProtein}g</Text>
              <Text style={[styles.macroLabel, isDark && styles.textMuted]}>Protein</Text>
            </View>
            <View style={styles.macroDivider} />
            <View style={styles.macroItem}>
              <Text style={[styles.macroValue, {color: '#FFC107'}]}>{result.totalCarbs}g</Text>
              <Text style={[styles.macroLabel, isDark && styles.textMuted]}>Carbs</Text>
            </View>
            <View style={styles.macroDivider} />
            <View style={styles.macroItem}>
              <Text style={[styles.macroValue, {color: '#2196F3'}]}>{result.totalFat}g</Text>
              <Text style={[styles.macroLabel, isDark && styles.textMuted]}>Fat</Text>
            </View>
          </View>
        </View>

        {/* Food Items */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.textLight]}>
            Detected Foods ({result.foods.length})
          </Text>
          {result.foods.map((food, i) => (
            <FoodItemCard key={i} food={food} isDark={isDark} />
          ))}
        </View>

        {/* Meal Type Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.textLight]}>Meal Type</Text>
          <View style={styles.mealTypeRow}>
            {MEAL_TYPES.map(mt => (
              <TouchableOpacity
                key={mt.value}
                style={[
                  styles.mealTypeButton,
                  selectedMeal === mt.value && styles.mealTypeSelected,
                  isDark && styles.mealTypeButtonDark,
                ]}
                onPress={() => setSelectedMeal(mt.value)}>
                <Text style={styles.mealTypeIcon}>{mt.icon}</Text>
                <Text
                  style={[
                    styles.mealTypeLabel,
                    selectedMeal === mt.value && styles.mealTypeLabelSelected,
                    isDark && styles.textMuted,
                  ]}>
                  {mt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}>
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : '✓ Save Meal'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8F9FA'},
  containerDark: {backgroundColor: '#0F0F1A'},
  totalCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 3,
  },
  cardDark: {backgroundColor: '#1A1A2E'},
  totalLabel: {fontSize: 14, color: '#6B7280', marginBottom: 4},
  totalCalories: {fontSize: 48, fontWeight: 'bold', color: '#4CAF50'},
  totalUnit: {fontSize: 14, color: '#9CA3AF', marginBottom: 20},
  macroRow: {flexDirection: 'row', alignItems: 'center', gap: 24},
  macroItem: {alignItems: 'center'},
  macroValue: {fontSize: 18, fontWeight: '700'},
  macroLabel: {fontSize: 12, color: '#6B7280', marginTop: 4},
  macroDivider: {width: 1, height: 30, backgroundColor: '#E5E7EB'},
  section: {paddingHorizontal: 20, marginTop: 24},
  sectionTitle: {fontSize: 18, fontWeight: '700', color: '#1A1A2E', marginBottom: 12},
  mealTypeRow: {flexDirection: 'row', gap: 10},
  mealTypeButton: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 1,
  },
  mealTypeButtonDark: {backgroundColor: '#252540'},
  mealTypeSelected: {borderColor: '#4CAF50', backgroundColor: '#E8F5E9'},
  mealTypeIcon: {fontSize: 20, marginBottom: 4},
  mealTypeLabel: {fontSize: 12, fontWeight: '600', color: '#6B7280'},
  mealTypeLabelSelected: {color: '#4CAF50'},
  saveButton: {
    backgroundColor: '#4CAF50',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 40,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  buttonDisabled: {opacity: 0.7},
  saveButtonText: {color: '#FFF', fontSize: 18, fontWeight: '700'},
  textLight: {color: '#F1F5F9'},
  textMuted: {color: '#94A3B8'},
});
