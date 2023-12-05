---
title: Shell脚本每日一练
author: EricYangXD
date: "2023-09-20"
meta:
  - name: keywords
    content: Shell脚本每日一练
---

## B 站 Shell 脚本每日一练

边抄边练边背

### day01

遍历指定目录/data/下的指定类型 txt 文件并备份，备份的文件名增加一个年月日的后缀，例：eric.txt 备份为 eric.txt_20231205

```bash
#!/bin/bash
#author: EricYangXD
#version: v1.0
#date: 2023-12-05

# 定义后缀变量
suffix=`date +%Y%m%d`

# 遍历/data/目录下的txt文件，用for循环
for file in `find /data/ -type f -name "*.txt"`
do
  echo "backup file is $file"
  cp ${file} ${file}_${suffix}
done
```

1. `date +%Y%m%d` 用于获取当前日期，`%Y`表示年，`%m`表示月，`%d`表示日
2. for 循环遍历文件

### day02

创建十个用户user_00~user_09并设置随机密码，密码记录在文件userinfo.txt中

```bash
#!/bin/bash
#author: EricYangXD
#version: v1.0
#date: 2023-12-05

# 先查看userinfo.txt文件是否存在，不存在则创建，存在则清空
if [ -f /tmp/userinfo.txt ]
then
  rm -f /tmp/userinfo.txt
fi

# 判断mkpasswd命令是否存在，不存在则安装，用该命令生成随机密码
if ! which mkpasswd
then
  yum install -y expect
fi

# 借助seq命令生成数字序列，用for循环遍历
for i in `seq -w 0 09`
do
  # 每次生成一个随机字符串，将该字符串赋值给p变量，这就是用户的密码了
  # mkpasswd命令默认生成的字符串会包含大小写字母和数字和特殊符号，如果需要指定生成的字符串类型，可以使用-d参数，如-d digits表示只生成数字，如果不要求特殊字符，可以使用-s 0来禁用特殊字符
  p=`mkpasswd -l 15 -s 0`
  # 创建用户
  useradd user_${i} && echo "${p}" | passwd --stdin user_${i}
  echo "user_${i} ${p}" >> /tmp/userinfo.txt
done
```
1. `mkpasswd`可以生成随机字符串，-l参数指定字符串长度，-s参数指定特殊字符个数，-c指定小写字母个数，-C指定大写字母个数，-d指定数字个数，0表示禁用特殊字符
2. `seq`可以生成序列，-w参数指定宽度，-f参数指定格式，%02g表示两位数字，不足两位前面补0
3. `passwd --stdin`可以从标准输入中读取密码，这里用echo命令将密码传递给passwd命令

### day03

检测本机所有磁盘分区读写是否正常，如果可以正常新建和删除文件则说明正常

```bash
#!/bin/bash
#author: EricYangXD
#version: v1.0
#date: 2023-12-05

for mount_p in `df |sed '1d' |grep -v 'tmpfs' |awk '{print $NF}'`
do
  # 创建文件并删除
  touch $mount_p/eric.txt && rm -f $mount_p/eric.txt
  if [ $? -ne 0 ]
  then
    echo "$mount_p is error"
  else
    echo "$mount_p is good"
  fi
done
```
1. `df -h`获取挂载点
2. `sed '1d'`删除第一行，即标题行
3. `tmpfs`是内存文件系统，不需要检测，所以用`grep -v`过滤掉
4. `awk '{print $NF}'`获取最后一列，即挂载点
5.

### day04

检查/data/wwwroot/app目录下所有文件和目录：

1. 所有文件权限为644
2. 所有目录权限为755
3. 所有文件和目录的所有者和所属组都为www:root

如果不满足则改成满足，要有判断过程，而非直接改

```bash
#!/bin/bash
#author: EricYangXD
#version: v1.0
#date: 2023-12-05

cd /data/wwwroot/app
# 遍历所有文件和目录
for file in `find .`
do
  # 查看文件权限
  f_perm=`stat -c %a $file`
  # 查看文件所有者
  f_owner=`stat -c %U $file`
  # 查看文件所属组
  f_group=`stat -c %G $file`
  # 判断是否为目录
  if [ -d $file ]
  then
    [ $f_perm != '755' ] && chmod 755 $file
  else
    [ $f_perm != '644' ] && chmod 644 $file
  fi
  # then
  #   # 如果是目录，判断权限是否为755
  #   if [ $f_perm -ne 755 ]
  #   then
  #     # 如果不是755，则修改权限
  #     chmod 755 $file
  #   fi
  # else
  #   # 如果是文件，判断权限是否为644
  #   if [ $f_perm -ne 644 ]
  #   then
  #     # 如果不是644，则修改权限
  #     chmod 644 $file
  #   fi
  # fi
  [ $f_owner != 'www' ] && chown www $file
  [ $f_group != 'root' ] && chown :root $file
done
```
1. 只find一次，然后用for循环遍历
2. `stat -c %a`获取文件权限，`stat -c %U`获取文件所有者，`stat -c %G`获取文件所属组
3. `chmod`修改权限，`chown`修改所有者和所属组




### day05
有一个目录/data/att/，该目录下有数百个子目录，然后再深入一层为以日期命名的目录，例如 /data/att/eric/20231205，每天会生成一个日期新目录，由于/data所在的磁盘快满了，所以需要将一些老文件（一年以前）挪到另一个目录/data1/att下，挪完之后还要做软链接，要确保老文件成功移动之后再做软链接，需要有日志


```bash
#!/bin/bash
#author: EricYangXD
#version: v1.0
#date: 2023-12-05

# 定义函数，方便调用
main(){
  cd /data/att
  for dir in `ls`
  do
    for dir2 in `find $dir -maxdepth 1 -type d -mtime +365`
    do
      # -R 可以自动创建目录结构
      rsync -aR $dir2/ /data1/att/
      if [$? -eq 0]
      then
        rm -rf $dir2
        echo "/data/att/$dir2 移动成功"
        # 软链接
        ln -s /data1/att/$dir2 /data/att/$dir2 && echo "/data/att/$dir2 软链接成功"
      else
        echo "/data/att/$dir2 移动失败"
      fi
    done
  done
}

# 调用函数
main &> /tmp/move_old_data_`date +%F`.log

```

1. `rsync`可以保持目录结构，`-a`参数表示归档，`-R`参数表示保持目录结构
2. find命令可以查找指定目录下的文件和目录，`-maxdepth`参数表示最大深度，`-type`参数表示类型，`-mtime`参数表示修改时间，+365表示一年前
3. `ln -s`可以创建软链接，`-s`参数表示软链接
4. `&>`表示将标准输出和标准错误输出重定向到指定文件，`date +%F`表示日期，%F表示年月日
5. 脚本某行很长的话，可以用`\`+回车换行，但是`\`后面不能有空格

### day06

监控系统负载，如果系统负载超过10，需要记录系统状态信息到/opt/logs

```bash
#!/bin/bash
#author: EricYangXD
#version: v1.0
#date: 2023-12-05

[ -d /opt/logs ] || mkdir -p /opt/logs

while :
do
  # 获取系统负载
  load=`uptime |awk -F 'average': '{print $2}' |cut -d',' -f1 |sed 's/ //g' |cut -d. -f1`
  if [ $load -gt 10 ]
  then
    # 分别记录top，vmstat和ss命令的执行结果
    top -bn1 |head -n 100 > /opt/logs/top.`date +%s`
    vmstat 1 10 > /opt/logs/vmstat.`date +%s`
    ss -an > /opt/logs/ss.`date +%s`
  fi
  sleep 20
  find /opt/logs \( -name "top*" -o -name "vmstat*" -o -name "ss*" \) -mtime +30 | xargs rm -f
done
```
1. `uptime`可以获取系统负载，`awk -F 'average': '{print $2}'`表示以average:为分隔符，获取第二列，`cut -d',' -f1`表示以逗号为分隔符，获取第一列，`sed 's/ //g'`表示去掉空格，`cut -d. -f1`表示以点为分隔符，获取第一列
2. `top -bn1`表示top命令只执行一次，`head -n 100`表示获取前100行
3. `vmstat 1 10`表示每隔1秒执行一次，执行10次
4. `ss -an`表示获取所有网络连接信息
5. `find`命令可以查找指定目录下的文件和目录，`-name`参数表示文件名，`-o`表示或，`-mtime`表示修改时间，+30表示30天前，`xargs`可以将前面命令的输出作为后面命令的参数，`rm -f`表示强制删除
6. `while :`表示无限循环，`sleep 20`表示每隔20秒执行一次


### day07

找出5分钟之内更改过的文件

```bash
#!/bin/bash
#author: EricYangXD
#version: v1.0
#date: 2023-12-05

d = `date +%Y%m%d%H%M`
basedir = /data/web/attachment

# 用find命令查找5分钟内更改过的文件，并把文件列表写入一个文件里
find $basedir/ -type f -mmin -5 > /tmp/newf.txt

# 如果文件里有内容，把文件改名字，即我们要的文件列表日志文件
if [ -s /tmp/newf.txt ]
then
  mv /tmp/newf.txt /tmp/$d
fi
```
1. find命令可以查找指定目录下的文件和目录，`-type`参数表示类型，`-mmin`参数表示修改时间，-5表示5分钟内
2. `-s`参数表示文件存在且大小不为空


###

```bash
#!/bin/bash
#author: EricYangXD
#version: v1.0
#date: 2023-12-05


```

###

```bash
#!/bin/bash
#author: EricYangXD
#version: v1.0
#date: 2023-12-05


```

###

```bash
#!/bin/bash
#author: EricYangXD
#version: v1.0
#date: 2023-12-05


```

###

```bash
#!/bin/bash
#author: EricYangXD
#version: v1.0
#date: 2023-12-05


```

###

```bash
#!/bin/bash
#author: EricYangXD
#version: v1.0
#date: 2023-12-05


```
