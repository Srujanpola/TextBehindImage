import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
const Home = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  
  useEffect(() => {
    console.log('selectedImage', selectedImage);
  }, [selectedImage]);

  const handleImageUpload =  () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 1,
    };

    launchImageLibrary(options,async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        
       const image = response.assets[0];
       console.log('image', image.uri);
        const imageBlob = await convertImageToBlob(image.uri);
        console.log('imageBlob', imageBlob);
        //setSelectedImage(imageBlob);
        //sendImage();
      }
    });
  };

  const convertImageToBlob = async imageUri => {
    try {
      const response = await fetch(imageUri);
      console.log('response', response.blob());
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.log('convertImageToBlob error', error);
    }
  };

  const sendImage = async () => {
    try {
      const formData = new FormData();
      formData.append({
        image_file: {
          uri: selectedImage.uri,
          type: selectedImage.type,  
          name: selectedImage.fileName, 
        },
        size: 'auto',
      });

      const response = await axios.post(
        'https://api.remove.bg/v1.0/removebg',
        formData,
        {
          headers: {
            'X-Api-Key': 'YrhV5PwdfVedTjfXiYebbEAK',
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'arraybuffer', 
        },
      );

      console.log('response', response);
    } catch (error) {
      console.log('error', error);
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
        <Text style={styles.uploadText}>Upload Your Image Here</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
  },
  uploadText: {
    color: '#fff',
  },
});
