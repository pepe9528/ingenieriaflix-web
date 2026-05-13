import { auth } from "./Login/js/firebase-config.js";


import {

    onAuthStateChanged

}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";




const userArea =

document.getElementById(
    "userArea"
);





onAuthStateChanged(

    auth,

    (user)=>{


        console.log(
            "Usuario:",
            user
        );



        if(user){

            userArea.innerHTML = `

                <a
                    href="./Login/configuracion.html"

                    class="login-btn">


                    👤

                    ${

                        user.displayName ||

                        user.email

                    }


                </a>

            `;

        }


        else{

            userArea.innerHTML = `

                <a
                    href="./Login/login.html"

                    class="login-btn">

                    Iniciar sesión

                </a>

            `;

        }


    }

);