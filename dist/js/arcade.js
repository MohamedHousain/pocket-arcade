/* Hash links change the visible panel without loading a new document.
   Back/Forward also work. No game is restarted when its panel is shown. */
function arcadePanel(name, chosen) {
    var panel = document.getElementById("pane-" + name);
    var tab = document.getElementById("tab-" + name);
    panel.style.display = "none"; tab.className = ""; tab.setAttribute("aria-current", "false");
    if (name == chosen) { panel.style.display = "block"; tab.className = "active"; tab.setAttribute("aria-current", "page"); }
}
function showArcade() {
    var game = window.location.hash.substring(1);
    if (game != "minesweeper" && game != "memory" && game != "tictactoe" && game != "dots" && game != "lights" && game != "sliding" && game != "codebreaker" && game != "sessions") { game = "minesweeper"; }
    arcadePanel("minesweeper", game); arcadePanel("memory", game); arcadePanel("tictactoe", game); arcadePanel("dots", game);
    arcadePanel("lights", game); arcadePanel("sliding", game); arcadePanel("codebreaker", game); arcadePanel("sessions", game);
    document.title = sessionGameName(game) + " | Pocket Arcade";
    if (game == "sessions") { document.title = "Saved sessions | Pocket Arcade"; }
    document.getElementById("arcade-tabs").scrollIntoView();
}
window.onhashchange = showArcade;
showArcade();
