arrs_of_arrs = [[1, 2, 3], [4, 5, 6], [7, 8, [9, 10, 11]]]

for arr in arrs_of_arrs:
    for elem in arr:
        if isinstance(elem, list):
            for sub_elem in elem:
                print(sub_elem)
        else:
            print(elem)