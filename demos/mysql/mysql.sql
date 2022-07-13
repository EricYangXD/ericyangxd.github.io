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
    `major` VARCHAR(20)
    -- PRIMARY KEY(`student_id`) 
);
-- 展示table信息
DESCRIBE `student`;
-- 删除table
DROP TABLE `student`;
-- 选中某个table，然后再这个table中添加一个字段（列），并定义类型
ALTER TABLE `student` ADD gpa DECIMAL(3,2);
-- 从某个table中删除某一（字段）列
ALTER TABLE `student` DROP COLUMN gpa;

-- 写入内容
-- INSERT INTO `student` VALUES(1,'小白','历史',3.22);
INSERT INTO `student` VALUES(2,'小黑','生物');
INSERT INTO `student` VALUES(3,'小绿','英语');
INSERT INTO `student` VALUES(4,'小白','历史');
INSERT INTO `student` VALUES(5,'小黄','生物');
INSERT INTO `student`(`name`,`major`,`student_id`) VALUES('小杨','数学',6);

SELECT * FROM `student`;

-- 创建table，增加约束条件
CREATE TABLE `student`(
	`student_id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `major` VARCHAR(20) UNIQUE
    -- PRIMARY KEY(`student_id`) 
);

-- 修改删除
SET SQL_SAFE_UPDATES = 0;
-- 删除table
DROP TABLE `student`;
-- 创建table
CREATE TABLE `student`(
	`student_id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(20),
    `major` VARCHAR(20),
    `score` INT
    -- PRIMARY KEY(`student_id`) 
);
INSERT INTO `student` VALUES(1,'小黑','生物',88);
INSERT INTO `student` VALUES(2,'小王','英语',98);
INSERT INTO `student` VALUES(4,'小李','化学',69);
UPDATE `student` SET `major` = '德语' WHERE `major` = '英语'; 
UPDATE `student` SET `major` = '德语2' WHERE `student_id` = 2;
UPDATE `student` SET `major` = '生化' WHERE `major` = '生物' OR `major` = '化学';  
SELECT * FROM `student`;

DELETE FROM `student` WHERE `student_id` = 4 AND `name` = '小李';
DELETE FROM `student` WHERE `score` < 80;
DELETE FROM `student`; -- 清空这张表

-- 搜索、获取数据: 不等于:<>
SELECT `name`, `major` FROM `student` ORDER BY `score` DESC LIMIT 2;
SELECT `name`, `major` FROM `student` ORDER BY `score`, `student_id`;
SELECT * FROM `student` WHERE `major` IN('数学','物理','化学') ORDER BY `score`,`student_id`;

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
    FOREIGN KEY (`manager_id`) REFERENCES `employee`(`emp_id`) ON DELETE SET NULL
);

ALTER TABLE `employee` ADD FOREIGN KEY(`branch_id`) REFERENCES `branch`(`branch_id`) ON DELETE SET NULL;
ALTER TABLE `employee` ADD FOREIGN KEY(`sup_id`) REFERENCES `employee`(`emp_id`) ON DELETE SET NULL;

CREATE TABLE `client`(
	`client_id` INT PRIMARY KEY,
    `client_name` VARCHAR(20),
    `phone` INT
);

CREATE TABLE `works_with` (
    `emp_id` INT,
    `client_id` INT,
    `total_sales` INT,
     PRIMARY KEY(`emp_id`,`client_id`),
     FOREIGN KEY (`emp_id`) REFERENCES `employee`(`emp_id`) ON DELETE CASCADE,
     FOREIGN KEY (`client_id`) REFERENCES `client`(`client_id`) ON DELETE CASCADE
);

# 有外键的时候，先把外键写成null，然后创建完成后再改回来
INSERT INTO `branch` VALUES(1,'研发',NULL);
INSERT INTO `branch` VALUES(2,'行政',NULL);
INSERT INTO `branch` VALUES(3,'资讯',NULL);
SELECT * FROM `branch`;

UPDATE `branch` SET `manager_id` = 206 WHERE `branch_id` = 1; 
UPDATE `branch` SET `manager_id` = 207 WHERE `branch_id` = 2; 
UPDATE `branch` SET `manager_id` = 208 WHERE `branch_id` = 3; 

INSERT INTO `employee` VALUES(206,'小黄','1998-10-08','F',50000,1,NULL);
INSERT INTO `employee` VALUES(207,'小绿','1985-09-16','M',29000,1,206);
INSERT INTO `employee` VALUES(208,'小黑','2000-12-19','M',35000,1,206);
INSERT INTO `employee` VALUES(209,'小白','1997-01-22','F',39000,1,207);
INSERT INTO `employee` VALUES(210,'小蓝','1925-11-10','F',84000,1,207);
SELECT * FROM `employee`;


INSERT INTO `client` VALUES(400,'阿狗','254354335');
INSERT INTO `client` VALUES(401,'阿猫','25633899');
INSERT INTO `client` VALUES(402,'旺来','45354345');
INSERT INTO `client` VALUES(403,'露西','54354365');
INSERT INTO `client` VALUES(404,'艾瑞克','18783783');


INSERT INTO `works_with` VALUES(206,400,'70000');
INSERT INTO `works_with` VALUES(207,401,'24000');
INSERT INTO `works_with` VALUES(208,402,'9800');
INSERT INTO `works_with` VALUES(209,403,'24000');
INSERT INTO `works_with` VALUES(210,404,'87940');

# 取得所有员工资料
SELECT * FROM `employee`;

# 取得所有客户资料
SELECT * FROM `client`;

# 按薪水从低到高取得员工资料
SELECT * FROM `employee` ORDER BY `salary` ASC;

# 取得薪水前三高的员工
SELECT * FROM `employee` ORDER BY `salary` DESC LIMIT 3;

# 取得所有员工的名字 DISTINCT:去重
SELECT `name` FROM `employee`;


# 聚合函数
SELECT COUNT(*) from `employee`;

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

SELECT SUM(`salary`) from `employee`;

SELECT MAX(`salary`) from `employee`;

SELECT MIN(`salary`) from `employee`;

# 通用占位符  %：代表多个字符；_：代表一个字符；

SELECT * FROM `client` WHERE `phone` LIKE '%335';
SELECT * FROM `employee` WHERE `birth_date` LIKE '_____09%';

# union 联合:属性数量和类型要一致
SELECT `name` FROM `employee` UNION SELECT `client_name` FROM `client`;
 
SELECT `emp_id`,`name` FROM `employee` UNION SELECT `client_id`,`client_name` FROM `client`; 

SELECT `salary` FROM `employee` UNION SELECT `total_sales` FROM `works_with`;


# JOIN 连接
INSERT INTO `branch` VALUES(4,'偷懒',NULL);

SELECT * FROM `employee` JOIN `branch` ON `emp_id`=`manager_id`;
SELECT `emp_id`,`name`,`branch_name` FROM `employee` JOIN `branch` ON `employee`.`emp_id`=`branch`.`manager_id`;
# 在JOIN的左边就是左边表格，在右边就是右边表格，LEFT JOIN:左边的表格不管条件有没有成立，都会返回左侧的所有内容。
SELECT `emp_id`,`name`,`branch_name` FROM `employee` LEFT JOIN `branch` ON `employee`.`emp_id`=`branch`.`manager_id`;
SELECT `emp_id`,`name`,`branch_name` FROM `employee` RIGHT JOIN `branch` ON `employee`.`emp_id`=`branch`.`manager_id`;

SELECT * FROM `employee`;
SELECT * FROM `client`;
SELECT * FROM `branch`;

# subquery 子查询，在一个查询语句中使用另一个查询语句的结果
# 找出研发部经理的名字
SELECT `manager_id` FROM `branch` WHERE `branch_name`='研发';

SELECT 
    `name`
FROM
    `employee`
WHERE
    `emp_id` = (SELECT 
            `manager_id`
        FROM
            `branch`
        WHERE
            `branch_name` = '研发');

# 找出对单一客户销售金额超过50000的员工的名字，多个子结果的时候用 IN

SELECT 
    `name`
FROM
    `employee`
WHERE
    `emp_id` IN (SELECT 
            `emp_id`
        FROM
            `works_with`
        WHERE
            `total_sales` > 50000);


# on delete set null: 对应的key删掉之后自动置成null，主键不能被设置成null！！！
# on delete cascade：对应不到时，直接一起删掉




