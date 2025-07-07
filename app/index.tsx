//import appFirebase, { Google } from "../firebaseconfig";
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { auth, db ,app} from '../firebaseconfig';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useRouter } from 'expo-router';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
//import appFirebase, {Google} from "../firebaseconfig";


WebBrowser.maybeCompleteAuthSession();




export default function Ingresar() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

   // Hook de Google
    const [request, response, promptAsync] = Google.useAuthRequest({
    //expoClientId: '154350768467-am2npn5avvaokh5q9s8sofdqq7vl9kdj.apps.googleusercontent.com',
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

            {/* Botón Google funcional */}
            <TouchableOpacity
                //onPress={Google}
                onPress={() => promptAsync()}
                style={styles.googleButton}
            >
                <Image
                    source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png' }}
                    style={{ width: 20, height: 20, marginRight: 10 }}
                />
                <Text style={styles.googleButtonText}>Continuar con Google</Text>
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
    googleButton: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 24,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 20,
    },
    googleButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
