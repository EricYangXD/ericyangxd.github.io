# print(str(123) + '123')
# print(123 + int('123'))
# print(123 + float('123.99'))
# print(2**2)

# arr=[1,2,3,4,5]

# for i in arr:
#   print(i)


# name = input('input name')
# print(name)


# name='Hela mdla'

# print(name[:4])

# [name[0],name[1]]=[name[1],name[0]]
# print(name[:4])

# scores = [1,2,3,4,5]

# print(scores[0:2])
# scores.pop()
# scores.append(6)
# print(scores)

# tuple元组，一旦创建不能新增修改删除
# scores = (1,2,3,4,5)
# print(scores[0])
# 函数默认返回的是 None

# def Hello():
#   print("Hello!")
#   print(999)


# Hello()

# score=100
# good=True
# if score==100 and good:
#   print("Good!")
# elif score>=80 or not(good):
#   print("Not bad!")
# elif score>=60:
#   print("It's ok!")
# else:
#   print("Bad")


# dic={'a':1,'b':2,'c':3,'d':4}
# print(dic['c'])

# i=5
# while i>0:
#   print("i="+str(i))
#   i-=1

# print(i)


# for num in range(5,10):
#   print(num)
# for num in [0,1,2,3,4]:
#   print(num)

# print(pow(2,5)==2**5)

# nums=[[1,2,3],[4,5,6],[7,8,9],[0]]

# for row in nums:
#   for col in row:
#     print(col)


# files  mode:r,w,a

# js=open("/Users/eric/workspace/my-blog/demos/js/tiny-compiler.js",mode="a",encoding="utf8")
# # js=open("../js/tiny-compiler.js",mode="r+")

# # print(js.readline())
# print(js.readlines())

# js.write('xxxx')


# js.close()

# # 不需要单独close
# with open("/Users/eric/workspace/my-blog/demos/js/tiny-compiler.js",mode="a",encoding="utf8") as file:
#   file.write("xxxxxxx")


# module: 不需要显示导出，直接import导入文件名即可：自定义、官方内建、第三方pip

# def my_module():
#   print("my_module")


# import tools

# name=tools.name

# print(name)


# class object

class Phone:
    def __init__(self, os, types, is_waterproof):
        self.os = os
        self.types = types
        self.is_waterproof = is_waterproof

    def is_ios(self):
        return self.os == 'ios'

    def say_name(self):
        print(self.os)
        return

    def show_types(self):
        print(self.types)
        return


p1 = Phone("android", 13, True)
p2 = Phone("ios", 15, True)
# print(p2.is_ios())

# 一种引入形式
# from tools import Question

# q = Question("abc")
# print(q.type)


class Shanzhaiji(Phone):
    def __init__(self, os, types, is_waterproof, brand, price):
        self.os = os
        self.types = types
        self.is_waterproof = is_waterproof
        self.brand = brand
        self.price = price
        # print(self.brand, self.price)

    def print_brand(self):
        print(self.brand)
        return

    def print_price(self):
        print(self.price)
        return


szj = Shanzhaiji('saiban', 18, True, 'xiaomi', 999)

print(szj.brand)
print(szj.print_brand())
print(szj.print_price())
print(szj.is_ios())
