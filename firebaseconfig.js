// Importa solo lo necesario
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAPtuiOntZO-Vq75HlyzabvVs5iJxs8bKk",
    authDomain: "inmovilsmart.firebaseapp.com",
    projectId: "inmovilsmart",
    storageBucket: "inmovilsmart.appspot.com", // <--- CORREGIDO
    messagingSenderId: "154350768467",
    appId: "1:154350768467:web:93aff4bd0490b518a191a6"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Auth con persistencia para React Native
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

export { app, auth };


