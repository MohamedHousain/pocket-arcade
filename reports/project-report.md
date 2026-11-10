# Pocket Arcade Implementation Report

Web Programming course project, University of Sharjah, Fall 2026–2027.

Pocket Arcade contains six games playable directly on their webpages: Minesweeper, Memory Match, Connect the Dots, Lights Out, Code Guess and Number Slide. The site uses plain HTML, CSS and browser JavaScript, with no libraries or frameworks. HTML supplies the controls and content, CSS formats the boards, and plain JavaScript applies the game rules. There are no external libraries or frameworks.

This report describes the current local static build. The previous browser-dialog games have been replaced. The user approved a limited extension beyond the supplied slides: small functions, click handlers and updates to page elements. The later progress features also use browser local storage and CSS animation. These additions are identified explicitly below rather than described as techniques fully taught in the source material.

## 1. Requirements and scope

The project description supplied the assignment requirements. The proposal supplied the arcade topic and original game ideas. The user's later instructions changed the game selection to mouse-only games and required local hosting. Instructions inside the reference documents were treated as specifications, not separate permission to create accounts or submit work.

| Requirement | Current implementation |
| --- | --- |
| At least five linked webpages | Nine main pages: home, six games, score sheet and about |
| Frontend technologies only | HTML, two CSS files, eight JavaScript files and local PNG images |
| Multimedia | Original game illustrations and a brief CSS colour animation |
| Consistent CSS formatting | Shared navigation, colours, typography, rules and board presentation |
| JavaScript interaction | Clickable game controls, changing boards, scores and results |
| Input verification | Illegal moves and repeated actions are rejected; completed games stop accepting moves |
| A collection of puzzles | Minesweeper, Memory Match, Connect the Dots, Lights Out, Code Guess and Number Slide |
| Performance tracking | Automatic completed-round records, home page record stamps, a page-local memory best and a manual score entry form |
| Local access | http://localhost:8080, with no ChatGPT login or game service |
| GitHub progress uploads | A source repository exists; the newest local changes have not been published |

The game selection uses mouse and tap controls without real-time movement. Persistent profiles and daily puzzles are outside the agreed minimal scope. Images and CSS animation supply visual media; there is no audio or video player. If the instructor requires a specific media format, that requirement should be confirmed separately.

## 2. Files and navigation

| Page | Purpose |
| --- | --- |
| index.html | Introduces the collection and links directly to each playable board |
| minesweeper.html | Six by six board, reveal/flag controls, status and restart buttons |
| memory.html | Sixteen clickable cards, turn counter and manual flip-back control |
| dots.html | Twelve-dot memory challenge, connecting lines and three patterns |
| lightsout.html | Five by five board; each move toggles a cross of lights |
| codeguess.html | Four-colour code, six attempts and exact/misplaced clues |
| numberslide.html | Solvable four by four sliding tile board |
| scorecard.html | Automatically saved completed rounds, optional manual entries and browser printing |
| about.html | Project description, limitations and proposal team |

Six former page addresses remain as simple compatibility pages linking to the new games. They no longer run the earlier prompt scripts. The six game scripts are minesweeper.js, memory.js, dots.js, lightsout.js, codeguess.js and numberslide.js. arcade-progress.js saves completed rounds, updates home page records and starts the win effect; scorecard.js manages the score sheet. Shared presentation is in css/style.css; the game controls and small-screen adjustments are in css/games.css.

Each playable page loads its script after the HTML controls have been declared. This means the elements already exist when the script looks them up. There is no build system, dependency installation or import step for the website.

## 3. Techniques grounded in the course material

| Source | Concepts | Use in this project |
| --- | --- | --- |
| Chapter 1 PDF, pages 8–19 and 29 | Browser/server model, client-side scripting and static hosting | A local host delivers files. The browser performs all game calculations. |
| Chapter 2 HTML slides | Document structure, headings, sections, links, images, lists, tables and forms | Navigation, game instructions, illustrations, score reference and worksheet controls |
| Chapter 3 slides | HTML5 date and number inputs with constraints | Date control and a 1–5 rating field on the score sheet |
| Chapter 4 CSS slides | External stylesheets, selectors, colours, fonts, positioning, dimensions and box model | Consistent page appearance, rectangular boards, positioned dots, margins, padding and borders |
| Chapter 4 media-type material | Print-specific styles | Navigation and interactive controls are omitted from printed content |
| Chapter 5 slides | Shadows and keyframe animation | Modest panel shadows and a one-time colour change on the brand symbol |
| Chapter 6 JavaScript slides | Variables, primitive values, strings, arithmetic, parseInt, comparisons and document concepts | Scores, board coordinates, labels, matching checks and arithmetic deal layouts |
| Chapter 7 JavaScript slides | if/else, while, nested decisions, counters and compound assignment | Game turns, board scans, win checks, score totals and reset loops |

The website demonstrates the relevant ideas in context. It does not attempt to add every form input type or every CSS effect mentioned in the lectures. The landing page uses Flexbox and CSS Grid. There is no CSS framework or downloaded font.

## 4. The approved additions

### Small functions

A function gives a repeated task a name. For example, flipCard(index) handles a selected memory card, and resetMines() returns Minesweeper to its starting state. Parameters such as index identify the clicked square; return passes a result back to the calling code. An early return stops a handler when a move is invalid.

The function bodies still use the course's variables, arithmetic, decisions and while loops. Helper functions avoid copying the same instructions into every button. There are no arrow functions, classes, modules, asynchronous functions or custom data objects.

### Click handlers

An HTML button calls a named function through its onclick attribute. For example, a Minesweeper square uses `onclick="chooseMine(1)"` to call its click handler with the square number 1.

The original board pages use onclick handlers. Lights Out, Code Guess and Number Slide use native addEventListener handlers and ordinary buttons. A mouse or tap is sufficient; there is no typing, dragging, right-click requirement or keyboard game control. Native buttons also retain normal browser accessibility behaviour.

### Updating the document

The browser's document object represents the page. `document.getElementById("memory-moves")` locates the score element by its HTML id. Assigning its textContent changes the displayed score without reloading the page.

| DOM feature | Purpose |
| --- | --- |
| getElementById | Find an existing board button, score or message |
| textContent | Show a symbol, mark, number or status message as text |
| className | Apply the appropriate covered, open, matched or winning CSS appearance |
| disabled | Prevent clicking a finished square or an unavailable control |
| value | Keep a card's pair number or a mine square's covered/open/flagged state |
| style.display | Show connecting lines and switch between dot puzzles |
| setAttribute | Update accessible descriptions and the selected reveal/flag mode |

These are small DOM updates, not a framework. The original game boards are written in the HTML. The three restored games create their buttons with document.createElement and clear their board containers between moves. No page imports or fetches external content.

Combined conditions use the logical operators && (both conditions), || (either condition) and ! (not). These are shorthand for combining the Boolean decisions used in the course; they should also be explained during the project discussion. For example, a click is ignored if a round has ended OR a square is already open.

Additional presentation details include responsive screen-width media queries, visible focus outlines, disabled/selected control styling and circular dot buttons. Accessible labels and live status messages help describe changing boards. These supporting details are not claimed as exact copies of lecture examples.

## 5. Game algorithms

### Minesweeper

The board has 36 buttons arranged in six rows. Six positions contain mines, leaving 30 safe squares. The isMine function identifies the positions for each of three prepared layouts. They are fixed practice boards, not randomly generated puzzles. The first square is always opened safely at the start.

An internal square index runs from 0 to 35. Its row is `parseInt(index / 6)` and its column is `index % 6`. To count neighbouring mines, adjacentMines compares each mine's row and column with the selected square. A mine touches the square when both coordinate differences are between -1 and 1, including diagonals.

The button value records covered, open or flagged. Reveal mode opens a covered safe square. Flag mode adds or removes a flag instead. The script allows at most six flags, prevents a flagged square being revealed, and never awards additional progress for an already open square.

Opening a square with zero neighbouring mines also opens its surrounding safe squares. A while loop repeatedly scans open zero squares until no new squares appear. This implements an expanding empty area without arrays, recursion or a queue. Flagged squares remain covered until the player removes the flag.

Opening a mine reveals all mine locations, ends the round and disables the board. Revealing all 30 safe squares wins. Restart repeats the current layout; the next-board button cycles through the three layouts. The starting square is safe, but the game does not promise that every board can be solved without guessing.

### Memory Match

Sixteen buttons contain eight pairs. Each card's value stores a pair number from 1 to 8. The visible label is a question mark while face down, and a symbol when revealed. Descriptive labels identify the symbols for assistive technology.

The variables memoryFirst and memorySecond identify the current two cards. The first click reveals a card. The second distinct click increments the turn count and compares their values. A matching pair stays face up and becomes disabled. A mismatch remains visible while the player studies it; clicking Turn cards over hides the pair. Other cards cannot be opened while the mismatch is waiting.

There is deliberately no timer. Clicking the same card twice does not count as a pair, and clicking an already matched card has no effect. Completing eight pairs ends the round and updates the best completed turn count. That best remains in a variable only while the page is open.

The New deal button cycles through three deterministic arrangements. Arithmetic maps the card position to one of sixteen prepared positions using `(index * 5 + memoryDeal * 3) % 16`. The mapping visits every position once in each deal. A sequence of if statements then assigns the eight pairs, each appearing twice. No random-number generator or array is required.

### Connect the Dots

Each pattern has twelve HTML buttons placed at prepared CSS percentage coordinates. The player studies their numbers, then hides them before playing. The dot numbers remain in accessible button labels. Correct clicks reveal the connecting CSS line segments and advance the sequence.

A wrong later dot counts as a mistake and costs five points. Three mistakes end the round. An optional hint outlines the next dot for a ten-point penalty. Connected dots are disabled. Each correct dot earns ten points, so the maximum is 120; the score never drops below zero.

Three scattered layouts give different patterns. Start again reveals the numbers and clears the current round; Next puzzle cycles to another layout. The game uses ordinary buttons, CSS lines and browser JavaScript, without canvas or a drawing library.

## 6. Validation and progress

Input verification means checking whether the selected action is allowed. Minesweeper checks square state and available flags. Memory Match checks whether a first card is already selected and whether a mismatched pair still needs hiding. Connect the Dots checks the expected number. These checks are present in the functions as well as in disabled buttons.

Messages appear beside the board, never in alert or prompt dialogs. The scripts use fixed text, symbols and calculated numbers. textContent updates the display as text, rather than interpreting it as HTML.

Game scores are not transmitted. Memory Match's on-page best exists only in an ordinary JavaScript variable; navigation or reloading clears that display and any unfinished board. Completed rounds are automatically saved in this browser's local storage and shown on the score sheet. The home page shows each game's best score or saved Minesweeper wins. The score sheet also stores manually entered rounds. Saved rounds remain after a reload and can be deleted or printed; they do not sync across devices. Entries for removed games are cleared when the site loads.

## 7. Design and hosting

The design retains warm paper colours, dark green controls, rust accents, serif headings and simple game illustrations. Playable boards now appear near the top of each game page, followed by short instructions. A visitor can start playing immediately without navigating to a separate result page.

The site uses locally included PNG images and system fonts. CSS handles the board sizes, button states, connecting lines and narrow-window adjustments. A short brand animation runs once and a brief confetti effect follows a win. Reduced motion settings disable both animations. Print styles remove interactive controls.

The local server serves the dist directory at http://localhost:8080. The included launcher uses the existing Python installation only to deliver static files. No Python code runs in the site, and there is no application backend. The same files can also be opened directly with dist/index.html.

A prior static build is published at https://pocket-arcade-course-2026.equalmonkey.chatgpt.site. The newest local changes have not been published. The project source is maintained at https://github.com/mohamedhousain/pocket-arcade.

## 8. Verification

An earlier version passed JavaScript syntax checks and a structural check covering thirteen HTML files, including six old-address compatibility pages. These checks predate Lights Out, Code Guess and Number Slide and are not a verification of this revision. They verified balanced tags, unique IDs, one main heading per page, local link and anchor targets, image alternative text, script assets and the existence of every named click handler.

Twenty-six automated scenario groups executed 264 handlers taken from the actual HTML against a simulated DOM. They covered all three Minesweeper layouts, independently calculated mine clues, wins, mine losses, flag limits, flag removal, protected flagged squares, empty-area expansion and layout cycling. Memory tests covered all three deals, exact pair counts, complete games, repeated-card clicks, mismatches, third-card blocking, manual hiding, new deals and best-turn updates.

Earlier source checks covered Minesweeper, Memory Match and Connect the Dots. The three added game scripts were reviewed afterwards.

The earlier source checks did not include browser visual review. For the earlier build, Edge loaded the three added games through localhost:8080. Lights Out solved in seven moves, Code Guess accepted and solved a code, and Number Slide moved, reset and reached its solved state. No page JavaScript errors appeared in these checks. The hosted deployment completed successfully.

Before this six-game revision, the local build was checked in Edge at desktop and phone widths. All main pages and compatibility pages loaded without missing images or page JavaScript errors. Game outcomes across the earlier build were checked for automatic score sheet entries, and their home page records updated. Reduced motion disabled the win animation.

Before presenting the project, open each game in the intended browser, play a full round, test its reset controls and check a narrow window. On Memory Match, verify the Turn cards over button after a mismatch. On Minesweeper, try both reveal and flag modes. Finish a game, check its automatic entry on the score sheet and its record on the home page, then reload to confirm the entry remains. Use the browser's print preview for the score sheet.

## 9. Explaining the code during the discussion

Start with a Minesweeper square and follow its onclick attribute into chooseMine. Explain how getElementById locates the button, textContent supplies its clue and disabled blocks another click. Follow the isMine check to show how a Boolean result informs the caller.

Next, show a while loop in resetMines or newMemoryDeal. The loop starts with an index, updates a button, increments the index and stops at the board size. This connects the approved DOM additions to the repetition taught in Chapter 7.

For the coordinate calculations, internal Minesweeper index 14 is row 2 and column 2 when counting from zero: `parseInt(14 / 6)` gives 2, and `14 % 6` also gives 2. Comparing neighbouring coordinates explains the clues without needing a two-dimensional array.

Finish with a prohibited action, such as clicking a third memory card before hiding a mismatch. Show the early return that rejects it. Be clear about the boundaries: these are local mouse games, the layouts are prepared, unfinished game progress resets on reload, and completed rounds are saved only in this browser.

## 10. References reviewed

- Project_description (1).docx: assignment requirements and GitHub submission expectation.
- Web Programming Project Proposal.docx: puzzle arcade idea, proposed features and team.
- Ch1_NEW.pdf: web architecture, browser scripting and static hosting.
- ch2_NEW.pptx: HTML content, links, images, lists, tables and forms.
- Ch3_book.pptx: HTML5 input types and constraints.
- Ch4_CSS.pptx: stylesheet rules, selectors, fonts, positioning, box model and media types.
- Ch5_CSS_advanced.pptx: shadows, backgrounds and animations.
- Ch6_book_slides.pptx: introductory scripting, variables, input/output, arithmetic and comparisons.
- Ch7_book_slides.pptx: decisions, loops, nested control statements and counters.

The original course documents are reference material, not website dependencies, and are not republished in the project package.
