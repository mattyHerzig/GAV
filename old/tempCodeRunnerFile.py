import sys

def trace_func(frame, event, arg):
    print("frame", frame)
    print("event", event)
    print("arg", arg)
    print("  - filename:", frame.f_code.co_filename)
    print("  - line number:", frame.f_lineno)
    print("  - function name:", frame.f_code.co_name)
    print("  - local variables:", frame.f_locals)
    print("  - global variables:", frame.f_globals.keys())
    if event == "line":
        lineno = frame.f_lineno
        line = frame.f_locals[code].split('\n')[frame.f_lineno - 1].strip()
        print(f"Executing line {lineno}: {line}")
        print("Local variables:", frame.f_locals)
    return trace_func

def execute_code(code):
    sys.settrace(trace_func)
    exec(code)
    sys.settrace(None)

code = """
x = 10
for i in range(3):
    print(i)
    x += i
print(x)
"""

execute_code(code)