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

// function formatVars(vars) {
//     let formatted = [];
//     console.log('vars:', vars);
//     for (let name in vars) {
//         if (vars.hasOwnProperty(name)) {
//             let [type, value] = vars[name];
//             if (type === 'array') {
//                 value = '[' + value.join(', ') + ']';
//             }
//             let formattedKey = name.replace(/-\d+$/, '');
//             formatted.push(`${formattedKey} : ${type} == ${value}`);
//         }
//     }
//     return formatted.join('<br>');
// }

function formatCallStack(call_stack) {
    let formatted = [];
    for (let depth = 0; depth < call_stack.length; depth++) {
        const call_stack_layer = call_stack[depth];
        for (const [name, [type, value]] of call_stack_layer) {
            if (type === 'array') {
                value = '[' + value.join(', ') + ']';
            }
            // let formattedKey = name.replace(/-\d+$/, '');
            formatted.push(`depth ${depth} | ${name} : ${type} = ${value}`);
        }
    }
    // for (let name in vars) {
    //     if (vars.hasOwnProperty(name)) {
    //         let [type, value] = vars[name];
    //         if (type === 'array') {
    //             value = '[' + value.join(', ') + ']';
    //         }
    //         let formattedKey = name.replace(/-\d+$/, '');
    //         formatted.push(`${formattedKey} : ${type} == ${value}`);
    //     }
    // }
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

        const steps = stepsProxy.map(([lineno, call_stack_with_proxy_maps, nodes]) => {
            let call_stack = call_stack_with_proxy_maps.map(proxyMap => new Map(proxyMap));
            return [lineno, call_stack, nodes];
        });
        console.log('JavaScript steps:', steps);
        for (const [lineno, call_stack, nodes] of steps) {
            while (isPaused) {
                await new Promise(resolve => setTimeout(resolve, 100)); // Wait a bit before checking again
            }
            console.log(`Line ${lineno}:\n└─ Call Stack:`, call_stack, '\n└─ AST Node Types:', nodes);
            highlightLine(editor, lineno);
            visualContent.innerHTML = `Variables:<br>${formatCallStack(call_stack)}`;
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        
        // const steps = stepsProxy.map(([lineno, varsProxy, nodes]) => {
        //     const vars = Object.fromEntries(varsProxy);
        //     return [lineno, vars, nodes];
        // });
        // console.log('JavaScript steps:', steps);
        // for (const [lineno, vars, nodes] of steps) {
        //     while (isPaused) {
        //         await new Promise(resolve => setTimeout(resolve, 100)); // Wait a bit before checking again
        //     }
        //     console.log(`Line ${lineno}:\n└─ Variables:`, vars, '\n└─ AST Node Types:', nodes);
        //     highlightLine(editor, lineno);
        //     visualContent.innerHTML = `Variables:<br>${formatVars(vars)}`;
        //     await new Promise(resolve => setTimeout(resolve, 500));
        // }



        // const steps = stepsProxy.map(([lineno, varsProxy, nodes]) => {
        //     const localVars = Object.fromEntries(localVarsProxy);
        //     const globalVars = Object.fromEntries(globalVarsProxy);
        //     return [lineno, localVars, globalVars, nodes, comments];
        // });
        // for (const [lineno, localVars, globalVars, nodes, comments] of steps) {
        //     // Check if execution has been stopped
        //     // if (isStopped) {
        //     //     console.log('Execution stopped.');
        //     //     break;
        //     // }
    
        //     while (isPaused) {
        //         await new Promise(resolve => setTimeout(resolve, 100)); // Wait a bit before checking again
        //     }
        
        //     console.log(`Line ${lineno}:\n└─ Variables:`, vars, '\n└─ AST Node Types:', nodes, '\n└─ Comments:', comments);
        //     highlightLine(editor, lineno);
        //     visualContent.innerHTML = `Local variables:<br>${formatVars(localVars)}<br><br>Global variables:<br>${formatVars(globalVars)}`;
        //     await new Promise(resolve => setTimeout(resolve, 500));
        // }        
        // // isStopped = false;


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
