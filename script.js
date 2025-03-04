let score = 0;
let timeLeft = 60; // 60 seconds countdown

const timerElement = document.getElementById("time");
const scoreElement = document.getElementById("scoreValue");
const finalScoreElement = document.getElementById("finalScore");
const resultScreen = document.getElementById("result");

// Timer countdown
const timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;
    if (timeLeft <= 0) {
        clearInterval(timer);
        endGame();
    }
}, 1000);

// Drag and Drop logic
const draggables = document.querySelectorAll('.draggable');
const dropzones = document.querySelectorAll('.dropzone');

draggables.forEach(item => {
    item.setAttribute('draggable', true);

    item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', item.id);
    });
});

dropzones.forEach(zone => {
    zone.addEventListener('dragover', (e) => e.preventDefault());

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        const itemId = e.dataTransfer.getData('text/plain');
        const item = document.getElementById(itemId);
        const itemType = item.getAttribute('data-type');

        if (isCorrectPlacement(itemType, zone.id)) {
            zone.appendChild(item);
            score += 10;
        } else {
            score -= 5;
            alert('Wrong place! -5 points');
        }

        scoreElement.textContent = score;
    });
});

function isCorrectPlacement(type, zoneId) {
    const validPlacements = {
        trash: ["trashBin"],
        book: ["shelf"],
        clothes: ["shelf"],
    };
    return validPlacements[type]?.includes(zoneId);
}

function endGame() {
    document.getElementById('apartment').style.display = 'none';
    document.getElementById('timer').style.display = 'none';
    document.getElementById('score').style.display = 'none';
    resultScreen.classList.remove('hidden');
    finalScoreElement.textContent = score;
}
