import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {format} from 'date-fns';
import {useThemeStore} from '@/stores/themeStore';
import {useFoodStore} from '@/stores/foodStore';
import {MealCard} from '@/components/MealCard';
import type {Meal} from '@/types';

export function HistoryScreen() {
  const {isDark} = useThemeStore();
  const {meals, loadMeals, mealsLoading, mealsHasMore, deleteMeal} = useFoodStore();

  useEffect(() => {
    loadMeals(true);
  }, []);

  const handleDelete = (meal: Meal) => {
    Alert.alert('Delete Meal', 'Are you sure you want to delete this meal?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Delete', style: 'destructive', onPress: () => deleteMeal(meal.id)},
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.textLight]}>Meal History</Text>
        <Text style={[styles.subtitle, isDark && styles.textMuted]}>
          {meals.length} meals tracked
        </Text>
      </View>

      <FlatList
        data={meals}
        keyExtractor={m => m.id}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <MealCard meal={item} isDark={isDark} onDelete={() => handleDelete(item)} />
        )}
        onEndReached={() => mealsHasMore && loadMeals()}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={[styles.emptyText, isDark && styles.textMuted]}>
              No meals yet
            </Text>
            <Text style={[styles.emptySubtext, isDark && styles.textMuted]}>
              Start scanning food to see your history
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8F9FA'},
  containerDark: {backgroundColor: '#0F0F1A'},
  header: {paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8},
  title: {fontSize: 24, fontWeight: 'bold', color: '#1A1A2E'},
  subtitle: {fontSize: 14, color: '#6B7280', marginTop: 4},
  list: {paddingHorizontal: 20, paddingBottom: 20},
  empty: {alignItems: 'center', paddingTop: 80},
  emptyIcon: {fontSize: 48, marginBottom: 16},
  emptyText: {fontSize: 18, fontWeight: '600', color: '#1A1A2E'},
  emptySubtext: {fontSize: 14, color: '#9CA3AF', marginTop: 8},
  textLight: {color: '#F1F5F9'},
  textMuted: {color: '#94A3B8'},
});
