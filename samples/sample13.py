def test(nums):
    # nums.append(0)
    stack = []
    for i in range(len(nums)):
        while stack and nums[i] <= nums[stack[-1]]:
            stack.pop()
        print(nums[i])
        stack.append(i)
    return -1

test([1, 2, 3, 4, 5])
test([1, 3, 4, 3, 1])
test([6, 5, 6, 5, 8])