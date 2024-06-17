console.log("pyodide2.js");

// import { loadPyodide } from 'pyodide';
// const pyodide = await loadPyodide({ indexURL : "https://cdn.jsdelivr.net/pyodide/v0.18.1/full/" });;
const pyodide = await loadPyodide();
const codePath = './test.py';
const traceCodePath = './settrace3.py';

const response1 = await fetch(codePath);
const code = await response1.text();

const response2 = await fetch(traceCodePath);
const traceCode = `code = """${code}"""\n${await response2.text()}`;

console.log('code:\n', traceCode, '\noutput:');
pyodide.runPythonAsync(traceCode);

// console.log("pyodide2.js");
// import { loadPyodide } from 'pyodide';
// import fs from 'fs';
// const pyodide = await loadPyodide();
// const codePath = './test.py';
// const traceCodePath = './settrace3.py';

// const code = fs.readFileSync(codePath, 'utf-8');
// const traceCode = `code = """${code}"""\n${fs.readFileSync(traceCodePath, 'utf-8')}`;
// console.log('code:\n", traceCode, "\noutput:');
// pyodide.runPythonAsync(traceCode)
