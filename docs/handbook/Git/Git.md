---
title: Git有用的命令 & VSCode插件
author: EricYangXD
date: "2022-01-13"
meta:
  - name: keywords
    content: Git,git,rebase,merge,revert,stash
---

## Git 命令

### git rebase

> 不要对在你的仓库外有副本的分支执行变基。

与 merge 会保留修改内容的历史记录不同，rebase 是在原有提交的基础上将差异内容反映进去。

1. `git rebase oem-develop`
   - 切换到自己的 feature 分支后，执行此命令实现变基
   - 解决冲突后的提交不是使用 commit 命令，而是执行 rebase 命令指定 `git rebase --continue` 选项。
   - 若要取消 rebase，指定 `--abort` 选项。
2. `git push --force-with-lease origin feature/xx`
   - 强制把本地 rebase 之后的分支推送到远端
3. 变基操作的实质是丢弃一些现有的提交，然后相应地新建一些内容一样但实际上不同的提交。
4. 撤销提交的不同:如果使用 merge 进行合并，可以使用 revert 命令对 merge 的内容进行撤销操作（参考 revert），而使用 rebase 则不行（已经没有 merge commit 了），而需要使用 rebase -i 对提交进行重新编辑。
5. 使用 `git rebase -i <branch>` 可以进入交互式模式，可以对「某一范围内的提交」进行重新编辑。
6. 默认情况下，直接使用 `git rebase -i` 命令的操作对象为自最后一次从 origin 仓库拉取或者向 origin 推送之后的所有提交。
7. 删除提交：如果想删除某个提交，使用 `git rebase -i` 后直接在编辑器中删除那一行 commit 即可
8. 拆分提交：如果想把某个 commit 拆分成多个 commit，可以使用 edit 作为 action，edit 表示 使用该提交，但是先在这一步停一下，等我重新编辑完再进行下一步。
9. 合并提交：
   - 首先找到起始 commit 的 前一个例如：aaa，rebase 会显示当前分支从这个 comimt 之后的所有 commit。
   - 执行 `git rebase -i 865b2ac`，会自动唤出编辑器，假如想把后三个提交合并到第一个中去，这里需要用到 squash，该 action 表示 使用该提交，但是把它与前一提交合并，所以只需把后三个的 action 改为 squash 即可。
   - 保存之后，会唤出编辑器提示基于历史的提交信息创建一个新的提交信息，也就是需要用户编辑一下合并之后的 commit 信息，更改提示信息并保存即可。

### git reset

强制回退，可能会把别人的代码也干掉

1. `git reset --hard HEAD^SHA256`
   - 硬回退，不保留 stash
2. `git reset --soft HEAD^/SHA256`
   - 软回退，保留 stash

reset 之后再提交代码时需要强制提交-f

### git commit --amend

直接修改当前的提交信息，如果代码有更改，则需要先执行 git add

### git revert

原理是在当前提交后面，新增一条提交，抵消掉上一次提交导致的所有变化。它不会改变过去的提交历史，也不会影响后续的提交，所以是安全的，首选的，没有任何丢失代码风险的。

1. `git revert commitId1 [commitid2 commitId3 ...]`

### git tag

Git 中的标签分为两种，一种是轻量标签（lightweight tag），一种是附注标签（annotated tag）。

tag 对应某次 commit， 是一个点，是不可移动的。branch 对应一系列 commit，是很多点连成的一根线，有一个 HEAD 指针，是可以依靠 HEAD 指针移动的。所以，两者的区别决定了使用方式，改动代码用 branch，不改动只查看用 tag。常用于上线之前对当前的 commit 记录打一个 tag，方便上线的代码有问题时可以及时回滚。

需要特别说明的是，如果我们想要修改 tag 检出代码分支，那么虽然分支中的代码改变了，但是 tag 标记的 commit 还是同一个，标记的代码是不会变的。

1. `git tag <lightweght_name>`：为当前分支所在的提交记录打上轻量标签。
2. `git tag <lightweght_name> <commit SHA-1 value>`：为某次具体的提交记录打上轻量标签。
3. `git tag -a <anotated_name> -m <tag_message>`：为当前分支所在的提交记录打上附注标签。
4. `git tag`或`git tag -l`：列出所有的标签名。
5. `git ls-remote --tags origin`：查看远程所有 tag。
6. `git tag -d <tag_name>`：删除某个标签，本质上就是移除 `.git/refs/tags/` 中对应的文件。
7. `git show <tag_name>`：显示标签对应提交记录的具体信息。
8. `git push <remote> <tag_name>`：推送某个标签到远程仓库。
9. `git push <remote> --tags`：推送所有标签到远程仓库。
10. `git tag -d <tagName>`：本地 tag 的删除。
11. `git push <remote> --delete <tag_name>`：删除远程仓库中的某个标签。
12. `git push <remote> :refs/tags/<tagname>`：删除远程仓库某个标签的等价方式，相当于将冒号前面的空值推送到远程标签名，从而高效地删除它。
13. `git checkout -b <branchName> <tagName>`：检出标签，因为 tag 本身指向的就是一个 commit，所以和根据 commit id 检出分支是一个道理。
14. ``：。

示例：

- 新增 tag `git tag -a v1.0.0 -m "my version v1.0.0"`

- 查看 tag `git show v1.0.0`

- 推送远端 `git push origin v1.0.0`

PS: tag 和在哪个分支创建是没有关系的，tag 只是提交的别名。因此 commit 的能力 tag 均可以使用，比如`git reset`，`git revert [pre-tag]`

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

### git cherry-pick

1. 选一次提交：`git cherry-pick <commitHash>`
2. 选多次提交：`git cherry-pick <HashA> <HashB>`
3. 选多次提交：`git cherry-pick A..B`，提交 A 必须早于提交 B，提交 A 将不会包含在 Cherry pick 中
4. 选多次提交：`git cherry-pick A^..B`，包含提交 A
5. 解决冲突后：1. `git add .`
6. 解决冲突后：2. `git cherry-pick --continue`
7. 发生代码冲突后，放弃合并，回到操作前的样子：`git cherry-pick --abort`
8. 发生代码冲突后，退出 Cherry pick，但是不回到操作前的样子：`git cherry-pick --quit`

- Cherry pick 也支持转移另一个代码库的提交，方法是先将该库加为远程仓库。
  1. 添加了一个远程仓库 target：`git remote add target git://gitUrl`
  2. 远程代码抓取到本地：`git fetch target`
  3. 检查一下要从远程仓库转移的提交，获取它的哈希值：`git log target/master`
  4. 使用 git cherry-pick 命令转移提交：`git cherry-pick <commitHash>`

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

### 如何把一份本地代码同时上传 gitlab 和 gitee

git 本身是分布式版本控制系统，可以同步到另外一个远程库，当然也可以同步到另外两个远程库，所以一个本地库可以既关联 GitHub，又关联码云！

使用多个远程库时，要注意 git 给远程库起的默认名称是 origin，如果有多个远程库，我们需要用不同的名称来标识不同的远程库。仍然以 learngit 本地库为例，先删除已关联的名为 origin 的远程库：

```git
git remote rm origin
```

然后，先关联 GitHub 的远程库：

```git
git remote add github git@github.com:xxx/LearnGit.git
```

注意，远程库的名称叫 github，不叫 origin 了。
接着，再关联码云的远程库：

```git
git remote add gitee git@gitee.com:xxx/LearnGit.git
```

同样注意，远程库的名称叫 gitee，不叫 origin。
现在，我们用 git remote -v 查看远程库信息，可以看到两个远程库：

```git
gitee git@gitee.com:xxx/LearnGit.git (fetch)
gitee git@gitee.com:xxx/LearnGit.git (push)
github git@github.com:xxx/LearnGit.git (fetch)
github git@github.com:xxx/LearnGit.git (push)如果要推送到GitHub，使用命令：
git push github master
```

如果要推送到码云，使用命令：

```git
git push gitee master
```

这样一来，本地库就可以同时与多个远程库互相同步

### 不切换 Git 分支，却能同时在多个分支上工作

正在开发某个 feature，老板突然跳出来说让你做生产上的 hotfix，面对这种情况，使用 Git 的我们通常有两种解决方案：

1. 草草提交未完成的 feature，然后切换分支到 hotfix
2. git stash | git stash pop 暂存工作内容，然后再切换到 hotfix
3. git clone 多个 repo

使用 git-worktree，仅需维护一个 repo，又可以同时在多个 branch 上工作，互不影响！！！

常用的其实只有下面这四个命令：

```bash
# 添加一个worktree
git worktree add [-f] [--detach] [--checkout] [--lock] [-b <new-branch>] <path> [<commit-ish>]
# 列出当前的worktree，在任意一个worktree下都可用
git worktree list [--porcelain]
# 移除某些不需要的worktree
git worktree remove [-f] <worktree>
# 清洁的兜底操作，可以让我们的工作始终保持整洁
git worktree prune [-n] [-v] [--expire <expire>]
```

普及两个你可能忽视的 Git 知识点：

1. 默认情况下， git init 或 git clone 初始化的 repo，只有一个 worktree，叫做 main worktree;
2. 在某一个目录下使用 Git 命令，当前目录下要么有 .git 文件夹；要么有 .git 文件，如果只有 .git 文件，里面的内容必须是指向 .git 文件夹的;

eg.

`git worktree add -b "hotfix/JIRA234-fix-naming" ../hotfix/JIRA234-fix-naming`.

`git worktree list`.

`git worktree remove hotfix/hotfix/JIRA234-fix-naming`.

建议：通常使用 git worktree，我会统一目录结构，比如 feature 目录下存放所有 feature 的 worktree，hotfix 目录下存放所有 hotfix 的 worktree，这样整个磁盘目录结构不至于因为创建多个 worktree 而变得混乱。

### git 命令设置别名

1. git config --global alias.ps push - 把 push 设为 ps；
2. 手动编辑全局配置文件：
   - `nano ~/.gitconfig`
   - 写入对应的别名对，例：`co = checkout pl = pull`等并保存退出，
   - 执行`source ~/.gitconfig`使改动生效

### git hooks 原理

1. git 允许在各种操作之前添加一些 hook 脚本，如未正常运行则 git 操作不通过。最出名的还是以下两个：
   - precommit
   - prepush
2. hook 脚本置于目录 ~/.git/hooks 中，以「可执行文件」的形式存在。查看命令：`ls -lah .git/hooks`。
3. git hooks 可使用 core.hooksPath 自定义脚本位置。
4. husky 即通过自定义 core.hooksPath 并将 npm scripts 写入其中的方式来实现此功能。
   - 在`~/.husky` 目录下手动创建 hook 脚本。如：`vim .husky/pre-commit`
   - 在 hook 脚本中做一些操作，如：在 pre-commit 中进行代码风格校验：`npm run lint && npm run test`

### git 设置识别文件名大小写

`git config core.ignoreCase true/false`

### git reflog

结合`.git/logs/HEAD`，勿删 commit 或分支之后找回。

### 强制禁用 Fast-Forward

`git merge --no-ff`会生成一个新的 commit。如果没有禁止 ff，那么有时候： 假如`learn-merge` 分支的历史记录包含 `master` 分支所有的历史记录，当我们要把`learn-merge`合并到`master`上时，这个合并是非常简单的。只需要通过把 `master` 分支的 HEAD 位置移动到 `learn-merge` 的最新 commit 上，Git 就会合并。fast-forward 模式下是不可能出现冲突的。**此时，即 Fast-Forward 时，没有产生新的 commit！！！**

### git 是如何存储信息的

查看.git/objects 目录：

1. 当使用 git add 命令把文件加入暂存区时，git 会根据这个对象的内容计算出 SHA-1 值
2. git 接着会用 SHA-1 值的前 2 个字符作为目录名称（避免让.git/objects 目录因为文件过多而降低读取效率），后 38 个字符作为文件名，创建目录及文件并放在.git/objects 目录下
3. 文件的内容则是 git 使用压缩算法把原本的内容压缩之后的结果（二进制 blob 文件）
4. git commit 存储的是：打包前存储的是全新文件，打包后使用了类似差异备份的方式进行存储
5. 当.git/objects 目录下对象过多时会自动触发资源回收，或者 git push 到远端服务器时，也可通过`git gc`手动触发

## 开启 ssr 之后无法从 GitHub 下载项目

打开 SSR 的「HTTP 代理设置」，查看端口，勾选「HTTP 代理设置」。然后在 zsh 执行如下命令：

```bash
git config --global http.proxy http://127.0.0.1:port
git config --global https.proxy http://127.0.0.1:port
```
