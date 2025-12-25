let musicBox = 100;
let battery = 100;
let currentHour = 0;
let currentCam = 11;
let isMaskOn = false;
let foxyFlashCount = 0;
let gameActive = false;

// Posições Iniciais Corrigidas
let positions = { 
    toyFreddy: "cam01", 
    toyChica: "cam02", 
    toyBonnie: "cam11", // Bonnie começa na 11
    foxy: "cam04" 
};

function startGame(night) {
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('game-container').classList.remove('hidden');
    gameActive = true;
    
    // Relógio
    setInterval(() => {
        if(gameActive) {
            currentHour++;
            document.getElementById('hour-val').innerText = currentHour;
            if(currentHour === 6) victory();
        }
    }, 60000);

    // Loop IA
    setInterval(gameLoop, 4000 - (night * 300)); 
}

function gameLoop() {
    if(!gameActive) return;

    musicBox -= 0.6;
    document.getElementById('music-val').innerText = Math.floor(musicBox);
    if(musicBox <= 0) gameOver("PUPPET TE PEGOU!");

    // Movimentação
    if(Math.random() > 0.7) {
        if(positions.toyChica === "cam02") positions.toyChica = "duct-left";
        if(positions.toyBonnie === "cam11") positions.toyBonnie = "cam03";
        else if(positions.toyBonnie === "cam03") positions.toyBonnie = "duct-right";
        
        if(positions.toyFreddy === "cam01") positions.toyFreddy = "corridor";
        if(positions.foxy === "cam04") positions.foxy = "corridor";
        updateCamDetection();
    }
}

function updateCamDetection() {
    let list = [];
    for (let anim in positions) {
        let camString = "cam" + (currentCam < 10 ? "0" + currentCam : currentCam);
        if (positions[anim] === camString) list.push(anim.toUpperCase());
    }
    document.getElementById('anim-detected').innerText = list.length > 0 ? "Detectado: " + list.join(", ") : "Câmera Limpa";
}

function changeCam(num) {
    currentCam = num;
    document.getElementById('cam-label').innerText = "CAM " + (num < 10 ? "0"+num : num);
    updateCamDetection();
}

// Interações com Avisos
document.getElementById('corridor').addEventListener('click', () => {
    let corridorList = [];
    if(positions.toyFreddy === "corridor") corridorList.push("Toy Freddy");
    if(positions.foxy === "corridor") corridorList.push("Foxy");
    
    if(corridorList.length > 0) alert("No Corredor: " + corridorList.join(" e "));
    else alert("Corredor Vazio");
});

document.getElementById('duct-left').addEventListener('click', () => {
    if(positions.toyChica === "duct-left") {
        if(isMaskOn) { alert("Chica saiu do duto."); positions.toyChica = "cam02"; }
        else gameOver("TOY CHICA TE PEGOU!");
    } else alert("Duto Esquerdo Limpo");
});

document.getElementById('duct-right').addEventListener('click', () => {
    if(positions.toyBonnie === "duct-right") {
        if(isMaskOn) { alert("Bonnie saiu do duto."); positions.toyBonnie = "cam03"; }
        else gameOver("TOY BONNIE TE PEGOU!");
    } else alert("Duto Direito: Toy Bonnie"); // Conforme pedido, avisa quem está
});

document.getElementById('flash-btn').addEventListener('click', () => {
    if(battery <= 0 || isMaskOn) return;
    battery -= 0.5;
    document.getElementById('bat-val').innerText = Math.floor(battery);
    if(positions.foxy === "corridor") {
        foxyFlashCount++;
        if(foxyFlashCount >= 2) { alert("Foxy recuou!"); positions.foxy = "cam04"; foxyFlashCount = 0; }
    }
});

document.getElementById('mask-toggle').addEventListener('click', () => {
    isMaskOn = !isMaskOn;
    document.getElementById('office').classList.toggle('mask-active');
});

document.getElementById('cam-toggle').addEventListener('click', () => {
    if(!isMaskOn) {
        document.getElementById('camera-screen').classList.toggle('hidden');
        document.getElementById('cam-menu').classList.toggle('hidden');
        updateCamDetection();
    }
});

document.getElementById('rewind-btn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    if(currentCam === 11 && musicBox < 100) musicBox += 6;
});

document.getElementById('audio-btn').addEventListener('click', () => {
    if(currentCam === 1 && positions.toyFreddy === "corridor") {
        positions.toyFreddy = "cam01"; alert("Freddy voltou para a Cam 01");
    }
});

function gameOver(msg) { alert(msg); location.reload(); }
function victory() { alert("6 AM! SOBREVIVEU!"); location.reload(); }
