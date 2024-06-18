
if "code" not in locals():
    code = "" # prevents annyoing linting
    print("Code is undefined. Quitting...")
    quit()

lines = [""] + code.split('\n') # 1-indexed
# n = len(lines)

import sys
import ast
import tokenize
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

def trace_func(frame, event, arg):
    if event == "line": # and frame.f_lineno < n
        print(f"Executing line {frame.f_lineno}")
        print(f"└   {lines[frame.f_lineno]}")
        print(f"└   {lineno_to_tokens[frame.f_lineno]}")
        print(f"└   {lineno_to_node[frame.f_lineno]}")
    return trace_func

sys.settrace(trace_func)
exec(code)
sys.settrace(None)
