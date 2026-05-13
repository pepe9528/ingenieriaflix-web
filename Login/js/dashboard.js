console.log("dashboard.js cargado correctamente");

import { auth, signOut, updatePassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Botón cerrar sesión
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "../Login/login.html";
  });
}

import { auth } from "firebase-config.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Mostrar nombre/email del usuario en dashboard
const userName = document.getElementById("userName");
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  if (userName) {
    userName.textContent = user.displayName || user.email;
  }
});

// Cerrar sesión desde configuracion.html
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = "login.html";
    } catch (error) {
      alert("Error al cerrar sesión: " + error.code);
    }
  });
}
