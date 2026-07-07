// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDHVNZuVzLodH_3888LqznbSptggRlQ5M4",
  authDomain: "frenesi-papeleria-1.firebaseapp.com",
  projectId: "frenesi-papeleria-1",
  storageBucket: "frenesi-papeleria-1.firebasestorage.app",
  messagingSenderId: "277397054577",
  appId: "1:277397054577:web:9b7a02f79fc8147c25e7d0",
  measurementId: "G-5SX0ENDSTR"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };