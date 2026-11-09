(function () {
    const storageKey = "pocket-arcade-scores";
    const recordTypes = {
        "Memory Match": { direction: "low", unit: "turns" },
        "Connect the Dots": { direction: "high", unit: "points" },
        "Lights Out": { direction: "low", unit: "moves" },
        "Code Guess": { direction: "low", unit: "attempts" },
        "Number Slide": { direction: "low", unit: "moves" }
    };

    function readScores() {
        try {
            const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
            return Array.isArray(saved) ? saved.filter(function (score) {
                return score && typeof score === "object" && typeof score.game === "string" && typeof score.result === "string";
            }) : [];
        } catch (error) {
            return [];
        }
    }

    function localDay() {
        const today = new Date();
        const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
        return localDate.toISOString().slice(0, 10);
    }

    function ticWinner(score) {
        if (score.winner === "X" || score.winner === "O") return score.winner;
        if (score.result === "Player X won") return "X";
        if (score.result === "Player O won") return "O";
        return null;
    }

    function bestFor(game, scores) {
        const rounds = scores.filter(function (score) { return score.source === "game" && score.game === game; });
        if (game === "Tic-tac-toe") {
            if (!rounds.length) return null;
            const x = rounds.filter(function (score) { return ticWinner(score) === "X"; }).length;
            const o = rounds.filter(function (score) { return ticWinner(score) === "O"; }).length;
            const draws = rounds.filter(function (score) { return score.outcome === "draw"; }).length;
            return { value: rounds.length, label: "X " + x + " · O " + o + " · Draws " + draws };
        }
        const type = recordTypes[game];
        if (type) {
            const values = rounds.filter(function (score) {
                return (game === "Connect the Dots" || score.outcome === "win") &&
                    typeof score.metric === "number" && Number.isFinite(score.metric);
            }).map(function (score) { return score.metric; });
            if (!values.length) return null;
            const value = type.direction === "low" ? Math.min.apply(null, values) : Math.max.apply(null, values);
            return { value: value, label: "Best: " + value + " " + type.unit };
        }
        const wins = rounds.filter(function (score) { return score.outcome === "win"; }).length;
        return wins ? { value: wins, label: wins + (wins === 1 ? " win saved" : " wins saved") } : null;
    }

    function showHomeRecords() {
        const scores = readScores();
        document.querySelectorAll(".game-card").forEach(function (card) {
            const game = card.querySelector("h3").textContent.trim();
            const copy = card.querySelector(".game-card-copy");
            const playLink = copy.querySelector(".play-link");
            const best = bestFor(game, scores);
            let stamp = copy.querySelector(".record-stamp");
            if (!stamp) {
                stamp = document.createElement("a");
                stamp.className = "record-stamp";
                stamp.href = "scorecard.html?v=10#saved-heading";
                copy.insertBefore(stamp, playLink);
            }
            stamp.textContent = best ? "★ " + best.label : "☆ No record yet";
            stamp.classList.toggle("is-empty", !best);
            stamp.setAttribute("aria-label", game + ": " + (best ? best.label : "no record yet") + ". View score sheet.");
        });
    }

    function recordRound(round) {
        const previous = readScores();
        const before = bestFor(round.game, previous);
        const entry = {
            player: "",
            day: localDay(),
            game: round.game,
            result: round.result,
            rating: "",
            notes: "",
            source: "game",
            outcome: round.outcome
        };
        if (typeof round.metric === "number" && Number.isFinite(round.metric)) entry.metric = round.metric;
        if (round.winner === "X" || round.winner === "O") entry.winner = round.winner;

        let saved = false;
        try {
            localStorage.setItem(storageKey, JSON.stringify([entry].concat(previous)));
            saved = true;
        } catch (error) {
            saved = false;
        }

        const after = saved ? bestFor(round.game, [entry].concat(previous)) : before;
        const improved = saved && round.game !== "Tic-tac-toe" && after &&
            (!before || (recordTypes[round.game] && after.value !== before.value));
        const status = document.querySelector(".game-shell .game-status");
        if (status) {
            status.textContent += saved ? (improved ? " New record saved to your score sheet!" : " Saved to your score sheet.") :
                " This round could not be saved in this browser.";
        }
        if (round.outcome === "win") {
            const shell = document.querySelector(".game-shell");
            if (shell) {
                shell.classList.remove("celebrate");
                void shell.offsetWidth;
                shell.classList.add("celebrate");
                window.setTimeout(function () { shell.classList.remove("celebrate"); }, 1500);
            }
        }
        return saved;
    }

    window.ArcadeProgress = { record: recordRound, read: readScores, bestFor: bestFor, ticWinner: ticWinner };
    if (document.querySelector(".game-card")) {
        showHomeRecords();
        window.addEventListener("pageshow", showHomeRecords);
        window.addEventListener("storage", showHomeRecords);
    }
}());
