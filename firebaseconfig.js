// Import the functions you need from the SDKs you need
import { getReactNavigationConfig } from "expo-router/build/getReactNavigationConfig";
import { initializeApp } from "firebase/app";
import { initializeApp } from 'firebase/auth';
import { panGestureHandlerCustomNativeProps } from "react-native-gesture-handler/lib/typescript/handlers/PanGestureHandler";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAPtuiOntZO-Vq75HlyzabvVs5iJxs8bKk",
    authDomain: "inmovilsmart.firebaseapp.com",
    projectId: "inmovilsmart",
    storageBucket: "inmovilsmart.firebasestorage.app",
    messagingSenderId: "154350768467",
    appId: "1:154350768467:web:93aff4bd0490b518a191a6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeApp(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});


export { app, auth };