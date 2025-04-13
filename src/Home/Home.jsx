import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Buffer} from 'buffer';
const Home = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [output, setOutput] = useState(null);
  useEffect(() => {
    const getData = async ()=>{
      const data = await AsyncStorage.getItem('image');
      console.log('Data', data);
    };
    //getData();   
  }, []);

  useEffect(() => {
    console.log('selectedImage', selectedImage);
    console.log("output",output);
  }, [selectedImage,output]);

  const handleImageUpload = () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 1,
    };

    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        console.log('images is picking', response);
        setSelectedImage(response.assets[0]);
        const image = response.assets[0];
        console.log('image', image.uri);
        
        const imageResponse = await sendImage(response.assets[0]);
        console.log('response', imageResponse);
        const base64 = Buffer.from(imageResponse.data, 'binary').toString(
          'base64',
        );
        console.log('Base64', base64);
        const imageUrl = `data:${imageResponse.headers['content-type']};base64,${base64}`;
        console.log("url is",imageUrl)
        setOutput(imageUrl);
        await AsyncStorage.setItem('image', imageUrl);
      }
    });
  };

  const sendImage = async (image) => {
    try {
      const formData = new FormData();
      formData.append('image_file', {
        uri: image?.uri,
        name: image?.fileName || 'photo.jpg',
        type: image?.type || 'image/jpeg',
      });
      formData.append('size', 'auto');

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

      console.log('Background removed successfully');
      return response;
    } catch (error) {
      console.error('Error removing background:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
        <Text style={styles.uploadText}>Upload Your Image Here</Text>
      </TouchableOpacity>
      <View style={styles.imageContainer}>
      <Image source={{uri: selectedImage?.uri}} style={styles.imageback}/>
      <Text style={styles.styledText}>Srujan</Text>
      <Image source={{uri: output}} style={styles.image}/>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:20,
    alignItems: 'center',
    gap: 50,
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
  imageContainer:{
    width:"90%",
    height:"90%",
    position: 'relative',
  },
  imageback:{
    position:'absolute',
    width:"100%",
    height:"100%",
    resizeMode:'contain',
    zIndex:-999
   },
  image:{
   position:'absolute',
   width:"100%",
   height:"100%",
   resizeMode:'contain',
   zIndex:999
  },
  styledText: {
    top:120,
    left:10,
    color: '#000',
    position:'absolute',
    fontSize:110,
    zIndex:0
  },
});
