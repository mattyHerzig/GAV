from random import randint

array1 = []
array2 = []
element_range = 1000

for _ in range(50):
    if randint(0, 1):
        if randint(0, 1):
            array1.append(randint(-element_range, element_range))
        else:
            array2.append(randint(-element_range, element_range))
    else:
        if randint(0, 1) and array1:
            array1.pop(randint(0, len(array1) - 1))
        elif array2:
            array2.pop(randint(0, len(array2) - 1))

print(array1, array2)