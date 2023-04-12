---
title: MySQL
author: EricYangXD
date: "2022-12-12"
meta:
  - name: keywords
    content: MySQL
---

## MySQL

### 安装

#### Centos7

在 CentOS 中默认安装有 MariaDB，这个是 MySQL 的分支，但为了需要，还是要在系统中安装 MySQL，而且安装完成之后可以直接覆盖掉 MariaDB。

1. 下载并安装 MySQL 官方的 Yum Repository
   - `wget -i -c http://dev.mysql.com/get/mysql57-community-release-el7-10.noarch.rpm`
   - 直接 yum 安装: `yum -y install mysql57-community-release-el7-10.noarch.rpm`
   - 安装 MySQL 服务器: `yum -y install mysql-community-server`
   - 如果报错，可能是因为安装包签名问题，运行:`rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022`
2. MySQL 数据库设置

   - 启动 MySQL: `systemctl start mysqld.service`
   - 查看 MySQL 运行状态: `systemctl status mysqld.service`
   - 要想进入 MySQL 还得先找出此时 root 用户的密码: `grep "password" /var/log/mysqld.log`
   - 进入数据库: `mysql -uroot -p`
   - 输入初始密码,MySQL 默认必须修改密码之后才能操作数据库: `ALTER USER 'root'@'localhost' IDENTIFIED BY 'new password';`,密码设置必须要大小写字母数字和特殊符号（`,/';:`等）,不然不能配置成功.

3. 开启 MySQL 的远程访问

   - 开启远程访问限制（注意：下面命令开启的 IP 是 192.168.0.1，如要开启所有的，用%代替 IP）:`grant all privileges on *.* to 'root'@'192.168.0.1' identified by 'password' with grant option;`
   - 再输入下面两行命令:`flush privileges;`,`exit`

4. 为 firewalld 添加开放端口

   - 添加 mysql 端口 3306 和 Tomcat 端口 8080:`firewall-cmd --zone=public --add-port=3306/tcp --permanent`
   - 添加 mysql 端口 3306 和 Tomcat 端口 8080:`firewall-cmd --zone=public --add-port=8080/tcp --permanent`
   - 重新载入:`firewall-cmd --reload`

5. 更改 mysql 的语言

   - 首先重新登录 mysql，然后输入`status`:可以看到，"Server/Db characterset"不是 utf-8，先退出 mysql，然后再到、etc 目录下的 my.cnf 文件下修改一下文件内容: `vi /etc/my.cnf`，新增四行代码：

   ```bash
     [client]
     default-character-set=utf8
     character-set-server=utf8
     collation-server=utf8_general_cli
   ```

   - 保存更改后的 my.cnf 文件后，重启下 mysql，然后输入 status 再次查看，"Server/Db characterset"已经是 utf-8。

6. 命令行启动：`mysql -h 192.168.0.124 -P 3306 -u root -p`，输入密码即可登录。

### Demos

[示例](../../../demos/mysql/mysql.sql)

### 基础

> MySQL 的数据都是保存在磁盘的，那具体是保存在哪个文件呢？MySQL 存储的行为是由存储引擎实现的，MySQL 支持多种存储引擎，不同的存储引擎保存的文件自然也不同。InnoDB 是我们常用的存储引擎，也是 MySQL 默认的存储引擎。

比如，有一个名为 my_test 的 database，该 database 里有一张名为 t_order 数据库表。进入 `/var/lib/mysql/my_test`(我的是`/usr/local/mysql-8.0.29-macos12-x86_64/lib`) 目录，看看里面有什么文件？`ls /var/lib/mysql/my_test`，可以看到，共有三个文件，这三个文件分别代表着：

- db.opt，用来存储当前数据库的默认字符集和字符校验规则。
- t_order.frm，t_order 的表结构会保存在这个文件。在 MySQL 中建立一张表都会生成一个.frm 文件，该文件是用来保存每个表的元数据信息的，主要包含表结构定义。
- t_order.ibd，t_order 的表数据会保存在这个文件。表数据既可以存在共享表空间文件（文件名：ibdata1）里，也可以存放在独占表空间文件（文件名：表名字.ibd，也称为独占表空间文件）。这个行为是由参数 innodb_file_per_table 控制的，若设置了参数 innodb_file_per_table 为 1，则会将存储的数据、索引等信息单独存储在一个独占表空间，从 MySQL 5.6.6 版本开始，它的默认值就是 1 了，因此从这个版本之后， MySQL 中每一张表的数据都存放在一个独立的 .idb 文件。

> 表空间文件的结构：

表空间由段（segment）、区（extent）、页（page）、行（row）组成

- 行（row）:数据库表中的记录都是按行（row）进行存放的，每行记录根据不同的行格式，有不同的存储结构。

- 页（page）:记录是按照行来存储的，但是数据库的读取并不以「行」为单位，否则一次读取（也就是一次 I/O 操作）只能处理一行数据，效率会非常低。因此，InnoDB 的数据是按「页」为单位来读写的，也就是说，当需要读一条记录的时候，并不是将这个行记录从磁盘读出来，而是以页为单位，将其整体读入内存。默认每个页的大小为 16KB，也就是最多能保证 16KB 的连续存储空间。页是 InnoDB 存储引擎磁盘管理的最小单元，意味着数据库每次读写都是以 16KB 为单位的，一次最少从磁盘中读取 16K 的内容到内存中，一次最少把内存中的 16K 内容刷新到磁盘中。页的类型有很多，常见的有数据页、undo 日志页、溢出页等等。数据表中的行记录是用「数据页」来管理的，即表中的记录存储在「数据页」里面。

- 区（extent）: InnoDB 存储引擎是用 B+ 树来组织数据的。B+ 树中每一层都是通过双向链表连接起来的，如果是以页为单位来分配存储空间，那么链表中相邻的两个页之间的物理位置并不是连续的，可能离得非常远，那么磁盘查询时就会有大量的随机 I/O，随机 I/O 是非常慢的。解决这个问题也很简单，就是让链表中相邻的页的物理位置也相邻，这样就可以使用顺序 I/O 了，那么在范围查询（扫描叶子节点）的时候性能就会很高。具体怎么解决:在表中数据量大的时候，为某个索引分配空间的时候就不再按照页为单位分配了，而是按照区（extent）为单位分配。每个区的大小为 1MB，对于 16KB 的页来说，连续的 64 个页会被划为一个区，这样就使得链表中相邻的页的物理位置也相邻，就能使用顺序 I/O 了。

- 段（segment）:表空间是由各个段（segment）组成的，段是由多个区（extent）组成的。段一般分为数据段、索引段和回滚段等。
  1. 索引段：存放 B + 树的非叶子节点的区的集合；
  2. 数据段：存放 B + 树的叶子节点的区的集合；
  3. 回滚段：存放的是回滚数据的区的集合，之前讲事务隔离的时候就介绍到了 MVCC 利用了回滚段实现了多版本查询数据。

> InnoDB 行格式有哪些？

- Redundant：Redundant 是很古老的行格式了， MySQL 5.0 版本之前用的行格式，现在基本没人用了。不是一种紧凑的行格式。
- Compact：Compact 是一种紧凑的行格式，设计的初衷就是为了让一个数据页中可以存放更多的行记录，从 MySQL 5.1 版本之后，行格式默认设置成 Compact。
- Dynamic/Compressed：Dynamic 和 Compressed 两个都是紧凑的行格式，它们的行格式都和 Compact 差不多，因为都是基于 Compact 改进一点东西。从 MySQL5.7 版本之后，默认使用 Dynamic 行格式。

> COMPACT 行格式长什么样？

![Compact 行格式](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/0f97ab9af2370bcf50758a29c59fb682.png)

可以看到，一条完整的记录分为「记录的额外信息」和「记录的真实数据」两个部分。

- 记录的额外信息包含 3 个部分：变长字段长度列表、NULL 值列表、记录头信息。

1. 变长字段长度列表

- `varchar(n)` 和 `char(n)` 的区别是: char 是定长的，varchar 是变长的，变长字段实际存储的数据的长度（大小）不固定的。所以，在存储数据的时候要把这些数据占用的字节数也存起来，存到「变长字段长度列表」里面，读取数据的时候才能根据这个「变长字段长度列表」去读取对应长度的数据。其他 TEXT、BLOB 等变长字段也是这么实现的。
- 变长字段的长度值会按照列的顺序**逆序存放**。
- **NULL 是不会存放在行格式中记录的真实数据部分里的**，所以「变长字段长度列表」里不需要保存值为 NULL 的变长字段的长度。

> 为什么「变长字段长度列表」的信息要按照逆序存放

主要是因为「记录头信息」中指向下一个记录的指针，指向的是下一条记录的「记录头信息」和「真实数据」之间的位置，这样的好处是向左读就是记录头信息，向右读就是真实数据，比较方便。

「变长字段长度列表」中的信息之所以要逆序存放，是因为这样可以使得位置靠前的记录的真实数据和数据对应的字段长度信息可以同时在一个 CPU Cache Line 中，这样就可以**提高 CPU Cache 的命中率**。

同样的道理， NULL 值列表的信息也需要逆序存放。

> 每个数据库表的行格式都有「变长字段字节数列表」吗？

当数据表没有变长字段的时候，比如全部都是 int 类型的字段，这时候表里的行格式就不会有「变长字段长度列表」了，因为没必要，不如去掉以节省空间。

所以「变长字段长度列表」只出现在数据表有变长字段的时候。

2. NULL 值列表:

表中的某些列可能会存储 NULL 值，如果把这些 NULL 值都放到记录的真实数据中会比较浪费空间，所以 Compact 行格式把这些值为 NULL 的列存储到 NULL 值列表中。

如果存在允许 NULL 值的列，则每个列对应一个二进制位（bit），二进制位按照列的顺序逆序排列。

- 二进制位的值为 1 时，代表该列的值为 NULL。
- 二进制位的值为 0 时，代表该列的值不为 NULL。

另外，NULL 值列表必须用整数个字节的位表示（1 字节 8 位），如果使用的二进制位个数不足整数个字节，则在字节的高位补 0。NULL 值列表也不是必须的。

当数据表的字段都定义成 NOT NULL 的时候，这时候表里的行格式就不会有 NULL 值列表了。所以在设计数据库表的时候，通常都是建议将字段设置为 NOT NULL，这样可以节省 1 字节的空间（NULL 值列表占用 1 字节空间）。

3. 记录头信息

记录头信息中包含的内容很多，这里说几个比较重要的：

- delete_mask ：标识此条数据是否被删除。从这里可以知道，我们执行 detele 删除记录的时候，并不会真正的删除记录，只是将这个记录的 delete_mask 标记为 1。
- next_record：下一条记录的位置。从这里可以知道，记录与记录之间是通过链表组织的。在前面我也提到了，指向的是下一条记录的「记录头信息」和「真实数据」之间的位置，这样的好处是向左读就是记录头信息，向右读就是真实数据，比较方便。
- record_type：表示当前记录的类型，0 表示普通记录，1 表示 B+树非叶子节点记录，2 表示最小记录，3 表示最大记录

> 记录的真实数据

记录真实数据部分除了我们定义的字段，还有三个隐藏字段，分别为：row_id、trx_id、roll_pointer。

- row_id

如果我们建表的时候指定了主键或者唯一约束列，那么就没有 row_id 隐藏字段了。如果既没有指定主键，又没有唯一约束，那么 InnoDB 就会为记录添加 row_id 隐藏字段。row_id 不是必需的，占用 6 个字节。

- trx_id

事务 id，表示这个数据是由哪个事务生成的。trx_id 是必需的，占用 6 个字节。

- roll_pointer

这条记录上一个版本的指针。roll_pointer 是必需的，占用 7 个字

我们存储字段类型为 varchar(n) 的数据时，其实分成了三个部分来存储：

- 真实数据
- 真实数据占用的字节数
- NULL 标识，如果不允许为 NULL，这部分不需要

如果有多个字段的话，要保证所有字段的长度 + 变长字段字节数列表所占用的字节数 + NULL 值列表所占用的字节数 <= 65535。

### 面试题记录

#### MySQL 的 NULL 值是怎么存放的？

MySQL 的 Compact 行格式中会用「NULL 值列表」来标记值为 NULL 的列，NULL 值并不会存储在行格式中的真实数据部分。

NULL 值列表会占用 1 字节空间，当表中所有字段都定义成 NOT NULL，行格式中就不会有 NULL 值列表，这样可节省 1 字节的空间。

#### MySQL 怎么知道 varchar(n) 实际占用数据的大小？

MySQL 的 Compact 行格式中会用「变长字段长度列表」存储变长字段实际占用的数据大小。

#### varchar(n) 中 n 最大取值为多少？

varchar(n) 字段类型的 n 代表的是最多存储的字符数量，那 n 最大能设置多少要考虑两个因素：

- 行格式中「变长字段长度列表」最大能表示多少字节？知道了这个才能知道，一行数据最大能存储多少字节的数据。
- 数据库表的字符集，确定了这个，才能知道 1 个字符占用多少字节。

一行记录最大能存储 65535 字节的数据，但是这个是包含「变长字段字节数列表所占用的字节数」和「NULL 值列表所占用的字节数」。

如果一张表只有一个 varchar(n) 字段，且允许为 NULL，字符集为 ascii。varchar(n) 中 n 最大取值为 65532。

- 「变长字段长度列表」占用的字节数最大不会超过 2 字节。行格式中「变长字段长度列表」有时候是占用 1 字节，有时候是占用 2 字节。

计算公式：65535 - 变长字段字节数列表所占用的字节数 - NULL 值列表所占用的字节数 = 65535 - 2 - 1 = 65532

#### 行溢出后，MySQL 是怎么处理的？

如果一个数据页存不了一条记录，InnoDB 存储引擎会自动将溢出的数据存放到「溢出页」中。

Compact 行格式针对行溢出的处理是这样的：当发生行溢出时，在记录的真实数据处只会保存该列的一部分数据，而把剩余的数据放在「溢出页」中，然后真实数据处用 20 字节存储指向溢出页的地址，从而可以找到剩余数据所在的页。

Compressed 和 Dynamic 这两种格式采用完全的行溢出方式，记录的真实数据处不会存储该列的一部分数据，只存储 20 个字节的指针来指向溢出页。而实际的数据都存储在溢出页中。

#### MVCC 机制

## 入门知识

### 服务管理

1. 查看mysql服务进程：`ps -ef | grep mysql`
2. service服务管理：`cp -a mysql.server /etc/rc.d/init.d/mysql`
3. 启动命令：`service mysql start`
4. 关闭命令：`service mysql stop`
5. 重新启动命令：`service mysql restart`
6. 查看状态命令：`service mysql status`
7. 登录管理： `ln -s /usr/local/mysql/bin/*  /bin`
8. 登录命令：`mysql -uroot -p`
9. 默认端口号：`3306`
10. 配置文件：`/etc/my.cnf`
11. 登录命令：`mysql -u用户 -p密码`
12. 退出命令：`exit;  quit;`

### 库表深入解析

1. 什么是库？顾名思义就是数据仓库的意思，存储着一定数据结构的数据，一个数据库中可能包含着若干个表，我们可以
通过数据库提供的多种方法来管理数据库里边的数据。本质上mysql数据库是一个关系型数据服务管理系统
2. 什么是表？我们所说的表就是数据表，每一张表是由行和列组成，每记录一条数据，数据表就增加一行。列是由字段名
与字段数据属性组成，我们称之列为字段，每一个字段有着多个属性。例如是否允许为空、长度、类型等等
3. 数据库：database
4. 数据表：table
5. 字段（列）：column
6. 行：row

## sql各类语句精讲

操作语句分为四类：
1. DDL 数据定义语言 (Data Definition Language) 例如：建库，建表
2. DML 数据操纵语言(Data Manipulation Language) 例如：对表中的数据进行增删改操作
3. DQL 数据查询语言(Data Query Language) 例如：对数据进行查询
4. DCL 数据控制语言(Data Control Language) 例如：对用户的权限进行设置


### DDL数据定义语言

#### 创建、查看以及使用/切换

1. 直接创建数据库 db1: `create database db1;`
2. 查看当前在哪个库里边: `select database();`
3. 进入库的操作: `use 库名;`
4. 判断是否存在，如果不存在则创建数据库 db2: `create database if not exists db2;`
5. 创建数据库并指定字符集为 gbk: `create database db3 default character set gbk;`
6. 查看某个库是什么字符集: `show create database XD;`
7. 查看当前mysql使用的字符集: `show variables like 'character%';`

#### 常用数据类型

1. 数据类型是指列、存储过程参数、表达式和局部变量的数据特征，它决定了数据的存储格式，代表了不同的信息类型。有一些数据是要存储为数字的，数字当中有些是要存储为整数、小数、日期型等...
2. mysql常见数据类型:

```text
<1>整数型
     类型      大小      范围（有符号）               范围（无符号unsigned）    用途
     TINYINT   1 字节    (-128，127)                (0，255)                 小整数值
     SMALLINT  2 字节    (-32768，32767)            (0，65535)               大整数值
     MEDIUMINT 3 字节    (-8388608，8388607)        (0，16777215)            大整数值
     INT       4 字节    (-2147483648，2147483647)  (0，4294967295)          大整数值
     BIGINT    8 字节     （）                       (0，2的64次方减1)        极大整数值
​
<2>浮点型
 FLOAT(m,d）  4 字节    单精度浮点型  备注：m代表总个数，d代表小数位个数
 DOUBLE(m,d） 8 字节    双精度浮点型  备注：m代表总个数，d代表小数位个数
 
 <3>定点型
 DECIMAL(m,d）    依赖于M和D的值    备注：m代表总个数，d代表小数位个数
 
 <4>字符串类型 
 类型          大小              用途
 CHAR          0-255字节         定长字符串
 VARCHAR       0-65535字节       变长字符串
 TINYTEXT      0-255字节         短文本字符串
 TEXT          0-65535字节       长文本数据
 MEDIUMTEXT    0-16777215字节    中等长度文本数据
 LONGTEXT      0-4294967295字节  极大文本数据
 
 char的优缺点：存取速度比varchar更快，但是比varchar更占用空间
 varchar的优缺点：比char省空间。但是存取速度没有char快
 
 <5>时间型
 数据类型    字节数            格式                    备注
 date        3                yyyy-MM-dd              存储日期值
 time        3                HH:mm:ss                存储时分秒
 year        1                yyyy                    存储年
 datetime    8                yyyy-MM-dd HH:mm:ss     存储日期+时间
 timestamp   4                yyyy-MM-dd HH:mm:ss     存储日期+时间，可作时间戳

```
3. eg.

```sql
create table test_time (
            date_value date,
            time_value time,
            year_value year,
            datetime_value datetime,
            timestamp_value timestamp
         ) engine = innodb charset = utf8;

insert into test_time values(now(), now(), now(), now(), now());
```

#### 创建表
1. 语法：
```sql
CREATE TABLE 表名 (
                  字段名1 字段类型1 约束条件1 说明1,
                  字段名2 字段类型2 约束条件2 说明2,
                  字段名3 字段类型3 约束条件3 说明3
                  );
create table 新表名 as select * from 旧表名 where 1=2;(注意：建议这种创建表的方式用于日常测试，因  为可能索引什么的会复制不过来)
create table 新表名 like 旧表名;

```
2. 约束条件：

```sql
comment         ----说明解释
not null        ----不为空
default         ----默认值
unsigned        ----无符号（即正数）
auto_increment  ----自增
zerofill        ----自动填充
unique key      ----唯一值
```

3. 创建sql

```sql
CREATE TABLE student (
                    id tinyint(5) zerofill auto_increment  not null comment '学生学号',
                    name varchar(20) default null comment '学生姓名',
                    age  tinyint  default null comment '学生年龄',
                    class varchar(20) default null comment '学生班级',
                    sex char(5) not null comment '学生性别',
                    unique key (id)
                    )engine=innodb charset=utf8;;
​
CREATE TABLE student (
                    id tinyint(5)  auto_increment  default null comment '学生学号',
                    name varchar(20) default null comment '学生姓名',
                    age  tinyint  default null comment '学生年龄',
                    class varchar(20) default null comment '学生班级',
                    sex char(5) not null comment '学生性别',
                    unique key (id)
                    )engine=innodb charset=utf8;;
```

#### 查看

- 查看数据库中的所有表：`show tables;`
- 查看表结构：`desc 表名;`
- 查看创建表的sql语句：`show create table 表名;`
- `\G` ：有结束sql语句的作用，还有把显示的数据纵向旋转90度
- `\g` ：有结束sql语句的作用

#### 查看

```sql

```
#### 查看

```sql

```

### DML数据操纵语言

```sql


```
### DQL数据查询语言

```sql


```
### DCL数据控制语言

```sql


```
### 
