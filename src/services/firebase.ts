import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBzRVGbQP26Gh3wuzqIThqSCZZBULLJ0wY",
  authDomain: "spice-ff4d9.firebaseapp.com",
  projectId: "spice-ff4d9",
  storageBucket: "spice-ff4d9.firebasestorage.app",
  messagingSenderId: "949403514729",
  appId: "1:949403514729:web:4f2d2efac64002d077eff8",
  measurementId: "G-Q0N0KB4N65"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;