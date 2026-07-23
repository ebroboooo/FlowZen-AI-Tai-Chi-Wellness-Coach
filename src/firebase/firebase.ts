/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

let defaultConfig: Record<string, string> = {};
try {
  const glob = import.meta.glob('../../firebase-applet-config.json', { eager: true });
  const key = '../../firebase-applet-config.json';
  if (glob[key]) {
    defaultConfig = ((glob[key] as any).default || glob[key]) as Record<string, string>;
  }
} catch {
  // Ignore missing config file
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || defaultConfig.apiKey || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || defaultConfig.authDomain || 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || defaultConfig.projectId || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || defaultConfig.storageBucket || 'demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultConfig.messagingSenderId || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || defaultConfig.appId || '1:123456789:web:123456'
};

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  auth = getAuth(app);
} catch (err) {
  console.warn('Firebase initialization skipped or failed:', err);
  app = null as any;
  db = null as any;
  auth = null as any;
}

export { app, db, auth };
