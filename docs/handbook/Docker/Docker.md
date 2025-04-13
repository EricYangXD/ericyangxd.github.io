---
title: Docker
author: EricYangXD
date: "2022-04-29"
meta:
  - name: keywords
    content: Docker,Dockerfile,container
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
   - 查看 docker 安装包：`yum list | grep docker`
   - 安装 Docker Ce 社区版本：`yum install -y docker-ce.x86_64`
   - 设置开机启动：`systemctl enable docker`
   - 更新 xfsprogs：`yum -y update xfsprogs`
   - 启动 docker：`sudo systemctl start docker`
   - 查看版本：`docker version`
   - 查看详细信息：`docker info`
   - Centos7 一键安装：`curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun`或`curl -sSL https://get.daocloud.io/docker | sh`
   - 新主机上首次安装 Docker Engine-Community 之前，需要设置 Docker 仓库。此后可从仓库安装和更新 Docker。
     - `sudo yum install -y yum-utils \`
     - `device-mapper-persistent-data \`
     - `lvm2`
     - `sudo yum-config-manager \`
     - `--add-repo \`
     - `https://download.docker.com/linux/centos/docker-ce.repo`
   - 阿里云：`http:**//mirrors.aliyun.com/docker-ce/linux/centos/**docker-ce.repo`
   - 清华大学源：`https:**//mirrors.tuna.tsinghua.edu.cn/docker-ce/linux/centos/**docker-ce.repo`
   - 手动安装：`sudo yum install -y docker-ce docker-ce-cli containerd.io`

## Docker Daemon

- Docker Daemon 是 Docker 架构中运行在后台的守护进程，可分为 Docker Server、Engine 和 Job 三部分。

- Docker Daemon 是通过 Docker Server 模块接受 Docker Client 的请求，并在 Engine 中处理请求，然后根据请求类型，创建出指定的 Job 并运行，运行过程的几种可能：向 Docker Registry 获取镜像，通过 graphdriver 执行容器镜像的本地化操作，通过 networkdriver 执行容器网络环境的配置，通过 execdriver 执行容器内部运行的执行工作等。

- [启动 docker daemon](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/docker-brew.jpg)

- Linux 上配置 Docker 源镜像加速：`vi /etc/docker/daemon.json`
- Docker Desktop 上直接在设置的`Docker Engine`里配置 Docker 源镜像加速

```json
// 2024-12-11 更新
{
  "builder": {
    "gc": {
      "defaultKeepStorage": "20GB",
      "enabled": true
    }
  },
  "experimental": false,
  "features": {
    "buildkit": true
  },
  "registry-mirrors": [
    "https://docker.hpcloud.cloud",
    "https://docker.m.daocloud.io",
    "https://docker.unsee.tech",
    "https://docker.1panel.live",
    "http://mirrors.ustc.edu.cn",
    "https://docker.chenby.cn",
    "http://mirror.azure.cn",
    "https://dockerpull.org",
    "https://dockerhub.icu",
    "https://hub.rat.dev",
    "https://docker.1panel.dev",
    "https://docker.fxxk.dedyn.io",
    "https://docker.xn--6oq72ry9d5zx.cn",
    "https://docker.zhai.cm",
    "https://docker.5z5f.com",
    "https://a.ussh.net",
    "https://docker.cloudlayer.icu",
    "https://hub.littlediary.cn",
    "https://hub.crdz.gq",
    "https://docker.kejilion.pro",
    "https://registry.dockermirror.com",
    "https://dhub.kubesre.xyz",
    "https://docker.nastool.de",
    "https://docker.udayun.com",
    "https://docker.rainbond.cc",
    "https://hub.geekery.cn",
    "https://docker.1panelproxy.com",
    "https://atomhub.openatom.cn"
  ]
}
```

- 配置镜像源之后需要重启 Docker：`sudo systemctl daemon-reload && sudo systemctl restart docker`
- 查看是否成功：`docker info`

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
- -d：设置容器在后台一直运行
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

1. 查看镜像、容器、数据卷所占用的空间

`docker system df`

9. 删除镜像

   - 指定镜像：`docker rmi [镜像名称/镜像短ID/镜像长ID/镜像摘要]`

   - 多个镜像：`docker rmi 镜像ID 镜像ID 镜像ID`

   - 全部镜像：`docker rmi $(docker images -aq)`

10. 删除 docker images ls 命令配合 删除所有仓库名为 redis 的镜像

`docker rmi $(docker images ls -q redis)`

11. 查看镜像运行记录

`docker history 镜像id`

12. summary：
    - 查看本地镜像：`docker images`
    - 搜索镜像：`docker search centos`
    - 搜索镜像并过滤是官方的： `docker search --filter "is-official=true" centos`
    - 搜索镜像并过滤大于多少颗星星的：`docker search --filter stars=10 centos`
    - 下载 centos7 镜像：`docker pull centos:7`
    - 修改本地镜像名字（小写）：`docker tag centos:7 mycentos:1`
    - 本地镜像的删除：`docker rmi centos:7`

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

区别：`docker exec`用于在运行中的容器中执行命令，进入容器后开启一个新的终端，可以在里面操作；`docker attach`进入容器正在执行的终端，不会启动新的进程

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

6. 停止/强制停止容器

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

11. 查看一个容器中 Linux 的版本

    - 1. `docker exec -it [containerId/containerName] /bin/sh`
    - 2. `cat /etc/*-release`

## Dockerfile 的指令

Dockerfile 是一个文本文件，里面包含了一系列的指令，用于定义如何构建一个 Docker 镜像（Image）。它是 Docker 的核心组件之一，是自动化构建 Docker 镜像的重要工具。

通过编写 Dockerfile，开发者可以按照需求定义一个镜像的环境、依赖、配置和运行方式，从而生成可移植、轻量级、统一的应用程序运行环境。

- FROM 指令：指定构建容器镜像时的基础镜像，一切从这里开始
- MAINTAINER 镜像的作者 姓名<邮箱>
- RUN 在镜像构建过程中执行一条命令。
- ADD <源路径> <目标路径>：将构建上下文中的文件复制到镜像中。ADD 和 COPY 都可以用于复制文件，但 ADD 功能更复杂，可以解压归档文件（如 .tar.gz）和下载 URL。
- WORKDIR 指定容器内的/镜像的工作目录（类似于进入一个目录），后续的指令会以这个目录为上下文。
- VOLUME 挂载的目录
- EXPOST 端口配置
- EXPOSE <端口号>：声明容器监听的端口（只是一个文档性指令，不会自动开放端口）。
- CMD ["可执行文件", "参数 1", "参数 2"]： 指定容器启动时要运行的命令。如果同时定义了多个 CMD，只有最后一个会生效，可被覆盖 。
- ENTRYPOINT ["可执行文件", "参数 1", "参数 2"]：指定这个容器启动要运行的命令，可以追加命令。与 CMD 类似，但不会被用户的命令覆盖，而是将用户的命令作为参数附加到 ENTRYPOINT 后。
- ONBUILD 当构建一个被继承的 Dockerfile 时会运行
- COPY <源路径> <目标路径>：类似 ADD，将文件拷贝到镜像中
- ENV <变量名>=<值>：构建的时候设置环境变量

Demo1：

```bash
# FROM node:latest
FROM node:alpine # 是一个官方的轻量化 Node.js 基础镜像，它基于 Alpine Linux，体积小，性能高，更适合生产环境，启动快，内存占用低。

ENV NODE_ENV=production
ENV PORT=8080
WORKDIR /app  # 这里将 /app 作为容器内的工作目录。后续的所有命令（如文件添加、执行等）都将在 /app 目录下运行。如果目录 /app 不存在，WORKDIR 会自动创建它。

RUN apt-get update && apt-get install -y nginx       # 使用 apt 安装 Nginx
RUN pip install -r requirements.txt                 # 使用 pip 安装 Python 依赖
ADD package*.json ./  # 将文件从构建上下文（本地机器的代码目录）复制到镜像内的工作目录（WORKDIR）。在构建镜像时，只复制依赖配置文件以减少构建时间。
RUN npm install  # 在镜像构建过程中执行命令。依赖包会被安装到 /app/node_modules 中。
ADD . .  # 将上下文目录中的所有文件（. 指代当前目录）复制到容器的 /app 目录中。第一个`.`：本地上下文目录（Dockerfile 所在的目录）。第二个`.`：容器内的工作目录，前面通过 WORKDIR /app 设置为 /app。
# ADD app.tar.gz /app   # 解压 app.tar.gz 到镜像的 /app 目录

CMD ["npm", "start"]  # 运行 npm start

# CMD node index.js
```

## .dockerignore

用来忽略相应文件：使用 .dockerignore 文件可以避免将不必要的文件（如 .git 文件夹、日志、临时文件等）复制到镜像中。类似.gitignore。

## DockerFile Demo

```bash
FROM node:16-alpine as builder
LABEL maintainer="developer@example.com" version="1.0"

WORKDIR /code

ADD package.json package-lock.json /code/
RUN npm install

ADD . /code

RUN npm run build

# 选择更小体积的基础镜像
FROM nginx:alpine

# 将构建产物移至 nginx 中
COPY --from=builder code/dist/ /usr/share/nginx/html/
```

使用 docker build 构建镜像并把它跑起来。

```bash
# 构建镜像
$ docker build -t fe-app .  # -t fe-app为镜像命名为fe-app，.：表示当前目录包含的 Dockerfile。

# 运行容器
# 1.以交互模式启动，用户可以直接进入容器终端与容器内部环境进行交互。容器停止后会自动删除，不会保留运行记录，也不会生成新的容器 ID。适合运行临时处理的任务，比如在容器内执行某个脚本，任务完成后直接销毁容器。非常适合需要进入容器交互式操作的场景，比如测试某些命令是否正常运行，检查容器环境等。实时输出容器日志到终端。可以暴露多个端口。没有/bin/bash就用sh
$ docker run -it --rm -p 3000:3000/tcp -p 8000:8000 fe-app /bin/bash
# 2.以守护进程模式启动，容器会在后台运行，用户无法直接进入容器终端与容器内部环境进行交互。容器停止后不会自动删除，会保留运行记录，会生成新的容器 ID。主机的 3000 端口将转发到容器的 3000 端口，因此可以通过访问主机的 http://localhost:3000 来访问容器中的服务。后台运行的模式适合需要高可用的生产环境服务。适合运行 Web 应用、API 服务等长期运行的服务。不输出日志，需要通过 docker logs 查看。必须指定端口映射
$ docker run -d -p 3000:3000/tcp --name my-node-app base-node-app
$ docker exec -it my-node-app /bin/bash
```

上述的 1 和 2 差不多，只是一个是交互式的，一个是后台运行的。

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

### 1. 基础启动命令

1. docker 启动命令, docker 重启命令, docker 关闭命令

- 启动 `systemctl start docker`
- 守护进程重启 `sudo systemctl daemon-reload`
- 重启 docker 服务 `systemctl restart docker`
- 重启 docker 服务 `sudo service docker restart`
- 关闭 docker `service docker stop`
- 关闭 docker `systemctl stop docker`

2. 如何启动应用

启动：`docker start 应用（容器container）名称`

### 2. 容器的构建等基本操作

1. Docker 容器的创建，查看，停止，重启等
   - 构建容器：`docker run -itd --name=mycentos centos:7`
     - `-i` ：表示以交互模式运行容器（让容器的标准输入保持打开）
     - `-d`：表示后台运行容器，并返回容器 ID
     - `-t`：为容器重新分配一个伪输入终端
     - `--name`：为容器指定名称
2. 查看本地所有的容器：`docker ps -a`
3. 查看本地正在运行的容器：`docker ps`
4. 停止容器：`docker stop CONTAINER_ID / CONTAINER_NAME`
5. 一次性停止所有容器：`docker stop $(docker ps -a -q)`
6. 启动容器：`docker start CONTAINER_ID / CONTAINER_NAME`
7. 重启容器：`docker restart CONTAINER_ID / CONTAINER_NAME`
8. 删除容器：`docker rm CONTAINER_ID / CONTAINER_NAME`
9. 强制删除容器：`docker rmi -f CONTAINER_ID / CONTAINER_NAME`
10. 查看容器详细信息：`docker inspect CONTAINER_ID / CONTAINER_NAME`
11. 进入容器：`docker exec -it 0ad5d7b2c3a4 /bin/bash`

### 3. 容器的文件复制与挂载

容器与宿主机之间文件复制与挂载。

1. 从宿主机复制到容器：`docker cp 宿主机本地路径 容器名字/ID：容器路径`
   - `docker cp /root/123.txt mycentos:/home/`
2. 从容器复制到宿主机：`docker cp 容器名字/ID：容器路径 宿主机本地路径`
   - `docker cp mycentos:/home/456.txt /root`
3. 宿主机文件夹挂载到容器里：`docker run -itd -v 宿主机路径:容器路径 镜像ID`
   - `docker run -itd -v /root/xdclass/:/home centos:7`

### docker 目前镜像的制作有 2 种方法

1. 基于 Docker Commit 制作镜像
2. 基于 dockerfile 制作镜像，Dockerfile 方式为主流的制作镜像方式

基于 Dockerfile 多阶段构建镜像，将构建和运行分开，减少最终镜像中不必要的文件！

```bash
# 第一阶段：构建阶段
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 第二阶段：运行阶段
FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
CMD ["npm", "start"]

# or STAGE 2
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 4. Commit 构建自定义镜像

- 对容器的修改以及保存

1. 启动并进入容器：`docker run -it centos:7 /bin/bash`
2. 在/home 路径下创建 xdclass 文件夹：`mkdir /home/xdclass`
3. 安装 ifconfig 命令：`yum -y install net-tools`
4. 重启容器，查看容器的 xdclass 文件夹还在不在：`docker restart 67862569d4f7`
5. 删除容器，再重新启动一个容器进入查看有没有 xdclass 文件夹：`docker rm 67862569d4f7 && docker run -it centos:7 /bin/bash`
6. 构建镜像：
   - `docker commit 4eb9d14ebb18 mycentos:7`
   - `docker commit -a "XD" -m "mkdir /home/xdclass" 4eb9d14ebb18 mcentos:7`
   - `-a`：标注作者
   - `-m`：说明注释
   - 查看详细信息：`docker inspect 180176be1b4c`
7. 启动容器：`docker run -itd 180176be1b4c /bin/bash`
8. 进入容器查看：`docker exec -it 2a4d38eca64f /bin/bash`

- Dockerfile 构建镜像

1. Dockerfile

```bash
# this is a dockerfile
FROM centos:7
MAINTAINER XD 123456@qq.com
RUN echo "正在构建镜像！！！"
WORKDIR /home/xdclass
COPY 123.txt /home/xdclass
RUN yum install -y net-tools
```

2. 构建：`docker build -t mycentos:v2 .`
3. 查看：`docker images`
4. 进入验证：验证成功

### 5. 介绍一些常用的 Dockerfile 指令

- FROM:基于哪个镜像
- MAINTAINER:注明作者
- COPY:复制文件进入镜像（只能用相对路径，不能用绝对路径）
- ADD:复制文件进入镜像（假如文件是.tar.gz 文件会解压）
- WORKDIR:指定工作目录，假如路径不存在会创建路径
- ENV:设置环境变量
- EXPOSE:暴露容器端口
- RUN:在构建镜像的时候执行，作用于镜像层面
- ENTRYPOINT:在容器启动的时候执行，作用于容器层，dockerfile 里有多条时只允许执行最后一条
- CMD:
  - 在容器启动的时候执行，作用于容器层，dockerfile 里有多条时只允许执行最后一条
  - 容器启动后执行默认的命令或者参数，允许被修改
- 命令格式：
  - shell 命令格式：`RUN yum install -y net-tools`
  - exec 命令格式：`RUN [ "yum","install" ,"-y" ,"net-tools"]`

### 自己构建的容器无法启动怎么办

- 通过`docker exec -it <container_id> sh`无法进入容器进行调试，此时可以：

  1. 检查 Dockerfile 和构建输出中的错误信息
  2. 使用`docker run -it --entrypoint sh <image_id>`来启动容器
     - 使用你构建的镜像启动一个容器
     - 覆盖默认的 ENTRYPOINT,使用 sh 命令作为入口点
     - -it 参数可以让你进入容器内部的 shell
  3. 一种方式是使用 Dockerfile 的 RUN 指令，在构建阶段就检查容器内部（示例如下），这样不需要启动容器:这会直接在构建输出中返回命令执行结果，你可以根据输出来检查问题所在。

```sh
# dockerfile
RUN ["sh", "-c", "ls /usr/local/bin/ | grep jenkins-agent"]
RUN ["sh", "-c", "chmod +x /usr/local/bin/jenkins-agent"]
RUN ["sh", "-c", "/usr/local/bin/jenkins-agent"]
```

3. `docker logs <container_id>` 的输出(如果容器有启动的话)

### 报错

1. `vm.max_map_count [65530] is too low, increase to at least [262144]`
   - 解决方法：`sudo sysctl -w vm.max_map_count=262144`
   - 永久生效：`sudo vim /etc/sysctl.conf`，添加`vm.max_map_count=262144`
   - 官方临时：`https://github.com/rimelek/fix-docker-containers/blob/ce8905e06f3e683e9166fa0cc971eea7251ed49b/docker-for-mac.md`，先`docker run -it --rm --privileged --pid=host justincormack/nsenter1`，然后进入容器`sysctl -w vm.max_map_count=262144`，然后`exit`退出容器，不能重启 docker 服务，否则会失效。

### 总结

Docker 是一种虚拟化技术，通过容器的方式，它的实现原理依赖 linux 的 `Namespace`、`Control Group`、`UnionFS` 这三种机制。

`Namespace` 做资源隔离，`Control Group` 做容器的资源限制，`UnionFS` 做文件系统的镜像存储、写时复制、镜像合并。

一般我们是通过 `dockerfile` 描述镜像构建的过程，然后通过 `docker build` 构建出镜像，上传到 registry。

镜像通过 `docker run` 就可以跑起来，对外提供服务。

用 `dockerfile` 做部署的最佳实践是分阶段构建，build 阶段单独生成一个镜像，然后把产物复制到另一个镜像，把这个镜像上传 registry。

这样镜像是最小的，传输速度、运行速度都比较快。

`Dockerfile` 是一个文本文件，包含了用于构建 Docker 镜像的指令和参数。您可以使用 `docker build` 命令来构建一个 Docker 镜像，指定 `Dockerfile` 的路径即可。例如：`docker build -f /path/to/Dockerfile .`。

一旦 Docker 镜像被构建出来，您可以使用 `docker run` 命令来创建容器。容器是基于 Docker 镜像的运行实例，可以在容器内运行应用程序。例如：`docker run myimage-name`。

简而言之，`Dockerfile` 用于构建 Docker 镜像，而 Docker 镜像用于创建 Docker 容器。

一般我们都是在 jenkins 里跑，push 代码的时候，通过 web hooks 触发 jenkins 构建，最终产生运行时的镜像，上传到 registry。
部署的时候把这个镜像 `docker pull` 下来，然后 `docker run` 就完成了部署。

前端、node 的代码都可以用 docker 部署，前端代码的静态服务还要作为 CDN 的源站服务器，不过我们也不一定要自己部署，很可能直接用阿里云的 OSS 对象存储服务了。

## Docker 技术解决的问题是什么

代码开发完之后，要经过构建，把产物部署到服务器上跑起来，这样才能被用户访问到。

不同的代码需要不同的环境，比如 JS 代码的构建需要 node 环境，Java 代码 需要 JVM 环境，一般我们会把它们隔离开来单独部署。

现在一台物理主机的性能是很高的，完全可以同时跑很多个服务，而我们又有环境隔离的需求，所以会用虚拟化技术把一台物理主机变为多台虚拟主机来用。

现在主流的**虚拟化技术**就是 docker 了，它是**基于容器的虚拟化技术**。

**它可以在一台机器上跑多个容器，每个容器都有独立的操作系统环境，比如文件系统、网络端口等**。

## 远程仓库

- hi, I want to pull a docker image from remote repo and change sth of this image, and then push the changed image to the remote repo, how to make it?

0. 要有个账号，docker 的或者私有的
1. `docker pull <remote_repo>/<image_name>:<tag>`
2. `docker run -it <remote_repo>/<image_name>:<tag> /bin/bash`
3. make changes to the image.
4. `docker commit <container_id> <remote_repo>/<image_name>:<new_tag>`
5. `docker push <remote_repo>/<image_name>:<new_tag>`

## PodMan

TODO

## K8S

TODO

## 优化 Docker 镜像体积

### 使用更小的基础镜像

1. alpine 镜像：`FROM alpine:latest`，体积小，适合生产环境，Alpine 是一个轻量级的 Linux 发行版，体积约 5MB。
2. 指定轻量化版本的官方镜像，通常以 -slim 或 -alpine 结尾。：`FROM golang:1.17-alpine`，`FROM python:3.9-slim`
3. scratch 镜像：`FROM scratch`，体积小，适合生产环境，使用 scratch 镜像时，只有应用程序和必要的依赖会被包含。

### 减少构建中的无用层

Docker 中每一行指令都会生成一个新的镜像层（Layer）。减少无用层可以优化镜像体积。

1. 合并多条 RUN 指令：在 Dockerfile 中，将多个命令合并到一个 RUN 指令中，减少生成的镜像层数。
2. 删除构建过程中的临时文件：在同一条指令中清理安装过程中产生的缓存或临时文件。

### 使用多阶段构建（Multi-stage Build）

多阶段构建是 Docker 的一种镜像构建优化技术，允许在多个阶段中构建镜像，并仅保留最终阶段需要的内容。

### 删除不必要的文件

有些文件在镜像运行时并不需要，比如文档、编译器工具链等，可以删除这些文件以减小镜像体积。清理以下文件通常是一个好习惯：

```bash
/var/lib/apt/lists/*（APT 缓存）
/tmp/* 或其他临时目录
构建过程中临时生成的文件
```

### 避免安装多余的依赖

只安装运行环境所需的最小依赖。如果只需要运行时依赖，可以避免安装编译工具等开发依赖。

- 对于 Node.js，可以使用 `npm install --production`。
- 对于 Python，可以使用 `pip install --no-dev`。

### 使用 .dockerignore 文件

作用类似于 .gitignore，可以防止不必要的文件被复制到构建上下文中，从而减少镜像体积。

### 压缩和精简运行时文件

1. 压缩二进制文件：对于拥有二进制文件的镜像，可以通过工具（如 upx）对其进行压缩。
2. 删除调试信息：在构建过程中编译时，可以通过优化选项删除调试信息。

### 使用分层镜像优化工具

1. Docker 自带的 `docker builder prune`：构建过程中会生成缓存，定期清理缓存可以减少镜像占用的空间。
2. dive 工具：dive 是一个开源工具，可以分析 Docker 镜像的每一层，帮助优化镜像体积。`dive <image-name>`

### 减少镜像中的历史记录（Squash Layers）

每次构建镜像时，镜像的历史记录会保存到镜像层中。如果需要进一步优化，可以通过 "squash" 将多个层压缩为一个层。压缩镜像层可能会影响镜像的构建速度，因为缓存层会减少。

1. squash 命令可以将多个镜像层合并成一个，从而减小镜像体积。启用镜像压缩：`docker build --squash -t my-image .`

### 使用缓存优化构建过程

通过合理利用缓存，可以避免重新安装依赖或重新下载资源，从而加速构建过程。

### 使用容器化的专用工具

1. distroless 镜像： 是 Google 提供的轻量化镜像，完全移除了 Shell、包管理器等，只保留运行应用所需的文件。
2. Builder 工具链优化：使用 BuildKit 构建镜像，减少镜像层的重复。启用 BuildKit：`DOCKER_BUILDKIT=1 docker build .`
