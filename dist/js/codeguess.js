var codeColors = ["coral", "gold", "leaf", "blue", "plum", "ink"];
var codeNames = ["Coral", "Gold", "Leaf", "Blue", "Plum", "Ink"];
var secretCode = [];
var currentGuess = [0, 1, 2, 3];
var selectedSlot = 0;
var codeAttempts = 0;
var codeFinished = false;
var codeHistory = document.getElementById("code-history");
var codeStatus = document.getElementById("code-status");
var codePicks = document.querySelector(".code-picks");
var codePalette = document.querySelector(".code-palette");

function makeCode() {
    var pool = [0, 1, 2, 3, 4, 5];
    secretCode = [];
    while (secretCode.length < 4) {
        var pick = Math.floor(Math.random() * pool.length);
        secretCode.push(pool.splice(pick, 1)[0]);
    }
}

function renderGuess() {
    codePicks.innerHTML = "";
    currentGuess.forEach(function (color, slot) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "code-slot" + (slot === selectedSlot ? " is-selected" : "");
        button.setAttribute("aria-label", "Position " + (slot + 1) + ": " + codeNames[color]);
        button.setAttribute("aria-pressed", slot === selectedSlot ? "true" : "false");
        button.disabled = codeFinished;
        button.innerHTML = '<span class="code-slot-number">0' + (slot + 1) + '</span><span class="code-slot-peg color-' + codeColors[color] + '"></span><span class="code-slot-name">' + codeNames[color] + '</span>';
        button.addEventListener("click", function () {
            selectedSlot = slot;
            renderGuess();
            codePicks.children[slot].focus();
        });
        codePicks.appendChild(button);
    });
    codePalette.innerHTML = "";
    codeColors.forEach(function (color, index) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "code-color" + (currentGuess[selectedSlot] === index ? " is-current" : "");
        button.setAttribute("aria-label", "Choose " + codeNames[index] + " for position " + (selectedSlot + 1));
        button.disabled = codeFinished;
        button.innerHTML = '<span class="code-color-dot color-' + color + '"></span><span>' + codeNames[index] + '</span>';
        button.addEventListener("click", function () {
            var otherSlot = currentGuess.indexOf(index);
            if (otherSlot !== -1 && otherSlot !== selectedSlot) {
                currentGuess[otherSlot] = currentGuess[selectedSlot];
            }
            currentGuess[selectedSlot] = index;
            selectedSlot = (selectedSlot + 1) % 4;
            renderGuess();
            codePicks.children[selectedSlot].focus();
        });
        codePalette.appendChild(button);
    });
}

function showCodeRow(guess, exact, misplaced) {
    var row = document.createElement("div");
    row.className = "code-row";
    var number = document.createElement("span");
    number.className = "code-row-number";
    number.textContent = String(codeAttempts + 1).padStart(2, "0");
    var pegs = document.createElement("div");
    pegs.className = "code-pegs";
    guess.forEach(function (value) {
        var peg = document.createElement("span");
        peg.className = "code-peg color-" + codeColors[value];
        peg.setAttribute("aria-label", codeNames[value]);
        pegs.appendChild(peg);
    });
    var clue = document.createElement("span");
    clue.className = "code-clue";
    clue.textContent = exact + " exact · " + misplaced + " misplaced";
    row.appendChild(number);
    row.appendChild(pegs);
    row.appendChild(clue);
    codeHistory.prepend(row);
}

function submitGuess(event) {
    event.preventDefault();
    if (codeFinished) { return; }
    var guess = currentGuess.slice();
    var exact = 0;
    var misplaced = 0;
    for (var i = 0; i < 4; i++) {
        if (guess[i] === secretCode[i]) { exact++; }
        else if (secretCode.indexOf(guess[i]) !== -1) { misplaced++; }
    }
    showCodeRow(guess, exact, misplaced);
    codeAttempts++;
    if (exact === 4) {
        codeFinished = true;
        codeStatus.textContent = "Code cracked in " + codeAttempts + (codeAttempts === 1 ? " attempt." : " attempts.");
        codeStatus.className = "game-status success";
    } else if (codeAttempts === 6) {
        codeFinished = true;
        codeStatus.textContent = "Out of attempts. The code was " + secretCode.map(function (value) { return codeNames[value]; }).join(", ") + ".";
        codeStatus.className = "game-status error";
    } else {
        codeStatus.textContent = exact + " exact and " + misplaced + " misplaced. Try again.";
        codeStatus.className = "game-status";
    }
    document.getElementById("code-turn").textContent = codeFinished ? codeAttempts : codeAttempts + 1;
    document.querySelector("#code-form .button").disabled = codeFinished;
    renderGuess();
}

function resetCode() {
    makeCode();
    currentGuess = [0, 1, 2, 3];
    selectedSlot = 0;
    codeAttempts = 0;
    codeFinished = false;
    codeHistory.innerHTML = "";
    codeStatus.textContent = "Six attempts to find the hidden sequence.";
    codeStatus.className = "game-status";
    document.getElementById("code-turn").textContent = "1";
    document.querySelector("#code-form .button").disabled = false;
    renderGuess();
}

document.getElementById("code-form").addEventListener("submit", submitGuess);
document.getElementById("code-new").addEventListener("click", resetCode);
resetCode();
