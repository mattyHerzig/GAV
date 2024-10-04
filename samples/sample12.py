from copy import deepcopy

grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]

def numIslandsDfs(grid):
    ROWS, COLS = len(grid), len(grid[0])
    islandCount = 0
    def dfs(r, c):
        if not (0 <= r < ROWS and 0 <= c < COLS) or grid[r][c] == "0":
            return
        grid[r][c] = "0"
        dfs(r+1, c)
        dfs(r-1, c)
        dfs(r, c+1)
        dfs(r, c-1)
    for r in range(ROWS):
        for c in range(COLS):
            if grid[r][c] == "1":
                print('numIslandsDfs: island found at', r, c)
                islandCount += 1
                dfs(r, c)    
    return islandCount

print('numIslandsDfs island count:', numIslandsDfs(deepcopy(grid)))

def numIslandsBfs(grid):
    ROWS, COLS = len(grid), len(grid[0])
    islandCount = 0
    q = []
    for r in range(ROWS):
        for c in range(COLS):
            if grid[r][c] == "1":
                print('numIslandsBfs: island found at', r, c)
                islandCount += 1
                q.append((r, c))
                while q:
                    nr, nc = q.pop()
                    if not (0 <= nr < ROWS and 0 <= nc < COLS) or grid[nr][nc] == "0":
                        continue
                    grid[nr][nc] = "0"
                    q.append((nr+1, nc))
                    q.append((nr-1, nc))
                    q.append((nr, nc+1))
                    q.append((nr, nc-1))
    return islandCount

print('numIslandsBfs island count:', numIslandsBfs(deepcopy(grid)))