/* Connect all checkpoints in order while visiting each square exactly once.
   Button values store visit order; no array or drawing library is needed. */
var pathPuzzle = 1, pathCurrent = 0, pathCount = 1, pathNext = 2, pathUndos = 0, pathWon = false;
function pathCell(i) { return document.getElementById("path-" + i); }
function checkpoint(i) {
    if (pathPuzzle == 1) {
        if (i == 0) { return 1; } if (i == 11) { return 2; } if (i == 17) { return 3; } if (i == 13) { return 4; } if (i == 4) { return 5; }
    } else if (pathPuzzle == 2) {
        if (i == 12) { return 1; } if (i == 11) { return 2; } if (i == 17) { return 3; } if (i == 13) { return 4; } if (i == 14) { return 5; }
    } else {
        if (i == 20) { return 1; } if (i == 1) { return 2; } if (i == 7) { return 3; } if (i == 19) { return 4; } if (i == 24) { return 5; }
    }
    return 0;
}
function pathLink(a, b) {
    if (a < b) { return document.getElementById("path-link-" + a + "-" + b); }
    return document.getElementById("path-link-" + b + "-" + a);
}
function pathAdjacent(a, b) {
    if (a == b + 5 || a == b - 5) { return true; }
    return parseInt(a / 5) == parseInt(b / 5) && (a == b + 1 || a == b - 1);
}
function pathMessage(text, kind) {
    document.getElementById("path-status").textContent = text;
    document.getElementById("path-status").className = "game-status " + kind;
}
function updatePath() {
    document.getElementById("path-count").textContent = pathCount;
    document.getElementById("path-next").textContent = pathNext;
    if (pathWon) { document.getElementById("path-next").textContent = "Done"; }
    document.getElementById("path-undos").textContent = pathUndos;
    document.getElementById("path-puzzle").textContent = pathPuzzle;
    document.getElementById("path-undo").disabled = pathCount == 1 || pathWon;
}
function extendPath(i) {
    if (pathWon || i == pathCurrent) { return; }
    if (pathCount > 1 && pathCell(i).value == pathCount - 1) { undoPath(); return; }
    if (pathCell(i).value > 0) { pathMessage("You cannot revisit or cross the route. Undo to change it.", "error"); return; }
    if (!pathAdjacent(i, pathCurrent)) { pathMessage("Choose a square beside the end of your route. No diagonal moves.", "error"); return; }
    var clue = checkpoint(i);
    if (clue > 0 && clue != pathNext) { pathMessage("Reach checkpoint " + pathNext + " first.", "error"); return; }
    if (clue == 5 && pathCount < 24) { pathMessage("Checkpoint 5 is the finish. Fill every other square first.", "error"); return; }
    pathCell(pathCurrent).className = "path-cell visited";
    pathLink(pathCurrent, i).style.display = "block";
    pathCurrent = i; pathCount++;
    pathCell(i).value = pathCount; pathCell(i).className = "path-cell visited current";
    if (clue > 0) { pathNext++; }
    pathMessage("Keep room for checkpoint " + pathNext + ". Use every square once.", "");
    if (pathCount == 25 && clue == 5) {
        pathWon = true;
        pathMessage("Route complete! All 25 squares visited. Undos used: " + pathUndos + ".", "success");
    } else {
        var possible = 0, j = 0;
        while (j < 25) {
            var nextClue = checkpoint(j);
            if (pathCell(j).value == 0 && pathAdjacent(j, i) && (nextClue == 0 || nextClue == pathNext)) {
                if (nextClue != 5 || pathCount == 24) { possible++; }
            }
            j++;
        }
        if (possible == 0) { pathMessage("A dead end. Undo a step and try another direction.", "error"); }
    }
    updatePath();
}
function undoPath() {
    if (pathCount == 1 || pathWon) { return; }
    var previous = 0;
    while (pathCell(previous).value != pathCount - 1) { previous++; }
    if (checkpoint(pathCurrent) > 0) { pathNext--; }
    pathLink(pathCurrent, previous).style.display = "none";
    pathCell(pathCurrent).value = 0; pathCell(pathCurrent).className = "path-cell";
    if (checkpoint(pathCurrent) > 0) { pathCell(pathCurrent).className += " checkpoint"; }
    pathCurrent = previous; pathCell(previous).className = "path-cell visited current";
    pathCount--; pathUndos++;
    pathMessage("One step back. Try a different route to checkpoint " + pathNext + ".", ""); updatePath();
}
function resetPath() {
    pathCount = 1; pathNext = 2; pathUndos = 0; pathWon = false;
    var i = 0;
    while (i < 25) {
        var cell = pathCell(i), clue = checkpoint(i);
        cell.value = 0; cell.textContent = ""; cell.className = "path-cell";
        if (clue > 0) { cell.textContent = clue; cell.className += " checkpoint"; }
        cell.setAttribute("aria-label", "Row " + (parseInt(i / 5) + 1) + ", column " + (i % 5 + 1) + ", checkpoint " + clue);
        if (clue == 1) { pathCurrent = i; cell.value = 1; cell.className = "path-cell visited current"; }
        if (i % 5 < 4) { pathLink(i, i + 1).style.display = "none"; }
        if (i < 20) { pathLink(i, i + 5).style.display = "none"; }
        i++;
    }
    updatePath(); pathMessage("Start at 1. Connect checkpoints in order and fill every square.", "");
    beginSessionRound("dots");
}
function nextPathPuzzle() { pathPuzzle++; if (pathPuzzle > 3) { pathPuzzle = 1; } resetPath(); }
resetPath();
