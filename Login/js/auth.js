import { auth } from "/Login/js/firebase-config.js";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Si ya hay sesión activa, ir al index
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.replace("/");
  }
});

// Login con correo
document.getElementById("loginBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.replace("/");
  } catch (error) {
    alert("Error: " + error.code);
  }
});

// Login con Google
document.getElementById("googleBtn")?.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
    window.location.replace("/");
  } catch (error) {
    alert("Error con Google: " + error.code);
  }
});

// Login con GitHub
document.getElementById("githubBtn")?.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, new GithubAuthProvider());
    window.location.replace("/");
  } catch (error) {
    alert("Error con GitHub: " + error.code);
  }
});

// Registro
document.getElementById("registerBtn")?.addEventListener("click", () => {
  window.location.href = "/Login/register.html";
});