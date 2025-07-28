const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        stage: document.querySelector(".menu h3"),
        life: document.querySelector(".menu-lives h2"),
        screen: document.querySelector(".game-screen")
    },
    values: {
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 30,
        pointsToNextLevel: 20,
        life: 3,
        stage: 1,
        points: 0
    },
    actions: {
        timerId: null,
        countDownTimerId: null,
    }
};

function finalScreen(msg1, msg2, buttonText, action, icon = "play") {
    const screen = `
        <h2>${msg1}</h2>
        <p>${msg2}</p>
        <button onclick="${action}()">${buttonText} <i class="fa-solid fa-${icon}"></i></button>
    `;

    state.view.screen.innerHTML = screen;
    state.view.screen.classList.remove("hidden");
}

function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if (state.values.currentTime <= 0 && state.values.life === 1) {
        clearInterval(state.actions.timerId);
        clearInterval(state.actions.countDownTimerId);
        finalScreen("Game Over!", "O seu resultado é: " + state.values.result, "Novo Jogo", "gameOver");

    } else if (state.values.currentTime <= 0 && state.values.points < state.values.pointsToNextLevel) {
        clearInterval(state.actions.timerId);
        clearInterval(state.actions.countDownTimerId);

        finalScreen("Você perdeu uma vida!", "Tente novamente!", "Jogar novamente", "continueLevel", "arrow-rotate-left");

    } else if (state.values.currentTime <= 0 && state.values.points >= state.values.pointsToNextLevel) {
        clearInterval(state.actions.timerId);
        clearInterval(state.actions.countDownTimerId);

        finalScreen("Parabéns!", "Você concluiu este nível!", "Próximo Level", "nextLevel", "forward");
        
    }
}

function playSound(audioName) {
    let audio = new Audio(`./src/audios/${audioName}.m4a`);
    audio.volume = 0.2;
    audio.play();
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if (square.id === state.values.hitPosition) {
                state.values.result++;
                state.values.points++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound("hit");
            }
        })
    });
}

function initialize() {
    state.values.gameVelocity = 1000;
    state.values.result = 0;
    state.values.currentTime = 30;
    state.values.life = 3;
    state.values.stage = 1;
    state.values.points = 0;

    state.view.score.textContent = 0;
    state.view.stage.textContent = `Stage 0${state.values.stage}`;
    state.view.screen.classList.add("hidden");
    state.view.life.textContent = `x${state.values.life}`;
    
    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
    state.actions.countDownTimerId = setInterval(countDown, 1000);
    
    addListenerHitBox();
}

function nextLevel() {
    state.values.currentTime = 30;
    state.values.points = 0;
    state.values.gameVelocity -= 100;
    state.values.stage++;

    state.view.stage.textContent = `Stage 0${state.values.stage}`;
    state.view.life.textContent = `x${state.values.life}`;
    state.view.screen.classList.add("hidden");
    
    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
    state.actions.countDownTimerId = setInterval(countDown, 1000);

    addListenerHitBox();
}

function continueLevel() {
    state.values.currentTime = 30;
    state.values.points = 0;
    state.values.life--;

    state.view.life.textContent = `x${state.values.life}`;
    
    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
    state.actions.countDownTimerId = setInterval(countDown, 1000);

    state.view.screen.classList.add("hidden");
    addListenerHitBox();
}

function gameOver() {
    state.view.screen.classList.add("hidden");
    
    finalScreen("Jogo do Detona Ralph", "Encontre o inimigo escondido!", "Start", "initialize");
}