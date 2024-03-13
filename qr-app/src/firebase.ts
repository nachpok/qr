import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
  databaseURL: import.meta.env.VITE_DATABASE_URL || "",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export function createShortUrl(shortCode: string, originalUrl: string) {
  set(ref(database, "urls/" + shortCode), {
    originalUrl: originalUrl,
    createdAt: Date.now(),
  })
    .then(() => {
      return shortCode;
    })
    .catch((error) => {
      console.error("Error creating short URL:", error);
    });
}

export async function doesCodeExists(shortCode: string): Promise<boolean> {
  try {
    const snapshot = await get(child(ref(database), "urls/" + shortCode));
    if (snapshot.exists()) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error getting original URL:", error);
    return false;
  }
}
