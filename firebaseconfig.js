import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAPtuiOntZO-Vq75HlyzabvVs5iJxs8bKk",
    authDomain: "inmovilsmart.firebaseapp.com",
    projectId: "inmovilsmart",
    storageBucket: "inmovilsmart.appspot.com",
    messagingSenderId: "154350768467",
    appId: "1:154350768467:web:93aff4bd0490b518a191a6"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

let auth;
if (Platform.OS === 'web') {
    auth = getAuth(app);
} else {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
}

// Inicializa Firestore (si lo necesitas)
const db = getFirestore(app);

//import {  getAuth, signInWithPopup, GoogleAuthProvider }  from "firebase/auth";


//const provider = new GoogleAuthProvider();
//const auth = getAuth();






export { auth, app, db };
