def permute(nums):
    n = len(nums)
    permutations = []
    current_permutation = []
    def backtrack():
        if len(current_permutation) == n:
            permutations.append(current_permutation.copy())
            return
        for i in range(len(nums)):
            current_permutation.append(nums[i])
            used_num = nums.pop(i)
            backtrack()
            current_permutation.pop()
            nums.insert(i, used_num)
    backtrack()
    return permutations

permute([1, 2, 3])