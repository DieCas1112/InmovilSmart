import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

// Asume que tu Firebase está ya inicializado en otro archivo (ej: firebaseconfig.js)
// Si no, inicialízalo aquí o importa tus instancias (auth, db)

export default function Perfil() {
    const [usuario, setUsuario] = useState({ nombre: '', email: '' });
    const [publicaciones, setPublicaciones] = useState([]);
    const [loading, setLoading] = useState(true);

    // Inicializa Firebase Auth y Firestore
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    // Traer datos personales
                    const userDoc = await getDoc(doc(db, 'Usuarios', user.uid));
                    if (userDoc.exists()) setUsuario(userDoc.data());

                    // Traer publicaciones de este usuario
                    const q = query(collection(db, 'propiedad'), where('uid', '==', user.uid));
                    const querySnapshot = await getDocs(q);
                    const pubs = [];
                    querySnapshot.forEach(doc => {
                        pubs.push({ id: doc.id, ...doc.data() });
                    });
                    setPublicaciones(pubs);
                }
            } catch (error) {
                alert('Error al cargar el perfil: ' + error.message);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={styles.container}>
                <Text style={styles.title}>Mi perfil</Text>

                <Text style={styles.label}>Nombre</Text>
                <TextInput
                    style={styles.input}
                    value={usuario.nombre}
                    editable={false}
                />
                <Text style={styles.label}>Correo electrónico</Text>
                <TextInput
                    style={styles.input}
                    value={usuario.email}
                    editable={false}
                />

                <Text style={styles.sectionTitle}>Mis publicaciones</Text>
                {loading ? <Text>Cargando...</Text> : null}
                {publicaciones.length === 0 && !loading && (
                    <Text style={{ color: '#888', marginTop: 8 }}>No tienes publicaciones.</Text>
                )}
                {publicaciones.map((pub, idx) => (
                    <View key={pub.id} style={styles.pubItem}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.tipo}>{pub.tipo || 'Propiedad'}</Text>
                            <Text style={styles.pubTitle}>{pub.titulo}</Text>
                            <Text style={styles.pubDesc}>{pub.descripcion?.substring(0, 30) || ''}</Text>
                        </View>
                        {pub.fotos && pub.fotos.length > 0 && (
                            <Image source={{ uri: pub.fotos[0] }} style={styles.pubImg} />
                        )}
                    </View>
                ))}

                <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editButtonText}>Editar información</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16, backgroundColor: '#fff', flex: 1 },
    title: { fontWeight: 'bold', fontSize: 18, alignSelf: 'center', marginVertical: 14 },
    label: { color: '#444', marginTop: 16 },
    input: {
        backgroundColor: '#F5F5F5', borderRadius: 12, height: 42, fontSize: 15,
        paddingHorizontal: 10, marginBottom: 10, color: '#222'
    },
    sectionTitle: { fontWeight: 'bold', fontSize: 16, marginVertical: 18 },
    pubItem: {
        flexDirection: 'row', alignItems: 'center', marginBottom: 18,
        backgroundColor: '#FAFAFA', borderRadius: 10, padding: 10, elevation: 1
    },
    pubTitle: { fontWeight: 'bold', fontSize: 15, marginTop: 2 },
    tipo: { color: '#888', fontSize: 12 },
    pubDesc: { color: '#777', fontSize: 12 },
    pubImg: { width: 70, height: 48, borderRadius: 6, marginLeft: 10 },
    editButton: {
        backgroundColor: '#141414', borderRadius: 10, height: 42,
        justifyContent: 'center', alignItems: 'center', marginTop: 28
    },
    editButtonText: { color: '#fff', fontWeight: 'bold' }
});
