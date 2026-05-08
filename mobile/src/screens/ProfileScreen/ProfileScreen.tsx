import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useThemeStore} from '@/stores/themeStore';
import {useProfileStore} from '@/stores/profileStore';
import {useAuthStore} from '@/stores/authStore';
import * as api from '@/services/api';

const GOALS = [
  {label: 'Lose Weight', value: 'lose_weight', icon: '⬇️'},
  {label: 'Maintain', value: 'maintain', icon: '⚖️'},
  {label: 'Gain Muscle', value: 'gain_muscle', icon: '💪'},
  {label: 'Improve Health', value: 'improve_health', icon: '❤️'},
];

export function ProfileScreen() {
  const {isDark, toggle} = useThemeStore();
  const {profile, loadProfile, updateProfile} = useProfileStore();
  const logout = useAuthStore(s => s.logout);

  const [name, setName] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [goal, setGoal] = useState('');
  const [calorieTarget, setCalorieTarget] = useState('');
  const [suggestedTarget, setSuggestedTarget] = useState<number | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setHeight(profile.height?.toString() || '');
      setWeight(profile.weight?.toString() || '');
      setAge(profile.age?.toString() || '');
      setGender(profile.gender || '');
      setGoal(profile.fitnessGoal || '');
      setCalorieTarget(profile.dailyCalorieTarget?.toString() || '');
      // Fetch BMR-based target if user hasn't set one
      if (!profile.dailyCalorieTarget) {
        api.default.get('/profile/calorie-target').then(res => {
          const target = Math.round(res.data);
          setSuggestedTarget(target);
          setCalorieTarget(target.toString());
        }).catch(() => {});
      }
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile({
        name,
        height: height ? parseFloat(height) : undefined,
        weight: weight ? parseFloat(weight) : undefined,
        age: age ? parseInt(age) : undefined,
        gender: gender || undefined,
        fitnessGoal: goal || undefined,
        dailyCalorieTarget: calorieTarget ? parseFloat(calorieTarget) : undefined,
      });
      Alert.alert('Success', 'Profile updated!');
    } catch {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.avatar, isDark && styles.avatarDark]}>
            <Text style={styles.avatarText}>
              {name ? name[0].toUpperCase() : '?'}
            </Text>
          </View>
          <Text style={[styles.name, isDark && styles.textLight]}>{name || 'User'}</Text>
          <Text style={[styles.email, isDark && styles.textMuted]}>{profile?.email}</Text>
        </View>

        {/* Stats */}
        <View style={[styles.statsRow, isDark && styles.cardDark]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, isDark && styles.textLight]}>{height || '-'}</Text>
            <Text style={[styles.statLabel, isDark && styles.textMuted]}>Height (cm)</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, isDark && styles.textLight]}>{weight || '-'}</Text>
            <Text style={[styles.statLabel, isDark && styles.textMuted]}>Weight (kg)</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, isDark && styles.textLight]}>{age || '-'}</Text>
            <Text style={[styles.statLabel, isDark && styles.textMuted]}>Age</Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={[styles.sectionTitle, isDark && styles.textLight]}>Personal Info</Text>
          <TextInput style={[styles.input, isDark && styles.inputDark]} placeholder="Name" placeholderTextColor="#9CA3AF" value={name} onChangeText={setName} />
          <View style={styles.row}>
            <TextInput style={[styles.input, styles.inputHalf, isDark && styles.inputDark]} placeholder="Height (cm)" placeholderTextColor="#9CA3AF" value={height} onChangeText={setHeight} keyboardType="decimal-pad" />
            <TextInput style={[styles.input, styles.inputHalf, isDark && styles.inputDark]} placeholder="Weight (kg)" placeholderTextColor="#9CA3AF" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" />
          </View>
          <View style={styles.row}>
            <TextInput style={[styles.input, styles.inputHalf, isDark && styles.inputDark]} placeholder="Age" placeholderTextColor="#9CA3AF" value={age} onChangeText={setAge} keyboardType="number-pad" />
            <View style={[styles.genderRow, styles.inputHalf]}>
              <TouchableOpacity
                style={[styles.genderBtn, gender === 'male' && styles.genderSelected, isDark && styles.genderBtnDark]}
                onPress={() => setGender('male')}>
                <Text style={[styles.genderLabel, gender === 'male' && styles.genderLabelSel]}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderBtn, gender === 'female' && styles.genderSelected, isDark && styles.genderBtnDark]}
                onPress={() => setGender('female')}>
                <Text style={[styles.genderLabel, gender === 'female' && styles.genderLabelSel]}>Female</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TextInput style={[styles.input, isDark && styles.inputDark]} placeholder="Daily Calorie Target (kcal)" placeholderTextColor="#9CA3AF" value={calorieTarget} onChangeText={setCalorieTarget} keyboardType="decimal-pad" />
          {suggestedTarget && !calorieTarget && (
            <TouchableOpacity onPress={() => setCalorieTarget(suggestedTarget.toString())}>
              <Text style={styles.suggestedText}>
                Suggested: {suggestedTarget} kcal (tap to use)
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Fitness Goal */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.textLight]}>Fitness Goal</Text>
          <View style={styles.goalRow}>
            {GOALS.map(g => (
              <TouchableOpacity
                key={g.value}
                style={[styles.goalButton, goal === g.value && styles.goalSelected, isDark && styles.goalButtonDark]}
                onPress={() => setGoal(g.value)}>
                <Text style={styles.goalIcon}>{g.icon}</Text>
                <Text style={[styles.goalLabel, goal === g.value && styles.goalLabelSelected, isDark && styles.textMuted]}>{g.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.saveBtn]} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.themeBtn, isDark && styles.themeBtnDark]} onPress={toggle}>
            <Text style={[styles.themeBtnText, isDark && {color: '#FFF'}]}>
              {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8F9FA'},
  containerDark: {backgroundColor: '#0F0F1A'},
  header: {alignItems: 'center', paddingTop: 24, paddingBottom: 16},
  avatar: {width: 80, height: 80, borderRadius: 40, backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center', marginBottom: 12},
  avatarDark: {backgroundColor: '#388E3C'},
  avatarText: {fontSize: 32, fontWeight: 'bold', color: '#FFF'},
  name: {fontSize: 22, fontWeight: 'bold', color: '#1A1A2E'},
  email: {fontSize: 14, color: '#6B7280', marginTop: 4},
  statsRow: {flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, marginHorizontal: 20, padding: 20, alignItems: 'center', elevation: 2},
  cardDark: {backgroundColor: '#1A1A2E'},
  statItem: {flex: 1, alignItems: 'center'},
  statValue: {fontSize: 20, fontWeight: '700', color: '#1A1A2E'},
  statLabel: {fontSize: 12, color: '#6B7280', marginTop: 4},
  statDivider: {width: 1, height: 30, backgroundColor: '#E5E7EB'},
  form: {paddingHorizontal: 20, marginTop: 24},
  sectionTitle: {fontSize: 18, fontWeight: '700', color: '#1A1A2E', marginBottom: 12},
  input: {backgroundColor: '#F0F0F5', borderRadius: 12, padding: 14, fontSize: 16, color: '#1A1A2E', marginBottom: 12},
  inputDark: {backgroundColor: '#252540', color: '#F1F5F9'},
  inputHalf: {flex: 1},
  genderRow: {flexDirection: 'row', gap: 8},
  genderBtn: {flex: 1, backgroundColor: '#F0F0F5', borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 2, borderColor: 'transparent'},
  genderBtnDark: {backgroundColor: '#252540'},
  genderSelected: {borderColor: '#4CAF50', backgroundColor: '#E8F5E9'},
  genderLabel: {fontSize: 14, fontWeight: '600', color: '#6B7280'},
  genderLabelSel: {color: '#4CAF50'},
  row: {flexDirection: 'row', gap: 12},
  section: {paddingHorizontal: 20, marginTop: 12},
  goalRow: {flexDirection: 'row', gap: 10, flexWrap: 'wrap'},
  goalButton: {flex: 1, minWidth: '45%', backgroundColor: '#FFF', borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 2, borderColor: 'transparent', marginBottom: 10},
  goalButtonDark: {backgroundColor: '#252540'},
  goalSelected: {borderColor: '#4CAF50', backgroundColor: '#E8F5E9'},
  goalIcon: {fontSize: 20, marginBottom: 4},
  goalLabel: {fontSize: 13, fontWeight: '600', color: '#6B7280'},
  goalLabelSelected: {color: '#4CAF50'},
  actions: {paddingHorizontal: 20, marginTop: 16, paddingBottom: 40},
  saveBtn: {backgroundColor: '#4CAF50', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 12},
  saveBtnText: {color: '#FFF', fontSize: 16, fontWeight: '700'},
  themeBtn: {backgroundColor: '#F0F0F5', borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 12},
  themeBtnDark: {backgroundColor: '#252540'},
  themeBtnText: {fontSize: 14, fontWeight: '600', color: '#1A1A2E'},
  logoutBtn: {borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#EF5350'},
  logoutText: {color: '#EF5350', fontSize: 14, fontWeight: '600'},
  textLight: {color: '#F1F5F9'},
  textMuted: {color: '#94A3B8'},
  suggestedText: {color: '#4CAF50', fontSize: 13, fontWeight: '500', marginTop: -4, marginBottom: 12, marginLeft: 4},
});
