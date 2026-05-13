console.log("index-auth cargado");

// Importa la configuración de Firebase
import { auth } from "../Login/js/firebase-config.js";

// Importa funciones de Firebase Auth
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Referencias a elementos del DOM
const loginBtn = document.getElementById("loginBtn");
const userMenu = document.getElementById("userMenu");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");
const userAvatar = document.querySelector(".user-avatar");
const avatarBtn = document.getElementById("avatarBtn");

// Detectar usuario activo
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Usuario logueado → mostrar avatar y menú
    loginBtn.style.display = "none";
    userAvatar.style.display = "block";
    userMenu.style.display = "block";

    if (user.photoURL) {
      avatarBtn.src = user.photoURL;
    }
    userName.textContent = user.displayName || "Usuario";
    userEmail.textContent = user.email;
  } else {
    // Usuario NO logueado → mostrar botón login
    loginBtn.style.display = "inline-block";
    userAvatar.style.display = "none";
    userMenu.style.display = "none";
  }
});

// Mostrar/ocultar menú al hacer clic en el avatar
avatarBtn?.addEventListener("click", () => {
  userMenu.style.display = userMenu.style.display === "block" ? "none" : "block";
});

// Cerrar sesión
logoutBtn?.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "../index.html"; // 🔑 siempre regresa a index
  } catch (error) {
    alert("Error al cerrar sesión: " + error.code);
  }
});
