var dotPuzzle = 1;
var dotNext = 1;
var dotScore = 0;
var dotMistakes = 0;
var dotStarted = false;
var dotFinished = false;

function updateDotsDisplay(message) {
    document.getElementById("dots-count").textContent = dotNext - 1;
    document.getElementById("dots-next").textContent = dotNext <= 12 ? dotNext : "Done";
    document.getElementById("dots-score").textContent = Math.max(0, dotScore);
    document.getElementById("dots-mistakes").textContent = dotMistakes;
    document.getElementById("dots-puzzle").textContent = dotPuzzle;
    document.getElementById("dots-status").textContent = message;
}

function connectDot(number) {
    if (!dotStarted || dotFinished || number < dotNext) { return; }

    if (number > dotNext) {
        dotMistakes++;
        dotScore -= 5;
        if (dotMistakes === 3) {
            dotFinished = true;
            document.getElementById("dots-board-" + dotPuzzle).classList.remove("is-playing");
            document.getElementById("dots-hint").disabled = true;
            updateDotsDisplay("Three mistakes. Start again to try this pattern.");
        } else {
            updateDotsDisplay("Not that dot. " + (3 - dotMistakes) + " mistakes left.");
        }
        return;
    }

    var button = document.getElementById("dot-" + dotPuzzle + "-" + number);
    button.classList.remove("next-dot");
    button.classList.add("connected");
    button.disabled = true;

    if (number > 1) {
        document.getElementById("line-" + dotPuzzle + "-" + number).style.display = "block";
    }

    dotScore += 10;
    dotNext++;

    if (dotNext > 12) {
        dotFinished = true;
        document.getElementById("dots-board-" + dotPuzzle).classList.remove("is-playing");
        document.getElementById("dots-hint").disabled = true;
        var closingLine = document.getElementById("closing-" + dotPuzzle);
        if (closingLine) { closingLine.style.display = "block"; }
        updateDotsDisplay("Pattern complete! You scored " + Math.max(0, dotScore) + " points.");
    } else {
        document.getElementById("dots-hint").disabled = false;
        updateDotsDisplay("Good. Find dot " + dotNext + " from memory.");
    }
}

function startDots() {
    if (dotStarted || dotFinished) { return; }
    dotStarted = true;
    document.getElementById("dots-board-" + dotPuzzle).classList.add("is-playing");
    document.getElementById("dot-" + dotPuzzle + "-1").classList.remove("next-dot");
    document.getElementById("dots-start").disabled = true;
    document.getElementById("dots-hint").disabled = false;
    updateDotsDisplay("Find dot 1. You can make two mistakes.");
}

function showDotHint() {
    if (!dotStarted || dotFinished) { return; }
    var button = document.getElementById("dot-" + dotPuzzle + "-" + dotNext);
    if (button.classList.contains("next-dot")) { return; }
    dotScore -= 10;
    button.classList.add("next-dot");
    document.getElementById("dots-hint").disabled = true;
    updateDotsDisplay("Dot " + dotNext + " is outlined. Hint costs 10 points.");
}

function resetDots() {
    dotNext = 1;
    dotScore = 0;
    dotMistakes = 0;
    dotStarted = false;
    dotFinished = false;
    document.getElementById("dots-start").disabled = false;
    document.getElementById("dots-hint").disabled = true;

    for (var puzzle = 1; puzzle <= 3; puzzle++) {
        var board = document.getElementById("dots-board-" + puzzle);
        board.style.display = puzzle === dotPuzzle ? "block" : "none";
        board.classList.remove("is-playing");
        for (var number = 1; number <= 12; number++) {
            var button = document.getElementById("dot-" + puzzle + "-" + number);
            button.classList.remove("connected", "next-dot");
            button.disabled = false;
            if (number === 1 && puzzle === dotPuzzle) { button.classList.add("next-dot"); }
            if (number > 1) {
                document.getElementById("line-" + puzzle + "-" + number).style.display = "none";
            }
        }
        var closingLine = document.getElementById("closing-" + puzzle);
        if (closingLine) { closingLine.style.display = "none"; }
    }

    updateDotsDisplay("Study the numbers, then start the challenge.");
}

function nextDotPuzzle() {
    dotPuzzle = dotPuzzle % 3 + 1;
    resetDots();
}

resetDots();
