
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import logo from '../assets/images/logo.png'; // ← corrected
import { db } from '../firebaseconfig';

/** Reusable button with hover (web) & activeOpacity (mobile) */
export function MiBoton({ onPress, children, loading }) {
  const [hover, setHover] = useState(false);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.85}
      onMouseEnter={() => Platform.OS === 'web' && setHover(true)}
      onMouseLeave={() => Platform.OS === 'web' && setHover(false)}
      style={[
        styles.button,
        hover && Platform.OS === 'web' && styles.buttonHover,
        loading && styles.buttonDisabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={hover ? '#fff' : '#141414'} />
      ) : (
        <Text style={[styles.buttonText, hover && Platform.OS === 'web' && styles.buttonTextHover]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

/** Main screen: publicar propiedad */
export default function PublicarPropiedad({ navigation }) {
  const [titulo, setTitulo] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [moneda, setMoneda] = useState('CRC');
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
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

  async function uploadImageAsync(uri, path) {
    const resp = await fetch(uri);
    const blob = await resp.blob();
    const storage = getStorage();
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  }

  const guardarPropiedad = async () => {
    if (!titulo || !precio || !descripcion || fotos.length === 0) {
      Alert.alert('Error', 'Completa todos los campos y sube al menos una foto.');
      return;
    }
    setLoading(true);
    try {
      const urls = [];
      for (let uri of fotos) {
        const filename = uri.split('/').pop();
        const url = await uploadImageAsync(uri, `propiedades/${filename}_${Date.now()}`);
        urls.push(url);
      }
      await addDoc(collection(db, 'Propiedades'), {
        titulo,
        precio,
        moneda,
        descripcion,
        fotos: urls,
        fecha: new Date(),
      });
      setTitulo('');
      setPrecio('');
      setDescripcion('');
      setMoneda('CRC');
      setFotos([]);
      Alert.alert('Éxito', '¡Propiedad publicada con éxito!');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Error al guardar la propiedad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#141414" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Publicar propiedad</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Logo */}
        <View style={styles.logoWrapper}>
          <Image source={logo} style={styles.headerImage} resizeMode="contain" />
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

        <MiBoton onPress={pickImage} loading={false}>
          Subir fotos
        </MiBoton>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
          {fotos.map((uri, i) => (
            <TouchableOpacity key={i} onPress={() => eliminarFoto(i)}>
              <Image source={{ uri }} style={styles.photoThumb} />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.helpText}>* Toca una foto para eliminarla</Text>

        <MiBoton onPress={guardarPropiedad} loading={loading}>
          Guardar propiedad
        </MiBoton>
      </ScrollView>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        <Ionicons name="home" size={24} color="#141414" />
        <Ionicons name="search" size={24} color="#B3B3B3" />
        <Ionicons name="add-circle-outline" size={24} color="#B3B3B3" />
        <Ionicons name="notifications-outline" size={24} color="#B3B3B3" />
        <Ionicons name="person-outline" size={24} color="#B3B3B3" />
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
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#141414' },
  logoWrapper: { alignItems: 'center', marginBottom: 16 },
  headerImage: { width: 80, height: 80, borderRadius: 24, borderWidth: 2.5, borderColor: '#e0e0e0' },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    marginBottom: 14,
    color: '#141414',
  },
  pickerWrapper: { marginBottom: 14, borderRadius: 12, backgroundColor: '#F5F5F5', overflow: 'hidden' },
  picker: { height: 48 },
  pickerItem: { fontSize: 15 },
  button: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10,
    transitionProperty: 'background-color',
    transitionDuration: '180ms',
    transitionTimingFunction: 'ease-in-out',
  },
  buttonHover: { backgroundColor: '#000' },
  buttonDisabled: { backgroundColor: '#AAA' },
  buttonText: {
    color: '#141414',
    fontWeight: 'bold',
    fontSize: 15,
    transitionProperty: 'color',
    transitionDuration: '180ms',
    transitionTimingFunction: 'ease-in-out',
  },
  buttonTextHover: { color: '#fff' },
  photosScroll: { marginVertical: 10 },
  photoThumb: { width: 70, height: 70, borderRadius: 10, marginRight: 10, backgroundColor: '#eee', borderWidth: 2, borderColor: '#ccc' },
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
