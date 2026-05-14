import { auth } from "/Login/js/firebase-config.js";

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Botones
const loginBtn = document.getElementById("loginBtn");
const googleBtn = document.getElementById("googleBtn");
const githubBtn = document.getElementById("githubBtn");
const registerBtn = document.getElementById("registerBtn");

// Iniciar sesión con correo y contraseña
loginBtn?.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.replace("/"); // ✅ siempre regresa al index
  } catch (error) {
    alert("Error al iniciar sesión: " + error.code);
  }
});

// Iniciar sesión con Google
googleBtn?.addEventListener("click", async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    window.location.replace("/"); // ✅ index
  } catch (error) {
    alert("Error con Google: " + error.code);
  }
});

// Iniciar sesión con GitHub
githubBtn?.addEventListener("click", async () => {
  try {
    const provider = new GithubAuthProvider();
    await signInWithPopup(auth, provider);
    window.location.replace("/"); // ✅ index
  } catch (error) {
    alert("Error con GitHub: " + error.code);
  }
});

// Registro → redirigir a página de registro
registerBtn?.addEventListener("click", () => {
  window.location.href = "/Login/register.html";
});

// Detectar sesión (no redirige al login)
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Usuario activo:", user.email);
  } else {
    console.log("No hay sesión activa");
  }
});
