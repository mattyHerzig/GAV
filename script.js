console.log('script.js');

const codePath = './sample.py';
const traceCodePath = './tracing.py';

const code = await(await fetch(codePath)).text();
// TODO: For now, we can ignore edge cases (e.g. triple quotation marks, semi-colons for multiple statements on one line, or backslash for line continuation. See 6/17 screenshot for more.)
const pythonCode = code; // .replace(/"/g, '\\"').replace(/\\\n/g, '');
const pyodide = await loadPyodide();
pyodide.globals.set('code', pythonCode);
const traceCode = await(await fetch(traceCodePath)).text();

// console.log('code:\n', tracingCode, '\noutput:');
pyodide.runPython(traceCode); // change back to Async if needed
const stepsProxy = pyodide.globals.get('steps').toJs();
const steps = stepsProxy.map(([lineno, localVarsProxy, globalVarsProxy]) => {
    const localVars = Object.fromEntries(localVarsProxy);
    const globalVars = Object.fromEntries(globalVarsProxy);
    return [lineno, localVars, globalVars];
});
console.log('steps:', steps);
