---
title: DOcker
author: EricYangXD
date: "2022-04-29"
---

## 什么是 Docker & 安装 Docker

Docker 的介绍，里面包括了 3 个基本概念：

1. docker 主要由镜像和容器构成

   - 镜像（Image）:docker 镜像好比一个模板，相当于一个文件系统
   - 容器（Container）:容器需要通过镜像来创建。镜像和容器就像是面向对象中的类和实例一样。容器可以被创建/启动/停止/删除等
   - 仓库（Repository）:仓库就是存放镜像的地方，分为私有仓库和公有仓库。类似 git

2. docker 的运行原理

docker 是一个 Client-Server 结构的系统，docker 的守护进程运行在主机上，通过 socket 从客户端访问。dockerServer 接收到 dockerClient 的指令，就会执行这个命令。

3. docker 的安装

   - homebrew 的 cask 支持 Docker for Mac，所以可以直接安装 `brew cask install docker`
   - 也可以直接到官网下载，`https://download.docker.com/mac/stable/Docker.dmg`
   - docker 的参考文档：`https://docs.docker.com`
   - dockerhub 查找镜像源地址：`https://hub.docker.com`

## Docker Daemon

- Docker Daemon 是 Docker 架构中运行在后台的守护进程，可分为 Docker Server、Engine 和 Job 三部分。

- Docker Daemon 是通过 Docker Server 模块接受 Docker Client 的请求，并在 Engine 中处理请求，然后根据请求类型，创建出指定的 Job 并运行，运行过程的几种可能：向 Docker Registry 获取镜像，通过 graphdriver 执行容器镜像的本地化操作，通过 networkdriver 执行容器网络环境的配置，通过 execdriver 执行容器内部运行的执行工作等。

- [启动 docker daemon](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/docker-brew.jpg)

## Docker 的使用

1. 查看版本

- docker --version
- docker-compose --version
- docker-machine --version

2. 查看 docker 系统信息（包括镜像和容器的数量等）

- docker info

3. 帮助命令

- docker help

4. 查看 cpu 的状况

- docker stats

## docker 的基本命令

1. 镜像相关命令：

- 查看镜像可用版本（nginx 为例）`docker search nginx`

2. 下载一个镜像

`docker pull nginx:latest（：后面跟镜像版本）`

3. 运行一个 nginx 服务器

`docker run -d -p 81:80 --name webserver nginx`

可选项：

- --name webserver ：容器名称，用来区分容器
- -p 81:80 ：端口进行映射，将本地的 81 端口映射到容器内部的 80 端口
- -v ～/nginx/html:/usr/share/nginx/html 数据卷挂载 ro/rw，将主机项目中的目录挂载到容器的目录下，默认 rw 只能在宿主机外改变，容器内部不能改变
- -d：设置容器中在后台一直运行
- -it：使用交互方式运行，进入容器查看内容
- -P：随机端口
- -e：环境配置设置
- 注意：后台启动运行，必须要有一个前台进程，docker 发现没有应用，就会自动停止
- 重点：数据卷挂载分为具名/匿名/指定路径挂载，容器数据卷挂载可以实现数据共享，容器的持久化和同步操作，可以使用 `docker volume` 查看卷的情况，可以使用 volumes-from 实现多个容器之间的数据共享。

4. 停止 nginx 服务

`docker stop webserver(容器id)`

5. 删除 nginx 服务

`docker rm webserver`

6. 启动/重启 nginx 服务

`docker start/restart webserver`

7. 列出所有镜像(列表包含了 仓库名、标签、镜像 ID、创建时间 以及 所占用的空间)

`docker images ls`

说明：

- REPOSITORY 镜像的仓库源
- TAG 镜像的标签
- IMAGE ID 镜像的 id
- CREATED 镜像的创建时间
- SIZE 镜像的大小

可选项：

- -a：列出所有的镜像
- -q：只显示镜像的 id

注意：镜像 ID 是唯一标识，一个镜像可以对应多个标签

8. 查看镜像、容器、数据卷所占用的空间

`docker system df`

9. 删除镜像

- 指定镜像：`docker rmi [镜像名称/镜像短ID/镜像长ID/镜像摘要]`

- 多个镜像：`docker rmi 镜像ID 镜像ID 镜像ID`

- 全部镜像：`docker rmi $(docker images -aq)`

10. 删除 docker images ls 命令配合 删除所有仓库名为 redis 的镜像

`docker rmi $(docker images ls -q redis)`

11. 查看镜像运行记录

`docker history 镜像id`

## 容器相关命令

1. 列出容器

`docker ps`

可选项：

- -a：显示所有的容器，包括未运行的
- -l：显示最近创建的容器
- -n：列出最近创建的 n 个容器
- -q：只显示容器的编号

2. 进入容器

- `docker exec -it [容器名称] /bin/bash`
- `docker atthch 容器id`

区别：`docker exec`进入容器后开启一个新的终端，可以在里面操作；`docker attach`进入容器正在执行的终端，不会启动新的进程

3. 退出容器

- 容器停止退回主机 `exit`
- 容器不停止退出 `ctrl+p+q`

4. 删除容器

- 指定容器：`docker rm [容器id]`
- 多个容器：`docker rm 容器id 容器id 容器id`
- 所有容器：`docker rm $(docker ps -aq) docker ps -a -q|xargs docker rm`

注意：不能删除正在运行的容器，要删除正在运行的容器需要加 -f 参数，`docker rm -f 容器id`

5. 启动/重启容器

- `docker start/restart 容器id`:只运行 container 不进入命令行
- `docker start -i 74cb2f9141728b8`:运行 container 并进入命令行

1. 停止/强制停止容器

`docker stop/kill 容器id`

7. 查看容器日志

`docker logs -f -t --tail 100 容器id`

- --tail 后面必须加参数条数

8. 查看容器中的进程信息

`docker top 容器id`

9. 查看容器的元数据（重要命令）

`docker inspect 容器id`

10. 从容器上拷贝数据到主机上

`docker cp 容器id:容器内路径 主机路径`

## Dockerfile 的指令

- FROM 基础镜像，一切从这里开始
- MAINTAINER 镜像的作者 姓名<邮箱>
- RUN 镜像构建需要运行的命令
- ADD 步骤，添加内容
- WORKDIR 镜像的工作目录
- VOLUME 挂载的目录
- EXPOST 端口配置
- CMD 指定容器启动要运行的命令，只有最后一个会生效，可被替代
- ENTRYPOINT 指定这个容器启动要运行的命令，可以追加命令
- ONBUILD 当构建一个被继承的 Dockerfile 时会运行
- COPY 类似 ADD 将我们文件拷贝到镜像中
- ENV 构建的时候设置环境变量

## DockerFile Demo

```dockerfile
FROM node:16-alpine as builder

WORKDIR /code

ADD package.json package-lock.json /code/
RUN npm install

ADD . /code

RUN npm run build

# 选择更小体积的基础镜像
FROM nginx:alpine

# 将构建产物移至 nginx 中
COPY --from=builder code/build/ /usr/share/nginx/html/
```

使用 docker build 构建镜像并把它跑起来。

```bash
# 构建镜像
$ docker build -t fe-app .

# 运行容器
$ docker run -it --rm fe-app
```

## MAC 彻底删除 docker

解决 docker 一直 starting 的问题。

安装 docker for mac 之后，直接在应用程序将 docker 卸载了，再次安装的时候发现 docker 启动不了，一直处于"docker is starting"状态，这时候需要彻底卸载 docker。

如果使用 docker.dmg 或者`brew cask install docker`安装的 docker，需要删除`/usr/local/bin/docker`文件夹下 docker 的组件：

命令：`rm -rf /usr/local/bin/docker*` （谨慎使用）

或者手动进入`/usr/local/bin/`文件夹下删除相关文件（推荐）。

再次安装 docker 就启动就正常了。

1. `/Applications/Docker.app/Contents/MacOS/Docker --uninstall`
2. To uninstall Docker Desktop from your Mac:

   - From the Docker menu, select Troubleshoot and then select Uninstall.
   - Click Uninstall to confirm your selection.

3. 进入 docker 的安装目录: `which docker`
   - `cd /usr/local/bin/`
   - 删除与 docker 相关的文件夹
   - `sudo rm -rf docker*`
   - `sudo rm -rf com.docker.*`
   - `sudo rm -rf hub-tool*`
   - `sudo rm -rf kube*`
   - `sudo rm -rf vpnkit*`

## Learn Docker

### 1.

1. docker 启动命令, docker 重启命令, docker 关闭命令

- 启动 `systemctl start docker`
- 守护进程重启 `sudo systemctl daemon-reload`
- 重启 docker 服务 `systemctl restart docker`
- 重启 docker 服务 `sudo service docker restart`
- 关闭 docker `service docker stop`
- 关闭 docker `systemctl stop docker`

2. 如何启动应用

启动：`docker start 应用名称`

### 2.

### 3.

### 4.
