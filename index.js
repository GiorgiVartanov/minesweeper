const selectPanel = document.querySelector(".select-panel");
const startButton = document.querySelector(".start-button");

const elements = [];
const selectedIndex = parseInt(localStorage.getItem("borderSize"));

for (let i = 0; i < 225; i++) {
    const newEl = document.createElement("div");
    newEl.classList.add("select-square");
    selectPanel.appendChild(newEl);
    elements.push(newEl);
    newEl.addEventListener("mouseenter", (e) => {
        // console.log(elements.indexOf(e.target));
        highlightPrevious(elements.indexOf(e.target));
    });
}

highLightSelected(selectedIndex);

function highlightPrevious(index) {
    elements.forEach((element, elementIndex) => {
        if (elementIndex <= index && elementIndex % 15 <= index % 15)
            element.classList.add("select-square-highlight");
        else element.classList.remove("select-square-highlight");
    });
}

function highLightSelected(index) {
    console.log(index);
    // let xSize = 0;
    // let ySize = 0;
    elements.forEach((element, elementIndex) => {
        if (elementIndex <= index && elementIndex % 15 <= index % 15) {
            element.classList.add("selected-square-highlight");
        } else element.classList.remove("selected-square-highlight");
        // xSize = index % 15;
        // ySize = Math.floor(index / 15);
        // console.log(xSize, ySize);
    });

    localStorage.setItem("borderSize", index);
    // localStorage.setItem("borderSize", `${xSize}x${ySize}`);
}

selectPanel.addEventListener("click", (e) => {
    if (e.target.classList != "select-panel") {
        // const index = elements.indexOf(e.target);
        highLightSelected(elements.indexOf(e.target));
        // elements.forEach((element, elementIndex) => {
        //     if (elementIndex <= index && elementIndex % 15 <= index % 15) {
        //         element.classList.add("selected-square-highlight");
        //         xSize = index % 15;
        //         ySize = Math.floor(index / 15);
        //         console.log(xSize, ySize);
        //     } else element.classList.remove("selected-square-highlight");
        // });

        // localStorage.setItem("border-size", `${xSize}x${ySize}`);
    }
});

selectPanel.addEventListener("mouseleave", () => {
    elements.forEach((element) => {
        element.classList.remove("select-square-highlight");
    });
});
