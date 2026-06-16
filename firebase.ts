import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD_glR0NICv9yIxe2H0XHkrsOqS4vMf308",
  authDomain: "decidelo-84ca0.firebaseapp.com",
  projectId: "decidelo-84ca0",
  storageBucket: "decidelo-84ca0.firebasestorage.app",
  messagingSenderId: "81515295625",
  appId: "1:81515295625:web:3fcf309edc5dce2c20a758",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;