import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useThemeStore} from '@/stores/themeStore';
import {useFoodStore} from '@/stores/foodStore';
import {pickFromCamera, pickFromGallery} from '@/services/image';

export function CameraScreen() {
  const navigation = useNavigation<any>();
  const {isDark} = useThemeStore();
  const {analyzeImage, isAnalyzing} = useFoodStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleCapture = async () => {
    const uri = await pickFromCamera();
    if (uri) setSelectedImage(uri);
  };

  const handleGallery = async () => {
    const uri = await pickFromGallery();
    if (uri) setSelectedImage(uri);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return Alert.alert('Error', 'Please select an image first');
    try {
      await analyzeImage(selectedImage);
      const result = useFoodStore.getState().result;
      if (result) {
        navigation.navigate('Analysis', {result});
      }
    } catch (err: any) {
      Alert.alert('Analysis Failed', err.message);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.textLight]}>Scan Your Food</Text>
        <Text style={[styles.subtitle, isDark && styles.textMuted]}>
          Take a photo or upload an image
        </Text>
      </View>

      {/* Image Preview */}
      <View style={[styles.previewContainer, isDark && styles.previewDark]}>
        {selectedImage ? (
          <Image source={{uri: selectedImage}} style={styles.previewImage} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>📸</Text>
            <Text style={[styles.placeholderText, isDark && styles.textMuted]}>
              Your food image will appear here
            </Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      {selectedImage && !isAnalyzing && (
        <TouchableOpacity style={styles.clearButton} onPress={() => setSelectedImage(null)}>
          <Text style={styles.clearButtonText}>Clear Image</Text>
        </TouchableOpacity>
      )}

      <View style={styles.actionContainer}>
        {!selectedImage ? (
          <>
            <TouchableOpacity style={[styles.actionButton, styles.cameraButton]} onPress={handleCapture}>
              <Text style={styles.actionIcon}>📷</Text>
              <Text style={styles.actionText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.galleryButton]} onPress={handleGallery}>
              <Text style={styles.actionIcon}>🖼️</Text>
              <Text style={styles.actionText}>Gallery</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.analyzeButton, isAnalyzing && styles.buttonDisabled]}
            onPress={handleAnalyze}
            disabled={isAnalyzing}>
            {isAnalyzing ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color="#FFF" size="small" />
                <Text style={styles.analyzeButtonText}>Analyzing...</Text>
              </View>
            ) : (
              <Text style={styles.analyzeButtonText}>🔍 Analyze Food</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Tips */}
      <View style={[styles.tipsCard, isDark && styles.cardDark]}>
        <Text style={[styles.tipsTitle, isDark && styles.textLight]}>Tips for best results</Text>
        <Text style={[styles.tipText, isDark && styles.textMuted]}>• Place food on a plain surface</Text>
        <Text style={[styles.tipText, isDark && styles.textMuted]}>• Ensure good lighting</Text>
        <Text style={[styles.tipText, isDark && styles.textMuted]}>• Include all items in one frame</Text>
        <Text style={[styles.tipText, isDark && styles.textMuted]}>• Avoid blurred images</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8F9FA'},
  containerDark: {backgroundColor: '#0F0F1A'},
  header: {paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8},
  title: {fontSize: 24, fontWeight: 'bold', color: '#1A1A2E'},
  subtitle: {fontSize: 14, color: '#6B7280', marginTop: 4},
  previewContainer: {
    height: 320,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 20,
    backgroundColor: '#F0F0F5',
    overflow: 'hidden',
  },
  previewDark: {backgroundColor: '#252540'},
  previewImage: {width: '100%', height: '100%'},
  placeholder: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  placeholderIcon: {fontSize: 48, marginBottom: 12},
  placeholderText: {color: '#9CA3AF', fontSize: 14},
  clearButton: {alignSelf: 'center', marginTop: 12, paddingVertical: 8, paddingHorizontal: 20},
  clearButtonText: {color: '#EF5350', fontWeight: '600'},
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 2,
  },
  cameraButton: {backgroundColor: '#4CAF50'},
  galleryButton: {backgroundColor: '#8BC34A'},
  actionIcon: {fontSize: 32, marginBottom: 8},
  actionText: {color: '#FFF', fontSize: 16, fontWeight: '600'},
  analyzeButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  buttonDisabled: {opacity: 0.7},
  analyzeButtonText: {color: '#FFF', fontSize: 18, fontWeight: '700'},
  loadingRow: {flexDirection: 'row', alignItems: 'center', gap: 12},
  tipsCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    elevation: 2,
  },
  cardDark: {backgroundColor: '#1A1A2E'},
  tipsTitle: {fontSize: 16, fontWeight: '700', color: '#1A1A2E', marginBottom: 12},
  tipText: {fontSize: 14, color: '#6B7280', lineHeight: 24},
  textLight: {color: '#F1F5F9'},
  textMuted: {color: '#94A3B8'},
});
