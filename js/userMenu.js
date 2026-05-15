import { auth } from "/login/js/firebase-config.js";
import {
  onAuthStateChanged,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const loginBtn    = document.getElementById("loginBtn");
const userAvatar  = document.querySelector(".user-avatar");
const avatarBtn   = document.getElementById("avatarBtn");
const menuPhoto   = document.getElementById("menuPhoto");
const userMenu    = document.getElementById("userMenu");
const userName    = document.getElementById("userName");
const userEmail   = document.getElementById("userEmail");
const logoutBtn   = document.getElementById("logoutBtn");
const editSection = document.getElementById("editSection");
const inputName   = document.getElementById("inputName");
const inputPhoto  = document.getElementById("inputPhoto");
const saveBtn     = document.getElementById("saveBtn");
const saveMsg     = document.getElementById("saveMsg");

// Detectar sesión
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Mostrar avatar
    if (loginBtn) loginBtn.style.display = "none";
    if (userAvatar) userAvatar.style.display = "block";

    const foto = user.photoURL || "img/default-user.png";
    if (avatarBtn) avatarBtn.src = foto;
    if (menuPhoto) menuPhoto.src = foto;
    if (userName) userName.textContent = user.displayName || "Usuario";
    if (userEmail) userEmail.textContent = user.email;

    // Detectar si inició con correo (no Google ni otro proveedor)
    const esCorreo = user.providerData.some(p => p.providerId === "password");
    if (editSection && esCorreo) {
      editSection.classList.add("visible");
      if (inputName) inputName.placeholder = user.displayName || "Tu nombre";
    }

  } else {
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (userAvatar) userAvatar.style.display = "none";
    if (userMenu) userMenu.style.display = "none";
  }
});

// Abrir/cerrar menú al hacer clic en avatar
avatarBtn?.addEventListener("click", () => {
  if (userMenu) {
    userMenu.style.display = userMenu.style.display === "block" ? "none" : "block";
  }
});

// Cerrar menú al hacer clic fuera
document.addEventListener("click", (e) => {
  if (userMenu && !userMenu.contains(e.target) && e.target !== avatarBtn) {
    userMenu.style.display = "none";
  }
});

// Guardar cambios de perfil
saveBtn?.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const nuevoNombre = inputName?.value.trim();
  const nuevaFoto   = inputPhoto?.value.trim();

  if (!nuevoNombre && !nuevaFoto) {
    saveMsg.textContent = "Escribe un nombre o URL de foto.";
    saveMsg.style.color = "#f87171";
    saveMsg.style.display = "block";
    setTimeout(() => saveMsg.style.display = "none", 3000);
    return;
  }

  try {
    await updateProfile(user, {
      displayName: nuevoNombre || user.displayName,
      photoURL:    nuevaFoto   || user.photoURL
    });

    // Actualizar UI
    if (nuevoNombre && userName) userName.textContent = nuevoNombre;
    if (nuevaFoto) {
      if (avatarBtn) avatarBtn.src = nuevaFoto;
      if (menuPhoto) menuPhoto.src = nuevaFoto;
    }

    if (inputName)  inputName.value  = "";
    if (inputPhoto) inputPhoto.value = "";

    saveMsg.textContent = "¡Cambios guardados!";
    saveMsg.style.color = "#34d399";
    saveMsg.style.display = "block";
    setTimeout(() => saveMsg.style.display = "none", 3000);

  } catch (error) {
    saveMsg.textContent = "Error al guardar. Intenta de nuevo.";
    saveMsg.style.color = "#f87171";
    saveMsg.style.display = "block";
  }
});

// Cerrar sesión
logoutBtn?.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.replace("/login/login.html");
  } catch (error) {
    alert("Error al cerrar sesión.");
  }
});