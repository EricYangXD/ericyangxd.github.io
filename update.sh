#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

git add -A
git commit -m 'update'
git push origin master -u

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 拷贝目录和文件
cp -r ../../../.github ./
cp -r ../../../CNAME ./
cp -r ../../../demos ./

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:EricYangXD/ericyangxd.github.io.git master:gh-pages
git push -f git@gitee.com:EricYangXD/my-vuepress-blog.git master:gh-pages

cd -
