// if needed, can use an alternative importing e.g. https://cdn.jsdelivr.net/npm/<name>/+esm, install locally, importmap
// or, try github.com/zikaari/monaco-editor-textmate instead
import { createHighlighter } from 'https://esm.sh/shiki'
import { shikiToMonaco } from 'https://esm.sh/@shikijs/monaco'









import * as d3 from "https://cdn.jsdelivr.net/npm/d3/+esm"; // (https://d3js.org/getting-started#d3-in-vanilla-html) or https://unpkg.com/d3?module (https://stackoverflow.com/questions/48471651/es6-module-import-of-d3-4-x-fails) or https://d3js.org/d3.v4.min.js (Daryl testing) or https://esm.sh/d3
// TODO: if needed, can make resizing the visual smaller make it around the center rather than the left
const svg = d3.select("#svg");
    // .attr("width", "100%")
    // .attr("height", "100%");

const container = svg.append("g")
    .attr("width", "100%")
    .attr("height", "100%");

const DATA_STRUCTURES_HEIGHT_PERCENTAGE = 50;
const PRIMITIVES_HEIGHT_PERCENTAGE = 35;
const STEP_THROUGH_HEIGHT_PERCENTAGE = 15;

// Define clipping paths
container.append("defs").append("clipPath")
    .attr("id", "clip-dataStructures")
    .append("rect")
    .attr("width", `10000px`)
    .attr("height", `${DATA_STRUCTURES_HEIGHT_PERCENTAGE}%`)
    .attr("x", "0")
    .attr("y", "0");

container.append("defs").append("clipPath")
    .attr("id", "clip-primitives")
    .append("rect")
    .attr("width", `10000px`)
    .attr("height", `${PRIMITIVES_HEIGHT_PERCENTAGE}%`)
    .attr("x", "0")
    .attr("y", `${DATA_STRUCTURES_HEIGHT_PERCENTAGE}%`);

container.append("defs").append("clipPath")
    .attr("id", "clip-stepThrough")
    .append("rect")
    .attr("width", `10000px`)
    .attr("height", `${STEP_THROUGH_HEIGHT_PERCENTAGE}%`)
    .attr("x", "0")
    .attr("y", `${DATA_STRUCTURES_HEIGHT_PERCENTAGE + PRIMITIVES_HEIGHT_PERCENTAGE}%`);

// Append groups and apply clipping paths
const dataStructures = container.append("g")
    .attr("clip-path", "url(#clip-dataStructures)")
    .attr("x", "0")
    .attr("y", "0")
    // .attr("transform", "translate(0, 0)");

const primitives = container.append("g")
    .attr("clip-path", "url(#clip-primitives)")
    .attr("x", "0")
    .attr("y", `${DATA_STRUCTURES_HEIGHT_PERCENTAGE}%`)
    // .attr("transform", `translate(0, ${dataStructuresHeight})`);

const stepThrough = container.append("g")
    .attr("clip-path", "url(#clip-stepThrough)")
    .attr("x", "0")
    .attr("y", `${DATA_STRUCTURES_HEIGHT_PERCENTAGE + PRIMITIVES_HEIGHT_PERCENTAGE}%`)
    // .attr("transform", `translate(0, ${dataStructuresHeight + primitivesHeight})`);

// Add colored sections to the groups if needed
const dataStructuresRect = dataStructures.append("rect")
    .attr("width", `10000px`)
    .attr("height", `${DATA_STRUCTURES_HEIGHT_PERCENTAGE}%`)
    .attr("fill", "rgba(255, 0, 0, 0.05)") // red with 50% opacity
    .attr("x", "0")
    .attr("y", "0");

const primitivesRect = primitives.append("rect")
    .attr("width", `10000px`)
    .attr("height", `${PRIMITIVES_HEIGHT_PERCENTAGE}%`)
    .attr("fill", "rgba(0, 128, 0, 0.05)") // green with 50% opacity
    .attr("x", "0")
    .attr("y", `${DATA_STRUCTURES_HEIGHT_PERCENTAGE}%`);

const stepThroughRect = stepThrough.append("rect")
    .attr("width", `10000px`)
    .attr("height", `${STEP_THROUGH_HEIGHT_PERCENTAGE}%`)
    .attr("fill", "rgba(0, 0, 255, 0.05)") // blue with 50% opacity
    .attr("x", "0")
    .attr("y", `${DATA_STRUCTURES_HEIGHT_PERCENTAGE + PRIMITIVES_HEIGHT_PERCENTAGE}%`);

// i think it automatically made it so you can't "website zoom", or scroll to hard to back arrow browser, on visualization
svg.call(d3.zoom()
    .scaleExtent([0.1, 6])
    .on("zoom", e => container.attr("transform", e.transform))
);










// later if needed, can make position based on percentage for more responsive design
// console.log('lastBox', lastBox);
// console.log('lastBox.empty()', lastBox.empty());
// if (!lastBox.empty()) {
//     console.log('lastBox.node().getBBox().x', lastBox.node().getBBox().x);
//     console.log('lastBox.node().getBBox().width', lastBox.node().getBBox().width);
// }
// console.log('primitives.node().getBBox().width', primitives.node().getBBox().width);
// const rightPercentage = 5 + (lastBox.empty() ? 0 : ((lastBox.node().getBBox().x + lastBox.node().getBBox().width) / primitives.node().getBBox().width * 100));

function drawOverflowableText(group, x, y, width, height, color = false, center = false, text = "") {
    let box;
    if (color) {
        box = group.append("rect")
            .attr("x", x)
            .attr("y", y)
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "rgb(80, 80, 80)");
    }

    const foreignObject = group.append("foreignObject")
        .attr("x", x)
        .attr("y", y)
        .attr("width", width)
        .attr("height", height);

    const div = foreignObject.append("xhtml:div")
        .style("overflow", "auto")
        .style("height", "100%")
        .on("wheel", function (event) {
            event.stopPropagation();
        }, { passive: true });
    
    if (center) {
        div.style("display", "flex")
            .style("align-items", "center")
            .style("justify-content", "center");
    }

    if (text) {
        div.text(text);
    }
    
    return {
        box,
        foreignObject,
        div
    };
}

const dataStructureTypes = new Set([ // TODO: uncomment when implemented
    'array',
    'set',
    // 'map',
    'queue'
]);

const ELEMENT_WIDTH = 50; // px
const ELEMENT_HEIGHT = ELEMENT_WIDTH; // px
const ELEMENT_GAP = 10; // px
const ELEMENT_TOP_MARGIN = 80; // px
const DATA_STRUCTURE_GAP = 20; // px

function drawDataStructure(_function, depth, name, type, value) {
    // TODO: implement special visualization for data structures
    // TODO: do cellVarToNameTd esque logic here (have more robust typing e.g. free data structure vs. free primitive?)
    const lastBoundary = dataStructures.select(".data-structure-boundary:last-of-type");
    const x = DATA_STRUCTURE_GAP + (lastBoundary.empty() ? 0 : lastBoundary.node().getBBox().x + lastBoundary.node().getBBox().width);
    const group = dataStructures.append("g")
        .attr("class", "data-structure-boundary");
    
    const elementDataStructuresToDraw = [];
    
    switch (type) {
        case 'queue': { // same as array
            const { foreignObject: nameForeignObject } = drawOverflowableText(group, x + 4, ELEMENT_TOP_MARGIN - 20, ELEMENT_WIDTH, "2em", false, false, name);
            for (let [index, [elementType, elementValue]] of value.entries()) {
                const indent = (index * (ELEMENT_WIDTH + ELEMENT_GAP));
                const elementX = x + indent; // px
                nameForeignObject.attr("width", ELEMENT_WIDTH + indent - 4);
                if (index === 0) {
                    drawOverflowableText(group, elementX, ELEMENT_TOP_MARGIN + ELEMENT_HEIGHT + 4, ELEMENT_WIDTH, "1.1em", false, true, "left");
                } else if (index === value.length - 1) {
                    drawOverflowableText(group, elementX, ELEMENT_TOP_MARGIN + ELEMENT_HEIGHT + 4, ELEMENT_WIDTH, "1.1em", false, true, "right");
                }
                if (dataStructureTypes.has(elementType)) {
                    drawOverflowableText(group, elementX, ELEMENT_TOP_MARGIN, ELEMENT_WIDTH, ELEMENT_HEIGHT, true);
                    elementDataStructuresToDraw.push([index, elementType, elementValue]);
                } else { // Primitive type
                    elementValue = formatValue(elementType, elementValue);
                    drawOverflowableText(group, elementX, ELEMENT_TOP_MARGIN, ELEMENT_WIDTH, ELEMENT_HEIGHT, true, true, elementValue);
                }
            }
            break;
        }
        case 'array': {
            const { foreignObject: nameForeignObject } = drawOverflowableText(group, x + 4, ELEMENT_TOP_MARGIN - 20, ELEMENT_WIDTH, "2em", false, false, name);
            for (let [index, [elementType, elementValue]] of value.entries()) {
                const indent = (index * (ELEMENT_WIDTH + ELEMENT_GAP));
                const elementX = x + indent; // px
                nameForeignObject.attr("width", ELEMENT_WIDTH + indent - 4);
                drawOverflowableText(group, elementX, ELEMENT_TOP_MARGIN + ELEMENT_HEIGHT + 4, ELEMENT_WIDTH, "1.1em", false, true, `[${index}]`);
                if (dataStructureTypes.has(elementType)) {
                    drawOverflowableText(group, elementX, ELEMENT_TOP_MARGIN, ELEMENT_WIDTH, ELEMENT_HEIGHT, true);
                    elementDataStructuresToDraw.push([index, elementType, elementValue]);
                } else { // Primitive type
                    elementValue = formatValue(elementType, elementValue);
                    drawOverflowableText(group, elementX, ELEMENT_TOP_MARGIN, ELEMENT_WIDTH, ELEMENT_HEIGHT, true, true, elementValue);
                }
            }
            break;
        }
        case 'set': {
            const { foreignObject: nameForeignObject } = drawOverflowableText(group, x + 4, ELEMENT_TOP_MARGIN - 20, ELEMENT_WIDTH, "2em", false, false, name);
            for (let [index, [elementType, elementValue]] of value.entries()) {
                const indent = (index * (ELEMENT_WIDTH + ELEMENT_GAP));
                const elementX = x + indent; // px
                nameForeignObject.attr("width", ELEMENT_WIDTH + indent - 4);
                if (dataStructureTypes.has(elementType)) {
                    drawOverflowableText(group, elementX, ELEMENT_TOP_MARGIN, ELEMENT_WIDTH, ELEMENT_HEIGHT, true);
                    elementDataStructuresToDraw.push([index, elementType, elementValue]);
                } else { // Primitive type
                    elementValue = formatValue(elementType, elementValue);
                    drawOverflowableText(group, elementX, ELEMENT_TOP_MARGIN, ELEMENT_WIDTH, ELEMENT_HEIGHT, true, true, elementValue);
                }
            }
            break;
        }
        case 'map': {

            break;
        }
    }

    for (let [index, elementType, elementValue] of elementDataStructuresToDraw) {
        drawDataStructure(_function, depth, `${name}[${index}]`, elementType, elementValue); 
    }
}

const BOX_WIDTH = 140; // px
const BOX_GAP = 10; // px
const BOX_TOP_MARGIN = 5; // %
// const fontSizeHeight = 13;

// TODO: convert all this styling to CSS?
function drawCallStackFrame(_function, depth, callStackFrame, cellVars, cellVarToNameTd) {
    const lastBox = primitives.select(".call-stack-frame:last-of-type");
    const x = BOX_GAP + (lastBox.empty() ? 0 : lastBox.node().getBBox().x + lastBox.node().getBBox().width);
    const group = primitives.append("g")
        .attr("class", "call-stack-frame");

    // const functionText = group.append("foreignObject")
    //     .attr("x", x)
    //     .attr("y", `${dataStructuresHeightPercentage /*+ 4*/}%`)
    //     .attr("width", boxWidth)
    //     .attr("height", "1em") // Adjust height as needed
    //     .append("xhtml:div")
    //         .style("width", "100%")
    //         .style("white-space", "nowrap")
    //         .style("overflow-x", "auto")
    //         .style("text-overflow", "ellipsis")
    //         .style("color", "white")
    //         .text(_function)
    //         .on("wheel", function(event) {
    //             // TODO: only stop propagation if there's overflow?
    //             event.stopPropagation(); // Prevent zooming when scrolling inside the foreignObject
    //         }, { passive: true });
    
    // const depthText = functionText.append("span")
    //     .text(depth)
    //     .style('font-size', '.7em')
    //     .style("margin-left", ".2ch")
    //     .style("vertical-align", ".3em")
    //     .style("display", "inline-block")
    //     .style("white-space", "nowrap");

    const functionText = group.append("text") // TODO: account for long names e.g. foreignObject with overflow-x: auto
        .attr("fill", "white")
        .attr("x", x)
        .attr("y", `${DATA_STRUCTURES_HEIGHT_PERCENTAGE + BOX_TOP_MARGIN - 1}%`)
        .text(_function)
        .append("tspan")
            .text(depth)
            .style('font-size', '.7em')
            .attr("dx", ".2ch")
            .attr("dy", ".3em");

    const box = group.append("rect")
        .attr("x", x)
        .attr("y", `${DATA_STRUCTURES_HEIGHT_PERCENTAGE + BOX_TOP_MARGIN}%`)
        .attr("width", BOX_WIDTH)
        .attr("height", `${PRIMITIVES_HEIGHT_PERCENTAGE - 15}%`)
        .attr("fill", "rgb(80, 80, 80)");

    const foreignObject = group.append("foreignObject")
        .attr("x", x)
        .attr("y", `${DATA_STRUCTURES_HEIGHT_PERCENTAGE + BOX_TOP_MARGIN}%`)
        .attr("width", BOX_WIDTH)
        .attr("height", `${PRIMITIVES_HEIGHT_PERCENTAGE - 15}%`);

    const div = foreignObject.append("xhtml:div")
        .style("overflow", "auto")
        .style("height", "100%")
        .on("wheel", function(event) {
            // TODO: only stop propagation if there's overflow? Otherwise, could be annoying
            event.stopPropagation(); // Prevent zooming when scrolling inside the foreignObject
        }, { passive: true });
    
    // Create a table element
    const table = div.append("table")
        .style("padding", "5px");
        // .style("width", "100%")
        // .style("border-collapse", "collapse");
    
    // Append rows to the table for each name and value pair
    for (let [name, [type, value]] of callStackFrame) {
        const row = table.append("tr");

        // Append name cell (right-aligned)
        const nameTd = row.append("td")
            .style("text-align", "right")
            .style("padding-right", "8px")
            .text(name);
        
        const valueTd = row.append("td")
            
        const valueSpan = valueTd.append("span")
            .style("padding-inline", "2px")
            .style("border-left", "1px solid gray")
            .style("border-bottom", "1px solid gray");
        
            // Append value cell (left-aligned)
        if (dataStructureTypes.has(type)) {
            drawDataStructure(_function, depth, name, type, value);
        } else if (type === 'free')  {
            const cellVarNameTd = cellVarToNameTd.get(value);
            if (cellVarNameTd) {
                // TODO: draw arrow from cellVarNameTd to nameTd
            }
        } else {
            value = formatValue(type, value);
            valueSpan
                .style("text-align", "left")
                .text(value);
            if (cellVars.has(`${depth} ${name}`)) {
                cellVarToNameTd.set(`${depth} ${name}`, nameTd);
            }
        }
    }
    
    // setTimeout(() => {
    //     div.node().scrollLeft = table.select("tr").select("td:first-child").node().offsetWidth - (div.node().clientWidth / 2);
    // }, 0);
}

function drawCallStack(callStack, cellVars) {
    const cellVarToNameTd = new Map();
    for (let depth = 0; depth < callStack.length; depth++) {
        const [_function, callStackFrame] = callStack[depth];
        drawCallStackFrame(_function, depth, callStackFrame, cellVars, cellVarToNameTd);
    }
}

function eraseCallStack() {
    dataStructures.selectAll(".data-structure-boundary").remove();
    primitives.selectAll(".call-stack-frame").remove();
}







// let text = primitives.append("text")
//     .attr("x", "50")
//     .attr("y", "60%")
//     .text("HELLO WORLD");

// let rect = primitives.append("rect")
//     .attr("x", "50")
//     .attr("y", "60%")
//     .attr("height", "20%")
//     // .attr("width", "20%")
//     .attr("fill", "red");

// rect.attr("width", rect.node().getBBox().height);

// (async () => {
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     let isLeft = true;
//     const moveText = () => {
//         if (isLeft) {
//             text.transition()
//                 .duration(500)
//                 .attr("x", "50")
//                 .attr("y", "60%");
//         } else {
//             text.transition()
//                 .duration(500)
//                 .attr("x", "200")
//                 .attr("y", "60%");
//         }
//         isLeft = !isLeft;
//         setTimeout(moveText, 1000);
//     };
//     moveText();
// })();
























document.addEventListener('DOMContentLoaded', () => {
    // const buttons = document.getElementById('buttons');
    // const examplesButton = document.getElementById('examples-button') || document.getElementById('play-button');
    const editor = document.getElementById('editor');
    const resizer = document.getElementById('resize');
    let xOffset;

    // function updateButtonsPosition() {
    //     const editorRight = editor.getBoundingClientRect().right;
    //     const examplesButtonWidth = examplesButton.getBoundingClientRect().width;
    //     let leftPosition = editorRight - examplesButtonWidth;
    //     let rightPosition = leftPosition + buttons.getBoundingClientRect().width;

    //     if (leftPosition < 0 || window.innerWidth < buttons.getBoundingClientRect().width ) {
    //         leftPosition = 0;
    //     } else if (rightPosition > window.innerWidth) {
    //         leftPosition = window.innerWidth - buttons.getBoundingClientRect().width;
    //     }
        
    //     buttons.style.left = `${leftPosition}px`;
    // }

    //TODO: make it clip to the original?
    function resize(e) {
        const clientXPercentage = ((e.clientX - xOffset) / window.innerWidth) * 100;
        document.documentElement.style.setProperty('--editor-width', `${clientXPercentage}vw`);
        // updateButtonsPosition();
    }

    function stopResize() {
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    }

    resizer.addEventListener('mousedown', function(e) { // TODO: mimic VS Code e.g. blue line
        xOffset = e.clientX - editor.getBoundingClientRect().right;
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    });

    // window.addEventListener('resize', updateButtonsPosition);
    // updateButtonsPosition();
});

const playButton = document.getElementById('play-button');

const playButtonState = Object.freeze({
    Build: 'Build',
    Building: 'Building',
    Play: 'Play',
    Pause: 'Pause',
});

const NameToImage = new Map();

function preloadPlayButtonImages() {
    for (const key in playButtonState) {
        if (playButtonState.hasOwnProperty(key)) {
            const value = playButtonState[key];
            const img = new Image();
            img.src = `./assets/${value.toLowerCase()}.svg`;
            img.alt = value;
            img.className = 'icon';
            NameToImage.set(value, img);
        }
    }
}

preloadPlayButtonImages();

function getPlayButtonState() {
    return playButton.innerText.trim();
}

function setPlayButtonState(newPlayButtonState) {
    // playButton.innerHTML = `<img src="./assets/${newPlayButtonState.toLowerCase()}.svg" alt="${newPlayButtonState}" class="icon"> ${newPlayButtonState}`;
    playButton.innerHTML = '';
    playButton.appendChild(NameToImage.get(newPlayButtonState));
    playButton.appendChild(document.createTextNode(newPlayButtonState));
    if (newPlayButtonState.toLowerCase() === 'pause') {
        playButton.classList.add('depressed');
    } else {
        playButton.classList.remove('depressed');
    }
}

const stepSlider = document.getElementById('step-slider');
const stepSliderLeft = document.getElementById('step-left');
const stepSliderRight = document.getElementById('step-right');
const stepCounter = document.getElementById('step-counter');

function setStepSliderValue(value) {
    stepSlider.value = value.toString();
}

// function setStepSliderMin(min) { // effective minimum, 1
//     stepSlider.min = (min - 1).toString();
// }

function setStepSliderMax(max) {
    stepSlider.max = max.toString();
}

function getStepSliderValue() {
    return parseInt(stepSlider.value);
}

function getStepSliderMin() { // effective minimum, 1
    return parseInt(stepSlider.min) + 1;
}

function getStepSliderMax() {
    return parseInt(stepSlider.max);
}

const stepHighlightContainer = document.querySelector('#step-highlight-container');

function highlightSteps(_steps) {
    _steps.forEach(step => {
        const stepHighlight = document.createElement('div');
        stepHighlight.classList.add('step-highlight');
        stepHighlight.setAttribute('data-step', step);
        const position = (step - getStepSliderMin() + 1) / (getStepSliderMax() - getStepSliderMin() + 1) * 100;
        stepHighlight.style.left = `${position}%`;
        stepHighlightContainer.appendChild(stepHighlight);
    });
}

function unhighlightSteps(_steps) {
    _steps.forEach(step => {
        const highlights = stepHighlightContainer.querySelectorAll(`.step-highlight[data-step="${step}"]`);
        highlights.forEach(highlight => {
            stepHighlightContainer.removeChild(highlight);
        });
    });
}

function unhighlightAllSteps() {
    const highlights = stepHighlightContainer.querySelectorAll('.step-highlight');
    highlights.forEach(highlight => {
        stepHighlightContainer.removeChild(highlight);
    });
}

// TODO: would be more robust and elegant to use a recursive function to format each variable e.g. consider nested arrays, maps, and sets
// TODO: handles e.g. hash map with tuples as keys, which is allowed in Python but not in JavaScript?
// TODO: Infinity -> eg ∞ / \u221E
// TODO: true -> True, or nah? 
// TODO: None -> null, or nah?
function formatValue(type, value, isDataStructureElement = false) {
    switch (type) {
        case 'array':
            return `[${value.map(([t, v]) => formatValue(t, v, true)).join(', ')}]`;
        case 'set':
            return `{${value.map(([t, v]) => formatValue(t, v, true)).join(', ')}}`;
        case 'map':
            return `{${value.map(([[kt, k], [vt ,v]]) => `${formatValue(kt, k, true)}: ${formatValue(vt, v, true)}`).join(', ')}}`;
        case 'string': // TODO: simply do str() in python?
            return `"${value.replace(/ /g, '\u00A0')}"`;
        case 'float': // TODO: account for edge cases e.g. Infinity, scientific notation?
            // value = value.toString();
            // if (!value.includes('.')) {
            //     value += '.0';
            // }
            return value.toString();
        case 'null':
            return 'null';
        default:
            return value.toString();
    }
}

// function formatCallStack(callStack) {
//     let formatted = [];
//     for (let depth = 0; depth < callStack.length; depth++) {
//         const [_function, callStackDepth] = callStack[depth];
//         for (let [name, [type, value]] of callStackDepth) {
//             value = formatValue(type, value);
//             formatted.push(`${_function} ${depth} | ${name} : ${type} = ${value}`);
//         }
//     }
//     return '\n\n\n\u00A0\u00A0\u00A0' + formatted.join('\n\u00A0\u00A0\u00A0');
// }

let wait = 300;

const speedSlider = document.getElementById('speed-slider');
speedSlider.addEventListener('input', () => {
    wait = 100 * (7 - parseInt(speedSlider.value));
});

let currentTimeout = null;
let initialPlayButtonState;

let stopPlaying;

stepSlider.addEventListener('mousedown', () => {
    // console.log('Step slider mousedown:', getStepSliderValue());
    initialPlayButtonState = getPlayButtonState();
    stopPlaying = true;
});

stepSlider.addEventListener('input', () => {
    // console.log('Step slider input:', getStepSliderValue());
    if (getStepSliderValue() < getStepSliderMin()) {
        setStepSliderValue(getStepSliderMin());
    }
    processStep(getStepSliderValue()); // parseInt(this.value)
    if (initialPlayButtonState === playButtonState.Pause) {
        if (getStepSliderValue() == getStepSliderMax()) {
            setPlayButtonState(playButtonState.Play);
        } else {
            setPlayButtonState(playButtonState.Pause);
        }
    }
});

stepSlider.addEventListener('mouseup', () => {
    // console.log('Step slider mouseup', getStepSliderValue());
    if (getStepSliderValue() < getStepSliderMax() && initialPlayButtonState === playButtonState.Pause) {
        play();
    }
});

function stepLeft() {
    setStepSliderValue(Math.max(getStepSliderMin(), getStepSliderValue() - 1));
    processStep(getStepSliderValue());
}

function stepRight() {
    setStepSliderValue(Math.min(getStepSliderMax(), getStepSliderValue() + 1));
    processStep(getStepSliderValue());
}

stepSliderLeft.addEventListener('click', () => stepLeft());

// TODO: additionally, when you keyboard navigable to the stepSlider using tab, you can use the left and right arrow keys which should trigger this event instead of input event listener?
//   also, allow arrow keys to work without having to navigate to the slider?
stepSliderRight.addEventListener('click', () => stepRight()); 

// const dataStructures = document.getElementById('data-structures'); // TODO
// const primitives = document.getElementById('primitives');
// const stepThrough = document.getElementById('step-through');
const editorLine = document.getElementById('editor-line');
const editorLineLineno = document.getElementById('editor-line-lineno');
const editorLineLine = document.getElementById('editor-line-line');
const terminal = document.getElementById('terminal');
// const terminalError = document.getElementById('terminal-error');

let mouseListener;
let editor;

function reset() {
    stopPlaying = true;
    setStepSliderMax(10);
    setStepSliderValue(5);
    stepCounter.innerText = '';
    stepSlider.setAttribute('disabled', '');
    stepSliderLeft.setAttribute('disabled', '');
    stepSliderRight.setAttribute('disabled', '');
    mouseListener.dispose();
    unhighlightLines();
    eraseCallStack(); // dataStructures.innerHTML = '';
    terminal.innerText = '';
    stopPlaying = true;
    unhighlightAllSteps();
    unhighlightAllLineno();
    unmirrorLine();
    setPlayButtonState(playButtonState.Build);
}

let sampleCode;
let buildCode;
let pyodide;

let resolveSampleCodePromise;
let sampleCodePromise = new Promise((resolve) => {
    resolveSampleCodePromise = resolve;
});
let resolveBuildCodePromise;
let buildCodePromise = new Promise((resolve) => {
    resolveBuildCodePromise = resolve;
});
let resolvePyodidePromise;
let pyodidePromise = new Promise((resolve) => {
    resolvePyodidePromise = resolve;
});

fetch('./samples/sample18.py').then(response => response.text()).then((text) => {
    sampleCode = text;
    resolveSampleCodePromise();
});
fetch('./build.py').then(response => response.text()).then((text) => {
    buildCode = text;
    resolveBuildCodePromise();
});
loadPyodide().then((loadedPyodide) => {
    pyodide = loadedPyodide;
    resolvePyodidePromise();
});

// console.time('promises');
await Promise.all([sampleCodePromise, buildCodePromise]); // TODO: distribute where needed
// console.timeEnd('promises');

// let linenos;
// let lines;

// TODO: make highlighting look more like VS Code's (or even LeetCode's) eg https://github.com/microsoft/monaco-editor/issues/1762
let resolveEditorLoaded;
const editorLoaded = new Promise(resolve => resolveEditorLoaded = resolve);
let editorLineEditor;
let editorLoading = document.getElementById('editor-loading');
require.config({ paths: { vs: 'node_modules/monaco-editor/min/vs' } });
require(['vs/editor/editor.main'], async () => {

    const highlighter = await createHighlighter({
        themes: ['dark-plus'],
        langs: ['python']
    })
    
    monaco.languages.register({ id: 'python' })
    
    shikiToMonaco(highlighter, monaco)

    // console.time('editor');
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: sampleCode,
        language: 'python',
        theme: 'dark-plus',
        automaticLayout: true,
        minimap: { enabled: false },
        lineNumbers: 'on',
        stickyScroll: { enabled: false},
        scrollbar: { vertical: 'hidden' },
        overviewRulerBorder: false,
        overviewRulerLanes: 0,
        folding: false,
        lineNumbersMinChars: 3,
        selectOnLineNumbers: false,
        'bracketPairColorization.enabled': false, // https://github.com/microsoft/monaco-editor/issues/3384, https://github.com/microsoft/monaco-editor/issues/3013, https://github.com/microsoft/monaco-editor/blob/main/CHANGELOG.md (despite the documentation)
        // bracketPairColorization: { enabled: false },
        scrollBeyondLastLine: false,
        // "semanticHighlighting.enabled": true,
        // glyphMargin: true,
        // lineDecorationsWidth: 5,
        // fontSize: '20px',
        // mouseWheelZoom: true,
        // renderLineHighlight: 'none',
        // automaticLayout: true,
    });
    // console.timeEnd('editor');
    editor.getModel().onDidChangeContent((e) => {
        // TODO: ask the user for confirmation to reset, "don't tell me again"
        unhighlightLines(); // for syntax error line highlighting
        if (getPlayButtonState() !== playButtonState.Build) {
            reset();
        }
    });
    // switch between .children array or nth-child selection if needed
    // scrolling removes the earlier lines...
    // linenos = document.querySelector("#editor div.margin-view-overlays"); // .children
    // lineOverlays = document.querySelector("#editor div.view-overlays"); // .children
    // lines = document.querySelector("#editor div.view-lines.monaco-mouse-cursor-text"); // .children
    // console.log('linenos:', linenos, 'lines:', lines); // DEBUG

    editorLineEditor = monaco.editor.create(document.getElementById('editor-line'), {
        value: '',
        lineNumbers: () => 0,
        readOnly: true,
        renderLineHighlight: 'none',
        language: 'python',
        theme: 'dark-plus',
        automaticLayout: true,
        minimap: { enabled: false },
        stickyScroll: { enabled: false},
        scrollbar: { horizontal: 'hidden', vertical: 'hidden' },
        overviewRulerBorder: false,
        overviewRulerLanes: 0,
        folding: false,
        lineNumbersMinChars: 3,
        'bracketPairColorization.enabled': false, // see above
        scrollBeyondLastLine: false
        // cursorStyle: 'line', // Set cursor style to 'line' (or 'block', 'underline', etc.)
        // cursorBlinking: 'hidden', // Hide the cursor
        // renderLineHighlightOnlyWhenFocus: false, // Ensure line highlight is always off
    });
    editorLoading.remove();
    resolveEditorLoaded();
});

let steps, linenoToSteps, error, errorLineno;

function formatTraceback(tb) {
    let filteredTbLines = ['Traceback (most recent call last):'];
    const tbLines = tb.split('\n');
    let afterFileUnknown = false;
    for (let line of tbLines) {
        if (line.startsWith('  File "<unknown>", ')) {
            afterFileUnknown = true;
            line = line.slice('  File "<unknown>", '.length);
            line = '  ' + line.charAt(0).toUpperCase() + line.slice(1);
            filteredTbLines.push(line);
        } else if (afterFileUnknown) {
            filteredTbLines.push(line);
            if (line.match(/^\S*Error/)) { // /^[A-Za-z]*Error/
                break;
            }
        }
    }
    return filteredTbLines.join('\n');
}

function extractErrorLinenoFromError(error) {
    const lines = error.split('\n');
    for (let i = lines.length - 2; i >= 0; i--) {
        const line = lines[i].trim();
        const match = line.match(/Line (\d+)$/);
        if (match) {
            return parseInt(match[1]);
        }
    }
    return 0;
}

async function build() {
    unhighlightLines();
    terminal.innerText = '';
    await pyodidePromise;
    // TODO: For now, can ignore nontrivial formatting (e.g. triple quotation marks, semi-colons for multiple statements on one line, or backslash for line continuation. See 6/17 screenshot for more.)
    pyodide.globals.set('code', editor.getValue());
    try { // can't catch for some errors, e.g. SyntaxError, IndentationError, in build.py, since Pyodide elevates it to JavaScript without being able to catch in build.py's try-catch? Catch here, keep in terminal-error until next build attempt
        // async processes e.g. play button state change, unlike pyodide.runPython(buildCode);. If better (e.g. even less latency), can go back to using a web worker
        await pyodide.runPythonAsync(buildCode);    
    } catch(e) {
        error = formatTraceback(e.toString());
        errorLineno = extractErrorLinenoFromError(error); // Can alternatively try extractig from e, rather than parsing formatted error
        // console.log(e, error, errorLineno); // DEBUG
        if (errorLineno > 0) {
            highlightLine(errorLineno, 'line-error');
        }
        const terminalError = document.createElement('span');
        terminalError.classList.add('terminal-error');
        terminalError.innerText = `\n\u00A0\u00A0\u00A0${error.replace(/ /g, '\u00A0').split('\n').join('\n\u00A0\u00A0\u00A0')}`;
        terminal.appendChild(terminalError);
        return false;
    } finally {
        // await pyodide.runPythonAsync('clear_collections()'); // alternatively, can look into restarting pyodide completely e.g. https://github.com/pyodide/pyodide/issues/703
    }
    steps = pyodide.globals.get('steps').toJs();
    linenoToSteps = pyodide.globals.get('lineno_to_steps').toJs();
    error = pyodide.globals.get('error');
    errorLineno = pyodide.globals.get('error_lineno');
    // console.log('steps:', steps); // DEBUG
    // console.log('linenoToSteps:', linenoToSteps); // DEBUG
    // console.log('error:', error); // DEBUG
    // console.log('errorLineno:', errorLineno); // DEBUG
    return true;
}

function setup() {
    terminal.innerText = '';
    setStepSliderMax(steps.length - 1);
    setStepSliderValue(errorLineno > 0 ? getStepSliderMax() : getStepSliderMin());    
    processStep(getStepSliderValue());
    stepSlider.removeAttribute('disabled');
    stepSliderLeft.removeAttribute('disabled');
    stepSliderRight.removeAttribute('disabled');
    document.documentElement.style.setProperty('--step-highlight-width', `max(1px, 100% / ${getStepSliderMax() - getStepSliderMin() + 1})`); // TODO: am i tripping, or are these different widths
    highlightAllLineno('cursor-pointer');
    mouseListener = editor.onMouseDown((e) => { // alternatively, onMouseUp
        if (e.target.type === monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS) {
            const lineno = e.target.position.lineNumber;
            // if (!linenoToSteps.has(lineno)) { return; }
            const _steps = linenoToSteps.get(lineno) || [];
            // console.log('Line number clicked:', lineno);
            // console.log('linenoToSteps', linenoToSteps);
            // console.log('_steps:', _steps);
            if (!linenoIsHighlighted(lineno, 'lineno-highlight')) { // I'm assuming that lineno and steps are one-to-one, so we don't have to also have a lineno attribute for step-highlights
                highlightLineno(lineno, 'lineno-highlight');
                highlightSteps(_steps);
            } else {
                unhighlightLineno(lineno, 'lineno-highlight');
                unhighlightSteps(_steps);
            }
        }
    });
    setPlayButtonState(playButtonState.Play);
}

// function unmirrorPreviousLine() {
//     const appendedLineno = linenos.querySelector(':scope > .appended-lineno:nth-last-child(1)');
//     if (appendedLineno) {
//         linenos.removeChild(appendedLineno);
//     }
//     const appendedLine = lines.querySelector(':scope > .appended-line:nth-last-child(1)');
//     if (appendedLine) {
//         lines.removeChild(appendedLine);
//     }
// }

// TODO: make a lot more efficient e.g. cache impactful styles

// const propertiesToCopy = [
    
// ]

// const propertiesToNotCopy = new Set([
//     'inset-block',
//     'inset-inline',
//     'inset-block-start',
//     'inset-block-end',
//     'inset-inline-start',
//     'inset-inline-end',
//     'top',
//     'right',
//     'bottom',
//     'left'
// ]);

// function copyComputedStyle(from, to) {
//     const fromComputedStyle = window.getComputedStyle(from);
//     for (const property of fromComputedStyle) {
//         // console.log('property:', property); // DEBUG
//         if (propertiesToNotCopy.has(property)) {
//             continue;
//         }
//         to.style[property] = fromComputedStyle.getPropertyValue(property);
//     }
// }

// function copyComputedStylesRecursively(from, to) {
//     copyComputedStyle(from, to);
//     const fromChildren = from.children;
//     const toChildren = to.children;
//     for (let i = 0; i < fromChildren.length; i++) {
//         copyComputedStylesRecursively(fromChildren[i], toChildren[i]);
//     }
// }

function mirrorLine(lineno) {
    // console.time('mirrorLine');

    // const clonedLineno = linenos[lineno - 1].cloneNode(true);
    // copyComputedStylesRecursively(linenos[lineno - 1], clonedLineno);
    // clonedLineno.style.top = 'initial';
    // editorLineLineno.innerHTML = clonedLineno.outerHTML;

    // const clonedLine = lines[lineno - 1].cloneNode(true);
    // copyComputedStylesRecursively(lines[lineno - 1], clonedLine);
    // clonedLine.style.top = 'initial';

    // const clonedLineCode = clonedLine.firstChild;
    // let child = clonedLineCode.firstChild;
    // const nbsp = '\u00A0'; // Unicode for non-breaking space

    // while (child) {
    //     let text = child.textContent;
    //     let i;
    //     for (i = 0; i < text.length && text[i] === nbsp; i++);        
    //     if (i < text.length) {
    //         child.textContent = text.substring(i);
    //         break;
    //     }
    //     const nextSibling = child.nextSibling;
    //     clonedLineCode.removeChild(child);
    //     child = nextSibling;
    // }

    // // clonedLine.style.cssText += 'margin-inline: auto !important;left: 0 !important;right: 0 !important;';
    // clonedLine.style.cssText += 'max-width: 100% !important;';
    // clonedLineCode.style.cssText += 'margin-inline: auto !important;left: 0 !important;right: 0 !important;';
    // editorLineLine.innerHTML = clonedLine.outerHTML;






    // const linenoElement = linenos.querySelector(`:scope > :nth-child(${lineno})`);
    // const clonedLinenoElement = linenoElement.cloneNode(true);
    // clonedLinenoElement.classList.add('appended-lineno');
    // clonedLinenoElement.style.position = 'absolute';
    // clonedLinenoElement.style.left = '200px';
    // linenos.appendChild(clonedLinenoElement);
    // editorLineLineno.innerHTML = clonedLinenoElement.outerHTML;

    // const lineElement = lines.querySelector(`:scope > :nth-child(${lineno})`);
    // const clonedLineElement = lineElement.cloneNode(true);
    // clonedLineElement.classList.add('appended-line');
    // clonedLineElement.style.position = 'absolute';
    // clonedLineElement.style.left = '200px';
    // lines.appendChild(clonedLineElement);
    // editorLineLine.innerHTML = clonedLineElement.outerHTML;


    editorLineEditor.getModel().setValue(editor.getModel().getLineContent(lineno).trim())
    editorLineEditor.updateOptions({
        lineNumbers: () => lineno,
    });

    // document.getElementById('editor-line').style.textAlign = 'center';

    // editorLineEditor.deltaDecorations([], [{
    //     range: new monaco.Range(lineno, 1, lineno, 1),
    //     options: {
    //         isWholeLine: true,
    //         // className: 'line-highlight',
    //         className: 'centered-text',
    //         // lineNumberClassName: 'line-highlight',
    //     },
    // }]);


    // console.timeEnd('mirrorLine');
}

function unmirrorLine() {
    editorLineEditor.getModel().setValue('')
    editorLineEditor.updateOptions({
        lineNumbers: () => 0,
    });
}

function processStep(step) { // if needed, can replace spaces with non-breaking spaces earlier. and, with variables
    const [lineno, callStack, cellVars, stdout] = steps[step];
    // console.log(`Line ${lineno}:\n└─ Call Stack:`, call_stack, '\n└─ AST Node Types:', node_types, '\n└─ Stdout:', stdout);
    eraseCallStack();
    drawCallStack(callStack, cellVars); // dataStructures.innerText = formatCallStack(call_stack);
    // for consistency with compile-time errors
    // TODO: better padding formatting
    terminal.innerText = stdout.length > 0 ? `\n\u00A0\u00A0\u00A0${stdout.replace(/ /g, '\u00A0').split('\n').join('\n\u00A0\u00A0\u00A0')}` : '';
    unhighlightLines('line-highlight');
    unhighlightLines('prev-line-highlight');
    if (step == getStepSliderMax() && errorLineno > 0) { // TODO: red
        unhighlightLines('later-line-error');
        highlightLine(errorLineno, 'line-error');
        const terminalError = document.createElement('span');
        terminalError.classList.add('terminal-error');
        terminalError.innerText = `\n\u00A0\u00A0\u00A0${error.replace(/ /g, '\u00A0').split('\n').join('\n\u00A0\u00A0\u00A0')}`;
        terminal.appendChild(terminalError);
    } else {
        const terminalError = document.querySelector('.terminal-error');
        if (terminalError) {
            terminalError.remove();
        }
        if (errorLineno > 0) {
            unhighlightLines('line-error');
            highlightLine(errorLineno, 'later-line-error'); // TODO: prevent highlighting if already highlighted?
        }
        highlightLine(lineno, 'line-highlight');
        if (step > 1) {
            highlightLine(steps[step - 1][0], 'prev-line-highlight');
        }
    }
    // unmirrorPreviousLine();
    mirrorLine(lineno);
    stepCounter.innerText = `${step}/${getStepSliderMax()}`;
    if (step == getStepSliderMax()) {
        pause();
    }
}

async function play() {
    stopPlaying = false;
    setPlayButtonState(playButtonState.Pause);
    if (getStepSliderValue() == getStepSliderMax()) {
        setStepSliderValue(getStepSliderMin());
    }
    while (getStepSliderValue() < getStepSliderMax()) {
        await new Promise(resolve => setTimeout(resolve, wait)); // TODO: sometimes it has irregular timeouts?
        if (stopPlaying) {
            break;
        }
        stepRight();
    }
}

function pause() {
    stopPlaying = true;
    setPlayButtonState(playButtonState.Play);
}

let highlightDecorationIds = new Map();

function highlightLine(lineno, className) {
    const currentDecorations = highlightDecorationIds.get(className) || [];
    const newDecorations = editor.deltaDecorations(currentDecorations, [{
        range: new monaco.Range(lineno, 1, lineno, 1),
        options: {
            isWholeLine: true,
            className: className,
            // lineNumberClassName: 'line-highlight',
        },
    }]);
    highlightDecorationIds.set(className, newDecorations);
}

function unhighlightLines(className) {
    if (className) {
        const decorationsToRemove = highlightDecorationIds.get(className);
        if (decorationsToRemove) {
            editor.deltaDecorations(decorationsToRemove, []);
            highlightDecorationIds.delete(className);
        }
    } else {
        highlightDecorationIds.forEach(decorations => {
            editor.deltaDecorations(decorations, []);
        });
        highlightDecorationIds.clear();
    }
}

let linenoToDecorationIds = new Map();

function highlightLineno(lineno, lineNumberClassName) {
    const currentDecorations = linenoToDecorationIds.get(lineNumberClassName) || new Map();
    const currentDecorationIds = currentDecorations.get(lineno) || [];
    const newDecorations = editor.deltaDecorations(currentDecorationIds, [{
        range: new monaco.Range(lineno, 1, lineno, 1),
        options: { lineNumberClassName: lineNumberClassName }
    }]);
    currentDecorations.set(lineno, newDecorations);
    linenoToDecorationIds.set(lineNumberClassName, currentDecorations);
}

function highlightAllLineno(lineNumberClassName) {
    const lineCount = editor.getModel().getLineCount();
    for (let lineno = 1; lineno <= lineCount; lineno++) {
        highlightLineno(lineno, lineNumberClassName);
    }
}

function unhighlightLineno(lineno, lineNumberClassName) {
    if (lineNumberClassName) {
        const decorationsToRemove = linenoToDecorationIds.get(lineNumberClassName)?.get(lineno);
        if (decorationsToRemove) {
            editor.deltaDecorations(decorationsToRemove, []);
            linenoToDecorationIds.get(lineNumberClassName)?.delete(lineno);
        }
    } else {
        linenoToDecorationIds.forEach((decorations, className) => {
            const decorationsToRemove = decorations.get(lineno);
            if (decorationsToRemove) {
                editor.deltaDecorations(decorationsToRemove, []);
                decorations.delete(lineno);
            }
        });
    }
}

function unhighlightAllLineno() {
    linenoToDecorationIds.forEach(decorations => {
        decorations.forEach(decorationIds => {
            editor.deltaDecorations(decorationIds, []);
        });
        decorations.clear();
    });
    linenoToDecorationIds.clear();
}

function linenoIsHighlighted(lineno, lineNumberClassName) {
    if (lineNumberClassName) {
        return linenoToDecorationIds.get(lineNumberClassName)?.has(lineno);
    } else {
        return linenoToDecorationIds.size > 0;
    }
}

// TODO: handle issues with it being async?
playButton.addEventListener('click', async () => {
    switch (getPlayButtonState()) {
        case playButtonState.Build:
            setPlayButtonState(playButtonState.Building);
            await editorLoaded;
            if (await build()) {
                setup();
            } else {
                setPlayButtonState(playButtonState.Build);
            }
            break;
        case playButtonState.Building: // TODO: look into making cancelable if needed
            break;
        case playButtonState.Play:
            play();
            break;
        case playButtonState.Pause:
            pause();
            break;
    }
});