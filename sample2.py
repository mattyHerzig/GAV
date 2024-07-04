x = 3
def f(x):
    if x == 0:
        return 0
    if x == 1:
        nums = [1, 2, 3]
    return f(x-1)
f(x)