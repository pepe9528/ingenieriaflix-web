import { auth } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const googleBtn = document.getElementById("googleBtn");
const githubBtn = document.getElementById("githubBtn");

loginBtn.addEventListener("click", async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    window.location.replace("../index.html");
  } catch (error) {
    alert("Error al iniciar sesión: " + error.code);
  }
});

registerBtn.addEventListener("click", async () => {
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    window.location.replace("../index.html");
  } catch (error) {
    alert("Error al registrar: " + error.code);
  }
});

googleBtn.addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    window.location.replace("../index.html");
  } catch (error) {
    alert("Error con Google: " + error.code);
  }
});

githubBtn.addEventListener("click", async () => {
  const provider = new GithubAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    window.location.replace("../index.html");
  } catch (error) {
    alert("Error con GitHub: " + error.code);
  }
});
