x = 3
def f(x):
    print('x:', x)
    if x == 0:
        return 0
    if x == 3:
        nums = [1, 2, 3]
        m = {1: 1, 2: 3}
        s = {4, 5, 7}
    return f(x-1)
f(x)