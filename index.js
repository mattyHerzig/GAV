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

const stepHighlightContainer = document.querySelector('.step-highlight-container');

// TODO
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

// TODO: would be more robust and elegant to use a recursive function to format each variable e.g. consider nested arrays, maps, and sets
// TODO: handles e.g. hash map with tuples as keys, which is allowed in Python but not in JavaScript?
function formatCallStack(call_stack) {
    let formatted = [];
    for (let depth = 0; depth < call_stack.length; depth++) {
        const call_stack_layer = call_stack[depth];
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
            formatted.push(`depth ${depth} | ${name} : ${type} = ${value}`);
        }
    }
    return formatted.join('<br>');
}

let currentTimeout = null;
const speed = 300; // TODO: configurable speed
let initialPlayButtonState;

let stopPlaying;

stepSlider.addEventListener('mousedown', () => {
    console.log('Step slider mousedown:', getStepSliderValue());
    initialPlayButtonState = getPlayButtonState();
    stopPlaying = true;
});

stepSlider.addEventListener('input', () => {
    console.log('Step slider input:', getStepSliderValue());
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
    console.log('Step slider mouseup', getStepSliderValue());
    if (getStepSliderValue() < getStepSliderMax() && initialPlayButtonState === playButtonState.Pause) {
        play();
    }
});

const visualContent = document.getElementById('visual-content');
const terminal = document.getElementById('terminal');

let mouseListener;
let editor;

function reset() {
    stopPlaying = true;
    // stepSlider.removeEventListener('input', stepSliderEventListenerFunction);
    stepSlider.style.visibility = 'hidden';
    mouseListener.dispose();
    // unhighlightLines(); // TODO: this instead of below
    if (window.currentHighlightDecoration) {
        editor.deltaDecorations(window.currentHighlightDecoration, []);
        window.currentHighlightDecoration = null;
    }
    visualContent.innerHTML = '';
    terminal.innerText = '';
    stopPlaying = true;
    setPlayButtonState(playButtonState.Build);
}

const sampleCode = await (await fetch('./samples/sample2.py')).text();
require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor/min/vs' } });
require(['vs/editor/editor.main'], () => {
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: sampleCode,
        language: 'python',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        lineNumbers: 'on',
        stickyScroll: { enabled: false},
        folding: false,
        // glyphMargin: true,
        lineNumbersMinChars: 3,
        // lineDecorationsWidth: 5,
        // fontSize: '20px',
        // mouseWheelZoom: true,
        // renderLineHighlight: 'none',
    });
    editor.getModel().onDidChangeContent((e) => {
        // TODO: ask the user for confirmation to reset, "don't tell me again"
        console.log('Editor code changed');
        reset();
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
    // console.log('steps', steps, 'linenoToSteps', linenoToSteps); // DEBUG
}

function setup() {
    setStepSliderValue(getStepSliderMin());
    setStepSliderMax(steps.length - 1);
    // stepSlider.addEventListener('input', stepSliderEventListenerFunction);
    stepSlider.style.visibility = 'visible';
    mouseListener = editor.onMouseDown((e) => { // alternatively, onMouseUp
        if (e.target.type === monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS) {
            // TODO: Disable the line from being selected
            const lineno = e.target.position.lineNumber;
            // console.log('typeof lineno:', typeof lineno, 'lineno:', lineno, 'e:', e);
            const _steps = linenoToSteps.get(lineno);
            console.log('Line number clicked:', lineno);
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

function processStep(step) {
    const [lineno, call_stack, node_types, stdout] = steps[step];
    console.log(`Line ${lineno}:\n└─ Call Stack:`, call_stack, '\n└─ AST Node Types:', node_types, '\n└─ Stdout:', stdout);
    unhighlightLines();
    highlightLine(lineno);
    visualContent.innerHTML = /*`Variables:<br>${*/formatCallStack(call_stack)/*}`*/;
    terminal.innerText = stdout;
}

async function play() {
    stopPlaying = false;
    setPlayButtonState(playButtonState.Pause);
    if (/*getStepSliderValue() < getStepSliderMin() || */getStepSliderValue() >= getStepSliderMax()) {
        setStepSliderValue(getStepSliderMin());
    }
    while (getStepSliderValue() <= getStepSliderMax()) { // TODO: simplify logic
        if (stopPlaying) {
            break;
        }
        processStep(getStepSliderValue());
        if (getStepSliderValue() >= getStepSliderMax()) {
            setPlayButtonState(playButtonState.Play);
            break;
        }
        currentTimeout = new Promise(resolve => setTimeout(resolve, 300));
        await currentTimeout;
        if (stopPlaying) {
            break;
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