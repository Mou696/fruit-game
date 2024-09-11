const items = ["▲", "●", "■", "▬", "7"];
let slots = [];
let spinIntervals = [];
let score = 50;  // Start with 50 points
let multiplier = 1;  // Default multiplier is 1
let lockedSlots = [false, false, false, false, false];  // Track which slots are locked
let isSpinning = false;  // Track if the slots are currently spinning

// Load sound effects
const backgroundMusic = new Audio("bgm.mp3");
const rollingSound = new Audio("rollsound.mp3");
const clickSound = new Audio('clicksound.wav'); 
const fireworkSound = new Audio('firework.mp3'); 

backgroundMusic.volume = 0.3;  
rollingSound.volume = 0.4;     
fireworkSound.volume = 1.0;    

// Function to play click sound
function playClickSound() {
    clickSound.play();
}

function playFireworkSound() {
    fireworkSound.volume = 1.0;  
    fireworkSound.play();
    
    setTimeout(() => {
        fireworkSound.pause();
        fireworkSound.currentTime = 0;  // Reset to start after 10 seconds
    }, 12000);  // Stop after 10 seconds
}


// Function to create random items in a slot
function createRandomSlotContent(slot) {
    slot.innerHTML = items[Math.floor(Math.random() * items.length)];
}

// Function to start spinning
function startSpin() {
    // Check if the player has enough points to spin
    if (score < multiplier) {
        alert("No money WOMP WOMP, That's why you SHOULDN'T GAMBLE. Y to RESTART");
        return;
    }

    // Check if the slots are already spinning
    if (isSpinning) {
        return;  // Prevent starting a new spin if already spinning
    }

    // Play rolling sound
    rollingSound.play();

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

    // Stop the spinning after 1 second
    setTimeout(() => {
        stopAllSpins();
        checkWinCondition();
        isSpinning = false;  // Set spinning status to false
        document.getElementById("spinButton").disabled = false;  // Re-enable the spin button
    }, 1000);
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
                // Trigger confetti and firework sound when all slots have 7s
                triggerConfetti();
                playFireworkSound();
                break;
        }
        const totalPoints = points * multiplier;  // Apply the multiplier to the points
        score += totalPoints;  // Add the points to the score
        alert(`You got five ${firstSlotContent}! You get ${totalPoints} points.`);

        // Unlock all slots, reset multiplier options, and change all slots to random items
        unlockAllSlots();
        showMultiplierOptions();
        resetSlots();
    }

    updateScore();
}

// Function to reset all slots to random items
function resetSlots() {
    slots.forEach(slot => {
        createRandomSlotContent(slot);  // Set each slot to a random item
    });
}

// Function to unlock all slots
function unlockAllSlots() {
    lockedSlots = [false, false, false, false, false];  // Unlock all slots
    document.querySelectorAll('.lockButton').forEach((button) => {
        button.innerText = "Lock";  // Reset button text to "Lock"
    });
}

// Function to show multiplier options
function showMultiplierOptions() {
    document.getElementById("multiplier-section").style.display = "block";  // Show multiplier options
}

// Function to update the score (Money) on the screen
function updateScore() {
    document.getElementById("score").innerText = "Money: " + score;  // Updated to show Money
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

// Function to trigger a confetti animation that fills the screen
function triggerConfetti() {
    const duration = 15 * 1000,
        animationEnd = Date.now() + duration,
        defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // since particles fall down, start a bit higher than random
        confetti(
            Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            })
        );
        confetti(
            Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            })
        );
    }, 250);
}

// Initialize the game
document.addEventListener("DOMContentLoaded", () => {
    // Play background music when the game loads
    backgroundMusic.loop = true;  // Loop background music
    backgroundMusic.play();  // Start background music

    // Grab all the slots
    slots = Array.from(document.querySelectorAll('.slot'));

    // Add event listener to the spin button
    document.getElementById("spinButton").addEventListener("click", () => {
        playClickSound();
        startSpin();
    });

    // Add event listeners to lock buttons
    document.getElementById("lock1").addEventListener("click", () => {
        playClickSound();
        toggleLock(0);
    });
    document.getElementById("lock2").addEventListener("click", () => {
        playClickSound();
        toggleLock(1);
    });
    document.getElementById("lock3").addEventListener("click", () => {
        playClickSound();
        toggleLock(2);
    });
    document.getElementById("lock4").addEventListener("click", () => {
        playClickSound();
        toggleLock(3);
    });
    document.getElementById("lock5").addEventListener("click", () => {
        playClickSound();
        toggleLock(4);
    });

    // Initialize each slot with random content
    slots.forEach(slot => {
        createRandomSlotContent(slot);
    });

    // Display initial score
    updateScore();

    // Add event listeners to multiplier buttons
    document.getElementById("multiplier1").addEventListener("click", () => {
        playClickSound();
        selectMultiplier(1);
    });
    document.getElementById("multiplier2").addEventListener("click", () => {
        playClickSound();
        selectMultiplier(2);
    });
    document.getElementById("multiplier3").addEventListener("click", () => {
        playClickSound();
        selectMultiplier(3);
    });
});

window.addEventListener('keydown', (event) => {
    if (event.key === 'y' || event.key === 'Y') {
      // Reload the page
      location.reload();
    }
});
                     
                                                                                                   