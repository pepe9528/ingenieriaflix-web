/**
 * DATABASE: 10 NIVELES - 20 PREGUNTAS MÍNIMO (Muestra representativa)
 * Nota: Extender este array siguiendo el patrón para completar las 200 preguntas.
 */
const GAME_DB = [
    {
        level: 1,
        category: "HARDWARE & REDES",
        questions: [
            { q: "¿Qué protocolo se usa para asignar IPs automáticamente?", a: ["DNS", "DHCP", "HTTP", "FTP"], c: 1, exp: "El DHCP (Dynamic Host Configuration Protocol) asigna direcciones dinámicas a los dispositivos.", hint: "Usa la 'D' de Dinámico." },
            { q: "¿Cuál es la velocidad base de un puerto Gigabit Ethernet?", a: ["100 Mbps", "10 Gbps", "1000 Mbps", "500 Mbps"], c: 2, exp: "Gigabit equivale a 1000 megabits por segundo.", hint: "Giga = 1000." },
            { q: "¿Qué componente realiza cálculos aritméticos en la CPU?", a: ["ALU", "CU", "RAM", "Cache"], c: 0, exp: "La ALU (Arithmetic Logic Unit) es la encargada de las operaciones matemáticas.", hint: "Aritmética inicia con A." }
        ]
    },
    {
        level: 2,
        category: "PROGRAMACIÓN (JS)",
        questions: [
            { q: "¿Cuál de estos no es un tipo de dato primitivo en JS?", a: ["String", "Boolean", "Object", "Number"], c: 2, exp: "Object es un tipo de dato estructural, no primitivo.", hint: "Los primitivos son simples." }
        ]
    }
];

/**
 * ENGINE STATE
 */
let player = {
    hp: 100,
    shield: 20,
    energy: 50,
    credits: 0,
    score: 0,
    combo: 0,
    level: 0
};

let currentQIdx = 0;
let timerInterval;
let gameActive = false;

// Elementos DOM
const dom = {
    hp: document.getElementById('base-hp'),
    shield: document.getElementById('shield'),
    energy: document.getElementById('energy'),
    credits: document.getElementById('credits'),
    qText: document.getElementById('question-text'),
    options: document.getElementById('options-grid'),
    timerBar: document.getElementById('timer-bar'),
    enemyZone: document.getElementById('enemy-spawn')
};

/**
 * INICIO DEL JUEGO
 */
document.getElementById('btn-play').onclick = () => {
    document.getElementById('screen-start').classList.add('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');
    gameActive = true;
    loadQuestion();
    spawnEnemy();
};

/**
 * SISTEMA DE PREGUNTAS
 */
function loadQuestion() {
    if (!gameActive) return;

    const levelData = GAME_DB[player.level];
    const qData = levelData.questions[currentQIdx];

    dom.qText.textContent = qData.q;
    document.getElementById('level-tag').textContent = `NIVEL ${levelData.level}`;
    document.getElementById('category-tag').textContent = levelData.category;
    
    // Generar opciones
    dom.options.innerHTML = '';
    qData.a.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'btn-neon';
        btn.textContent = opt;
        btn.onclick = () => checkAnswer(i);
        dom.options.appendChild(btn);
    });

    startTimer();
}

function startTimer() {
    let time = 100;
    dom.timerBar.style.width = '100%';
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        time -= 1;
        dom.timerBar.style.width = `${time}%`;
        if (time <= 0) {
            handleError("¡TIEMPO AGOTADO!");
        }
    }, 150); // 15 segundos para responder
}

function checkAnswer(idx) {
    clearInterval(timerInterval);
    const qData = GAME_DB[player.level].questions[currentQIdx];

    if (idx === qData.c) {
        handleSuccess(qData);
    } else {
        handleError("FALLO EN EL CÓDIGO");
    }
}

/**
 * MECÁNICAS DE ATAQUE/DEFENSA
 */
function handleSuccess(data) {
    player.score += 100 + (player.combo * 10);
    player.credits += 20;
    player.energy += 10;
    player.combo++;
    
    // Efecto Visual: Atacar enemigos
    destroyEnemies();
    showFeedback("SISTEMA PROTEGIDO", data.exp, true);
}

function handleError(msg) {
    player.combo = 0;
    if (player.shield > 0) {
        player.shield -= 10;
    } else {
        player.hp -= 15;
    }
    
    updateStats();
    showFeedback(msg, "Error detectado. Los enemigos avanzan.", false);
    
    if (player.hp <= 0) endGame();
}

function showFeedback(title, exp, isCorrect) {
    document.getElementById('quiz-container').classList.add('hidden');
    const screen = document.getElementById('feedback-screen');
    screen.classList.remove('hidden');
    
    document.getElementById('feedback-title').textContent = title;
    document.getElementById('feedback-title').style.color = isCorrect ? 'var(--neon-green)' : 'var(--neon-red)';
    document.getElementById('feedback-explanation').textContent = exp;
}

document.getElementById('btn-continue').onclick = () => {
    document.getElementById('feedback-screen').classList.add('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');
    
    currentQIdx++;
    // Cambio de nivel
    if (currentQIdx >= GAME_DB[player.level].questions.length) {
        player.level++;
        currentQIdx = 0;
        if (player.level >= GAME_DB.length) return endGame(true);
    }
    
    loadQuestion();
    updateStats();
};

/**
 * VISUALES: ENEMIGOS
 */
function spawnEnemy() {
    if (!gameActive) return;
    const enemy = document.createElement('div');
    enemy.className = 'enemy';
    enemy.style.top = Math.random() * 80 + 10 + '%';
    dom.enemyZone.appendChild(enemy);

    // Animación de avance
    setTimeout(() => {
        enemy.style.transform = 'translateX(-80vw)';
    }, 100);

    // Si llega a la base
    setTimeout(() => {
        if (enemy.parentNode) {
            enemy.remove();
            player.hp -= 5;
            updateStats();
        }
    }, 8000);

    setTimeout(spawnEnemy, 4000);
}

function destroyEnemies() {
    const enemies = document.querySelectorAll('.enemy');
    enemies.forEach(e => {
        e.style.background = 'white';
        setTimeout(() => e.remove(), 100);
    });
}

function updateStats() {
    dom.hp.textContent = player.hp;
    dom.shield.textContent = player.shield;
    dom.energy.textContent = player.energy;
    dom.credits.textContent = player.credits;
}

function endGame() {
    gameActive = false;
    showScreen('screen-end');
    document.getElementById('final-score').textContent = player.score;
}

function showScreen(id) {
    const screens = ['screen-start', 'quiz-container', 'feedback-screen', 'screen-end'];
    screens.forEach(s => document.getElementById(s).classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}