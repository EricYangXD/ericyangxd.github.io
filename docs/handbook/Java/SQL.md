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

1. 查看 mysql 服务进程：`ps -ef | grep mysql`
2. service 服务管理：`cp -a mysql.server /etc/rc.d/init.d/mysql`
3. 启动命令：`service mysql start`
4. 关闭命令：`service mysql stop`
5. 重新启动命令：`service mysql restart`
6. 查看状态命令：`service mysql status`
7. 登录管理： `ln -s /usr/local/mysql/bin/* /bin`
8. 登录命令：`mysql -uroot -p`
9. 默认端口号：`3306`
10. 配置文件：`/etc/my.cnf`
11. 登录命令：`mysql -u用户 -p密码`
12. 退出命令：`exit; quit;`

### 库表深入解析

1. 什么是库？顾名思义就是数据仓库的意思，存储着一定数据结构的数据，一个数据库中可能包含着若干个表，我们可以
   通过数据库提供的多种方法来管理数据库里边的数据。本质上 mysql 数据库是一个关系型数据服务管理系统
2. 什么是表？我们所说的表就是数据表，每一张表是由行和列组成，每记录一条数据，数据表就增加一行。列是由字段名
   与字段数据属性组成，我们称之列为字段，每一个字段有着多个属性。例如是否允许为空、长度、类型等等
3. 数据库：database
4. 数据表：table
5. 字段（列）：column
6. 行：row

## sql 各类语句精讲

操作语句分为四类：

1. DDL 数据定义语言 (Data Definition Language) 例如：建库，建表
2. DML 数据操纵语言(Data Manipulation Language) 例如：对表中的数据进行增删改操作
3. DQL 数据查询语言(Data Query Language) 例如：对数据进行查询
4. DCL 数据控制语言(Data Control Language) 例如：对用户的权限进行设置

### DDL 数据定义语言

#### 创建、查看以及使用/切换

1. 直接创建数据库 db1: `create database db1;`
2. 查看当前在哪个库里边: `select database();`
3. 进入库的操作: `use 库名;`
4. 判断是否存在，如果不存在则创建数据库 db2: `create database if not exists db2;`
5. 创建数据库并指定字符集为 gbk: `create database db3 default character set gbk;`
6. 查看某个库是什么字符集: `show create database XD;`
7. 查看当前 mysql 使用的字符集: `show variables like 'character%';`

#### 常用数据类型

1. 数据类型是指列、存储过程参数、表达式和局部变量的数据特征，它决定了数据的存储格式，代表了不同的信息类型。有一些数据是要存储为数字的，数字当中有些是要存储为整数、小数、日期型等...
2. mysql 常见数据类型:

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

3. 创建 sql

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
- 查看创建表的 sql 语句：`show create table 表名;`
- `\G` ：有结束 sql 语句的作用，还有把显示的数据纵向旋转 90 度
- `\g` ：有结束 sql 语句的作用
- 修改表名

```sql
--  rename table 旧表名 to 新表名;
 rename table student to user;
```

- 添加列

```sql
-- 给表添加一列：alter table 表名 add 列名 类型;
alter table user add addr varchar(50);
​
alter table add 列名 类型 comment '说明';
alter table user add famliy varchar(50) comment '学生父母';
​
-- 给表最前面添加一列：alter table 表名 add 列名 类型 first;
alter table user add job varchar(10) first;
​
-- 给表某个字段后添加一列：alter table 表名 add 列名 类型 after 字段名;
alter table user add servnumber int(11)  after id;
​
-- 注意：没有给表某个字段前添加一列的说法。
```

- 修改列类型

```sql
-- alter table 表名 modify 列名 新类型;
alter table user modify servnumber varchar(20);
```

- 修改列名

```sql
-- alter table 表名 change 旧列名 新列名 类型;
alter table user change servnumber telephone varchar(20);
```

- 删除列

```sql
-- alter table 表名 drop 列名;
alter table user drop famliy;
```

- 修改字符集

```sql
-- alter table 表名 character set 字符集;
alter table user character  set GBK;
```

- mysql 表的删除

```sql
-- drop table 表名;
drop table user;

-- 看表是否存在，若存在则删除表：
-- drop table if exists 表名;
drop table  if exists teacher;
```

### DML 数据操纵语言

#### 表数据新增

- 普通的插入表数据

```sql
-- insert into 表名（字段名） values（字段对应值）;
insert into employee (empno,ename,job,mgr,hiredate,sal,deptnu) values ('1000','小明','经理','10001','2019-03-03','12345.23','10');
​
-- insert into 表名 values（所有字段对应值）;
insert into employee  values ('1001','小明','经理','10001','2019-03-03','12345.23','10');
```

- 蠕虫复制（将一张表的数据复制到另一张表中）

```sql
-- insert into 表名1 select * from 表名2;
-- insert into 表名1（字段名1，字段名2） select 字段名1，字段名2 from 表名2;
insert into emp (empno,ename) select empno,ename from employee;
```

- 建表复制

```sql
-- create table 表名1 as select 字段名1，字段名2 from 表名2;
create table emp as select empno ,ename from employee;
```

- 一次性插入多个数据

```sql
insert into 表名  (字段名) values (对应值1),(对应值2),(对应值3);
```

- 创建 sql：

```sql
某个公司的员工表
CREATE TABLE employee(
    empno       INT  PRIMARY KEY comment '雇员编号',
    ename       VARCHAR(20) comment '雇员姓名',
    job         VARCHAR(20) comment '雇员职位',
    mgr         INT comment '雇员上级编号',
    hiredate    DATE comment '雇佣日期',
    sal         DECIMAL(7,2) comment '薪资',
    deptnu      INT comment '部门编号'
    );
```

#### 表数据的修改以及删除

- 修改（更新）：

```sql
update 表名 set 字段名1=值1 where 字段名=值;
update 表名 set 字段名1=值1,字段名2=值2 where 字段名=值;
```

- 删除：

```sql
delete from 表名 where 字段名=值;
truncate table 表名;
delete from 表名;
drop table 表名;
```

- 注意事项：
  面试时：面试官问在删改数据之前，你会怎么做？
  答案：会对数据进行备份操作，以防万一，可以进行数据回退
  ​
  面试时：面试官会问，delete 与 truncate 与 drop 这三种删除数据的共同点都是删除数据，他们的不同点是什么?
  delele 会把删除的操作记录给记录起来，以便数据回退，不会释放空间，而且不会删除定义。
  truncate 不会记录删除操作，会把表占用的空间恢复到最初，不会删除定义
  drop 会删除整张表，释放表占用的空间。

- 删除速度：

```sql
drop > truncate > delete
```

#### 中文乱码问题

- 查看当前 mysql 使用的字符集：`show variables like 'character%';`
  - character_set_client：客户端请求数据的字符集
  - character_set_connection：客户端与服务器连接的字符集
  - character_set_database：数据库服务器中某个库使用的字符集设定，如果建库时没有指明，将默认使用配置上的字符集
  - character_set_results：返回给客户端的字符集(从数据库读取到的数据是什么编码的)
  - character_set_server：为服务器安装时指定的默认字符集设定。
  - character_set_system：系统字符集(修改不了的，就是 utf8)
  - character_sets_dir：mysql 字符集文件的保存路径
- 临时：`set names gbk;`
- 永久：修改配置文件 my.cnf 里边的

```sql
[client]
default-character-set=gbk
作用于外部的显示
​
[mysqld]
character_set_server=gbk
作用于内部，会作用于创建库表时默认字符集
```

- 修改库的字符集编码: `alter database xiaoxiao default character set gbk;`
- 修改表的字符集编码: `alter table employee default character set utf8;`

### DQL 数据查询语言

```sql
/*创建部门表*/
CREATE TABLE dept(
    deptnu      INT  PRIMARY KEY comment '部门编号',
    dname       VARCHAR(50) comment '部门名称',
    addr        VARCHAR(50) comment '部门地址'
);
​
某个公司的员工表
CREATE TABLE employee(
    empno       INT  PRIMARY KEY comment '雇员编号',
    ename       VARCHAR(50) comment '雇员姓名',
    job         VARCHAR(50) comment '雇员职位',
    mgr         INT comment '雇员上级编号',
    hiredate    DATE comment '雇佣日期',
    sal         DECIMAL(7,2) comment '薪资',
    deptnu      INT comment '部门编号'
)ENGINE=MyISAM DEFAULT CHARSET=utf8;
​
/*创建工资等级表*/
CREATE TABLE salgrade(
    grade       INT  PRIMARY KEY comment '等级',
    lowsal      INT comment '最低薪资',
    higsal      INT comment '最高薪资'
);
​
/*插入dept表数据*/
INSERT INTO dept VALUES (10, '研发部', '北京');
INSERT INTO dept VALUES (20, '工程部', '上海');
INSERT INTO dept VALUES (30, '销售部', '广州');
INSERT INTO dept VALUES (40, '财务部', '深圳');
​
/*插入emp表数据*/
INSERT INTO employee VALUES (1009, '唐僧', '董事长', NULL, '2010-11-17', 50000,  10);
INSERT INTO employee VALUES (1004, '猪八戒', '经理', 1009, '2001-04-02', 29750, 20);
INSERT INTO employee VALUES (1006, '猴子', '经理', 1009, '2011-05-01', 28500, 30);
INSERT INTO employee VALUES (1007, '张飞', '经理', 1009, '2011-09-01', 24500,10);
INSERT INTO employee VALUES (1008, '诸葛亮', '分析师', 1004, '2017-04-19', 30000, 20);
INSERT INTO employee VALUES (1013, '林俊杰', '分析师', 1004, '2011-12-03', 30000, 20);
INSERT INTO employee VALUES (1002, '牛魔王', '销售员', 1006, '2018-02-20', 16000, 30);
INSERT INTO employee VALUES (1003, '程咬金', '销售员', 1006, '2017-02-22', 12500, 30);
INSERT INTO employee VALUES (1005, '后裔', '销售员', 1006, '2011-09-28', 12500, 30);
INSERT INTO employee VALUES (1010, '韩信', '销售员', 1006, '2018-09-08', 15000,30);
INSERT INTO employee VALUES (1012, '安琪拉', '文员', 1006, '2011-12-03', 9500,  30);
INSERT INTO employee VALUES (1014, '甄姬', '文员', 1007, '2019-01-23', 7500, 10);
INSERT INTO employee VALUES (1011, '妲己', '文员', 1008, '2018-05-23', 11000, 20);
INSERT INTO employee VALUES (1001, '小乔', '文员', 1013, '2018-12-17', 8000, 20);
​
/*插入salgrade表数据*/
INSERT INTO salgrade VALUES (1, 7000, 12000);
INSERT INTO salgrade VALUES (2, 12010, 14000);
INSERT INTO salgrade VALUES (3, 14010, 20000);
INSERT INTO salgrade VALUES (4, 20010, 30000);
INSERT INTO salgrade VALUES (5, 30010, 99990);
```

#### where 条件查询

- 简单查询

```sql
select * from employee;
select empno,ename,job as ename_job from employee;
```

- 精确条件查询

```sql
select * from employee where ename='后裔';
select * from employee where sal != 50000;
select * from employee where sal <> 50000;
select * from employee where sal > 10000;
```

- 模糊条件查询

```sql
show variables like '%aracter%';
select * from employee  where ename like '林%';
```

- 范围查询

```sql
select * from employee where sal between 10000 and 30000;
select * from employee where hiredate between '2011-01-01' and '2017-12-1';
```

- 离散查询

```sql
select * from employee where ename in ('猴子','林俊杰','小红','小胡');
```

- 清除重复值

```sql
select distinct(job) from employee;
```

- 统计查询（聚合函数）:

```sql
-- count(code)或者count(*)
select count(*) from employee;
select count(ename) from employee;

-- sum()  计算总和
select sum(sal) from employee;

-- max()    计算最大值
select * from employee where sal= (select  max(sal) from employee);

-- avg()   计算平均值
select avg(sal) from employee;

-- min()   计算最低值
select * from employee where sal= (select  min(sal) from employee);

-- concat函数： 起到连接作用
select concat(ename,' 是 ',job) as aaaa from employee;
```

#### `group by`分组查询（分组）

- 作用：把行 按 字段 分组
- 语法：group by 列 1，列 2....列 N
- 适用场合：常用于统计场合，一般和聚合函数连用

```sql
-- eg:
select deptnu,count(*) from employee group by deptnu;
select deptnu,job,count(*) from employee group by deptnu,job;
select job,count(*) from employee group by job;
```

#### having 条件查询（筛选）

- 作用：对查询的结果进行筛选操作
- 语法：having 条件 或者 having 聚合函数 条件
- 适用场合：一般跟在 group by 之后

```sql
-- eg:
select job,count(*) from employee group by job having job ='文员';
select  deptnu,job,count(*) from employee group by deptnu,job having count(*)>=2;
select  deptnu,job,count(*) as 总数 from employee group by deptnu,job having 总数>=2;
```

#### `order by`排序查询（排序）

- 作用：对查询的结果进行排序操作
- 语法：order by 字段 1,字段 2 .....
- 适用场合：一般用在查询结果的排序

```sql
-- eg:
select * from employee order by sal;
select * from employee order by hiredate;
select  deptnu,job,count(*) as 总数 from employee group by deptnu,job having 总数>=2 order by deptnu desc;
select  deptnu,job,count(*) as 总数 from employee group by deptnu,job having 总数>=2 order by deptnu asc;
select  deptnu,job,count(*) as 总数 from employee group by deptnu,job having 总数>=2 order by deptnu;
​
-- 顺序：where ---- group by ----- having ------ order by
```

#### limit 限制查询（限制）

- 作用：对查询结果起到限制条数的作用
- 语法：limit n，m n:代表起始条数值，不写默认为 0；m 代表：取出的条数
- 适用场合：数据量过多时，可以起到限制作用

```sql
-- eg:
select * from XD.employee limit 4,5;
```

#### exists 型子查询

- exists 型子查询后面是一个受限的 select 查询语句
- exists 子查询，如果 exists 后的内层查询能查出数据，则返回 TRUE 表示存在；为空则返回 FLASE 则不存在。

```sql
-- 分为2种：exists跟 not exists
​
select 1 from employee where 1=1;
select * from 表名 a where exists (select 1 from 表名2 where 条件);
​
-- eg:查询出公司有员工的部门的详细信息
select * from dept a where exists (select 1 from employee b where a.deptnu=b.deptnu);
select * from dept a where not exists (select 1 from employee b where a.deptnu=b.deptnu);
```

#### 左连接查询与右连接查询

- 左连接称之为左外连接 右连接称之为右外连接 这俩个连接都是属于外连接
- 左连接关键字：`left join 表名 on 条件` / `left outer 表名 join on 条件` 右连接关键字：`right join 表名 on 条件`/ `right outer 表名 join on 条件`
- 左连接说明： `left join` 是`left outer join`的简写，左(外)连接，左表(a_table)的记录将会全部表示出来， 而右表(b_table)只会显示符合搜索条件的记录。右表记录不足的地方均为 NULL。
- 右连接说明：`right join`是`right outer join`的简写，与左(外)连接相反，右(外)连接，左表(a_table)只会显示符合搜索条件的记录，而右表(b_table)的记录将会全部表示出来。左表记录不足的地方均为 NULL。

```sql
-- eg:列出部门名称和这些部门的员工信息，同时列出那些没有的员工的部门
--   dept，employee
select a.dname,b.* from dept a  left join employee b on a.deptnu=b.deptnu;
select b.dname,a.* from employee a  right join  dept b on b.deptnu=a.deptnu;
```

#### 内连接查询与联合查询

- 内连接：获取两个表中字段匹配关系的记录
- 主要语法：`INNER JOIN 表名 ON 条件;`

```sql
-- eg:想查出员工张飞的所在部门的地址
select a.addr from dept a inner join employee b on a.deptnu=b.deptnu and b.ename='张飞';
select a.addr from dept a,employee b where a.deptnu=b.deptnu and b.ename='张飞';
```

- 联合查询：就是把多个查询语句的查询结果结合在一起，主要语法 1：`... UNION ... （去除重复） 主要语法2：... UNION ALL ...（不去重复）`
- union 查询的注意事项：

```sql
-- (1)两个select语句的查询结果的“字段数”必须一致；
-- (2)通常，也应该让两个查询语句的字段类型具有一致性；
-- (3)也可以联合更多的查询结果；
-- (4)用到order by排序时，需要加上limit（加上最大条数就行），需要对子句用括号括起来
-- eg:对销售员的工资从低到高排序，而文员的工资从高到低排序
(select * from employee a where a.job = '销售员'  order by a.sal limit 999999 ) union  (select * from employee b where b.job = '文员' order by b.sal desc limit 999999);
```

#### 项目高级查询实战(一)

- 查出至少有一个员工的部门。显示部门编号、部门名称、部门位置、部门人数。

```sql
涉及表： employee dept
语句：select deptnu,count(*) from employee group by deptnu
语句：select a.deptnu,a.dname,a.addr, b.zongshu from dept a,(select deptnu,count(*) as zongshu from employee group by deptnu) b where a.deptnu=b.deptnu;
```

- 列出薪金比安琪拉高的所有员工。

```sql
涉及表：employee
语句：select * from  employee where sal > (select sal from employee where ename='安琪拉');
```

- 列出所有员工的姓名及其直接上级的姓名。

```sql
涉及表：employee
语句：select a.ename,ifnull(b.ename,'BOSS') as leader from employee a left join employee b on a.mgr=b.empno;
```

- 列出受雇日期早于直接上级的所有员工的编号、姓名、部门名称。

```sql
涉及表：employee dept
条件：a.hiredate < b.hiredate
语句：select a.empno,a.ename,c.dname from employee a left join employee b on a.mgr=b.empno left join dept c on a.deptnu=c.deptnu where a.hiredate < b.hiredate;
```

- 列出部门名称和这些部门的员工信息，同时列出那些没有员工的部门。

```sql
涉及表：dept employee
语句：select a.dname,b.* from dept a left join employee b on a.deptnu=b.deptnu;
```

- 列出所有文员的姓名及其部门名称，所在部门的总人数。

```sql
涉及表：employee dept
条件：job='文员'
语句：select deptnu,count(*) as zongshu from employee group by deptnu;
语句：select b.ename,a.dname,b.job,c.zongshu from dept a ,employee b ,(select deptnu,count(*) as zongshu from employee group by deptnu) c where a.deptnu=b.deptnu and b.job='文员' and b.deptnu=c.deptnu;
```

#### 项目高级查询实战(二)

- 列出最低薪金大于 15000 的各种工作及从事此工作的员工人数。

```sql
涉及表：employee
条件：min(sal) > 15000
语句：select job,count(*) from employee group by job having min(sal) > 15000;
```

- 列出在销售部工作的员工的姓名，假定不知道销售部的部门编号。

```sql
涉及表：employee dept
select  ename  from employee where deptnu=(select deptnu from dept where dname='销售部');
```

- 列出与诸葛亮从事相同工作的所有员工及部门名称。

```sql
涉及表：employee dept
语句：select a.ename,b.dname from employee a,dept b where a.deptnu=b.deptnu and a.job= (select job from employee where ename='诸葛亮');
语句：select a.ename,b.dname from employee a left join dept b on a.deptnu=b.deptnu where a.job=(select job from employee where ename='诸葛亮');
```

- 列出薪金比 在部门 30 工作的员工的薪金 还高的员工姓名和薪金、部门名称。

```sql
涉及表：employee dept
语句：select a.ename,a.sal,b.dname from employee a ,dept b where a.deptnu=b.deptnu and sal > (select max(sal) from employee where deptnu=30);
```

- 列出每个部门的员工数量、平均工资。

```sql
涉及表：employee
语句：select deptnu , count(*) ,avg (sal) from employee group by deptnu;
```

- 列出薪金高于公司平均薪金的所有员工信息，所在部门名称，上级领导，工资等级。

```sql
涉及表：employee dept salgrade
条件：select avg(sal) from employee
语句：elect a.*,c.dname,b.ename,d.grade from employee a,employee b,dept c ,salgrade d where a.mgr=b.empno and a.deptnu =c.deptnu and a.sal > (select avg(sal) from employee) and a.sal  between d.lowsal and d.higsal;
```

### DCL 数据控制语言（对用户权限的设置）

- 什么是 DCL 数据控制语言？

数据控制语言（DCL：Data Control Language）是用来设置或者更改数据库用户或角色权限的语句，这些语句包括 GRANT、DENY、REVOKE 等语句。

#### 限制 root 用户指定 ip 登录

如何从安全角度出发限制 root 用户指定 ip 登录

- 查看 root 用户可以在哪台机器登录

```sql
select user,host from mysql.user where user='root';
```

- 修改 mysql 库里边的 user 表

```sql
update mysql.user set host='localhost' where user='root';
```

- 刷新权限

```sql
flush privileges;
```

#### 用户密码

修改用户密码分三种方法：

- 第一种：set password for 用户@ip = password('密码');

```sql
set password for root@localhost = password('root');
```

- 第二种：mysqladmin -u 用户 -p 旧密码 password 新密码;

```sql
mysqladmin -urootmysqladmin -uroot -proot password;
```

- 第三种：update mysql.user set authentication_string=password('密码') where user='用户' and host='ip';

```sql
update mysql.user set authentication_string=password('root') where user='root' and host='localhost';
```

忘记密码:

- 第一步：修改配置文件 my.cnf (默认在/etc/my.cnf)，在[mysqld]下面加上 skip-grant-tables （跳过权限的意思）
- 第二步：重启 mysql 服务
- 第三步：mysql -uroot -p 无需密码登录进入
- 第四步：修改密码

#### 创建新用户并限制 ip 网段登录

- 创建用户的语法：create user 'username'@'host' identified by 'password';

```sql
username：你将创建的用户名
host：指定该用户在哪个主机上可以登陆，如果是本地用户可用localhost，如果想让该用户可以从任意远程主机    登陆，可以使用通配符%
password：该用户的登陆密码，密码可以为空，如果为空则该用户可以不需要密码登陆服务器
```

- 创建用户语法：创建一个 pig 用户，并指定登录密码：123456，可以在任何一台远程主机都可以登录

```sql
create user 'pig'@'%' identified by '123456';
```

- 创建一个 pig 用户，并指定登录密码：为空，指定在 120 网段的机器登录

```sql
create user 'pig'@'120.%.%.%' identified by '';
```

- 查看权限：

```sql
select * from mysql.user where user='pig'\G
mysql> show grants for 'pig'@'%';
+---------------------------------+
| Grants for pig@%                |
+---------------------------------+
| GRANT USAGE ON *.* TO 'pig'@'%' |
+---------------------------------+
USAGE：无权限的意思
mysql> show grants for 'root'@'localhost';
+---------------------------------------------------------------------+
| Grants for root@localhost                                           |
+---------------------------------------------------------------------+
| GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION |
+---------------------------------------------------------------------+
WITH GRANT OPTION:表示这个用户拥有grant权限，即可以对其他用户授权
```

- 删除用户语法：drop user 'username'@'host';

```sql
drop user 'pig'@'%';
delete from mysql.user where user='pig';
```

#### 库表权限授权与回收

- 授权语法：grant 权限 1,权限 2..... on 数据库对象 to '用户'

```sql
grant 权限1,权限2..... on 数据库对象 to '用户'@'host' identified by 'password';
```

- all privileges:代表所有权限
- . :代表所有库所有表

```sql
对现有用户进行授权：对现有用户pig授予所有库所有表所有权限。
grant all privileges on *.*  to 'pig';
```

```sql
对没有的用户进行授权：创建一个新用户dog授予XD库的所有权限，登录密码123456，任何一台主机登录
grant all privileges on XD.* to 'dog'@'%' identified by '123456';
```

```sql
对没有的用户进行授权：创建一个新用户cat授予XD库的employee表 查与修改权限，登录密码123456，任何一台主机登录
grant select,update on XD.employee to 'cat'@'%' identified by '123456'
```

```sql
对没有的用户进行授权：对用户cat授予XD库的employee表insert 权限，登录密码123456，任何一台主机登录
grant insert on XD.employee to 'cat'@'%' identified by '123456';
```

- 回收语法：revoke 权限 1,权限 2..... on 数据库对象 from '用户'@'host';

```sql
回收pig用户的所有权限（注意：并没有回收它的登录权限）
revoke all privileges on *.*  from 'pig' @ '%';
flush privileges;
```

```sql
回收pig用户的所有权限（并回收它的登录权限）
delete from mysql.user where user='pig';
flush privileges;
```

```sql
回收cat用户对XD库的employee的查与修改权限
revoke select,update on XD.employee from 'cat'@'%';
flush privileges;
```

### 事务实战，视图，触发器，以及存储过程

#### 事务的详细解析

- 什么是事务?
- 答：数据库事务通常指对数据库进行读或写的一个操作过程。有两个目的，第一个是为数据库操作提供了一个从失败中恢复到正常状态的方法，同时提供了数据库即使在异常状态下仍能保持一致性的方法；第二个是当多个应用程序在并发访问数据库时，可以在这些应用程序之间提供一个隔离方法，以防止彼此的操作互相干扰。
- 事务的特性（ACID）：
  - 原子性(Atomicity)：事务必须是原子工作单元，一个事务中的所有语句，应该做到：要么全做，要么一个都不做；
  - 一致性(Consistency):让数据保持逻辑上的“合理性”，比如：小明给小红打 10000 块钱，既要让小明的账户减少 10000，又要让小红的账户上增加 10000 块钱；
  - 隔离性(Isolation)：如果多个事务同时并发执行，但每个事务就像各自独立执行一样。
  - 持久性(Durability)：一个事务执行成功，则对数据来说应该是一个明确的硬盘数据更改（而不仅仅是内存中的变化）。
- **要使用事务的话，表的引擎要为 innodb 引擎**

#### 事务实战

- 事务的开启与提交：
  - 事务的开启：begin; start transaction;
  - 事务的提交：commit;
  - 事务的回滚：rollback;

```sql
创建一个账户表模拟转账
create table account (
                         id tinyint(5) zerofill auto_increment  not null comment 'id编号',
                         name varchar(20) default null comment '客户姓名',
                         money decimal(10,2) not null comment '账户金额',
                         primary key (id)
                         )engine=innodb charset=utf8;
```

- 开启 autocommit（临时生效）：

OFF（0）：表示关闭 ON （1）：表示开启

```sql
mysql> set autocommit=0;
Query OK, 0 rows affected (0.00 sec)

mysql> show variables like 'autocommit';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| autocommit    | OFF   |
+---------------+-------+
mysql> set autocommit=1;
Query OK, 0 rows affected (0.00 sec)
mysql>
mysql> show variables like 'autocommit';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| autocommit    | ON    |
```

- 开启 autocommit（永久生效）：

修改配置文件：vi /etc/my.cnf 在[mysqld]下面加上：autocommit=1 记得重启服务才会生效

#### 视图的应用

- 什么是视图？视图的作用是什么？

```sql
视图（view）是一种虚拟存在的表，是一个逻辑表，它本身是不包含数据的。作为一个select语句保存在数据字典中的。
通过视图，可以展现基表（用来创建视图的表叫做基表base table）的部分数据，说白了视图的数据就是来自于基表
```

- 视图的优点是：

```sql
1）简单：使用视图的用户完全不需要关心后面对应的表的结构、关联条件和筛选条件，对用户来说已经是过滤好的复合条件的结果集。
​
2）安全：使用视图的用户只能访问他们被允许查询的结果集，对表的权限管理并不能限制到某个行某个列，但是通过视图就可以简单的实现。
​
3）数据独立：一旦视图的结构确定了，可以屏蔽表结构变化对用户的影响，源表增加列对视图没有影响;源表修改列名，则可以通过修改视图来解决，不会造成对访问者的影响。
　　
4）不占用空间：视图是逻辑上的表，不占用内存空间
​
总而言之，使用视图的大部分情况是为了保障数据安全性，提高查询效率。
```

- 视图的创建以及修改

```sql
创建的基本语法是：
create view <视图名称> as select 语句;
create view <视图名称> (字段) as select 语句;
create or replace view <视图名称>;
```

```sql
修改的语法是：
alter view <视图名称> as select 语句;
```

```sql
视图删除语法：
drop view <视图名称> ;
```

- 视图的缺点

```sql
 1)性能差：sql server必须把视图查询转化成对基本表的查询，如果这个视图是由一个复杂的多表查询所定义，那么，即使是视图的一个简单查询，sql server也要把它变成一个复杂的结合体，需要花费一定的时间。

 2)修改限制：当用户试图修改试图的某些信息时，数据库必须把它转化为对基本表的某些信息的修改，对于简单的试图来说，这是很方便的，但是，对于比较复杂的试图，可能是不可修改的。
```

#### 触发器介绍

- 什么是触发器？
- 触发器就是监视某种情况，并触发某种操作

- 创建触发器的语法:

```sql
create trigger 触发器名称  after/before   insert/update/delete on 表名
   for each row
   begin
   sql语句;
   end
```

```sql
after/before:可以设置为事件发生前或后
insert/update/delete:它们可以在执行insert、update或delete的过程中触发
for each row:每隔一行执行一次动作
```

- 删除触发器的语法:

```sql
drop trigger 触发器名称;
```

- 演示：

```sql
创建一个员工迟到表：
create table work_time_delay(
   empno int not null comment '雇员编号',
   ename varchar(50) comment '雇员姓名',
   status int comment '状态'
);
```

```sql
delimiter // 自定义语句的结束符号
​
mysql> delimiter //
mysql>
mysql> create trigger trig_work after insert on work_time_delay
-> for each row
-> begin
-> update employee set sal=sal-100 where empno=new.empno;
-> end
-> // Query OK, 0 rows affected (0.01 sec)
​
new：指的是事件发生before或者after保存的新数据
```

#### 存储过程介绍

- 什么是存储过程？
- 存储过程就是把复杂的一系列操作，封装成一个过程。类似于 shell，python 脚本等。
- 存储过程的优缺点

```sql
优点是：
   1)复杂操作，调用简单
   2)速度快

缺点是：
   1）封装复杂
   2) 没有灵活性
```

- 创建存储过程语法：

```sql
create procedure 名称 (参数....)
         begin
         过程体;
         过程体;
         end
```

```sql
参数：
in|out|inout 参数名称 类型（长度）
in：表示调用者向过程传入值（传入值可以是字面量或变量）
out：表示过程向调用者传出值(可以返回多个值)（传出值只能是变量）
inout：既表示调用者向过程传入值，又表示过程向调用者传出值（值只能是变量）
```

- 声明变量：declare 变量名 类型(长度) default 默认值;
- 给变量赋值：set @变量名=值;
- 调用存储命令：call 名称(@变量名);
- 删除存储过程命令：drop procedure 名称;
- 查看创建的存储过程命令：

```sql
show create procedure 名称\G;
```

```sql
创建一个简单的存储过程：
mysql> delimiter //
mysql> create procedure  name(in n int)
->     begin
->     select * from employee limit n;
->     end
-> //  Query OK, 0 rows affected (0.00 sec)
​
mysql> set @n=5;
-> // Query OK, 0 rows affected (0.00 sec)
​
mysql>
mysql> call name(@n);
```

```sql
mysql> create procedure  name()
->     begin
->     declare n int default 6;
->     select * from employee limit n;
->     end
-> //  Query OK, 0 rows affected (0.00 sec)
​
mysql> call name();
```

### 8 索引与存储引擎的介绍

```sql

```

####

```sql

```

####

```sql

```
