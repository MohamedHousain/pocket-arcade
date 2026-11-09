/* TIC-TAC-TOE: the nine button labels form the board. Local two-player game.
   Variables keep scores only while this page is open. */
var ticPlayer = "X";
var ticStarter = "O";
var ticMoves = 0;
var ticEnded = false;
var xWins = 0;
var oWins = 0;
var ticDraws = 0;

function ticCell(index) { return document.getElementById("ttt-" + index); }

function ticLine(a, b, c) {
    if (ticCell(a).textContent == ticPlayer && ticCell(b).textContent == ticPlayer && ticCell(c).textContent == ticPlayer) {
        ticCell(a).className += " winning";
        ticCell(b).className += " winning";
        ticCell(c).className += " winning";
        return true;
    }
    return false;
}

function updateTicScores() {
    document.getElementById("x-wins").textContent = xWins;
    document.getElementById("o-wins").textContent = oWins;
    document.getElementById("ttt-draws").textContent = ticDraws;
}

function placeMark(index) {
    if (ticEnded || ticCell(index).textContent != "") { return; }
    var cell = ticCell(index);
    cell.textContent = ticPlayer;
    cell.disabled = true;
    cell.setAttribute("aria-label", "Square " + index + ": " + ticPlayer);
    if (ticPlayer == "O") { cell.className = "ttt-cell mark-o"; }
    ticMoves++;
    var won = false;
    if (ticLine(1, 2, 3)) { won = true; }
    if (ticLine(4, 5, 6)) { won = true; }
    if (ticLine(7, 8, 9)) { won = true; }
    if (ticLine(1, 4, 7)) { won = true; }
    if (ticLine(2, 5, 8)) { won = true; }
    if (ticLine(3, 6, 9)) { won = true; }
    if (ticLine(1, 5, 9)) { won = true; }
    if (ticLine(3, 5, 7)) { won = true; }
    var status = document.getElementById("ttt-status");
    if (won) {
        ticEnded = true;
        if (ticPlayer == "X") { xWins++; } else { oWins++; }
        status.textContent = "Player " + ticPlayer + " wins! Start a new round to play again.";
        status.className = "game-status success";
        document.getElementById("ttt-turn").textContent = ticPlayer + " takes this round";
        if (window.ArcadeProgress) {
            window.ArcadeProgress.record({ game: "Tic-tac-toe", result: "Player " + ticPlayer + " won", outcome: "win", winner: ticPlayer });
        }
    } else if (ticMoves == 9) {
        ticEnded = true;
        ticDraws++;
        status.textContent = "A draw. All nine squares are filled. Time for a rematch?";
        document.getElementById("ttt-turn").textContent = "Honours even";
        if (window.ArcadeProgress) {
            window.ArcadeProgress.record({ game: "Tic-tac-toe", result: "Draw", outcome: "draw" });
        }
    }
    if (ticEnded) {
        var i = 1;
        while (i <= 9) { ticCell(i).disabled = true; i++; }
        updateTicScores();
    } else {
        if (ticPlayer == "X") { ticPlayer = "O"; } else { ticPlayer = "X"; }
        status.textContent = "Player " + ticPlayer + ", choose an empty square.";
        document.getElementById("ttt-turn").textContent = ticPlayer + " to play";
    }
}

function newTicRound() {
    if (ticStarter == "X") { ticStarter = "O"; } else { ticStarter = "X"; }
    ticPlayer = ticStarter;
    ticMoves = 0;
    ticEnded = false;
    var index = 1;
    while (index <= 9) {
        var cell = ticCell(index);
        cell.textContent = "";
        cell.disabled = false;
        cell.className = "ttt-cell";
        cell.setAttribute("aria-label", "Square " + index + ": empty");
        index++;
    }
    document.getElementById("ttt-turn").textContent = ticPlayer + " goes first";
    document.getElementById("ttt-status").textContent = "Player " + ticPlayer + ", choose an empty square.";
    document.getElementById("ttt-status").className = "game-status";
}

function resetTicMatch() {
    xWins = 0;
    oWins = 0;
    ticDraws = 0;
    ticStarter = "O";
    updateTicScores();
    newTicRound();
}

resetTicMatch();
