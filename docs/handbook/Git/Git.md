---
title: Git有用的命令 & VSCode插件
author: EricYangXD
date: "2022-01-13"
---

## Git 命令

### git rebase

1. git rebase oem-develop
    - 切换到自己的 feature 分支后，执行此命令实现变基
2. git push --force-with-lease origin feature/xx
    - 强制把本地 rebase 之后的分支推送到远端

### git reset

强制回退，可能会把别人的代码也干掉

1. git reset --hard HEAD^SHA256
    - 硬回退，不保留 stash
2. git reset --soft HEAD^/SHA256
    - 软回退，保留 stash

reset 之后再提交代码时需要强制提交-f

### git revert

原理是在当前提交后面，新增一条提交，抵消掉上一次提交导致的所有变化。它不会改变过去的提交历史，也不会影响后续的提交，所以是安全的，首选的，没有任何丢失代码风险的。

1. git revert commitId1 [commitid2 commitId3 ...]

### git tag

常用于上线之前对当前的 commit 记录打一个 tag，方便上线的代码有问题时可以及时回滚

1. git tag 列出所有的 tag 列表
2. git tag [tagname] 创建一个新 tag
3. git show [tagname] 查看对应 tag 的 commit 信息

### git stash

1. git stash save "commit msg"
2. git stash apply SHA256/stash@{number}
3. git stash pop
    - 默认最近一次 stash
4. git stash list
5. git stash drop SHA256/stash@{number}
6. 误操作 git stash drop 之后想恢复
    - git fsck --lost-found 可以得到 SHA256 列表
    - git show SHA256 可以查看详细信息
    - git stash apply SHA256 应用

### git bisect

使用 git bisect 二分法定位问题的基本步骤：

1. git bisect start [最近的出错的 commitid] [较远的正确的 commitid]
2. 测试相应的功能
3. git bisect good 标记正确
4. 直到出现问题则 标记错误 git bisect bad
5. 提示的 commitid 就是导致问题的那次提交
6. 具体示例参考[这里](https://mp.weixin.qq.com/s/d0LvAd8cDQD_3KSX1fOpkQ)

## 修改 Git commit msg

1. 修改最近一次的 commit 信息 git commit --amend
2. git reset --soft HEAD^ 重新提交
3. git log --oneline -5 查看最近 5 次 commit 的简要信息
4. 比如要修改的 commit 是倒数第三条，使用下述命令：

```
git rebase -i HEAD~3
退出保存 :wq
执行 git rebase --continue
执行 git push -f 推送到服务端。
```

## VSCode 插件/扩展

### Git Graph

可视化查看代码仓库分支和提交记录，右键管理操作分支

### GitLens

### Git History

提交记录

### Git Blame

提交记录

### gitignore

为.gitignore 文件提供语法支持，远程下载.gitignore 模板

### Git Project Manager

### Git History Diff

提交记录对比
