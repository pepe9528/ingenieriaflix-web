import { auth, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const avatarBtn = document.getElementById("avatarBtn");
const userMenu = document.getElementById("userMenu");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");
const loginBtn = document.getElementById("loginBtn");
const userAvatar = document.querySelector(".user-avatar");

// Mostrar/ocultar menú al hacer clic en el avatar
avatarBtn.addEventListener("click", () => {
  userMenu.style.display = userMenu.style.display === "block" ? "none" : "block";
});

// Cerrar sesión
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "./Login/login.html";
});

// Detectar usuario activo
auth.onAuthStateChanged(user => {
  if (user) {
    // Mostrar avatar y ocultar botón de login
    loginBtn.style.display = "none";
    userAvatar.style.display = "block";

    // Si tiene foto en su perfil de Firebase, úsala
    if (user.photoURL) {
      avatarBtn.src = user.photoURL;
    }
    userName.textContent = user.displayName || "Usuario";
    userEmail.textContent = user.email;
  } else {
    // Si no hay usuario, mostrar botón de login
    loginBtn.style.display = "inline-block";
    userAvatar.style.display = "none";
    userMenu.style.display = "none";
  }
});
