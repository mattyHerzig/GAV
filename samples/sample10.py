from typing import List

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        numsMap = {}
        for i in range(len(nums)):
            complement = target - nums[i]
            if complement in numsMap:
                return [i, numsMap[complement]]
            numsMap[nums[i]] = i