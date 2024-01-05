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

1. enumerate()方法用于遍历 list/array：`for i,num in enumerate(list/array)`
2. in 同 js 的 in
3. range(start,end)：前闭后开
4. if/else/elif
5. 数组范围：`[start=0:end=length-1]`:前闭后开，可以是负数
6. class 定义类，可以继承
7. 通过 keys()/values()读取**字典**中的键/值，类似 js 的 map
8. `csv.DictReader(infile)`：可以把文件内容读取成字典，字典可以转化为 list
9. `csv.DictWriter(infile)`：把内容写入文件，`writer.writeHeader`/`writer.writeRow`用于写入标题 header 和行内容
10. 与：and，或：or，非：not
11. list/array：`append()`拼接一条数据
12. with：用于文件流，可以自动关闭文件的读取，as：给读取的文件内容赋一个变量名称
13. `len(list/array)`：获取长度
14. `socres=[int(num) for num in list[2:]]`：列表生成式，获取 list 第 2 个及之后的数字（从第 0 开始数），转换成 int 类型并生成一个新数组赋值给 scores，`float('1.23')`转换成浮点数
15. `sorted(list)`：列表升序排序；`sum(list)`：列表求和；`round(list,2)`：四舍五入保留 2 位小数；`'xx'.join(list)`：列表拼接；
16. `max/min(list)`：列表最大/最小值；`list.count(2)`：list 中含有几个 2；`avg(list)`：列表求均值；
17. 列表之间可以通过`+`拼接为一个列表
18. 继承：

```python
class Phone:
    def __init__(self, os, types, is_waterproof = True): # 默认参数
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

    @property # 装饰器
    def calcPro(self): # 计算属性
        return f"OS = {self.os} , types = {self.types}"

p1 = Phone("android", 13, True)
p2 = Phone("ios", 15, True)

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
```

### 读写文件

Python2 默认使用 ASCII 编码读取文件，所以如果是中文会有可能出现乱码，参考下面添加编码格式声明即可；Python3 默认使用 utf-8 格式，一般会正常显示中文。

1. 为了处理英文字符，产生了 ASCII 码。
2. 为了处理中文字符，产生了 GB2312。
3. 为了处理各国字符，产生了 Unicode。
4. 为了提高 Unicode 存储和传输性能，产生了 UTF-8，它是 Unicode 的一种实现形式。
5. with：修改文件时，可以自动关闭文件

```python
#!/usr/bin/python
# -*- coding: utf-8 -*-
# open()可以接受三个参数：文件路径；以什么模式打开文件mode:r,w,a；文件编码格式encoding="utf8"；
invoice = open('./invoice.txt').read().split()
lists = open('./lists.txt',mode='w',econding='utf8').read().split()

lists.write('123543');
```

- Python 为我们提供的两个转换编码的方法 decode()与 encode()。

1. decode()方法将其他编码字符转化为 Unicode 编码字符。
2. encode()方法将 Unicode 编码字符转化为其他编码字符。

- chardet 模块可以检测字符串编码，没有该模块的可以用`pip install chardet`安装。使用：`chardet.detect(变量)`

1. Python2 的对于字符编码的转换要以 unicode 作为“中间人”进行转化。
2. 知道自己系统的字符编码（Linux 默认 utf-8，Windows 默认 GB2312），对症下药。

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

如图，在 PyCharm 中安装`DB Navigator`插件之后，可以通过图中步骤链接已创建的 sqlite 数据库，Python3 默认自带 sqlite3，不必特殊声明直接import就行，然后就可以跟Java开发时链接MySQL一样，可以可视化操作DB了。

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

### urllib2

解析一个网页的 url，获取该网页的字符串。

### re

正则匹配字符串。

```python
import urllib2, re

html=urllib2.urlopen("https://www.163.com").read()
title=re.findall(r'<title>(.*?)</title>',html)[0]

unicode_title=title.decode('gb2312')
utf8_title=unicode_title.encode('utf-8')

print(utf8_title)
```

### csv

用于读写 Excel 表格文件。

```python
import csv

with open('myExcel.csv') as infile:
  # 读取并转换为list
  data=list(csv.DictReader(infile))
  for row in data:
    print('original',row['name'],row['city'],row['addr'])
    if row['city'][0]=='台':
      row['city']='臺'+row['city'][1:]
    if 'F' in row['addr']:
      row['addr']=row['addr'].replace('F','楼')
    print('updated',row['name'],row['city'],row['addr'])

with open('myExcel_new.csv','w',newline='') as outfile:
  writer=csv.DictWriter(outfile,fieldnames=data[0].keys())
  writer.writeHeader()
  for e in data:
    writer.writerow(e)
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
10.

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