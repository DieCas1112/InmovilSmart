import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { auth } from '../firebaseconfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function Ingresar() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.replace('/inicio'); // Cambia la ruta según tu estructura (asegúrate de que coincida)
        } catch (error) {
            alert('Correo o contraseña incorrectos');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar sesión</Text>

            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity onPress={() => router.push('/recuperarContra')}>
                <Text style={styles.linkText}>¿Olvidó su contraseña?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Iniciar sesión</Text>
            </TouchableOpacity>

            <Text style={styles.text}>¿No tiene una cuenta?</Text>

            <TouchableOpacity onPress={() => router.push('/registro')}>
                <Text style={styles.linkText}>Registrarse</Text>
            </TouchableOpacity>


            <View style={styles.logoContainer}>
                <Image
                    source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png" }}
                    style={{ width: 200, height: 80, resizeMode: 'contain' }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'flex-start', backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: 'bold', alignSelf: 'center', marginVertical: 24 },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        marginBottom: 12,
    },
    button: {
        backgroundColor: '#000',
        borderRadius: 24,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    linkText: { color: '#888', textAlign: 'center', marginVertical: 6 },
    text: { color: '#888', textAlign: 'center', marginTop: 10 },
    logoContainer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginBottom: 16 },
});