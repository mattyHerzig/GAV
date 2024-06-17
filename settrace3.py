import sys

def trace_func(frame, event, arg):
    # print("frame", frame)
    # print("event", event)
    # print("arg", arg)
    # print("  - filename:", frame.f_code.co_filename)
    # print("  - line number:", frame.f_lineno)
    # print("  - function name:", frame.f_code.co_name)
    # print("  - local variables:", frame.f_locals)
    # print("  - global variables:", frame.f_globals.keys())
    if event == "line":
        lineno = frame.f_lineno
        line = frame.f_locals['code'].split('\n')[lineno - 1]
        # line = lines[lineno - 1]
        print(f"Executing line {lineno}: {line}")
    return trace_func

def execute_code(code):
    sys.settrace(trace_func)
    exec(code)
    sys.settrace(None)

code = \
"""
x = 10
for i in range(3):
    print(i)
    x += i
print(x)
"""

lines = code.strip().split('\n')

execute_code(code)