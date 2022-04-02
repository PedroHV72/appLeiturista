import React, { useState, useEffect, useRef } from 'react';
import { Image, Modal, StyleSheet, SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';

export default function ComponentCamera(props) {

  const ref = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [captured, setCaptured] = useState(null);
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    (async () => {
        const { statusLoc } = await Location.requestForegroundPermissionsAsync();
        if (statusLoc !== 'granted') {
            setErrorMsg('Permissão negada!');
      }
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>Sem acesso a câmera</Text>;
  }

  async function armazenarLocalizacao() {
    
    let actualLocation = await Location.getCurrentPositionAsync({});
    setLocation(actualLocation.coords);
    
    if (errorMsg) {
      text = errorMsg;
    } else if (location) {
      text = JSON.stringify(location);
    }
  }

  async function take() {
    if (ref) {
      const opt = {
        quality: 0.8,
        base64: true,
        flexOrientation: true,
        forceUpOrientation: true,
      }
      armazenarLocalizacao();
      const data =  await ref.current.takePictureAsync(opt);
      setCaptured(data.uri);
      setOpen(true);
      await MediaLibrary.saveToLibraryAsync(data.uri);
      console.log('Diretório da foto: ', data.uri)
      if (props.matricula != null && props.codigo != null && props.situacao != null) {
        console.log(`Informações vindas do Form: ${props.matricula}_${props.codigo}_${props.situacao}`) 
      }
    }
  }

 return (
   <SafeAreaView>
       <Camera style={styles.camera} type={type} ref={ref}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonFlip}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonTake}
            onPress={take}>
            <Text style={styles.text}> Take </Text>
          </TouchableOpacity>
        </View>
      </Camera>
      <Modal transparent={true} visible={open}>
        <View style={styles.contentPhoto}>
          <TouchableOpacity style={styles.buttonClose} onPress={() => setOpen(false)}>
            <Text style={styles.text}> Close </Text>
          </TouchableOpacity>
          <Image style={styles.img} source={{uri: captured}} />
        </View>
      </Modal>
   </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        width: '100%',
        height: '100%',
    }, 
    buttonContainer: {
        flex: 1,
        backgroundColor: "transparent",
        flexDirection: "row",
    },
    buttonFlip: {
        position: 'absolute',
        bottom: 50,
        left: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        margin: 20,
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    buttonTake: {
        position: 'absolute',
        bottom: 50,
        right: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        margin: 20,
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    contentPhoto: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF'
    },
    img: {
        width: '75%',
        height: '65%',
    },
    buttonClose: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        margin: 20,
        width: 50,
        height: 50,
        borderRadius: 50
    },
    buttonConfirm: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green',
        margin: 20,
        width: 50,
        height: 50,
        borderRadius: 50
    },
    text: {
        color: '#FFF'
    }
});