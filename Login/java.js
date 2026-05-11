const passwordInput =
document.getElementById(
    "password"
);


const togglePassword =
document.getElementById(
    "togglePassword"
);


const form =
document.querySelector(
    ".login-form"
);


const message =
document.getElementById(
    "message"
);



/* MOSTRAR / OCULTAR */

togglePassword.onclick = ()=>{


    passwordInput.type =

        passwordInput.type === "password"

        ? "text"

        : "password";

};




/* VALIDAR LOGIN */

form.addEventListener(

    "submit",

    function(e){

        e.preventDefault();


        const email =

        document.querySelector(
            'input[type="email"]'
        ).value;


        const password =
        passwordInput.value;



        if(

            email === "" ||

            password === ""

        ){

            message.innerText =
            "Completa todos los campos";

            return;

        }



        if(password.length < 8){

            message.innerText =
            "La contraseña debe tener mínimo 8 caracteres";

            return;

        }



        message.innerText =
        "Iniciando sesión...";



        // aquí conectarás backend

        setTimeout(()=>{

            window.location.href =
            "dashboard.html";

        },1000);


    }

);