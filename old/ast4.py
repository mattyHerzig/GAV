import ast

class ExecutingNodeVisitor(ast.NodeVisitor):
    def __init__(self, source_code):
        self.source_code = source_code
        self.globals = {}
        self.last_line = None

    def visit(self, node):
        """Visit a node, executing it and tracking line execution."""
        if hasattr(node, 'lineno'):
            line_number = node.lineno
            line_content = self.source_code.splitlines()[line_number - 1].strip()

            # Execute this line only if it's different from the last executed line
            if not isinstance(node, ast.FunctionDef) and not isinstance(node, ast.ClassDef) and not isinstance(node, ast.Import) and not isinstance(node, ast.ImportFrom):
                if line_number != self.last_line:
                    print(f"Executing line {line_number}")
                    exec(compile(ast.Expression(node.value), filename="<ast>", mode="eval"), self.globals)
                    self.last_line = line_number

        self.generic_visit(node)

# Example Python code to trace
example_code = """
def say_hello():
    print("Hello, world!")

for i in range(3):
    say_hello()
"""

# Parse the example code into an AST and execute it
parsed_code = ast.parse(example_code)
visitor = ExecutingNodeVisitor(example_code)
visitor.visit(parsed_code)
