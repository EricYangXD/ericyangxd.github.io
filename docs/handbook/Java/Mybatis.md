---
title: MyBatis
author: EricYangXD
date: "2023-07-13"
meta:
  - name: keywords
    content: MyBatis
---

## 入门知识

用于操作数据库

## 举例

### 使用 MyBatis 查询所有用户数据

1. 准备工作：创建 SpringBoot 工程，数据库表 User，实体类 User，字段和属性最好一一对应起来
2. 引入 MyBatis 的相关依赖，配置 MyBatis（数据库的连接信息等）
3. 编写 SQL 语句（注解/xml）

- 创建 idea 项目时，勾选 MyBatisFramework 和 MySQLDriver（驱动）
- 数据库连接的四要素：在 application.properties 中配置
  - spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
  - spring.datasource.url=jdbc:mysql://localhost:3306/db_name
  - spring.datasource.username=root
  - spring.datasource.password=123456
- @Mapper: 在接口上使用，表示这个接口是 MyBatis 的 Mapper 接口，可以被 SpringBoot 扫描到。（属于 DAO 层）
- @MapperScan：在启动类上使用，表示扫描 MyBatis 的 Mapper 接口

```java
@Mapper
public interface UserMapper {
    @Select("select * from user")
    public List<User> list();
}

@Mapper
public interface EmpMapper {
    @Delete("delele from emp where id=#{id}")
    public void delete(Integer id);
}
```

- 技巧：在注解中写 SQL 语句时，可以先通过设置：`选中SQL语句->Show Context Actions->Inject language or reference->MySQL(SQL)`，然后再写 SQL 语句，这样就可以有语法提示了！！！
- 如果表名爆红，那可能是因为表名和数据库名不一致，可以在 `application.properties` 中配置：`spring.datasource.name=db_name`，这样就可以了

4. jdbc：Java Database Connectivity，Java 数据库连接，是一种用于执行 SQL 语句的 Java API，可以为多种关系数据库提供统一访问，它由一组用 Java 语言编写的类和接口组成。JDBC 提供了一种基准，据此可以构建更高级的工具和接口，使数据库开发人员能够编写数据库应用程序。
5. 数据库连接池：是一个容器，负责分配、管理数据库链接，资源复用、提升系统响应速度，要实现 oracle 的 DataSource 接口
6. 数据库连接池工具：`C3P0、DBCP、Druid（alibaba）、Hikari（default）`
7. lombok：可以通过注解的方式，简化代码，比如：`@Data、@Getter、@Setter、@ToString、@NoArgsConstructor、@AllArgsConstructor、@EqualsAndHashCode、@Slf4j、@Log4j、@Log4j2、@Log、@CommonsLog、@Flogger、@JBossLog、@XSlf4j、@CustomLog`
8. 测试的时候可以通过`@Autowired` 注入 Mapper，然后调用方法，不需要手动创建 Mapper 对象
9. 预编译 sql 语句：使用 PreparedStatement，可以防止 sql 注入，提高性能
10. update 的时候，使用的是属性名，而不是数据库的字段名。新增（主键返回）：`@Options(useGeneratedKeys = true, keyProperty = "id")`
11. 实体类属性名和数据库表查询返回的字段名一致，MyBatis 会自动封装，不一致的话，需要手动封装：例如
12. 设置别名，`select id userid, name username, pwd password from user`。
13. 通过@Results 注解手动映射封装，`@Results(id = "userMap", value = {@Result(id = true, column = "id", property = "userid"), @Result(column = "name", property = "username"), @Result(column = "pwd", property = "password")})`，然后在@Select 注解中使用：`@ResultMap(value = {"userMap"})`。
14. 在 `application.properties` 中开启 MyBatis 的驼峰命名自动映射开关：`mybatis.configuration.map-underscore-to-camel-case=true`。需要严格遵守驼峰命名规则。
15. 使用 concat 函数拼接字符串，`select id, name, pwd from user where name like concat('%', #{name}, '%')`。
16. xml 映射文件规范：
    1. xml 映射文件的名称与 mapper 接口的名称相同，且在同一个目录下（同包同名）
    2. xml 映射文件的 namespace 属性与 mapper 接口全限定名相同
    3. xml 映射文件中 sql 语句的 id 属性值必须与 mapper 接口中的方法名相同，并且保持返回类型一致
17. 简单的 sql 用注解，复杂的用 xml 映射
18. 动态 SQL：`<where> <if test="xxx"> sql </if></where>`，`where`标签可以消除第一个判断不成立时后续判断中的`and`等问题，`<set>`用在 update 语句中可以去除语句中多余的`,`
    1. if 用于判断条件是否成立，成立则拼接 sql 语句，形式：`<if test="name!=null">...</if>`
    2. where 元素只会在至少有一个子元素的条件返回 SQL 子句的情况下才去插入“WHERE”子句。而且，若语句的开头为“AND”或“OR”，where 元素也会将它们去除。
    3. set 动态的更新语句，只会在至少有一个子元素的条件返回 SQL 子句的情况下才去插入“SET”子句。而且，若语句的开头为“,”，set 元素也会将它们去除。
    4. foreach 用于遍历集合或数组，形式：`<foreach collection="list" item="item" index="index" open="(" close=")" separator=",">#{item}</foreach>`
    5. include 用于引入外部 sql 文件(也可以直接在 xml 中通过`<sql id="xxx"></sql>`标签直接定义可重用的 sql 片段)，形式：`<include refid="userMap"/>`，引入的 sql 文件中的 sql 语句的 id 属性值必须与 mapper 接口中的方法名相同，并且保持返回类型一致
19. `<select></select>`


## MyBatis Plus

MyBatis Plus （简称 MP） 是一款持久层框架，说白话就是一款操作数据库的框架。它是一个 MyBatis 的增强工具，就像 iPhone手机一般都有个 plus 版本一样，它在 MyBatis 的基础上只做增强不做改变，为简化开发、提高效率而生。


```xml
  <!-- Mybatis Plus -->
  <dependency>
      <groupId>com.baomidou</groupId>
      <artifactId>mybatis-plus-boot-starter</artifactId>
      <version>${mybatis-plus.version}</version>
  </dependency>
```


1. p6spy 组件打印完整的 SQL 语句、执行耗时。请使用 Mybatis Plus 3.1.0 以上版本。
2. 不要在生产环境用！
3. 序列化反序列化：

```java
//序列化操作
ObjectMapper objectMapper = new ObjectMapper();
String jsonStr = objectMapper.writeValueAsString(list);
System.out.println(jsonStr);
//反序列化操作
List<Video> temp = objectMapper.readValue(jsonStr,List.class);
```
4. jackson处理相关自动
    - 指定字段不返回：`@JsonIgnore`
    - 指定日期格式：`@JsonFormat(pattern="yyyy-MM-dd hh:mm:ss",locale="zh",timezone="GMT+8")`
    - 空字段不返回：`@JsonInclude(Include.NON_NULL)`
    - 指定别名：`@JsonProperty`

5. 数据库字段使用下划线命名，代码中会自动转为驼峰命名
6. 排除非表字段的三种方式：实体中的某个变量不对应数据库表中的任何字段时：
   1. 使用transient关键字，但是就不会被序列化了
   2. 使用static关键字，需要生成get、set方法，但是是静态的共用的，不推荐
   3. 使用@TableField(exist = false)注解
7. 普通条件构造器：

```java
  // 2种方式
  QueryWrapper<UserDO> queryWrapper1 = new QueryWrapper<UserDO>();
  QueryWrapper<UserDO> queryWrapper2 = Wrappers.<UserDO>query();

  queryWrapper1.like("username", "犬").lt("age", 50);
  // queryWrapper.select("id","username","age").like("username", "犬").lt("age", 50);
  // 返回值中不包含null的项
  List<Map<String, Object>> userList = userMapper.selectMaps(queryWrapper1);
  userList.forEach(System.out::println);
```

8. Lambda条件构造器：还可防误写，直接调方法名，防止打错字。
```java
  // 四种方式
  LambdaQueryWrapper<UserDO> user1 = new QueryWrapper<UserDO>().lambda();
  LambdaQueryWrapper<UserDO> user2 = new LambdaQueryWrapper<UserDO>();
  LambdaQueryWrapper<UserDO> user3 = Wrappers.<UserDO>lambdaQuery();

  user3.like(UserDO::getUsername, "犬").lt(UserDO::getAge, 50);
  userMapper.selectList(user3).forEach(System.out::println);

  // 第四种
  LambdaQueryChainWrapper<UserDO> chainWrapper = new LambdaQueryChainWrapper<>(userMapper);
  List<UserDO> userList = chainWrapper.like(UserDO::getUsername, "犬").lt(UserDO::getAge, 50).list();
  userList.forEach(System.out::println);
```


### 常用注解

1. @TableName：用在DO上表示数据库表的别名，如果不加默认是类名
2. @TableId：用在DO的属性上，表示这个属性是主键，默认会找一个叫 id 的属性作为主键，如果没有，需要加上这个注解
3. @TableField：用在DO的属性上，可以表示这个属性对应数据库表的字段，如果不加默认是属性名
4. @TableField(condition = SqlCondition.LIKE_RIGHT)：表示在查询时使用LIKE_RIGHT而不是默认的EQUAL
5.
