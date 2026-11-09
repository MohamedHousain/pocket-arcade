var lightsSeed = [1,0,1,0,0, 0,0,1,1,0, 0,0,1,0,0, 0,1,1,0,0, 0,0,1,0,1];
var lights = lightsSeed.slice();
var lightsMoves = 0;
var lightsDone = false;
var lightsBoard = document.getElementById("lights-board");
var lightsStatus = document.getElementById("lights-status");

function drawLights() {
    var onCount = 0;
    for (var i = 0; i < lights.length; i++) {
        if (lights[i] == 1) { onCount++; }
        var button = lightsBoard.children[i];
        button.className = lights[i] == 1 ? "light-cell is-on" : "light-cell";
        button.setAttribute("aria-pressed", lights[i] == 1 ? "true" : "false");
        button.setAttribute("aria-label", "Row " + (parseInt(i / 5) + 1) + ", column " + (i % 5 + 1) + (lights[i] == 1 ? ": on" : ": off"));
        button.disabled = lightsDone;
    }
    document.getElementById("lights-moves").textContent = lightsMoves;
    document.getElementById("lights-count").textContent = onCount;
    if (lightsDone) { lightsStatus.textContent = "All lights are off. Solved in " + lightsMoves + " moves."; lightsStatus.className = "game-status success"; }
}

function changeLights(index) {
    if (lightsDone) { return; }
    var row = parseInt(index / 5);
    var column = index % 5;
    var positions = [[row, column], [row - 1, column], [row + 1, column], [row, column - 1], [row, column + 1]];
    for (var i = 0; i < positions.length; i++) {
        var r = positions[i][0];
        var c = positions[i][1];
        if (r >= 0 && r < 5 && c >= 0 && c < 5) {
            var target = r * 5 + c;
            lights[target] = lights[target] == 1 ? 0 : 1;
        }
    }
    lightsMoves++;
    lightsDone = lights.every(function (value) { return value == 0; });
    lightsStatus.textContent = lightsDone ? "" : "Keep going. Each move flips a cross of lights.";
    lightsStatus.className = "game-status";
    drawLights();
    if (lightsDone && window.ArcadeProgress) {
        window.ArcadeProgress.record({ game: "Lights Out", result: "All lights off in " + lightsMoves + " moves", outcome: "win", metric: lightsMoves });
    }
}

function resetLights() {
    lights = lightsSeed.slice();
    lightsMoves = 0;
    lightsDone = false;
    lightsStatus.textContent = "Choose a light to begin.";
    lightsStatus.className = "game-status";
    drawLights();
}

document.getElementById("lights-reset").addEventListener("click", resetLights);
for (var i = 0; i < 25; i++) {
    var lightButton = document.createElement("button");
    lightButton.type = "button";
    lightButton.className = "light-cell";
    lightButton.setAttribute("data-square", i);
    lightsBoard.appendChild(lightButton);
}
lightsBoard.addEventListener("click", function (event) {
    var button = event.target.closest(".light-cell");
    if (button && lightsBoard.contains(button)) {
        changeLights(Number(button.getAttribute("data-square")));
    }
});
drawLights();
