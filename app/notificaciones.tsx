import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';



const mockNotificaciones = [
    {
        id: '1',
        titulo: 'Alerta de búsqueda',
        detalle: 'Nueva propiedad disponible en Cartago',

    },
    {
        id: '2',
        titulo: 'Alerta de búsqueda',
        detalle: 'Nueva propiedad disponible en San José',
    },
    {
        id: '3',
        titulo: 'Alerta de búsqueda',
        detalle: 'Nueva propiedad disponible en Heredia',
    },
    {
        id: '4',
        titulo: 'Alerta de búsqueda',
        detalle: 'Nueva propiedad disponible en Alajuela',
    }
];

export default function Alertas() {

    const [notificaciones, setNotificaciones] = useState(mockNotificaciones);

    useEffect(() => {
        async function cargarNotificaciones() {
            const q = query(collection(db, 'notificaciones'), where('uid', '==', 'usuarioUID'));
            const snap = await getDocs(q);
            setNotificaciones(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
        cargarNotificaciones();
    }, []);


    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity>
                    <Ionicons name="arrow-back" size={22} color="#141414" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Alertas</Text>
                <View style={{ width: 24 }} />
            </View>
            <ScrollView>
                {notificaciones.map((alerta) => (
                    <View key={alerta.id} style={styles.alertaRow}>
                        <View style={styles.iconCol}>
                            <Ionicons name="notifications-outline" size={24} color="#141414" />
                        </View>
                        <View style={styles.textCol}>
                            <Text style={styles.alertaTitulo}>{alerta.titulo}</Text>
                            <Text style={styles.alertaDetalle}>{alerta.detalle}</Text>
                        </View>
                        <TouchableOpacity style={styles.verAhoraButton}>
                            <Text style={styles.verAhoraText}>Ver ahora</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 10 },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 14,
        marginBottom: 10,
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#141414',
        alignSelf: 'center'
    },
    alertaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 10,
        padding: 8,
        elevation: 1,
    },
    iconCol: {
        width: 34,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textCol: {
        flex: 1,
        paddingLeft: 2,
    },
    alertaTitulo: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#141414',
    },
    alertaDetalle: {
        color: '#888',
        fontSize: 12,
        marginTop: 2,
    },
    verAhoraButton: {
        backgroundColor: '#F5F5F5',
        paddingVertical: 7,
        paddingHorizontal: 15,
        borderRadius: 18,
        alignSelf: 'center'
    },
    verAhoraText: {
        color: '#141414',
        fontWeight: 'bold',
        fontSize: 13,
    },
});
