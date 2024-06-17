
import pdb
x = 0
for i in range(5):
    x += i
    pdb.set_trace()  # Breakpoint
print('Final x:', x)
