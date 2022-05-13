const gamePanel = document.querySelector(".game-panel");
const bombCounter = document.querySelector(".bombs-amount");

const savedIndex = parseInt(localStorage.getItem("borderSize")); // amount of tiles

const xSize = (savedIndex % 15) + 1;
const ySize = Math.floor(savedIndex / 15) + 1;

const size = xSize * ySize;

console.log(size);
console.log(xSize, ySize);

// const size = 15;
const amountOfBombs = 50;

let amountOfFlaggedTiles = 0;

let elements = [];
let tiles = [];
let bombLocationArr = [];
let bombsPositionArr = [];

function createPanel() {
    console.log(gamePanel);
    gamePanel.style.gridTemplateColumns = `repeat(${xSize},1fr)`;
    gamePanel.style.gridTemplateRows = `repeat(${ySize},1fr)`;

    for (let i = 0; i < size; i++) {
        const newEl = document.createElement("div");
        newEl.classList.add("tile");
        gamePanel.appendChild(newEl);
        tiles.push({
            index: i,
            position: [Math.floor(i / ySize), Math.floor(i % xSize)],
            bombs: 0,
        });
    }
    elements = [...gamePanel.children];
}

function placeBombs(amount) {
    if (amount > size) return 0;
    bombCounter.textContent = amount;

    while (bombLocationArr.length < amount) {
        const newBombLoc = Math.floor(Math.random() * size);
        if (!bombLocationArr.includes(newBombLoc)) {
            bombLocationArr.push(newBombLoc);
            tiles[newBombLoc].bombs = -1;
        }
    }

    tiles.forEach((tile) => {
        if (tile.bombs !== -1) tile.bombs = calculateNearBombs(tile.index);
    });
}

function calculateNearBombs(position) {
    let counter = 0;

    const nearTiles = [];

    nearTiles.push(position + 1);
    nearTiles.push(position - 1);
    nearTiles.push(position + xSize);
    nearTiles.push(position - xSize);
    nearTiles.push(position + xSize + 1);
    nearTiles.push(position - xSize + 1);
    nearTiles.push(position + xSize - 1);
    nearTiles.push(position - xSize - 1);

    if (position % xSize === 0) {
        nearTiles.splice(nearTiles.indexOf(position - 1), 1);
        nearTiles.splice(nearTiles.indexOf(position + xSize - 1), 1);
        nearTiles.splice(nearTiles.indexOf(position - xSize - 1), 1);
    }
    if ((position + 1) % xSize === 0) {
        nearTiles.splice(nearTiles.indexOf(position + 1), 1);
        nearTiles.splice(nearTiles.indexOf(position + xSize + 1), 1);
        nearTiles.splice(nearTiles.indexOf(position - xSize + 1), 1);
    }

    bombLocationArr.forEach((bombLocation) => {
        if (nearTiles.includes(bombLocation)) counter += 1;
    });

    return counter;
}

function showEverything() {
    tiles.forEach((tile) => {
        const element = elements[tile.index];
        const nearBombs = tile.bombs;
        if (nearBombs !== 0) element.textContent = nearBombs;
        if (element.classList.length === 1)
            element.classList.add("bombs-" + nearBombs);
        if (nearBombs === -1) element.classList.add("bomb");
    });
}
function showEmpty() {
    tiles.forEach((tile) => {
        const nearBombs = tile.bombs;
        const element = elements[tile.index];
        if (tile.bombs === 0) {
            showTile(tile.index);
            if ((tile.index + 1) % xSize !== 0) showTile(tile.index + 1); // right
            if (tile.index % xSize !== 0) showTile(tile.index - 1); // left
            if (tile.index < ySize * (xSize - 1)) showTile(tile.index + xSize); // bottom
            if (tile.index > ySize) showTile(tile.index - xSize); // upper

            // if ((tile.index + xSize + 1) % xSize !== 0)
            //     showTile(tile.index + xSize + 1); // bottom left
            // if ((tile.index - xSize + 1) % xSize !== 0)
            //     showTile(tile.index - xSize + 1); // top left

            // if ((tile.index - xSize - 1) % xSize !== 0)
            //     showTile(tile.index - xSize - 1); // top left
        }
    });
}
function showTile(index) {
    if (index < 0) return;
    if (index > size) return;
    // console.log(tiles[index].index);

    const element = elements[index];
    const nearBombs = tiles[index].bombs;

    if (nearBombs !== 0) element.textContent = nearBombs;
    if (element.classList.length === 1)
        element.classList.add("bombs-" + nearBombs);
    if (nearBombs === -1) element.classList.add("bomb");
}

gamePanel.addEventListener("click", (e) => {
    console.log(elements.indexOf(e.target));
    if (
        e.target.className !== "game-panel" &&
        e.target.classList.length === 1
    ) {
        showTile(elements.indexOf(e.target));
    }
});

gamePanel.addEventListener("contextmenu", (e) => {
    e.preventDefault(); // turns of context menu (the one that pops up on mouse right click)
    const clickedOn = e.target;
    if (clickedOn.className != "game-panel") {
        if ([...clickedOn.classList].includes("flagged")) {
            clickedOn.textContent = "";
            clickedOn.classList.remove("flagged");
            bombCounter.textContent = parseInt(bombCounter.textContent) + 1;
            amountOfFlaggedTiles -= 1;
        } else {
            if (
                clickedOn.classList.length === 1 &&
                amountOfFlaggedTiles < amountOfBombs
            ) {
                clickedOn.classList.add("flagged");
                clickedOn.textContent = "🚩";
                bombCounter.textContent -= 1;
                amountOfFlaggedTiles += 1;
            }
        }
    }
});

createPanel();
placeBombs(amountOfBombs);

showEmpty();
// showEverything();
