---
title: 阿里云
author: EricYangXD
date: "2023-05-22"
meta:
  - name: keywords
    content: 阿里云
---

## 阿里云认证

### 云计算工程师 ACP

1. TODO

## 阿里云学习平台

### 使用 ECS 和 OSS 搭建个人网盘

- CentOS8

1. 安装 Cloudreve

```sh
wget https://labfileapp.oss-cn-hangzhou.aliyuncs.com/cloudreve_3.3.1_linux_amd64.tar.gz

tar -zxvf cloudreve_3.3.1_linux_amd64.tar.gz

chmod +x ./cloudreve

./cloudreve
# 返回结果可以看到管理员账号和密码
# 打开浏览器，访问http://<ECS公网地址>:5212，依次输入管理员账号和密码，单击登录。

# eg

[Info]    2023-05-22 13:40:04 初始管理员账号：admin@cloudreve.org
[Info]    2023-05-22 13:40:04 初始管理员密码：VLANPAqm
```

2. 安装 ossfs

ossfs 能让您在 Linux 系统中，将对象存储 OSS 的存储空间（Bucket）挂载到本地文件系统中，您能够像操作本地文件一样操作 OSS 的对象（Object），实现数据的共享。

```sh
wget https://gosspublic.alicdn.com/ossfs/ossfs_1.80.6_centos8.0_x86_64.rpm

# 先更换yum源（Centos8 yum 官方源下线）
#1.先删除系统内过期的.repo文件
rm -f /etc/yum.repos.d/*

#2.下载新的 CentOS-Base.repo 到 /etc/yum.repos.d/
wget -O /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-vault-8.5.2111.repo

#3.运行 yum makecache 生成缓存
yum clean all && yum makecache

# 安装ossfs
yum install -y ./ossfs_1.80.6_centos8.0_x86_64.rpm

# 执行如下命令，配置账号访问信息，将Bucket名称以及具有此Bucket访问权限的AccessKey ID和AccessKey Secret信息存放在/etc/passwd-ossfs文件中。

echo adc-oss-1871hd2:LTAI5tGLDLqcUStK8A:3QxlrourxYv9dJnkYc5mtmUEm > /etc/passwd-ossfs

chmod 640 /etc/passwd-ossfs
```

3. 挂载 OSS

```sh
mkdir oss

# 将Bucket挂载到指定目录oss
# ossfs BucketName mountfolder -o url=Endpoint
ossfs adc-oss-1871hd2 oss -o url=oss-cn-shanghai-internal.aliyuncs.com

# 查看是否挂载成功
df -h

# 执行如下命令，在/etc/init.d/目录下建立文件ossfs，设置开机自动启动脚本进行OSS挂载。
vim /etc/init.d/ossfs

-------------------------------------------------------------------------
#! /bin/bash
#
# ossfs      Automount Aliyun OSS Bucket in the specified direcotry.
#
# chkconfig: 2345 90 10
# description: Activates/Deactivates ossfs configured to start at boot time.

# ossfs BucketName mountfolder -o url=Endpoint -oallow_other
ossfs adc-oss-1871hd2 oss -o url=oss-cn-shanghai-internal.aliyuncs.com -oallow_other
-------------------------------------------------------------------------
# 为新建立的ossfs脚本赋予可执行权限
chmod a+x /etc/init.d/ossfs
# 把ossfs启动脚本作为其他服务，开机自动启动
chkconfig ossfs on
```

4. 配置个人网盘

- 运行 cloudreve and login use the former username&password

```sh
./cloudreve
```

- 在 cloudreve 主界面右上角，单击管理面板
- 在确定站点 URL 设置对话框中，单击更改
- 在左侧导航栏中，单击存储策略
- 在存储策略页面，单击添加存储策略
- 在选择存储方式对话框中，选择本机存储
- 在添加本机存储策略的上传路径页面中，将存储目录修改为`oss/${Object路径}/{uid}/{path}`，单击下一步: `oss/ECSOSS/u-92nyvagn/{uid}/{path}`
- 在添加本机存储策略的直链设置页面中，单击下一步
- 在添加本机存储策略的上传限制页面中，单击下一步
- 在添加本机存储策略的完成页面中，输入存储策略名 OSS，单击完成。一路默认设置！
- 在左侧导航栏中，单击用户组
- 在用户组页面中，单击管理员操作中的编辑图标
- 在编辑管理员页面的存储策略中，选择 oss，然后单击保存
- 在用户组的右上角，单击返回主页
- 在个人网盘页面，拖拽任意文件到网页中，待文件上传完毕，关闭上传队列
- 进入阿里云控制台并登录，访问 OSS 管理控制台：`https://oss.console.aliyun.com/`
- 在左侧导航栏中，单击 Bucket 列表
- 在 Bucket 页面，找到实验室提供的 Bucket，单击 Bucket 名称
- 在文件列表页面，根据云产品资源列表中的 Object 路径，单击对应的文件夹名称，进入 Object 路径
- 在文件列表页面，单击文件名为 1 的文件夹，在 1 文件夹中，您可以看到在个人网盘上传的文件
