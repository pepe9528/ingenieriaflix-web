/**
 * MATH SOCCER CHAMPIONS - Motor del Videojuego
 * Pure JavaScript Vanilla (Sin Dependencias)
 */

// --- MOTOR DE AUDIO SINTETIZADO NATIVO (Web Audio API) ---
const soundEngine = {
    ctx: null,
    muted: false,
    init() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); },
    play(type) {
        if (this.muted) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain); gain.connect(this.ctx.destination);
        const now = this.ctx.currentTime;

        if (type === 'kick') {
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
            gain.gain.setValueAtTime(0.3, now);
            osc.start(now); osc.stop(now + 0.15);
        } else if (type === 'goal') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.linearRampToValueAtTime(600, now + 0.4);
            gain.gain.setValueAtTime(0.2, now);
            osc.start(now); osc.stop(now + 0.4);
        } else if (type === 'whistle') {
            osc.frequency.setValueAtTime(1000, now);
            osc.frequency.setValueAtTime(1200, now + 0.1);
            gain.gain.setValueAtTime(0.15, now);
            osc.start(now); osc.stop(now + 0.25);
        } else if (type === 'fail') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(120, now);
            osc.frequency.linearRampToValueAtTime(60, now + 0.3);
            gain.gain.setValueAtTime(0.2, now);
            osc.start(now); osc.stop(now + 0.3);
        }
    },
    toggleMute() { this.muted = !this.muted; return this.muted; }
};

// --- BASE DE DATOS Y ESTADO LOCAL (LocalStorage) ---
let state = {
    level: 1, xp: 0, coins: 50,
    clubName: "Math FC", unlockedKits: ["kit-classic"],
    stats: { goles: 0, wins: 0 },
    leaderboard: [
        { team: "Calculus United", points: 12 },
        { team: "Algebra City", points: 9 }
    ],
    lastDailyClaim: null
};

function loadGame() {
    const data = localStorage.getItem('mathsoccer_save');
    if (data) {
        try { state = { ...state, ...JSON.parse(data) }; } catch (e) { console.log(e); }
    }
    saveGame();
}
function saveGame() { localStorage.setItem('mathsoccer_save', JSON.stringify(state)); }

// --- GENERADOR AVANZADO DE MATEMÁTICAS ADAPTATIVAS ---
function generateMathProblem(lvl) {
    const pool = ['+', '-'];
    if (lvl > 2) pool.push('*');
    if (lvl > 4) pool.push('/', 'sequence');
    if (lvl > 6) pool.push('pct', 'equation');

    const mode = pool[Math.floor(Math.random() * pool.length)];
    let a, b, text, ans;

    switch(mode) {
        case '+':
            a = Math.floor(Math.random() * (12 * lvl)) + 4;
            b = Math.floor(Math.random() * (12 * lvl)) + 4;
            text = `${a} + ${b}`; ans = a + b; break;
        case '-':
            a = Math.floor(Math.random() * (15 * lvl)) + 10;
            b = Math.floor(Math.random() * a);
            text = `${a} - ${b}`; ans = a - b; break;
        case '*':
            a = Math.floor(Math.random() * 8) + 2;
            b = Math.floor(Math.random() * 9) + 2;
            text = `${a} × ${b}`; ans = a * b; break;
        case '/':
            b = Math.floor(Math.random() * 8) + 2;
            ans = Math.floor(Math.random() * 10) + 1;
            a = b * ans;
            text = `${a} ÷ ${b}`; break;
        case 'sequence':
            a = Math.floor(Math.random() * 5) + 1;
            let step = Math.floor(Math.random() * 4) + 2;
            text = `${a}, ${a+step}, ${a+step*2}, ?`; ans = a + step * 3; break;
        case 'pct':
            let base = 100;
            let pcts = [10, 25, 50, 75];
            let p = pcts[Math.floor(Math.random() * pcts.length)];
            text = `${p}% de 200`; ans = (p / 100) * 200; break;
        case 'equation':
            a = Math.floor(Math.random() * 4) + 2;
            ans = Math.floor(Math.random() * 8) + 1;
            let res = a * ans;
            text = `${a}x = ${res} | x=?`; break;
    }

    const opts = new Set([ans]);
    while (opts.size < 4) {
        let variance = Math.floor(Math.random() * 10) + 1;
        opts.add(ans + (Math.random() > 0.5 ? variance : -variance));
    }
    return { text, ans, choices: Array.from(opts).sort(() => Math.random() - 0.5) };
}

// --- SIMULADOR DE CAMPO DE FÚTBOL (Gráficos Canvas 2D) ---
const pitchSim = {
    canvas: null, ctx: null,
    ballX: 50, targetX: 50, // Porcentajes del campo
    players: [],
    init() {
        this.canvas = document.getElementById('pitchCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    },
    resize() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
    },
    moveBall(direction) {
        // Avance o retroceso del balón según la precisión matemática
        if(direction === 'forward') this.targetX = Math.min(this.targetX + 18, 92);
        else this.targetX = Math.max(this.targetX - 15, 8);
    },
    resetBall() { this.ballX = 50; this.targetX = 50; },
    updateAndRender() {
        if (!this.ctx) return;
        let ctx = this.ctx; let w = this.canvas.width; let h = this.canvas.height;
        
        // Suavizado físico de posición de la pelota
        this.ballX += (this.targetX - this.ballX) * 0.1;

        // Dibujar Césped Deportivo
        ctx.fillStyle = '#226333'; ctx.fillRect(0,0,w,h);
        ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 3;
        // Líneas de juego
        ctx.strokeRect(5, 5, w-10, h-10);
        ctx.beginPath(); ctx.moveTo(w/2, 5); ctx.lineTo(w/2, h-5); ctx.stroke();
        ctx.beginPath(); ctx.arc(w/2, h/2, 35, 0, Math.PI*2); ctx.stroke();

        // Áreas de Portería
        ctx.strokeRect(5, h/2 - 40, 30, 80);
        ctx.strokeRect(w - 35, h/2 - 40, 30, 80);

        // Renderizar Jugadores Estilo FIFA Mini Radar
        ctx.fillStyle = '#00f3ff'; ctx.beginPath(); ctx.arc(this.ballX - 25, h/2 - 20, 8, 0, Math.PI*2); ctx.fill(); // Mi jugador
        ctx.fillStyle = '#ff0055'; ctx.beginPath(); ctx.arc(this.ballX + 25, h/2 + 20, 8, 0, Math.PI*2); ctx.fill(); // Rival

        // Dibujar Balón de Fútbol Inteligente
        ctx.fillStyle = '#ffffff'; ctx.shadowBlur = 10; ctx.shadowColor = '#fff';
        ctx.beginPath(); ctx.arc((this.ballX/100)*w, h/2, 6, 0, Math.PI*2); ctx.fill();
        ctx.shadowBlur = 0; // Reset
    }
};

// --- MOTOR CONTROLADOR DEL PARTIDO EN TIEMPO REAL ---
const soccerGame = {
    mode: 'quick', matchTimer: null, matchTimeSecs: 0,
    currentQuestion: null, stamina: 100, scoreHome: 0, scoreAway: 0,
    isActionLocked: false, clime: 'DÍA',

    selectMode(mode) {
        soundEngine.play('whistle');
        this.mode = mode;
        this.clime = Math.random() > 0.5 ? 'NOCHE' : 'DÍA';
        document.body.className = this.clime === 'NOCHE' ? 'stadium-night' : 'stadium-day';
        
        ui.changeScreen('game-screen');
        pitchSim.init();
        this.startMatch();
    },
    startMatch() {
        this.scoreHome = 0; this.scoreAway = 0; this.matchTimeSecs = 0; this.stamina = 100;
        pitchSim.resetBall();
        ui.updateScoreboard(0, 0, "00:00", this.clime);
        this.askNewProblem();
        
        clearInterval(this.matchTimer);
        this.matchTimer = setInterval(() => {
            this.matchTimeSecs += 2; // El tiempo avanza rápido en modo arcade
            let mins = String(Math.floor(this.matchTimeSecs / 60)).padStart(2, '0');
            let secs = String(this.matchTimeSecs % 60).padStart(2, '0');
            ui.updateScoreboard(this.scoreHome, this.scoreAway, `${mins}:${secs}`, this.clime);

            // Ataque automático de la IA rival si te retrasas o te quedas sin resistencia
            if(Math.random() > 0.88 && pitchSim.targetX > 10) {
                pitchSim.moveBall('backward');
                ui.narrate("⚠️ ¡La IA rival presiona y gana metros!");
            }

            // Comprobar zonas de peligro y disparos a puerta automáticos
            if(pitchSim.ballX >= 90) this.triggerShootPhase('home');
            if(pitchSim.ballX <= 10) this.triggerShootPhase('away');

            if(this.matchTimeSecs >= 90) this.endMatch();
        }, 1000);
    },
    askNewProblem() {
        this.isActionLocked = false;
        this.currentQuestion = generateMathProblem(state.level);
        ui.renderQuestion(this.currentQuestion);
    },
    processAnswer(chosenOption) {
        if(this.isActionLocked) return;
        this.isActionLocked = true;

        if (chosenOption === this.currentQuestion.ans) {
            soundEngine.play('kick');
            pitchSim.moveBall('forward');
            this.stamina = Math.min(this.stamina + 8, 100);
            ui.narrate("⚽ ¡Gran pase! El equipo avanza al área rival.");
            
            // Recompensas RPG de experiencia por acierto
            state.xp += 5;
            if(state.xp >= state.level * 50) { state.level++; state.xp=0; ui.narrate("⭐ ¡Tu mánager subió de NIVEL!"); }
        } else {
            soundEngine.play('fail');
            pitchSim.moveBall('backward');
            this.stamina = Math.max(this.stamina - 15, 0);
            ui.narrate("💥 ¡Error táctico! Interceptan el balón.");
        }
        ui.setStamina(this.stamina);
        saveGame();
        
        setTimeout(() => this.askNewProblem(), 800);
    },
    triggerShootPhase(attacker) {
        clearInterval(this.matchTimer);
        if(attacker === 'home') {
            soundEngine.play('goal');
            this.scoreHome++;
            state.stats.goles++;
            ui.narrate("🎉 ¡GOOOOL DE MATH FC! ¡Definición magistral!");
        } else {
            soundEngine.play('fail');
            this.scoreAway++;
            ui.narrate("🧤 ¡Gol de la CPU! El portero no pudo contener el disparo.");
        }
        pitchSim.resetBall();
        setTimeout(() => this.startMatch(), 2500); // Reanudación tras gol
    },
    useCard(type) {
        soundEngine.play('kick');
        if(type === 'slow') { ui.narrate("✨ Carta usada: Ritmo del partido ralentizado."); pitchSim.targetX += 10; }
        if(type === 'shoot') { this.triggerShootPhase('home'); }
        if(type === 'steal') { pitchSim.targetX = 50; ui.narrate("🛡️ ¡Robo de balón inmediato en el mediocampo!"); }
    },
    endMatch() {
        clearInterval(this.matchTimer);
        let win = this.scoreHome > this.scoreAway;
        if(win) { state.stats.wins++; state.coins += 25; }
        saveGame();
        alert(`FIN DEL PARTIDO\nResultado Final: Math FC ${this.scoreHome} - ${this.scoreAway} CPU\nRecompensa de partido otorgada.`);
        ui.changeScreen('menu-screen');
        ui.updateMenuProfile();
    }
};

// --- INTERFAZ GRÁFICA DE USUARIO (DOM) ---
const ui = {
    changeScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    },
    updateMenuProfile() {
        document.getElementById('user-level').innerText = state.level;
        document.getElementById('user-xp').innerText = state.xp;
        document.getElementById('user-coins').innerText = state.coins;
        document.querySelectorAll('.coins-display').forEach(e => e.innerText = state.coins);
    },
    updateScoreboard(home, away, timeStr, clime) {
        document.getElementById('score-home').innerText = home;
        document.getElementById('score-away').innerText = away;
        document.getElementById('hud-match-time').innerText = timeStr;
        document.getElementById('hud-clime').innerText = `☁️ ${clime}`;
    },
    setStamina(pct) { document.getElementById('stamina-fill').style.width = `${pct}%`; },
    narrate(msg) { document.getElementById('commentary-box').innerText = msg; },
    renderQuestion(q) {
        document.getElementById('math-question').innerHTML = q.text;
        const grid = document.getElementById('math-options');
        grid.innerHTML = '';
        q.choices.forEach(c => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = c;
            btn.onclick = () => soccerGame.processAnswer(c);
            grid.appendChild(btn);
        });
    },
    openModal(id) {
        if(id === 'stats-modal') {
            document.getElementById('stat-goles').innerText = state.stats.goles;
            document.getElementById('stat-wins').innerText = state.stats.wins;
            let board = document.getElementById('leaderboard-ui'); board.innerHTML='';
            state.leaderboard.forEach(l => board.innerHTML += `<li>${l.team} - ${l.points} PTS</li>`);
        }
        if(id === 'rewards-modal') rewards.render();
        document.getElementById(id).style.display = 'flex';
    },
    closeModals() {
        document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
        this.updateMenuProfile();
    }
};

// --- TIENDA Y LOGROS ---
const shop = {
    buyKit(id, cost) {
        if(state.coins >= cost && !state.unlockedKits.includes(id)) {
            state.coins -= cost; state.unlockedKits.push(id); saveGame();
            alert("¡Equipación oficial añadida al inventario del Club!");
        } else { alert("Monedas insuficientes o artículo ya adquirido."); }
    }
};

const rewards = {
    claim() {
        state.coins += 30; saveGame(); ui.updateMenuProfile();
        document.getElementById('btn-daily').disabled = true;
        alert("¡Patrocinio diario cobrado con éxito! 🪙");
    },
    render() {
        const box = document.getElementById('achievements-box');
        box.innerHTML = `<div class="item-row">🏆 Goleador Máximo: ${state.stats.goles >= 10 ? 'COMPLETADO' : 'Progreso: ' + state.stats.goles + '/10'}</div>`;
    }
};

// Loop de renderizado del Canvas para mantener FPS estables
function gameLoop() {
    pitchSim.updateAndRender();
    requestAnimationFrame(gameLoop);
}

window.onload = () => {
    loadGame();
    ui.updateMenuProfile();
    requestAnimationFrame(gameLoop);
};