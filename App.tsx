import {StyleSheet, Image, Text, View, TouchableOpacity, Platform, PermissionsAndroid} from 'react-native';
import {launchCamera, CameraOptions} from 'react-native-image-picker';
import React, { useState, useEffect } from 'react';

const OpenCamera = () => {
  const [imgUrl, setImgUrl] = useState<string>(
    'https://www.google.com/search?q=imagede+rocher&oq=imagede+rocher&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIJCAEQABgNGIAEMgkIAhAAGA0YgAQyCQgDEAAYDRiABDIICAQQABgWGB4yCAgFEAAYFhgeMggIBhAAGBYYHjIICAcQABgWGB4yCAgIEAAYFhgeMggICRAAGBYYHtIBCDQxNjRqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8#imgrc=yxh3Pe1hef0puM&imgdii=k4iIVcnneHqrQM',
  );

  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [hasStoragePermission, setHasStoragePermission] = useState(false);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        const cameraPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app requires access to your camera.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        setHasCameraPermission(cameraPermission === PermissionsAndroid.RESULTS.GRANTED);

        const storagePermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'This app requires access to your storage.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        setHasStoragePermission(storagePermission === PermissionsAndroid.RESULTS.GRANTED);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openCameraLib = async () => {
    try {
      if (hasCameraPermission && hasStoragePermission) {
        const options: CameraOptions = {
          mediaType: 'photo',
          quality: 1,
          saveToPhotos: true,
        };
        const result = await launchCamera(options);
        if (!result.didCancel && !result.errorCode && result.assets) {
          setImgUrl(result.assets[0].uri as string);
        }
      } else {
        console.log('Camera and/or storage permission not granted');
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        resizeMode="contain"
        style={styles.img}
        source={{
          uri: imgUrl,
        }}
      />
      <TouchableOpacity style={styles.btnCam} onPress={openCameraLib}>
        <Text style={styles.textBtn}>Open Camera</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OpenCamera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  img: {
    width: '90%',
    height: 300,
    alignSelf: 'center',
    borderRadius: 200,
  },
  btnCam: {
    width: 150,
    height: 50,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginTop: 20,
  },
  textBtn: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});