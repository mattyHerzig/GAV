import { loadPyodide } from 'pyodide';

const code = 
`x = 10
for i in range(3):
    x += i
print(x)`;

const lines = code.split('\n');

async function main() {
    const pyodide = await loadPyodide();
    for (let line of lines) {
        try {
            const output = await pyodide.runPythonAsync(line);
            console.log("Executed:", line, "Output:", output);
        } catch (error) {
            console.error("Error executing line:", line, error);
        }
    }
}

main();