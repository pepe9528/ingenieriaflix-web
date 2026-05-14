import { auth } from "/login/js/firebase-config.js";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Si ya hay sesión activa, ir directo al index
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.replace("/");
  }
});

// Login con correo y contraseña
document.getElementById("loginBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("errorMsg");

  if (!email || !password) {
    errorMsg.textContent = "Por favor llena todos los campos.";
    errorMsg.style.display = "block";
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.replace("/");
  } catch (error) {
    errorMsg.textContent = traducirError(error.code);
    errorMsg.style.display = "block";
  }
});

// Login con Google
document.getElementById("googleBtn")?.addEventListener("click", async () => {
  const errorMsg = document.getElementById("errorMsg");
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
    window.location.replace("/");
  } catch (error) {
    errorMsg.textContent = traducirError(error.code);
    errorMsg.style.display = "block";
  }
});

// Registro
document.getElementById("registerBtn")?.addEventListener("click", () => {
  window.location.href = "/login/register.html";
});

function traducirError(code) {
  const errores = {
    "auth/user-not-found": "No existe una cuenta con ese correo.",
    "auth/wrong-password": "Contraseña incorrecta.",
    "auth/invalid-email": "Correo electrónico inválido.",
    "auth/too-many-requests": "Demasiados intentos. Intenta más tarde.",
    "auth/popup-closed-by-user": "Cerraste la ventana antes de completar el inicio de sesión.",
    "auth/invalid-credential": "Credenciales inválidas. Verifica tu correo y contraseña.",
  };
  return errores[code] || "Error al iniciar sesión. Intenta de nuevo.";
}
