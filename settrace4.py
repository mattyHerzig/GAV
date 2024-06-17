import sys
import subprocess

def trace_func(frame, event, arg):
    if event == "line":
        lineno = frame.f_lineno
        filename = frame.f_code.co_filename
        if not filename.startswith('<'):
            with open(filename, "r") as file:
                line = file.readlines()[lineno - 1].strip()
            print(f"Executing line {lineno}: {line}")
            print("Local variables:", frame.f_locals)
    return trace_func

def create_and_run_file(code):
    with open('new_file.py', 'w') as f:
        f.write(code)

    command = [sys.executable, '-c', f"""
import sys
from settrace2 import trace_func

sys.settrace(trace_func)

import new_file

sys.settrace(None)
    """]

    subprocess.run(command)

code = """
x = 10
for i in range(3):
    print(i)
    x += i
print(x)
"""

create_and_run_file(code)