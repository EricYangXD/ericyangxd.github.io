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
CREATE TABLE `student`(
    `student_id` INT PRIMARY KEY,
    `name` VARCHAR(20),
    `major` VARCHAR(20) -- PRIMARY KEY(`student_id`) 
) COMMENT = '学生表';

-- 根据已有的表创建新表
CREATE TABLE vip_user AS
SELECT
    *
FROM
    user;

-- 展示table信息
DESCRIBE `student`;

-- 删除table
DROP TABLE `student`;

-- 选中某个table，然后再这个table中添加一个字段（列），并定义类型
ALTER TABLE
    `student`
ADD
    gpa DECIMAL(3, 2);

-- 从某个table中删除某一（字段）列
ALTER TABLE
    `student` DROP COLUMN gpa;

-- 修改列
ALTER TABLE
    `user`
MODIFY
    COLUMN age tinyint;

-- 添加主键
ALTER TABLE
    user
ADD
    PRIMARY KEY (id);

-- 删除主键
ALTER TABLE
    user DROP PRIMARY KEY;

-- CRUD(Create, Read, Update, Delete)，即增删改查。
--  INSERT 、 UPDATE 、 DELETE 、 SELECT
-- 写入内容
-- INSERT INTO `student` VALUES(1,'小白','历史',3.22);
INSERT INTO
    `student`
VALUES
    (2, '小黑', '生物');

INSERT INTO
    `student`
VALUES
    (3, '小绿', '英语');

INSERT INTO
    `student`
VALUES
    (4, '小白', '历史');

INSERT INTO
    `student`
VALUES
    (5, '小黄', '生物');

INSERT INTO
    `student`(`name`, `major`, `student_id`)
VALUES
    ('小杨', '数学', 6);

SELECT
    *
FROM
    `student`;

-- 创建table，增加约束条件
CREATE TABLE `student`(
    `student_id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `major` VARCHAR(20) UNIQUE -- PRIMARY KEY(`student_id`) 
);

-- 修改删除
SET
    SQL_SAFE_UPDATES = 0;

-- 删除table
DROP TABLE `student`;

-- 创建table
CREATE TABLE `student`(
    `student_id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(20),
    `major` VARCHAR(20),
    `score` INT -- PRIMARY KEY(`student_id`) 
);

INSERT INTO
    `student`
VALUES
    (1, '小黑', '生物', 88);

INSERT INTO
    `student`
VALUES
    (2, '小王', '英语', 98);

INSERT INTO
    `student`
VALUES
    (4, '小李', '化学', 69);

-- 插入行的一部分
INSERT INTO
    user(username, password, email)
VALUES
    ('admin', 'admin', 'xxxx@163.com');

-- 插入查询出来的数据
INSERT INTO
    user(username)
SELECT
    name
FROM
    account;

UPDATE
    `student`
SET
    `major` = '德语'
WHERE
    `major` = '英语';

UPDATE
    `student`
SET
    `major` = '德语2'
WHERE
    `student_id` = 2;

UPDATE
    `student`
SET
    `major` = '生化'
WHERE
    `major` = '生物'
    OR `major` = '化学';

UPDATE
    user
SET
    username = 'robot',
    password = 'robot'
WHERE
    username = 'root';

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
    prod_price BETWEEN 3
    AND 5;

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
CREATE TABLE `employee`(
    `emp_id` INT PRIMARY KEY,
    `name` VARCHAR(20),
    `birth_date` DATE,
    `sex` VARCHAR(1),
    `salary` INT,
    `branch_id` INT,
    `sup_id` INT
);

DROP TABLE `Employee`;

-- 先创建table之后才能去关联「外键」
CREATE TABLE `branch`(
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

CREATE TABLE `client`(
    `client_id` INT PRIMARY KEY,
    `client_name` VARCHAR(20),
    `phone` INT
);

CREATE TABLE `works_with` (
    `emp_id` INT,
    `client_id` INT,
    `total_sales` INT,
    PRIMARY KEY(`emp_id`, `client_id`),
    FOREIGN KEY (`emp_id`) REFERENCES `employee`(`emp_id`) ON DELETE CASCADE,
    FOREIGN KEY (`client_id`) REFERENCES `client`(`client_id`) ON DELETE CASCADE
);

-- 有外键的时候，先把外键写成null，然后创建完成后再改回来
INSERT INTO
    `branch`
VALUES
    (1, '研发', NULL);

INSERT INTO
    `branch`
VALUES
    (2, '行政', NULL);

INSERT INTO
    `branch`
VALUES
    (3, '资讯', NULL);

SELECT
    *
FROM
    `branch`;

UPDATE
    `branch`
SET
    `manager_id` = 206
WHERE
    `branch_id` = 1;

UPDATE
    `branch`
SET
    `manager_id` = 207
WHERE
    `branch_id` = 2;

UPDATE
    `branch`
SET
    `manager_id` = 208
WHERE
    `branch_id` = 3;

INSERT INTO
    `employee`
VALUES
    (206, '小黄', '1998-10-08', 'F', 50000, 1, NULL);

INSERT INTO
    `employee`
VALUES
    (207, '小绿', '1985-09-16', 'M', 29000, 1, 206);

INSERT INTO
    `employee`
VALUES
    (208, '小黑', '2000-12-19', 'M', 35000, 1, 206);

INSERT INTO
    `employee`
VALUES
    (209, '小白', '1997-01-22', 'F', 39000, 1, 207);

INSERT INTO
    `employee`
VALUES
    (210, '小蓝', '1925-11-10', 'F', 84000, 1, 207);

SELECT
    *
FROM
    `employee`;

INSERT INTO
    `client`
VALUES
    (400, '阿狗', '254354335');

INSERT INTO
    `client`
VALUES
    (401, '阿猫', '25633899');

INSERT INTO
    `client`
VALUES
    (402, '旺来', '45354345');

INSERT INTO
    `client`
VALUES
    (403, '露西', '54354365');

INSERT INTO
    `client`
VALUES
    (404, '艾瑞克', '18783783');

INSERT INTO
    `works_with`
VALUES
    (206, 400, '70000');

INSERT INTO
    `works_with`
VALUES
    (207, 401, '24000');

INSERT INTO
    `works_with`
VALUES
    (208, 402, '9800');

INSERT INTO
    `works_with`
VALUES
    (209, 403, '24000');

INSERT INTO
    `works_with`
VALUES
    (210, 404, '87940');

-- 取得所有员工资料
SELECT
    *
FROM
    `employee`;

-- 取得所有客户资料
SELECT
    *
FROM
    `client`;

-- 按薪水从低到高取得员工资料
SELECT
    *
FROM
    `employee`
ORDER BY
    `salary` ASC;

-- LIMIT：限制返回的行数 。 可以有两个参数 ， 第一个参数为起始行 ， 从 0 开 始 ； 第二个参数为返回的总行数 。 ASC ： 升序 （ 默认 ） DESC ： 降序
-- 取得薪水前三高的员工
SELECT
    *
FROM
    `employee`
ORDER BY
    `salary` DESC
LIMIT
    3;

-- 返回第 3 ~ 5 行
SELECT
    *
FROM
    mytable
LIMIT
    2, 3;

-- 取得所有员工的名字。DISTINCT：去重--用于返回唯一不同的值。它作用于所有列，也就是说所有列的值都相同才算相同 。
SELECT
    `name`
FROM
    `employee`;

-- 聚合函数
SELECT
    COUNT(*)
from
    `employee`;

SELECT
    COUNT(*)
FROM
    `employee`
WHERE
    `birth_date` > '1970-01-01'
    AND `sex` = 'F';

SELECT
    AVG(`salary`)
FROM
    `employee`;

SELECT
    SUM(`salary`)
from
    `employee`;

SELECT
    MAX(`salary`)
from
    `employee`;

SELECT
    MIN(`salary`)
from
    `employee`;

-- 通用占位符  %：代表多个字符；_：代表一个字符；
SELECT
    *
FROM
    `client`
WHERE
    `phone` LIKE '%335';

SELECT
    *
FROM
    `employee`
WHERE
    `birth_date` LIKE '_____09%';

-- union 联合:属性数量和类型要一致
SELECT
    `name`
FROM
    `employee`
UNION
SELECT
    `client_name`
FROM
    `client`;

SELECT
    `emp_id`,
    `name`
FROM
    `employee`
UNION
SELECT
    `client_id`,
    `client_name`
FROM
    `client`;

SELECT
    `salary`
FROM
    `employee`
UNION
SELECT
    `total_sales`
FROM
    `works_with`;

-- JOIN 连接
INSERT INTO
    `branch`
VALUES
    (4, '偷懒', NULL);

SELECT
    *
FROM
    `employee`
    JOIN `branch` ON `emp_id` = `manager_id`;

SELECT
    `emp_id`,
    `name`,
    `branch_name`
FROM
    `employee`
    JOIN `branch` ON `employee`.`emp_id` = `branch`.`manager_id`;

-- 在JOIN的左边就是左边表格，在右边就是右边表格，LEFT JOIN:左边的表格不管条件有没有成立，都会返回左侧的所有内容。
SELECT
    `emp_id`,
    `name`,
    `branch_name`
FROM
    `employee`
    LEFT JOIN `branch` ON `employee`.`emp_id` = `branch`.`manager_id`;

SELECT
    `emp_id`,
    `name`,
    `branch_name`
FROM
    `employee`
    RIGHT JOIN `branch` ON `employee`.`emp_id` = `branch`.`manager_id`;

SELECT
    *
FROM
    `employee`;

SELECT
    *
FROM
    `client`;

SELECT
    *
FROM
    `branch`;

-- 子查询是嵌套在较大查询中的 SQL 查询 。 子查询也称为内部查询或内部 选择 ， 而包含子查询的语句也称为外部查询或外部选择 。
-- 子查询可以嵌套在 SELECT ， INSERT ， UPDATE 或 DELETE 语句内或另一个子查询中。
-- 子查询通常会在另一个 SELECT 语句的 WHERE 子句中添加。
-- 您可以使用比较运算符，如 > ， < ，或 = 。比较运算符也可以是多行运算符，如 IN ， ANY 或 ALL 。
-- 子查询必须被圆括号 () 括起来。
-- 内部查询首先在其父查询之前执行，以便可以将内部查询的结果传递给外部查询。
-- subquery 子查询，在一个查询语句中使用另一个查询语句的结果
-- 找出研发部经理的名字
SELECT
    `manager_id`
FROM
    `branch`
WHERE
    `branch_name` = '研发';

SELECT
    `name`
FROM
    `employee`
WHERE
    `emp_id` = (
        SELECT
            `manager_id`
        FROM
            `branch`
        WHERE
            `branch_name` = '研发'
    );

-- 找出对单一客户销售金额超过50000的员工的名字，多个子结果的时候用 IN
SELECT
    `name`
FROM
    `employee`
WHERE
    `emp_id` IN (
        SELECT
            `emp_id`
        FROM
            `works_with`
        WHERE
            `total_sales` > 50000
    );

-- on delete set null: 对应的key删掉之后自动置成null，主键不能被设置成null！！！
-- on delete cascade：对应不到时，直接一起删掉
-- AND 、OR 、 NOT 是用于对过滤条件的逻辑处理指令 。
-- AND 优先级高于OR ， 为了明确处理顺序 ， 可以使用 () 。
-- AND 操作符表示左右条件都要满足 。
SELECT
    prod_id,
    prod_name,
    prod_price
FROM
    products
WHERE
    vend_id = 'DLL01'
    AND prod_price = 4;

-- OR 操作符表示左右条件满足任意一个即可 。
SELECT
    prod_id,
    prod_name,
    prod_price
FROM
    products
WHERE
    vend_id = 'DLL01'
    OR vend_id = 'BRS01';

-- NOT 操作符用于否定一个条件 。
SELECT
    *
FROM
    products
WHERE
    prod_price NOT BETWEEN 3
    AND 5;

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
SELECT
    *
FROM
    Websites
WHERE
    name REGEXP '^[GFs]';

-- 选取 name 以 A 到 H 字母开头的网站 ：
SELECT
    *
FROM
    Websites
WHERE
    name REGEXP '^[A-H]';

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
SELECT
    vend_name,
    prod_name,
    prod_price
FROM
    vendors
    INNER JOIN products ON vendors.vend_id = products.vend_id;

-- 自连接
SELECT
    c1.cust_id,
    c1.cust_name,
    c1.cust_contact
FROM
    customers c1,
    customers c2
WHERE
    c1.cust_name = c2.cust_name
    AND c2.cust_contact = 'Jim Jones';

-- 自然连接 （ NATURAL JOIN ）
SELECT
    *
FROM
    Products NATURAL
    JOIN Customers;

-- 左连接 （ LEFT JOIN ）
SELECT
    customers.cust_id,
    orders.order_num
FROM
    customers
    LEFT JOIN orders ON customers.cust_id = orders.cust_id;

-- 右连接 （ RIGHT JOIN ）
SELECT
    customers.cust_id,
    orders.order_num
FROM
    customers
    RIGHT JOIN orders ON customers.cust_id = orders.cust_id;

-- UNION 运算符将两个或更多查询的结果组合起来，并生成一个结果集，其中包含来 自 UNION 中参与查询的提取行。
-- UNION 基本规则：
-- 所有查询的列数和列顺序必须相同 。
-- 每个查询中涉及表的列的数据类型必须相同或兼容 。
-- 通常返回的列名取自第一个查询 。
-- 默认会去除相同行，如果需要保留相同行，使用 UNION ALL 。
-- 只能包含一个 ORDER BY 子句，并且必须位于语句的最后。
-- 应用场景：在一个查询中从不同的表返回结构数据 。对一个表执行多个查询 ， 按一个查询返回数据 。
-- 组合查询
SELECT
    cust_name,
    cust_contact,
    cust_email
FROM
    customers
WHERE
    cust_state IN ('IL', 'IN', 'MI')
UNION
SELECT
    cust_name,
    cust_contact,
    cust_email
FROM
    customers
WHERE
    cust_name = 'Fun4All';

-- JOIN vs UNION
-- JOIN 中连接表的列可能不同，但在 UNION 中，所有查询的列数和列顺序必须相同。
-- UNION 将查询之后的行放在一起（垂直放置），但 JOIN 将查询之后的列放在一起（水平放置），即它构成一个笛卡尔积。
-- ORDER BY：用于对结果集进行排序 。ASC ： 升序 （ 默认 ）。DESC ： 降序
-- 可以按多个列进行排序 ， 并且为每个列指定不同的排序方式
-- 指定多个列的排序方向
SELECT
    *
FROM
    products
ORDER BY
    prod_price DESC,
    prod_name ASC;

-- GROUP BY
-- GROUP BY 子句将记录分组到汇总行中。
-- GROUP BY 为每个组返回一个记录。
-- GROUP BY 通常还涉及聚合：COUNT，MAX，SUM，AVG 等。
-- GROUP BY 可以按一列或多列进行分组。
-- GROUP BY 按分组字段进行排序后， ORDER BY 可以以汇总字段来进行排序。
-- 分组
SELECT
    cust_name,
    COUNT(cust_address) AS addr_num
FROM
    Customers
GROUP BY
    cust_name;

-- 分组后排序
SELECT
    cust_name,
    COUNT(cust_address) AS addr_num
FROM
    Customers
GROUP BY
    cust_name
ORDER BY
    cust_name DESC;

-- HAVING 用于对汇总的 GROUP BY 结果进行过滤。
-- HAVING 要求存在一个 GROUP BY 子句。
-- WHERE 和 HAVING 可以在相同的查询中。
-- HAVING VS WHERE：WHERE 和 HAVING 都是用于过滤。HAVING 适用于汇总的组记录；而 WHERE 适用于单个记录。
-- 使用 WHERE 和 HAVING 过滤数据
SELECT
    cust_name,
    COUNT(*) AS num
FROM
    Customers
WHERE
    cust_email IS NOT NULL
GROUP BY
    cust_name
HAVING
    COUNT(*) = 1;