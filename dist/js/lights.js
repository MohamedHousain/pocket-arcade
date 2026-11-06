/* Legal moves from all-off create three solvable cross-toggle puzzles. */
var lightLevel = 1, lightMoves = 0, lightCount = 0, lightWon = false;
function lightCell(i) { return document.getElementById("light-" + i); }
function toggleLight(i) {
    var cell = lightCell(i), label = ": off";
    if (cell.value == 0) { cell.value = 1; cell.className = "light-cell on"; cell.textContent = "●"; label = ": on"; }
    else { cell.value = 0; cell.className = "light-cell off"; cell.textContent = "·"; }
    cell.setAttribute("aria-label", "Square " + (i + 1) + label);
}
function toggleCross(i) {
    toggleLight(i);
    if (i >= 5) { toggleLight(i - 5); } if (i < 20) { toggleLight(i + 5); }
    if (i % 5 > 0) { toggleLight(i - 1); } if (i % 5 < 4) { toggleLight(i + 1); }
}
function updateLights() {
    lightCount = 0; var i = 0;
    while (i < 25) { if (lightCell(i).value == 1) { lightCount++; } i++; }
    document.getElementById("lights-on").textContent = lightCount;
    document.getElementById("lights-moves").textContent = lightMoves;
    document.getElementById("lights-level").textContent = lightLevel;
}
function pressLight(i) {
    if (lightWon) { return; }
    toggleCross(i); lightMoves++; updateLights();
    document.getElementById("lights-status").textContent = "Keep going: " + lightCount + " lights still on.";
    if (lightCount == 0) {
        lightWon = true;
        document.getElementById("lights-status").textContent = "Lights out! Solved in " + lightMoves + " moves.";
        document.getElementById("lights-status").className = "game-status success";
        var j = 0; while (j < 25) { lightCell(j).disabled = true; j++; }
    }
}
function resetLights() {
    lightMoves = 0; lightWon = false; var i = 0;
    while (i < 25) { lightCell(i).value = 1; lightCell(i).disabled = false; toggleLight(i); i++; }
    if (lightLevel == 1) { toggleCross(6); toggleCross(8); toggleCross(12); toggleCross(16); toggleCross(18); }
    else if (lightLevel == 2) { toggleCross(0); toggleCross(3); toggleCross(7); toggleCross(11); toggleCross(14); toggleCross(18); toggleCross(22); }
    else { toggleCross(1); toggleCross(2); toggleCross(5); toggleCross(9); toggleCross(12); toggleCross(15); toggleCross(17); toggleCross(20); toggleCross(23); }
    updateLights();
    document.getElementById("lights-status").textContent = "Turn every light off. Each switch changes a cross of squares.";
    document.getElementById("lights-status").className = "game-status"; beginSessionRound("lights");
}
function nextLights() { lightLevel++; if (lightLevel > 3) { lightLevel = 1; } resetLights(); }
resetLights();
