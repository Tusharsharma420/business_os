import { initializeApp } from 'firebase/app';
// @ts-ignore
import { 
  getAuth, 
  initializeAuth, 
  getReactNativePersistence 
} from 'firebase/auth/react-native';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// REPLACE THESE WITH YOUR FIREBASE PROJECT KEYS
// Found in Firebase Console -> Project Settings -> General -> Your Apps
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { app, auth, db };
