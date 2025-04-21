var firstCard = null;
var secondCard = null;
var lockedBoard = false;

var startBtn = document.getElementById("start-btn");
var audio = document.getElementById("background-music");

startBtn.addEventListener("click", startGame);

function startGame() {
    audio.play().catch((error) => {
        console.error("Error playing audio:", error);
    });

    startBtn.style.display = "none";
    document.getElementById("game-board").style.display = "grid";

    shuffleCards();
    revealCard();
}

function revealCard() {
    const cards = document.querySelectorAll(".card");

    for (let i = 0; i < cards.length; i++) {
        setTimeout(function () {
            cards[i].classList.add("visible");
        }, i * 200);
    }

    cards.forEach(function (card) {
        card.addEventListener("click", flipCard);
    });
}

function flipCard() {
    if (lockedBoard) return;
    if (this === firstCard) return;

    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        checkMatch(firstCard, secondCard);
    }
}

function checkMatch(firstCard, secondCard) {
    lockedBoard = true;

    if (firstCard.dataset.name === secondCard.dataset.name) {
        firstCard.removeEventListener("click", flipCard);
        secondCard.removeEventListener("click", flipCard);
        showCharacterGif(firstCard.dataset.name);
        resetBoard();

        if (document.querySelectorAll(".card.flipped").length === document.querySelectorAll(".card").length) {
            setTimeout(() => {
                showWinMessage();
            }, 1000);
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            resetBoard();
        }, 1000);
    }
}

function resetBoard() {
    [firstCard, secondCard, lockedBoard] = [null, null, false];
}

function shuffleCards() {
    const cards = document.querySelectorAll(".card");
    const cardsArray = Array.from(cards);

    for (let i = cardsArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardsArray[i], cardsArray[j]] = [cardsArray[j], cardsArray[i]];
    }

    cardsArray.forEach(card => {
        document.getElementById("game-board").appendChild(card);
    });
}

function showCharacterGif(characterName) {
    const gifContainer = document.getElementById("character-gif-container");
    const gifImage = document.getElementById("character-gif");
    const backgroundMusic = document.getElementById("background-music");

    switch (characterName) {
        case "luffy":
            gifImage.src = "./images/luffy gif.gif";
            break;
        case "zoro":
            gifImage.src = "./images/zoro gif.gif";
            break;
        case "Shanks":
            gifImage.src = "./images/Shanks gif.gif";
            break;
        case "Ace":
            gifImage.src = "./images/ace gif.gif";
            break;
        case "Kaido":
            gifImage.src = "./images/kaido gif.gif";
            break;
        case "Franky":
            gifImage.src = "./images/Franky gif.gif";
            break;
        default:
            gifImage.src = "";
            break;
    }

    gifContainer.style.display = "block";
    gifImage.style.display = "block";
    backgroundMusic.pause();

    const characterAudio = new Audio(`./sounds/${characterName}-sound.mp3`);
    characterAudio.volume = 1;
    characterAudio.play();

    characterAudio.addEventListener("ended", () => {
        gifContainer.style.display = "none";
        gifImage.style.display = "none";
        backgroundMusic.play();
    });
}

function showWinMessage() {
    const winMessage = document.getElementById("win-message");
    const restartBtn = document.getElementById("restart-btn");
    const backgroundMusic = document.getElementById("background-music");
    const winSound = document.getElementById("win-sound");

    backgroundMusic.pause();
    winSound.currentTime = 0;
    winSound.play();

    winMessage.classList.remove("hidden");
    restartBtn.style.display = "block";

    winSound.onended = () => {
        backgroundMusic.play();
    };

    restartBtn.addEventListener("click", () => {
        restartBtn.style.display = "none";
        winMessage.classList.add("hidden");
        restartGame();
    });
}

function restartGame() {
    const cards = document.querySelectorAll(".card");
    const gifContainer = document.getElementById("character-gif-container");
    const gifImage = document.getElementById("character-gif");

    cards.forEach(card => {
        card.classList.remove("flipped", "visible");
        card.addEventListener("click", flipCard);
    });

    gifContainer.style.display = "none";
    gifImage.style.display = "none";

    [firstCard, secondCard, lockedBoard] = [null, null, false];

    shuffleCards();

    document.getElementById("game-board").style.display = "grid";

    audio.currentTime = 0;
    audio.play();

    revealCard();
}
