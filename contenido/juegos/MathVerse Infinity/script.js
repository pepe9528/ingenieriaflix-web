/**
 * MATHVERSE INFINITY - Núcleo de Motor de Juego de Vanguardia
 * JavaScript Vanilla Puro
 */

// --- MOTOR DE AUDIO NATIVO (Sintetizador Web Audio API) ---
const soundManager = {
    ctx: null,
    muted: false,
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },
    play(type) {
        if (this.muted) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        const now = this.ctx.currentTime;
        if (type === 'correct') {
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            osc.start(now); osc.stop(now + 0.25);
        } else if (type === 'wrong') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(80, now + 0.3);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now); osc.stop(now + 0.3);
        } else if (type === 'power') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1500, now + 0.4);
            gain.gain.setValueAtTime(0.1, now);
            osc.start(now); osc.stop(now + 0.4);
        }
    },
    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }
};

// --- BASE DE DATOS LOCAL Y ESTADO DEL JUGADOR ---
let state = {
    level: 1,
    xp: 0,
    gems: 100,
    currentAvatar: '⚛️',
    theme: 'neon-theme',
    unlockedSkins: ['neon-cyan'],
    stats: { games: 0, correct: 0 },
    ranking: [
        {name: "AlphaMath", score: 2500},
        {name: "QuantumUser", score: 1200}
    ],
    claimedDaily: false
};

function loadData() {
    const saved = localStorage.getItem('mathverse_save');
    if (saved) {
        try {
            state = { ...state, ...JSON.parse(saved) };
        } catch(e) { console.error("Error cargando nexo de datos."); }
    }
    saveData();
}

function saveData() {
    localStorage.setItem('mathverse_save', JSON.stringify(state));
}

// --- GENERADOR AVANZADO DE PROBLEMAS MATEMÁTICOS ---
function generateQuestion(lvl) {
    const types = ['basic', 'medium', 'advanced'];
    let type = types[Math.min(Math.floor(lvl / 3), types.length - 1)];
    
    // Lista expandible según nivel
    const operations = ['+', '-'];
    if (lvl > 2) operations.push('*');
    if (lvl > 4) operations.push('/');
    if (lvl > 6) operations.push('pow', 'sqrt');
    if (lvl > 9) operations.push('algebra');

    const op = operations[Math.floor(Math.random() * operations.length)];
    let a, b, qText, answer;

    switch(op) {
        case '+':
            a = Math.floor(Math.random() * (10 * lvl)) + 5;
            b = Math.floor(Math.random() * (10 * lvl)) + 5;
            qText = `${a} + ${b}`;
            answer = a + b;
            break;
        case '-':
            a = Math.floor(Math.random() * (10 * lvl)) + 10;
            b = Math.floor(Math.random() * a);
            qText = `${a} - ${b}`;
            answer = a - b;
            break;
        case '*':
            a = Math.floor(Math.random() * (2 + lvl)) + 2;
            b = Math.floor(Math.random() * 10) + 2;
            qText = `${a} × ${b}`;
            answer = a * b;
            break;
        case '/':
            b = Math.floor(Math.random() * 9) + 2;
            answer = Math.floor(Math.random() * (2 + lvl)) + 2;
            a = b * answer;
            qText = `${a} ÷ ${b}`;
            break;
        case 'pow':
            a = Math.floor(Math.random() * 5) + 2;
            b = Math.min(lvl, 3);
            qText = `${a}<sup>${b}</sup>`;
            answer = Math.pow(a, b);
            break;
        case 'sqrt':
            answer = Math.floor(Math.random() * 10) + 2;
            a = answer * answer;
            qText = `√${a}`;
            break;
        case 'algebra':
            a = Math.floor(Math.random() * 5) + 2;
            answer = Math.floor(Math.random() * 10) + 1;
            b = a * answer;
            qText = `${a}x = ${b}  |  x = ?`;
            break;
    }

    // Generar opciones sin duplicados (Anti-Cheat/Anti-Loop)
    const options = new Set([answer]);
    while(options.size < 4) {
        let offset = Math.floor(Math.random() * 15) + 1;
        if(Math.random() > 0.5) offset *= -1;
        const fake = answer + offset;
        if(fake >= 0) options.add(fake);
    }

    return {
        text: qText,
        ans: answer,
        options: Array.from(options).sort(() => Math.random() - 0.5)
    };
}

// --- CONTROLADOR GLOBAL DEL JUEGO ---
const game = {
    mode: 'classic',
    currentLvl: 1,
    score: 0,
    lives: 3,
    energy: 100,
    combo: 1,
    multiplier: 1,
    activeQuestion: null,
    timer: null,
    timeLeft: 100, // Porcentaje
    timeSpeed: 1.5,
    enemyHp: 100,
    isAntiSpamActive: false,

    selectMode(mode) {
        soundManager.init();
        this.mode = mode;
        ui.changeScreen('game-screen');
        if(mode === 'split') {
            ui.changeScreen('split-screen');
            splitGame.start();
            return;
        }
        this.resetGame();
        this.nextTurn();
    },

    resetGame() {
        this.currentLvl = 1;
        this.score = 0;
        this.lives = this.mode === 'survival' ? 1 : 3;
        this.energy = 100;
        this.combo = 1;
        this.multiplier = 1;
        this.timeSpeed = this.mode === 'timetrial' ? 3.0 : 1.2;
        ui.updateHud();
    },

    nextTurn() {
        this.isAntiSpamActive = false;
        this.timeLeft = 100;
        this.enemyHp = 100;
        
        // Jefes finales dinámicos cada 5 niveles
        if (this.currentLvl % 5 === 0) {
            document.getElementById('enemy-name').innerText = `JEFE: Megamind Guardián [Nivel ${this.currentLvl}]`;
            document.getElementById('enemy-avatar').innerText = `🐉`;
            this.timeSpeed += 0.5;
        } else {
            document.getElementById('enemy-name').innerText = `Espectro de la Dimensión ${this.currentLvl}`;
            document.getElementById('enemy-avatar').innerText = `👾`;
        }

        this.activeQuestion = generateQuestion(this.currentLvl);
        ui.renderQuestion(this.activeQuestion);
        
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.timeLeft -= this.timeSpeed;
            ui.updateTimerBar(this.timeLeft);
            if(this.timeLeft <= 0) {
                this.handleTimeout();
            }
        }, 100);
    },

    handleAnswer(chosen) {
        if (this.isAntiSpamActive) return;
        this.isAntiSpamActive = true; // Prevenir clicks rápidos repetidos

        clearInterval(this.timer);
        if (chosen === this.activeQuestion.ans) {
            soundManager.play('correct');
            this.score += 10 * this.combo * this.multiplier;
            this.combo++;
            state.stats.correct++;
            
            // Recompensa en cristales aleatoria
            if (Math.random() > 0.7) state.gems += 2;

            // Subida de Experiencia RPG
            state.xp += 15;
            if (state.xp >= state.level * 100) {
                state.xp -= state.level * 100;
                state.level++;
                ui.triggerNotification("¡SUBIDA DE NIVEL RPG!");
            }

            this.currentLvl++;
            saveData();
            this.nextTurn();
        } else {
            soundManager.play('wrong');
            this.lives--;
            this.combo = 1;
            if (this.lives <= 0) {
                this.endGame();
            } else {
                ui.updateHud();
                this.nextTurn();
            }
        }
    },

    handleTimeout() {
        clearInterval(this.timer);
        soundManager.play('wrong');
        this.lives--;
        this.combo = 1;
        if(this.lives <= 0) this.endGame();
        else { ui.updateHud(); this.nextTurn(); }
    },

    usePower(type) {
        soundManager.play('power');
        if(type === 'freeze') {
            clearInterval(this.timer);
            ui.triggerNotification("¡Tiempo Congelado!");
        } else if(type === 'double') {
            this.multiplier = 2;
            ui.triggerNotification("¡Puntuación Doble Activa!");
        } else if(type === 'bomb') {
            // Elimina dinámicamente dos botones incorrectos
            const btns = document.querySelectorAll('.option-btn');
            let eliminated = 0;
            btns.forEach(btn => {
                if (parseInt(btn.innerText) !== this.activeQuestion.ans && eliminated < 2) {
                    btn.style.opacity = '0.2';
                    btn.disabled = true;
                    eliminated++;
                }
            });
        }
    },

    endGame() {
        clearInterval(this.timer);
        // Validar e inyectar en Ranking Local
        state.stats.games++;
        state.ranking.push({name: state.currentAvatar + " Player", score: this.score});
        state.ranking.sort((a,b) => b.score - a.score);
        state.ranking = state.ranking.slice(0, 5); // Top 5
        saveData();

        alert(`FIN DE LA PARTIDA\nPuntuación Total: ${this.score}\nLlegaste al Nivel: ${this.currentLvl}`);
        ui.updateMenuData();
        ui.changeScreen('menu-screen');
    }
};

// --- MODO MULTIJUGADOR LOCAL (PANTALLA DIVIDIDA) ---
const splitGame = {
    p1: { score: 0, lives: 3, q: null },
    p2: { score: 0, lives: 3, q: null },
    start() {
        this.p1 = { score: 0, lives: 3, q: generateQuestion(2) };
        this.p2 = { score: 0, lives: 3, q: generateQuestion(2) };
        this.render('p1');
        this.render('p2');
    },
    render(player) {
        const data = this[player];
        document.getElementById(`${player}-score`).innerText = data.score;
        document.getElementById(`${player}-lives`).innerText = data.lives;
        
        const qContainer = document.getElementById(`${player}-question`);
        qContainer.innerHTML = data.q.text;

        const optContainer = document.getElementById(`${player}-options`);
        optContainer.innerHTML = '';
        data.q.options.forEach(opt => {
            const b = document.createElement('button');
            b.className = 'btn';
            b.innerText = opt;
            b.onclick = () => this.answer(player, opt);
            optContainer.appendChild(b);
        });
    },
    answer(player, val) {
        const data = this[player];
        if (val === data.q.ans) {
            data.score += 10;
            soundManager.play('correct');
        } else {
            data.lives--;
            soundManager.play('wrong');
        }

        if (data.lives <= 0) {
            alert(`¡El juego ha terminado! ${player.toUpperCase()} se quedó sin energía espacial.`);
            ui.changeScreen('menu-screen');
            ui.updateMenuData();
            return;
        }

        data.q = generateQuestion(Math.floor(data.score / 20) + 1);
        this.render(player);
    }
};

// --- INTERFAZ DE USUARIO (DOM) ---
const ui = {
    changeScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    },
    updateMenuData() {
        document.getElementById('menu-username').innerText = "Viajero Cúbico";
        document.getElementById('menu-level').innerText = state.level;
        document.getElementById('menu-xp').innerText = state.xp;
        document.getElementById('menu-gems').innerText = state.gems;
        document.getElementById('menu-avatar').innerText = state.currentAvatar;
        document.querySelectorAll('.user-gems-display').forEach(el => el.innerText = state.gems);
    },
    updateHud() {
        document.getElementById('hud-lives').innerText = game.lives;
        document.getElementById('hud-score').innerText = game.score;
        document.getElementById('hud-combo').innerText = game.combo;
        document.getElementById('hud-level-num').innerText = game.currentLvl;
    },
    updateTimerBar(pct) {
        document.getElementById('timer-bar').style.width = `${Math.max(pct, 0)}%`;
    },
    renderQuestion(q) {
        this.updateHud();
        document.getElementById('question-text').innerHTML = q.text;
        const container = document.getElementById('options-container');
        container.innerHTML = '';
        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = opt;
            btn.onclick = () => game.handleAnswer(opt);
            container.appendChild(btn);
        });
    },
    openModal(id) {
        if(id === 'stats-modal') this.renderStats();
        if(id === 'rewards-modal') rewards.render();
        document.getElementById(id).style.display = 'flex';
    },
    closeModals() {
        document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
        this.updateMenuData();
    },
    renderStats() {
        document.getElementById('stat-games').innerText = state.stats.games;
        document.getElementById('stat-correct').innerText = state.stats.correct;
        const list = document.getElementById('ranking-list');
        list.innerHTML = '';
        state.ranking.forEach(r => {
            list.innerHTML += `<li>${r.name}: ${r.score} pts</li>`;
        });
    },
    triggerNotification(msg) {
        const banner = document.getElementById('event-banner');
        banner.innerText = msg;
        banner.classList.remove('hidden-element');
        setTimeout(() => banner.classList.add('hidden-element'), 2500);
    }
};

// --- TIENDA DE SKINS Y ADAPTACIÓN NEÓN ---
const shop = {
    buySkin(id, cost) {
        if (state.gems >= cost && !state.unlockedSkins.includes(id)) {
            state.gems -= cost;
            state.unlockedSkins.push(id);
            if(id.startsWith('avatar-')) {
                state.currentAvatar = id === 'avatar-wizard' ? '🧙‍♂️' : '🤖';
            } else {
                state.theme = id === 'neon-mag' ? 'magenta-theme' : 'neon-theme';
                document.body.className = state.theme;
            }
            saveData();
            ui.updateMenuData();
            alert("¡Adquisición Interdimensional Completada!");
        } else if (state.unlockedSkins.includes(id)) {
            // Equipar si ya está comprado
            if(id.startsWith('avatar-')) {
                state.currentAvatar = id === 'avatar-wizard' ? '🧙‍♂️' : '🤖';
            } else {
                state.theme = id === 'neon-mag' ? 'magenta-theme' : 'neon-theme';
                document.body.className = state.theme;
            }
            saveData();
            ui.updateMenuData();
            alert("Skin Espacial Equipada.");
        } else {
            alert("Fragmentos de energía (Gemas) insuficientes.");
        }
    }
};

// --- PREMIOS DIARIOS Y LOGROS ---
const rewards = {
    claimDaily() {
        if (!state.claimedDaily) {
            state.gems += 25;
            state.claimedDaily = true;
            saveData();
            ui.updateMenuData();
            document.getElementById('daily-claim-btn').disabled = true;
            alert("¡Recompensa de Órbita Diaria Asignada! (+25 💎)");
        }
    },
    render() {
        const list = document.getElementById('achievements-list');
        list.innerHTML = '';
        const achievements = [
            { name: "Iniciación Euclidiana", desc: "Responde 1 respuesta correcta", done: state.stats.correct >= 1 },
            { name: "Pitágoras Supremo", desc: "Responde 50 respuestas correctas", done: state.stats.correct >= 50 }
        ];
        achievements.forEach(a => {
            list.innerHTML += `<div class="achievement-item" style="border-left: 4px solid ${a.done ? 'var(--neon-green)' : '#ff0055'}">
                <strong>${a.name}</strong><br><small>${a.desc} ${a.done ? '✅' : '❌'}</small>
            </div>`;
        });
    }
};

// --- SISTEMA DE PARTÍCULAS FX (Canvas Ultra Optimizado) ---
function initStars() {
    const container = document.getElementById('stars-container');
    // Crear estrellas estáticas de fondo vía SVG CSS de alta velocidad sin sobrecargar el DOM
    let svgStars = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">`;
    for (let i = 0; i < 60; i++) {
        let cx = Math.random() * 100;
        let cy = Math.random() * 100;
        let r = Math.random() * 0.4 + 0.1;
        svgStars += `<circle cx="${cx}%" cy="${cy}%" r="${r}" fill="#fff" opacity="${Math.random()}"/>`;
    }
    svgStars += `</svg>`;
    container.style.backgroundImage = `url("data:image/svg+xml;utf8,${encodeURIComponent(svgStars)}")`;
}

// Inicialización automática al arrancar la ventana espacial
window.onload = () => {
    loadData();
    initStars();
    ui.updateMenuData();
};