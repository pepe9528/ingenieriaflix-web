console.log("index-auth cargado");


import { auth }

from "../Login/js/firebase-config.js";


import {

    onAuthStateChanged,
    signOut

}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";




const loginBtn =
document.getElementById("loginBtn");


const userMenu =
document.getElementById("userMenu");


const userName =
document.getElementById("userName");


const userEmail =
document.getElementById("userEmail");


const logoutBtn =
document.getElementById("logoutBtn");





// IMPORTANTE:
// EN INDEX NO REDIRIGIMOS A LOGIN


onAuthStateChanged(

    auth,

    (user)=>{


        if(user){

            loginBtn.style.display =
            "none";


            userMenu.style.display =
            "block";


            userName.textContent =

                user.displayName ||

                "Usuario";


            userEmail.textContent =

                user.email;

        }


        else{


            loginBtn.style.display =
            "block";


            userMenu.style.display =
            "none";

        }


    }

);





logoutBtn?.addEventListener(

    "click",

    async()=>{


        await signOut(auth);


        window.location.reload();

    }

);