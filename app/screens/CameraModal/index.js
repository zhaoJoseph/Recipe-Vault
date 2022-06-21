import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';

import * as ImagePicker from 'expo-image-picker';

const CameraModal = ({navigation, route} : Props) => {
  // The path of the picked image
  const [pickedImagePath, setPickedImagePath] = useState('');

  const submitImage = () => {

    if(pickedImagePath){
        navigation.navigate("CreateStack", {
            screen: "Create",
            params: {image: pickedImagePath, mode: route.params.mode}});
    }else{
        alert("No image selected.");
    }

  }

  // This function is triggered when the "Select an image" button pressed
  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library 
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    // Explore the result

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
    }
  }

  // This function is triggered when the "Open camera" button pressed
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    // Explore the result

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.buttonContainer}>
        <Button onPress={showImagePicker} title="Select an image" />
        <Button onPress={openCamera} title="Open camera" />
        <Button onPress={() => submitImage()} title="Select" />
      </View>

      <View style={styles.imageContainer}>
        {
          pickedImagePath !== '' && <Image
            source={{ uri: pickedImagePath }}
            style={styles.image}
          />
        }
      </View>
    </View>
  );
}

export default CameraModal;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: 400,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  imageContainer: {
    padding: 30
  },
  image: {
    width: 400,
    height: 300,
    resizeMode: 'cover'
  }
});