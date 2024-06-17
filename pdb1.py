import pdb

def test_debugger(x):
    for i in range(5):
        x += i
        pdb.set_trace()  # Breakpoint
        print(x)

test_debugger(10)
