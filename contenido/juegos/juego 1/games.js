/**
 * BASE DE DATOS DE PREGUNTAS (10 NIVELES)
 */
const gameData = [
    {
        level: 1,
        questions: [
            { q: "¿Qué significan las siglas RAM?", options: ["Read Access Memory", "Random Access Memory", "Rapid Action Memory", "Real Audio Module"], correct: 1, hint: "Es memoria de acceso aleatorio.", exp: "La RAM permite al procesador acceder a datos de forma inmediata y temporal." },
            { q: "¿Cuál es el lenguaje estándar de la web?", options: ["Python", "Java", "HTML", "C++"], correct: 2, hint: "Usa etiquetas como <body>.", exp: "HTML es el lenguaje de marcado que estructura todo el contenido de Internet." },
            { q: "¿Qué componente enfría el procesador?", options: ["Fuente de poder", "Ventilador/Disipador", "Disco duro", "BIOS"], correct: 1, hint: "Evita que se queme.", exp: "El disipador térmico y el ventilador mantienen la CPU a una temperatura segura." }
            // Agrega más aquí...
        ]
    },
    {
        level: 2,
        questions: [
            { q: "¿Qué significa el protocolo HTTP?", options: ["HyperText Transfer Protocol", "High Tech Transfer Process", "Home Tool Text Port", "Hyperlink Total Text"], correct: 0, hint: "Es para transferir hipertexto.", exp: "HTTP es el protocolo que permite la comunicación entre el navegador y el servidor." }
        ]
    }
];

/**
 * MOTOR DEL JUEGO
 */
let state = {
    currentLevel: 0,
    currentQuestionIdx: 0,
    lives: 3,
    coins: 50,
    score: 0,
    timer: null,
    timeLeft: 15,
    canAnswer: true
};

const screens = {
    home: document.getElementById('screen-home'),
    game: document.getElementById('screen-game'),
    result: document.getElementById('screen-result')
};

// Iniciar Juego
document.getElementById('btn-start').onclick = () => {
    resetState();
    showScreen('game');
    loadQuestion();
};

function resetState() {
    state.currentLevel = 0;
    state.currentQuestionIdx = 0;
    state.lives = 3;
    state.coins = 50;
    state.score = 0;
    updateStatsUI();
}

function showScreen(screenKey) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenKey].classList.add('active');
}

function loadQuestion() {
    state.canAnswer = true;
    state.timeLeft = 15;
    document.getElementById('feedback-area').classList.add('hidden');
    
    const currentLevel = gameData[state.currentLevel];
    const qData = currentLevel.questions[state.currentQuestionIdx];

    // Actualizar UI
    document.getElementById('current-level').textContent = currentLevel.level;
    document.getElementById('q-index').textContent = state.currentQuestionIdx + 1;
    document.getElementById('question-text').textContent = qData.q;
    document.getElementById('timer').textContent = state.timeLeft;

    // Generar botones
    const grid = document.getElementById('answers-grid');
    grid.innerHTML = '';
    qData.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = opt;
        btn.onclick = () => checkAnswer(index);
        grid.appendChild(btn);
    });

    startTimer();
}

function startTimer() {
    clearInterval(state.timer);
    state.timer = setInterval(() => {
        state.timeLeft--;
        document.getElementById('timer').textContent = state.timeLeft;
        if (state.timeLeft <= 0) {
            handleError("¡Se acabó el tiempo!");
        }
    }, 1000);
}

function checkAnswer(selectedIdx) {
    if (!state.canAnswer) return;
    state.canAnswer = false;
    clearInterval(state.timer);

    const qData = gameData[state.currentLevel].questions[state.currentQuestionIdx];
    const buttons = document.querySelectorAll('.answer-btn');

    if (selectedIdx === qData.correct) {
        buttons[selectedIdx].classList.add('correct');
        const bonus = state.timeLeft * 5;
        state.score += 100 + bonus;
        state.coins += 15;
        showFeedback(true, "¡Excelente!", qData.exp);
    } else {
        buttons[selectedIdx].classList.add('wrong');
        buttons[qData.correct].classList.add('correct');
        state.lives--;
        showFeedback(false, "Respuesta incorrecta", qData.exp);
    }

    updateStatsUI();
    if (state.lives <= 0) setTimeout(() => endGame(false), 1500);
}

function showFeedback(isCorrect, title, exp) {
    const area = document.getElementById('feedback-area');
    document.getElementById('feedback-title').textContent = title;
    document.getElementById('feedback-title').style.color = isCorrect ? 'var(--success)' : 'var(--error)';
    document.getElementById('explanation-text').textContent = exp;
    area.classList.remove('hidden');
}

function updateStatsUI() {
    document.getElementById('lives').textContent = state.lives;
    document.getElementById('coins').textContent = state.coins;
    
    // Barra de progreso basada en preguntas del nivel actual
    const totalQ = gameData[state.currentLevel].questions.length;
    const progress = (state.currentQuestionIdx / totalQ) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

document.getElementById('btn-next').onclick = () => {
    state.currentQuestionIdx++;
    const levelData = gameData[state.currentLevel];

    if (state.currentQuestionIdx < levelData.questions.length) {
        loadQuestion();
    } else {
        // Pasar de nivel
        if (state.currentLevel < gameData.length - 1) {
            state.currentLevel++;
            state.currentQuestionIdx = 0;
            alert(`¡Nivel ${state.currentLevel} superado!`);
            loadQuestion();
        } else {
            endGame(true);
        }
    }
};

document.getElementById('btn-hint').onclick = () => {
    if (state.coins >= 10 && state.canAnswer) {
        state.coins -= 10;
        const qData = gameData[state.currentLevel].questions[state.currentQuestionIdx];
        alert(`PISTA: ${qData.hint}`);
        updateStatsUI();
    }
};

function endGame(victory) {
    showScreen('result');
    document.getElementById('result-title').textContent = victory ? "¡Maestro Tecnológico!" : "Sigue Practicando";
    document.getElementById('final-score').textContent = state.score;
    document.getElementById('final-coins').textContent = state.coins;
    document.getElementById('result-icon').className = victory ? "ph ph-trophy-fill" : "ph ph-skull-fill";
}

document.getElementById('btn-restart').onclick = () => showScreen('home');