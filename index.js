const selectPanel = document.querySelector(".select-panel");
const selectBombsAmount = document.querySelector(".select-bombs-amount");
const slider = document.querySelector(
    ".select-bombs-amount::-webkit-slider-thumb"
);
const rangeInput = document.querySelector(".select-bombs-amount");
const bombsLabel = document.querySelector(".select-bombs-label");
const sizeX = document.querySelector(".size-x");
const sizeY = document.querySelector(".size-y");

const elements = [];

let selectedIndex = localStorage.getItem("borderSize");
let amountOfBombs = localStorage.getItem("bombsAmount");

console.log(selectedIndex);

if (selectedIndex === null) selectedIndex = 96;
if (amountOfBombs === null) amountOfBombs = 15;

for (let i = 0; i < 225; i++) {
    const newEl = document.createElement("div");
    newEl.classList.add("select-square");
    selectPanel.appendChild(newEl);
    elements.push(newEl);
    newEl.addEventListener("mouseenter", (e) => {
        highlightPrevious(elements.indexOf(e.target));
    });
}

highLightSelected(selectedIndex);
changeSliderValue(amountOfBombs);

function highlightPrevious(index) {
    elements.forEach((element, elementIndex) => {
        if (elementIndex <= index && elementIndex % 15 <= index % 15)
            element.classList.add("select-square-highlight");
        else element.classList.remove("select-square-highlight");
    });
}

function highLightSelected(index) {
    if (((index % 15) + 1) * (Math.floor(index / 15) + 1) - 1 < amountOfBombs) {
        console.log(index, amountOfBombs);
        changeSliderValue(
            ((index % 15) + 1) * (Math.floor(index / 15) + 1) - 1
        );
    }

    elements.forEach((element, elementIndex) => {
        if (elementIndex <= index && elementIndex % 15 <= index % 15) {
            element.classList.add("selected-square-highlight");
        } else element.classList.remove("selected-square-highlight");
    });

    selectedIndex = index;
    localStorage.setItem("borderSize", index);

    const sizeXValue = (index % 15) + 1;
    const sizeYValue = Math.floor(index / 15) + 1;
    sizeX.textContent = sizeXValue;
    sizeY.textContent = sizeYValue;
    sizeX.style.left = 20 + sizeXValue * 9 + "px";
    sizeY.style.top = 15 + sizeYValue * 9 + "px";
}

function changeSliderValue(value) {
    if (
        ((selectedIndex % 15) + 1) * (Math.floor(selectedIndex / 15) + 1) <
        value
    ) {
        while (
            ((selectedIndex % 15) + 1) * (Math.floor(selectedIndex / 15) + 1) <
            value
        ) {
            selectedIndex += 1;
        }
        highLightSelected(selectedIndex);
    }

    const min = rangeInput.min;
    const max = rangeInput.max;

    rangeInput.value = value;

    rangeInput.style.backgroundSize =
        ((value - min) * 100) / (max - min) + "% 100%";
    bombsLabel.textContent = value;
    bombsLabel.style.left = `${value * 4.5 + 10}px`;
    amountOfBombs = value;
    localStorage.setItem("bombsAmount", value);
}

selectPanel.addEventListener("click", (e) => {
    const index = elements.indexOf(e.target);
    if (index != -1) {
        highLightSelected(index);
    }
});

selectPanel.addEventListener("mouseleave", () => {
    elements.forEach((element) => {
        element.classList.remove("select-square-highlight");
    });
});

rangeInput.addEventListener("input", () => {
    changeSliderValue(parseInt(rangeInput.value));
});
