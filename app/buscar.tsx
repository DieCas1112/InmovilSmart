


import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseconfig'; // Ajusta el path

export default function BuscarPropiedades() {
    const [propiedades, setPropiedades] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [loading, setLoading] = useState(true);

    // Carga los datos al abrir la pantalla
    useEffect(() => {
        cargarPropiedades();
    }, []);

    const cargarPropiedades = async () => {
        setLoading(true);
        try {
            const snap = await getDocs(collection(db, 'propiedad'));
            // Extrae data de cada documento
            const lista = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPropiedades(lista);
        } catch (error) {
            alert('Error cargando propiedades');
        }
        setLoading(false);
    };

    // Búsqueda simple por título
    const filtradas = propiedades.filter(p =>
        p.titulo?.toLowerCase().includes(busqueda.toLowerCase())
    );

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.fotos?.[0] }} style={styles.imagen} />
            <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.tipo}>{item.titulo || 'Propiedad'}</Text>
                <Text style={styles.precio}>{item.moneda === 'USD' ? '$' : '₡'}{item.precio} – {item.titulo}</Text>
                <Text style={styles.detalle}>
                    {item.habitaciones ? `${item.habitaciones} habitaciones · ` : ''}
                    {item.banos ? `${item.banos} baños · ` : ''}
                    {item.area ? `${item.area} m²` : ''}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Buscar</Text>
            <TextInput
                style={styles.busqueda}
                placeholder="Buscar"
                placeholderTextColor="#888"
                value={busqueda}
                onChangeText={setBusqueda}
            />


            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={filtradas}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 12, paddingTop: 24 },
    titulo: { fontWeight: 'bold', fontSize: 20, alignSelf: 'center', marginBottom: 10 },
    busqueda: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        fontSize: 16,
        paddingHorizontal: 16,
        marginBottom: 14,
        height: 48,
        color: '#141414',
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        marginBottom: 16,
        padding: 10,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#0002',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.09,
        shadowRadius: 2,
    },
    imagen: { width: 90, height: 70, borderRadius: 10, backgroundColor: '#DDD' },
    tipo: { fontSize: 13, color: '#757575', marginBottom: 2 },
    precio: { fontWeight: 'bold', fontSize: 15, color: '#141414', marginBottom: 2 },
    detalle: { fontSize: 13, color: '#555' },
});
