import sys

def trace_calls(code_lines):
    """ Generate a function to handle the trace calls with access to code_lines """
    def trace(frame, event, arg):
        if event == "line":
            # Retrieve the current line number
            line_number = frame.f_lineno
            # Get the line from the code_lines list
            current_line = code_lines[line_number - 1].strip()  # Adjusting for 0-based index
            print(f"Executing line {line_number}: {current_line}")
        return trace

    return trace

def debug(code):
    # Split the code into lines for easy access by line number
    code_lines = code.strip().split('\n')
    print("code_lines", code_lines)
    # Compile the code string to a code object
    compiled_code = compile(code, filename="<string>", mode='exec')
    print("compiled_code", compiled_code)
    # Set the trace function using a function generated with code lines
    sys.settrace(trace_calls(code_lines))
    # Execute the compiled code
    exec(compiled_code)
    # Reset the trace function to None after execution
    sys.settrace(None)

# Example Python code to debug
code_to_debug = \
"""
x = 10
for i in range(3):
    print(i)
    x += i
print(x)
"""

debug(code_to_debug)
