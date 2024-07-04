x = 3
def f(x):
    if x == 0:
        return 0
    return f(x-1)
f(x)