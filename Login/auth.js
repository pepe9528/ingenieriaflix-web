import { signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth, googleProvider, facebookProvider } from "./firebase-config.js";

export const loginWithSocial = async (providerName) => {
    const provider = providerName === 'google' ? googleProvider : facebookProvider;
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error("Error en login:", error.code);
        throw error;
    }
};

export const logout = () => signOut(auth);

export const checkAuthState = (callback) => {
    onAuthStateChanged(auth, callback);
};