// FUNCION MENU
function toggleMenu() {
    document.getElementById("sidebar").classList.toggle("active");
}

// FUNCIONES APUNTES (index.html)
function guardarTXT() {
    const nota = document.getElementById("nota").value;
    const blob = new Blob([nota], {type:"text/plain;charset=utf-8"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "apunte.txt";
    link.click();
}

function guardarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const nota = document.getElementById("nota").value;
    doc.text(nota, 10, 10);
    doc.save("apunte.pdf");
}

// FUNCION POMODORO (enfoque.html)
let pomodoroInterval;
function pomodoro() {
    clearInterval(pomodoroInterval);
    let minutes = 25;
    let seconds = 0;
    const timer = document.getElementById("timer");

    pomodoroInterval = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(pomodoroInterval);
                timer.innerText = "¡Listo!";
                return;
            } else {
                minutes--;
                seconds = 59;
            }
        } else {
            seconds--;
        }
        timer.innerText = `${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;
    }, 1000);
}

// FUNCION MOSTRAR VIDEOS (cursos.html index.html)
function mostrarVideos(curso) {
    const videosDiv = document.getElementById("videos");
    if (!videosDiv) return;

    let contenido = "";
    if (curso === "python") {
        contenido = "<p>Videos de Python se mostrarán aquí...</p>";
    } else if (curso === "arduino") {
        contenido = "<p>Videos de Arduino se mostrarán aquí...</p>";
    } else if (curso === "asm") {
        contenido = "<p>Videos de ASM se mostrarán aquí...</p>";
    }
    videosDiv.innerHTML = contenido;
}