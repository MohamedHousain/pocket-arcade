/* Button values hold tiles. Only legal moves are used to scramble the board. */
var slideBlank = 8, slideMoves = 0, slideDeal = 0, slideWon = false;
function slideCell(i) { return document.getElementById("tile-" + i); }
function besideBlank(i) {
    if (i == slideBlank - 3 || i == slideBlank + 3) { return true; }
    return parseInt(i / 3) == parseInt(slideBlank / 3) && (i == slideBlank - 1 || i == slideBlank + 1);
}
function refreshTiles() {
    var i = 0;
    while (i < 9) {
        var tile = slideCell(i); tile.className = "slide-tile"; tile.disabled = slideWon; tile.textContent = tile.value;
        if (i == slideBlank) { tile.textContent = ""; tile.className += " empty"; tile.disabled = true; tile.setAttribute("aria-label", "Empty square"); }
        else { tile.setAttribute("aria-label", "Tile " + tile.value); if (besideBlank(i)) { tile.className += " movable"; } }
        i++;
    }
    document.getElementById("slide-moves").textContent = slideMoves;
}
function shiftTile(i) { slideCell(slideBlank).value = slideCell(i).value; slideCell(i).value = 0; slideBlank = i; }
function solvedTiles() { var i = 0; while (i < 8) { if (slideCell(i).value != i + 1) { return false; } i++; } return slideCell(8).value == 0; }
function slideTile(i) {
    if (slideWon || i == slideBlank) { return; }
    if (!besideBlank(i)) { document.getElementById("slide-status").textContent = "Only a tile next to the empty square can move."; return; }
    shiftTile(i); slideMoves++;
    if (solvedTiles()) {
        slideWon = true;
        document.getElementById("slide-status").textContent = "Back in order! Solved in " + slideMoves + " moves.";
        document.getElementById("slide-status").className = "game-status success";
    } else { document.getElementById("slide-status").textContent = "Keep arranging the tiles from 1 to 8."; }
    refreshTiles();
}
function shuffleSlides() {
    slideDeal++; slideMoves = 0; slideWon = false; slideBlank = 8;
    var i = 0; while (i < 9) { slideCell(i).value = i + 1; i++; } slideCell(8).value = 0;
    var seed = (slideDeal * 97 + 13) % 256, previousBlank = -1, moves = 0, attempts = 0;
    // Use the high two bits of a full-period arithmetic sequence. A separate
    // attempt limit guarantees this setup loop can never block the page.
    while (moves < 60 && attempts < 2000) {
        attempts++;
        seed = (seed * 17 + 11) % 256;
        var direction = parseInt(seed / 64), next = slideBlank - 3;
        if (direction == 1) { next = slideBlank + 3; } if (direction == 2) { next = slideBlank - 1; } if (direction == 3) { next = slideBlank + 1; }
        if (next >= 0 && next < 9 && next != previousBlank && besideBlank(next)) { previousBlank = slideBlank; shiftTile(next); moves++; }
    }
    if (solvedTiles()) { shiftTile(7); }
    refreshTiles();
    document.getElementById("slide-status").textContent = "Click a raised tile beside the empty space. This board is solvable.";
    document.getElementById("slide-status").className = "game-status"; beginSessionRound("sliding");
}
shuffleSlides();
