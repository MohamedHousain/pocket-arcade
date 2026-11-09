/* MEMORY MATCH: two clicks form one turn. A button hides an unmatched pair.
   No timer or array is used. HTML card values/classes keep the board state. */
var memoryFirst = -1;
var memorySecond = -1;
var memoryPairs = 0;
var memoryMoves = 0;
var memoryBest = 0;
var memoryDeal = 0;

function memoryCard(index) { return document.getElementById("card-" + index); }

function pairForPosition(index) {
    // Odd multiplier: all sixteen positions are visited. Each pair occurs twice.
    var position = (index * 5 + memoryDeal * 3) % 16;
    if (position == 0 || position == 11) { return 1; }
    if (position == 1 || position == 6) { return 2; }
    if (position == 2 || position == 15) { return 3; }
    if (position == 3 || position == 9) { return 4; }
    if (position == 4 || position == 13) { return 5; }
    if (position == 5 || position == 8) { return 6; }
    if (position == 7 || position == 12) { return 7; }
    return 8;
}

function pairSymbol(pair) {
    if (pair == 1) { return "★"; }
    if (pair == 2) { return "♥"; }
    if (pair == 3) { return "♣"; }
    if (pair == 4) { return "☀"; }
    if (pair == 5) { return "♫"; }
    if (pair == 6) { return "◆"; }
    if (pair == 7) { return "☂"; }
    return "✿";
}

function pairName(pair) {
    if (pair == 1) { return "star"; }
    if (pair == 2) { return "heart"; }
    if (pair == 3) { return "club"; }
    if (pair == 4) { return "sun"; }
    if (pair == 5) { return "music notes"; }
    if (pair == 6) { return "diamond"; }
    if (pair == 7) { return "umbrella"; }
    return "flower";
}

function memoryMessage(text, kind) {
    document.getElementById("memory-status").textContent = text;
    document.getElementById("memory-status").className = "game-status " + kind;
}

function updateMemoryTotals() {
    document.getElementById("memory-pairs").textContent = memoryPairs;
    document.getElementById("memory-moves").textContent = memoryMoves;
    document.getElementById("memory-deal").textContent = memoryDeal;
    if (memoryBest > 0) { document.getElementById("memory-best").textContent = memoryBest + " turns"; }
}

function flipCard(index) {
    if (memoryPairs == 8) { return; }
    if (memorySecond != -1) { memoryMessage("Click Turn cards over before choosing another pair.", ""); return; }
    var card = memoryCard(index);
    if (card.className != "memory-card face-down") { return; }
    card.className = "memory-card face-up";
    card.textContent = pairSymbol(card.value);
    card.setAttribute("aria-label", "Card " + (index + 1) + ": " + pairName(card.value));
    if (memoryFirst == -1) {
        memoryFirst = index;
        memoryMessage("Now choose a second card.", "");
        return;
    }
    memorySecond = index;
    memoryMoves++;
    if (memoryCard(memoryFirst).value == card.value) {
        memoryCard(memoryFirst).className = "memory-card matched";
        memoryCard(memoryFirst).disabled = true;
        card.className = "memory-card matched";
        card.disabled = true;
        memoryPairs++;
        memoryFirst = -1;
        memorySecond = -1;
        memoryMessage("A pair! Choose two more cards.", "success");
        if (memoryPairs == 8) {
            if (memoryBest == 0 || memoryMoves < memoryBest) { memoryBest = memoryMoves; }
            memoryMessage("All eight pairs found in " + memoryMoves + " turns. Try another deal when you are ready.", "success");
            if (window.ArcadeProgress) {
                window.ArcadeProgress.record({ game: "Memory Match", result: "8 pairs in " + memoryMoves + " turns", outcome: "win", metric: memoryMoves });
            }
        }
    } else {
        document.getElementById("memory-hide").disabled = false;
        memoryMessage("Not a pair. Remember their places, then click Turn cards over.", "");
    }
    updateMemoryTotals();
}

function hideMemoryPair() {
    if (memorySecond == -1) { return; }
    var card = memoryCard(memoryFirst);
    card.className = "memory-card face-down";
    card.textContent = "?";
    card.setAttribute("aria-label", "Card " + (memoryFirst + 1) + ": face down");
    card = memoryCard(memorySecond);
    card.className = "memory-card face-down";
    card.textContent = "?";
    card.setAttribute("aria-label", "Card " + (memorySecond + 1) + ": face down");
    memoryFirst = -1;
    memorySecond = -1;
    document.getElementById("memory-hide").disabled = true;
    memoryMessage("Choose two cards to look for a pair.", "");
}

function newMemoryDeal() {
    memoryDeal++;
    if (memoryDeal > 3) { memoryDeal = 1; }
    memoryFirst = -1;
    memorySecond = -1;
    memoryPairs = 0;
    memoryMoves = 0;
    var index = 0;
    while (index < 16) {
        var card = memoryCard(index);
        card.value = pairForPosition(index);
        card.textContent = "?";
        card.className = "memory-card face-down";
        card.disabled = false;
        card.setAttribute("aria-label", "Card " + (index + 1) + ": face down");
        index++;
    }
    document.getElementById("memory-hide").disabled = true;
    updateMemoryTotals();
    memoryMessage("Choose two cards to look for a pair.", "");
}

newMemoryDeal();
