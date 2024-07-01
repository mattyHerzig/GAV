if 'code' not in globals():
    code = '' # prevents annyoing linting
    print('Code is undefined. Quitting...')
    quit()

lines = [''] + code.split('\n') # 1-indexed

import sys
import ast
import tokenize
from collections import defaultdict

tree = ast.parse(code)
lineno_to_nodes = defaultdict(list)
for node in ast.walk(tree):
    if hasattr(node, 'lineno'):
        lineno_to_nodes[node.lineno].append(node)

lineno_to_comments = defaultdict(list) # TODO: at most one comment per line
for lineno, line in enumerate(lines):
    tokens = list(tokenize.tokenize(iter([line.encode('utf-8')]).__next__))
    for token in tokens:
        if token.type == tokenize.COMMENT:
            lineno_to_comments[lineno].append(token.string)

steps = []

def trace_func(frame, event, arg):
    if frame.f_lineno == 0: # TODO: also handle lines being called twice?
        return trace_func
    # if event == 'line': #  or (event == 'call' and frame.f_lineno > 0)
    local_vars = {f'{k}-{id(v)}': v for k, v in frame.f_locals.items() if k != '__builtins__'}
    global_vars = {f'{k}-{id(v)}': v for k, v in frame.f_globals.items() if k != '__builtins__'}
    node_types = [type(node).__name__ for node in lineno_to_nodes[frame.f_lineno]] if lineno_to_nodes[frame.f_lineno] else ['NoNode'] # temporarily using type name for demonstration
    steps.append((frame.f_lineno, local_vars, global_vars, node_types, lineno_to_comments[frame.f_lineno]))
    # TODO: consider output of the program
    return trace_func

sys.settrace(trace_func)
exec(code, {})
sys.settrace(None)

print("Python steps:", steps)
