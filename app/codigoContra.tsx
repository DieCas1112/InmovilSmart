import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CodigoContra() {
  const navigation = useNavigation();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(59);
  const inputRefs = Array(6).fill(null).map(() => useRef(null));

  // Simple timer logic (sin intervalos reales para simplificar)
  React.useEffect(() => {
    if (timer > 0) {
      const timeout = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timeout);
    }
  }, [timer]);

  // Maneja el ingreso de cada dígito
  const handleChange = (text, idx) => {
    if (!/^\d*$/.test(text)) return;
    const newCode = [...code];
    newCode[idx] = text.slice(-1);
    setCode(newCode);
    if (text && idx < 5) {
      inputRefs[idx + 1].current.focus();
    }
  };

  // Maneja retroceso para inputs individuales
  const handleKeyPress = (e, idx) => {
    if (e.nativeEvent.key === 'Backspace' && code[idx] === '' && idx > 0) {
      inputRefs[idx - 1].current.focus();
    }
  };

  // Función de verificación (placeholder)
  const onVerify = () => {
    // Aquí puedes poner la lógica de validación y navegación
    navigation.navigate('/nuevaContra'); // Cambia al nombre de tu ruta real
  };

  // Función para reenviar código
  const resendCode = () => {
    setTimer(59);
    // Lógica de reenvío aquí
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" color="#141414" size={28} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { flex: 1, textAlign: 'center', marginRight: 28 }]}>
          Recuperar Contraseña
        </Text>
      </View>

      {/* Título */}
      <Text style={styles.title}>Ingresa el Código de Verificación</Text>
      <Text style={styles.paragraph}>
        Hemos enviado un código de 6 dígitos a tu correo electrónico. Por favor, ingrésalo a continuación.
      </Text>

      {/* Inputs del código */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 18 }}>
        {code.map((digit, idx) => (
          <TextInput
            key={idx}
            ref={inputRefs[idx]}
            value={digit}
            keyboardType="numeric"
            maxLength={1}
            onChangeText={text => handleChange(text, idx)}
            onKeyPress={e => handleKeyPress(e, idx)}
            style={[
              styles.codeInput,
              { borderBottomWidth: 2, borderBottomColor: '#e0e0e0', marginHorizontal: 4 }
            ]}
            returnKeyType={idx === 5 ? "done" : "next"}
          />
        ))}
      </View>

      {/* Timer */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 24 }}>
        <View style={styles.timerBox}>
          <Text style={styles.timerText}>{String(Math.floor(timer / 60)).padStart(2, '0')}</Text>
          <Text style={styles.timerLabel}>Minutos</Text>
        </View>
        <View style={{ width: 18 }} />
        <View style={styles.timerBox}>
          <Text style={styles.timerText}>{String(timer % 60).padStart(2, '0')}</Text>
          <Text style={styles.timerLabel}>Segundos</Text>
        </View>
      </View>

      {/* Botón Verificar */}
      <TouchableOpacity style={styles.button} onPress={onVerify}>
        <Text style={styles.buttonText}>Verificar</Text>
      </TouchableOpacity>

      {/* Enlace de reenviar */}
      <TouchableOpacity onPress={timer === 0 ? resendCode : null} disabled={timer > 0}>
        <Text style={[styles.resend, { color: timer === 0 ? '#141414' : '#aaa' }]}>
          ¿No recibiste el código? Reenviar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#141414',
    marginBottom: 8,
    paddingHorizontal: 20,
    marginTop: 18,
  },
  paragraph: {
    fontSize: 14,
    color: '#141414',
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  codeInput: {
    width: 46,
    height: 54,
    textAlign: 'center',
    fontSize: 22,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginHorizontal: 3,
    color: '#141414',
  },
  timerBox: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    alignItems: 'center',
    width: 50,
    height: 54,
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#141414',
    marginBottom: 2,
  },
  timerLabel: {
    fontSize: 12,
    color: '#757575',
  },
  button: {
    backgroundColor: '#141414',
    borderRadius: 28,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 18,
    width: '85%',
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
  resend: {
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 10,
    marginBottom: 18,
  },
});
