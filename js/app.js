// FUNCION MENU
function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    sidebar.classList.toggle("active");
    if (overlay) overlay.classList.toggle("active");
}

// Cerrar sidebar al tocar fuera
document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("sidebarOverlay");
    if (overlay) {
        overlay.addEventListener("click", () => {
            document.getElementById("sidebar").classList.remove("active");
            overlay.classList.remove("active");
        });
    }

    // PAUSAR VIDEOS AL REPRODUCIR OTRO
    const iframes = document.querySelectorAll(".video-container iframe");
    iframes.forEach(iframe => {
        iframe.addEventListener("click", () => {
            iframes.forEach(other => {
                if (other !== iframe) {
                    const src = other.src;
                    other.src = "";
                    other.src = src;
                }
            });
        });
    });

    // BUSCADOR
    iniciarBuscador();
});

// ── BUSCADOR ──
const cursos = [
    // Matemáticas
    { nombre: "Álgebra", desc: "Ecuaciones, polinomios y factorización", categoria: "Matemáticas", url: "/contenido/matematicas/algebra.html", icono: "fa-square-root-variable" },
    { nombre: "Cálculo", desc: "Límites, derivadas e integrales", categoria: "Matemáticas", url: "/contenido/matematicas/calculo.html", icono: "fa-infinity" },
    { nombre: "Ecuaciones de Primer Grado", desc: "Polinomios y trigonometría", categoria: "Matemáticas", url: "/contenido/matematicas/ecuaciones_1.html", icono: "fa-equals" },
    { nombre: "Geometría", desc: "Figuras, áreas, volúmenes y geometría analítica", categoria: "Matemáticas", url: "/contenido/matematicas/geometria.html", icono: "fa-draw-polygon" },

    // Programación
    { nombre: "HTML y CSS", desc: "Crea páginas web desde cero", categoria: "Programación", url: "/contenido/programacion/html_css.html", icono: "fa-code" },
    { nombre: "JavaScript", desc: "Programación web interactiva", categoria: "Programación", url: "/contenido/programacion/javaScrip.html", icono: "fab fa-js" },
    { nombre: "Java", desc: "Programación orientada a objetos", categoria: "Programación", url: "/contenido/programacion/java.html", icono: "fab fa-java" },
    { nombre: "Python", desc: "El lenguaje más popular del mundo", categoria: "Programación", url: "/contenido/programacion/python.html", icono: "fab fa-python" },

    // Electrónica
    { nombre: "Circuitos Eléctricos", desc: "Ley de Ohm, Kirchhoff y más", categoria: "Electrónica", url: "/contenido/electronica/CIRCUITOS.HTML", icono: "fa-bolt" },
    { nombre: "Componentes Electrónicos", desc: "Resistencias, diodos, transistores", categoria: "Electrónica", url: "/contenido/electronica/componentes.html", icono: "fa-microchip" },
    { nombre: "Electrónica Digital", desc: "Compuertas lógicas y circuitos digitales", categoria: "Electrónica", url: "/contenido/electronica/electronica.html", icono: "fa-memory" },
    { nombre: "Electrónica de Potencia", desc: "Rectificadores, inversores y convertidores", categoria: "Electrónica", url: "/contenido/electronica/potensia.html", icono: "fa-plug" },

    // Estadística
    { nombre: "Análisis de Datos", desc: "Python, Excel y visualización", categoria: "Estadística", url: "/contenido/estadistica/analisis-datos.html", icono: "fa-chart-bar" },
    { nombre: "Estadística Avanzada", desc: "Inferencia y pruebas de hipótesis", categoria: "Estadística", url: "/contenido/estadistica/estadisticaAvanzada.html", icono: "fa-chart-line" },
    { nombre: "Estadística Básica", desc: "Media, mediana, moda y más", categoria: "Estadística", url: "/contenido/estadistica/estadisticaBasica.html", icono: "fa-chart-simple" },
    { nombre: "Probabilidad", desc: "Distribuciones y probabilidad avanzada", categoria: "Estadística", url: "/contenido/estadistica/probabilidad.html", icono: "fa-dice" },
];

function iniciarBuscador() {
    // Crear elementos del buscador
    const searchHTML = `
        <div id="searchOverlay" class="search-overlay">
            <div class="search-box">
                <div class="search-input-wrap">
                    <i class="fas fa-search search-icon-input"></i>
                    <input type="text" id="searchInput" placeholder="Buscar cursos..." autocomplete="off">
                    <button class="search-close-btn" id="closeSearch">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="search-results" id="searchResults"></div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", searchHTML);

    // Agregar estilos del buscador
    const style = document.createElement("style");
    style.textContent = `
        /* LUPA EN NAVBAR */
        .search-btn {
            background: none;
            border: none;
            color: rgba(255,255,255,0.7);
            font-size: 1.3rem;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .search-btn:hover {
            color: #fff;
            background: rgba(255,255,255,0.08);
        }

        /* OVERLAY DE BÚSQUEDA */
        .search-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.85);
            z-index: 9999;
            backdrop-filter: blur(8px);
            animation: fadeInSearch 0.2s ease;
        }
        .search-overlay.active {
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding-top: 80px;
        }
        @keyframes fadeInSearch {
            from { opacity: 0; }
            to   { opacity: 1; }
        }

        .search-box {
            width: 100%;
            max-width: 620px;
            padding: 0 20px;
        }

        .search-input-wrap {
            display: flex;
            align-items: center;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 16px;
            padding: 14px 18px;
            gap: 12px;
            transition: border-color 0.2s;
        }
        .search-input-wrap:focus-within {
            border-color: red;
        }

        .search-icon-input {
            color: #555;
            font-size: 1rem;
            flex-shrink: 0;
        }

        #searchInput {
            flex: 1;
            background: none;
            border: none;
            outline: none;
            color: #fff;
            font-size: 1.1rem;
            font-family: Arial, sans-serif;
        }
        #searchInput::placeholder { color: #444; }

        .search-close-btn {
            background: none;
            border: none;
            color: #555;
            font-size: 1rem;
            cursor: pointer;
            padding: 4px;
            border-radius: 6px;
            transition: color 0.2s;
            flex-shrink: 0;
        }
        .search-close-btn:hover { color: #fff; }

        /* RESULTADOS */
        .search-results {
            background: #111;
            border: 1px solid #222;
            border-radius: 14px;
            margin-top: 10px;
            overflow: hidden;
            max-height: 420px;
            overflow-y: auto;
        }

        .search-result-item {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 14px 18px;
            text-decoration: none;
            color: inherit;
            border-bottom: 1px solid #1a1a1a;
            transition: background 0.15s;
        }
        .search-result-item:last-child { border-bottom: none; }
        .search-result-item:hover {
            background: #1a1a1a;
            color: inherit;
        }

        .result-icon {
            width: 40px;
            height: 40px;
            background: rgba(255,0,0,0.1);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: red;
            font-size: 1rem;
            flex-shrink: 0;
        }

        .result-info h4 {
            font-size: 0.95rem;
            font-weight: 600;
            color: #fff;
            margin-bottom: 2px;
        }
        .result-info p {
            font-size: 0.78rem;
            color: #555;
        }
        .result-tag {
            margin-left: auto;
            font-size: 0.7rem;
            color: #444;
            background: #1a1a1a;
            padding: 3px 10px;
            border-radius: 20px;
            border: 1px solid #222;
            flex-shrink: 0;
        }

        .search-empty {
            padding: 30px;
            text-align: center;
            color: #444;
            font-size: 0.9rem;
        }

        .search-hint {
            padding: 16px 18px;
            color: #333;
            font-size: 0.8rem;
            text-align: center;
        }
    `;
    document.head.appendChild(style);

    // Agregar botón lupa a la navbar
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        const lupaBtn = document.createElement("button");
        lupaBtn.className = "search-btn";
        lupaBtn.id = "openSearch";
        lupaBtn.innerHTML = '<i class="fas fa-search"></i>';
        lupaBtn.title = "Buscar cursos";

        // Insertar antes del menu-btn
        const menuBtn = navbar.querySelector(".menu-btn");
        if (menuBtn) {
            navbar.insertBefore(lupaBtn, menuBtn);
        } else {
            navbar.appendChild(lupaBtn);
        }
    }

    // Eventos
    document.getElementById("openSearch")?.addEventListener("click", abrirBuscador);
    document.getElementById("closeSearch")?.addEventListener("click", cerrarBuscador);
    document.getElementById("searchInput")?.addEventListener("input", buscar);
    document.getElementById("searchOverlay")?.addEventListener("click", (e) => {
        if (e.target.id === "searchOverlay") cerrarBuscador();
    });

    // Cerrar con ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") cerrarBuscador();
    });
}

function abrirBuscador() {
    const overlay = document.getElementById("searchOverlay");
    overlay.classList.add("active");
    setTimeout(() => document.getElementById("searchInput")?.focus(), 100);
    document.getElementById("searchResults").innerHTML = `<p class="search-hint">Escribe para buscar cursos...</p>`;
}

function cerrarBuscador() {
    document.getElementById("searchOverlay").classList.remove("active");
    document.getElementById("searchInput").value = "";
    document.getElementById("searchResults").innerHTML = "";
}

function buscar() {
    const query = document.getElementById("searchInput").value.toLowerCase().trim();
    const resultsDiv = document.getElementById("searchResults");

    if (!query) {
        resultsDiv.innerHTML = `<p class="search-hint">Escribe para buscar cursos...</p>`;
        return;
    }

    const resultados = cursos.filter(c =>
        c.nombre.toLowerCase().includes(query) ||
        c.desc.toLowerCase().includes(query) ||
        c.categoria.toLowerCase().includes(query)
    );

    if (resultados.length === 0) {
        resultsDiv.innerHTML = `<p class="search-empty">😕 No encontramos cursos para "<strong>${query}</strong>"</p>`;
        return;
    }

    resultsDiv.innerHTML = resultados.map(c => `
        <a href="${c.url}" class="search-result-item" onclick="cerrarBuscador()">
            <div class="result-icon"><i class="fas ${c.icono}"></i></div>
            <div class="result-info">
                <h4>${c.nombre}</h4>
                <p>${c.desc}</p>
            </div>
            <span class="result-tag">${c.categoria}</span>
        </a>
    `).join("");
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

// FUNCION MOSTRAR VIDEOS
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