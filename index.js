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
function highlightSteps(steps) {
    steps.forEach(step => {
        const stepHighlight = document.createElement('div');
        stepHighlight.classList.add('step-highlight');
        stepHighlight.setAttribute('step', step);
        const position = (step - stepSlider.min) / (stepSlider.max - stepSlider.min) * 100;
        stepHighlight.style.left = `${position}%`;
        stepHighlightContainer.appendChild(stepHighlight);
    });
}

function unhighlightSteps(steps) {
    steps.forEach(step => {
        const highlights = document.querySelectorAll(`.highlight[step="${step}"]`);
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

stepSlider.addEventListener('mousedown', () => {
    console.log('Step slider mousedown:', getStepSliderValue());
    initialPlayButtonState = getPlayButtonState();
});

stepSlider.addEventListener('input', () => {
    console.log('Step slider changed:', getStepSliderValue());
    processStep(getStepSliderValue()); // parseInt(this.value)
    clearTimeout(currentTimeout); // TODO: make later `await` account for currentTimeout being updated
    // currentTimeout = new Promise(resolve => setTimeout(resolve, Infinity));
});

stepSlider.addEventListener('mouseup', () => {
    // if (currentTimeout !== null) {
    //     clearTimeout(currentTimeout);
    // }
    // currentTimeout = new Promise(resolve => {
    //     setTimeout(() => {
    //         resolve();
    //         console.log('Timeout after mouseup completed');
    //         // Place any code here that should execute after the timeout
    //     }, speed);
    // });
    console.log('Step slider mouseup', getStepSliderValue());
    currentTimeout = new Promise(resolve => setTimeout(resolve, speed));
});

const visualContent = document.getElementById('visual-content');

// const playButtonState = Object.freeze({
//     BUILD: "Build",
//     PLAY: "Play",
//     PAUSE: "Pause",
// });

// state is "Build", "Play", or "Pause"
const playButton = document.getElementById('play-button');

function getPlayButtonState() {
    return playButton.innerText.trim();
}

function setPlayButtonState(newPlayButtonState) {
    playButton.innerHTML = `<img src="./assets/${newPlayButtonState.toLowerCase()}.svg" alt="${newPlayButtonState}" class="icon"> ${newPlayButtonState}`;
}

let mouseListener;
let editor;

let isPaused; // TODO: refactor to isPlaying if clearer considering e.g. reset()

function reset() {
    setPlayButtonState('Build');
    isPaused = true;
    // stepSlider.removeEventListener('input', stepSliderEventListenerFunction);
    stepSlider.style.visibility = 'hidden';
    mouseListener.dispose();
    // unhightlightLines(); // TODO: this instead of below
    if (window.currentHighlightDecoration) {
        editor.deltaDecorations(window.currentHighlightDecoration, []);
        window.currentHighlightDecoration = null;
    }
    visualContent.innerHTML = '';
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
    // TODO: For now, we can ignore edge cases (e.g. triple quotation marks, semi-colons for multiple statements on one line, or backslash for line continuation. See 6/17 screenshot for more.)
    pyodide.globals.set('code', editor.getValue());
    pyodide.runPython(buildCode);
    steps = pyodide.globals.get('steps').toJs(), linenoToSteps = pyodide.globals.get('lineno_to_steps').toJs();
}

function setup() {
    setPlayButtonState('Play')
    setStepSliderValue(getStepSliderMin());
    setStepSliderMax(steps.length - 1);
    // stepSlider.addEventListener('input', stepSliderEventListenerFunction);
    stepSlider.style.visibility = 'visible';
    mouseListener = editor.onMouseDown((e) => {
        if (e.target.type === monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS) {
            // TODO: Disable the line from being selected
            const lineno = e.target.position.lineNumber;
            console.log('Line number clicked:', lineno);
            // editor.deltaDecorations([], [{
            //     range: new monaco.Range(lineNumber, 1, lineNumber, 1),
            //     options: {
            //         isWholeLine: true,
            //         className: 'line-highlight'
            //     }
            // }]);
        }
    });
}

function processStep(step) {
    const [lineno, call_stack, nodes] = steps[step];
    console.log(`Line ${lineno}:\n└─ Call Stack:`, call_stack, '\n└─ AST Node Types:', nodes);
    highlightLine(lineno);
    visualContent.innerHTML = /*`Variables:<br>${*/formatCallStack(call_stack)/*}`*/;
}

async function play() {
    isPaused = false;
    setPlayButtonState('Pause');
    if (/*getStepSliderValue() < getStepSliderMin() || */getStepSliderValue() >= getStepSliderMax()) {
        setStepSliderValue(getStepSliderMin());
    }
    while (getStepSliderValue() <= getStepSliderMax()) {
        if (isPaused) {
            break;
        }
        processStep(getStepSliderValue());
        currentTimeout = new Promise(resolve => setTimeout(resolve, 300));
        await currentTimeout;
        if (isPaused) {
            break;
        }
        if (getStepSliderValue() < getStepSliderMax()) {
            setStepSliderValue(getStepSliderValue() + 1);
        } else {
            break;
        }
    }
    if (getPlayButtonState() === 'Pause') {
        setPlayButtonState('Play');
    }
}

function pause() {
    isPaused = true;
}

function highlightLine(lineno) {
    unhightlightLines();
    // if (window.currentHighlightDecoration) {
    //     editor.deltaDecorations(window.currentHighlightDecoration, []);
    // }
    window.currentHighlightDecoration = editor.deltaDecorations([], [{
        range: {
            startLineNumber: lineno,
            startColumn: 1,
            endLineNumber: lineno,
            endColumn: 1,
        },
        options: {
            isWholeLine: true,
            className: 'line-highlight'
        }
    }]);
}

function unhightlightLines() {
    if (window.currentHighlightDecoration) {
        editor.deltaDecorations(window.currentHighlightDecoration, []);
        window.currentHighlightDecoration = null;
    }
}

playButton.addEventListener('click', () => { // TODO: async?
    switch (getPlayButtonState()) {
        case 'Build':
            build();
            setup();
            break;
        case 'Play':
            play();
            break;
        case 'Pause':
            pause();
            break;
    }
});