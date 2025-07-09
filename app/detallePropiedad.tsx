import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';


export default function DetallePropiedad({ route }) {

    const propiedad = route?.params?.propiedad || {
        fotos: [
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        ],
        precio: 9800000,
        moneda: 'USD',
        titulo: 'Casa moderna en West Hollywood',
        resumen: '5 camas 5 baños - 3,500 pies cuadrados',
        direccion: '1200 N Flores St, West Hollywood CA',
        descripcion: 'Esta es una casa moderna con un ambiente clásico de California. El plan de piso abierto y grandes ventanales inundan el espacio con luz natural.',
        habitaciones: 5,
        banos: 5,
        parqueos: 1,
        calefaccion: 'Central',
        escuelas: [
            { nombre: 'Escuela Secundaria Fairfax', distancia: '0.4 millas' },
            { nombre: 'Escuela Laurel Span', distancia: '0.6 millas' },
            { nombre: 'Escuela Primaria West Hollywood', distancia: '0.8 millas' },
        ],
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>

            <Image source={{ uri: propiedad.fotos[0] }} style={styles.imagen} />
            <View style={styles.content}>

                <Text style={styles.precio}>
                    {propiedad.moneda === 'USD' ? '$' : '₡'}
                    {Number(propiedad.precio).toLocaleString()}
                </Text>
                <Text style={styles.resumen}>{propiedad.resumen}</Text>
                <Text style={styles.direccion}>{propiedad.direccion}</Text>

                <Text style={styles.descripcion}>{propiedad.descripcion}</Text>


                <Text style={styles.seccion}>Caracteristicas</Text>
                <View style={styles.featuresRow}>
                    <View style={styles.feature}>
                        <Ionicons name="bed-outline" size={18} color="#000" />
                        <Text style={styles.featureText}>cuartos: {propiedad.habitaciones}</Text>
                    </View>
                    <View style={styles.feature}>
                        <Ionicons name="water-outline" size={18} color="#000" />
                        <Text style={styles.featureText}>Baños: {propiedad.banos}</Text>
                    </View>
                    <View style={styles.feature}>
                        <Ionicons name="car-outline" size={18} color="#000" />
                        <Text style={styles.featureText}>Parqueo: {propiedad.parqueos}</Text>
                    </View>
                    <View style={styles.feature}>
                        <MaterialCommunityIcons name="fire" size={18} color="#000" />
                        <Text style={styles.featureText}>Calefaccion: {propiedad.calefaccion}</Text>
                    </View>
                </View>


                <Text style={styles.seccion}>Colegios cercanos</Text>
                {propiedad.escuelas.map((escuela, i) => (
                    <View key={i} style={styles.schoolRow}>
                        <Ionicons name="school-outline" size={16} color="#000" style={{ marginRight: 7 }} />
                        <Text style={styles.schoolText}>{escuela.nombre}</Text>
                        <Text style={styles.schoolDist}>{escuela.distancia}</Text>
                    </View>
                ))}


                <Text style={styles.seccion}>informacion de contacto</Text>
                <TouchableOpacity style={styles.botonContactar} onPress={() => { '72095384' }}>
                    <Text style={styles.botonContactarTexto}>Solicitar información</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    imagen: { width: '100%', height: 200, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
    content: { padding: 16 },
    precio: { fontSize: 22, fontWeight: 'bold', color: '#141414', marginTop: 8 },
    resumen: { fontSize: 14, color: '#444', marginTop: 3 },
    direccion: { fontSize: 13, color: '#1776d1', marginVertical: 6 },
    descripcion: { fontSize: 14, color: '#333', marginBottom: 15 },
    seccion: { fontWeight: 'bold', fontSize: 16, color: '#222', marginTop: 18, marginBottom: 7 },
    featuresRow: { borderRadius: 10, borderWidth: 1, borderColor: '#eaeaea', padding: 9, marginBottom: 6 },
    feature: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    featureText: { marginLeft: 9, fontSize: 14, color: '#444' },
    schoolRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 2, marginBottom: 2 },
    schoolText: { fontSize: 14, color: '#222', flex: 1 },
    schoolDist: { fontSize: 13, color: '#666' },
    botonContactar: { marginTop: 18, backgroundColor: '#141414', borderRadius: 22, paddingVertical: 13, alignItems: 'center' },
    botonContactarTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
