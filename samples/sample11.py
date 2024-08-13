matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

for array in matrix:
    for element in array:
        print(element)

matrix.pop(0)

for array in matrix:
    for element in array:
        print(element)
