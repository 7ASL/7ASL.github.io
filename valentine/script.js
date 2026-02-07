const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const container = document.querySelector('.container');
const content = document.querySelector('.content');

const PROXIMITY_DISTANCE = 150;
let proximityActive = false;
let moveInterval = null;
let currentNoScale = 1;
let currentYesScale = 1;

function getRandomPosition() {
    const noBtnWidth = noBtn.offsetWidth;
    const noBtnHeight = noBtn.offsetHeight;
    const margin = 20;
    
    const maxX = window.innerWidth - noBtnWidth - margin;
    const maxY = window.innerHeight - noBtnHeight - margin;
    
    const x = Math.random() * Math.max(0, maxX - margin) + margin;
    const y = Math.random() * Math.max(0, maxY - margin) + margin;
    
    return { x, y };
}

// Ensure button doesn't move behind content or off-screen
function isValidPosition(x, y) {
    const contentRect = content.getBoundingClientRect();
    const noBtnWidth = noBtn.offsetWidth;
    const noBtnHeight = noBtn.offsetHeight;
    const padding = 150;
    
    if (x + noBtnWidth > contentRect.left - padding && 
        x < contentRect.right + padding && 
        y + noBtnHeight > contentRect.top - padding && 
        y < contentRect.bottom + padding) {
        return false;
    }
    
    const margin = 20;
    if (x < margin || x + noBtnWidth > window.innerWidth - margin ||
        y < margin || y + noBtnHeight > window.innerHeight - margin) {
        return false;
    }
    
    return true;
}

function getSafeRandomPosition() {
    let pos;
    let attempts = 0;
    do {
        pos = getRandomPosition();
        attempts++;
    } while (!isValidPosition(pos.x, pos.y) && attempts < 20);
    
    return pos;
}

function startButtonMovement() {
    if (moveInterval) clearInterval(moveInterval);
    
    moveInterval = setInterval(() => {
        if (proximityActive) {
            noBtn.classList.add('escaping');
            const pos = getSafeRandomPosition();
            noBtn.style.left = pos.x + 'px';
            noBtn.style.top = pos.y + 'px';
            
            // Scale down No, scale up Yes with each movement
            currentNoScale = Math.max(0.4, currentNoScale - 0.05);
            currentYesScale = currentYesScale + 0.05;
            
            noBtn.style.transform = `scale(${currentNoScale})`;
            yesBtn.style.transform = `scale(${currentYesScale})`;
        }
    }, 200);
}

function stopButtonMovement() {
    if (moveInterval) {
        clearInterval(moveInterval);
        moveInterval = null;
    }
    proximityActive = false;
}

document.addEventListener('mousemove', (e) => {
    const noBtnRect = noBtn.getBoundingClientRect();
    const noBtnCenterX = noBtnRect.left + noBtnRect.width / 2;
    const noBtnCenterY = noBtnRect.top + noBtnRect.height / 2;
    
    const distance = Math.sqrt(
        Math.pow(e.clientX - noBtnCenterX, 2) + 
        Math.pow(e.clientY - noBtnCenterY, 2)
    );
    
    if (distance < PROXIMITY_DISTANCE) {
        if (!proximityActive) {
            proximityActive = true;
            startButtonMovement();
        }
    } else {
        if (proximityActive) {
            stopButtonMovement();
        }
    }
});

noBtn.addEventListener('mouseenter', () => {
    if (!proximityActive) {
        proximityActive = true;
        startButtonMovement();
    }
});

yesBtn.addEventListener('click', () => {
    stopButtonMovement();
    showSuccessScreen();
    yesBtn.disabled = true;
    noBtn.disabled = true;
});

function showSuccessScreen() {
    const originalContent = document.getElementById('originalContent');
    const successContent = document.getElementById('successContent');
    
    showCelebration();
    
    originalContent.style.animation = 'fadeOut 0.5s ease-out forwards';
    
    setTimeout(() => {
        originalContent.style.display = 'none';
        successContent.style.display = 'block';
        successContent.style.animation = 'fadeIn 0.5s ease-in';
    }, 500);
}

function showCelebration() {
    const celebration = document.createElement('div');
    celebration.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 80px;
        z-index: 1000;
        animation: celebrate 2s ease-out forwards;
        pointer-events: none;
    `;
    celebration.textContent = '❤️';
    document.body.appendChild(celebration);
    
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.style.cssText = `
                position: fixed;
                font-size: 40px;
                z-index: 999;
                animation: float-up 3s ease-out forwards;
                pointer-events: none;
            `;
            heart.textContent = '❤️';
            heart.style.left = Math.random() * window.innerWidth + 'px';
            heart.style.top = window.innerHeight + 'px';
            document.body.appendChild(heart);
            
            setTimeout(() => heart.remove(), 3000);
        }, i * 100);
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes celebrate {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -200%) scale(2);
        }
    }
    
    @keyframes float-up {
        0% {
            opacity: 1;
            transform: translateY(0);
        }
        100% {
            opacity: 0;
            transform: translateY(-300px) rotate(360deg);
        }
    }
    
    @keyframes popIn {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0);
        }
        100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
    
    @keyframes fadeOut {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
