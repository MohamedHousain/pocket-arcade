# Pocket Arcade Implementation Report

Web Programming course project, University of Sharjah, Fall 2026–2027.

Pocket Arcade now contains seven mouse-controlled games. Each game is played directly on the website and has a Save session button. Saved results and all active game boards share one arcade document, so switching games preserves progress without browser storage. Refreshing starts a new visit with empty results.

The website uses HTML, CSS and plain JavaScript only. The implementation extends the supplied introductory slides with small functions, event handlers and DOM updates. Persistent browser storage is outside the project scope. This report distinguishes the course foundation from those approved additions and describes the final local version.

## 1. Requirements and scope

The project description supplied the assignment requirements; the proposal supplied the arcade concept and team. The final project scope uses mouse controls, seven games, a route puzzle and temporary saved sessions. Instructions in the documents were treated as source requirements, not separate permission to create accounts or submit work.

| Requirement | Final implementation |
| --- | --- |
| At least five linked webpages | Home, arcade, seven rules pages, about and session-help pages, plus six compatibility pages |
| Frontend technologies only | Static HTML, CSS, JavaScript and local PNG assets |
| HTML content and multimedia | Semantic sections, headings, links, lists, tables, buttons, original illustrations and a short CSS animation |
| Consistent CSS formatting | Shared colours, fonts, spacing, navigation, controls and responsive boards |
| JavaScript interaction | Clickable game boards, counters, results, resets and session saving |
| Input verification | Invalid moves, occupied squares, out-of-order checkpoints, incomplete guesses and duplicate colour choices are rejected |
| Multiple games with a unified design | Seven games in one arcade with consistent controls and result presentation |
| Performance tracking | Round snapshots, game counters, memory best and Tic-tac-toe tallies held only in the current document |
| Local access | http://localhost:8080 with no account or external game service |
| GitHub source repository | The current project is prepared as a public Git repository; development history before its initial commit is not reconstructed |

Snake and the number puzzle were replaced by mouse-controlled games. Saved profiles, daily puzzle services and permanent high scores are not implemented. The final website uses constrained board buttons rather than a manual score-entry form. The original sheet was replaced by session snapshots that require no copying of scores.

The site contains visual media, not an audio or video player. It demonstrates relevant course techniques without adding every input type or CSS effect mentioned in the lectures. If the instructor requires a specific media format, that interpretation should be confirmed separately.

## 2. Site structure and session lifetime

The home page introduces the seven games. Each game has a separate rules page, preserving a conventional multi-page website. The playable boards themselves are sections inside arcade.html. The top game tabs are links such as arcade.html#memory. Changing the part after the hash does not load a new document.

arcade.js reads the selected hash, shows the corresponding section and hides the others. It does not restart the games. The hashchange handler also handles browser Back/Forward between game views. An unrecognised hash safely opens Minesweeper.

The same document contains the Saved sessions view. A record is an HTML table row, and its values are copies of the current score and state. No record is written to a server, cookie, localStorage, sessionStorage, file or database. Refreshing recreates the page and its variables, so the table starts empty. Closing the tab discards the visit. Browsers may restore a previous document through Back/Forward caching; that is not persistent storage implemented by this site. Game tabs are the intended way to switch while keeping a visit together.

| File group | Purpose |
| --- | --- |
| index.html | Collection and game entry links |
| arcade.html | Seven playable boards and the saved-results table |
| Named game HTML pages | Rules and links into the arcade |
| about.html and scorecard.html | Team/project description and explanation of temporary sessions |
| Six former addresses | Compatibility links; no old prompt scripts |
| css/style.css and css/games.css | Page appearance, boards, state styles and print rules |
| Seven game scripts | Game-specific state and rules |
| js/sessions.js | Capture, update and remove result snapshots |
| js/arcade.js | Show the selected panel without reloading |

Scripts are loaded after the HTML, so the buttons and counters already exist when the scripts look them up. sessions.js loads first because each game calls its round-initialisation helper. There is no package installation or build step needed to run the delivered website.

## 3. Course techniques and approved additions

| Supplied material | Relevant foundation |
| --- | --- |
| Chapter 1 PDF | Browser/server distinction, client-side scripting and static hosting |
| Chapter 2 HTML slides | Document structure, semantic sections, headings, relative links, images with alternatives, lists, tables and controls |
| Chapter 3 HTML5 slides | Input types and validation concepts were reviewed; the final game interfaces use constrained buttons rather than free-text form input |
| Chapter 4 CSS slides | External stylesheets, selectors, fonts, colours, dimensions, positioning, box model and media types |
| Chapter 5 CSS slides | Text/box shadows and keyframe animation |
| Chapter 6 JavaScript slides | var, strings, numbers, Boolean values, arithmetic, parseInt, comparisons and the document concept |
| Chapter 7 JavaScript slides | Decisions, nested conditions, while loops, counters and compound assignment |

Functions, event handlers and DOM updates are the agreed extensions. They are not presented as topics fully taught in the supplied chapters. Supporting details include combined Boolean operators, accessible descriptions, responsive width queries and hash-based navigation. There is no Flexbox, CSS Grid, framework, canvas, SVG or external font.

### Functions and event handlers

A function names a task, such as flipCard(index) or resetMines(). Its parameter identifies the selected square. A return value communicates a result, and an early return rejects an invalid action. Each function body uses straightforward variables, arithmetic, conditions and loops.

HTML buttons call these functions with onclick. For example, a square uses `onclick="placeMark(1)"`. The routing script uses window.onhashchange to respond when a game link changes the hash. There are no timers, asynchronous functions, classes, modules, arrow functions or custom data objects.

The logical operators &&, || and ! combine Boolean conditions: both, either, and not. For example, a move is rejected if the game has ended OR the selected square is already occupied. These should be explained alongside the course's decision statements.

### Document updates

| Feature | Purpose |
| --- | --- |
| getElementById | Find a known square, card, counter or table |
| textContent | Update text without interpreting it as HTML |
| className | Select covered, open, matched, current or winning appearance |
| disabled | Stop unavailable buttons accepting clicks |
| value | Store a tile number, pair number, square state or round number |
| style.display | Show a game panel, path segment or results table |
| setAttribute | Update accessible labels, selected modes and remove-button handlers |
| createElement and appendChild | Build result rows and Codebreaker guess history |
| firstChild, parentNode and removeChild | Clear or remove those rows |
| scrollIntoView | Bring the arcade tabs into view after switching panels |
| location.hash and substring | Read the selected game name from the hash link |

All game-board elements are written in HTML. Scripts update their existing properties. The result/history tables add small DOM elements as needed. No innerHTML strings, array-based board engine or external requests are used.

## 4. Game algorithms

### Minesweeper

The board has 36 squares with six mines. Three prepared layouts are selected by simple conditions. The first square is safely opened at the beginning. The row of a zero-based index is `parseInt(index / 6)`, and the column is `index % 6`.

To calculate a clue, the script compares a square's row and column with each mine. A mine is adjacent when both coordinate differences lie between -1 and 1, including diagonals. The square's button value stores covered, open or flagged.

Reveal mode opens safe squares, while flag mode toggles a flag. Six flags are permitted. Flagged squares cannot be accidentally revealed, and repeated clicks on open squares do not increase progress. Open zero-clue squares expand their safe neighbours through repeated while-loop scans until no new squares open. Flagged squares stay closed.

Revealing all 30 safe squares wins. Selecting a mine ends the game, reveals the mines and locks the board. The layouts are fixed practice puzzles and are not claimed to be solvable without guessing.

### Memory Match

Sixteen cards contain eight pairs. Each card value identifies its pair, and its class records whether it is face down, face up or matched. Two scalar variables identify the currently selected cards.

A second distinct card completes one turn. Matching pairs remain visible and disabled. A mismatch stays visible until Turn cards over is clicked; another card cannot be opened meanwhile. No timer is needed. Repeated clicks on the same card do not form a pair.

Three deterministic deals use arithmetic to rearrange sixteen positions, followed by if statements assigning each pair twice. Completing all eight pairs updates the best completed turn count, which stays in a variable while the arcade remains loaded.

### Tic-tac-toe

Two people share one screen. The nine button labels form the board state. A valid click writes X or O, disables the square and tests the three rows, three columns and two diagonals through a small helper function.

A winning line is highlighted and increases that player's score once. Filling all squares without a win records a draw. The board locks at the end. New round retains scores and alternates starters; Reset scores begins a fresh match. There is no computer opponent.

### Connect the Dots

This is now a route puzzle, not a number-clicking exercise. The player starts at checkpoint 1 and must pass through checkpoints 2, 3 and 4 in order before finishing at 5. All 25 squares must be visited exactly once.

A button's value records its position in the route, with zero meaning unvisited. A move must be one square horizontally or vertically from the current endpoint. The script rejects jumps, diagonal movement, revisiting, skipped checkpoints and reaching the final checkpoint before the rest of the board is filled.

Each accepted move shows a prepared CSS line between the squares. Undo finds the button with the preceding visit number, hides that line, removes the latest step and restores the expected checkpoint if necessary. Clicking the previous square is also an undo action. The game detects when no valid next move remains and suggests backtracking.

Three layouts have independently verified complete solutions. There is no automatic indication of the next route square. Progress and undo count are recorded instead of the old easy puzzle's point total.

### Lights Out

A move toggles a selected square and its immediate horizontal and vertical neighbours. Button values record whether lights are on or off. A loop counts the remaining lights after each move; reaching zero wins and locks the board.

Each of three starting patterns is created by applying legal toggles to an all-off board. Repeating those toggles solves it because toggling a square twice cancels the change. This guarantees solvability without a search algorithm or stored solution array.

### Sliding Tiles

Nine button values hold numbers 1–8 and a zero for the empty square. A tile moves only if it touches the empty square horizontally or vertically. A move swaps the two values and updates the blank's position. The solved check compares each position with its expected number.

New puzzles begin solved and are scrambled through legal moves, preserving solvability. An arithmetic sequence produces direction choices; division by 64 selects one of four ranges. Immediate reverse moves are avoided. A separate attempt limit guarantees that setup cannot loop forever. If a scramble happens to end solved, one extra legal move ensures that the player receives an unfinished board.

### Codebreaker

The player selects four different colours by clicking four pegs, then submits a guess. The secret uses four of six available colours. All colours also have letter/name labels.

The script checks that every peg is selected and that no colour repeats. Invalid guesses do not consume a turn. It counts colours in their exact positions and colours present elsewhere in the secret. Because each colour is unique, nested loops can count misplaced colours without duplicate-bookkeeping arrays.

Feedback is appended to a guess-history table. Four exact matches win; eight unsuccessful valid guesses end the round. Both outcomes reveal the secret. New code cycles through three prepared codes.

## 5. Save session behaviour

Each game has a round counter stored in its Save session button's value. Resetting or starting a new round increments that counter. The snapshot row ID combines the game and round number, such as saved-memory-2.

Saving first checks whether that row already exists. If it does not, a row is created. If it does, the row's cells are replaced with the current result. This avoids duplicates when Save session is clicked repeatedly. A later round receives another row, leaving earlier snapshots unchanged.

Records include the game, round number, state and relevant result: safe squares, pairs and turns, match score, path coverage and undos, lights and moves, sliding moves, or code guesses. Incomplete rounds can be saved. The Remove button deletes a record without changing the active board.

Snapshots store results, not a restorable copy of a past board. The current boards independently stay in memory when another game panel is shown. Saved results can be printed using the browser's Print command. No manual score entry or permanent storage is required.

## 6. Design and local delivery

The design uses warm paper colours, dark green controls, rust accents, system fonts and locally included illustrations. Playable boards appear before their rules. States such as covered, matched, selected and winning are visually distinct. Focus outlines, button labels and live status text describe changing controls.

CSS handles responsive sizing, percentage-positioned path squares, borders, shadows and a brief one-time brand animation. Print rules hide navigation and interactive controls. There are no continuous animations during games.

The local server serves the repository's dist folder at http://localhost:8080. Python 3 is used only as a static-file server; the website and game logic remain HTML, CSS and JavaScript. The included Windows launcher works relative to its own folder.

The website runs locally and requires no login or game service. The public Git repository contains the source and report; publishing repository contents does not create a hosted game service.

## 7. Verification

All nine JavaScript files passed syntax checks. Seventeen HTML files passed checks for balanced tags, unique IDs, one main heading, local resources, link targets, image alternatives and valid click-handler names. The arcade has 239 named elements, including controls for all seven games and the session view.

Thirty-seven scenario groups exercised 465 handlers from the actual HTML in a simulated DOM. Tests covered game wins/losses, resets, invalid/repeated moves, flag limits, memory mismatches, all eight Tic-tac-toe winning lines, draws and alternating starters. They also used independent mine-clue calculations and complete solutions for all three path puzzles.

Lights Out tests verified the three solutions and corner-toggle behaviour. An independent breadth-first solver completed a sliding board; thirty scrambles were checked for unique tiles and solvability parity. Codebreaker tests checked misplaced/exact clues, invalid guesses, completion and eight-guess loss. Session tests checked saving all games, updating existing rows, preserving old snapshots across new rounds, removal, panel switching and empty state after a fresh load.

The initial sliding scramble loop failed to terminate for some later deals during testing. It was replaced with a bounded arithmetic scramble and the full suite then passed. Source checks confirm no prompt/alert dialogs, arrays, timers or storage/network APIs in the runtime.

Browser automation was unavailable in this session. The checks verify code, handler wiring and simulated DOM changes; they do not claim live desktop/mobile visual inspection. Local HTTP delivery is checked separately. Before presenting, play a round in the intended browser, save it, switch games, inspect the saved table and refresh to confirm the visible reset behaviour. Also check a narrow window and print preview.

## 8. Explaining the project

Start with a Tic-tac-toe button and follow its onclick call into placeMark. Explain how getElementById locates the button, textContent writes the mark and disabled prevents another move. Show the helper that checks a line and returns a Boolean result.

Then explain a board-reset while loop and a coordinate calculation. For Minesweeper, index 14 corresponds to row 2 and column 2 when counting from zero. Division and remainder produce those coordinates without a two-dimensional array.

For the harder path puzzle, show how the button value records visit order and how Undo locates the preceding value. For sessions, follow one Save session click into a generated table row, then save again to demonstrate updating that row rather than duplicating it.

Be explicit about the boundary: variables, arithmetic and control flow come from the course foundation. Functions, events, DOM updates and hash-based panel switching are the agreed small extensions. The application uses no persistent storage, arrays, game engine or backend.

## 9. References reviewed

- Project_description (1).docx: assignment requirements and submission expectations.
- Web Programming Project Proposal.docx: arcade concept, proposed functionality and team.
- Ch1_NEW.pdf: web architecture, client-side scripting and hosting.
- ch2_NEW.pptx and Ch3_book.pptx: HTML structure, content, controls and validation concepts.
- Ch4_CSS.pptx and Ch5_CSS_advanced.pptx: styling, layout, box model, media rules, shadows and animation.
- Ch6_book_slides.pptx and Ch7_book_slides.pptx: introductory scripting and control flow.

The source course files are references, not website dependencies, and are not republished in the package.
