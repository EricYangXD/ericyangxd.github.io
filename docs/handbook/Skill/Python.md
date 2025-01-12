---
title: Learn Python
author: EricYangXD
date: "2022-07-24"
meta:
  - name: keywords
    content: Python3
---

## Python 学习笔记

### Zen of Python

```python
>>>import this
The Zen of Python, by Tim Peters
Beautiful is better than ugly.
Explicit is better than implicit.
Simple is better than complex.
Complex is better than complicated.
Flat is better than nested.
Sparse is better than dense.
Readability counts.
Special cases aren't special enough to break the rules.
Although practicality beats purity.
Errors should never pass silently.
Unless explicitly silenced.
In the face of ambiguity, refuse the temptation to guess.
There should be one-- and preferably only one --obvious way to do it.
Although that way may not be obvious at first unless you're Dutch.
Now is better than never.
Although never is often better than *right* now.
If the implementation is hard to explain, it's a bad idea.
If the implementation is easy to explain, it may be a good idea.
Namespaces are one honking great idea -- let's do more of those!
```

### api

1. `enumerate()`方法用于遍历 `list/array`：`for i,num in enumerate(list/array)`
2. `in` 同 js 的 `in`
3. `range(start,end)`：前闭后开
4. `if/else/elif`
5. 数组范围：`[start=0:end=length-1]`:前闭后开，可以是负数
6. class 定义类，可以继承
7. 通过 `keys()/values()`读取**字典**中的键/值，类似 js 的 `map`
8. `csv.DictReader(infile)`：可以把文件内容读取成字典，字典可以转化为 list
9. `csv.DictWriter(infile)`：把内容写入文件，`writer.writeHeader`/`writer.writeRow`用于写入标题 header 和行内容
10. 与：`and`，或：`or`，非：`not`
11. list/array：`append()`拼接一条数据
12. `with`：用于文件流，可以自动关闭文件的读取，as：给读取的文件内容赋一个变量名称
13. `len(list/array)`：获取长度
14. `socres=[int(num) for num in list[2:]]`：列表生成式，获取 list 第 2 个及之后的数字（从第 0 开始数），转换成 int 类型并生成一个新数组赋值给 scores，`float('1.23')`转换成浮点数
15. `sorted(list)`：列表升序排序；`sum(list)`：列表求和；`round(list,2)`：四舍五入保留 2 位小数；`'xx'.join(list)`：列表拼接；
16. `max/min(list)`：列表最大/最小值；`list.count(2)`：list 中含有几个 2；`avg(list)`：列表求均值；
17. 列表之间可以通过`+`拼接为一个列表
18. `random.choice([])`
19. `raise`：抛出异常；`try/except`：捕获异常；`finally`：无论是否有异常都执行；`assert`：断言，用于测试；`with`：用于文件流，可以自动关闭文件的读取，as：给读取的文件内容赋一个变量名称；`@property`：装饰器，用于定义 getter 和 setter；`@classmethod`：装饰器，用于定义类方法；`@staticmethod`：装饰器，用于定义静态方法；
20. 继承：

```python
class Phone:
    times = 3

    def print_n(self):
        for _ in range(Phone.times):
            print("meow")

    # __init__类似构造函数，self代表当前对象，可以给对象赋值
    def __init__(self, os, types, is_waterproof = True): # 默认参数
        self.os = os
        self.types = types
        self.is_waterproof = is_waterproof
        self._balance = 0

    # 类方法
    @classmethod
    def from_dict(cls, dict):
        return cls(dict['os'], dict['types'], dict['is_waterproof'])

    # 静态方法
    @staticmethod
    def say_hello():
        print("Hello")
        return

    # 静态属性
    @staticmethod
    def version():
        return "1.0"

    # 实例方法
    def is_ios(self):
        return self.os == 'ios'

    def say_name(self):
        print(self.os)
        return

    def show_types(self):
        print(self.types)
        return

    # 在class中，一种比较好的在类方法之间共用公共属性的方法就是使用计算属性
    @property
    def balance(self):
        return self._balance

    def deposit(self, n):
        self._balance += n

    def withdraw(self, n):
        self._balance -= n

    # 装饰器  getter
    @property
    def calcPro(self): # 计算属性
        return f"OS = {self._os}, types = {self._types}"

    # setter 可以加_来区分私有属性
    @calcPro.setter
    def calcPro(self, value):
        self._os, self._types = value.split(',')
        return

p1 = Phone("android", 13, True)
print(p1.calcPro)
p2 = Phone("ios", 15, True)
p3 = Phone.from_dict({'os': 'android', 'types': 18, 'is_waterproof': False})
# 继承
class Shanzhaiji(Phone):
    def __init__(self, os, types, is_waterproof, brand, price):
        super().__init__(os, types, is_waterproof)
        # self.os = os
        # self.types = types
        # self.is_waterproof = is_waterproof
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

# 对于global的属性，函数中只能读取，不能直接修改，需要通过global声明
global_var = 10

def test(x, y):
    '''
    多行注释示例：这是一个测试函数
    :param x: number
    :param y: number
    :return: None
    '''
    global global_var
    global_var = 20
    print(global_var)

test()
print(global_var)

def square(n):
    return n*n

def test_square():
    try:
        assert square(3) == 9
    except AssertionError:
        print("3 squared was not 9")

if __name__ == "__main__":
    test_square()
```

21. `if __name__ == "__main__": xxx`: 用于判断当前的模块是被直接运行还是被导入到其他模块中。如果模块被直接运行，则`__name__`变量的值会被设置为`"__main__"`。如果模块是被导入的，`__name__`的值将是模块的名字。使得模块既可以被执行也可以被导入而不触发主执行代码，增加了代码的可重用性。
22. 类型提示：`number: int = input("Number: ")`，`def meow(n: int) -> None: xxx`
23. 多行注释：`""" xxx """`单双不限
24. `argparse`库：在命令行直接执行`.py`文件时，可以通过`argparse`库来传递参数，`parser = argparse.ArgumentParser(description=xxx)`，`parser.add_argument("xxx", default=xx, type=int, help="xxx")`，`args = parser.parse_args()`，`args.xxx`获取参数值
25. `unpacking`即把 list 或 dict 解包成一个个元素：`test(*my_list)`，`test(**my_dict)`
26. `*args`：可变参数，接收任意多个参数，返回一个 tuple；`**kwargs`：关键字参数，接收任意多个参数，返回一个 dict
27. `lambda`：匿名函数，`lambda x: x+1`，`lambda x,y: x+y`
28. `print(*my_list)`：打印 list 中的每个元素，不用遍历
29. `map(func, list)`：对 list 中的每个元素执行 func 函数，返回一个新的 list
30. `list comprehension`：列表生成式，`[x for x in range(10)]`，`[x for x in range(10) if x % 2 == 0]`，`[x+y for x in range(10) for y in range(10)]`
31. `dictionary comprehension`：字典生成式，`{x: x+1 for x in range(10)}`
32. `set comprehension`：集合生成式，`{x for x in range(10)}`
33. `enumerate(list)`：遍历 list，返回一个 tuple，第一个元素是 index，第二个元素是 list 中的元素
34. `generators`：生成器，`[x for x in range(10)]`是一个 list，`(x for x in range(10))`是一个生成器，可以通过`next()`方法来获取下一个元素，也可以通过`for`循环来遍历，`yield`关键字用于生成器函数中，用于返回一个值，但是不会终止函数的执行，而是暂停函数的执行，下次调用`next()`方法时，会从上次暂停的位置继续执行
35. `iterators`：迭代器，`iter(list)`可以获取到一个迭代器，通过`next()`方法获取下一个元素，也可以通过`for`循环来遍历，`yield`关键字用于生成器函数中，用于返回一个值，但是不会终止函数的执行，而是暂停函数的执行，下次调用`next()`方法时，会从上次暂停的位置继续执行，`itertools`可以帮助我们快速生成迭代器。
36. `itertools`：迭代工具库，`from itertools import count, cycle, repeat, accumulate, chain, compress, dropwhile, filterfalse, groupby, islice, permutations, product, takewhile, tee, zip_longest`
37.

### 读写文件

Python2 默认使用 ASCII 编码读取文件，所以如果是中文会有可能出现乱码，参考下面添加编码格式声明即可；Python3 默认使用 utf-8 格式，一般会正常显示中文。

1. 为了处理英文字符，产生了 ASCII 码。
2. 为了处理中文字符，产生了 GB2312。
3. 为了处理各国字符，产生了 Unicode。
4. 为了提高 Unicode 存储和传输性能，产生了 UTF-8，它是 Unicode 的一种实现形式。
5. with：修改文件时，可以自动关闭文件
6. 通过 with 以自定义 class 的形式访问文件时，自定义 class 中需要有`__enter__()`和`__exit__()`方法，`__enter__()`方法在 with 语句开始时执行，`__exit__()`方法在 with 语句结束时执行。

```python
#!/usr/bin/python
# -*- coding: utf-8 -*-
# open()可以接受三个参数：文件路径；以什么模式打开文件mode:r,w,a；文件编码格式encoding="utf8"；
invoice = open('./invoice.txt').read().split()
lists = open('./lists.txt', mode='w', econding='utf8').read().split()

lists.write('123543\n')
lists.close()

# or
with open('./invoice.txt', 'a') as file:
  data = file.readLines()
  print(data)
```

- Python 为我们提供的两个转换编码的方法 decode()与 encode()。

1. decode()方法将其他编码字符转化为 Unicode 编码字符。
2. encode()方法将 Unicode 编码字符转化为其他编码字符。

- chardet 模块可以检测字符串编码，没有该模块的可以用`pip install chardet`安装。使用：`chardet.detect(变量)`

1. Python2 的对于字符编码的转换要以 unicode 作为“中间人”进行转化。
2. 知道自己系统的字符编码（Linux 默认 utf-8，Windows 默认 GB2312），对症下药。

### File I/O

1. `file = open("filePath+fileName, "mode读写格式", "econding文件格式")`: 获取到字符串或者 buffer
2. `with open('./invoice.txt', 'a') as file: xxx`
3. `lines = file.readLines()`
4. `line.rstrip().split(",").join("-").xxx`
5. `a,b,c = line.rstrip().split(",")`: 赋值解析
6. `sorted(list, key='xx', reverse=false)` 和 `list.sort()`: 不同！
7. `writer = csv.DictWriter(file)`
8. `writer.writerow({"name":name,"age":age})`:通过 csv 库，写入文件

### 连接数据库

安装`pip install mysql-connector-python`库。示例如下：

```python
import mysql.connector

connection=mysql.connector.connect(host='localhost',port='3306',user='root',passwd='11111111',database='qq')

cursor=connection.cursor()

# cursor.execute("CREATE DATABASE `qq`;")
# cursor.execute("DROP DATABASE `qq`;")

# cursor.execute("SHOW DATABASES;")

# records=cursor.fetchall()

# for r in records:
#   print(r)

# cursor.execute("USE `qq`;")
# cursor.execute("DROP TABLE IF EXISTS `qq_test`;")

# cursor.execute("CREATE TABLE `qq_test`(`name` VARCHAR(20) PRIMARY KEY, `age` INT, `gender` VARCHAR(1));")

# cursor.execute("INSERT INTO `qq_test` VALUES('Eric',30,'M');")
# cursor.execute("INSERT INTO `qq_test` VALUES('John',20,'M');")
# cursor.execute("INSERT INTO `qq_test` VALUES('Mary',26,'F');")

cursor.execute("SELECT * FROM `qq_test`;")
records=cursor.fetchall()

for r in records:
  print(r)

cursor.close()

# 插入删除等操作需要下面这一步才能生效
connection.commit()

connection.close()
```

#### sqlite

如图，在 PyCharm 中安装`DB Navigator`插件之后，可以通过图中步骤链接已创建的 sqlite 数据库，Python3 默认自带 sqlite3，不必特殊声明直接 import 就行，然后就可以跟 Java 开发时链接 MySQL 一样，可以可视化操作 DB 了。

![steps](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202401030958025.png)

```python
import sqlite3

# 连接到SQLite数据库
conn = sqlite3.connect('your_database.db')

# 创建一个游标对象
cursor = conn.cursor()

# 执行SQL语句
cursor.execute('SELECT * FROM your_table')
conn.commit()
# 获取查询结果
result = cursor.fetchall()

# 关闭游标和连接
cursor.close()
conn.close()
```

## 常见模块及用途用法

### random

### mmap

### sys

### json

### os

### time

### datetime

### hashlib

### base64

```python
import base64

with open("path/to/your/image.jpg", "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read())
    print(encoded_string.decode('utf-8'))
```

### subprocess

### threading

### multiprocessing

### queue

### logging

### argparse

### traceback

### functools

### itertools

### math

### decimal

### statistics

### urllib

### pyttsx3

### pyaudio

### pillow

### requests

在爬虫中发送网络请求

```python
import requests

# 找一些免费的代理ip
proxies = [
  {'http':'xxx'},
  {'http':'xxx'},
  {'http':'xxx'},
  ...
]

def main():
  headers = {"User-Agent":"xxx", ...} # cookie等也可以加进来
  res = requests.get(url, headers = headers, proxies = proxies[0])
  print(res.status_code)
  print(res.content.toString())
  print(res.content.decode())
```

### selenium

自动化爬虫工具，本质是个浏览器，占用资源多。同类还有 PhantomJs。

可以执行 js 代码！-- `driver.execute_script( "window.scrollTo( 0, document.body.scrollHeight);"）`，这样就可以模拟网页滚动，进而可以爬取到一些懒加载的内容。这种适用于整个页面可以滚动的情况。对于页面中有部分区域可以滚动的情况参考下面：iframe 或者某个 content 区域滚动的情况：

```python
from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.actions.wheel_input import ScrollOrigin

iframe = driver.find_element(By.TAG_NAME, 'iframe')
scroll_origin = ScrollOrigin.from_element(iframe)
ActionChains(driver).scroll_from_origin(scroll_origin, 0 , 200).perform()

# 或者
from selenium.webdriver import ActionChains, Keys
ActionChains(driver).send_keys(Keys.PAGE_DOWN).perform()
```

```python
from selenium import webdriver

config = {
  "USERNAME": "user_name",
  "PASSWORD": "password"
}
loginUrl = "xxx"

def main():
  driver = webdriver.Chrome("./chromedriver")
  driver.get(loginUrl)
  assert 'SpringServe' in driver.title
  elem = driver.find_element_by_name("user[email]")
  elem.clear()
  elem.send_keys(config["USERNAME"])
  elem.send_keys(config["PASSWORD"])
  elem = driver.find_element_by_name("user[password]")
  elem.clear()
  elem.send_keys(config["PASSWORD"])
  elem.send_keys(Keys.RETURN)
  time.sleep(5)
  print(driver.page_source)
  driver.quit()
```

### urllib2

解析一个网页的 url，获取该网页的字符串。

### time

```python
from time import sleep

sleep(1)
```

### re

正则匹配字符串。正则的规则基本都是相同的。

```python
import urllib2, re

name = input("Please enter the name: ").strip()
matches = re.search(r"^(.*), (.*)$", name)
if matches:
    last, first = matches.groups()
    name = f"{first} {last}"
url = input("Please enter the URL: ").strip()
username = re.sub(r"^https://x.com/u/", "", url)
html = urllib2.urlopen("https://www.163.com").read()
title = re.findall(r'<title>(.*?)</title>', html)[0]

unicode_title = title.decode('gb2312')
utf8_title = unicode_title.encode('utf-8')

print(utf8_title)
```

### csv

用于读写 Excel 表格文件。

```python
import csv

with open('myExcel.csv') as infile:
  # 读取并转换为list
  data = list(csv.DictReader(infile))
  for row in data:
    print('original', row['name'], row['city'], row['addr'])
    if row['city'][0] == '台':
      row['city'] = '臺' + row['city'][1:]
    if 'F' in row['addr']:
      row['addr'] = row['addr'].replace('F', '楼')
    print('updated', row['name'], row['city'], row['addr'])

with open('myExcel_new.csv', 'w', newline = '') as outfile:
  writer = csv.DictWriter(outfile, fieldnames = data[0].keys())
  writer.writeHeader()
  for e in data:
    writer.writerow(e)
    writer.writerow({'name': 'Eric', 'city': 'Shanghai', 'addr': 'Pudong'})
```

### collections

工具函数库？`from collections import Counter`

1. Counter 计数器：统计一个 list 中某个值出现的次数：相当于生成了一个 js 的 map 或者 obj。可以手动修改。

```python
cnt=Counter([1,2,3,4,4,4,5])
# cnt => Counter({1:1, 2:1, 3:1, 4:3, 5:1})
print(cnt[4])  # 3
# 出现次数最高的前一个的
print(cnt.most_common(1)) #  4

counts=Counter([e['name'] for e in results]) # 统计results中各个name出现的次数
```

### matplotlib

画图工具库。

```python
# 安装先：pip install matplotlib
import  matplotlib.pyplot as plt
data=[['Tom',10,98,93,89,70,100,99],['Som',10,48,93,89,60,90,99],['Pom',10,88,93,89,77,100,89]]
captions=['name','a','b','c','d','e','f','g']

for stu in data:
  name = stu[0]
  scores=stu[1:]
  plt.clf() # 设定全新图表
  plt.plot(scores,marker='o',label='my score') # 画几条线就写几个，但是需要区分label，还可设定color，linewidth等
  # plt.plot(avg_scores,marker='x',label='avg score') # 画几条线就写几个，但是需要区分label
  plt.title(name) # 图标的名称
  plt.xticks(range(len(scores)),captions[1:]) # x轴有几项，及对应的text
  plt.xlabel('Items') # x轴名称
  plt.ylabel('Scores') # y轴名称
  plt.ylim(0,120) # y轴范围
  plt.tight_layout() # 控制图表不要超出文档contain
  plt.savefig(name+'.png') # 保存图片名+格式
  plt.show()
```

### pickle

Python 中一个用于序列化和反序列化对象结构的模块。序列化（又称为持久化或扁平化）过程是指将一个 Python 对象结构转换为一个字节流，以便将其保存到一个文件或数据库中，或通过网络传输到另一个远程机器。

```python
import pickle

with open('example.pkl', 'wb') as f:
    pickle.dump(obj, f)
with open('example.pkl', 'rb') as f:
    obj = pickle.load(f)
```

### flask

### BeautifulSoup

### pandas

用法：先构造一个 DataFrame 类型的数据，然后对 DataFrame 进行各种操作，比如筛选、排序、分组、聚合等。然后可以生成 Excel 文件。

```python
import pandas as pd

info = {
  'name':["Eric","jack","Lily"], #// 每一列column
  'gender':["M","M","F"],
  'age':[32,44,18]
}

data = pd.DataFrame(info)
print(data) # 类似excel的表格
data.to_excel("./users.xlsx", index=False) # 生成Excel文件
```

爬取完整数据包括详情页电影简介：

```python
import requests
from bs4 import BeautifulSoup as bs4
import pandas as pd

headers = {
  "Referer":"https://ssr1.scrape.center/",
  "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
}

movie_info = {
  "电影名称":[],
  "电影类型":[],
  "拍摄国家":[],
  "上映时间":[],
  "电影时长":[],
  "电影评分":[],
  "电影详情":[],
}

# 下载电影海报图片
# url = "https://p1.meituan.net/movie/6bea9af4524dfbd0b668eaa7e187c3df767253.jpg@464w_644h_1e_1c"
# response = requests.get(url, headers = headers)
# with open("./bwbj.jpg", "wb") as img:
#   img.write(response.content)


for page in range(1, 11):
  url = f"https://ssr1.scrape.center/page/{page}"
  response = requests.get(url, headers= headers)
  soup = bs4(response.text, "html.parser")
  results = soup.find_all(name="div", class_="p-h el-col el-col-24 el-col-xs-9 el-col-sm-13 el-col-md-16")

  for i in range(len(results)):
    name =results[i].h2.text
    movie_info["电影名称"].append(name)

    # 电影类型
    btns = results[i].find_all(name = "button", class_="el-button category el-button--primary el-button--mini")
    movie_type = ""
    for btn in btns:
      movie_type+=btn.span.text + ","
    movie_info["电影类型"].append(movie_type)

    #电影时长和国家
    infos = results[i].find_all(name="div", class_="m-v-sm info")

    span_list = infos[0].find_all(name="span")
    movie_info["拍摄国家"].append(span_list[0].text)
    movie_info["电影时长"].append(span_list[2].text)

    # 处理空值
    span_list = infos[1].find_all(name="span")
    if len(span_list)>0:
      movie_info["上映时间"].append(span_list[0].text)
    else:
      movie_info["上映时间"].append('')

    # 电影评分
    score = soup.find_all(name="p", class_="score m-t-md m-b-n-sm")
    movie_info["电影评分"].append(score[0].text.strip())

    headers = {
      "Referer":f"https://ssr1.scrape.center/page/{i}",
      "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    }

    # 获取detail path，拼接url
    path = results[i].a['href']
    url = f"https://ssr1.scrape.center{path}"  # 获取电影的详情简介

    response = requests.get(url, headers= headers)
    soup = bs4(response.text, "html.parser")
    detail = soup.find_all(name="div", class_ ="drama")
    movie_info["电影详情"].append(detail[0].p.text.strip())


data = pd.DataFrame(movie_info)
print(data) # 类似excel的表格
data.to_excel("./users.xlsx", index=False) # 生成Excel文件：index=False不带序号
```

### 下载视频

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
HEADERS = {
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
    "referer": "https://passport.weibo.com/visitor/visitor?entry=miniblog&a=enter&url=https%3A%2F%2Fweibo.com%2Ftv%2Fv%2FI9cdSBVBP&domain=.weibo.com&ua=php-sso_sdk_client-0.6.28&_rand=1569807841.8018"
}
def parse_weibo_video(url):
    option = webdriver.ChromeOptions()
    option.add_argument('headless')
    driver = webdriver.Chrome(executable_path="/path/to/chromedriver", chrome_options=option)
    driver.get(url)
    try:
      # 这里的参数 url 就是微博视频的网页的链接，比如说 https://www.weibo.com/tv/v/In7Oce2uO ，代码中使用 Chrome 无头浏览器来模拟正常用户浏览页面时的加载过程。下面这句代码是获取视频链接的核心
        element = WebDriverWait(driver, 60).until(
            EC.presence_of_element_located((By.TAG_NAME, "video"))
        )
        user = WebDriverWait(driver, 60).until(
            EC.presence_of_element_located((By.XPATH, "//div[@class='player_info']//div[@class='clearfix']/a/span"))
        )
        return element.get_property("src"), user.text
    finally:
        driver.quit()
```

### 编码格式

Python 默认使用了 ASCII ，而中文并不包含在 ASCII 码范围内，要改成 `UTF-8`。就是在 Python 文件的开头加入这一行:`# -*- coding:utf-8 -*-`

### builtins

1. 内置函数：`print(__builtins__)`
2. `isinstance(obj, type)`：判断 obj 是否是 type 类型，返回布尔值
3. `dir(obj)`：查看对象的所有属性和方法
4. `with`：用于 open 文件时，不再需要手动 close 文件
5. `from string import Template`：内置的轻量级模板字符串工具
6. CGI 模块：通用网关接口，允许 web 服务器运行一个服务器端程序
7. `cgi.FieldStorage()`：访问发给 web 请求中的数据，如 form 中的数据，通过 key-value 的形式取值
8. `http.server`：顾名思义
9. `glob` 模块用于查找符合特定规则的文件路径名，`for filename in glob.glob('*.txt'):`会查找到当前目录下所有扩展名为 `.txt` 的文件，`glob.iglob('*.txt'):`返回的是一个迭代器，适用于处理大量的文件，因为它不会一次性加载所有结果到内存中。glob 模块非常适合于需要文件名匹配的脚本和程序。它简单易用，但不具备递归查找目录的能力，对于复杂的文件查找需求，可能需要使用 os 模块的功能或是第三方库如 `scandir`。

### http demo

```python
from http.server import HTTPServer, CGIHTTPRequestHandler

port = 8080

httpd = HTTPServer(('127.0.0.1', port), CGIHTTPRequestHandler)
print("Starting simple_httpd on port: " + str(httpd.server_port))
httpd.serve_forever()

# 只需在同层级目录下准备一个index.html即可通过浏览器访问
```

### log 日志打印

#### web 开发

```python
# 1. 使用 cgitb 模块：这是一个用于Web应用程序的CGI脚本的调试工具，它可以在浏览器中显示详细的错误报告。
import cgitb
cgitb.enable()

# 2. 打印到浏览器：
print(yate.start_response())
print("Debug info: {}".format(repr(athletes)))

# 3. 写入日志文件，注意路径
with open('/tmp/debug.log', 'a') as debug_log:
    print(str(athletes), file=debug_log)
    print(str(form_data), file=debug_log)

# 4. 使用Python的 logging 模块
import logging
logging.basicConfig(filename='/tmp/debug.log', level=logging.DEBUG)
logging.debug(athletes)
logging.debug(form_data)

# 5. 使用断点：如果你在一个支持CGI调试的IDE（如PyCharm）中工作，你可以设置断点来暂停执行并检查变量的状态。
```

### Unit Test

1. `pip3 install pytest`: 库
2. `assert`: 断言
3. `pytest my_funs.py`: 直接写测试用例，不需要额外单独执行
4. `with pytest.raises(TypeError): xxx`: 输入参数类型错误的测试用例
5. 直接创建`test`目录并在下面创建`__init__.py`空文件即可，可以一次性执行该目录下的所有测试文件

## 爬虫

### 基本概念

访问网站获取网页数据，解析网页数据，提取有用信息，存储数据，为消费者提供数据接口。

### Scrape

[免费爬虫练习网站](https://scrape.center/)

### 源

`pip install abc -i https://pypi.org/simple`

### 练习示例

#### 爬取 Scrape 的电影信息页

`url = "https:// ssr1.scrape.center/"`

1. 首先要打开这个网址
2. 查看网页的接口请求，找到具体的接口请求，找到具体的接口地址，例如：`https://ssr1.scrape.center/api/movie?start=0&limit=10`
3. 使用 `requests` 库发送请求，获取网页数据
4. 发送请求时可以模拟真实的请求头，比如添加 User-Agent 信息等
5. 解析网页数据，提取有用信息
6. 存储数据

```python
# 爬取10个电影信息
import requests
from bs4 import BeautifulSoup as bs4

headers = {
  "Referer":"https://ssr1.scrape.center/",
  "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
}

url1 = "https://p1.meituan.net/movie/6bea9af4524dfbd0b668eaa7e187c3df767253.jpg@464w_644h_1e_1c"

# response = requests.get(url1, headers = headers)
# with open("./bwbj.jpg", "wb") as img:
#   img.write(response.content)

url = "https://ssr1.scrape.center/"

response = requests.get(url, headers= headers)

soup = bs4(response.text, "html.parser")

results = soup.find_all(name="div", class_="p-h el-col el-col-24 el-col-xs-9 el-col-sm-13 el-col-md-16")

for result in results:
  name =result.h2.text
  print(f"电影名：{result.h2.text}") # 获取第一个电影的名称

  btns = result.find_all(name = "button", class_="el-button category el-button--primary el-button--mini")
  for btn in btns:
    print(btn.span.text)

  infos = result.find_all(name="div", class_="m-v-sm info")

  for info in infos:
    spans = info.find_all(name="span")
    for span in spans:
      if(span.text != ' / ' ):
        print(span.text)

  score = soup.find_all(name="p", class_="score m-t-md m-b-n-sm")
  print(score[0].text.strip())
  print("++++++++++++++分割线++++++++++++++")

```

分页：

```python
# ...
for page in range(1,11):
  url = f"https://ssr1.scrape.center/page/{page}"
  response = requests.get(url, headers= headers)
  soup = bs4(response.text, "html.parser")
  results = soup.find_all(name="div", class_="p-h el-col el-col-24 el-col-xs-9 el-col-sm-13 el-col-md-16")

  for result in results:
    name =result.h2.text
    print(f"电影名：{result.h2.text}") # 获取第一个电影的名称

    btns = result.find_all(name = "button", class_="el-button category el-button--primary el-button--mini")
    for btn in btns:
      print(btn.span.text)

    infos = result.find_all(name="div", class_="m-v-sm info")

    for info in infos:
      spans = info.find_all(name="span")
      for span in spans:
        if(span.text != ' / ' ):
          print(span.text)

    score = soup.find_all(name="p", class_="score m-t-md m-b-n-sm")
    print(score[0].text.strip())
    print("++++++++++++++分割线++++++++++++++")
```

请求详情页面：

```python


```

## 面向对象编程

### 类-class

1. `raise ValueError('Invalid value for radius')`：抛出异常
2. `__init__()`：构造函数，在创建对象时自动调用，用于初始化对象属性
3. `__str__()`：类似于 Java 中的 toString()，用于打印对象时显示的内容
4. `__repr__()`：类似于 Java 中的 toString()，用于打印对象时显示的内容
5. `__eq__()`：类似于 Java 中的 equals()，用于判断两个对象是否相等
6. `__lt__()`：类似于 Java 中的 compareTo()，用于判断两个对象的大小
7. `__add__()`：类似于 Java 中的 +，用于两个对象相加
8. `__len__()`：类似于 Java 中的 length()，用于获取对象的长度
9. `__getitem__()`：类似于 Java 中的 get()，用于获取对象的某个属性或方法的值
10. `__setitem__()`：类似于 Java 中的 set()，用于设置对象的某个属性或方法的值
11. `__delitem__()`：类似于 Java 中的 remove()，用于删除对象的某个属性或方法的值
12. `__getattr__()`：类似于 Java 中的 getAttribute()，用于获取对象的某个属性或方法的值，如果不存在，则会调用 `__getattribute__()`
13. `__setattr__()`：类似于 Java 中的 setAttribute()，用于设置对象的某个属性或方法的值，如果不存在，则会调用 `__setattr__()`
14. `__delattr__()`：类似于 Java 中的 removeAttribute()，用于删除对象的某个属性或方法的值，如果不存在，则会调用 `__delattr__()`
15. `__call__()`：类似于 Java 中的 invoke()，用于调用对象的某个方法
16. `__enter__()`：类似于 Java 中的 try-with-resources，用于在 with 语句中进入上下文管理器
17. `__exit__()`：类似于 Java 中的 try-with-resources，用于在 with 语句中退出上下文管理器
18. `__getattribute__()`：类似于 Java 中的 getAttribute()，用于获取对象的某个属性或方法的值，如果不存在，则会调用 `__getattr__()`，如果存在，则会调用 `__getattribute__()`，如果想要避免无限递归，可以使用 `super().__getattribute__(name)` 来获取属性或方法的值
19. `__dir__()`：类似于 Java 中的 getMethods() 和 getFields()，用于获取对象的所有属性和方法
20. `__iter__()`：类似于 Java 中的 iterator()，用于获取对象的迭代器
21. `__next__()`：类似于 Java 中的 next()，用于获取对象的下一个值
22. `__reversed__()`：类似于 Java 中的 reverse()，用于获取对象的逆序迭代器
23. `__bool__()`：类似于 Java 中的 booleanValue()，用于获取对象的布尔值

```python




```
