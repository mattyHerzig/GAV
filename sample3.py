x = 3
y = 1
def f(x):
    if x == 0:
        global y
        y = 2
        print(y)
        return 0
    return f(x-1)
f(x)