# Pocket Arcade

Seven mouse-controlled games, built with plain HTML, CSS and JavaScript. All gameplay and saved session results share one arcade page. No libraries, frameworks, accounts, browser storage or backend.

## Open the current version

Visit http://localhost:8080/arcade.html after starting the local server. The server serves the `dist` folder.

If the server is not running, double-click `Start Local Website.cmd` and leave its window open. The launcher uses the existing Python installation only to serve static files. Python is not part of the website or game logic. You can also open `dist/index.html` directly in a browser with JavaScript enabled.

On other operating systems, run `python -m http.server 8080 --bind 127.0.0.1 --directory dist` from the repository folder. Python 3 is needed only for local hosting; opening `dist/index.html` directly does not need Python.

## Games

- Minesweeper: reveal/flag controls and three 6 by 6 practice layouts.
- Memory Match: eight pairs, three prepared deals and manual hiding of mismatches.
- Tic-tac-toe: two people sharing the screen, with alternating starters and match scores.
- Connect the Dots: a 5 by 5 route puzzle; connect checkpoints 1–5 in order while visiting every square once. Includes undo and three verified puzzles.
- Lights Out: cross-toggle puzzles with three solvable starting patterns.
- Sliding Tiles: arrange 1–8 using the empty square; scrambles are generated through legal moves.
- Codebreaker: deduce four different colours in eight guesses using position clues.

## Save session

Click **Save session** on any board to record that round's current result. Incomplete rounds can be saved too. Saving the same round again updates its row. Starting a new round produces a separate entry. Open **Saved sessions** using the tabs inside the arcade to view or remove entries.

Game tabs change visible sections without reloading the document. All game state and snapshots remain in memory while the page stays loaded. Refreshing starts a new visit with no saved results. Closing the tab discards the visit. Navigating elsewhere may discard it; browser Back/Forward can sometimes restore an old document, so use the arcade tabs when you want to keep playing.

Snapshots are result records, not restorable copies of past boards. Current game boards stay as they are when you switch tabs. The browser's Print command can produce a lasting paper or PDF record of the sessions table.

## Files

- `dist/index.html`: seven-game collection.
- `dist/arcade.html`: all playable boards and the session-results view.
- Seven named game pages: standalone rules and a link into the arcade.
- `dist/about.html`: project and team information.
- `dist/scorecard.html`: explanation of session results; the previous manual sheet is retired.
- Six compatibility pages keep old addresses useful by linking to the revised games.
- `dist/css/`: shared styling and board/control styling.
- `dist/js/`: seven game scripts, `sessions.js`, and `arcade.js` for switching panels.
- `dist/assets/`: local PNG illustrations.
- `reports/project-report.html`: printable implementation report.
- `reports/project-report.md`: editable report text.

## Course boundary

The game logic uses variables, arithmetic, comparisons, if/else and while loops. Small functions, event handlers and DOM updates extend the supplied introductory course material to support playable on-page games. The report also explains hash-based panel switching and adding/removing table rows as part of those additions. There are no arrays, timers, canvas, SVG, cookies, localStorage, sessionStorage, network requests, external fonts or imported packages in the runtime.

## Verification

Seventeen HTML pages pass structural/link/asset/ID checks. Nine JavaScript files pass syntax checks. Thirty-seven scenario groups exercised 465 actual HTML click handlers in a simulated DOM, including all games, session updates/removal, tab switching and fresh-page reset. Tests include independent path solutions, mine-clue calculations, a sliding-puzzle solver and solvability checks on thirty scrambles.

Browser automation was unavailable, so this is not a claim of live visual/mobile-browser inspection. Local HTTP delivery is verified separately. See the report for manual checks.

## Source and submission

This public repository contains the current website, implementation report, local launcher and development checks. No hosted website deployment is configured. Keep the contents of `dist` together when running or hosting the site.

## Running the checks

The checks use Python 3 and Node.js built-in modules. They are development tools, not website dependencies.

    python tests/check_arcade.py
    node tests/test_arcade.cjs

Run the Python check first; it produces the temporary DOM fixture used by the JavaScript checks. The generated fixture is ignored by Git.
