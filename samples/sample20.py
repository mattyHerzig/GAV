def count_elements(sequence):
    element_count = {}
    for element in sequence:
        if element in element_count:
            element_count[element] += 1
        else:
            element_count[element] = 1
    return element_count

sample_sequence = ['a', 'b', 'a', 'c', 'b', 'a', 'd', 'c']
counts = count_elements(sample_sequence)
print(counts)