import { auth } from "./firebase-config.js";


import {

    onAuthStateChanged,
    signOut

}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";




// VALIDAR SESIÓN

onAuthStateChanged(

    auth,

    (user)=>{


        if(!user){

            window.location.href =
            "login.html";

            return;

        }



        const userName =

        document.getElementById(
            "userName"
        );



        if(userName){

            userName.textContent =

                user.displayName ||

                user.email;

        }


    }

);





// CERRAR SESIÓN

const logoutBtn =

document.getElementById(
    "logoutBtn"
);



if(logoutBtn){

    logoutBtn.addEventListener(

        "click",

        async()=>{

            await signOut(
                auth
            );


            window.location.href =
            "login.html";

        }

    );

}