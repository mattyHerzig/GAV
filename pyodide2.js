import { loadPyodide } from 'pyodide';
import fs from 'fs';
const pyodide = await loadPyodide();
const filePath = './settrace3.py';
const code = fs.readFileSync(filePath, 'utf-8');
console.log("code:\n", code, "\noutput:");
pyodide.runPythonAsync(code)
