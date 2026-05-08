import * as ImagePicker from 'expo-image-picker';

export const pickFromCamera = async (): Promise<string | null> => {
  const {status} = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') return null;

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
    allowsEditing: true,
    aspect: [4, 3],
  });

  if (result.canceled) return null;
  return result.assets[0].uri;
};

export const pickFromGallery = async (): Promise<string | null> => {
  const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
    allowsEditing: true,
    aspect: [4, 3],
  });

  if (result.canceled) return null;
  return result.assets[0].uri;
};
