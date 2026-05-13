import { auth } from "./firebase-config.js";

import {

    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup

}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



const provider =
new GoogleAuthProvider();



// LOGIN CORREO

document
.getElementById("loginBtn")

.addEventListener(
"click",

async()=>{

    try{

        const email =
        document.getElementById("email").value;

        const password =
        document.getElementById("password").value;


        const userCredential =

        await signInWithEmailAndPassword(

            auth,
            email,
            password

        );


        console.log(
            "Login exitoso:",
            userCredential.user
        );


        alert("Bienvenido");


        window.location.href =
        "../index.html";

    }


    catch(error){

        console.error(error);

        alert(
            "Error: " +
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

        console.log(
            "Intentando Google..."
        );


        const result =

        await signInWithPopup(

            auth,
            provider

        );


        console.log(
            "Usuario:",
            result.user
        );


        alert(

            "Bienvenido " +

            result.user.displayName

        );


        window.location.href =
        "dashboard.html";

    }


    catch(error){

        console.error(error);


        alert(

            "Google Error: " +

            error.code

        );

    }

});