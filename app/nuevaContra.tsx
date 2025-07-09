import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function NuevaContra() {
  const navigation = useNavigation();
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');



  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" color="#141414" size={28} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { flex: 1, textAlign: 'center', paddingRight: 28 }]}>
          Nueva contraseña
        </Text>
      </View>


      <View style={styles.inputBlock}>
        <Text style={styles.label}>Nueva contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Nueva contraseña"
          placeholderTextColor="#757575"
          secureTextEntry
          value={nueva}
          onChangeText={setNueva}
        />
      </View>


      <View style={styles.inputBlock}>
        <Text style={styles.label}>Confirmar nueva contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirmar nueva contraseña"
          placeholderTextColor="#757575"
          secureTextEntry
          value={confirmar}
          onChangeText={setConfirmar}
        />
      </View>

      {/* Botón Enviar */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
}

// ---- ESTILOS ----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 36 : 0,
    paddingHorizontal: 16,
    paddingBottom: 8
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#141414'
  },
  inputBlock: {
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 2
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#141414',
    marginBottom: 8
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 16,
    height: 54,
    fontSize: 16,
    paddingHorizontal: 16,
    color: '#141414',
    borderWidth: 0,
    marginBottom: 6
  },
  button: {
    backgroundColor: '#141414',
    borderRadius: 28,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.2
  }
});
