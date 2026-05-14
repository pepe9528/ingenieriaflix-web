import { auth } from "/login/js/firebase-config.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");
const userAvatar = document.querySelector(".user-avatar");
const avatarBtn = document.getElementById("avatarBtn");
const userMenu = document.getElementById("userMenu");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, (user) => {
  if (user) {
    if (loginBtn) loginBtn.style.display = "none";
    if (userAvatar) userAvatar.style.display = "block";
    if (avatarBtn && user.photoURL) avatarBtn.src = user.photoURL;
    if (userName) userName.textContent = user.displayName || "Usuario";
    if (userEmail) userEmail.textContent = user.email;
  } else {
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (userAvatar) userAvatar.style.display = "none";
    if (userMenu) userMenu.style.display = "none";
  }
});

avatarBtn?.addEventListener("click", () => {
  if (userMenu) {
    userMenu.style.display = userMenu.style.display === "block" ? "none" : "block";
  }
});

logoutBtn?.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.replace("/login/login.html");
  } catch (error) {
    alert("Error al cerrar sesión.");
  }
});
