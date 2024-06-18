console.log("script.js");

// import { loadPyodide } from 'pyodide';
// const pyodide = await loadPyodide({ indexURL : "https://cdn.jsdelivr.net/pyodide/v0.18.1/full/" });;
const pyodide = await loadPyodide();
const codePath = './sample.py';
const traceCodePath = './tracing.py';

const code = await(await fetch(codePath)).text();
// TODO: For now, we can ignore edge cases (e.g. semi-colons for multiple statements on one line, or backslash for line continuation. See 6/17 screenshot for more.)
const pythonCode = code.replace(/"/g, '\\"'); // .replace(/\\\n/g, '');
// const pythonCode = code.replace(/"/g, '\\"');
const traceCode = await(await fetch(traceCodePath)).text();
const tracingCode = `code = """${pythonCode}"""\n${traceCode}`;
// const tracingCode = `${traceCode}\nexec("""${pythonCode}""")`;

// console.log('code:\n', tracingCode, '\noutput:');
pyodide.runPythonAsync(tracingCode);
