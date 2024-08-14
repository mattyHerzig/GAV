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

adj_pairs = [
    ('a', ['b', 'c']),
    ('b', ['a', 'c']),
    ('c', ['a', 'b'])
]

adj = {}
for node, neighbors in adj_pairs:
    adj[node] = neighbors

visisted = set()

for node in adj:
    visisted.add(node)
    for neighbor in adj[node]:
        print(node, neighbor)
