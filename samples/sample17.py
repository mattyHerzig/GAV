# nums = [1,3,4,2,4,2]
nums = [53, 5, 123, 542, 75, 234, 8756, 5]
seen = set()
contains_duplicate = False
for n in nums:
    if n in seen:
        contains_duplicate = True
        break
    seen.add(n)
print(contains_duplicate)