import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { auth} from '../firebaseconfig';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useRouter } from 'expo-router';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useNavigation } from '@react-navigation/native';

WebBrowser.maybeCompleteAuthSession();

export default function Ingresar() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    // Hook de Google
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: '154350768467-c4k6k6cc59cda0dks15fnjlnc31tnvhs.apps.googleusercontent.com',
        androidClientId: '154350768467-c4k6k6cc59cda0dks15fnjlnc31tnvhs.apps.googleusercontent.com',
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential)
                .then(() => router.replace('/inicio'))
                .catch(() => alert('Error con Google'));
        }
    }, [response]);

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.replace('/inicio');
        } catch (error) {
            alert('Correo o contraseña incorrectos');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar sesión</Text>
            <View style={styles.logoContainer}>
                <Image
                    source={require('../assets/images/logoInvertido.png')}
                    resizeMode="contain"
                    style={styles.logo}
                />
            </View>
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
                <Text style={styles.linkTextBlack}>¿Olvidó su contraseña?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Iniciar sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => promptAsync()} style={styles.googleButton}>
                <Image
                    source={require('../assets/images/google.png')}
                    resizeMode="contain"
                    style={styles.googleIcon}
                />
                <Text style={styles.googleButtonText}>Continuar con Google</Text>
            </TouchableOpacity>

            <Text style={styles.text}>¿No tiene una cuenta?</Text>
            <TouchableOpacity onPress={() => router.push('/registro')}>
                <Text style={styles.linkTextBlack}>Registrarse</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 16,
        marginTop: 8,
        color: '#222',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 22,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 10,
    },
    input: {
        width: '100%',
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        padding: 15,
        fontSize: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    button: {
        backgroundColor: '#000',
        borderRadius: 20,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 16,
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    googleButton: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 24,
        paddingVertical: 13,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#ccc',
        marginBottom: 20,
        width: '100%',
    },
    googleIcon: {
        width: 40,
        height: 36,
        marginRight: 10,
    },
    googleButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    linkTextBlack: {
        color: '#000',
        textAlign: 'center',
        marginVertical: 6,
        fontSize: 15,
        fontWeight: '500',
    },
    text: {
        color: '#888',
        textAlign: 'center',
        marginTop: 12,
        fontSize: 15,
    },
});

