// Logic

export const TILE_STATUSES = {
    HIDDEN: "hidden",
    MINE: "mine",
    NUMBER: "number",
    MARKED: "marked",
}

export function createBoard(boardSizeX, boardSizeY, numberOfMines) {
    const board = [];
    const minePositions = getMinePositions(boardSizeX, boardSizeY, numberOfMines);
    for (let x = 0; x < boardSizeX; x++) {
        const row = [];
        for (let y = 0; y < boardSizeY; y++) {
            const element = document.createElement("div");
            element.dataset.status = TILE_STATUSES.HIDDEN;
            const tile = {
                element,
                x,
                y,
                mine: minePositions.some(p => positionMatch(p, {x, y})),
                get status() {
                    return this.element.dataset.status;
                },
                set status(value) {
                    this.element.dataset.status = value;
                }
            }

            row.push(tile);
        }
        board.push(row);
    }

    for (let x = 0; x < boardSizeX; x++) {
        for (let y = 0; y < boardSizeY; y++) {
            if (!board[x][y].mine) {
                const adjacentTiles = nearbyTiles(board, board[x][y]);
                const mines = adjacentTiles.filter(t => t.mine)
                
                board[x][y].value = mines.length;
            } else {
                board[x][y].value = -1;
            }
        }
    }
    return board
}

export function markTile(tile, minesLeft) {
    if (
        tile.status !== TILE_STATUSES.HIDDEN && 
        tile.status !== TILE_STATUSES.MARKED
        ) {
        return
    }

    if (tile.status === TILE_STATUSES.MARKED) {
        tile.status = TILE_STATUSES.HIDDEN;
    } else {
        if (minesLeft > 0) {
            tile.status = TILE_STATUSES.MARKED;
        }
    }

}

export function revealTile(board, tile) {
    if (tile.status !== TILE_STATUSES.HIDDEN) {
        return;
    }

    if (tile.mine) {
        tile.status = TILE_STATUSES.MINE;
        return;
    }

    tile.status = TILE_STATUSES.NUMBER;
    const adjacentTiles = nearbyTiles(board, tile);
    const mines = adjacentTiles.filter(t => t.mine)
    if (mines.length === 0) {
        adjacentTiles.forEach(t => revealTile(board, t));
    } else {
        tile.element.textContent = mines.length;
    }
}

export function checkWin(board) {
    return board.every(row => {
        return row.every(tile => {
            return tile.status === TILE_STATUSES.NUMBER ||
            (tile.mine &&
                (tile.status === TILE_STATUSES.HIDDEN ||
                    tile.status === TILE_STATUSES.MARKED))
        })
    })
}

export function checkLose(board) {
    return board.some(row => {
        return row.some(tile => {
            return tile.status === TILE_STATUSES.MINE
        })
    })
}

function getMinePositions(boardSizeX, boardSizeY, numberOfMines) {
    const positions = []

    while (positions.length < numberOfMines) {
        const position = {
            x: randomNumber(boardSizeX),
            y: randomNumber(boardSizeY)
        }

        if (!positions.some(p => positionMatch(p, position))) positions.push(position);
    }

    return positions;
}

function positionMatch(a, b) {
    return a.x === b.x && a.y === b.y;
}

function randomNumber(size) {
    return Math.floor(Math.random() * size);
}

function nearbyTiles (board, { x, y }) {
    const tiles = [];

    for (let xOffset = -1; xOffset <= 1; xOffset++) {
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
            const tile = board[x + xOffset]?.[y + yOffset];
            if (tile) tiles.push(tile)
        }
    }
    return tiles;
}