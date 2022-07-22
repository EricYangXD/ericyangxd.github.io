-- 创建新的DB，不区分大小写，但是一般用大写
CREATE DATABASE `sql_tutorial`;

-- 展示DB
SHOW DATABASES;

-- 删除DB
DROP DATABASE `sql_tutorial`;

-- 选择操作的DB
USE `sql_tutorial`;

-- INT 整数
-- DECIMAL(有效数字位数,小数位数) 有小数点的数
-- VARCHAR(字符串最大长度) 字符串
-- BLOB 二进制图片视频文档
-- DATE 日期 YYYY-MM-DD
-- TIMESTAMP 时间戳 YYYY-MM-DD HH:MM:SS
-- 创建table
CREATE TABLE `student`( `student_id` INT PRIMARY KEY, `name` VARCHAR(20), `major` VARCHAR(20) ) COMMENT = '学生表';
-- 另一种方法
CREATE TABLE `student`( `student_id` INT, `name` VARCHAR(20), `major` VARCHAR(20) , PRIMARY KEY(`student_id`, `name`) ) COMMENT = '学生表';

-- 根据已有的表创建新表
CREATE TABLE vip_user AS SELECT  * FROM user;

-- 展示table信息
DESCRIBE `student`;

-- 删除table
DROP TABLE `student`;

-- 选中某个table，然后再这个table中添加一个字段（列），并定义类型
ALTER TABLE `student` ADD gpa DECIMAL(3, 2);

-- 从某个table中删除某一（字段）列
ALTER TABLE `student` DROP COLUMN gpa;

-- 修改列
ALTER TABLE `user` MODIFY COLUMN age tinyint;

-- 添加主键
ALTER TABLE user ADD PRIMARY KEY (id);

-- 删除主键
ALTER TABLEuser DROP PRIMARY KEY;

-- CRUD(Create, Read, Update, Delete)，即增删改查。
--  INSERT 、 UPDATE 、 DELETE 、 SELECT
-- 写入内容
-- INSERT INTO `student` VALUES(1,'小白','历史',3.22);
INSERT INTO `student` VALUES (2, '小黑', '生物');

INSERT INTO `student` VALUES (3, '小绿', '英语');

INSERT INTO `student` VALUES (4, '小白', '历史');

INSERT INTO `student` VALUES (5, '小黄', '生物');

INSERT INTO `student`(`name`, `major`, `student_id`) VALUES ('小杨', '数学', 6);

SELECT * FROM `student`;

-- 创建table，增加约束条件
-- PRIMARY KEY(`student_id`) 
CREATE TABLE `student`( `student_id` INT PRIMARY KEY AUTO_INCREMENT, `name` VARCHAR(20) NOT NULL, `major` VARCHAR(20) UNIQUE );

-- 修改删除
SET SQL_SAFE_UPDATES = 0;

-- 删除table
DROP TABLE `student`;

-- 创建table
-- PRIMARY KEY(`student_id`) 
CREATE TABLE `student`( `student_id` INT PRIMARY KEY AUTO_INCREMENT, `name` VARCHAR(20), `major` VARCHAR(20), `score` INT );

INSERT INTO `student` VALUES (1, '小黑', '生物', 88);

INSERT INTO `student` VALUES (2, '小王', '英语', 98);

INSERT INTO `student` VALUES (4, '小李', '化学', 69);

-- 插入行的一部分
INSERT INTO `user`(`username`, `password`, `email`) VALUES ('admin', 'admin', 'xxxx@163.com');

-- 插入查询出来的数据
INSERT INTO `user`(`username`) SELECT name FROM `account`;

UPDATE `student`
SET `major` = '德语'
WHERE `major` = '英语';

UPDATE`student`
SET `major` = '德语2'
WHERE `student_id` = 2;

UPDATE`student`
SET `major` = '生化'
WHERE `major` = '生物' OR `major` = '化学';

UPDATE `user`
SET `username` = 'robot', `password` = 'robot'
WHERE `username` = 'root';

SELECT
  *
FROM
  `student`;

DELETE FROM
  `student`
WHERE
  `student_id` = 4
  AND `name` = '小李';

DELETE FROM
  `student`
WHERE
  `score` < 80;

DELETE FROM
  `student`;

-- 清空这张表
TRUNCATE TABLE `student`;

-- 清空这张表
-- BETWEEN 在某个范围内。BETWEEN 操作符在 WHERE 子句中使用，作用是选取介于某个范围内的值。
SELECT
  *
FROM
  products
WHERE
  prod_price BETWEEN 3 AND 5;

-- LIKE 搜索某种模式
-- IN 指定针对某个列的多个可能值。IN 操作符在 WHERE 子句中使用，作用是在指定的几个特定值中任选一个值。
SELECT
  *
FROM
  products
WHERE
  vend_id IN ('DLL01', 'BRS01');

-- 搜索、获取数据: 不等于:<>，注释 ： 在 SQL 的一些版本中 ， 该操作符可被写成 !
SELECT
  `name`,
  `major`
FROM
  `student`
ORDER BY
  `score` DESC
LIMIT
  2;

SELECT
  `name`,
  `major`
FROM
  `student`
ORDER BY
  `score`,
  `student_id`;

SELECT
  *
FROM
  `student`
WHERE
  `major` IN('数学', '物理', '化学')
ORDER BY
  `score`,
  `student_id`;

-- test
CREATE TABLE
  `employee`(
    `emp_id` INT PRIMARY KEY,
    `name` VARCHAR(20),
    `birth_date` DATE,
    `sex` VARCHAR(1),
    `salary` INT,
    `branch_id` INT,
    `sup_id` INT
  );

DROP TABLE
  `Employee`;

-- 先创建table之后才能去关联「外键」
CREATE TABLE
  `branch`(
    `branch_id` INT PRIMARY KEY,
    `branch_name` VARCHAR(20),
    `manager_id` INT,
    FOREIGN KEY (`manager_id`) REFERENCES `employee`(`emp_id`) ON DELETE
    SET
      NULL
  );

ALTER TABLE
  `employee`
ADD
  FOREIGN KEY(`branch_id`) REFERENCES `branch`(`branch_id`) ON DELETE
SET
  NULL;

ALTER TABLE
  `employee`
ADD
  FOREIGN KEY(`sup_id`) REFERENCES `employee`(`emp_id`) ON DELETE
SET
  NULL;

CREATE TABLE
  `client`(
    `client_id` INT PRIMARY KEY,
    `client_name` VARCHAR(20),
    `phone` INT
  );

CREATE TABLE
  `works_with` (
    `emp_id` INT,
    `client_id` INT,
    `total_sales` INT,
    PRIMARY KEY(`emp_id`, `client_id`),
    FOREIGN KEY (`emp_id`) REFERENCES `employee`(`emp_id`) ON DELETE CASCADE,
    FOREIGN KEY (`client_id`) REFERENCES `client`(`client_id`) ON DELETE CASCADE
  );

-- 有外键的时候，先把外键写成null，然后创建完成后再改回来
INSERT INTO `branch` VALUES (1, '研发', NULL);
INSERT INTO `branch` VALUES (2, '行政', NULL);
INSERT INTO `branch` VALUES (3, '资讯', NULL);

SELECT  * FROM `branch`;

UPDATE `branch`
SET `manager_id` = 206
WHERE `branch_id` = 1;

UPDATE `branch`
SET `manager_id` = 207
WHERE `branch_id` = 2;

UPDATE `branch`
SET `manager_id` = 208
WHERE `branch_id` = 3;

INSERT INTO `employee` VALUES (206, '小黄', '1998-10-08', 'F', 50000, 1, NULL);
INSERT INTO `employee` VALUES (207, '小绿', '1985-09-16', 'M', 29000, 1, 206);
INSERT INTO `employee` VALUES (208, '小黑', '2000-12-19', 'M', 35000, 1, 206);
INSERT INTO `employee` VALUES (209, '小白', '1997-01-22', 'F', 39000, 1, 207);
INSERT INTO `employee` VALUES (210, '小蓝', '1925-11-10', 'F', 84000, 1, 207);

SELECT  * FROM `employee`;
INSERT INTO `client` VALUES (400, '阿狗', '254354335');
INSERT INTO `client` VALUES (401, '阿猫', '25633899');
INSERT INTO `client` VALUES (402, '旺来', '45354345');
INSERT INTO `client` VALUES (403, '露西', '54354365');
INSERT INTO `client` VALUES (404, '艾瑞克', '18783783');

INSERT INTO `works_with` VALUES (206, 400, '70000');
INSERT INTO `works_with` VALUES (207, 401, '24000');
INSERT INTO `works_with` VALUES (208, 402, '9800');
INSERT INTO `works_with` VALUES (209, 403, '24000');
INSERT INTO `works_with` VALUES (210, 404, '87940');

-- 取得所有员工资料
SELECT  * FROM `employee`;

-- 取得所有客户资料
SELECT  * FROM `client`;

-- 按薪水从低到高取得员工资料
SELECT  *
FROM `employee`
ORDER BY `salary` ASC;

-- LIMIT：限制返回的行数 。 可以有两个参数 ， 第一个参数为起始行 ， 从 0 开 始 ； 第二个参数为返回的总行数 。 ASC ： 升序 （ 默认 ） DESC ： 降序
-- 取得薪水前三高的员工
SELECT  *
FROM `employee`
ORDER BY `salary` DESC
LIMIT 3;

-- 返回第 3 ~ 5 行
SELECT  *
FROM mytable
LIMIT 2, 3;

-- 取得所有员工的名字。DISTINCT：去重--用于返回唯一不同的值。它作用于所有列，也就是说所有列的值都相同才算相同 。
SELECT  `name` FROM `employee`;

-- 聚合函数
SELECT  COUNT(*) FROM `employee`;

SELECT  COUNT(*)
FROM `employee`
WHERE `birth_date` > '1970-01-01'
AND `sex` = 'F';

SELECT  AVG(`salary`) FROM `employee`;

SELECT  SUM(`salary`) FROM `employee`;

SELECT  MAX(`salary`) FROM `employee`;

SELECT  MIN(`salary`) FROM `employee`;

-- 通用占位符  %：代表多个字符；_：代表一个字符；
SELECT  *
FROM `client`
WHERE `phone` LIKE '%335';

SELECT  *
FROM `employee`
WHERE `birth_date` LIKE '_____09%';

-- union 联合:属性数量和类型要一致
SELECT  `name`
FROM `employee`
UNION
SELECT  `client_name`
FROM `client`;

SELECT  `emp_id`
       ,`name`
FROM `employee`
UNION
SELECT  `client_id`
       ,`client_name`
FROM `client`;

SELECT  `salary`
FROM `employee`
UNION
SELECT  `total_sales`
FROM `works_with`;

-- JOIN 连接
INSERT INTO `branch` VALUES (4, '偷懒', NULL);

SELECT  *
FROM `employee`
JOIN `branch`
ON `emp_id` = `manager_id`;

SELECT  `emp_id`
       ,`name`
       ,`branch_name`
FROM `employee`
JOIN `branch`
ON `employee`.`emp_id` = `branch`.`manager_id`;

-- 在JOIN的左边就是左边表格，在右边就是右边表格，LEFT JOIN:左边的表格不管条件有没有成立，都会返回左侧的所有内容。
SELECT  `emp_id`
       ,`name`
       ,`branch_name`
FROM `employee`
LEFT JOIN `branch`
ON `employee`.`emp_id` = `branch`.`manager_id`;

SELECT  `emp_id`
       ,`name`
       ,`branch_name`
FROM `employee`
RIGHT JOIN `branch`
ON `employee`.`emp_id` = `branch`.`manager_id`;

SELECT  *
FROM `employee`;

SELECT  *
FROM `client`;

SELECT  *
FROM `branch`;

-- 子查询是嵌套在较大查询中的 SQL 查询 。 子查询也称为内部查询或内部 选择 ， 而包含子查询的语句也称为外部查询或外部选择 。
-- 子查询可以嵌套在 SELECT ， INSERT ， UPDATE 或 DELETE 语句内或另一个子查询中。
-- 子查询通常会在另一个 SELECT 语句的 WHERE 子句中添加。
-- 您可以使用比较运算符，如 > ， < ，或 = 。比较运算符也可以是多行运算符，如 IN ， ANY 或 ALL 。
-- 子查询必须被圆括号 () 括起来。
-- 内部查询首先在其父查询之前执行，以便可以将内部查询的结果传递给外部查询。
-- subquery 子查询，在一个查询语句中使用另一个查询语句的结果
-- 找出研发部经理的名字
SELECT  `manager_id`
FROM `branch`
WHERE `branch_name` = '研发';

SELECT  `name`
FROM `employee`
WHERE `emp_id` = (
SELECT  `manager_id`
FROM `branch`
WHERE `branch_name` = '研发' );
-- 找出对单一客户销售金额超过50000的员工的名字，多个子结果的时候用 IN
SELECT  `name`
FROM `employee`
WHERE `emp_id` IN ( SELECT `emp_id` FROM `works_with` WHERE `total_sales` > 50000 );

-- on delete set null: 对应的key删掉之后自动置成null，主键不能被设置成null！！！
-- on delete cascade：对应不到时，直接一起删掉
-- AND 、OR 、 NOT 是用于对过滤条件的逻辑处理指令 。
-- AND 优先级高于OR ， 为了明确处理顺序 ， 可以使用 () 。
-- AND 操作符表示左右条件都要满足 。
SELECT  prod_id
       ,prod_name
       ,prod_price
FROM products
WHERE vend_id = 'DLL01'
AND prod_price = 4;

-- OR 操作符表示左右条件满足任意一个即可 。
SELECT  prod_id
       ,prod_name
       ,prod_price
FROM products
WHERE vend_id = 'DLL01' OR vend_id = 'BRS01';

-- NOT 操作符用于否定一个条件 。
SELECT  *
FROM products
WHERE prod_price NOT BETWEEN 3 AND 5;

-- LIKE 操作符在 WHERE 子句中使用，作用是确定字符串是否匹配模式。
-- 只有字段是文本值时才使用 LIKE 。
-- LIKE 支持两个通配符匹配选项 ： % 和 _ 。
-- 不要滥用通配符 ， 通配符位于开头处匹配会非常慢 。
-- % 表示任何字符出现任意次数 。替代 0 个或多个字符
-- _ 表示任何字符出现一次 。替代一个字符
-- [charlist] 字符列中的任何单一字符
-- [^charlist] 以字符列中的字符开头的 
-- [!charlist] 不在字符列中的任何单一字符
-- 选取 name 以 "G" 、 "F" 或 "s" 开始的所有网站
SELECT  *
FROM Websites
WHERE name REGEXP '^[GFs]';

-- 选取 name 以 A 到 H 字母开头的网站 ：
SELECT  *
FROM Websites
WHERE name REGEXP '^[A-H]';

-- 如果一个 JOIN 至少有一个公共字段并且它们之间存在关系，则该 JOIN 可以在两个或多个表上工作。
-- 连接用于连接多个表，使用 JOIN 关键字，并且条件语句使用 ON 而不是 WHERE 。
-- JOIN 保持基表 （ 结构和数据 ） 不变 。
-- JOIN 有两种连接类型 ： 内连接和外连接 。
-- 内连接又称等值连接 ， 使用 INNER JOIN 关键字 。 在没有条件语句的情况下返 回笛卡尔积 。
-- 自连接可以看成内连接的一种 ， 只是连接的表是自身而已 。
-- 自然连接是把同名列通过 = 测试连接起来的 ， 同名列可以有多个 。
-- 内连接 vs 自然连接：内连接提供连接的列 ， 而自然连接自动连接所有同名列 。
-- 外连接返回一个表中的所有行 ， 并且仅返回来自次表中满足连接条件的那些 行 ， 即两个表中的列是相等的 。 外连接分为左外连接 、 右外连接 、 全外连接 （ Mysql 不支持 ） 。
-- 左外连接就是保留左表没有关联的行 。
-- 右外连接就是保留右表没有关联的行
-- 连接 vs 子查询：连接可以替换子查询 ， 并且比子查询的效率一般会更快 。
-- 内连接 （ INNER JOIN ）
SELECT  vend_name
       ,prod_name
       ,prod_price
FROM vendors
INNER JOIN products
ON vendors.vend_id = products.vend_id;

-- 自连接
SELECT  c1.cust_id
       ,c1.cust_name
       ,c1.cust_contact
FROM customers c1, customers c2
WHERE c1.cust_name = c2.cust_name
AND c2.cust_contact = 'Jim Jones';

-- 自然连接 （ NATURAL JOIN ）
SELECT  *
FROM Products NATURAL
JOIN Customers;

-- 左连接 （ LEFT JOIN ）
SELECT  customers.cust_id
       ,orders.order_num
FROM customers
LEFT JOIN orders
ON customers.cust_id = orders.cust_id;

-- 右连接 （ RIGHT JOIN ）
SELECT  customers.cust_id
       ,orders.order_num
FROM customers
RIGHT JOIN orders
ON customers.cust_id = orders.cust_id;

-- UNION 运算符将两个或更多查询的结果组合起来，并生成一个结果集，其中包含来 自 UNION 中参与查询的提取行。
-- UNION 基本规则：
-- 所有查询的列数和列顺序必须相同 。
-- 每个查询中涉及表的列的数据类型必须相同或兼容 。
-- 通常返回的列名取自第一个查询 。
-- 默认会去除相同行，如果需要保留相同行，使用 UNION ALL 。
-- 只能包含一个 ORDER BY 子句，并且必须位于语句的最后。
-- 应用场景：在一个查询中从不同的表返回结构数据 。对一个表执行多个查询 ， 按一个查询返回数据 。
-- 组合查询
SELECT  cust_name
       ,cust_contact
       ,cust_email
FROM customers
WHERE cust_state IN ('IL', 'IN', 'MI')
UNION
SELECT  cust_name
       ,cust_contact
       ,cust_email
FROM customers
WHERE cust_name = 'Fun4All';

-- JOIN vs UNION
-- JOIN 中连接表的列可能不同，但在 UNION 中，所有查询的列数和列顺序必须相同。
-- UNION 将查询之后的行放在一起（垂直放置），但 JOIN 将查询之后的列放在一起（水平放置），即它构成一个笛卡尔积。
-- ORDER BY：用于对结果集进行排序 。ASC ： 升序 （ 默认 ）。DESC ： 降序
-- 可以按多个列进行排序 ， 并且为每个列指定不同的排序方式
-- 指定多个列的排序方向
SELECT *
FROM products
ORDER BY prod_price DESC, prod_name ASC;

-- GROUP BY
-- GROUP BY 子句将记录分组到汇总行中。
-- GROUP BY 为每个组返回一个记录。
-- GROUP BY 通常还涉及聚合：COUNT，MAX，SUM，AVG 等。
-- GROUP BY 可以按一列或多列进行分组。
-- GROUP BY 按分组字段进行排序后， ORDER BY 可以以汇总字段来进行排序。
-- 分组
SELECT cust_name, COUNT(cust_address) AS addr_num
FROM Customers
GROUP BY  cust_name;

-- 分组后排序
SELECT cust_name, COUNT(cust_address) AS addr_num
FROM Customers
GROUP BY  cust_name
ORDER BY cust_name DESC;

-- HAVING 用于对汇总的 GROUP BY 结果进行过滤。
-- HAVING 要求存在一个 GROUP BY 子句。
-- WHERE 和 HAVING 可以在相同的查询中。
-- HAVING VS WHERE：WHERE 和 HAVING 都是用于过滤。HAVING 适用于汇总的组记录；而 WHERE 适用于单个记录。
-- 使用 WHERE 和 HAVING 过滤数据
SELECT  cust_name
       ,COUNT(*) AS num
FROM Customers
WHERE cust_email IS NOT NULL
GROUP BY  cust_name
HAVING COUNT(*) = 1;

-- 数据定义(DDL)，DDL的主要功能是定义数据库对象（ 如：数据库、数据表、视图、索引等）。
-- 视图 （ VIEW ）
-- 定义: 1.视图是基于SQL语句的结果集的可视化的表。2.视图是虚拟的表，本身不包含数据，也就不能对其进行索引操作。对视图的操作和对普通表的操作一样。 
-- 作用: 1.简化复杂的SQL操作，比如复杂的联结；2.只使用实际表的一部分数据；3.通过只给用户访问视图的权限，保证数据的安全性；4.更改数据格式和表示。
-- 创建视图
CREATE VIEW top_10_user_view AS
SELECT  id
       ,username
FROM user
WHERE id < 10;

-- 删除视图
DROP VIEW top_10_user_view;


-- 索引（INDEX）

-- 作用：1.通过索引可以更加快速高效地查询数据。2.用户无法看到索引，它们只能被用来加速查询。
-- 注意：更新一个包含索引的表需要比更新一个没有索引的表花费更多的时间，这是由于索引本身也需要更新。因此，理想的做法是仅仅在常常被搜索的列（以及表）上面创建索引。
-- 唯一索引：唯一索引表明此索引的每一个索引值只对应唯一的数据记录。

-- SQL 约束用于规定表中的数据规则。
-- 如果存在违反约束的数据行为，行为会被约束终止。
-- 约束可以在创建表时规定（通过 CREATE TABLE 语句），或者在表创建之后规定（通过 ALTER TABLE 语句）。
-- 约束类型:
-- NOT NULL - 指示某列不能存储 NULL 值。
-- UNIQUE - 保证某列的每行必须有唯一的值。
-- PRIMARY KEY - NOT NULL 和 UNIQUE 的结合。确保某列（或两个列多个列的结合）有唯一标识，有助于更容易更快速地找到表中的一个特定的记录。
-- FOREIGN KEY - 保证一个表中的数据匹配另一个表中的值的参照完整性。
-- CHECK - 保证列中的值符合指定的条件。
-- DEFAULT - 规定没有给列赋值时的默认值。

CREATE TABLE `Users` (
  `Id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增Id',
  `Username` VARCHAR(64) NOT NULL UNIQUE DEFAULT 'default' COMMENT '用户名',
  `Password` VARCHAR(64) NOT NULL DEFAULT 'default' COMMENT '密码',
  `Email` VARCHAR(64) NOT NULL DEFAULT 'default' COMMENT '邮箱地址',
  `Enabled` TINYINT(4) DEFAULT NULL COMMENT '是否有效',
  PRIMARY KEY (Id)
) ENGINE=InnoDB AUTO_INCREMENT=2 
DEFAULT CHARSET=utf8mb4 
COMMENT='用户表';


-- 事务处理(TCL)
-- 不能回退 SELECT 语句，回退 SELECT 语句也没意义；也不能回退CREATE 和 DROP 语句。
-- MySQL 默认是隐式提交，每执行一条语句就把这条语句当成一个事务然后进行提交。当出现 START TRANSACTION 语句时，会关闭隐式提交；
-- 当 COMMIT 或 ROLLBACK 语句执行后，事务会自动关闭，重新恢复隐式提交。
-- 通过 set autocommit=0 可以取消自动提交， 直到 set autocommit=1 才会提交；autocommit 标记是针对每个连接而不是针对服务器的。
-- 指令:
-- START TRANSACTION - 指令用于标记事务的起始点。
-- SAVEPOINT - 指令用于创建保留点。
-- ROLLBACK TO - 指令用于回滚到指定的保留点；如果没有设置保留点，则回退到 START TRANSACTION 语句处。
-- COMMIT - 提交事务
CREATE TABLE `Users` (
  `Id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增Id',
  `Username` VARCHAR(64) NOT NULL UNIQUE DEFAULT 'default' COMMENT '用户名',
  `Password` VARCHAR(64) NOT NULL DEFAULT 'default' COMMENT '密码',
  `Email` VARCHAR(64) NOT NULL DEFAULT 'default' COMMENT '邮箱地址',
  `Enabled` TINYINT(4) DEFAULT NULL COMMENT '是否有效',
  PRIMARY KEY (Id)
) 
ENGINE=InnoDB 
AUTO_INCREMENT=2 
DEFAULT CHARSET=utf8mb4 
COMMENT='用户表';

-- 开始事务
START TRANSACTION;
-- 插入操作 A
INSERT INTO `user`
VALUES (1, 'root1', 'root1', 'xxxx@163.com');
-- 创建保留点 updateA
SAVEPOINT updateA;
-- 插入操作 B
INSERT INTO `user`
VALUES (2, 'root2', 'root2', 'xxxx@163.com');
-- 回滚到保留点 updateA
ROLLBACK TO updateA;
-- 提交事务，只有操作 A 生效
COMMIT;

-- 权限控制(DCL)
-- GRANT 和 REVOKE 可在几个层次上控制访问权限：
-- 整个服务器，使用 GRANT ALL 和 REVOKE ALL；
-- 整个数据库，使用 ON database.*；
-- 特定的表，使用 ON database.table；
-- 特定的列；
-- 特定的存储过程。
-- 新创建的账户没有任何权限。
-- 账户用 username@host 的形式定义，username@% 使用的是默认主机名。
-- MySQL 的账户信息保存在 mysql 这个数据库中。
USE `mysql`;
SELECT user FROM `user`;
-- 创建账户 
CREATE USER myuser IDENTIFIED BY 'mypassword';
-- 修改账户名
UPDATE user SET user='newuser' WHERE user='myuser';
FLUSH PRIVILEGES;
-- 删除账户
DROP USER myuser;
-- 查看权限
SHOW GRANTS FOR myuser;
-- 授予权限
GRANT SELECT, INSERT ON *.* TO myuser;
-- 删除权限
REVOKE SELECT, INSERT ON *.* FROM myuser;
-- 更改密码
SET PASSWORD FOR myuser = 'mypass';

-- 触发器: 触发器是一种与表操作有关的数据库对象，当触发器所在表上出现指定事件时，将调用该对象，即表的操作事件触发表上的触发器的执行。
-- 可以使用触发器来进行审计跟踪，把修改记录到另外一张表中。
-- MySQL 不允许在触发器中使用 CALL 语句 ，也就是不能调用存储过程。
-- BEGIN 和 END
-- 当触发器的触发条件满足时，将会执行 BEGIN 和 END 之间的触发器执行动作。
-- 注意：在 MySQL 中，分号 ; 是语句结束的标识符，遇到分号表示该段语句已经结束，MySQL 可以开始执行了。
-- 因此，解释器遇到触发器执行动作中的分号后就开始执行，然后会报错，因为没有找到和 BEGIN 匹配的END。
-- 这时就会用到 DELIMITER 命令（DELIMITER 是定界符，分隔符的意思） 。它是一条命令， 不需要语句结束标识， 语法为： DELIMITER new_delemiter 。
-- new_delemiter 可以设为 1 个或多个长度的符号，默认的是分号 ; ，我们可以把它修改为其他符号，如 $ - DELIMITER $ 。
-- 在这之后的语句，以分号结束，解释器不会有什么反应，只有遇到了 $ ，才认为是语句结束。注意，使用完之后，我们还应该记得把它给修改回来。

-- NEW 和 OLD
-- MySQL 中定义了 NEW 和 OLD 关键字，用来表示触发器的所在表中，触发了触发器的那一行数据。
-- 在 INSERT 型触发器中， NEW 用来表示将要（ BEFORE ）或已经（ AFTER ）插入的新数据；
-- 在 UPDATE 型触发器中， OLD 用来表示将要或已经被修改的原数据， NEW用来表示将要或已经修改为的新数据；
-- 在 DELETE 型触发器中， OLD 用来表示将要或已经被删除的原数据；
-- 使用方法： NEW.columnName （columnName 为相应数据表某一列名）

-- CREATE TRIGGER 指令用于创建触发器。
-- CREATE TRIGGER trigger_name trigger_time trigger_event ON table_name FOR EACH ROW BEGIN trigger_statements END;
-- trigger_name：触发器名
-- trigger_time: 触发器的触发时机。取值为 BEFORE 或 AFTER 。
-- trigger_event: 触发器的监听事件。取值为 INSERT 、UPDATE 或 DELETE 。
-- table_name: 触发器的监听目标。指定在哪张表上建立触发器。
-- FOR EACH ROW: 行级监视，Mysql 固定写法，其他 DBMS 不同。
-- trigger_statements: 触发器执行动作。是一条或多条 SQL 语句的列表，列表内的每条语句都必须用分号 ; 来结尾。

DELIMITER $
CREATE TRIGGER `trigger_insert_user` AFTER INSERT
ON `user` FOR EACH ROW BEGIN
INSERT INTO `user_history`(user_id, operate_type, operate_time) VALUES (NEW.id, 'add a user', now()); END $ DELIMITER;



-- 存储过程
-- 存储过程可以看成是对一系列 SQL 操作的批处理；

-- 使用存储过程的好处：
-- 代码封装，保证了一定的安全性；
-- 代码复用；
-- 由于是预先编译，因此具有很高的性能。

-- 创建存储过程：
-- 命令行中创建存储过程需要自定义分隔符，因为命令行是以 ;
-- 为结束符，而存储过程中也包含了分号，因此会错误把这部分分号当成是结束符，造成语法错误。
-- 包含 in、out 和 inout 三种参数。
-- 给变量赋值都需要用 select into 语句。
-- 每次只能给一个变量赋值，不支持集合的操作。
-- 创建存储过程
DROP PROCEDURE IF EXISTS `proc_adder`;
--  定义分隔符
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `proc_adder`(IN a int, IN
b int, OUT sum int)
BEGIN
DECLARE c int;
if a is null then set a = 0;
end if;
if b is null then set b = 0;
end if;
set sum = a + b;
END
;;
DELIMITER ;

-- 使用存储过程 
set @b=5;
call proc_adder(2,@b,@s);
select @s as sum;

--  游标
-- 游标（cursor）是一个存储在 DBMS 服务器上的数据库查询，它不是一条 SELECT 语句，而是被该语句检索出来的结果集。
-- 在存储过程中使用游标可以对一个结果集进行移动遍历。
-- 游标主要用于交互式应用，其中用户需要对数据集中的任意行进行浏览和修改。
-- 使用游标的四个步骤：
-- 1.声明游标，这个过程没有实际检索出数据；
-- 2.打开游标；
-- 3.取出数据；
-- 4.关闭游标；

DELIMITER $
CREATE PROCEDURE getTotal()
BEGIN
  DECLARE total INT;
  -- 创建接收游标数据的变量
  DECLARE sid INT;
  DECLARE sname VARCHAR(10);
  -- 创建总数变量
  DECLARE sage INT;
  -- 创建结束标志变量
  DECLARE done INT DEFAULT false;
  -- 创建游标
  DECLARE cur CURSOR FOR SELECT id,name,age from cursor_table where age>30;
  -- 指定游标循环结束时的返回值
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = true;
  SET total = 0;
  OPEN cur;
  FETCH cur INTO sid, sname, sage;
  WHILE(NOT done)
  DO
  SET total = total + 1;
  FETCH cur INTO sid, sname, sage;
  END WHILE;
  CLOSE cur;
  SELECT total;
END $
DELIMITER ;
-- 调用存储过程
call getTotal();





