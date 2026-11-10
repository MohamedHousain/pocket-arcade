const scoreStorageKey = "pocket-arcade-scores";
const scoreForm = document.getElementById("score-form");
const scoreStatus = document.getElementById("score-status");
const savedScores = document.getElementById("saved-scores");
const emptyScores = document.getElementById("empty-scores");
let scores = [];

function setToday() {
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
    document.getElementById("day").value = localDate.toISOString().slice(0, 10);
}

function showStorageError() {
    scoreStatus.textContent = "Scores could not be saved in this browser. Try opening the site at http://localhost:8080.";
}

function loadScores() {
    try {
        const stored = JSON.parse(localStorage.getItem(scoreStorageKey) || "[]");
        scores = Array.isArray(stored) ? stored.filter(function (score) {
            return score && typeof score === "object" && window.ArcadeProgress.isSupportedGame(score.game) && typeof score.result === "string";
        }) : [];
        if (Array.isArray(stored) && scores.length !== stored.length) localStorage.setItem(scoreStorageKey, JSON.stringify(scores));
    } catch (error) {
        scores = [];
        showStorageError();
    }
}

function saveScores(nextScores) {
    try {
        localStorage.setItem(scoreStorageKey, JSON.stringify(nextScores));
        scores = nextScores;
        return true;
    } catch (error) {
        showStorageError();
        return false;
    }
}

function renderScores() {
    savedScores.replaceChildren();
    emptyScores.hidden = scores.length > 0;

    scores.forEach(function (score, index) {
        const item = document.createElement("li");
        const title = document.createElement("strong");
        title.textContent = score.game + " — " + score.result;
        item.appendChild(title);

        const details = document.createElement("p");
        details.textContent = score.source === "game" ?
            score.day + " · Automatically saved · " + (score.outcome === "win" ? "Win" : score.outcome === "loss" ? "Loss" : "Completed") :
            score.day + " · " + (score.player || "Unnamed player") + " · Rating: " + score.rating + "/5";
        item.appendChild(details);

        if (score.notes) {
            const notes = document.createElement("p");
            notes.textContent = score.notes;
            item.appendChild(notes);
        }

        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "Delete score";
        remove.setAttribute("aria-label", "Delete score for " + score.game + " on " + score.day);
        remove.addEventListener("click", function () {
            if (window.confirm("Delete this saved score?") && saveScores(scores.filter(function (_, scoreIndex) { return scoreIndex !== index; }))) {
                renderScores();
                scoreStatus.textContent = "Score deleted.";
            }
        });
        item.appendChild(remove);
        savedScores.appendChild(item);
    });
}

scoreForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!scoreForm.reportValidity()) return;

    const score = {
        player: document.getElementById("player").value.trim(),
        day: document.getElementById("day").value,
        game: document.getElementById("game").value,
        result: document.getElementById("result").value.trim(),
        rating: document.getElementById("rating").value,
        notes: document.getElementById("notes").value.trim(),
        source: "manual"
    };
    if (!score.result) {
        scoreStatus.textContent = "Enter a result before saving.";
        return;
    }
    if (saveScores([score].concat(scores))) {
        renderScores();
        scoreStatus.textContent = "Score saved in this browser.";
        scoreForm.reset();
        setToday();
    }
});

scoreForm.addEventListener("reset", function () {
    window.setTimeout(setToday, 0);
});

setToday();
loadScores();
renderScores();
window.addEventListener("storage", function (event) {
    if (event.key === scoreStorageKey) {
        loadScores();
        renderScores();
    }
});
