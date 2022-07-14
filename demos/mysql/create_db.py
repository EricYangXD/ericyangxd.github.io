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

