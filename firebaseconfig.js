import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';


const firebaseConfig = {
    apiKey: "AIzaSyAPtuiOntZO-Vq75HlyzabvVs5iJxs8bKk",
    authDomain: "inmovilsmart.firebaseapp.com",
    projectId: "inmovilsmart",
    storageBucket: "gs://inmovilsmart.firebasestorage.app",
    messagingSenderId: "154350768467",
    appId: "1:154350768467:web:93aff4bd0490b518a191a6"
};


const app = initializeApp(firebaseConfig);

// Inicializa Auth con persistencia en móvil y normal en web
let auth;
if (Platform.OS === 'web') {
    auth = getAuth(app);
} else {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
}

// Instancias de servicios
const db = getFirestore(app);
const storage = getStorage(app);

// Exporta lo necesario
export { app, auth, db, storage };

//import {  getAuth, signInWithPopup, GoogleAuthProvider }  from "firebase/auth";


//const provider = new GoogleAuthProvider();
//const auth = getAuth();


