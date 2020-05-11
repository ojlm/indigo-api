

nums = [2,7,11,15]

def find1(target):
    length = len(nums)
    for i in range(length):
        if target - nums[i] in nums:
            for j in range(length):
                if nums[j] == target - nums[i]:
                      return [i, j]

def find2(target):
    length = len(nums)
    for i in range(length):
        dem = target - nums[i]
        for j in range(i,length):
            if nums[j] == dem:
                return[i,j]



if __name__ == "__main__":
    print(find2(9))
