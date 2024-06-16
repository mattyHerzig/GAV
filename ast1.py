import ast

def execute_step_by_step(code):
    tree = ast.parse(code)
    for node in ast.walk(tree):
        if isinstance(node, ast.Expr):
            exec(compile(ast.Expression(node.value), filename="<ast>", mode="eval"))
            print("Executed:", node.lineno)

code = \
"""
x = 10
for i in range(3):
    print(i)
    x += i
print(x)
"""

execute_step_by_step(code)
