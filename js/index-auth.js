import { auth } from "./firebase-config.js";


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


        if(user){

            userArea.innerHTML = `

                <a
                    href="dashboard.html"

                    class="btn btn-outline-light">


                    👤

                    ${

                        user.displayName ||

                        user.email

                    }


                </a>

            `;

        }


    }

);