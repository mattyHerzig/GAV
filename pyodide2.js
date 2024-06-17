import { loadPyodide } from 'pyodide';
import fs from 'fs';
const pyodide = await loadPyodide();
const codePath = './test.py';
const traceCodePath = './settrace3.py';

const code = fs.readFileSync(codePath, 'utf-8');
const traceCode = `code = """${code}"""\n${fs.readFileSync(traceCodePath, 'utf-8')}`;
console.log('code:\n", traceCode, "\noutput:');
pyodide.runPythonAsync(traceCode)


