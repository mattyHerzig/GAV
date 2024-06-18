





# import asyncio

# print(0)
# async def f():
#     await asyncio.sleep(2)
#     print(44444444)
#     exit(0)
#     # quit()

# f()







if 'code' not in globals():
    code = '' # prevents annyoing linting
    print('Code is undefined. Quitting...')
    quit()

lines = [''] + code.split('\n') # 1-indexed
# n = len(lines)

import sys
import ast
import tokenize
# import threading
# import time
# import asyncio
# import pyodide # type: ignore (imported during runtime)
from collections import defaultdict

tree = ast.parse(code)
lineno_to_node = defaultdict(list)
for node in ast.walk(tree):
    if hasattr(node, 'lineno'):
        lineno_to_node[node.lineno].append(node)

lineno_to_tokens = defaultdict(list)
for lineno, line in enumerate(lines):
    if not line: # .strip()
        continue
    tokens = list(tokenize.tokenize(iter([line.encode('utf-8')]).__next__))
    lineno_to_tokens[lineno] = tokens

# pause_event = threading.Event()
# pause_event.set()

steps = []

def trace_func(frame, event, arg):
    if event == 'line': # and frame.f_lineno < n
        # pause_event.wait()
        print(f'Executing line {frame.f_lineno}')
        print(f'└   {lines[frame.f_lineno]}')
        print(f'└   {lineno_to_tokens[frame.f_lineno]}')
        print(f'└   {lineno_to_node[frame.f_lineno]}')
        steps.append((frame.f_lineno, lines[frame.f_lineno], lineno_to_tokens[frame.f_lineno], lineno_to_node[frame.f_lineno]))
        # time.sleep(1)
        # await asyncio.sleep(1)
    return trace_func

sys.settrace(trace_func)
exec(code, {})
sys.settrace(None)

# async def trace_code():
#     sys.settrace(trace_func)
#     exec(code)
#     sys.settrace(None)

# pyodide.run_async(trace_code())

# runner = pyodide.code.CodeRunner('import time; time.sleep(5); print(44444)')
# runner.compile()
# runner.run_async()

# pyodide.code.CodeRunner('asyncio.run(trace_code())')

# result = pyodide.code.eval_code_async('trace_code()', globals())

steps