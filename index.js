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
const selectedIndex = parseInt(localStorage.getItem("borderSize"));
const selectedBombs = parseInt(localStorage.getItem("bombsAmount"));

let value = 15; // default value of bombs

// rangeInput.value = selectedBombs ? selectedBombs : value; // use default value if another is not saved

if (typeof selectedBombs === undefined) rangeInput.value = value;
else rangeInput.value = selectedBombs;

if (typeof selectedIndex === undefined) {
    highLightSelected(25);
    positionNumbers(25);
} else {
    highLightSelected(selectedIndex);
    positionNumbers(selectedIndex);
}

sliderChange();

for (let i = 0; i < 225; i++) {
    const newEl = document.createElement("div");
    newEl.classList.add("select-square");
    selectPanel.appendChild(newEl);
    elements.push(newEl);
    newEl.addEventListener("mouseenter", (e) => {
        highlightPrevious(elements.indexOf(e.target));
    });
}

console.log(selectedIndex);
if (typeof selectedIndex === undefined) highLightSelected(25);
else highLightSelected(selectedIndex);

function highlightPrevious(index) {
    elements.forEach((element, elementIndex) => {
        if (elementIndex <= index && elementIndex % 15 <= index % 15)
            element.classList.add("select-square-highlight");
        else element.classList.remove("select-square-highlight");
    });
}

function highLightSelected(index) {
    elements.forEach((element, elementIndex) => {
        if (elementIndex <= index && elementIndex % 15 <= index % 15) {
            element.classList.add("selected-square-highlight");
        } else element.classList.remove("selected-square-highlight");
    });

    localStorage.setItem("borderSize", index);
}

function sliderChange() {
    const min = rangeInput.min;
    const max = rangeInput.max;
    value = rangeInput.value;

    rangeInput.style.backgroundSize =
        ((value - min) * 100) / (max - min) + "% 100%";
    bombsLabel.textContent = value;
    if (value < 25) bombsLabel.style.left = `${value * 4.5 + 10}px`;
    if (value >= 25) bombsLabel.style.left = `${value * 4.6 + 6}px`;
    localStorage.setItem("bombsAmount", value);
}

function positionNumbers(index) {
    const sizeXValue = (index % 15) + 1;
    const sizeYValue = Math.floor(index / 15) + 1;
    sizeX.textContent = sizeXValue;
    sizeY.textContent = sizeYValue;
    sizeX.style.left = 20 + sizeXValue * 10 + "px";
    sizeY.style.top = 15 + sizeYValue * 10 + "px";
}

selectPanel.addEventListener("click", (e) => {
    const index = elements.indexOf(e.target);
    if (e.target.classList != "select-panel") {
        highLightSelected(index);
        positionNumbers(index);
    }
});

selectPanel.addEventListener("mouseleave", () => {
    elements.forEach((element) => {
        element.classList.remove("select-square-highlight");
    });
});

rangeInput.addEventListener("input", sliderChange);

// slider.textContent = 2;
