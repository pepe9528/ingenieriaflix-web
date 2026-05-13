import { auth } from "./firebase-config.js";

import {

    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup

}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



const provider =
new GoogleAuthProvider();





// LOGIN CON CORREO

document
.getElementById("loginBtn")

.addEventListener(

"click",

async()=>{

    try{

        const email =

        document.getElementById(
            "email"
        ).value;



        const password =

        document.getElementById(
            "password"
        ).value;



        await signInWithEmailAndPassword(

            auth,
            email,
            password

        );



        window.location.replace(
            "../index.html"
        );


    }

    catch(error){

        alert(
            error.code
        );

    }

});







// LOGIN GOOGLE

document
.getElementById("googleBtn")

.addEventListener(

"click",

async()=>{

    try{


        await signInWithPopup(

            auth,
            provider

        );



        window.location.replace(
            "../index.html"
        );


    }

    catch(error){

        alert(

            "Google Error: " +

            error.code

        );

    }

});