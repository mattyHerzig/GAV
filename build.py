if 'code' not in globals():
    code = '' # prevents annyoing linting
    print('Code is undefined. Quitting...')
    quit()

import sys
import ast
import tokenize
import io
import traceback
# from copy import deepcopy

# lines = [''] + code.split('\n') # 1-indexed

# lineno_to_nodes = {}
# tree = ast.parse(code)
# for node in ast.walk(tree):
#     if hasattr(node, 'lineno'):
#         if node.lineno not in lineno_to_nodes:
#             lineno_to_nodes[node.lineno] = []
#         lineno_to_nodes[node.lineno].append(node) # sort based on node.col_offset later?

# lineno_to_comment = {}
# tokens = list(tokenize.tokenize(iter([code.encode('utf-8')]).__next__))
# for token in tokens:
#     if token.type == tokenize.COMMENT:
#         lineno_to_comment[token.start[0]] = token.string

# auxiliary data structures:

# TODO: account for others e.g. Counter, defaultdict, range, etc.
# TODO: strings are data structures, not primitive. map string to array?
python_type_to_type = { # type(value).__name__ : type
    'list': 'array',
    'tuple': 'array', # or keep as tuple and use paranthesis where needed?
    'dict': 'map',
    'str': 'string',
    'deque': 'queue',

    'NoneType': 'null', # TODO: ?
}

# alternatively, types to include
# currently use when making the frame list. should instead use when constructing the call stack?
types_to_exclude = { # type(value).__name__
    'function',
    'module',
    'type' # e.g. `deque` from `from collections import deque`
}

inferred_type = {} # {(name, depth) : type} # (type e.g. heap, graph representations, etc.) # depth or (function, depth) / f'{function} {depth}'?

steps = [(1, [], [], '')] # [(lineno, call_stack, node_types, stdout)] # 1-indexed

lineno_to_steps = {} # {lineno : [step]}

primitive_types = {
    'int',
    'float',
    'str',
    'bool'
}

# 'string'?
data_structure_types = {
    'array',
    'set',
    'map'
}

def is_primitive(value):
    return type(value).__name__ in primitive_types

def is_freevar(name, value, freevars, data_structure_cell_id_to_name_and_currently_deepest_depth):
    return name in freevars if is_primitive(value) else id(value) in data_structure_cell_id_to_name_and_currently_deepest_depth

def is_cellvar(name, value, cellvars):
    return name in cellvars if is_primitive(value) else True

def get_type(name, value, depth):
    return inferred_type.get((name, depth), python_type_to_type.get(type(value).__name__, type(value).__name__))

# For now, assuming I don't need to name data structure elements e.g. nums[0], because they typically won't be unusual types. Otherwise, would need to come up with a way to consistently refer to the same element
#    on top of unusual types, probably should considering nested data structures being cell variable...
#    find a way to refer to memory address?
#    I don’t think primitive data structure elements can be free variables?
#    if can't refer to specific element e.g. key for set, can use the name of the data struture?
# Also, print type with data structure element if needed
# string [('char', c) for c in list(value)] ?
# can simplify the arguments by using global variables and clear them on each tracefunc 
#   or, by making it a nested function of tracefunc?
#   don't need to check if primitive free var, if a data structure element?
def get_type_and_value(name, value, depth, cellvars, freevars, primitive_cell_name_to_depths, data_structure_cell_id_to_names_and_depths, call_stack, function):
    # print('name', name, 'value', value, 'depth', depth, file=sys.__stdout__) # DEBUG
    if is_freevar(name, value, freevars, data_structure_cell_id_to_names_and_depths):
        if is_primitive(value):
            cell_name = name
            cell_depth = primitive_cell_name_to_depths[name][-1]
        else: # data structure
            cell_name, cell_depth = data_structure_cell_id_to_names_and_depths[id(value)][-1]
        # print('call_stack', call_stack, 'cell_depth', cell_depth, file=sys.__stdout__)
        # TODO: this assumes _locals is first going to iterate over more "authentic" value (e.g. data structure element before iterated element in same scope), which may be unintuitive?
        #    actually okay, since locals seems to be in order of initialization?
        return ('free', f'{cell_depth} {cell_name}') # (cell_depth, cell_name) # f'(cell {cell_name} from {call_stack[cell_depth][0] if cell_depth < len(call_stack) else function} {cell_depth})'
    else: # not freevar
        if is_cellvar(name, value, cellvars):
            if is_primitive(value):
                if not name in primitive_cell_name_to_depths:
                    primitive_cell_name_to_depths[name] = []
                primitive_cell_name_to_depths[name].append(depth)
            else: # data structure
                value_id = id(value)
                if not value_id in data_structure_cell_id_to_names_and_depths:
                    data_structure_cell_id_to_names_and_depths[value_id] = []
                data_structure_cell_id_to_names_and_depths[value_id].append((name, depth))
        _type = get_type(name, value, depth)
        match _type:
            case 'array':
                # TODO: refer to inferred type with ID if data structure? weird edge case, but what if a heap was an element of an array, and changed indices?
                return (_type, [get_type_and_value(f'{name}[{i}]', v, depth, cellvars, freevars, primitive_cell_name_to_depths, data_structure_cell_id_to_names_and_depths, call_stack, function) for i, v in enumerate(value)])
            case 'set':
                return (_type, [get_type_and_value(f'{name} element', k, depth, cellvars, freevars, primitive_cell_name_to_depths, data_structure_cell_id_to_names_and_depths, call_stack, function) for k in value])
            case 'map': # TODO: other stuff e.g. replace tuple paranthesis, when used as key, with square brackets?
                return (_type, [(get_type_and_value(f'{name} key', k, depth, cellvars, freevars, primitive_cell_name_to_depths, data_structure_cell_id_to_names_and_depths, call_stack, function), \
                                 get_type_and_value(f'{name}[{f'"{k}"' if get_type(f'{name} key', k, depth) == 'string' else k}]', v, depth, cellvars, freevars, primitive_cell_name_to_depths, data_structure_cell_id_to_names_and_depths, call_stack, function)) for k, v in value.items()])
            case 'queue':
                return (_type, [get_type_and_value(f'{name}[{i}]', v, depth, cellvars, freevars, primitive_cell_name_to_depths, data_structure_cell_id_to_names_and_depths, call_stack, function) for i, v in enumerate(value)])
            case _:
                return (_type, value) # deepcopy(value) if needed

# class TracingError(Exception):
#     def __init__(self, message):
#         super().__init__(message)
# ... raise TracingError(f"An error occurred during tracing: {e}") # cover entire file if needed

def tracefunc(frame, event, arg):
    if frame.f_code.co_filename != '<string>': # prevents tracing other files e.g. imported modules
        return tracefunc
    frames = [] # [height : (function, {name : value}, varnames, cellvars, freevars)]
    current_frame = frame
    while current_frame:
        # convert co_varnames, co_cellvars, and co_freevars to hash sets if needed
        frames.append((
            current_frame.f_code.co_name if current_frame.f_code.co_name != '<module>' else 'global',
            {name: value for name, value in current_frame.f_locals.items() if not type(value).__name__ in types_to_exclude and name != '__builtins__'},
            # current_frame.f_code.co_varnames,
            current_frame.f_code.co_cellvars,
            current_frame.f_code.co_freevars))
        if current_frame.f_code.co_name == '<module>':
            break
        current_frame = current_frame.f_back
        
    primitive_cell_name_to_depths = {} # {name : depth}
    data_structure_cell_id_to_names_and_depths = {} # {id(value) : (name, depth)}
    # if needed for optimization, can go back to manually handling the call stack, and only check current frame's locals and cell variables
    call_stack = [] # [depth : (function, {name : (type, value)})] # global is 0
    # can add varnames if using
    for depth, (function, locals, cellvars, freevars) in enumerate(reversed(frames)): # TODO: function -> scope?
        _locals = {}
        for name, value in locals.items():
            _locals[name] = get_type_and_value(name, value, depth, cellvars, freevars, primitive_cell_name_to_depths, data_structure_cell_id_to_names_and_depths, call_stack, function)
        call_stack.append((function, _locals))
    cell_vars = {f'{cell_depth} {cell_name}' for cell_name, cell_depths in primitive_cell_name_to_depths.items() for cell_depth in cell_depths} | \
                {f'{cell_depth} {cell_name}' for cell_names_and_depths in data_structure_cell_id_to_names_and_depths.values() for cell_name, cell_depth in cell_names_and_depths}
    # node_types = [type(node).__name__ for node in lineno_to_nodes[frame.f_lineno]] if frame.f_lineno in lineno_to_nodes and lineno_to_nodes[frame.f_lineno] else [] # temporarily just using type name for demonstration
    stdout = sys.stdout.getvalue()
    # for some reason, if `if frame.f_lineno == 0: return tracefunc` is included at the beginning, some early steps are skipped? also handle lines being called twice? Eg with different events # not (1 <= frame.f_lineno <= len(lines) + 1)
    if frame.f_lineno != 0: 
        steps.append((frame.f_lineno, call_stack, cell_vars, stdout)) 
        if frame.f_lineno not in lineno_to_steps:
            lineno_to_steps[frame.f_lineno] = []
        lineno_to_steps[frame.f_lineno].append(len(steps) - 1)
    return tracefunc

# simplification of the traceback. Can revert to unsimplified and rigorous if needed
def format_traceback(tb):
    # return tb # DEBUG
    filtered_tb_lines = []
    tb_lines = tb.split('\n')
    for line in tb_lines:
        if line.startswith('  File "<exec>"'):
            continue
        elif line.startswith('  File "<string>", '):
            line = line[len('  File "<string>", '):]
            line = '  ' + line[0].upper() + line[1:]
        if line.endswith('<module>'):
            line = line[:-len('<module>')] + 'global'
        filtered_tb_lines.append(line)
    return '\n'.join(filtered_tb_lines)

error, error_lineno = '', 0
sys.stdout = io.StringIO()
sys.settrace(tracefunc)
try:    
    exec(code, {})
except Exception as e:
    sys.settrace(None) # otherwise, formatting traceback causes an error
    error, error_lineno = format_traceback(traceback.format_exc()), traceback.extract_tb(e.__traceback__)[-1].lineno    
    for i in range(len(steps)-1, 1, -1): # otherwise, visualizes going back up the call stack
        if steps[i][0] == steps[i-1][0] == steps[i-2][0] == error_lineno:
            steps = steps[:i]
            break
finally:
    sys.settrace(None)
    sys.stdout = sys.__stdout__

# def clear_collections(): # can clear in JavaScript after getting deliverables, e.g. steps, lineno_to_steps, etc., to save memory (unless it uses the same memory)
#     for collection in [lineno_to_nodes, lineno_to_comment, inferred_type, steps, lineno_to_steps]:
#         collection.clear()

# print("Python steps:", steps)

# TODO: format deliverables for JavaScript e.g. steps e.g. can't use tuples as keys (unless Pyodoide accounts for e.g. with Proxy) (e.g. may convert to list?), non-breaking spaces instead of spaces, etc.
