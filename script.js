// List of items (triangle, circle, square, rectangle, number 7)
const items = ["▲", "●", "■", "▬", "7"];
let slots = [];
let spinIntervals = [];
let score = 50;  // Start with 50 points
let multiplier = 1;  // Default multiplier is 1
let lockedSlots = [false, false, false, false, false];  // Track which slots are locked
let isSpinning = false;  // Track if the slots are currently spinning

// Function to create random items in a slot
function createRandomSlotContent(slot) {
    slot.innerHTML = items[Math.floor(Math.random() * items.length)];
}

// Function to start spinning
function startSpin() {
    // Check if the player has enough points to spin
    if (score < multiplier) {
        alert("You don't have enough points to spin. Game over.");
        return;
    }

    // Check if the slots are already spinning
    if (isSpinning) {
        return;  // Prevent starting a new spin if already spinning
    }

    // Set spinning status to true and disable the spin button
    isSpinning = true;
    document.getElementById("spinButton").disabled = true;

    // Deduct points based on the chosen multiplier
    score -= multiplier;
    if (score < 0) {
        score = 0;  // Ensure score doesn't go below 0
    }
    updateScore();

    // Clear any existing intervals if the user presses spin before the previous spin ends
    stopAllSpins();

    // Start the spinning by setting intervals to rapidly change items in each slot (if not locked)
    slots.forEach((slot, index) => {
        if (!lockedSlots[index]) {  // Only spin if the slot is not locked
            spinIntervals[index] = setInterval(() => {
                createRandomSlotContent(slot);
            }, 100);  // Change items every 100 milliseconds
        }
    });

    // Stop the spinning after 5 seconds
    setTimeout(() => {
        stopAllSpins();
        checkWinCondition();
        isSpinning = false;  // Set spinning status to false
        document.getElementById("spinButton").disabled = false;  // Re-enable the spin button
    }, 5000);
}

// Function to stop spinning by clearing intervals
function stopAllSpins() {
    spinIntervals.forEach((interval) => clearInterval(interval));
}

// Function to check for win condition and assign points based on matching symbols
function checkWinCondition() {
    const firstSlotContent = slots[0].innerHTML;
    const allSame = slots.every(slot => slot.innerHTML === firstSlotContent);

    if (allSame) {
        let points = 0;
        switch (firstSlotContent) {
            case "▲":
                points = 2;
                break;
            case "■":
                points = 4;
                break;
            case "●":
                points = 6;
                break;
            case "▬":
                points = 8;
                break;
            case "7":
                points = 100;
                break;
        }
        const totalPoints = points * multiplier;  // Apply the multiplier to the points
        score += totalPoints;  // Add the points to the score
        alert(`You got five ${firstSlotContent}! You get ${totalPoints} points.`);
    }

    updateScore();
}

// Function to update the score on the screen
function updateScore() {
    document.getElementById("score").innerText = "Score: " + score;
    // Disable the spin button if the player doesn't have enough points
    if (score < multiplier) {
        document.getElementById("spinButton").disabled = true;
    }
}

// Function to toggle lock on a slot
function toggleLock(index) {
    lockedSlots[index] = !lockedSlots[index];  // Toggle lock state
    const lockButton = document.getElementById(`lock${index + 1}`);
    if (lockedSlots[index]) {
        lockButton.innerText = "Unlock";  // Change button text to "Unlock"
    } else {
        lockButton.innerText = "Lock";    // Change button text to "Lock"
    }
}

// Function to select multiplier and enable the spin button
function selectMultiplier(mult) {
    multiplier = mult;
    document.getElementById("spinButton").disabled = false;  // Enable the spin button
    document.getElementById("multiplier-section").style.display = "none";  // Hide the multiplier section
}

// Initialize the game
document.addEventListener("DOMContentLoaded", () => {
    // Grab all the slots
    slots = Array.from(document.querySelectorAll('.slot'));

    // Add event listener to the spin button
    document.getElementById("spinButton").addEventListener("click", startSpin);

    // Add event listeners to lock buttons
    document.getElementById("lock1").addEventListener("click", () => toggleLock(0));
    document.getElementById("lock2").addEventListener("click", () => toggleLock(1));
    document.getElementById("lock3").addEventListener("click", () => toggleLock(2));
    document.getElementById("lock4").addEventListener("click", () => toggleLock(3));
    document.getElementById("lock5").addEventListener("click", () => toggleLock(4));

    // Initialize each slot with random content
    slots.forEach(slot => {
        createRandomSlotContent(slot);
    });

    // Display initial score
    updateScore();

    // Add event listeners to multiplier buttons
    document.getElementById("multiplier1").addEventListener("click", () => selectMultiplier(1));
    document.getElementById("multiplier2").addEventListener("click", () => selectMultiplier(2));
    document.getElementById("multiplier3").addEventListener("click", () => selectMultiplier(3));
});
