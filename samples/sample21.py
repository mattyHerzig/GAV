arr = [1, 2, 3]
for i in range(len(arr)):
    print(arr[i])

import heapq
heap = [5, 3, 2]
heapq.heapify(heap)
print(heap)

stack = [1, 2, 3]
stack.append(4)
stack.pop()
print(stack)

grid = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
for i in range(len(grid)):
    for j in range(len(grid[0])):
        print(grid[i][j])

hsh = {1: 'one', 2: 'two', 3: 'three'}
print(hsh.items())

adj = {
    'A': ['B', 'C'],
    'B': ['A', 'C'],
    'C': ['A', 'B']
}
def dfs(node, visited):
    print(f'visited node {node}!')
    visited.add(node)
    for neighbor in adj[node]:
        if neighbor not in visited:
            dfs(neighbor, visited)
dfs('A', set())

from collections import deque
q = deque()
q.append(1)
q.append(2)
q.popleft()
print(q)
