import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {format, startOfWeek} from 'date-fns';
import {useFoodStore} from '@/stores/foodStore';
import {useProfileStore} from '@/stores/profileStore';
import {useThemeStore} from '@/stores/themeStore';
import {CalorieRing} from '@/components/CalorieRing';
import {MacroCard} from '@/components/MacroCard';
import {WeeklyChart} from '@/components/WeeklyChart';
import {MealCard} from '@/components/MealCard';
import * as api from '@/services/api';

export function DashboardScreen() {
  const navigation = useNavigation<any>();
  const {meals, loadMeals} = useFoodStore();
  const {profile, loadProfile} = useProfileStore();
  const {isDark, toggle} = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);
  const [todayCalories, setTodayCalories] = useState(0);
  const [todayMacros, setTodayMacros] = useState({protein: 0, carbs: 0, fat: 0});
  const [weeklyData, setWeeklyData] = useState<{date: string; calories: number}[]>([]);

  const today = format(new Date(), 'yyyy-MM-dd');
  const calorieTarget = profile?.dailyCalorieTarget || 2000;

  const loadData = useCallback(async () => {
    try {
      await Promise.all([
        loadProfile(),
        loadMeals(true),
      ]);
    } catch {}

    try {
      const weekStart = format(
        startOfWeek(new Date(), {weekStartsOn: 1}),
        'yyyy-MM-dd',
      );

      const [summaryRes, weekRes] = await Promise.all([
        api.getDailySummary(today),
        api.getWeeklyReport(weekStart),
      ]);

      const summary = summaryRes.data;
      if (summary.totals) {
        setTodayCalories(summary.totals.calories || 0);
        setTodayMacros({
          protein: summary.totals.protein || 0,
          carbs: summary.totals.carbs || 0,
          fat: summary.totals.fat || 0,
        });
      }

      if (weekRes.data?.dailyData) {
        setWeeklyData(
          weekRes.data.dailyData.map((d: any) => ({
            date: d.date,
            calories: d.calories || 0,
          })),
        );
      }
    } catch {}
  }, [today]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const recentMeals = meals.slice(0, 3);
  const remaining = Math.max(0, calorieTarget - todayCalories);
  const progress = calorieTarget > 0 ? Math.min(todayCalories / calorieTarget, 1) : 0;

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4CAF50"
          />
        }
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, isDark && styles.textLight]}>
              Hello, {profile?.name?.split(' ')[0] || 'User'}
            </Text>
            <Text style={[styles.date, isDark && styles.textMuted]}>
              {format(new Date(), 'EEEE, MMM d')}
            </Text>
          </View>
          <TouchableOpacity style={styles.themeToggle} onPress={toggle}>
            <Text style={styles.themeIcon}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>

        {/* Calorie Ring */}
        <View style={[styles.card, isDark && styles.cardDark]}>
          <CalorieRing
            progress={progress}
            consumed={todayCalories}
            target={calorieTarget}
            remaining={remaining}
          />
          <View style={styles.macroRow}>
            <MacroCard
              label="Protein"
              value={Math.round(todayMacros.protein)}
              unit="g"
              color="#EF5350"
            />
            <MacroCard
              label="Carbs"
              value={Math.round(todayMacros.carbs)}
              unit="g"
              color="#FFC107"
            />
            <MacroCard
              label="Fat"
              value={Math.round(todayMacros.fat)}
              unit="g"
              color="#2196F3"
            />
          </View>
        </View>

        {/* Weekly Chart */}
        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textLight]}>
            This Week
          </Text>
          <WeeklyChart data={weeklyData} />
        </View>

        {/* Recent Meals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDark && styles.textLight]}>
              Recent Meals
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {recentMeals.length === 0 ? (
            <View style={[styles.card, isDark && styles.cardDark]}>
              <Text style={[styles.emptyText, isDark && styles.textMuted]}>
                No meals yet. Start by scanning your food!
              </Text>
            </View>
          ) : (
            recentMeals.map(meal => (
              <MealCard key={meal.id} meal={meal} isDark={isDark} />
            ))
          )}
        </View>

        {/* Scan Button */}
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => navigation.navigate('Camera')}>
          <Text style={styles.scanButtonText}>Scan Food</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8F9FA'},
  containerDark: {backgroundColor: '#0F0F1A'},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {fontSize: 22, fontWeight: 'bold', color: '#1A1A2E'},
  date: {fontSize: 14, color: '#6B7280', marginTop: 4},
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeIcon: {fontSize: 18},
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardDark: {backgroundColor: '#1A1A2E'},
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  section: {paddingHorizontal: 20, marginTop: 16},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {fontSize: 18, fontWeight: '700', color: '#1A1A2E'},
  seeAll: {fontSize: 14, color: '#4CAF50', fontWeight: '600'},
  emptyText: {
    textAlign: 'center',
    padding: 24,
    color: '#9CA3AF',
    fontSize: 14,
  },
  scanButton: {
    backgroundColor: '#4CAF50',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 32,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  scanButtonText: {color: '#FFF', fontSize: 18, fontWeight: '700'},
  textLight: {color: '#F1F5F9'},
  textMuted: {color: '#94A3B8'},
});
