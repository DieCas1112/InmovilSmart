import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { auth } from './../firebaseconfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { getFirestore, doc, setDoc } from 'firebase/firestore';


export default function Registrar() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const db = getFirestore();

    const handleRegistro = async () => {
        if (!nombre || !email || !password) {
            alert('Completa todos los campos');
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            await setDoc(doc(db, 'Usuarios', userCredential.user.uid), {
                nombre,
                email,
                creado: new Date(),
                password
            });
            alert('¡Registro exitoso!');
            router.replace('/');
        } catch (error) {
            
        }
    };


    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.container}>
                <Text style={styles.title}>Registro</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nombre"
                    placeholderTextColor="#888"
                    value={nombre}
                    onChangeText={setNombre}
                    autoCapitalize="words"
                />
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

                <TouchableOpacity style={styles.button} onPress={handleRegistro}>
                    <Text style={styles.buttonText}>Registrarse</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.replace('/')}>
                    <Text style={styles.bottomText}>
                        ¿Ya tienes una cuenta? <Text style={{ textDecorationLine: 'underline', color: '#888' }}>Iniciar sesión</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 40,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginVertical: 16,
        color: '#141414',
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        height: 48,
        fontSize: 16,
        paddingHorizontal: 16,
        marginBottom: 16,
        color: '#141414',
    },
    button: {
        backgroundColor: '#141414',
        borderRadius: 28,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 28,
        width: '100%',
        alignSelf: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    bottomText: {
        textAlign: 'center',
        fontSize: 13,
        color: '#888',
        marginTop: 16,
    },
});
