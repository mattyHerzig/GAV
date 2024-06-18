if 'code' not in globals():
    code = '' # prevents annyoing linting
    print('Code is undefined. Quitting...')
    quit()

lines = [''] + code.split('\n') # 1-indexed

import sys
import ast
import tokenize
import builtins
from collections import defaultdict

# tree = ast.parse(code)
# lineno_to_nodes = defaultdict(list)
# for node in ast.walk(tree):
#     if hasattr(node, 'lineno'):
#         lineno_to_nodes[node.lineno].append(node)

# lineno_to_comment = defaultdict(list)
# for lineno, line in enumerate(lines):
#     tokens = list(tokenize.tokenize(iter([line.encode('utf-8')]).__next__))
#     for token in tokens:
#         if token.type == tokenize.COMMENT:
#             lineno_to_comment[lineno].append(token.string)

steps = []

def trace_func(frame, event, arg):
    # if event == 'line': #  or (event == 'call' and frame.f_lineno > 0)
    local_vars = {f'{k}-{id(v)}': v for k, v in frame.f_locals.items() if not (k.startswith('__') and k.endswith('__'))}
    global_vars = {f'{k}-{id(v)}': v for k, v in frame.f_globals.items() if not (k.startswith('__') and k.endswith('__')) and k not in dir(builtins)}
    steps.append((frame.f_lineno, local_vars, global_vars))
    return trace_func

sys.settrace(trace_func)
exec(code, {})
sys.settrace(None)
