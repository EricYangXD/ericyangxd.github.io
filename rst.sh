#!/bin/sh

# 备份一下，还要修改

set -e

echo "start deploying to the target"

# open /Applications/Docker.app

# docker stop $(docker ps -a -q)
# docker stop eso-sdk-container

# docker restart eso-sdk-container
# docker start eso-sdk-container

# ./mbbb-commons-carapp-mib3/build/build.sh -t deployTarget

# 检查docker deamon是否在运行
docker_status=$(docker info | grep 'Storage Driver')
if [ -z "$docker_status" ]; then
  echo -e "\nDocker deamon not running,starting..."
  # 启动docker deamon
  sudo systemctl start docker
else
  echo -e "\nDocker deamon running"
fi

# 启动一个叫做eso-sdk-container的容器
docker run -dit --name eso-sdk-container ubuntu:16.04

# 进入/Users/valtechwh/job/mbbb-dopi-carapp-mib3-asia目录执行
docker exec -it eso-sdk-container /bin/bash -c "cd /Users/valtechwh/job/mbbb-dopi-carapp-mib3-asia; ./mbbb-commons-carapp-mib3/build/build.sh -t deployProd"
echo -e "\nScript executed"

# 检查docker daemon是否在运行
if [! systemctl status docker >/dev/null]; then
  # 启动docker desktop
  open -a Docker
fi

# 启动eso-sdk-container容器
docker start eso-sdk-container

# 进入mbbb-dopi-carapp-mib3-asia目录
cd /Users/valtechwh/job/mbbb-dopi-carapp-mib3-asia
# 执行mbbb-commons-carapp-mib3/build/build.sh -t deployProd
./mbbb-commons-carapp-mib3/build/build.sh -t deployProd
