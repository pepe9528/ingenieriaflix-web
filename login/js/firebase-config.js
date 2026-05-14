import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBE-5eYcFj0f3T8JERm6tcGcofKruCICjs",
  authDomain: "ingenieriaflix-634c5.firebaseapp.com",
  projectId: "ingenieriaflix-634c5",
  storageBucket: "ingenieriaflix-634c5.firebasestorage.app",
  messagingSenderId: "96797128927",
  appId: "1:96797128927:web:93d6e27a53e5652eb5116a",
  measurementId: "G-B68TQ6PYXQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
