# Pocket Arcade

Seven games played directly on their webpages: Minesweeper, Memory Match, Tic-tac-toe, Connect the Dots, Lights Out, Code Guess, and Number Slide. The website uses plain HTML, CSS, and browser JavaScript, with no libraries or frameworks.

## Open locally

The local address is http://localhost:8080. If the local server is not running, double-click `Start Local Website.cmd` and keep its window open. The launcher uses the Python installation already on this computer to serve static files. Python is not used in the website or its game logic.

You can also open `dist/index.html` directly in a browser. Use the local server at http://localhost:8080 for reliable score sheet saving. There is no installation or build step, no sign-in, and no internet dependency. Enable JavaScript to play. Refresh the page if an older version is open.

## Main files

- `dist/index.html`: games collection.
- `dist/minesweeper.html`: clickable 6 by 6 board, flags and three practice layouts.
- `dist/memory.html`: sixteen cards, eight pairs, three deals and a best-turn counter.
- `dist/tictactoe.html`: local two-player game with wins, draws and alternating starters.
- `dist/dots.html`: a twelve-dot memory challenge with three patterns and three allowed mistakes.
- `dist/lightsout.html`: a five by five switch puzzle.
- `dist/codeguess.html`: a four-colour code puzzle with six attempts.
- `dist/numberslide.html`: a solvable four by four sliding tile puzzle.
- `dist/scorecard.html`: automatically saved game results and optional manual entries.
- `dist/about.html`: project and team information.
- `dist/css/style.css` and `games.css`: shared appearance and game boards.
- `dist/js/`: seven game scripts, the score sheet script, and shared progress code.
- `dist/assets/`: local PNG illustrations.
- `reports/project-report.html`: readable, printable explanation of the project.
- `reports/project-report.md`: editable source of the report.

Six older page addresses remain as simple links to the new games. They do not run old game code.

## Course scope

Variables, arithmetic, comparisons, decisions and loops provide the game logic. The user approved three additions for on-page play: small functions, click handlers and DOM updates. Those additions are explained separately in the report; they are not represented as material taught in detail by the supplied slides.

The site uses no libraries, frameworks, packages, external fonts, network requests, or application backend. An unfinished board stays in ordinary variables while its page is open and resets after navigation or reload. Completed rounds are saved automatically in this browser's local storage. The score sheet also accepts manual entries, and the home page shows each game's record. Saved scores do not sync across browsers or devices. A short CSS celebration plays after a win unless reduced motion is enabled.

Minesweeper and Memory Match use three prepared layouts/deals, not random generation. Tic-tac-toe is for two people sharing the screen. Memory Match deliberately uses a button to hide a mismatched pair instead of a timer.

## Verification

The original four-game build passed the checks described in the project report. The three added games were then exercised in Edge through the local server. The current local build was checked across all main and compatibility pages at desktop and phone widths. Game wins, losses, and draws were exercised for automatic score recording, and saved results appeared on the score sheet and home page. No page JavaScript errors appeared during those checks.

## Submission and hosting

A prior static build is published at https://pocket-arcade-course-2026.equalmonkey.chatgpt.site. The new local changes have not been published. The local files can be opened directly or served on localhost:8080.

The project source is maintained at https://github.com/mohamedhousain/pocket-arcade. For a static repository submission, keep all files inside `dist` together at the published location. Keep this README and the report as supporting documentation. The original lecture documents and development test tooling are not included in the website package.
