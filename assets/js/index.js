// Phone navbar button
const navbarButton = document.querySelector(".show-navbar");
const navbar = document.querySelector("nav");
const navbarChildren = document.querySelectorAll("navbar-child");

navbarButton.addEventListener("click", () => {
    navbarButton.classList.toggle("show-navbar-open");
    navbar.classList.toggle("navbar-open");

    for (let i = 0; i < navbarChildren.length; i++) {
        navbarChildren[i].classList.toggle("navbar-child-open")
    }
})


// Darkmode Button
const darkmodeButton = document.querySelector('.lightmode');
const logo = document.querySelector(".logo");

let mode = 0;

const varModes = ["--first-color", "--second-color", "--third-color", "--fourth-color", "--bg-color"]
const modes = [["#EDE6DB", "#1A3C40", "#1D5C63", "#417D7A", "#EDE6DB"], ["#3F3351", "#74B3CE", "#E9A6A6", "#1F1D36", "#1F1D36"]]

darkmodeButton.addEventListener("click", () => {
    mode = (mode + 1) % 2;

    darkmodeButton.classList.toggle("darkmode");
    darkmodeButton.classList.toggle("lightmode");

    for (let i = 0; i < varModes.length; i++) {
        document.documentElement.style.setProperty(varModes[i], modes[mode][i]);
    }

    logo.classList.toggle("darken-logo");
})

window.addEventListener('load', function(){
    var lastScrollLeft = 0;
    window.addEventListener("scroll", function(){
       var st = window.pageXOffset || document.documentElement.Element.scrollLeft; 
       if (st > lastScrollLeft){
            mode = (mode + 1) % 2;

            darkmodeButton.classList.toggle("darkmode");
            darkmodeButton.classList.toggle("lightmode");
        
            for (let i = 0; i < varModes.length; i++) {
                document.documentElement.style.setProperty(varModes[i], modes[mode][i]);
            }
        
            logo.classList.toggle("darken-logo");
       } else {
            mode = (mode + 1) % 2;

            darkmodeButton.classList.toggle("darkmode");
            darkmodeButton.classList.toggle("lightmode");
        
            for (let i = 0; i < varModes.length; i++) {
                document.documentElement.style.setProperty(varModes[i], modes[mode][i]);
            }
        
            logo.classList.toggle("darken-logo");
       }
       lastScrollLeft = st <= 0 ? 0 : st; 
    }, false);
  }); 


// Chronometer
const timeElement = document.querySelector(".time");
const timeElementMobile = document.querySelector(".time-mobile")

let seconds = 0;
let interval;

function timer() {
    seconds++;

    let secs = seconds % 60;
    let mins = Math.floor(seconds / 60) % 60;
    let hours = Math.floor(seconds / 3600);

    if (secs < 10) secs = "0" + secs;
    if (mins < 10) mins = "0" + mins;
    if (hours < 10) hours = "0" + hours;
    if (hours > 99) hours = "99";

    timeElement.innerText =  `${hours}:${mins}:${secs}`;
    timeElementMobile.innerText =  `${hours}:${mins}:${secs}`;
}

function startTimer() {
    if (interval) {
        return
    }

    interval = setInterval(timer, 1000);
}

function stopTimer() {
    clearInterval(interval);
    interval = null;
}

function resetTimer() {
    stopTimer();
    seconds = 0;
    timeElement.innerText = "00:00:00";
}

// Display/UI
import { TILE_STATUSES, createBoard, markTile, revealTile, checkWin, checkLose } from "./minesweeper.js";

let firstMove = true;

let difficultySizes = [["8", "10", "10"], ["14", "18", "40"], ["20", "30", "99"]];
const difficultyOptions = [document.querySelector(".easy-option"), document.querySelector(".medium-option"), document.querySelector(".hard-option")];

// Handling media queries
function phoneDifficulty(x) {
    if (x.matches) { // If media query matches
        difficultySizes = [["12", "6", "10"], ["19", "10", "35"], ["26", "19", "75"]];
    } else {
        difficultySizes = [["8", "10", "10"], ["14", "18", "40"], ["20", "30", "99"]];
    }
}

var x = window.matchMedia("(max-width: 1040px)")
phoneDifficulty(x) // Call listener function at run time
x.addListener(phoneDifficulty) // Attach listener function on state changes

// * Manejo de los niveles de dificultad.
for (let i = 0; i < difficultySizes.length; i++) {
    difficultyOptions[i].addEventListener("click", function() {
        resetTimer();
        firstMove = true;
        
        document.documentElement.style.setProperty('--board-size-x', difficultySizes[i][0]);
        document.documentElement.style.setProperty('--board-size-y', difficultySizes[i][1]);
        document.documentElement.style.setProperty('--number-mines', difficultySizes[i][2]);

        const boardX = difficultySizes[i][0];
        const boardY = difficultySizes[i][1];
        const numberOfMines = difficultySizes[i][2];

        const messageText = document.querySelector(".mines-left");
        messageText.innerHTML = "Minas: <span class='number-of-mines-left'></span>";
        messageText.classList.remove("win", "lose");

        const messageTextMobile = document.querySelector(".mines-left-mobile");        
        messageTextMobile.innerHTML = "Minas: <span class='number-of-mines-left-mobile'></span>";
        messageTextMobile.classList.remove("info-mobile-element-win", "info-mobile-element-lose");

        let board = createBoard(boardX, boardY, numberOfMines);
        
        const boardElement = document.querySelector(".grid");
        boardElement.classList.remove("grid-start");

        const minesLeftCount = document.querySelector(".number-of-mines-left");
        const minesLeftCountMobile = document.querySelector(".number-of-mines-left-mobile");
        
        while (boardElement.firstChild) {
            boardElement.removeChild(boardElement.lastChild);
        }

        let boardChanged = false;
        board.forEach(row => {
            if (boardChanged) {
                return
            }

            row.forEach(tile => {
                if (boardChanged) {
                    return
                }

                boardElement.append(tile.element)
                tile.element.addEventListener("click", function() {
                    if (firstMove && (tile.mine || (tile.value !== "0" && tile.value !== 0))) {
                        boardChanged = true;
                        board = createBoard(boardX, boardY, numberOfMines);
                        setUpBoard(tile, boardElement, board, boardX, boardY, numberOfMines, firstMove, messageText, minesLeftCount, messageTextMobile, minesLeftCountMobile);
                    }
                    firstMove = false;
                    startTimer();
                    
                    if (boardChanged) {
                        return
                    }
                    revealTile(board, tile);
                    checkGameEnd(board, boardElement, messageText, messageTextMobile);
                })
                tile.element.addEventListener("contextmenu", function(e) {
                    if (boardChanged) {
                        return
                    }

                    e.preventDefault();
                    markTile(tile, parseInt(minesLeftCount.textContent));
                    listMinesLeft(board, minesLeftCount, minesLeftCountMobile, numberOfMines);
                })
            })
        })
        minesLeftCount.textContent = numberOfMines;
        minesLeftCountMobile.textContent = numberOfMines;
    })
}

function listMinesLeft(board, minesLeftCount, minesLeftCountMobile, numberOfMines) {
    const markedTilesCount = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length;
    }, 0)

    minesLeftCount.textContent = numberOfMines - markedTilesCount
    minesLeftCountMobile.textContent = numberOfMines - markedTilesCount
}

function checkGameEnd(board, boardElement, messageText, messageTextMobile) {
    const win = checkWin(board);
    const lose = checkLose(board);

    if (win || lose) {
        showAllSquares(board);
        stopTimer();
    }

    if (win) {
        messageText.classList.add("win")
        messageTextMobile.classList.add("info-mobile-element-win")
        messageText.textContent = "Ganaste";
        messageTextMobile.textContent = "Ganaste";
    }
    if (lose) {
        messageText.classList.add("lose")
        messageTextMobile.classList.add("info-mobile-element-lose")
        messageText.textContent = "Perdiste";
        messageTextMobile.textContent = "Perdiste";
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.status === TILE_STATUSES.MARKED) tile.status = TILE_STATUSES.HIDDEN;
                if (tile.mine) revealTile(board, tile);
            })
        })
    }
}

function showAllSquares (board) {
    board.forEach(row => {
        row.forEach(tile => {
            if (tile.status === TILE_STATUSES.MARKED) {
                if (tile.mine) {
                    tile.status = TILE_STATUSES.MINE;
                } else {
                    tile.status = TILE_STATUSES.NUMBER;
                }
            } else if (tile.status === TILE_STATUSES.HIDDEN) {
                if (tile.mine) {
                    tile.status = TILE_STATUSES.MINE;
                } else {
                    tile.status = TILE_STATUSES.NUMBER;
                }
            }
        })

    })
}

function setUpBoard(t, boardElement, board, boardX, boardY, numberOfMines, firstMove, messageText, minesLeftCount, messageTextMobile, minesLeftCountMobile) {
    while (boardElement.firstChild) {
        boardElement.removeChild(boardElement.lastChild);
    }

    let boardChanged = false;
    board.forEach(row => {
        if (boardChanged) {
            return
        }

        row.forEach(tile => {
            if (boardChanged) {
                return
            }

            boardElement.append(tile.element)
            tile.element.addEventListener("click", function() {
                if (firstMove && (tile.mine || (tile.value !== "0" && tile.value !== 0))) {
                    boardChanged = true;
                    board = createBoard(boardX, boardY, numberOfMines);                    
                    setUpBoard(tile, boardElement, board, boardX, boardY, numberOfMines, firstMove, messageText, minesLeftCount, messageTextMobile, minesLeftCountMobile)
                }
                firstMove = false;
                
                if (boardChanged) {
                    return
                }
                revealTile(board, tile);
                checkGameEnd(board, boardElement, messageText, messageTextMobile);
            })
            board[t.x][t.y].element.click();
            tile.element.addEventListener("contextmenu", function(e) {
                if (boardChanged) {
                    return
                }

                e.preventDefault();
                markTile(tile, parseInt(minesLeftCount.textContent));
                listMinesLeft(board, minesLeftCount, minesLeftCountMobile, numberOfMines);
            })
        })
    })
    minesLeftCount.textContent = numberOfMines;
}
