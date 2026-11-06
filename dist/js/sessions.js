/* Session snapshots exist only as rows in this document. No storage, cookies,
   network, JSON or arrays. Refreshing creates an empty document again. */
var savedSessionCount = 0;
function beginSessionRound(game) {
    var button = document.getElementById("save-" + game);
    button.value = parseInt(button.value) + 1;
    button.textContent = "Save session";
    document.getElementById("save-note-" + game).textContent = "";
}
function sessionGameName(game) {
    if (game == "minesweeper") { return "Minesweeper"; }
    if (game == "memory") { return "Memory Match"; }
    if (game == "tictactoe") { return "Tic-tac-toe"; }
    if (game == "dots") { return "Connect the Dots"; }
    if (game == "lights") { return "Lights Out"; }
    if (game == "sliding") { return "Sliding Tiles"; }
    return "Codebreaker";
}
function sessionState(game) {
    if (game == "minesweeper" && mineEnded) { if (mineSafe == 30) { return "Won"; } return "Lost"; }
    if (game == "memory" && memoryPairs == 8) { return "Completed"; }
    if (game == "tictactoe" && ticEnded) { if (ticWinner != "") { return ticWinner + " won"; } return "Draw"; }
    if (game == "dots" && pathWon) { return "Solved"; }
    if (game == "lights" && lightWon) { return "Solved"; }
    if (game == "sliding" && slideWon) { return "Solved"; }
    if (game == "codebreaker" && codeEnded) { if (codeWon) { return "Cracked"; } return "Not cracked"; }
    return "In progress";
}
function sessionResult(game) {
    if (game == "minesweeper") { return mineSafe + "/30 safe; board " + mineLayout; }
    if (game == "memory") { return memoryPairs + "/8 pairs in " + memoryMoves + " turns"; }
    if (game == "tictactoe") { return ticMoves + " moves; match X " + xWins + ", O " + oWins + ", draws " + ticDraws; }
    if (game == "dots") { return pathCount + "/25 squares; " + pathUndos + " undos; puzzle " + pathPuzzle; }
    if (game == "lights") { return lightCount + " lights on; " + lightMoves + " moves; puzzle " + lightLevel; }
    if (game == "sliding") { return slideMoves + " moves; puzzle " + slideDeal; }
    return codeTurns + "/8 guesses; code " + codeDeal;
}
function sessionTextCell(row, text) {
    var cell = document.createElement("td"); cell.textContent = text; row.appendChild(cell);
}
function updateSessionCount() {
    document.getElementById("session-count").textContent = savedSessionCount;
    document.getElementById("session-tab-count").textContent = savedSessionCount;
    document.getElementById("session-table").style.display = "table";
    document.getElementById("session-empty").style.display = "none";
    if (savedSessionCount == 0) {
        document.getElementById("session-table").style.display = "none";
        document.getElementById("session-empty").style.display = "block";
    }
}
function saveSession(game) {
    var button = document.getElementById("save-" + game);
    var key = "saved-" + game + "-" + button.value;
    var row = document.getElementById(key);
    if (row == null) {
        row = document.createElement("tr"); row.id = key;
        document.getElementById("session-rows").appendChild(row); savedSessionCount++;
    } else {
        while (row.firstChild) { row.removeChild(row.firstChild); }
    }
    sessionTextCell(row, sessionGameName(game)); sessionTextCell(row, button.value);
    sessionTextCell(row, sessionState(game)); sessionTextCell(row, sessionResult(game));
    var cell = document.createElement("td"), remove = document.createElement("button");
    remove.type = "button"; remove.className = "control"; remove.textContent = "Remove";
    remove.setAttribute("onclick", "removeSession('" + key + "')");
    remove.setAttribute("aria-label", "Remove " + sessionGameName(game) + " round " + button.value);
    cell.appendChild(remove); row.appendChild(cell);
    button.textContent = "Update saved session";
    document.getElementById("save-note-" + game).textContent = "Round " + button.value + " saved for this visit. Save again to update this snapshot.";
    document.getElementById("session-message").textContent = "";
    updateSessionCount();
}
function removeSession(key) {
    var row = document.getElementById(key);
    if (row == null) { return; }
    row.parentNode.removeChild(row); savedSessionCount--;
    updateSessionCount();
    document.getElementById("session-message").textContent = "Saved result removed. The current game is unchanged.";
}
