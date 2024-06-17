import pdb
import sys

class AutoPDB(pdb.Pdb):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.set_trace()

    def user_line(self, frame):
        # This method is called when we stop or break at this line
        self.current_line = frame.f_lineno
        self.current_file = frame.f_code.co_filename
        line = linecache.getline(self.current_file, self.current_line)
        print(f"Line {self.current_line}: {line.strip()}")  # Print the current line
        self.cmdqueue.append("next")  # Automatically add "next" to the command queue

# Example code to debug
code = """
x = 10
for i in range(3):
    x += i
print(x)
"""

def main():
    exec(code, globals())

# Setup AutoPDB instance
if __name__ == "__main__":
    import linecache
    debugger = AutoPDB()
    main()
