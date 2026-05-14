import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, getRedirectResult } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDRn856EAdCrVxH8FbOUkFemTB1dFv_iqY",
  authDomain: "ingenieriaflix.firebaseapp.com",
  projectId: "ingenieriaflix",
  storageBucket: "ingenieriaflix.appspot.com",
  messagingSenderId: "129261287747",
  appId: "1:129261287747:web:ac664370ba8f8bec8b97f6",
  measurementId: "G-9YQS6QNTR7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Limpiar redirect pendiente de GitHub/Google
getRedirectResult(auth).catch(() => {});