import ast

def execute_step_by_step(code):
    tree = ast.parse(code)
    namespace = {}

    def execute_node(node, preceding_nodes):
        nonlocal namespace
        if isinstance(node, ast.For):
            exec(compile(ast.Module(body=preceding_nodes + [node], type_ignores=[]), filename="<ast>", mode="exec"), namespace)
            print("Executed:", node.lineno)
        elif isinstance(node, (ast.Expr, ast.Assign)):
            exec(compile(ast.Expression(node.value), filename="<ast>", mode="eval"), namespace)
            print("Executed:", node.lineno)
        else:
            for child in ast.iter_child_nodes(node):
                execute_node(child, preceding_nodes + [node])

    execute_node(tree, [])

code = \
"""
x = 10
for i in range(3):
    print(i)
    x += i
print(x)
"""

execute_step_by_step(code)