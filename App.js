import { useState } from "react";
import { StyleSheet,TextInput, View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'
import ComponentCamera from "./src/components/Camera";

export default function App() {

  const [matricula, setMatricula] = useState(null);
  const [codigo, setCodigo] = useState(null);
  const [situacao, setSituacao] = useState(null);
  const [visibleModal, setVisibleModal] = useState(false);

  function verificar() {
    if(matricula != null && codigo != null && situacao != null) {
      setVisibleModal(true)
    } else {
      Alert.alert("Todos os campos são obrigatórios")
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentForm}>
        <View style={styles.form}>
          <Text style={styles.text}>Matrícula:</Text>
          <TextInput style={styles.textInput} onChangeText={setMatricula} value={matricula} />

          <Text style={styles.text}>Código:</Text>
          <TextInput style={styles.textInput} onChangeText={setCodigo} value={codigo} />

          <Text style={styles.text}>Situação:</Text>
          <Picker style={styles.selectInput} situacao={situacao} onValueChange={(itemValue, itemIndex) => setSituacao(itemValue)}> 
            <Picker.Item label="Leitura Implausível" value="Leitura Implausível"  />
            <Picker.Item label="Releitura" value="Releitura" />
            <Picker.Item label="Situação de Risco" value="Situação de Risco" />
            <Picker.Item label="Suspeita de Fraude" value="Suspeita de Fraude" />
            <Picker.Item label="Impedimento de Leitura" value="Impedimento de Leitura" />
          </Picker>
          
          <TouchableOpacity style={styles.button} onPress={ () => verificar()}>
              <Text style={styles.buttonText}>
                Tirar foto
              </Text>
          </TouchableOpacity>
        </View>
        <Modal transparent={true} visible={visibleModal}>
            <ComponentCamera 
              matricula={matricula} 
              codigo={codigo} 
              situacao={situacao} 
            />
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    justifyContent: 'center'
  },
  contentForm: {
    width: '100%',
    height: 'auto',
    backgroundColor: '#ddd',
    alignItems: 'center',
    marginTop: 30,
    borderRadius: 50,
    elevation: 5
  },
  form: {
    width: "100%",
    height: "auto",
    marginTop: 20,
    padding: 15,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold", 
    padding: 5,
  },
  textInput: {
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#FFF",
    color: "#000",
    borderRadius: 6,
    margin: 5,
    padding: 5,
  },
  selectInput: {
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#FFF",
    color: "#F7E2E2",
    borderRadius: 6,
    margin: 5,
    padding: 5,
    fontWeight: "bold"
  },
  button: {
    margin: 10,
    backgroundColor: "green",
    alignItems: "center",
    padding: 10,
    borderRadius: 40,
  },
  buttonText: {
    fontSize: 24,
    color: "#DEEBF7",
  },
});
