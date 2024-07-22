def max_subarray_sum(arr):
    max_sum = float('-inf')
    current_sum = 0

    def kadane_recursive(start):
        # print(max_sum, current_sum)
        nonlocal max_sum, current_sum

        # or arr[start] in ('test', 'blah')
        if start == len(arr): 
            return max_sum

        current_sum = max(arr[start], current_sum + arr[start])
        max_sum = max(max_sum, current_sum)

        # if start == 0:
        #     arr.append('test')
        # elif start == len(arr) - 1:
        #     arr = ['blah']

        return kadane_recursive(start + 1)

    return kadane_recursive(0)

nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
print(max_subarray_sum(nums))

