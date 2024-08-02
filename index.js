





// import * as monaco from 'monaco-editor';
// import { loadPyodide } from 'pyodide';

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

    function resize(e) {
        const clientXPercentage = ((e.clientX - xOffset) / window.innerWidth) * 100;
        editor.style.width = `${clientXPercentage}vw`;
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
}

const stepSlider = document.getElementById('step-slider');
const stepLeft = document.getElementById('step-left');
const stepRight = document.getElementById('step-right');

function setStepSliderValue(value) {
    stepSlider.value = value.toString();
}

function setStepSliderMin(min) {
    stepSlider.min = min.toString();
}

function setStepSliderMax(max) {
    stepSlider.max = max.toString();
}

function getStepSliderValue() {
    return parseInt(stepSlider.value);
}

function getStepSliderMin() {
    return parseInt(stepSlider.min);
}

function getStepSliderMax() {
    return parseInt(stepSlider.max);
}

const stepHighlightContainer = document.querySelector('#step-highlight-container');

function highlightSteps(_steps) {
    _steps.forEach(step => {
        const stepHighlight = document.createElement('div');
        stepHighlight.classList.add('step-highlight');
        stepHighlight.setAttribute('step', step);
        const position = (step - getStepSliderMin()) / (getStepSliderMax() - getStepSliderMin()) * 100;
        stepHighlight.style.left = `${position}%`; // TODO: visible slider position doesn't go to the edges and therefore doesn't exactly match up with the highlight position
        stepHighlightContainer.appendChild(stepHighlight);
    });
}

function unhighlightSteps(_steps) {
    _steps.forEach(step => {
        const highlights = stepHighlightContainer.querySelectorAll(`.step-highlight[step="${step}"]`);
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
// TODO: distinguish between int and float?
// TODO: Infinity -> eg ∞ / \u221E
function formatCallStack(call_stack) {
    let formatted = [];
    for (let depth = 0; depth < call_stack.length; depth++) {
        const [_function, call_stack_layer] = call_stack[depth];
        for (let [name, [type, value]] of call_stack_layer) {
            switch (type) {
                case 'array':
                    value = `[${value.join(', ')}]`;
                    break;
                case 'map':
                    value = `{${[...value].map(([key, _value]) => `${key}: ${_value}`).join(', ')}}`;
                    break;
                case 'set':
                    value = `{${[...value].join(', ')}}`;
                    break;
            }
            // let formattedKey = name.replace(/-\d+$/, '');
            formatted.push(`${_function} ${depth} | ${name} : ${type} = ${value}`);
        }
    }
    return '<br><br><br>&nbsp;&nbsp;&nbsp;' + formatted.join('<br>&nbsp;&nbsp;&nbsp;'); // TODO: better padding formatting
}

let currentTimeout = null;
const speed = 300; // TODO: configurable speed
let initialPlayButtonState;

let stopPlaying;

stepSlider.addEventListener('mousedown', () => {
    // console.log('Step slider mousedown:', getStepSliderValue());
    initialPlayButtonState = getPlayButtonState();
    stopPlaying = true;
});

stepSlider.addEventListener('input', () => {
    // console.log('Step slider input:', getStepSliderValue());
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

stepLeft.addEventListener('click', () => {
    setStepSliderValue(Math.max(0, getStepSliderValue() - 1));
    processStep(getStepSliderValue());
});

stepRight.addEventListener('click', () => {
    setStepSliderValue(Math.min(getStepSliderMax(), getStepSliderValue() + 1));
    processStep(getStepSliderValue());
});

const dataStructures = document.getElementById('data-structures'); // TODO
// const primitives = document.getElementById('primitives');
// const stepThrough = document.getElementById('step-through');
const editorLine = document.getElementById('editor-line');
const editorLineLineno = document.getElementById('editor-line-lineno');
const editorLineLine = document.getElementById('editor-line-line');
const terminal = document.getElementById('terminal');

let mouseListener;
let editor;

function reset() {
    stopPlaying = true;
    // stepSlider.removeEventListener('input', stepSliderEventListenerFunction);
    setStepSliderMax(10);
    setStepSliderValue(5);
    stepSlider.setAttribute('disabled', '');
    stepLeft.setAttribute('disabled', '');
    stepRight.setAttribute('disabled', '');
    // if (mouseListener)
    mouseListener.dispose();
    // unhighlightLines(); // TODO: this instead of below
    if (window.currentHighlightDecoration) {
        editor.deltaDecorations(window.currentHighlightDecoration, []);
        window.currentHighlightDecoration = null;
    }
    dataStructures.innerHTML = '';
    terminal.innerText = '';
    stopPlaying = true;
    unhighlightAllSteps();
    unhighlightAllLineno();
    setPlayButtonState(playButtonState.Build);
}

// let linenos;
// let lines;

// TODO: make highlighting look more like VS Code's (or even LeetCode's) eg https://github.com/microsoft/monaco-editor/issues/1762
let editorLineEditor;
const sampleCode = await (await fetch('./samples/sample4.py')).text();
require.config({ paths: { vs: 'node_modules/monaco-editor/min/vs' } });
require(['vs/editor/editor.main'], () => {
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: sampleCode,
        language: 'python',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        lineNumbers: 'on',
        stickyScroll: { enabled: false},
        scrollbar: { vertical: 'hidden' },
        overviewRulerBorder: false,
        overviewRulerLanes: 0,
        folding: false,
        // glyphMargin: true,
        lineNumbersMinChars: 3,
        // lineDecorationsWidth: 5,
        // fontSize: '20px',
        // mouseWheelZoom: true,
        // renderLineHighlight: 'none',
        // automaticLayout: true,
    });
    editor.getModel().onDidChangeContent((e) => {
        // TODO: ask the user for confirmation to reset, "don't tell me again"
        // console.log('Editor code changed');
        if (getPlayButtonState() !== playButtonState.Build) {
            reset();
        }
    });

    // TODO: switch between .children array or nth-child selection if needed
    // TODO: does scrolling remove the earlier lines?
    // linenos = document.querySelector("#editor div.margin-view-overlays").children;
    // lineOverlays = document.querySelector("#editor div.view-overlays")
    // lines = document.querySelector("#editor div.view-lines.monaco-mouse-cursor-text").children; 
    // console.log('linenos:', linenos, 'lines:', lines); // DEBUG


    editorLineEditor = monaco.editor.create(document.getElementById('editor-line'), {
        value: '',
        lineNumbers: _ => 0,
        readOnly: true,
        renderLineHighlight: 'none',
        language: 'python',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        stickyScroll: { enabled: false},
        scrollbar: { horizontal: 'hidden', vertical: 'hidden' },
        overviewRulerBorder: false,
        overviewRulerLanes: 0,
        folding: false,
        lineNumbersMinChars: 3,

        // cursorStyle: 'line', // Set cursor style to 'line' (or 'block', 'underline', etc.)
        // cursorBlinking: 'hidden', // Hide the cursor
        // renderLineHighlightOnlyWhenFocus: false, // Ensure line highlight is always off
    });
});

const pyodide = await loadPyodide();
const buildCode = await (await fetch('./build.py')).text();

let steps, linenoToSteps;

function build() {
    // TODO: For now, we can ignore nontrivial formatting (e.g. triple quotation marks, semi-colons for multiple statements on one line, or backslash for line continuation. See 6/17 screenshot for more.)
    pyodide.globals.set('code', editor.getValue());
    pyodide.runPython(buildCode);
    steps = pyodide.globals.get('steps').toJs(), linenoToSteps = pyodide.globals.get('lineno_to_steps').toJs();
    // console.log('steps', steps); // DEBUG
    // print('linenoToSteps', linenoToSteps); // DEBUG
}

function setup() {
    // stepSlider.addEventListener('input', stepSliderEventListenerFunction);
    setStepSliderValue(getStepSliderMin());
    setStepSliderMax(steps.length - 1);
    stepSlider.removeAttribute('disabled');
    stepLeft.removeAttribute('disabled');
    stepRight.removeAttribute('disabled');
    processStep(getStepSliderValue());
    mouseListener = editor.onMouseDown((e) => { // alternatively, onMouseUp
        if (e.target.type === monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS) {
            // TODO: Disable the line from being selected
            const lineno = e.target.position.lineNumber;
            // console.log('typeof lineno:', typeof lineno, 'lineno:', lineno, 'e:', e);
            const _steps = linenoToSteps.get(lineno);
            // console.log('Line number clicked:', lineno);
            // console.log('linenoToSteps', linenoToSteps);
            // console.log('_steps:', _steps);
            if (!linenoIsHighlighted(lineno)) { // I'm assuming that lineno and steps are one-to-one, so we don't have to also have a lineno attribute for step-highlights
                highlightLineno(lineno);
                highlightSteps(_steps);
            } else {
                unhighlightLineno(lineno);
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
        lineNumbers: _ => lineno,
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






function processStep(step) {
    const [lineno, call_stack, node_types, stdout] = steps[step];
    // console.log(`Line ${lineno}:\n└─ Call Stack:`, call_stack, '\n└─ AST Node Types:', node_types, '\n└─ Stdout:', stdout);
    unhighlightLines();
    // prevent last step line highlight with `if (step < steps.length - 1)`? also prevent first step? (currently inconsistent, not highlighted after built but highlighted after going there. initialize steps with empty content for a step before all other steps?)
    highlightLine(lineno);
    dataStructures.innerHTML = /*`Variables:<br>${*/formatCallStack(call_stack)/*}`*/;
    terminal.innerHTML = '<br><br><br>&nbsp;&nbsp;&nbsp;' + stdout.split('\n').join('<br>&nbsp;&nbsp;&nbsp;'); // TODO: better padding formatting
    // unmirrorPreviousLine();
    mirrorLine(lineno);
}

async function play() {
    stopPlaying = false;
    setPlayButtonState(playButtonState.Pause);
    if (/*getStepSliderValue() < getStepSliderMin() || */getStepSliderValue() >= getStepSliderMax()) {
        setStepSliderValue(getStepSliderMin());
    }
    while (getStepSliderValue() <= getStepSliderMax()) { // TODO: simplify logic, account for edge cases e.g. stepping left or right preventing visual update of some step
        if (stopPlaying) {
            return; // break
        }
        processStep(getStepSliderValue());
        if (getStepSliderValue() >= getStepSliderMax()) {
            setPlayButtonState(playButtonState.Play);
            return; // break
        }
        currentTimeout = new Promise(resolve => setTimeout(resolve, speed));
        await currentTimeout;
        if (stopPlaying) {
            return; // break
        }
        setStepSliderValue(getStepSliderValue() + 1);
    }
}

function pause() {
    stopPlaying = true;
    setPlayButtonState(playButtonState.Play);
}

let highlightDecorationIds = [];

function highlightLine(lineno) {
    window.currentHighlightDecoration = editor.deltaDecorations(highlightDecorationIds, [{
        range: new monaco.Range(lineno, 1, lineno, 1),
        options: {
            isWholeLine: true,
            className: 'line-highlight',
            // lineNumberClassName: 'line-highlight',
        },
    }]);
}

function unhighlightLines() {
    if (window.currentHighlightDecoration) {
        editor.deltaDecorations(window.currentHighlightDecoration, []);
        window.currentHighlightDecoration = null;
    }
}

// let highlightCollection;

// function highlightLine(lineno) {
//     highlightCollection = editor.createDecorationsCollection({
//         options: {
//             isWholeLine: true,
//             className: 'line-highlight',
//             // lineNumberClassName: 'line-highlight',
//         },
//         range: {
//             endColumn: 1,
//             endLineNumber: lineno,
//             startColumn: 1,
//             startLineNumber: lineno,
//         }
//     });
// }

// function unhighlightLines() {
//     if (highlightCollection) {
//         highlightCollection.clear();
//     }
// }

let linenoToDecorationIds = new Map();

function highlightLineno(lineno) {
    const currentDecorations = linenoToDecorationIds.get(lineno) || [];
    const newDecorations = editor.deltaDecorations(currentDecorations, [{
        range: new monaco.Range(lineno, 1, lineno, 1),
        options: { lineNumberClassName: 'lineno-highlight' }
    }]);
    linenoToDecorationIds.set(lineno, newDecorations);
}

function unhighlightLineno(lineno) {
    const decorationsToRemove = linenoToDecorationIds.get(lineno);
    if (decorationsToRemove) {
        editor.deltaDecorations(decorationsToRemove, []);
        linenoToDecorationIds.delete(lineno);
    }
}

function unhighlightAllLineno() {
    linenoToDecorationIds.forEach(decorations => {
        editor.deltaDecorations(decorations, []);
    });
    linenoToDecorationIds.clear();
}

function linenoIsHighlighted(lineno) {
    return linenoToDecorationIds.has(lineno);
}

playButton.addEventListener('click', () => {
    switch (getPlayButtonState()) {
        case playButtonState.Build:
            build();
            setup();
            break;
        case playButtonState.Play:
            play();
            break;
        case playButtonState.Pause:
            pause();
            break;
    }
});