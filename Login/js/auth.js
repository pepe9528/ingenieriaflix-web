console.log("auth.js cargado correctamente");
import { auth } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const googleBtn = document.getElementById("googleBtn");
const githubBtn = document.getElementById("githubBtn");

// 🔑 Login con correo y contraseña
loginBtn.addEventListener("click", async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);

    // Validar si el correo ya fue verificado
    if (userCredential.user.emailVerified) {
      window.location.replace("../index.html");
    } else {
      alert("Debes verificar tu correo antes de iniciar sesión.");
    }
  } catch (error) {
    alert("Error al iniciar sesión: " + error.code);
  }
});

// 📝 Registro de nueva cuenta con verificación de correo
registerBtn.addEventListener("click", async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);

    // Enviar correo de verificación
    await sendEmailVerification(userCredential.user);

    alert("Se envió un correo de verificación. Revisa tu bandeja de entrada.");
  } catch (error) {
    alert("Error al registrar: " + error.code);
  }
});

// 🌐 Login con Google
googleBtn.addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    window.location.replace("../index.html");
  } catch (error) {
    alert("Error con Google: " + error.code);
  }
});

// 🐙 Login con GitHub
githubBtn.addEventListener("click", async () => {
  const provider = new GithubAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    window.location.replace("../index.html");
  } catch (error) {
    alert("Error con GitHub: " + error.code);
  }
});


