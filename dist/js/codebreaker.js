/* Four different colours. Compare position matches and misplaced colours. */
var codeDeal = 0, codeTurns = 0, codeEnded = false, codeWon = false;
function codePeg(i) { return document.getElementById("guess-" + i); }
function secretColour(i) {
    if (codeDeal == 1) { if (i == 0) { return 2; } if (i == 1) { return 5; } if (i == 2) { return 1; } return 4; }
    if (codeDeal == 2) { if (i == 0) { return 0; } if (i == 1) { return 3; } if (i == 2) { return 5; } return 2; }
    if (i == 0) { return 4; } if (i == 1) { return 1; } if (i == 2) { return 3; } return 0;
}
function colourName(n) {
    if (n == 0) { return "Red"; } if (n == 1) { return "Blue"; } if (n == 2) { return "Gold"; }
    if (n == 3) { return "Green"; } if (n == 4) { return "Purple"; } return "Orange";
}
function colourLetter(n) {
    if (n == 0) { return "R"; } if (n == 1) { return "B"; } if (n == 2) { return "Y"; }
    if (n == 3) { return "G"; } if (n == 4) { return "P"; } return "O";
}
function cyclePeg(i) {
    if (codeEnded) { return; }
    var peg = codePeg(i), colour = (parseInt(peg.value) + 1) % 6;
    peg.value = colour; peg.textContent = colourLetter(colour); peg.className = "code-peg colour-" + colour;
    peg.setAttribute("aria-label", "Position " + (i + 1) + ": " + colourName(colour) + ". Click to change.");
}
function codeMessage(text, kind) { document.getElementById("code-status").textContent = text; document.getElementById("code-status").className = "game-status " + kind; }
function codeTextCell(row, text) { var cell = document.createElement("td"); cell.textContent = text; row.appendChild(cell); }
function checkCode() {
    if (codeEnded) { return; }
    var i = 0;
    while (i < 4) {
        if (codePeg(i).value < 0) { codeMessage("Choose all four colours first. No guess used.", "error"); return; }
        var j = 0;
        while (j < i) { if (codePeg(j).value == codePeg(i).value) { codeMessage("Use four different colours. No guess used.", "error"); return; } j++; }
        i++;
    }
    var exact = 0, misplaced = 0; i = 0;
    while (i < 4) {
        if (codePeg(i).value == secretColour(i)) { exact++; }
        else { var p = 0; while (p < 4) { if (codePeg(i).value == secretColour(p)) { misplaced++; } p++; } }
        i++;
    }
    codeTurns++;
    var row = document.createElement("tr"); codeTextCell(row, codeTurns);
    var guesses = document.createElement("td"); i = 0;
    while (i < 4) {
        var badge = document.createElement("span"); badge.className = "code-chip colour-" + codePeg(i).value;
        badge.textContent = colourLetter(codePeg(i).value); badge.setAttribute("aria-label", colourName(codePeg(i).value)); guesses.appendChild(badge); i++;
    }
    row.appendChild(guesses); codeTextCell(row, exact); codeTextCell(row, misplaced);
    document.getElementById("code-history").appendChild(row); document.getElementById("code-turns").textContent = codeTurns;
    codeMessage(exact + " in the right place, " + misplaced + " in the wrong place. Use the clues for your next guess.", "");
    if (exact == 4 || codeTurns == 8) {
        codeEnded = true; codeWon = exact == 4;
        if (codeWon) { codeMessage("Code cracked in " + codeTurns + " guesses!", "success"); }
        else { codeMessage("Eight guesses used. The code is revealed below.", "error"); }
        document.getElementById("code-secret").textContent = "The code: " + colourName(secretColour(0)) + ", " + colourName(secretColour(1)) + ", " + colourName(secretColour(2)) + ", " + colourName(secretColour(3)) + ".";
        document.getElementById("code-check").disabled = true;
        i = 0; while (i < 4) { codePeg(i).disabled = true; i++; }
    }
}
function newCode() {
    codeDeal++; if (codeDeal > 3) { codeDeal = 1; } codeTurns = 0; codeEnded = false; codeWon = false;
    var i = 0;
    while (i < 4) {
        var peg = codePeg(i); peg.value = -1; peg.textContent = "?"; peg.className = "code-peg unset"; peg.disabled = false;
        peg.setAttribute("aria-label", "Position " + (i + 1) + ": choose a colour"); i++;
    }
    var history = document.getElementById("code-history"); while (history.firstChild) { history.removeChild(history.firstChild); }
    document.getElementById("code-check").disabled = false; document.getElementById("code-turns").textContent = 0;
    document.getElementById("code-deal").textContent = codeDeal; document.getElementById("code-secret").textContent = "";
    codeMessage("Choose four different colours, then check your code.", ""); beginSessionRound("codebreaker");
}
newCode();
