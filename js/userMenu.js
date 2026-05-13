import { auth } from "../Login/js/firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const avatarBtn = document.getElementById("avatarBtn");
const userMenu = document.getElementById("userMenu");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");
const loginBtn = document.getElementById("loginBtn");
const userAvatar = document.querySelector(".user-avatar");

// MOSTRAR MENÚ
avatarBtn?.addEventListener("click", () => {
  userMenu.style.display =
    userMenu.style.display === "block" ? "none" : "block";
});

// DETECTAR SESIÓN (sin redirección automática)
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginBtn.style.display = "none";
    userAvatar.style.display = "block";

    if (user.photoURL) {
      avatarBtn.src = user.photoURL;
    }

    userName.textContent = user.displayName || "Usuario";
    userEmail.textContent = user.email;
  } else {
    loginBtn.style.display = "inline-block";
    userAvatar.style.display = "none";
    userMenu.style.display = "none";
  }
});

// CERRAR SESIÓN → siempre regresa a index.html
logoutBtn?.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "../index.html"; // 🔑 redirección clara
  } catch (error) {
    alert("Error al cerrar sesión: " + error.code);
  }
});
