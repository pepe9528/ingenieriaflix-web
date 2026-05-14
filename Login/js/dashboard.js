import { auth } from "/Login/js/firebase-config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const userName = document.getElementById("userName");

// Detectar sesión
onAuthStateChanged(auth, (user) => {
  if (user) {
    if (userName) {
      userName.textContent = user.displayName || user.email;
    }
  } else {
    // ❌ antes redirigía al login
    // ✅ ahora solo muestra mensaje o botón
    console.log("No hay sesión, mostrar botón de login en el header");
  }
});
