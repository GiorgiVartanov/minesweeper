const selectPanel = document.querySelector(".select-panel");
// const startButton = document.querySelector(".start-button");
const selectBombsAmount = document.querySelector(".select-bombs-amount");
const slider = document.querySelector(
    ".select-bombs-amount::-webkit-slider-thumb"
);
const rangeInput = document.querySelector(".select-bombs-amount");
const bombsLabel = document.querySelector(".select-bombs-label");

const elements = [];
const selectedIndex = parseInt(localStorage.getItem("borderSize"));
const selectedBombs = parseInt(localStorage.getItem("bombsAmount"));

let value = 15; // default value of bombs

// rangeInput.value = selectedBombs ? selectedBombs : value; // use default value if another is not saved

if (typeof selectedBombs === undefined) rangeInput.value = value;
else rangeInput.value = selectedBombs;

console.log(selectedIndex);

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

selectPanel.addEventListener("click", (e) => {
    if (e.target.classList != "select-panel") {
        highLightSelected(elements.indexOf(e.target));
    }
});

selectPanel.addEventListener("mouseleave", () => {
    elements.forEach((element) => {
        element.classList.remove("select-square-highlight");
    });
});

rangeInput.addEventListener("input", sliderChange);

// slider.textContent = 2;
