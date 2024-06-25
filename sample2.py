def containsDuplicate(nums):
    nums.sort()
    for i in range(len(nums)-1):
        if nums[i] == nums[i+1]:
            return True
    return False

nums = [3, 2, 1, 4, 5, 6, 6]
print(containsDuplicate(nums[:]))
