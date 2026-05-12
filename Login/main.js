import { loginWithSocial, checkAuthState, logout } from "./auth.js";

const btnGoogle = document.getElementById('btn-google');
const btnFacebook = document.getElementById('btn-facebook');

if(btnGoogle) {
    btnGoogle.onclick = () => loginWithSocial('google')
        .then(() => window.location.href = "index.html");
}

if(btnFacebook) {
    btnFacebook.onclick = () => loginWithSocial('facebook')
        .then(() => window.location.href = "index.html");
}

// Lógica para el Dashboard (index.html)
checkAuthState((user) => {
    const isLoginPage = window.location.pathname.includes("login.html");
    
    if (user) {
        if (isLoginPage) window.location.href = "index.html";
        
        // Mostrar datos en el dashboard
        const userInfo = document.getElementById('user-info');
        if(userInfo) {
            userInfo.innerHTML = `
                <img src="${user.photoURL}" class="profile-pic">
                <span>Hola, ${user.displayName}</span>
                <button id="logout-btn">Cerrar Sesión</button>
            `;
            document.getElementById('logout-btn').onclick = () => logout();
        }
    } else {
        if (!isLoginPage) window.location.href = "login.html";
    }
});