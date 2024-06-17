if "code" not in locals():
    print("Code is undefined. Quitting...")
    quit()
import sys
sys.settrace(lambda frame, event, arg:(print(f"Executing line {frame.f_lineno}: {frame.f_locals['code'].split('\n')[frame.f_lineno - 1]}") if event == "line" and "code" in frame.f_locals else None) or sys.gettrace())
exec(code)

# def trace_func(frame, event, arg):
#     if event == "line" and "code" in frame.f_locals:
#         lineno = frame.f_lineno
#         line = frame.f_locals["code"].split('\n')[lineno - 1]
#         # line = lines[lineno - 1]
#         print(f"Executing line {lineno}: {line}")
#     return trace_func
# sys.settrace(trace_func)
