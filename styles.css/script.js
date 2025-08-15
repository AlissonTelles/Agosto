// --- Função de vender o pet ---
const sellBtn = document.getElementById('sell-btn');
const vendidoMsg = document.getElementById('vendido-msg');
function handleSell() {
    document.querySelector('.game-container').style.display = 'none';
    vendidoMsg.style.display = 'flex';
    vendidoMsg.style.alignItems = 'center';
    vendidoMsg.style.justifyContent = 'center';
    vendidoMsg.style.flexDirection = 'column';
}
if (sellBtn) sellBtn.addEventListener('click', handleSell);
document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos do DOM ---
    const petImage = document.getElementById('pet-image');
    const petNameEl = document.getElementById('pet-name');
    const hungerBar = document.getElementById('hunger-bar');
    const hungerText = document.getElementById('hunger-text');
    const happinessBar = document.getElementById('happiness-bar');
    const happinessText = document.getElementById('happiness-text');
    const energyBar = document.getElementById('energy-bar');
    const energyText = document.getElementById('energy-text');
    const hygieneBar = document.getElementById('hygiene-bar');
    const hygieneText = document.getElementById('hygiene-text');
    const feedBtn = document.getElementById('feed-btn');
    const playBtn = document.getElementById('play-btn');
    const cleanBtn = document.getElementById('clean-btn');
    const sleepBtn = document.getElementById('sleep-btn');
    const ignoreBtn = document.getElementById('ignore-btn');
        // Modal removido

    // --- Estado do Pet ---
    let pet = {
        name: 'Buddy',
        hunger: 100,
        happiness: 100,
        energy: 100,
        hygiene: 100
    };
    const decayRates = {
        hunger: 0.5,
        happiness: 0.8,
        energy: 0.8,
        hygiene: 0.2
    };
    const actionEffects = {
        feed: { hunger: +30, happiness: +10, energy: -5, hygiene: -5 },
        play: { hunger: -10, happiness: +30, energy: -20, hygiene: -10 },
        clean: { hunger: -5, happiness: +10, energy: -5, hygiene: +40 },
        sleep: { hunger: -10, happiness: +10, energy: +50, hygiene: -5 }
    };
    let gameInterval = null;

    // --- Funções Auxiliares ---
    function clamp(value, min, max) {
        return Math.max(min, Math.min(value, max));
    }
        // Funções de mensagem removidas
    function getStatusColor(percentage) {
        if (percentage > 70) return '#4caf50';
        if (percentage > 30) return '#ffeb3b';
        return '#f44336';
    }
    function updateUI() {
        hungerBar.style.width = `${pet.hunger}%`;
        hungerText.textContent = `${Math.round(pet.hunger)}%`;
        hungerBar.style.backgroundColor = getStatusColor(pet.hunger);
        happinessBar.style.width = `${pet.happiness}%`;
        happinessText.textContent = `${Math.round(pet.happiness)}%`;
        happinessBar.style.backgroundColor = getStatusColor(pet.happiness);
        energyBar.style.width = `${pet.energy}%`;
        energyText.textContent = `${Math.round(pet.energy)}%`;
        energyBar.style.backgroundColor = getStatusColor(pet.energy);
        hygieneBar.style.width = `${pet.hygiene}%`;
        hygieneText.textContent = `${Math.round(pet.hygiene)}%`;
        hygieneBar.style.backgroundColor = getStatusColor(pet.hygiene);
        // Atualiza imagem do pet
        if (pet.hunger <= 50 || pet.happiness <= 50 || pet.energy <= 50 || pet.hygiene <= 50) {
            petImage.src = "2.jpg";
        } else {
            petImage.src = "1.jpg";
        }
        playBtn.disabled = pet.energy < 20;
        feedBtn.disabled = pet.hunger > 90;
        sleepBtn.disabled = pet.energy > 80;
        cleanBtn.disabled = pet.hygiene > 90;
    }
    function applyActionEffects(effects) {
        for (const stat in effects) {
            if (pet.hasOwnProperty(stat)) {
                pet[stat] = clamp(pet[stat] + effects[stat], 0, 100);
            }
        }
        let happinessDecay = decayRates.happiness;
        if (pet.hunger < 50 || pet.energy < 50 || pet.hygiene < 50) {
            happinessDecay += 0.7;
        }
        pet.happiness = clamp(pet.happiness - happinessDecay, 0, 100);
        updateUI();
    }
    function timeProgression() {
        pet.hunger = clamp(pet.hunger - decayRates.hunger, 0, 100);
        pet.energy = clamp(pet.energy - decayRates.energy, 0, 100);
        pet.hygiene = clamp(pet.hygiene - decayRates.hygiene, 0, 100);
        let happinessDecay = decayRates.happiness;
        if (pet.hunger < 50 || pet.energy < 50 || pet.hygiene < 50) {
            happinessDecay += 0.7;
        }
        pet.happiness = clamp(pet.happiness - happinessDecay, 0, 100);
        updateUI();
        checkPetStatus();
    }
        function checkPetStatus() {
            if (pet.hunger <= 0) {
                pet.happiness = clamp(pet.happiness - 0.5, 0, 100);
            }
            if (pet.happiness <= 0) {
                pet.energy = clamp(pet.energy - 0.5, 0, 100);
            }
            if (pet.energy <= 0) {
                pet.happiness = clamp(pet.happiness - 0.5, 0, 100);
            }
            if (pet.hygiene <= 0) {
                pet.happiness = clamp(pet.happiness - 0.5, 0, 100);
            }
        }

    // --- Handlers de ações ---
        function handleFeed() {
            if (pet.hunger > 90) return;
            applyActionEffects(actionEffects.feed);
        }
        function handlePlay() {
            if (pet.energy < 20) return;
            applyActionEffects(actionEffects.play);
        }
        function handleClean() {
            if (pet.hygiene > 90) return;
            applyActionEffects(actionEffects.clean);
        }
        function handleSleep() {
            if (pet.energy > 80) return;
            applyActionEffects(actionEffects.sleep);
        }
        function handleIgnore() {
            pet.happiness = clamp(pet.happiness - 10, 0, 100);
            updateUI();
        }

    // --- Inicialização ---
    function initializeGame() {
        petNameEl.textContent = pet.name;
        petNameEl.style.display = '';
        updateUI();
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            timeProgression();
        }, 1000);
    }

    // --- Listeners ---
    feedBtn.addEventListener('click', handleFeed);
    playBtn.addEventListener('click', handlePlay);
    cleanBtn.addEventListener('click', handleClean);
    sleepBtn.addEventListener('click', handleSleep);
    ignoreBtn.addEventListener('click', handleIgnore);


    // Inicia o simulador
    initializeGame();
});