import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Platform
} from 'react-native';

export default function RecuperarContra() {
    const router = useRouter();
    const [correoTel, setCorreoTel] = useState('');

    const enviarCodigo = () => {
        if (correoTel.trim() === '') {
            alert('Por favor ingresa tu correo electrónico o teléfono.');
            return;
        }
        // Aquí iría la lógica para enviar el código con Firebase.
        router.push('/');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Encabezado */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
                    <Ionicons name="arrow-back" size={24} color="#141414" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Recuperar contraseña</Text>
                <View style={{ width: 28 }} />
            </View>

            {/* Cuerpo */}
            <View style={styles.body}>
                <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
                <Text style={styles.paragraph}>
                    Ingresa tu correo electrónico o número de teléfono para recibir un código de recuperación.
                </Text>

                <TextInput
                    placeholder="Correo electrónico o teléfono"
                    placeholderTextColor="#888"
                    style={styles.input}
                    value={correoTel}
                    onChangeText={setCorreoTel}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <TouchableOpacity style={styles.button} onPress={enviarCodigo}>
                    <Text style={styles.buttonText}>Enviar código</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'android' ? 36 : 0,
        paddingHorizontal: 16,
        paddingBottom: 8,
        borderBottomWidth: 0,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#141414',
    },
    body: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 32,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#141414',
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 14,
        color: '#666',
        marginBottom: 28,
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        height: 54,
        fontSize: 16,
        paddingHorizontal: 16,
        marginBottom: 28,
        color: '#141414',
        borderWidth: 0,
    },
    button: {
        backgroundColor: '#141414',
        borderRadius: 28,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 20,
        width: '100%',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 0.2,
    },
});

