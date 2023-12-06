(window.webpackJsonp=window.webpackJsonp||[]).push([[51],{738:function(e,r,s){"use strict";s.r(r);var t=s(7),v=Object(t.a)({},(function(){var e=this,r=e.$createElement,s=e._self._c||r;return s("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[s("h2",{attrs:{id:"什么是-docker-安装-docker"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#什么是-docker-安装-docker"}},[e._v("#")]),e._v(" 什么是 Docker & 安装 Docker")]),e._v(" "),s("p",[e._v("Docker 的介绍，里面包括了 3 个基本概念：")]),e._v(" "),s("ol",[s("li",[s("p",[e._v("docker 主要由镜像和容器构成")]),e._v(" "),s("ul",[s("li",[e._v("镜像（Image）:docker 镜像好比一个模板，相当于一个文件系统")]),e._v(" "),s("li",[e._v("容器（Container）:容器需要通过镜像来创建。镜像和容器就像是面向对象中的类和实例一样。容器可以被创建/启动/停止/删除等")]),e._v(" "),s("li",[e._v("仓库（Repository）:仓库就是存放镜像的地方，分为私有仓库和公有仓库。类似 git")])])]),e._v(" "),s("li",[s("p",[e._v("docker 的运行原理")])])]),e._v(" "),s("p",[e._v("docker 是一个 Client-Server 结构的系统，docker 的守护进程运行在主机上，通过 socket 从客户端访问。dockerServer 接收到 dockerClient 的指令，就会执行这个命令。")]),e._v(" "),s("ol",{attrs:{start:"3"}},[s("li",[s("p",[e._v("docker 的安装")]),e._v(" "),s("ul",[s("li",[e._v("homebrew 的 cask 支持 Docker for Mac，所以可以直接安装 "),s("code",[e._v("brew cask install docker")])]),e._v(" "),s("li",[e._v("也可以直接到官网下载，"),s("code",[e._v("https://download.docker.com/mac/stable/Docker.dmg")])]),e._v(" "),s("li",[e._v("docker 的参考文档："),s("code",[e._v("https://docs.docker.com")])]),e._v(" "),s("li",[e._v("dockerhub 查找镜像源地址："),s("code",[e._v("https://hub.docker.com")])]),e._v(" "),s("li",[e._v("查看 docker 安装包："),s("code",[e._v("yum list | grep docker")])]),e._v(" "),s("li",[e._v("安装 Docker Ce 社区版本："),s("code",[e._v("yum install -y docker-ce.x86_64")])]),e._v(" "),s("li",[e._v("设置开机启动："),s("code",[e._v("systemctl enable docker")])]),e._v(" "),s("li",[e._v("更新 xfsprogs："),s("code",[e._v("yum -y update xfsprogs")])]),e._v(" "),s("li",[e._v("启动 docker："),s("code",[e._v("sudo systemctl start docker")])]),e._v(" "),s("li",[e._v("查看版本："),s("code",[e._v("docker version")])]),e._v(" "),s("li",[e._v("查看详细信息："),s("code",[e._v("docker info")])]),e._v(" "),s("li",[e._v("Centos7 一键安装："),s("code",[e._v("curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun")]),e._v("或"),s("code",[e._v("curl -sSL https://get.daocloud.io/docker | sh")])]),e._v(" "),s("li",[e._v("新主机上首次安装 Docker Engine-Community 之前，需要设置 Docker 仓库。此后可从仓库安装和更新 Docker。\n"),s("ul",[s("li",[s("code",[e._v("sudo yum install -y yum-utils \\")])]),e._v(" "),s("li",[s("code",[e._v("device-mapper-persistent-data \\")])]),e._v(" "),s("li",[s("code",[e._v("lvm2")])]),e._v(" "),s("li",[s("code",[e._v("sudo yum-config-manager \\")])]),e._v(" "),s("li",[s("code",[e._v("--add-repo \\")])]),e._v(" "),s("li",[s("code",[e._v("https://download.docker.com/linux/centos/docker-ce.repo")])])])]),e._v(" "),s("li",[e._v("阿里云："),s("code",[e._v("http:**//mirrors.aliyun.com/docker-ce/linux/centos/**docker-ce.repo")])]),e._v(" "),s("li",[e._v("清华大学源："),s("code",[e._v("https:**//mirrors.tuna.tsinghua.edu.cn/docker-ce/linux/centos/**docker-ce.repo")])]),e._v(" "),s("li",[e._v("手动安装："),s("code",[e._v("sudo yum install -y docker-ce docker-ce-cli containerd.io")])])])])]),e._v(" "),s("h2",{attrs:{id:"docker-daemon"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#docker-daemon"}},[e._v("#")]),e._v(" Docker Daemon")]),e._v(" "),s("ul",[s("li",[s("p",[e._v("Docker Daemon 是 Docker 架构中运行在后台的守护进程，可分为 Docker Server、Engine 和 Job 三部分。")])]),e._v(" "),s("li",[s("p",[e._v("Docker Daemon 是通过 Docker Server 模块接受 Docker Client 的请求，并在 Engine 中处理请求，然后根据请求类型，创建出指定的 Job 并运行，运行过程的几种可能：向 Docker Registry 获取镜像，通过 graphdriver 执行容器镜像的本地化操作，通过 networkdriver 执行容器网络环境的配置，通过 execdriver 执行容器内部运行的执行工作等。")])]),e._v(" "),s("li",[s("p",[s("a",{attrs:{href:"https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/docker-brew.jpg",target:"_blank",rel:"nofollow noopener noreferrer"}},[e._v("启动 docker daemon"),s("OutboundLink")],1)])]),e._v(" "),s("li",[s("p",[e._v("配置阿里云镜像加速："),s("code",[e._v("vi /etc/docker/daemon.json")])])])]),e._v(" "),s("div",{staticClass:"language-json line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token property"}},[e._v('"registry-mirrors"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("[")]),s("span",{pre:!0,attrs:{class:"token string"}},[e._v('"https://5xok66d4.mirror.aliyuncs.com"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("]")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),e._v("\n")])]),e._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[e._v("1")]),s("br")])]),s("ul",[s("li",[e._v("重启："),s("code",[e._v("systemctl daemon-reload && systemctl restart docker")])])]),e._v(" "),s("h2",{attrs:{id:"docker-的使用"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#docker-的使用"}},[e._v("#")]),e._v(" Docker 的使用")]),e._v(" "),s("ol",[s("li",[e._v("查看版本")])]),e._v(" "),s("ul",[s("li",[e._v("docker --version")]),e._v(" "),s("li",[e._v("docker-compose --version")]),e._v(" "),s("li",[e._v("docker-machine --version")])]),e._v(" "),s("ol",{attrs:{start:"2"}},[s("li",[e._v("查看 docker 系统信息（包括镜像和容器的数量等）")])]),e._v(" "),s("ul",[s("li",[e._v("docker info")])]),e._v(" "),s("ol",{attrs:{start:"3"}},[s("li",[e._v("帮助命令")])]),e._v(" "),s("ul",[s("li",[e._v("docker help")])]),e._v(" "),s("ol",{attrs:{start:"4"}},[s("li",[e._v("查看 cpu 的状况")])]),e._v(" "),s("ul",[s("li",[e._v("docker stats")])]),e._v(" "),s("h2",{attrs:{id:"docker-的基本命令"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#docker-的基本命令"}},[e._v("#")]),e._v(" docker 的基本命令")]),e._v(" "),s("ol",[s("li",[e._v("镜像相关命令：")])]),e._v(" "),s("ul",[s("li",[e._v("查看镜像可用版本（nginx 为例）"),s("code",[e._v("docker search nginx")])])]),e._v(" "),s("ol",{attrs:{start:"2"}},[s("li",[e._v("下载一个镜像")])]),e._v(" "),s("p",[s("code",[e._v("docker pull nginx:latest（：后面跟镜像版本）")])]),e._v(" "),s("ol",{attrs:{start:"3"}},[s("li",[e._v("运行一个 nginx 服务器")])]),e._v(" "),s("p",[s("code",[e._v("docker run -d -p 81:80 --name webserver nginx")])]),e._v(" "),s("p",[e._v("可选项：")]),e._v(" "),s("ul",[s("li",[e._v("--name webserver ：容器名称，用来区分容器")]),e._v(" "),s("li",[e._v("-p 81:80 ：端口进行映射，将本地的 81 端口映射到容器内部的 80 端口")]),e._v(" "),s("li",[e._v("-v ～/nginx/html:/usr/share/nginx/html 数据卷挂载 ro/rw，将主机项目中的目录挂载到容器的目录下，默认 rw 只能在宿主机外改变，容器内部不能改变")]),e._v(" "),s("li",[e._v("-d：设置容器中在后台一直运行")]),e._v(" "),s("li",[e._v("-it：使用交互方式运行，进入容器查看内容")]),e._v(" "),s("li",[e._v("-P：随机端口")]),e._v(" "),s("li",[e._v("-e：环境配置设置")]),e._v(" "),s("li",[e._v("注意：后台启动运行，必须要有一个前台进程，docker 发现没有应用，就会自动停止")]),e._v(" "),s("li",[e._v("重点：数据卷挂载分为具名/匿名/指定路径挂载，容器数据卷挂载可以实现数据共享，容器的持久化和同步操作，可以使用 "),s("code",[e._v("docker volume")]),e._v(" 查看卷的情况，可以使用 volumes-from 实现多个容器之间的数据共享。")])]),e._v(" "),s("ol",{attrs:{start:"4"}},[s("li",[e._v("停止 nginx 服务")])]),e._v(" "),s("p",[s("code",[e._v("docker stop webserver(容器id)")])]),e._v(" "),s("ol",{attrs:{start:"5"}},[s("li",[e._v("删除 nginx 服务")])]),e._v(" "),s("p",[s("code",[e._v("docker rm webserver")])]),e._v(" "),s("ol",{attrs:{start:"6"}},[s("li",[e._v("启动/重启 nginx 服务")])]),e._v(" "),s("p",[s("code",[e._v("docker start/restart webserver")])]),e._v(" "),s("ol",{attrs:{start:"7"}},[s("li",[e._v("列出所有镜像(列表包含了 仓库名、标签、镜像 ID、创建时间 以及 所占用的空间)")])]),e._v(" "),s("p",[s("code",[e._v("docker images ls")])]),e._v(" "),s("p",[e._v("说明：")]),e._v(" "),s("ul",[s("li",[e._v("REPOSITORY 镜像的仓库源")]),e._v(" "),s("li",[e._v("TAG 镜像的标签")]),e._v(" "),s("li",[e._v("IMAGE ID 镜像的 id")]),e._v(" "),s("li",[e._v("CREATED 镜像的创建时间")]),e._v(" "),s("li",[e._v("SIZE 镜像的大小")])]),e._v(" "),s("p",[e._v("可选项：")]),e._v(" "),s("ul",[s("li",[e._v("-a：列出所有的镜像")]),e._v(" "),s("li",[e._v("-q：只显示镜像的 id")])]),e._v(" "),s("p",[e._v("注意：镜像 ID 是唯一标识，一个镜像可以对应多个标签")]),e._v(" "),s("ol",{attrs:{start:"8"}},[s("li",[e._v("查看镜像、容器、数据卷所占用的空间")])]),e._v(" "),s("p",[s("code",[e._v("docker system df")])]),e._v(" "),s("ol",{attrs:{start:"9"}},[s("li",[e._v("删除镜像")])]),e._v(" "),s("ul",[s("li",[s("p",[e._v("指定镜像："),s("code",[e._v("docker rmi [镜像名称/镜像短ID/镜像长ID/镜像摘要]")])])]),e._v(" "),s("li",[s("p",[e._v("多个镜像："),s("code",[e._v("docker rmi 镜像ID 镜像ID 镜像ID")])])]),e._v(" "),s("li",[s("p",[e._v("全部镜像："),s("code",[e._v("docker rmi $(docker images -aq)")])])])]),e._v(" "),s("ol",{attrs:{start:"10"}},[s("li",[e._v("删除 docker images ls 命令配合 删除所有仓库名为 redis 的镜像")])]),e._v(" "),s("p",[s("code",[e._v("docker rmi $(docker images ls -q redis)")])]),e._v(" "),s("ol",{attrs:{start:"11"}},[s("li",[e._v("查看镜像运行记录")])]),e._v(" "),s("p",[s("code",[e._v("docker history 镜像id")])]),e._v(" "),s("ol",{attrs:{start:"12"}},[s("li",[e._v("summary：\n"),s("ul",[s("li",[e._v("查看本地镜像："),s("code",[e._v("docker images")])]),e._v(" "),s("li",[e._v("搜索镜像："),s("code",[e._v("docker search centos")])]),e._v(" "),s("li",[e._v("搜索镜像并过滤是官方的： "),s("code",[e._v('docker search --filter "is-official=true" centos')])]),e._v(" "),s("li",[e._v("搜索镜像并过滤大于多少颗星星的："),s("code",[e._v("docker search --filter stars=10 centos")])]),e._v(" "),s("li",[e._v("下载 centos7 镜像："),s("code",[e._v("docker pull centos:7")])]),e._v(" "),s("li",[e._v("修改本地镜像名字（小写）："),s("code",[e._v("docker tag centos:7 mycentos:1")])]),e._v(" "),s("li",[e._v("本地镜像的删除："),s("code",[e._v("docker rmi centos:7")])])])])]),e._v(" "),s("h2",{attrs:{id:"容器相关命令"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#容器相关命令"}},[e._v("#")]),e._v(" 容器相关命令")]),e._v(" "),s("ol",[s("li",[e._v("列出容器")])]),e._v(" "),s("p",[s("code",[e._v("docker ps")])]),e._v(" "),s("p",[e._v("可选项：")]),e._v(" "),s("ul",[s("li",[e._v("-a：显示所有的容器，包括未运行的")]),e._v(" "),s("li",[e._v("-l：显示最近创建的容器")]),e._v(" "),s("li",[e._v("-n：列出最近创建的 n 个容器")]),e._v(" "),s("li",[e._v("-q：只显示容器的编号")])]),e._v(" "),s("ol",{attrs:{start:"2"}},[s("li",[e._v("进入容器")])]),e._v(" "),s("ul",[s("li",[s("code",[e._v("docker exec -it [容器名称] /bin/bash")])]),e._v(" "),s("li",[s("code",[e._v("docker atthch 容器id")])])]),e._v(" "),s("p",[e._v("区别："),s("code",[e._v("docker exec")]),e._v("进入容器后开启一个新的终端，可以在里面操作；"),s("code",[e._v("docker attach")]),e._v("进入容器正在执行的终端，不会启动新的进程")]),e._v(" "),s("ol",{attrs:{start:"3"}},[s("li",[e._v("退出容器")])]),e._v(" "),s("ul",[s("li",[e._v("容器停止退回主机 "),s("code",[e._v("exit")])]),e._v(" "),s("li",[e._v("容器不停止退出 "),s("code",[e._v("ctrl+p+q")])])]),e._v(" "),s("ol",{attrs:{start:"4"}},[s("li",[e._v("删除容器")])]),e._v(" "),s("ul",[s("li",[e._v("指定容器："),s("code",[e._v("docker rm [容器id]")])]),e._v(" "),s("li",[e._v("多个容器："),s("code",[e._v("docker rm 容器id 容器id 容器id")])]),e._v(" "),s("li",[e._v("所有容器："),s("code",[e._v("docker rm $(docker ps -aq) docker ps -a -q|xargs docker rm")])])]),e._v(" "),s("p",[e._v("注意：不能删除正在运行的容器，要删除正在运行的容器需要加 -f 参数，"),s("code",[e._v("docker rm -f 容器id")])]),e._v(" "),s("ol",{attrs:{start:"5"}},[s("li",[e._v("启动/重启容器")])]),e._v(" "),s("ul",[s("li",[s("code",[e._v("docker start/restart 容器id")]),e._v(":只运行 container 不进入命令行")]),e._v(" "),s("li",[s("code",[e._v("docker start -i 74cb2f9141728b8")]),e._v(":运行 container 并进入命令行")])]),e._v(" "),s("ol",[s("li",[e._v("停止/强制停止容器")])]),e._v(" "),s("p",[s("code",[e._v("docker stop/kill 容器id")])]),e._v(" "),s("ol",{attrs:{start:"7"}},[s("li",[e._v("查看容器日志")])]),e._v(" "),s("p",[s("code",[e._v("docker logs -f -t --tail 100 容器id")])]),e._v(" "),s("ul",[s("li",[e._v("--tail 后面必须加参数条数")])]),e._v(" "),s("ol",{attrs:{start:"8"}},[s("li",[e._v("查看容器中的进程信息")])]),e._v(" "),s("p",[s("code",[e._v("docker top 容器id")])]),e._v(" "),s("ol",{attrs:{start:"9"}},[s("li",[e._v("查看容器的元数据（重要命令）")])]),e._v(" "),s("p",[s("code",[e._v("docker inspect 容器id")])]),e._v(" "),s("ol",{attrs:{start:"10"}},[s("li",[e._v("从容器上拷贝数据到主机上")])]),e._v(" "),s("p",[s("code",[e._v("docker cp 容器id:容器内路径 主机路径")])]),e._v(" "),s("ol",{attrs:{start:"11"}},[s("li",[e._v("查看一个容器中 Linux 的版本")])]),e._v(" "),s("ul",[s("li",[s("ol",[s("li",[s("code",[e._v("docker exec -it [containerId/containerName] /bin/sh")])])])]),e._v(" "),s("li",[s("ol",{attrs:{start:"2"}},[s("li",[s("code",[e._v("cat /etc/*-release")])])])])]),e._v(" "),s("h2",{attrs:{id:"dockerfile-的指令"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#dockerfile-的指令"}},[e._v("#")]),e._v(" Dockerfile 的指令")]),e._v(" "),s("ul",[s("li",[e._v("FROM 基础镜像，一切从这里开始")]),e._v(" "),s("li",[e._v("MAINTAINER 镜像的作者 姓名<邮箱>")]),e._v(" "),s("li",[e._v("RUN 镜像构建需要运行的命令")]),e._v(" "),s("li",[e._v("ADD 步骤，添加内容")]),e._v(" "),s("li",[e._v("WORKDIR 镜像的工作目录")]),e._v(" "),s("li",[e._v("VOLUME 挂载的目录")]),e._v(" "),s("li",[e._v("EXPOST 端口配置")]),e._v(" "),s("li",[e._v("CMD 指定容器启动要运行的命令，只有最后一个会生效，可被替代")]),e._v(" "),s("li",[e._v("ENTRYPOINT 指定这个容器启动要运行的命令，可以追加命令")]),e._v(" "),s("li",[e._v("ONBUILD 当构建一个被继承的 Dockerfile 时会运行")]),e._v(" "),s("li",[e._v("COPY 类似 ADD 将我们文件拷贝到镜像中")]),e._v(" "),s("li",[e._v("\bENV 构建的时候设置环境变量")])]),e._v(" "),s("h2",{attrs:{id:"dockerignore"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#dockerignore"}},[e._v("#")]),e._v(" .dockerignore")]),e._v(" "),s("p",[e._v("用来忽略相应文件")]),e._v(" "),s("h2",{attrs:{id:"dockerfile-demo"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#dockerfile-demo"}},[e._v("#")]),e._v(" DockerFile Demo")]),e._v(" "),s("div",{staticClass:"language-dockerfile line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-dockerfile"}},[s("code",[s("span",{pre:!0,attrs:{class:"token instruction"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("FROM")]),e._v(" node:16-alpine "),s("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("as")]),e._v(" builder")]),e._v("\n\n"),s("span",{pre:!0,attrs:{class:"token instruction"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("WORKDIR")]),e._v(" /code")]),e._v("\n\n"),s("span",{pre:!0,attrs:{class:"token instruction"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("ADD")]),e._v(" package.json package-lock.json /code/")]),e._v("\n"),s("span",{pre:!0,attrs:{class:"token instruction"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("RUN")]),e._v(" npm install")]),e._v("\n\n"),s("span",{pre:!0,attrs:{class:"token instruction"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("ADD")]),e._v(" . /code")]),e._v("\n\n"),s("span",{pre:!0,attrs:{class:"token instruction"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("RUN")]),e._v(" npm run build")]),e._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# 选择更小体积的基础镜像")]),e._v("\n"),s("span",{pre:!0,attrs:{class:"token instruction"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("FROM")]),e._v(" nginx:alpine")]),e._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# 将构建产物移至 nginx 中")]),e._v("\n"),s("span",{pre:!0,attrs:{class:"token instruction"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("COPY")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token options"}},[s("span",{pre:!0,attrs:{class:"token property"}},[e._v("--from")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("=")]),s("span",{pre:!0,attrs:{class:"token string"}},[e._v("builder")])]),e._v(" code/build/ /usr/share/nginx/html/")]),e._v("\n")])]),e._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[e._v("1")]),s("br"),s("span",{staticClass:"line-number"},[e._v("2")]),s("br"),s("span",{staticClass:"line-number"},[e._v("3")]),s("br"),s("span",{staticClass:"line-number"},[e._v("4")]),s("br"),s("span",{staticClass:"line-number"},[e._v("5")]),s("br"),s("span",{staticClass:"line-number"},[e._v("6")]),s("br"),s("span",{staticClass:"line-number"},[e._v("7")]),s("br"),s("span",{staticClass:"line-number"},[e._v("8")]),s("br"),s("span",{staticClass:"line-number"},[e._v("9")]),s("br"),s("span",{staticClass:"line-number"},[e._v("10")]),s("br"),s("span",{staticClass:"line-number"},[e._v("11")]),s("br"),s("span",{staticClass:"line-number"},[e._v("12")]),s("br"),s("span",{staticClass:"line-number"},[e._v("13")]),s("br"),s("span",{staticClass:"line-number"},[e._v("14")]),s("br"),s("span",{staticClass:"line-number"},[e._v("15")]),s("br"),s("span",{staticClass:"line-number"},[e._v("16")]),s("br")])]),s("p",[e._v("使用 docker build 构建镜像并把它跑起来。")]),e._v(" "),s("div",{staticClass:"language-bash line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# 构建镜像")]),e._v("\n$ "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("docker")]),e._v(" build -t fe-app "),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v(".")]),e._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# 运行容器")]),e._v("\n$ "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("docker")]),e._v(" run -it --rm fe-app\n")])]),e._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[e._v("1")]),s("br"),s("span",{staticClass:"line-number"},[e._v("2")]),s("br"),s("span",{staticClass:"line-number"},[e._v("3")]),s("br"),s("span",{staticClass:"line-number"},[e._v("4")]),s("br"),s("span",{staticClass:"line-number"},[e._v("5")]),s("br")])]),s("h2",{attrs:{id:"mac-彻底删除-docker"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#mac-彻底删除-docker"}},[e._v("#")]),e._v(" MAC 彻底删除 docker")]),e._v(" "),s("p",[e._v("解决 docker 一直 starting 的问题。")]),e._v(" "),s("p",[e._v('安装 docker for mac 之后，直接在应用程序将 docker 卸载了，再次安装的时候发现 docker 启动不了，一直处于"docker is starting"状态，这时候需要彻底卸载 docker。')]),e._v(" "),s("p",[e._v("如果使用 docker.dmg 或者"),s("code",[e._v("brew cask install docker")]),e._v("安装的 docker，需要删除"),s("code",[e._v("/usr/local/bin/docker")]),e._v("文件夹下 docker 的组件：")]),e._v(" "),s("p",[e._v("命令："),s("code",[e._v("rm -rf /usr/local/bin/docker*")]),e._v(" （谨慎使用）")]),e._v(" "),s("p",[e._v("或者手动进入"),s("code",[e._v("/usr/local/bin/")]),e._v("文件夹下删除相关文件（推荐）。")]),e._v(" "),s("p",[e._v("再次安装 docker 就启动就正常了。")]),e._v(" "),s("ol",[s("li",[s("p",[s("code",[e._v("/Applications/Docker.app/Contents/MacOS/Docker --uninstall")])])]),e._v(" "),s("li",[s("p",[e._v("To uninstall Docker Desktop from your Mac:")]),e._v(" "),s("ul",[s("li",[e._v("From the Docker menu, select Troubleshoot and then select Uninstall.")]),e._v(" "),s("li",[e._v("Click Uninstall to confirm your selection.")])])]),e._v(" "),s("li",[s("p",[e._v("进入 docker 的安装目录: "),s("code",[e._v("which docker")])]),e._v(" "),s("ul",[s("li",[s("code",[e._v("cd /usr/local/bin/")])]),e._v(" "),s("li",[e._v("删除与 docker 相关的文件夹")]),e._v(" "),s("li",[s("code",[e._v("sudo rm -rf docker*")])]),e._v(" "),s("li",[s("code",[e._v("sudo rm -rf com.docker.*")])]),e._v(" "),s("li",[s("code",[e._v("sudo rm -rf hub-tool*")])]),e._v(" "),s("li",[s("code",[e._v("sudo rm -rf kube*")])]),e._v(" "),s("li",[s("code",[e._v("sudo rm -rf vpnkit*")])])])])]),e._v(" "),s("h2",{attrs:{id:"learn-docker"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#learn-docker"}},[e._v("#")]),e._v(" Learn Docker")]),e._v(" "),s("h3",{attrs:{id:"_1-基础启动命令"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_1-基础启动命令"}},[e._v("#")]),e._v(" 1. 基础启动命令")]),e._v(" "),s("ol",[s("li",[e._v("docker 启动命令, docker 重启命令, docker 关闭命令")])]),e._v(" "),s("ul",[s("li",[e._v("启动 "),s("code",[e._v("systemctl start docker")])]),e._v(" "),s("li",[e._v("守护进程重启 "),s("code",[e._v("sudo systemctl daemon-reload")])]),e._v(" "),s("li",[e._v("重启 docker 服务 "),s("code",[e._v("systemctl restart docker")])]),e._v(" "),s("li",[e._v("重启 docker 服务 "),s("code",[e._v("sudo service docker restart")])]),e._v(" "),s("li",[e._v("关闭 docker "),s("code",[e._v("service docker stop")])]),e._v(" "),s("li",[e._v("关闭 docker "),s("code",[e._v("systemctl stop docker")])])]),e._v(" "),s("ol",{attrs:{start:"2"}},[s("li",[e._v("如何启动应用")])]),e._v(" "),s("p",[e._v("启动："),s("code",[e._v("docker start 应用名称")])]),e._v(" "),s("h3",{attrs:{id:"_2-容器的构建等基本操作"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2-容器的构建等基本操作"}},[e._v("#")]),e._v(" 2. 容器的构建等基本操作")]),e._v(" "),s("ol",[s("li",[e._v("Docker 容器的创建，查看，停止，重启等\n"),s("ul",[s("li",[e._v("构建容器："),s("code",[e._v("docker run -itd --name=mycentos centos:7")]),e._v(" "),s("ul",[s("li",[s("code",[e._v("-i")]),e._v(" ：表示以交互模式运行容器（让容器的标准输入保持打开）")]),e._v(" "),s("li",[s("code",[e._v("-d")]),e._v("：表示后台运行容器，并返回容器 ID")]),e._v(" "),s("li",[s("code",[e._v("-t")]),e._v("：为容器重新分配一个伪输入终端")]),e._v(" "),s("li",[s("code",[e._v("--name")]),e._v("：为容器指定名称")])])])])]),e._v(" "),s("li",[e._v("查看本地所有的容器："),s("code",[e._v("docker ps -a")])]),e._v(" "),s("li",[e._v("查看本地正在运行的容器："),s("code",[e._v("docker ps")])]),e._v(" "),s("li",[e._v("停止容器："),s("code",[e._v("docker stop CONTAINER_ID / CONTAINER_NAME")])]),e._v(" "),s("li",[e._v("一次性停止所有容器："),s("code",[e._v("docker stop $(docker ps -a -q)")])]),e._v(" "),s("li",[e._v("启动容器："),s("code",[e._v("docker start CONTAINER_ID / CONTAINER_NAME")])]),e._v(" "),s("li",[e._v("重启容器："),s("code",[e._v("docker restart CONTAINER_ID / CONTAINER_NAME")])]),e._v(" "),s("li",[e._v("删除容器："),s("code",[e._v("docker rm CONTAINER_ID / CONTAINER_NAME")])]),e._v(" "),s("li",[e._v("强制删除容器："),s("code",[e._v("docker rmi -f CONTAINER_ID / CONTAINER_NAME")])]),e._v(" "),s("li",[e._v("查看容器详细信息："),s("code",[e._v("docker inspect CONTAINER_ID / CONTAINER_NAME")])]),e._v(" "),s("li",[e._v("进入容器："),s("code",[e._v("docker exec -it 0ad5d7b2c3a4 /bin/bash")])])]),e._v(" "),s("h3",{attrs:{id:"_3-容器的文件复制与挂载"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-容器的文件复制与挂载"}},[e._v("#")]),e._v(" 3. 容器的文件复制与挂载")]),e._v(" "),s("p",[e._v("容器与宿主机之间文件复制与挂载。")]),e._v(" "),s("ol",[s("li",[e._v("从宿主机复制到容器："),s("code",[e._v("docker cp 宿主机本地路径 容器名字/ID：容器路径")]),e._v(" "),s("ul",[s("li",[s("code",[e._v("docker cp /root/123.txt mycentos:/home/")])])])]),e._v(" "),s("li",[e._v("从容器复制到宿主机："),s("code",[e._v("docker cp 容器名字/ID：容器路径 宿主机本地路径")]),e._v(" "),s("ul",[s("li",[s("code",[e._v("docker cp mycentos:/home/456.txt /root")])])])]),e._v(" "),s("li",[e._v("宿主机文件夹挂载到容器里："),s("code",[e._v("docker run -itd -v 宿主机路径:容器路径 镜像ID")]),e._v(" "),s("ul",[s("li",[s("code",[e._v("docker run -itd -v /root/xdclass/:/home centos:7")])])])])]),e._v(" "),s("h3",{attrs:{id:"docker-目前镜像的制作有-2-种方法"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#docker-目前镜像的制作有-2-种方法"}},[e._v("#")]),e._v(" docker 目前镜像的制作有 2 种方法")]),e._v(" "),s("ol",[s("li",[e._v("基于 Docker Commit 制作镜像")]),e._v(" "),s("li",[e._v("基于 dockerfile 制作镜像，Dockerfile 方式为主流的制作镜像方式")])]),e._v(" "),s("h3",{attrs:{id:"_4-commit-构建自定义镜像"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_4-commit-构建自定义镜像"}},[e._v("#")]),e._v(" 4. Commit 构建自定义镜像")]),e._v(" "),s("ul",[s("li",[e._v("对容器的修改以及保存")])]),e._v(" "),s("ol",[s("li",[e._v("启动并进入容器："),s("code",[e._v("docker run -it centos:7 /bin/bash")])]),e._v(" "),s("li",[e._v("在/home 路径下创建 xdclass 文件夹："),s("code",[e._v("mkdir /home/xdclass")])]),e._v(" "),s("li",[e._v("安装 ifconfig 命令："),s("code",[e._v("yum -y install net-tools")])]),e._v(" "),s("li",[e._v("重启容器，查看容器的 xdclass 文件夹还在不在："),s("code",[e._v("docker restart 67862569d4f7")])]),e._v(" "),s("li",[e._v("删除容器，再重新启动一个容器进入查看有没有 xdclass 文件夹："),s("code",[e._v("docker rm 67862569d4f7 && docker run -it centos:7 /bin/bash")])]),e._v(" "),s("li",[e._v("构建镜像：\n"),s("ul",[s("li",[s("code",[e._v("docker commit 4eb9d14ebb18 mycentos:7")])]),e._v(" "),s("li",[s("code",[e._v('docker commit -a "XD" -m "mkdir /home/xdclass" 4eb9d14ebb18 mcentos:7')])]),e._v(" "),s("li",[s("code",[e._v("-a")]),e._v("：标注作者")]),e._v(" "),s("li",[s("code",[e._v("-m")]),e._v("：说明注释")]),e._v(" "),s("li",[e._v("查看详细信息："),s("code",[e._v("docker inspect 180176be1b4c")])])])]),e._v(" "),s("li",[e._v("启动容器："),s("code",[e._v("docker run -itd 180176be1b4c /bin/bash")])]),e._v(" "),s("li",[e._v("进入容器查看："),s("code",[e._v("docker exec -it 2a4d38eca64f /bin/bash")])])]),e._v(" "),s("ul",[s("li",[e._v("Dockerfile 构建镜像")])]),e._v(" "),s("ol",[s("li",[e._v("Dockerfile")])]),e._v(" "),s("div",{staticClass:"language-bash line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# this is a dockerfile")]),e._v("\nFROM centos:7\nMAINTAINER XD "),s("span",{pre:!0,attrs:{class:"token number"}},[e._v("123456")]),e._v("@qq.com\nRUN "),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("echo")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[e._v('"正在构建镜像！！！"')]),e._v("\nWORKDIR /home/xdclass\nCOPY "),s("span",{pre:!0,attrs:{class:"token number"}},[e._v("123")]),e._v(".txt /home/xdclass\nRUN yum "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("install")]),e._v(" -y net-tools\n")])]),e._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[e._v("1")]),s("br"),s("span",{staticClass:"line-number"},[e._v("2")]),s("br"),s("span",{staticClass:"line-number"},[e._v("3")]),s("br"),s("span",{staticClass:"line-number"},[e._v("4")]),s("br"),s("span",{staticClass:"line-number"},[e._v("5")]),s("br"),s("span",{staticClass:"line-number"},[e._v("6")]),s("br"),s("span",{staticClass:"line-number"},[e._v("7")]),s("br")])]),s("ol",{attrs:{start:"2"}},[s("li",[e._v("构建："),s("code",[e._v("docker build -t mycentos:v2 .")])]),e._v(" "),s("li",[e._v("查看："),s("code",[e._v("docker images")])]),e._v(" "),s("li",[e._v("进入验证：验证成功")])]),e._v(" "),s("h3",{attrs:{id:"_5-介绍一些常用的-dockerfile-指令"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_5-介绍一些常用的-dockerfile-指令"}},[e._v("#")]),e._v(" 5. 介绍一些常用的 Dockerfile 指令")]),e._v(" "),s("ul",[s("li",[e._v("FROM:基于哪个镜像")]),e._v(" "),s("li",[e._v("MAINTAINER:注明作者")]),e._v(" "),s("li",[e._v("COPY:复制文件进入镜像（只能用相对路径，不能用绝对路径）")]),e._v(" "),s("li",[e._v("ADD:复制文件进入镜像（假如文件是.tar.gz 文件会解压）")]),e._v(" "),s("li",[e._v("WORKDIR:指定工作目录，假如路径不存在会创建路径")]),e._v(" "),s("li",[e._v("ENV:设置环境变量")]),e._v(" "),s("li",[e._v("EXPOSE:暴露容器端口")]),e._v(" "),s("li",[e._v("RUN:在构建镜像的时候执行，作用于镜像层面")]),e._v(" "),s("li",[e._v("ENTRYPOINT:在容器启动的时候执行，作用于容器层，dockerfile 里有多条时只允许执行最后一条")]),e._v(" "),s("li",[e._v("CMD:\n"),s("ul",[s("li",[e._v("在容器启动的时候执行，作用于容器层，dockerfile 里有多条时只允许执行最后一条")]),e._v(" "),s("li",[e._v("容器启动后执行默认的命令或者参数，允许被修改")])])]),e._v(" "),s("li",[e._v("命令格式：\n"),s("ul",[s("li",[e._v("shell 命令格式："),s("code",[e._v("RUN yum install -y net-tools")])]),e._v(" "),s("li",[e._v("exec 命令格式："),s("code",[e._v('RUN [ "yum","install" ,"-y" ,"net-tools"]')])])])])]),e._v(" "),s("h3",{attrs:{id:"自己构建的容器无法启动怎么办"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#自己构建的容器无法启动怎么办"}},[e._v("#")]),e._v(" 自己构建的容器无法启动怎么办")]),e._v(" "),s("ul",[s("li",[e._v("通过"),s("code",[e._v("docker exec -it <container_id> sh")]),e._v("无法进入容器进行调试，此时可以：")])]),e._v(" "),s("ol",{attrs:{start:"0"}},[s("li",[e._v("检查 Dockerfile 和构建输出中的错误信息")]),e._v(" "),s("li",[e._v("使用"),s("code",[e._v("docker run -it --entrypoint sh <image_id>")]),e._v("来启动容器\n"),s("ul",[s("li",[e._v("使用你构建的镜像启动一个容器")]),e._v(" "),s("li",[e._v("覆盖默认的 ENTRYPOINT,使用 sh 命令作为入口点")]),e._v(" "),s("li",[e._v("-it 参数可以让你进入容器内部的 shell")])])]),e._v(" "),s("li",[e._v("一种方式是使用 Dockerfile 的 RUN 指令，在构建阶段就检查容器内部（示例如下），这样不需要启动容器:这会直接在构建输出中返回命令执行结果，你可以根据输出来检查问题所在。")])]),e._v(" "),s("div",{staticClass:"language-sh line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-sh"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# dockerfile")]),e._v("\nRUN "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("[")]),s("span",{pre:!0,attrs:{class:"token string"}},[e._v('"sh"')]),e._v(", "),s("span",{pre:!0,attrs:{class:"token string"}},[e._v('"-c"')]),e._v(", "),s("span",{pre:!0,attrs:{class:"token string"}},[e._v('"ls /usr/local/bin/ | grep jenkins-agent"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("]")]),e._v("\nRUN "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("[")]),s("span",{pre:!0,attrs:{class:"token string"}},[e._v('"sh"')]),e._v(", "),s("span",{pre:!0,attrs:{class:"token string"}},[e._v('"-c"')]),e._v(", "),s("span",{pre:!0,attrs:{class:"token string"}},[e._v('"chmod +x /usr/local/bin/jenkins-agent"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("]")]),e._v("\nRUN "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("[")]),s("span",{pre:!0,attrs:{class:"token string"}},[e._v('"sh"')]),e._v(", "),s("span",{pre:!0,attrs:{class:"token string"}},[e._v('"-c"')]),e._v(", "),s("span",{pre:!0,attrs:{class:"token string"}},[e._v('"/usr/local/bin/jenkins-agent"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("]")]),e._v("\n")])]),e._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[e._v("1")]),s("br"),s("span",{staticClass:"line-number"},[e._v("2")]),s("br"),s("span",{staticClass:"line-number"},[e._v("3")]),s("br"),s("span",{staticClass:"line-number"},[e._v("4")]),s("br")])]),s("ol",{attrs:{start:"3"}},[s("li",[s("code",[e._v("docker logs <container_id>")]),e._v(" 的输出(如果容器有启动的话)")])]),e._v(" "),s("h3",{attrs:{id:"总结"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#总结"}},[e._v("#")]),e._v(" 总结")]),e._v(" "),s("p",[e._v("Docker 是一种虚拟化技术，通过容器的方式，它的实现原理依赖 linux 的 Namespace、Control Group、UnionFS 这三种机制。")]),e._v(" "),s("p",[e._v("Namespace 做资源隔离，Control Group 做容器的资源限制，UnionFS 做文件系统的镜像存储、写时复制、镜像合并。")]),e._v(" "),s("p",[e._v("一般我们是通过 dockerfile 描述镜像构建的过程，然后通过 "),s("code",[e._v("docker build")]),e._v(" 构建出镜像，上传到 registry。")]),e._v(" "),s("p",[e._v("镜像通过 docker run 就可以跑起来，对外提供服务。")]),e._v(" "),s("p",[e._v("用 dockerfile 做部署的最佳实践是分阶段构建，build 阶段单独生成一个镜像，然后把产物复制到另一个镜像，把这个镜像上传 registry。")]),e._v(" "),s("p",[e._v("这样镜像是最小的，传输速度、运行速度都比较快。")]),e._v(" "),s("p",[e._v("Dockerfile 是一个文本文件，包含了用于构建 Docker 镜像的指令和参数。您可以使用 "),s("code",[e._v("docker build")]),e._v(" 命令来构建一个 Docker 镜像，指定 Dockerfile 的路径即可。例如："),s("code",[e._v("docker build -f /path/to/Dockerfile .")]),e._v("。")]),e._v(" "),s("p",[e._v("一旦 Docker 镜像被构建出来，您可以使用 docker run 命令来创建容器。容器是基于 Docker 镜像的运行实例，可以在容器内运行应用程序。例如："),s("code",[e._v("docker run myimage-name")]),e._v("。")]),e._v(" "),s("p",[e._v("简而言之，Dockerfile 用于构建 Docker 镜像，而 Docker 镜像用于创建 Docker 容器。")]),e._v(" "),s("p",[e._v("一般我们都是在 jenkins 里跑，push 代码的时候，通过 web hooks 触发 jenkins 构建，最终产生运行时的镜像，上传到 registry。\n部署的时候把这个镜像 "),s("code",[e._v("docker pull")]),e._v(" 下来，然后 "),s("code",[e._v("docker run")]),e._v(" 就完成了部署。")]),e._v(" "),s("p",[e._v("前端、node 的代码都可以用 docker 部署，前端代码的静态服务还要作为 CDN 的源站服务器，不过我们也不一定要自己部署，很可能直接用阿里云的 OSS 对象存储服务了。")]),e._v(" "),s("h2",{attrs:{id:"docker-技术解决的问题是什么"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#docker-技术解决的问题是什么"}},[e._v("#")]),e._v(" Docker 技术解决的问题是什么")]),e._v(" "),s("p",[e._v("代码开发完之后，要经过构建，把产物部署到服务器上跑起来，这样才能被用户访问到。")]),e._v(" "),s("p",[e._v("不同的代码需要不同的环境，比如 JS 代码的构建需要 node 环境，Java 代码 需要 JVM 环境，一般我们会把它们隔离开来单独部署。")]),e._v(" "),s("p",[e._v("现在一台物理主机的性能是很高的，完全可以同时跑很多个服务，而我们又有环境隔离的需求，所以会用虚拟化技术把一台物理主机变为多台虚拟主机来用。")]),e._v(" "),s("p",[e._v("现在主流的"),s("strong",[e._v("虚拟化技术")]),e._v("就是 docker 了，它是"),s("strong",[e._v("基于容器的虚拟化技术")]),e._v("。")]),e._v(" "),s("p",[s("strong",[e._v("它可以在一台机器上跑多个容器，每个容器都有独立的操作系统环境，比如文件系统、网络端口等")]),e._v("。")]),e._v(" "),s("h2",{attrs:{id:"远程仓库"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#远程仓库"}},[e._v("#")]),e._v(" 远程仓库")]),e._v(" "),s("ul",[s("li",[e._v("hi, I want to pull a docker image from remote repo and change sth of this image, and then push the changed image to the remote repo, how to make it?")])]),e._v(" "),s("ol",{attrs:{start:"0"}},[s("li",[e._v("要有个账号，docker 的或者私有的")]),e._v(" "),s("li",[s("code",[e._v("docker pull <remote_repo>/<image_name>:<tag>")])]),e._v(" "),s("li",[s("code",[e._v("docker run -it <remote_repo>/<image_name>:<tag> /bin/bash")])]),e._v(" "),s("li",[e._v("make changes to the image.")]),e._v(" "),s("li",[s("code",[e._v("docker commit <container_id> <remote_repo>/<image_name>:<new_tag>")])]),e._v(" "),s("li",[s("code",[e._v("docker push <remote_repo>/<image_name>:<new_tag>")])])]),e._v(" "),s("h2",{attrs:{id:"podman"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#podman"}},[e._v("#")]),e._v(" PodMan")]),e._v(" "),s("p",[e._v("TODO")]),e._v(" "),s("h2",{attrs:{id:"k8s"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#k8s"}},[e._v("#")]),e._v(" K8S")]),e._v(" "),s("p",[e._v("TODO")])])}),[],!1,null,null,null);r.default=v.exports}}]);