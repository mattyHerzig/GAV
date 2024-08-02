if 'code' not in globals():
    code = '' # prevents annyoing linting
    print('Code is undefined. Quitting...')
    quit()

import sys
import ast
import tokenize
import io

lines = [''] + code.split('\n') # 1-indexed

lineno_to_nodes = {}
tree = ast.parse(code)
for node in ast.walk(tree):
    if hasattr(node, 'lineno'):
        if node.lineno not in lineno_to_nodes:
            lineno_to_nodes[node.lineno] = []
        lineno_to_nodes[node.lineno].append(node) # sort based on node.col_offset later?
# for lineno, nodes in lineno_to_nodes.items(): # DEBUG
#     print('ast nodes at line', lineno, ':', [type(node).__name__ for node in nodes]) 

lineno_to_comment = {}
tokens = list(tokenize.tokenize(iter([code.encode('utf-8')]).__next__))
for token in tokens:
    if token.type == tokenize.COMMENT:
        lineno_to_comment[token.start[0]] = token.string

# auxiliary data structures:

# TODO: handle nonlocal and global variables (using AST?)
# var_to_depth = {} # (name, value_id) : depth # handles usage of global and nonlocal variables
# name_to_depths = {} # {name : [depth]} # TODO: later, can just do for variable names that nonlocal and global are used with

# TODO: Counter, defaultdict, etc.
# TODO: strings are data structures, not primitive. map string to array?
# "range": "array"?
python_type_to_type = { # type(value).__name__ : type
    "list": "array",
    "tuple": "array",
    "dict": "map",
    "str": "string",
}

inferred_type = {} # {(name, depth) : type} # (type e.g. heap, graph representations, etc.) # TODO: remove when needed

steps = [] # [(lineno, call_stack, node_types, stdout)]

lineno_to_steps = {} # {lineno : [step]}

def is_primitive(value):
    return type(value).__name__ in {'int', 'float', 'str', 'bool'}

def is_freevar(name, value, freevars, data_structure_cell_id_to_name_and_currently_deepest_depth):
    return name in freevars if is_primitive(value) else id(value) in data_structure_cell_id_to_name_and_currently_deepest_depth

def is_cellvar(name, value, cellvars):
    return name in cellvars if is_primitive(value) else True

def get_type(name, value, depth):
    return inferred_type.get((name, depth), python_type_to_type.get(type(value).__name__, type(value).__name__))

def tracefunc(frame, event, arg):
    # if event == 'return': print('return with line', lines[frame.f_lineno]) # DEBUG
    
    # print('lineno', frame.f_lineno, 'event', event, 'arg', arg, file=sys.__stdout__) # DEBUG

    frames = [] # [height : (function, {name : value}, varnames, cellvars, freevars)]
    current_frame = frame
    while current_frame:
        # convert co_varnames, co_cellvars, and co_freevars to hash sets if needed
        frames.append((current_frame.f_code.co_name if current_frame.f_code.co_name != '<module>' else 'global', {name: value for name, value in current_frame.f_locals.items() if type(value).__name__ != 'function' and name != '__builtins__'}, current_frame.f_code.co_varnames, current_frame.f_code.co_cellvars, current_frame.f_code.co_freevars))
        if current_frame.f_code.co_name == '<module>':
            break
        current_frame = current_frame.f_back
    
    # print(f'frames', frames, file=sys.__stdout__) # DEBUG
    
    primitive_cell_name_to_currently_deepest_depth = {} # {name : depth}
    data_structure_cell_id_to_name_and_currently_deepest_depth = {} # {id(value) : (name, depth)}
    call_stack = [] # [depth : (function, {name : (type, value)})] # global is 0
    # TODO: can remove varnames if not using
    for depth, (function, locals, varnames, cellvars, freevars) in enumerate(reversed(frames)):
        _locals = {}
        for name, value in locals.items():
            # print('name', name, file=sys.__stdout__)
            if is_freevar(name, value, freevars, data_structure_cell_id_to_name_and_currently_deepest_depth):
                if is_primitive(value):
                    cell_depth = primitive_cell_name_to_currently_deepest_depth[name]
                else:
                    cell_name, cell_depth = data_structure_cell_id_to_name_and_currently_deepest_depth[id(value)]
                _locals[name] = ('free', f'(cell {cell_name} from {call_stack[cell_depth][0]} {cell_depth})')
            else:
                if is_cellvar(name, value, cellvars):
                    if is_primitive(value):
                        primitive_cell_name_to_currently_deepest_depth[name] = depth
                    else:
                        data_structure_cell_id_to_name_and_currently_deepest_depth[id(value)] = (name, depth)
                _locals[name] = (get_type(name, value, depth), value)
        call_stack.append((function, _locals))
    
    # print(f'call_stack', call_stack, file=sys.__stdout__) # DEBUG
    
    node_types = [type(node).__name__ for node in lineno_to_nodes[frame.f_lineno]] if frame.f_lineno in lineno_to_nodes and lineno_to_nodes[frame.f_lineno] else [] # temporarily just using type name for demonstration
    stdout = sys.stdout.getvalue()
    # for some reason, if `if frame.f_lineno == 0: return tracefunc` is included at the beginning, some early steps are skipped? also handle lines being called twice? Eg with different events # not (1 <= frame.f_lineno <= len(lines) + 1)
    if frame.f_lineno != 0: 
        steps.append((frame.f_lineno, call_stack, node_types, stdout)) 
        # print(frame.f_lineno, file=sys.__stdout__) # DEBUG
        if frame.f_lineno not in lineno_to_steps:
            lineno_to_steps[frame.f_lineno] = []
        lineno_to_steps[frame.f_lineno].append(depth) # last value of depth is persistent # alternatively, `len(steps) - 1`
    
    return tracefunc

sys.stdout = io.StringIO()
sys.settrace(tracefunc)
try:
    exec(code, {})
except Exception as e:
    print('Error:', str(e), file=sys.__stdout__) # TODO: frontend visualization, and prevent extra steps for some reason
sys.settrace(None)
sys.stdout = sys.__stdout__

# TODO: format steps for JavaScript e.g. can't use tuples as keys, but no longer need value_id anyways
# print("Python steps:", steps)

# TODO: clear all auxiliary data structures used before returning?
