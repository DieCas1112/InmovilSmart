import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

import { db } from '../firebaseconfig'; // AJUSTA este path según tu estructura
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function PublicarPropiedad({ navigation }) {
    const [titulo, setTitulo] = useState('');
    const [precio, setPrecio] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [moneda, setMoneda] = useState('CRC'); // CRC = colones, USD = dólares
    const [fotos, setFotos] = useState([]);
    const [loading, setLoading] = useState(false);

    // Seleccionar imágenes
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true, // solo web permite varias, móvil una
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setFotos([...fotos, ...result.assets.map(a => a.uri)]);
        }
    };

    // Eliminar imagen
    const eliminarFoto = (index) => {
        Alert.alert(
            'Eliminar imagen',
            '¿Quieres eliminar esta imagen?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => setFotos(fotos.filter((_, i) => i !== index))
                }
            ]
        );
    };

    // SUBIR imagen a Storage (usando blob, recomendado por Expo)
    async function uploadImageAsync(uri, storagePath) {
        const response = await fetch(uri);
        const blob = await response.blob();
        const storage = getStorage();
        const storageRef = ref(storage, storagePath);
        await uploadBytes(storageRef, blob);
        const url = await getDownloadURL(storageRef);
        return url;
    }

    // Guardar Propiedad
    const guardarPropiedad = async () => {
        if (!titulo || !precio || !descripcion || fotos.length === 0) {
            alert('Completa todos los campos y sube al menos una foto.');
            return;
        }
        setLoading(true);
        try {
            const urls = [];
            for (let i = 0; i < fotos.length; i++) {
                const uri = fotos[i];
                const filename = uri.split('/').pop();
                const url = await uploadImageAsync(uri, `propiedades/${filename}_${Date.now()}`);
                urls.push(url);
            }
            // Guarda en Firestore (NO en Realtime Database)
            await addDoc(collection(db, 'Propiedades'), {
                titulo,
                precio,
                moneda,
                descripcion,
                fotos: urls,
                fecha: new Date()
            });
            setTitulo('');
            setPrecio('');
            setDescripcion('');
            setMoneda('CRC');
            setFotos([]);
            Alert.alert('Éxito', '¡Propiedad publicada con éxito!');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Error al guardar la propiedad');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps='handled'>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation?.goBack?.()}>
                        <Ionicons name="arrow-back" size={24} color="#141414" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Publicar propiedad</Text>
                    <View style={{ width: 24 }} />
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="Título de la publicación"
                    placeholderTextColor="#B3B3B3"
                    value={titulo}
                    onChangeText={setTitulo}
                />

                {/* Selector de moneda */}
                <View style={{ marginBottom: 14, borderRadius: 12, backgroundColor: '#F5F5F5', overflow: 'hidden' }}>
                    <Picker
                        selectedValue={moneda}
                        onValueChange={setMoneda}
                        style={{ height: 48 }}
                        itemStyle={{ fontSize: 15 }}
                    >
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

                <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <Text style={styles.buttonText}>Subir fotos</Text>
                </TouchableOpacity>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
                    {fotos.map((uri, idx) => (
                        <TouchableOpacity key={idx} onPress={() => eliminarFoto(idx)}>
                            <Image
                                source={{ uri }}
                                style={{
                                    width: 70, height: 70, borderRadius: 10,
                                    marginRight: 10, backgroundColor: '#eee', borderWidth: 2, borderColor: '#ccc'
                                }}
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <Text style={{ color: '#888', fontSize: 13, marginBottom: 10 }}>
                    *Toca una foto para eliminarla
                </Text>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#53d22c', marginTop: 14 }]}
                    onPress={guardarPropiedad}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={[styles.buttonText, { color: '#fff' }]}>Guardar propiedad</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>

            {/* Barra de navegación inferior */}
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
        backgroundColor: '#fff',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#141414',
        textAlign: 'center',
        flex: 1,
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        marginBottom: 14,
        color: '#141414',
    },
    button: {
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 6,
        marginBottom: 10,
    },
    buttonText: {
        color: '#141414',
        fontWeight: 'bold',
        fontSize: 15,
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 54,
        backgroundColor: '#fff',
        borderTopColor: '#E5E5E5',
        borderTopWidth: 1,
    },
});
