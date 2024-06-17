import sys

def trace_func(frame, event, arg):
    if event == "line":
        lineno = frame.f_lineno
        filename = frame.f_code.co_filename
        with open(filename, "r") as file:
            line = file.readlines()[lineno - 1].strip()
        print(f"Executing line {lineno}: {line}")
        print("Local variables:", frame.f_locals)
    return trace_func

def test_function():
    x = 10
    for i in range(3):
        print(i)
        x += i
    print(x)
    # x = 10
    # for i in range(3):
    #     y = x + i
    #     print(y)

sys.settrace(trace_func)
test_function()
sys.settrace(None)
