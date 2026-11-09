var slideTiles = [];
var slideMoves = 0;
var slideDone = false;
var slideBoard = document.getElementById("slide-board");
var slideStatus = document.getElementById("slide-status");

function renderSlide() {
    slideBoard.innerHTML = "";
    for (var i = 0; i < slideTiles.length; i++) {
        if (slideTiles[i] == 0) {
            var empty = document.createElement("span");
            empty.className = "slide-empty";
            empty.setAttribute("aria-label", "Empty square");
            slideBoard.appendChild(empty);
        } else {
            var tile = document.createElement("button");
            tile.type = "button";
            tile.className = "slide-tile";
            tile.textContent = slideTiles[i];
            tile.setAttribute("aria-label", "Move tile " + slideTiles[i]);
            tile.setAttribute("data-index", i);
            tile.disabled = slideDone;
            tile.addEventListener("click", function () { moveSlide(parseInt(this.getAttribute("data-index"))); });
            slideBoard.appendChild(tile);
        }
    }
    document.getElementById("slide-moves").textContent = slideMoves;
}

function moveSlide(index) {
    if (slideDone) { return; }
    var blank = slideTiles.indexOf(0);
    var sameRow = parseInt(index / 4) == parseInt(blank / 4);
    var nextTo = (sameRow && Math.abs(index - blank) == 1) || Math.abs(index - blank) == 4;
    if (!nextTo) {
        slideStatus.textContent = "Choose a tile beside the empty square.";
        slideStatus.className = "game-status error";
        return;
    }
    slideTiles[blank] = slideTiles[index];
    slideTiles[index] = 0;
    slideMoves++;
    slideDone = slideTiles.slice(0, 15).every(function (value, i) { return value == i + 1; }) && slideTiles[15] == 0;
    slideStatus.textContent = slideDone ? "Solved in " + slideMoves + (slideMoves == 1 ? " move." : " moves.") : "Choose a tile beside the empty square.";
    slideStatus.className = slideDone ? "game-status success" : "game-status";
    renderSlide();
    if (slideDone && window.ArcadeProgress) {
        window.ArcadeProgress.record({ game: "Number Slide", result: "Puzzle solved in " + slideMoves + " moves", outcome: "win", metric: slideMoves });
    }
}

function newSlidePuzzle() {
    slideTiles = [];
    for (var i = 1; i <= 15; i++) { slideTiles.push(i); }
    slideTiles.push(0);
    var blank = 15;
    var previous = -1;
    for (var step = 0; step < 90; step++) {
        var options = [];
        if (blank >= 4) { options.push(blank - 4); }
        if (blank < 12) { options.push(blank + 4); }
        if (blank % 4 > 0) { options.push(blank - 1); }
        if (blank % 4 < 3) { options.push(blank + 1); }
        var available = options.filter(function (value) { return value != previous; });
        var chosen = available[parseInt(Math.random() * available.length)];
        slideTiles[blank] = slideTiles[chosen];
        slideTiles[chosen] = 0;
        previous = blank;
        blank = chosen;
    }
    slideMoves = 0;
    slideDone = false;
    slideStatus.textContent = "Choose a tile beside the empty square.";
    slideStatus.className = "game-status";
    renderSlide();
}

document.getElementById("slide-new").addEventListener("click", newSlidePuzzle);
newSlidePuzzle();
