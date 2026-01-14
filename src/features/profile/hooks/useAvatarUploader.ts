/**
 * useAvatarUploader Hook
 * 
 * Business logic cho avatar upload
 * Tách riêng khỏi UI component theo FE_GUIDELINES
 */

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUploadAvatar } from './useUploadAvatar';
import { useProfile } from './useProfile';

export function useAvatarUploader() {
  const { data: profile, refetch } = useProfile();
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  
  const uploadAvatar = useUploadAvatar({
    onSuccess: async (data) => {
      Alert.alert('Success', 'Avatar uploaded successfully!');
      setLocalImageUri(null);
      // Refetch profile to get updated avatarUrl from backend
      await refetch();
    },
    onError: (error) => {
      Alert.alert(
        'Upload Failed',
        error.message || 'Failed to upload avatar. Please try again.'
      );
      setLocalImageUri(null);
    },
  });

  const handlePickImage = useCallback(async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Camera roll permissions are required to upload avatar.'
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    const asset = result.assets[0];
    const uri = asset.uri;
    setLocalImageUri(uri);

    try {
      // Create FormData compatible file object for React Native
      const filename = uri.split('/').pop() || 'avatar.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      const file = {
        uri,
        name: filename,
        type,
      } as any;
      
      // Upload immediately
      uploadAvatar.mutate(file);
    } catch (error) {
      Alert.alert('Error', 'Failed to process image');
      setLocalImageUri(null);
    }
  }, [uploadAvatar]);

  // Get avatar URL from profile (backend provides avatarUrl)
  // Use local preview while uploading
  const avatarUrl = localImageUri || profile?.avatarUrl;

  return {
    avatarUrl,
    isUploading: uploadAvatar.isPending,
    handlePickImage,
  };
}
