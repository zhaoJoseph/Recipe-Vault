import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableOpacity } from 'react-native';
import {Colors} from '../../Constants/Colors';
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
      <View style={styles.imageContainer}>
        {
          (pickedImagePath !== '') ? <Image
            source={{ uri: pickedImagePath }}
            style={styles.image}
          /> : <Text>No image selected</Text>
        }
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={showImagePicker} style={{ width: 100, backgroundColor: `${Colors.brand}`, borderRadius: 10 }} >
          <Text style={{ textAlign: 'center' }}>Select An Image</Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={openCamera} style={{ width: 100 , backgroundColor: `${Colors.brand}`, borderRadius: 10 }} >
          <Text style={{ textAlign: 'center' }}>Open Camera</Text>
        </TouchableOpacity>
      </View>
      <View style={{ position: 'absolute', bottom: 50}}>
        {
          pickedImagePath !== '' && <Button onPress={() => submitImage()} title="Select" style={{ flex: 1, postion: 'absolute', bottom : 0 }} />
        }
      </View>
    </View>
  );
}

export default CameraModal;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    flex: 1,
    bottom: 100,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  imageContainer: {
    flex: 1,
    top: 0,
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    height: '100%',
    width: '100%',
    resizeMode: 'cover'
  }
});