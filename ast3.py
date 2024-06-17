import ast

# A simple example Python program as a string
example_code = \
"""
def say_hello():
    print("Hello, world!")

for i in range(3):
    say_hello()
"""

# Parse the example code into an AST
parsed_code = ast.parse(example_code)

class CodeAnalyzer(ast.NodeVisitor):
    def visit(self, node):
        """Visit a node and print the line number and line content if possible."""
        if hasattr(node, 'lineno'):
            line_number = node.lineno
            # Extract the line from the source code using line number
            line_content = example_code.splitlines()[line_number - 1].strip()
            print(f"Line {line_number}: {line_content}")
        # Continue to do the default action which visits all the child nodes
        self.generic_visit(node)

# Create an instance of the analyzer and visit the parsed AST
analyzer = CodeAnalyzer()
analyzer.visit(parsed_code)
