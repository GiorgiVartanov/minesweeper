const gamePanel = document.querySelector(".game-panel");
const bombCounter = document.querySelector(".bombs-amount");

const selectedIndex = parseInt(localStorage.getItem("borderSize"));
console.log(selectedIndex);

const xSize = selectedIndex % 15;
const ySize = Math.floor(selectedIndex / 15);

const size = 15;
const amountOfBombs = 50;

let amountOfFlaggedTiles = 0;

let elements = [];
let isDigging = true;
let tiles = [];
let bombLocationArr = [];
let bombsPositionArr = [];

function createPanel() {
    for (let i = 0; i < size * size; i++) {
        const newEl = document.createElement("div");
        newEl.classList.add("tile");
        gamePanel.appendChild(newEl);
        tiles.push({
            index: i,
            position: [Math.floor(i / size), Math.floor(i % size)],
            bombs: 0,
        });
    }
    elements = [...gamePanel.children];
}

function placeBombs(amount) {
    if (amount > size * size) return 0;
    bombCounter.textContent = amount;

    while (bombLocationArr.length < amount) {
        const newBombLoc = Math.floor(Math.random() * size * size);
        if (!bombLocationArr.includes(newBombLoc)) {
            bombLocationArr.push(newBombLoc);
            tiles[newBombLoc].bombs = -1;
        }
    }
    bombLocationArr.forEach((location) =>
        bombsPositionArr.push([
            Math.floor(location / size),
            Math.floor(location % size),
        ])
    );

    tiles.forEach((tile) => {
        if (tile.bombs !== -1) tile.bombs = calculateNearBombs(tile.position);
    });
}

function calculateNearBombs(position) {
    let counter = 0;
    const nearTiles = [
        // array with every tile that is near
        [position[0] + 1, position[1]],
        [position[0], position[1] + 1],
        [position[0] - 1, position[1]],
        [position[0], position[1] - 1],
        [position[0] + 1, position[1] + 1],
        [position[0] - 1, position[1] - 1],
        [position[0] + 1, position[1] - 1],
        [position[0] - 1, position[1] + 1],
    ];
    nearTiles.forEach((arr1) => {
        bombsPositionArr.forEach((arr2) => {
            if (arr1.every((value, index) => value === arr2[index]))
                counter += 1;
        });
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
            if ((tile.index + 1) % size !== 0) showTile(tile.index + 1); // right
            if (tile.index % size !== 0) showTile(tile.index - 1); // left
            if (tile.index < size * (size - 1)) showTile(tile.index + size); // bottom
            if (tile.index > size) showTile(tile.index - size); // upper
        }
    });
}
function showTile(index) {
    if (index < 0) return;
    if (index > size * size) return;

    const element = elements[index];
    const nearBombs = tiles[index].bombs;

    if (nearBombs !== 0) element.textContent = nearBombs;
    if (element.classList.length === 1)
        element.classList.add("bombs-" + nearBombs);
    if (nearBombs === -1) element.classList.add("bomb");
}

gamePanel.addEventListener("click", (e) => {
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
