const board = document.getElementById('board');
const message = document.getElementById('message');
const startButton = document.getElementById('start-button');
const timerDisplay = document.getElementById('timer');

let cardValues = [];
let shuffledCards = [];
let firstCard = null;
let secondCard = null;
let canFlip = true;
let matches = 0;
const gridSize = 10; // Fixed to 10x10
let timerInterval;
let seconds = 0;
let timerStarted = false; // To track if the timer has started

// Function to initialize the game
function initializeGame() {
    cardValues = Array.from({ length: (gridSize * gridSize) / 2 }, (_, i) => String.fromCharCode(65 + i));
    cardValues = [...cardValues, ...cardValues]; // Duplicate for pairs
    shuffledCards = shuffle(cardValues);

    // Update board grid size
    board.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`; // Adjust size for 10x10 grid
    board.innerHTML = ''; // Clear existing cards

    // Create card elements
    shuffledCards.forEach((value, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;
        card.dataset.index = index;
        card.textContent = ''; // Ensure text content is empty initially
        card.classList.remove('flipped', 'matched', 'mismatch'); // Ensure cards are reset
        card.addEventListener('click', handleCardClick);
        board.appendChild(card);
    });

    message.textContent = 'Click to flip a card';
    resetTimer();
}

// Function to shuffle the array
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// Function to handle card clicks
function handleCardClick(event) {
    if (!canFlip || event.target.classList.contains('flipped') || event.target.classList.contains('matched')) {
        return;
    }

    const card = event.target;
    
    // Start the timer when the first card is clicked
    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }

    card.textContent = card.dataset.value; // Show the card's value
    card.classList.add('flipped');

    if (!firstCard) {
        firstCard = card;
    } else {
        secondCard = card;
        canFlip = false;
        checkForMatch();
    }
}

// Function to check for a match between two cards
function checkForMatch() {
    if (firstCard.dataset.value === secondCard.dataset.value) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        matches++;
        if (matches === cardValues.length / 2) {
            message.textContent = 'You win!';
            clearInterval(timerInterval); // Stop the timer
        }
        resetCards();
    } else {
        firstCard.classList.add('mismatch');
        secondCard.classList.add('mismatch');
        setTimeout(() => {
            firstCard.textContent = '';
            secondCard.textContent = '';
            firstCard.classList.remove('flipped', 'mismatch');
            secondCard.classList.remove('flipped', 'mismatch');
            resetCards();
        }, 1000);
    }
}

// Function to reset the state of the flipped cards
function resetCards() {
    firstCard = null;
    secondCard = null;
    canFlip = true;
}

// Function to reset the timer
function resetTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    timerStarted = false; // Reset timer start flag
    updateTimerDisplay();
}

// Function to update the timer display
function updateTimerDisplay() {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${secs}`;
}

// Function to start the timer
function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        updateTimerDisplay();
    }, 1000);
}

// Function to start a new game
function startGame() {
    initializeGame();
    // The timer will start automatically on the first card click
}

// Event listener for the start button
startButton.addEventListener('click', startGame);

// Initialize the game on page load
initializeGame();
