def max_subarray_sum(arr):
    max_sum = float('-inf')
    current_sum = 0

    def kadane_recursive(start):
        nonlocal max_sum, current_sum
        # print(f'start = {start}, arr[start] = {arr[start]}')
        print('max_sum', max_sum, 'current_sum', current_sum)

        if start == len(arr): 
            return max_sum

        current_sum = max(arr[start], current_sum + arr[start])
        max_sum = max(max_sum, current_sum)

        print(f'let\'s try the next element, {arr[start + 1]}!') # IndexError

        return kadane_recursive(start + 1)

    return kadane_recursive(0)

nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
print(max_subarray_sum(nums))

