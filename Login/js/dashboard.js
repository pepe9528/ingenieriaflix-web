console.log("dashboard.js cargado correctamente");

import { auth } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut,
  updatePassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Mostrar nombre/email del usuario en dashboard
const userName = document.getElementById("userName");
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "/"; // 🔑 si no hay sesión, manda a index
    return;
  }
  if (userName) {
    userName.textContent = user.displayName || user.email;
  }
});

// Botón cerrar sesión
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = "/"; // 🔑 siempre regresa a index
    } catch (error) {
      alert("Error al cerrar sesión: " + error.code);
    }
  });
}
