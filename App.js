import React, { useState } from 'react';
import { View, Button, Image, ScrollView, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ImageResizer from 'react-native-image-resizer';

export default function MultiImagePicker() {
  const [images, setImages] = useState([]);

  const selectAndCropImages = async () => {
    try {
      console.log("Button pressed"); // Debugging log

      // Request permission to access gallery
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Permission to access gallery is required!");
        return;
      }

      // Open image picker with multiple selection option
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,  // Enabling multiple selection (iOS 14+ or Android)
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (result.cancelled) {
        console.log("Image selection cancelled"); // Debugging log
        return;
      }

      // Check if `selected` array exists for multiple selection; if not, fallback to single image
      const selectedImages = result.selected || [result];
      console.log("Selected images:", selectedImages); // Debugging log to check selected images

      // Crop each image
      const croppedImages = await Promise.all(
        selectedImages.map(async (image) => {
          console.log("Cropping image:", image.uri); // Debugging log for each image
          const croppedImage = await ImageResizer.createResizedImage(
            image.uri,
            1024,
            1024,
            'JPEG',
            100
          );
          return croppedImage;
        })
      );

      setImages(croppedImages); // Update state with cropped images
      console.log("Cropped images:", croppedImages); // Debugging log for cropped images

    } catch (error) {
      console.error("Error in selecting or cropping images:", error);
      Alert.alert("Error", "An error occurred while selecting or cropping images.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Select and Crop Images" onPress={selectAndCropImages} />
      </View>
      <ScrollView horizontal style={styles.imageContainer}>
        {images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image.uri }}
            style={styles.image}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    padding: 16,
  },
  buttonContainer: {
    width: '80%',
    marginBottom: 20,
  },
  imageContainer: {
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginHorizontal: 5,
  },
});
