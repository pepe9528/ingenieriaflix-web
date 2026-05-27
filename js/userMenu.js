import { auth } from "/login/js/firebase-config.js";
import {
  onAuthStateChanged,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const loginBtn    = document.getElementById("loginBtn");
const userAvatar  = document.querySelector(".user-avatar");
const avatarBtn   = document.getElementById("avatarBtn");
const userMenu    = document.getElementById("userMenu");
const userName    = document.getElementById("userName");
const userEmail   = document.getElementById("userEmail");
const logoutBtn   = document.getElementById("logoutBtn");
const editSection = document.getElementById("editSection");
const inputName   = document.getElementById("inputName");
const saveBtn     = document.getElementById("saveBtn");
const saveMsg     = document.getElementById("saveMsg");

// Colores para el avatar según inicial
const colores = [
  "#e53935","#8e24aa","#1e88e5","#00897b",
  "#f4511e","#3949ab","#039be5","#43a047"
];

function obtenerIniciales(nombre) {
  if (!nombre) return "?";
  const partes = nombre.trim().split(" ");
  if (partes.length >= 2) {
    return (partes[0][0] + partes[1][0]).toUpperCase();
  }
  return partes[0][0].toUpperCase();
}

function obtenerColor(nombre) {
  if (!nombre) return colores[0];
  let suma = 0;
  for (let i = 0; i < nombre.length; i++) suma += nombre.charCodeAt(i);
  return colores[suma % colores.length];
}

function crearAvatarSVG(iniciales, color) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="20" fill="${color}"/>
      <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle"
        font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="#fff">
        ${iniciales}
      </text>
    </svg>`;
  return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
}

function actualizarAvatar(nombre) {
  const iniciales = obtenerIniciales(nombre);
  const color = obtenerColor(nombre);
  const src = crearAvatarSVG(iniciales, color);
  if (avatarBtn) avatarBtn.src = src;

  // También actualizar la foto en el menú header
  const menuPhoto = document.getElementById("menuPhoto");
  if (menuPhoto) menuPhoto.src = src;
}

// Detectar sesión
onAuthStateChanged(auth, (user) => {
  if (user) {
    if (loginBtn) loginBtn.style.display = "none";
    if (userAvatar) userAvatar.style.display = "block";

    const nombre = user.displayName || user.email?.split("@")[0] || "Usuario";

    // Si tiene foto de Google la usamos, si no usamos iniciales
    if (user.photoURL) {
      if (avatarBtn) avatarBtn.src = user.photoURL;
      const menuPhoto = document.getElementById("menuPhoto");
      if (menuPhoto) menuPhoto.src = user.photoURL;
    } else {
      actualizarAvatar(nombre);
    }

    if (userName) userName.textContent = nombre;
    if (userEmail) userEmail.textContent = user.email;

    // Solo mostrar edición si inició con correo
    const esCorreo = user.providerData.some(p => p.providerId === "password");
    if (editSection && esCorreo) {
      editSection.classList.add("visible");
      if (inputName) inputName.placeholder = nombre;
    }

  } else {
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (userAvatar) userAvatar.style.display = "none";
    if (userMenu) userMenu.style.display = "none";
  }
});

// Abrir/cerrar menú
avatarBtn?.addEventListener("click", () => {
  if (userMenu) {
    userMenu.style.display = userMenu.style.display === "block" ? "none" : "block";
  }
});

// Cerrar al hacer clic fuera
document.addEventListener("click", (e) => {
  if (userMenu && !userMenu.contains(e.target) && e.target !== avatarBtn) {
    userMenu.style.display = "none";
  }
});

// Guardar nombre
saveBtn?.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const nuevoNombre = inputName?.value.trim();

  if (!nuevoNombre) {
    mostrarMsg("Escribe tu nuevo nombre.", "#f87171");
    return;
  }

  saveBtn.textContent = "Guardando...";
  saveBtn.disabled = true;

  try {
    await updateProfile(user, { displayName: nuevoNombre });

    if (userName) userName.textContent = nuevoNombre;
    if (inputName) inputName.placeholder = nuevoNombre;
    if (inputName) inputName.value = "";

    // Actualizar avatar con nuevo nombre si no tiene foto de Google
    if (!user.photoURL) actualizarAvatar(nuevoNombre);

    mostrarMsg("¡Nombre actualizado!", "#34d399");

  } catch (error) {
    mostrarMsg("Error al guardar. Intenta de nuevo.", "#f87171");
  } finally {
    saveBtn.textContent = "Guardar cambios";
    saveBtn.disabled = false;
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

function mostrarMsg(texto, color) {
  if (!saveMsg) return;
  saveMsg.textContent = texto;
  saveMsg.style.color = color;
  saveMsg.style.display = "block";
  setTimeout(() => saveMsg.style.display = "none", 3000);
}