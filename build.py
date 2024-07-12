if 'code' not in globals():
    code = '' # prevents annyoing linting
    print('Code is undefined. Quitting...')
    quit()

lines = [''] + code.split('\n') # 1-indexed

import sys
import ast
import tokenize
from copy import deepcopy

tree = ast.parse(code)
lineno_to_nodes = {}
for node in ast.walk(tree):
    if hasattr(node, 'lineno'):
        if node.lineno not in lineno_to_nodes:
            lineno_to_nodes[node.lineno] = []
        lineno_to_nodes[node.lineno].append(node)

lineno_to_comment = {}
for lineno, line in enumerate(lines):
    tokens = list(tokenize.tokenize(iter([line.encode('utf-8')]).__next__))
    for token in tokens:
        if token.type == tokenize.COMMENT:
            lineno_to_comment[lineno] = token.string
            break

# TODO: handle nonlocal and global variables (using AST?)
# var_to_depth = {} # (name, value_id) : depth # handles usage of global and nonlocal variables

# TODO: Counter, defaultdict, etc.
python_type_to_type = { # type(value).__name__ : type
    "list": "array",
    "tuple": "array",
    # "range": "array",
    "dict": "map",
    "str": "string",
}

inferred_type = {} # (name, depth) : type # (type e.g. heap, graph representations, etc.)

call_stack = [] # depth : {name : (type, value)} # global is 0

steps = [] # (lineno, call_stack, node_types)

lineno_to_steps = {} # lineno : [step]

def get_type(name, value, depth):
    return inferred_type.get((name, depth), python_type_to_type.get(type(value).__name__, type(value).__name__))

def trace_func(frame, event, arg):
    # if event == 'return': print('return with line', lines[frame.f_lineno]) # DEBUG
    # if frame.f_lineno == 0: return trace_func # TODO: also handle lines being called twice? Eg with different events  
    if event == 'call':
        call_stack.append({})
    depth = len(call_stack) - 1
    if depth < 0:
        return trace_func
    global_vars = {}
    for name, value in frame.f_globals.items():
        if type(value).__name__ == 'function' or name == '__builtins__':
            continue
        # value_id = id(value)
        global_vars[name] = (get_type(name, value, depth), value)
        # var_to_depth[(name, value_id)] = 0 # if not (name, value_id) in var_to_depth:
    call_stack[0].update(global_vars) # TODO: Handle variables removed from scope if it's possible
    if depth > 0:
        local_vars = {}
        for name, value in frame.f_locals.items():
            if type(value).__name__ == 'function' or name == '__builtins__':
                continue
            # value_id = id(value)
            # if (name, value_id) in var_to_depth and (var_depth := var_to_depth[(name, value_id)]) < depth:
            #     call_stack[var_depth][(name, value_id)] = (get_type(name, value, depth), value)
            # else:
            local_vars[name] = (get_type(name, value, depth), value)
                # var_to_depth[(name, value_id)] = depth
        call_stack[depth].update(local_vars)
    node_types = [type(node).__name__ for node in lineno_to_nodes[frame.f_lineno]] if frame.f_lineno in lineno_to_nodes and lineno_to_nodes[frame.f_lineno] else [] # Temporarily just using type name for demonstration
    steps.append((frame.f_lineno, deepcopy(call_stack), node_types)) 
    if frame.f_lineno not in lineno_to_steps:
        lineno_to_steps[frame.f_lineno] = []
    lineno_to_steps[frame.f_lineno].append(len(steps) - 1)
    if event == 'return':
        # for name, value_id in call_stack[-1].keys():
        #     del var_to_depth[(name, value_id)]
        call_stack.pop()
    return trace_func

sys.settrace(trace_func)
exec(code, {}) # TODO: do {}, {} if needed
sys.settrace(None)

# TODO: format steps for JavaScript e.g. can't use tuples as keys, but no longer need value_id anyways
# print("Python steps:", steps)
