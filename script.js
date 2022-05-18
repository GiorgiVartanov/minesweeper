const gamePanel = document.querySelector(".game-panel");
const bombCounter = document.querySelector(".bombs-amount");
const restartButton = document.querySelectorAll(".restart-button");

const savedIndex = parseInt(localStorage.getItem("borderSize")); // amount of tiles
const amountOfBombs = parseInt(localStorage.getItem("bombsAmount")); // amount of bombs

const xSize = (savedIndex % 15) + 1;
const ySize = Math.floor(savedIndex / 15) + 1;

const size = xSize * ySize;

// const amountOfBombs = 50;

let amountOfFlaggedTiles = 0;

let elements = [];
let tiles = Array(xSize * ySize).fill(); // empty array where we will write amount of near bombs
let bombLocationArr = [];
let flaggedArr = [];
let bombsPositionArr = [];

function createPanel() {
    gamePanel.style.gridTemplateColumns = `repeat(${xSize},1fr)`;
    gamePanel.style.gridTemplateRows = `repeat(${ySize},1fr)`;

    for (let i = 0; i < size; i++) {
        const newEl = document.createElement("div");
        newEl.classList.add("tile");
        gamePanel.appendChild(newEl);
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
            tiles[newBombLoc] = -1;
        }
    }

    tiles = tiles.map((tile, index) => {
        if (tile === -1) return -1;
        else return (tile = calculateNearBombs(index));
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
    tiles.forEach((tile, index) => {
        const nearBombs = tile;
        const element = elements[index];
        if (tile === 0) {
            showTile(index);
            if ((index + 1) % xSize !== 0) {
                showTile(index + 1); // show right tile if it is not border on right border
                showTile(index + xSize + 1);
                showTile(index - xSize + 1);
            }
            if (index % xSize !== 0) {
                showTile(index - 1); // show left tile if it is not on a left border
                showTile(index + xSize - 1);
                showTile(index - xSize - 1);
            }
            if (index < ySize * (xSize - 1)) showTile(index + xSize); // show bottom if it is not on bottom border
            showTile(index - xSize); // show upper
        }
    });
}
function showTile(index) {
    if (index < 0) return;
    if (index >= size) return;

    const element = elements[index];
    // console.log(index, tiles[index]);
    const nearBombs = tiles[index];

    if (nearBombs !== 0) element.textContent = nearBombs;
    if (element.classList.length === 1)
        element.classList.add("bombs-" + nearBombs);
    if (nearBombs === -1) {
        element.classList.add("bomb");
        lose();
    }
}

function lose() {
    gamePanel.removeEventListener("click", clickOnTile);
    gamePanel.removeEventListener("contextmenu", placeFlag);
    document.querySelector(".lose-screen").style.visibility = "visible";
}

function win() {
    gamePanel.removeEventListener("click", clickOnTile);
    gamePanel.removeEventListener("contextmenu", placeFlag);
    document.querySelector(".win-screen").style.visibility = "visible";
}

gamePanel.addEventListener("click", clickOnTile);

function clickOnTile(e) {
    if (
        e.target.className !== "game-panel" &&
        e.target.classList.length === 1
    ) {
        showTile(elements.indexOf(e.target));
    }
}

gamePanel.addEventListener("contextmenu", placeFlag);

function placeFlag(e) {
    e.preventDefault(); // turns of context menu (the one that pops up on mouse right click)
    const clickedOn = e.target;
    const index = elements.indexOf(e.target);
    if (clickedOn.className != "game-panel") {
        if ([...clickedOn.classList].includes("flagged")) {
            clickedOn.textContent = "";
            clickedOn.classList.remove("flagged");
            bombCounter.textContent = parseInt(bombCounter.textContent) + 1;
            amountOfFlaggedTiles -= 1;
            flaggedArr.splice(flaggedArr.indexOf(index));
        } else {
            if (
                clickedOn.classList.length === 1 &&
                amountOfFlaggedTiles < amountOfBombs
            ) {
                clickedOn.classList.add("flagged");
                clickedOn.textContent = "🚩";
                bombCounter.textContent -= 1;
                amountOfFlaggedTiles += 1;
                flaggedArr.push(index);
            }
            if (areEqual(flaggedArr, bombLocationArr)) win();
        }
    }
}

function areEqual(a, b) {
    if (a.length != b.length) return false;
    return a.every((element) => {
        return b.includes(element);
    });
}

restartButton.forEach((button) =>
    button.addEventListener("click", () => {
        window.location.reload();
    })
);

createPanel();
placeBombs(amountOfBombs);

showEmpty();
