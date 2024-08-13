// optimize by downloading local rather than using a cdn, if needed. see https://d3js.org/getting-started#d3-in-vanilla-html "you can load D3 from a CDN such as jsDelivr or you can download it locally" or https://stackoverflow.com/questions/48471651/es6-module-import-of-d3-4-x-fails "make all the text substitutions yourself using a script or manually"
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"; // (https://d3js.org/getting-started#d3-in-vanilla-html) or https://unpkg.com/d3?module (https://stackoverflow.com/questions/48471651/es6-module-import-of-d3-4-x-fails) or https://d3js.org/d3.v4.min.js (Daryl testing)

const svg = d3.select("svg");
svg.append("text")
   .attr("x", 50)
   .attr("y", 50)
   .text("HELLO WORLD");







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
                case 'float': // TODO: account for edge cases e.g. Infinity, scientific notation?
                    // value = value.toString();
                    // if (!value.includes('.')) {
                    //     value += '.0';
                    // }
                    break;
                case 'string':
                    value = value.replace(/ /g, '\u00A0');
                    break;
            }
            formatted.push(`${_function} ${depth} | ${name} : ${type} = ${value}`);
        }
    }
    return '\n\n\n\u00A0\u00A0\u00A0' + formatted.join('\n\u00A0\u00A0\u00A0');
}

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

stepSliderRight.addEventListener('click', () => stepRight());

const dataStructures = document.getElementById('data-structures'); // TODO
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
    stepCounter.innerText = `?/?`;
    stepSlider.setAttribute('disabled', '');
    stepSliderLeft.setAttribute('disabled', '');
    stepSliderRight.setAttribute('disabled', '');
    mouseListener.dispose();
    unhighlightLines();
    dataStructures.innerHTML = '';
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

fetch('./samples/sample10.py').then(response => response.text()).then((text) => {
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

// https://cdn.jsdelivr.net/npm/d3@7/+esm

// import { createHighlighter } from 'shiki'
// import { createHighlighter } from './node_modules/@shikijs/core/dist/index.mjs'
// import { createHighlighter } from 'https://cdn.jsdelivr.net/npm/shiki'
import { createHighlighter } from 'https://esm.sh/shiki'
// import { shikiToMonaco } from '@shikijs/monaco'
// import { shikiToMonaco } from './node_modules/@shikijs/monaco/dist/index.mjs'
// import { shikiToMonaco } from 'https://cdn.jsdelivr.net/npm/@shikijs/monaco'
import { shikiToMonaco } from 'https://esm.sh/@shikijs/monaco'

// TODO: make highlighting look more like VS Code's (or even LeetCode's) eg https://github.com/microsoft/monaco-editor/issues/1762
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


    // monaco.editor.defineTheme('vs-dark-modern', {
    //     base: 'vs-dark',
    //     inherit: false,
    //     rules: [
    //         { token: '', foreground: 'D4D4D4', background: '1E1E1E' },
    //         { token: 'invalid', foreground: 'f44747' },
    //         { token: 'emphasis', fontStyle: 'italic' },
    //         { token: 'strong', fontStyle: 'bold' },
    
    //         { token: 'identifier', foreground: '74B0DF' },
    //         { token: 'entity', foreground: '4864AA' },
    //         { token: 'constructor', foreground: '9CDCFE' },
    //         { token: 'operators', foreground: '569CD6' },
    //         { token: 'tag', foreground: '608B4E' },
    //         { token: 'namespace', foreground: 'B5CEA8' },
    //         { token: 'keyword', foreground: '5BB498' },
    //         { token: 'info-token', foreground: 'B46695' },
    //         { token: 'type', foreground: '3DC9B0' },
    //         { token: 'string', foreground: 'DCDCDC' },
    //         { token: 'warn-token', foreground: '808080' },
    //         { token: 'predefined', foreground: '4F76AC' },
    //         { token: 'string.escape', foreground: 'A79873' },
    //         { token: 'error-token', foreground: 'DD6A6F' },
    //         { token: 'invalid', foreground: 'f44747' },
    //         { token: 'comment', foreground: '608B4E' },
    //         { token: 'comment.doc', foreground: 'CE9178' },
    //         { token: 'regexp', foreground: '9CDCFE' },
    //         { token: 'constant', foreground: 'CE9178' },
    //         { token: 'attribute', foreground: 'B5CEA8' },
    
    //         { token: 'delimiter', foreground: 'DCDCDC' },
    //         { token: 'delimiter.curly', foreground: '808080' },
    //         { token: 'delimiter.square', foreground: '808080' },
    //         { token: 'delimiter.parenthesis', foreground: '808080' },
    //         { token: 'delimiter.angle', foreground: '808080' },
    //         { token: 'delimiter.array', foreground: '808080' },
    //         { token: 'delimiter.bracket', foreground: '808080' },
    
    //         { token: 'number', foreground: 'B5CEA8' },
    //         { token: 'number.hex', foreground: '5BB498' },
    //         { token: 'number.octal', foreground: '5BB498' },
    //         { token: 'number.binary', foreground: '5BB498' },
    //         { token: 'number.float', foreground: '5BB498' },
    
    //         { token: 'variable.name', foreground: '9CDCFE' },
    //         { token: 'variable.value', foreground: 'CE9178' },
    
    //         { token: 'meta.content', foreground: 'CE9178' },
    //     ],
    //     colors: {
    //         'editor.background': '#1E1E1E',
    //         'editor.foreground': '#D4D4D4',
    //         'editor.inactiveSelection': '#3A3D41',
    //         'editorIndentGuides': '#404040',
    //         'editor.selectionHighlight': '#ADD6FF26'
    //     }
    // });

    
    // monaco.editor.defineTheme('vs-dark-modern', {
    //     base: 'vs-dark',
    //     // inherit: true,
    //     rules: [
    //         // { token: 'keyword', foreground: '569CD6' },
    //         // { token: 'identifier', foreground: '9CDCFE' },
    //         // { token: 'type.identifier', foreground: '4EC9B0' },
    //         // { token: 'string', foreground: 'CE9178' },
    //         // { token: 'number', foreground: 'B5CEA8' },
    //         // { token: 'comment', foreground: '6A9955' },
    //         // { token: 'class', foreground: '4EC9B0' },
    //         // { token: 'function', foreground: 'DCDCAA' },
    //         // // Add more token customizations as needed


    //         // { token: 'keyword', foreground: '569CD6' },
    //         // { token: 'identifier', foreground: '9CDCFE' },
    //         // { token: 'type', foreground: '4EC9B0' }, // Token type for classes
    //         // { token: 'constructor', foreground: '4EC9B0' }, // Another possible token type for classes
    //         // { token: 'string', foreground: 'CE9178' },
    //         // { token: 'number', foreground: 'B5CEA8' },
    //         // { token: 'comment', foreground: '6A9955' },
    //         // { token: 'function', foreground: 'DCDCAA' },


    //         { token: 'comment', foreground: '4EC9B0' },
    //     ],
    //     colors: {
    //         // 'activityBar.activeBorder': '#0078D4',
    //         // 'activityBar.background': '#181818',
    //         // 'activityBar.border': '#2B2B2B',
    //         // 'activityBar.foreground': '#D7D7D7',
    //         // 'activityBar.inactiveForeground': '#868686',
    //         // 'activityBarBadge.background': '#0078D4',
    //         // 'activityBarBadge.foreground': '#FFFFFF',
    //         // 'badge.background': '#616161',
    //         // 'badge.foreground': '#F8F8F8',
    //         // 'button.background': '#0078D4',
    //         // 'button.border': '#FFFFFF12',
    //         // 'button.foreground': '#FFFFFF',
    //         // 'button.hoverBackground': '#026EC1',
    //         // 'button.secondaryBackground': '#313131',
    //         // 'button.secondaryForeground': '#CCCCCC',
    //         // 'button.secondaryHoverBackground': '#3C3C3C',
    //         // 'chat.slashCommandBackground': '#34414B',
    //         // 'chat.slashCommandForeground': '#40A6FF',
    //         // 'checkbox.background': '#313131',
    //         // 'checkbox.border': '#3C3C3C',
    //         // 'debugToolBar.background': '#181818',
    //         // 'descriptionForeground': '#9D9D9D',
    //         // 'dropdown.background': '#313131',
    //         // 'dropdown.border': '#3C3C3C',
    //         // 'dropdown.foreground': '#CCCCCC',
    //         // 'dropdown.listBackground': '#1F1F1F',
    //         // 'editor.background': '#1F1F1F',
    //         // 'editor.findMatchBackground': '#9E6A03',
    //         // 'editor.foreground': '#CCCCCC',
    //         // 'editorGroup.border': '#FFFFFF17',
    //         // 'editorGroupHeader.tabsBackground': '#181818',
    //         // 'editorGroupHeader.tabsBorder': '#2B2B2B',
    //         // 'editorGutter.addedBackground': '#2EA043',
    //         // 'editorGutter.deletedBackground': '#F85149',
    //         // 'editorGutter.modifiedBackground': '#0078D4',
    //         // 'editorLineNumber.activeForeground': '#CCCCCC',
    //         // 'editorLineNumber.foreground': '#6E7681',
    //         // 'editorOverviewRuler.border': '#010409',
    //         // 'editorWidget.background': '#202020',
    //         // 'errorForeground': '#F85149',
    //         // 'focusBorder': '#0078D4',
    //         // 'foreground': '#CCCCCC',
    //         // 'icon.foreground': '#CCCCCC',
    //         // 'input.background': '#313131',
    //         // 'input.border': '#3C3C3C',
    //         // 'input.foreground': '#CCCCCC',
    //         // 'input.placeholderForeground': '#989898',
    //         // 'inputOption.activeBackground': '#2489DB82',
    //         // 'inputOption.activeBorder': '#2488DB',
    //         // 'keybindingLabel.foreground': '#CCCCCC',
    //         // 'menu.background': '#1F1F1F',
    //         // 'menu.selectionBackground': '#0078d4',
    //         // 'notificationCenterHeader.background': '#1F1F1F',
    //         // 'notificationCenterHeader.foreground': '#CCCCCC',
    //         // 'notifications.background': '#1F1F1F',
    //         // 'notifications.border': '#2B2B2B',
    //         // 'notifications.foreground': '#CCCCCC',
    //         // 'panel.background': '#181818',
    //         // 'panel.border': '#2B2B2B',
    //         // 'panelInput.border': '#2B2B2B',
    //         // 'panelTitle.activeBorder': '#0078D4',
    //         // 'panelTitle.activeForeground': '#CCCCCC',
    //         // 'panelTitle.inactiveForeground': '#9D9D9D',
    //         // 'peekViewEditor.background': '#1F1F1F',
    //         // 'peekViewEditor.matchHighlightBackground': '#BB800966',
    //         // 'peekViewResult.background': '#1F1F1F',
    //         // 'peekViewResult.matchHighlightBackground': '#BB800966',
    //         // 'pickerGroup.border': '#3C3C3C',
    //         // 'progressBar.background': '#0078D4',
    //         // 'quickInput.background': '#222222',
    //         // 'quickInput.foreground': '#CCCCCC',
    //         // 'settings.dropdownBackground': '#313131',
    //         // 'settings.dropdownBorder': '#3C3C3C',
    //         // 'settings.headerForeground': '#FFFFFF',
    //         // 'settings.modifiedItemIndicator': '#BB800966',
    //         // 'sideBar.background': '#181818',
    //         // 'sideBar.border': '#2B2B2B',
    //         // 'sideBar.foreground': '#CCCCCC',
    //         // 'sideBarSectionHeader.background': '#181818',
    //         // 'sideBarSectionHeader.border': '#2B2B2B',
    //         // 'sideBarSectionHeader.foreground': '#CCCCCC',
    //         // 'sideBarTitle.foreground': '#CCCCCC',
    //         // 'statusBar.background': '#181818',
    //         // 'statusBar.border': '#2B2B2B',
    //         // 'statusBar.debuggingBackground': '#0078D4',
    //         // 'statusBar.debuggingForeground': '#FFFFFF',
    //         // 'statusBar.focusBorder': '#0078D4',
    //         // 'statusBar.foreground': '#CCCCCC',
    //         // 'statusBar.noFolderBackground': '#1F1F1F',
    //         // 'statusBarItem.focusBorder': '#0078D4',
    //         // 'statusBarItem.prominentBackground': '#6E768166',
    //         // 'statusBarItem.remoteBackground': '#0078D4',
    //         // 'statusBarItem.remoteForeground': '#FFFFFF',
    //         // 'tab.activeBackground': '#1F1F1F',
    //         // 'tab.activeBorder': '#1F1F1F',
    //         // 'tab.activeBorderTop': '#0078D4',
    //         // 'tab.activeForeground': '#FFFFFF',
    //         // 'tab.selectedBorderTop': '#6caddf',
    //         // 'tab.border': '#2B2B2B',
    //         // 'tab.hoverBackground': '#1F1F1F',
    //         // 'tab.inactiveBackground': '#181818',
    //         // 'tab.inactiveForeground': '#9D9D9D',
    //         // 'tab.unfocusedActiveBorder': '#1F1F1F',
    //         // 'tab.unfocusedActiveBorderTop': '#2B2B2B',
    //         // 'tab.unfocusedHoverBackground': '#1F1F1F',
    //         // 'terminal.foreground': '#CCCCCC',
    //         // 'terminal.tab.activeBorder': '#0078D4',
    //         // 'textBlockQuote.background': '#2B2B2B',
    //         // 'textBlockQuote.border': '#616161',
    //         // 'textCodeBlock.background': '#2B2B2B',
    //         // 'textLink.activeForeground': '#4daafc',
    //         // 'textLink.foreground': '#4daafc',
    //         // 'textPreformat.foreground': '#D0D0D0',
    //         // 'textPreformat.background': '#3C3C3C',
    //         // 'textSeparator.foreground': '#21262D',
    //         // 'titleBar.activeBackground': '#181818',
    //         // 'titleBar.activeForeground': '#CCCCCC',
    //         // 'titleBar.border': '#2B2B2B',
    //         // 'titleBar.inactiveBackground': '#1F1F1F',
    //         // 'titleBar.inactiveForeground': '#9D9D9D',
    //         // 'welcomePage.tileBackground': '#2B2B2B',
    //         // 'welcomePage.progress.foreground': '#0078D4',
    //         // 'widget.border': '#313131'
    //     }
    // });

    // monaco.editor.defineTheme('vs-dark-modern', {
    //     base: 'vs-dark',
    //     inherit: false,
    //     rules: [
            
    //         { token: 'support.class', foreground: 'D4D4D4', background: '1E1E1E' },
    //         // { token: '', foreground: 'D4D4D4', background: '1E1E1E' },
    //         // { token: 'invalid', foreground: 'f44747' },
    //         // { token: 'emphasis', fontStyle: 'italic' },
    //         // { token: 'strong', fontStyle: 'bold' },
    
    //         // { token: 'variable', foreground: '74B0DF' }, // identifier?
    //         // { token: 'variable.predefined', foreground: '4864AA' },
    //         // { token: 'variable.parameter', foreground: '9CDCFE' },
    //         // { token: 'constant', foreground: '569CD6' },
    //         // { token: 'comment', foreground: '608B4E' },
    //         // { token: 'number', foreground: 'B5CEA8' },
    //         // { token: 'number.hex', foreground: '5BB498' },
    //         // { token: 'regexp', foreground: 'B46695' },
    //         // { token: 'annotation', foreground: 'cc6666' },
    //         // { token: 'type', foreground: '3DC9B0' },
    
    //         // { token: 'delimiter', foreground: 'DCDCDC' },
    //         // { token: 'delimiter.html', foreground: '808080' },
    //         // { token: 'delimiter.xml', foreground: '808080' },
    
    //         // { token: 'tag', foreground: '569CD6' },
    //         // { token: 'tag.id.jade', foreground: '4F76AC' },
    //         // { token: 'tag.class.jade', foreground: '4F76AC' },
    //         // { token: 'meta.scss', foreground: 'A79873' },
    //         // { token: 'meta.tag', foreground: 'CE9178' },
    //         // { token: 'metatag', foreground: 'DD6A6F' },
    //         // { token: 'metatag.content.html', foreground: '9CDCFE' },
    //         // { token: 'metatag.html', foreground: '569CD6' },
    //         // { token: 'metatag.xml', foreground: '569CD6' },
    //         // { token: 'metatag.php', fontStyle: 'bold' },
    
    //         // { token: 'key', foreground: '9CDCFE' },
    //         // { token: 'string.key.json', foreground: '9CDCFE' },
    //         // { token: 'string.value.json', foreground: 'CE9178' },
    
    //         // { token: 'attribute.name', foreground: '9CDCFE' },
    //         // { token: 'attribute.value', foreground: 'CE9178' },
    //         // { token: 'attribute.value.number.css', foreground: 'B5CEA8' },
    //         // { token: 'attribute.value.unit.css', foreground: 'B5CEA8' },
    //         // { token: 'attribute.value.hex.css', foreground: 'D4D4D4' },
    
    //         // { token: 'string', foreground: 'CE9178' },
    //         // { token: 'string.sql', foreground: 'FF0000' },
    
    //         // { token: 'keyword', foreground: '569CD6' },
    //         // { token: 'keyword.flow', foreground: 'C586C0' },
    //         // { token: 'keyword.json', foreground: 'CE9178' },
    //         // { token: 'keyword.flow.scss', foreground: '569CD6' },
    
    //         // { token: 'operator.scss', foreground: '909090' },
    //         // { token: 'operator.sql', foreground: '778899' },
    //         // { token: 'operator.swift', foreground: '909090' },
    //         // { token: 'predefined.sql', foreground: 'FF00FF' },
    //     ],
    //     colors: {}
    // });
    

    // monaco.editor.setTheme('vs-dark-modern')

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
        // "semanticHighlighting.enabled": true,
        // glyphMargin: true,
        // lineDecorationsWidth: 5,
        // fontSize: '20px',
        // mouseWheelZoom: true,
        // renderLineHighlight: 'none',
        // automaticLayout: true,
    });
    editorLoading.remove();
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

    // editorLineEditor = monaco.editor.create(document.getElementById('editor-line'), {
    //     value: '',
    //     lineNumbers: () => 0,
    //     readOnly: true,
    //     renderLineHighlight: 'none',
    //     language: 'python',
    //     theme: 'vs-dark-modern',
    //     automaticLayout: true,
    //     minimap: { enabled: false },
    //     stickyScroll: { enabled: false},
    //     scrollbar: { horizontal: 'hidden', vertical: 'hidden' },
    //     overviewRulerBorder: false,
    //     overviewRulerLanes: 0,
    //     folding: false,
    //     lineNumbersMinChars: 3,

    //     // cursorStyle: 'line', // Set cursor style to 'line' (or 'block', 'underline', etc.)
    //     // cursorBlinking: 'hidden', // Hide the cursor
    //     // renderLineHighlightOnlyWhenFocus: false, // Ensure line highlight is always off
    // });
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
    setPlayButtonState(playButtonState.Building);
    unhighlightLines();
    terminal.innerText = '';
    await pyodidePromise;
    // TODO: For now, can ignore nontrivial formatting (e.g. triple quotation marks, semi-colons for multiple statements on one line, or backslash for line continuation. See 6/17 screenshot for more.)
    pyodide.globals.set('code', editor.getValue());
    try { // can't catch for some errors, e.g. SyntaxError, IndentationError, in build.py, since Pyodide elevates it to JavaScript without being able to catch in build.py's try-catch? Catch here, keep in terminal-error until next build attempt
        // async processes e.g. play button state change, unlike pyodide.runPython(buildCode);. If better (e.g. even less latency), can go back to using a web worker
        await pyodide.runPythonAsync(buildCode);    
    } catch(e) {
        // console.log(e); // DEBUG
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
        setPlayButtonState(playButtonState.Build);
        return false;
    } finally {
        // await pyodide.runPythonAsync('clear_collections()'); // alternatively, can look into restarting pyodide completely e.g. https://github.com/pyodide/pyodide/issues/703
    }
    steps = pyodide.globals.get('steps').toJs();
    linenoToSteps = pyodide.globals.get('lineno_to_steps').toJs();
    error = pyodide.globals.get('error');
    errorLineno = pyodide.globals.get('error_lineno');
    return true;
    // console.log('steps:', steps); // DEBUG
    // console.log('linenoToSteps:', linenoToSteps); // DEBUG
    // console.log('error:', error); // DEBUG
}

function setup() {
    setStepSliderValue(getStepSliderMin());
    setStepSliderMax(steps.length - 1);
    stepSlider.removeAttribute('disabled');
    stepSliderLeft.removeAttribute('disabled');
    stepSliderRight.removeAttribute('disabled');
    document.documentElement.style.setProperty('--step-highlight-width', `max(1px, 100% / ${getStepSliderMax() - getStepSliderMin() + 1})`); // TODO: am i tripping, or are these different widths
    processStep(getStepSliderValue());
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
    terminal.innerText = '';
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
    const [lineno, call_stack, node_types, stdout] = steps[step];
    // console.log(`Line ${lineno}:\n└─ Call Stack:`, call_stack, '\n└─ AST Node Types:', node_types, '\n└─ Stdout:', stdout);
    dataStructures.innerText = formatCallStack(call_stack);
    if (stdout.length > 0) { // for consistency with compile-time errors
    terminal.innerText = `\n\u00A0\u00A0\u00A0${stdout.replace(/ /g, '\u00A0').split('\n').join('\n\u00A0\u00A0\u00A0')}`; // TODO: better padding formatting
    }
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
            if (await build()) {
                setup();
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