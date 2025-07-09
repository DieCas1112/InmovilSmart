import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { app } from '../firebaseconfig';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

export default function PublicarPropiedad({ }) {
  const [titulo, setTitulo] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [moneda, setMoneda] = useState('CRC');
  const [fotos, setFotos] = useState([]);
  const [subiendo, setSubiendo] = useState(false);

  const storage = getStorage(app);
  const db = getFirestore(app);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setFotos([...fotos, ...result.assets.map(a => a.uri)]);
    }
  };

  const eliminarFoto = index => {
    Alert.alert('Eliminar imagen', '¿Quieres eliminar esta imagen?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => setFotos(fotos.filter((_, i) => i !== index)) },
    ]);
  };

  const handleGuardarPropiedad = async () => {
    if (!titulo || !precio || !descripcion || fotos.length === 0) {
      alert('Completa todos los campos y sube al menos una foto.');
      return;
    }
    setSubiendo(true);
    try {
      let urlsFotos = [];
      for (let i = 0; i < fotos.length; i++) {
        if (!fotos[i]) throw new Error('URI de foto inválida');
        const response = await fetch(fotos[i]);
        const blob = await response.blob();
        const filename = `propiedad_${Date.now()}_${i}.jpg`;
        const storageRef = ref(storage, `propiedad/${filename}`);
        await uploadBytes(storageRef, blob);
        const url = await getDownloadURL(storageRef);
        urlsFotos.push(url);
      }
      await addDoc(collection(db, 'propiedad'), {
        titulo,
        moneda,
        precio,
        descripcion,
        fotos: urlsFotos,
        fecha: new Date()
      });
      alert('Propiedad guardada con éxito');
      setTitulo('');
      setMoneda('CRC');
      setPrecio('');
      setDescripcion('');
      setFotos([]);
    } catch (error) {
      console.error('Error al guardar propiedad:', error);
      alert('Error al guardar propiedad: ' + (error));
    }
    setSubiendo(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#141414" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Publicar propiedad</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Logo */}
        <View style={styles.logoWrapper}>
          <Image source={require('../assets/images/logo.png')} style={styles.headerImage} resizeMode="contain" />
        </View>

        {/* Form fields */}
        <TextInput
          style={styles.input}
          placeholder="Título de la publicación"
          placeholderTextColor="#B3B3B3"
          value={titulo}
          onChangeText={setTitulo}
        />

        <View style={styles.pickerWrapper}>
          <Picker selectedValue={moneda} onValueChange={setMoneda} style={styles.picker} itemStyle={styles.pickerItem}>
            <Picker.Item label="Colones (CRC)" value="CRC" />
            <Picker.Item label="Dólares (USD)" value="USD" />
          </Picker>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Precio"
          placeholderTextColor="#B3B3B3"
          value={precio}
          onChangeText={setPrecio}
          keyboardType="numeric"
        />

        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Descripción"
          placeholderTextColor="#B3B3B3"
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
        />

        {/* Botón para subir fotos */}
        <TouchableOpacity style={styles.button} onPress={pickImage} disabled={subiendo}>
          <Text style={styles.buttonText}>Subir fotos</Text>
        </TouchableOpacity>


        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
          {fotos.map((uri, i) => (
            <TouchableOpacity key={i} onPress={() => eliminarFoto(i)}>
              <Image source={{ uri }} style={styles.photoThumb} />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.helpText}>* Toca una foto para eliminarla</Text>


        <TouchableOpacity style={styles.button} onPress={handleGuardarPropiedad} disabled={subiendo}>
          {subiendo
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>Guardar propiedad</Text>
          }
        </TouchableOpacity>
      </ScrollView>


      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => router.replace('/inicio')}>
          <Ionicons name="home" size={24} color="#141414" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/buscar')}>
          <Ionicons name="search" size={24} color="#B3B3B3" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/detallePropiedad')}>
          <Ionicons name="add-circle-outline" size={24} color="#B3B3B3" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/notificaciones')}>
          <Ionicons name="notifications-outline" size={24} color="#B3B3B3" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/perfil')}>
          <Ionicons name="person-outline" size={24} color="#B3B3B3" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  formContainer: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 10,
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#141414'
  },
  logoWrapper: { alignItems: 'center', marginBottom: 16 },
  headerImage: {
    width: 80,
    height: 80,
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: '#e0e0e0'
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    marginBottom: 14,
    color: '#141414',
  },
  pickerWrapper: {
    marginBottom: 14,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
    width: '100%',
    justifyContent: 'center',
  },
  picker: {
    height: 60,
    width: '100%',
    fontSize: 14,
    color: '#141414',
  },
  pickerItem: {
    fontSize: 14,
    height: 48,
    color: '#141414',
    paddingHorizontal: 6,
    width: '100%',
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  photosScroll: { marginVertical: 10 },
  photoThumb: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: '#eee',
    borderWidth: 2,
    borderColor: '#ccc'
  },
  helpText: { color: '#888', fontSize: 13, marginBottom: 10 },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 54,
    borderTopColor: '#E5E5E5',
    borderTopWidth: 1,
  },
});
