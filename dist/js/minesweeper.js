/* MINESWEEPER: var, arithmetic, if/else and while are the course foundation.
   Approved additions: functions, onclick handlers and DOM updates.
   Each HTML button stores covered/open/flagged in its value. No arrays. */
var mineLayout = 1;
var mineEnded = false;
var mineFlagMode = false;
var mineSafe = 0;
var mineFlags = 0;

function mineCell(index) { return document.getElementById("mine-" + index); }

// Three prepared layouts. Index 0 is always safe.
function isMine(index) {
    if (mineLayout == 1) {
        if (index == 7 || index == 10 || index == 15 || index == 22 || index == 29 || index == 32) { return true; }
    } else if (mineLayout == 2) {
        if (index == 4 || index == 12 || index == 16 || index == 21 || index == 27 || index == 35) { return true; }
    } else {
        if (index == 3 || index == 8 || index == 19 || index == 23 || index == 26 || index == 34) { return true; }
    }
    return false;
}

function adjacentMines(index) {
    var row = parseInt(index / 6);
    var column = index % 6;
    var count = 0;
    var nearby = 0;
    while (nearby < 36) {
        if (isMine(nearby)) {
            var dr = row - parseInt(nearby / 6);
            var dc = column - nearby % 6;
            if (dr >= -1 && dr <= 1 && dc >= -1 && dc <= 1) { count++; }
        }
        nearby++;
    }
    return count;
}

function mineLabel(index) { return "Row " + (parseInt(index / 6) + 1) + ", column " + (index % 6 + 1); }

function showMineStatus(text, kind) {
    document.getElementById("mine-status").textContent = text;
    document.getElementById("mine-status").className = "game-status " + kind;
}

function updateMineTotals() {
    document.getElementById("mine-safe").textContent = mineSafe;
    document.getElementById("mine-flags").textContent = mineFlags;
    document.getElementById("mine-layout").textContent = mineLayout;
}

function openSafeSquare(index) {
    var button = mineCell(index);
    if (button.value != "covered" || isMine(index)) { return; }
    var count = adjacentMines(index);
    button.value = "open";
    button.className = "mine-cell open clue-" + count;
    button.textContent = "";
    if (count > 0) { button.textContent = count; }
    button.disabled = true;
    button.setAttribute("aria-label", mineLabel(index) + ": " + count + " nearby mines");
    mineSafe++;
}

// Repeat scanning until no more squares open. No recursion, queue or timer.
function expandEmptyArea() {
    var changed = true;
    while (changed) {
        var before = mineSafe;
        var index = 0;
        while (index < 36) {
            if (mineCell(index).value == "open" && adjacentMines(index) == 0) {
                var row = parseInt(index / 6);
                var column = index % 6;
                var r = row - 1;
                while (r <= row + 1) {
                    var c = column - 1;
                    while (c <= column + 1) {
                        if (r >= 0 && r < 6 && c >= 0 && c < 6) { openSafeSquare(r * 6 + c); }
                        c++;
                    }
                    r++;
                }
            }
            index++;
        }
        changed = mineSafe > before;
    }
}

function finishMines(won, hit) {
    mineEnded = true;
    var index = 0;
    while (index < 36) {
        var button = mineCell(index);
        button.disabled = true;
        if (isMine(index)) {
            button.textContent = "✹";
            button.className = "mine-cell mine";
            if (index == hit) { button.className = "mine-cell hit"; }
            button.setAttribute("aria-label", mineLabel(index) + ": mine");
        }
        index++;
    }
    if (won) { showMineStatus("Board cleared! You found all 30 safe squares. Try the next layout.", "success"); }
    else { showMineStatus("A mine ended this round. You opened " + mineSafe + " of 30 safe squares. Try again when you are ready.", "error"); }
    if (window.ArcadeProgress) {
        window.ArcadeProgress.record({
            game: "Minesweeper",
            result: won ? "Cleared layout " + mineLayout : "Hit a mine on layout " + mineLayout + " after " + mineSafe + " safe squares",
            outcome: won ? "win" : "loss"
        });
    }
}

function chooseMine(index) {
    if (mineEnded) { return; }
    var button = mineCell(index);
    if (button.value == "open") { return; }
    if (mineFlagMode) {
        if (button.value == "flagged") {
            button.value = "covered";
            button.className = "mine-cell covered";
            button.textContent = "·";
            button.setAttribute("aria-label", mineLabel(index) + ": covered");
            mineFlags--;
            showMineStatus("Flag removed. Switch to Reveal squares to open it.", "");
        } else {
            if (mineFlags >= 6) { showMineStatus("All six flags are in use. Remove a flag before placing another.", "error"); return; }
            button.value = "flagged";
            button.className = "mine-cell flagged";
            button.textContent = "⚑";
            button.setAttribute("aria-label", mineLabel(index) + ": flagged");
            mineFlags++;
            showMineStatus("Flag placed. Click it again to remove it, or switch back to Reveal squares.", "");
        }
    } else {
        if (button.value == "flagged") { showMineStatus("This square is flagged. Remove the flag in Place flags mode first.", ""); return; }
        if (isMine(index)) { finishMines(false, index); return; }
        openSafeSquare(index);
        expandEmptyArea();
        showMineStatus("Safe. Read the new clues and choose your next square.", "");
        if (mineSafe == 30) { finishMines(true, -1); }
    }
    updateMineTotals();
}

function setMineMode(flagging) {
    mineFlagMode = flagging;
    document.getElementById("reveal-mode").className = "control";
    document.getElementById("flag-mode").className = "control";
    document.getElementById("reveal-mode").setAttribute("aria-pressed", !flagging);
    document.getElementById("flag-mode").setAttribute("aria-pressed", flagging);
    if (flagging) {
        document.getElementById("flag-mode").className = "control active";
        if (!mineEnded) { showMineStatus("Flag mode: click a covered square to place or remove a flag.", ""); }
    } else {
        document.getElementById("reveal-mode").className = "control active";
        if (!mineEnded) { showMineStatus("Reveal mode: click a covered square to open it.", ""); }
    }
}

function resetMines() {
    mineEnded = false;
    mineSafe = 0;
    mineFlags = 0;
    var index = 0;
    while (index < 36) {
        var button = mineCell(index);
        button.value = "covered";
        button.textContent = "·";
        button.className = "mine-cell covered";
        button.disabled = false;
        button.setAttribute("aria-label", mineLabel(index) + ": covered");
        index++;
    }
    setMineMode(false);
    openSafeSquare(0);
    expandEmptyArea();
    updateMineTotals();
    showMineStatus("A safe opening to get you started. Click a covered square, or place a flag.", "");
}

function nextMineBoard() {
    mineLayout++;
    if (mineLayout > 3) { mineLayout = 1; }
    resetMines();
}

resetMines();
