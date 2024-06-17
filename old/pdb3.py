import subprocess

# Python code as a string, which includes pdb
python_code = """
import pdb
x = 0
for i in range(5):
    x += i
    pdb.set_trace()  # Breakpoint
print('Final x:', x)
"""

# Save the code to a temporary Python file
with open("temp_script.py", "w") as file:
    file.write(python_code)

# Start the Python script with pdb using subprocess
process = subprocess.Popen(
    ['python', 'temp_script.py'],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    text=True
)

# Automatically send 'c' (continue) command to pdb and print outputs
try:
    while True:
        print(1)
        output = process.stdout.readline()
        print("output", output)
        if 'pdb' in output:
            print(2)
            # Automatically send the 'continue' command when pdb prompts
            process.stdin.write('c\n')
            print(3)
            process.stdin.flush()
            print(4)
        if output == '' and process.poll() is not None:
            print(5)
            break
        if output:
            print(6)
            print(output.strip())
finally:
    process.stdin.close()
    process.terminate()
    process.wait()

