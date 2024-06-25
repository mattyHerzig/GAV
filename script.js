console.log('script.js');

const initMonaco = () => {
    return new Promise((resolve, reject) => {
        const scriptUrl = 'https://unpkg.com/monaco-editor/min/vs/loader.js'
        if (!document.querySelector(`script[src="${scriptUrl}"]`)) {
            // const saveDefine = window.define?.amd
            // if (saveDefine) {
            //     window.define.amd = null
            // }
            const script = document.createElement('script')
            script.src = scriptUrl
            document.head.appendChild(script)
            script.onerror = (e) => {
                reject(e)
            }
            script.onload = () => {
                // if (saveDefine) {
                //     window.define.amd = saveDefine
                // }
                resolve(null)
            }
        } else {
            // if (saveDefine) {
            //     window.define.amd = saveDefine
            // }
            resolve(null)
        }
    })
}

const initPyodide = () => {
    return new Promise(async (resolve, reject) => {
        const saveDefine = window.define?.amd
        if (saveDefine) {
            window.define.amd = null
        }
        const scriptUrl = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js'
        if (!document.querySelector(`script[src="${scriptUrl}"]`)) {
            const script = document.createElement('script')
            script.src = scriptUrl
            document.head.appendChild(script)
            script.onerror = (e) => {
                reject(e)
            }
            script.onload = () => {
                if (saveDefine) {
                    window.define.amd = saveDefine
                }
                resolve(null)
            }
        } else {
            if (saveDefine) {
                window.define.amd = saveDefine
            }
            resolve(null)
        }
    })
}

const samplePath = './sample.py';
const sample = await (await fetch(samplePath)).text();
await initMonaco();
let editor;
require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor/min/vs' } });
require(['vs/editor/editor.main'], function () {
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: sample,
        language: 'python',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        lineNumbers: 'on',
    });
});
await initPyodide();
const pyodide = await loadPyodide();

const traceCodePath = './tracing.py';

function highlightLine(editor, lineno) {
    const range = {
        startLineNumber: lineno,
        startColumn: 1,
        endLineNumber: lineno,
        endColumn: 1,
    };

    const decoration = {
        range: range,
        options: {
            isWholeLine: true,
            className: 'myHighlightDecoration'
        }
    };

    // Remove previous decorations if any
    if (window.currentHighlightDecoration) {
        editor.deltaDecorations(window.currentHighlightDecoration, []);
    }

    // Apply new decoration and save its id for removal later
    window.currentHighlightDecoration = editor.deltaDecorations([], [decoration]);
}

function formatVars(vars) {
    let formatted = [];
    for (let key in vars) {
        if (vars.hasOwnProperty(key)) {
            let value = vars[key];
            // Format arrays differently
            if (Array.isArray(value)) {
                value = '[' + value.join(', ') + ']';
            }
            // Remove unique identifiers from keys if present (e.g., "x-2811100" becomes "x")
            let formattedKey = key.replace(/-\d+$/, '');
            formatted.push(`${formattedKey}: ${value}`);
        }
    }
    return formatted.join('<br>');
}

let isRunning = false;
let isPaused = false;
let isStopped = false;

const visualContent = document.getElementById('visual-content');
visualContent.style.textAlign = 'left';
visualContent.style.marginLeft = '10px';

const runButton = document.getElementById('run');
const pauseButton = document.getElementById('pause');
// const stopButton = document.getElementById('stop');
runButton.addEventListener('click', async () => {
    if (isRunning) {
        console.log('Execution is already in progress.');
        return;
    }
    isRunning = true;
    try {
        const code = editor.getValue();
        // const code = await(await fetch(codePath)).text();
        // TODO: For now, we can ignore edge cases (e.g. triple quotation marks, semi-colons for multiple statements on one line, or backslash for line continuation. See 6/17 screenshot for more.)
        const pythonCode = code;
        pyodide.globals.set('code', pythonCode);
        const traceCode = await (await fetch(traceCodePath)).text();
        pyodide.runPython(traceCode);
        const stepsProxy = pyodide.globals.get('steps').toJs();
        const steps = stepsProxy.map(([lineno, localVarsProxy, globalVarsProxy, nodes, comments]) => {
            const localVars = Object.fromEntries(localVarsProxy);
            const globalVars = Object.fromEntries(globalVarsProxy);
            return [lineno, localVars, globalVars, nodes, comments];
        });
        console.log('JavaScript steps:', steps);
        for (const [lineno, localVars, globalVars, nodes, comments] of steps) {
            // Check if execution has been stopped
            // if (isStopped) {
            //     console.log('Execution stopped.');
            //     break;
            // }
    
            while (isPaused) {
                await new Promise(resolve => setTimeout(resolve, 100)); // Wait a bit before checking again
            }
        
            console.log(`Line ${lineno}:\n└─ Local variables:`, localVars, '\n└─ Global variables:', globalVars, '\n└─ AST Nodes Types:', nodes, '\n└─ Comments:', comments);
            highlightLine(editor, lineno);
            visualContent.innerHTML = `Local variables:<br>${formatVars(localVars)}<br><br>Global variables:<br>${formatVars(globalVars)}`;
            await new Promise(resolve => setTimeout(resolve, 500));
        }        
        // isStopped = false;
    } catch (error) {
        console.error('Error during execution:', error);
    } finally {
        if (window.currentHighlightDecoration) {
            editor.deltaDecorations(window.currentHighlightDecoration, []);
            window.currentHighlightDecoration = null;
        }
        isPaused = false;
        isRunning = false;
    }
});
pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    if (!isPaused) {
        // If the execution was paused and now is resumed, change the button text back
        pauseButton.textContent = 'Pause';
    } else {
        pauseButton.textContent = 'Unpause';
    }
});

// stopButton.addEventListener('click', () => {
//     isStopped = true;
// });
