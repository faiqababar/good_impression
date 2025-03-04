let player = document.getElementById("player");
let playerX = 280,
  playerY = 180;
let speed = 5;
let carryingItem = null;
let score = 0;
let timeLeft = 60;

const items = document.querySelectorAll(".item");
const timerEl = document.getElementById("time");
const scoreEl = document.getElementById("score");
const heldItemEl = document.getElementById("heldItem");
const gameOverScreen = document.getElementById("game-over");
const finalScoreEl = document.getElementById("finalScore");

const pickupSound = document.getElementById("pickupSound");
const dropSound = document.getElementById("dropSound");

function movePlayer(dx, dy) {
  playerX = Math.max(0, Math.min(560, playerX + dx * speed));
  playerY = Math.max(0, Math.min(360, playerY + dy * speed));
  player.style.left = playerX + "px";
  player.style.top = playerY + "px";
}

function checkPickupOrDrop() {
  if (carryingItem) {
    const dropzone = getCollidingDropzone();
    if (dropzone) {
      if (isCorrectPlacement(carryingItem, dropzone.id)) {
        score += 10;
        carryingItem.remove();
        dropSound.play();
      } else {
        score -= 5;
        alert("Oops! Wrong place. -5 points");
      }
      carryingItem = null;
      updateInventory();
      scoreEl.textContent = score;
    }
  } else {
    const item = getCollidingItem();
    if (item) {
      carryingItem = item;
      item.style.display = "none";
      pickupSound.play();
      updateInventory(item);
    }
  }
}

function updateInventory(item = null) {
  heldItemEl.textContent = item ? item.dataset.type : "None";
}

function getCollidingItem() {
  return Array.from(items).find(
    (item) => isColliding(player, item) && !item.removed
  );
}

function getCollidingDropzone() {
  return Array.from(document.querySelectorAll(".dropzone")).find((zone) =>
    isColliding(player, zone)
  );
}

function isCorrectPlacement(item, zoneId) {
  const correctZones = {
    trash: ["trashBin"],
    book: ["shelf"],
    clothes: ["shelf"],
  };
  return correctZones[item.dataset.type]?.includes(zoneId);
}

function isColliding(a, b) {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();
  return !(
    aRect.right < bRect.left ||
    aRect.left > bRect.right ||
    aRect.bottom < bRect.top ||
    aRect.top > bRect.bottom
  );
}

document.addEventListener("keydown", (e) => {
  const keyMoves = {
    ArrowUp: [0, -2],
    ArrowDown: [0, 2],
    ArrowLeft: [-2, 0],
    ArrowRight: [2, 0],
  };
  if (keyMoves[e.key]) movePlayer(...keyMoves[e.key]);
  if (e.key === " ") checkPickupOrDrop();
});

const timer = setInterval(() => {
  timerEl.textContent = --timeLeft;
  if (timeLeft <= 0) endGame();
}, 1000);

function endGame() {
  clearInterval(timer);
  gameOverScreen.style.display = "block";
  finalScoreEl.textContent = score;
}

function restartGame() {
  location.reload();
}
