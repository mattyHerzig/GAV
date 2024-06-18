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
import builtins
# import threading
# import time
# import asyncio
# import pyodide # type: ignore (imported during runtime)
from collections import defaultdict

# tree = ast.parse(code)
# lineno_to_nodes = defaultdict(list)
# for node in ast.walk(tree):
#     if hasattr(node, 'lineno'):
#         lineno_to_nodes[node.lineno].append(node)

lineno_to_comment = defaultdict(list)
for lineno, line in enumerate(lines):
    tokens = list(tokenize.tokenize(iter([line.encode('utf-8')]).__next__))
    for token in tokens:
        if token.type == tokenize.COMMENT:
            lineno_to_comment[lineno].append(token.string)

# pause_event = threading.Event()
# pause_event.set()

steps = []

def trace_func(frame, event, arg):
    if event == 'line': #  or (event == 'call' and frame.f_lineno > 0)
        local_vars = {f'{k}-{id(v)}': v for k, v in frame.f_locals.items() if not (k.startswith('__') and k.endswith('__'))}
        global_vars = {f'{k}-{id(v)}': v for k, v in frame.f_globals.items() if not (k.startswith('__') and k.endswith('__')) and k not in dir(builtins)}
        # print("locals", local_vars)
        # print("globals", global_vars)
        steps.append((frame.f_lineno, local_vars, global_vars))
        # pause_event.wait()
        # current_variables = dict(frame.f_locals)
        # step_changed_variables.append(frame.f_lineno, {var: current_variables[var] for var in current_variables if var not in previous_variables or previous_variables[var] != current_variables[var]})
        # print(f'Executing line {frame.f_lineno}')
        # print(f'└   {lines[frame.f_lineno]}')
        # print(f'└   {lineno_to_tokens[frame.f_lineno]}')
        # print(f'└   {lineno_to_nodes[frame.f_lineno]}')
        # steps.append((frame.f_lineno, lines[frame.f_lineno], lineno_to_tokens[frame.f_lineno], lineno_to_nodes[frame.f_lineno]))
        # time.sleep(1)
        # await asyncio.sleep(1)
    return trace_func

sys.settrace(trace_func)
exec(code, {})
sys.settrace(None)

# print(steps)

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