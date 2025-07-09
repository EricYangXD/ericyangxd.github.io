---
title: Git有用的命令 & VSCode插件
author: EricYangXD
date: "2022-01-13"
meta:
  - name: keywords
    content: Git,git,rebase,merge,revert,stash,cherry-pick,fetch,,tag
---

## Git 命令

### git init
初始化仓库

### 设置本地user信息
在本地`<user>/.ssh`文件夹下可以找到生成的`id_rsa.pub`文件。

```bash
# 可以设置也可以修改
git config --global user.name your-name
git config --global user.email your-email
# 推荐使用较新的 ed25519 算法（如果你的系统支持的话），命令如下：
ssh-keygen -t ed25519 -C "your_email@example.com"
# 如果系统不支持 ed25519，也可以使用 RSA 算法：
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

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
14. `git fetch origin refs/tags/*:refs/tags/* --prune`：删除不在远程仓库上的任何本地标签。
15. 为了自动获取标签，将以下行添加到您的`.git/config`文件中的条目下`[remote "origin"]`。`fetch = refs/tags/*:refs/tags/*`。

示例：

- 新增 tag `git tag -a v1.0.0 -m "my version v1.0.0"`

- 查看 tag `git show v1.0.0`

- 推送远端 `git push origin v1.0.0`

PS: tag 和在哪个分支创建是没有关系的，tag 只是提交的别名。因此 commit 的能力 tag 均可以使用，比如`git reset`，`git revert [pre-tag]`

### git stash

1. `git stash save "commit msg"`
2. `git stash apply SHA256/stash@{number}`
3. `git stash pop`
   - 默认最近一次 stash
4. `git stash list`
5. `git stash drop SHA256/stash@{number}`
6. 误操作 `git stash drop` 之后想恢复
   - `git fsck --lost-found` 可以得到 SHA256 列表
   - `git show SHA256` 可以查看详细信息
   - `git stash apply SHA256` 应用

### git bisect

使用 git bisect 二分法定位问题的基本步骤：

1. `git bisect start [最近的出错的 commitid] [较远的正确的 commitid]`
2. 测试相应的功能
3. `git bisect good` 标记正确
4. 直到出现问题则 标记错误 `git bisect bad`
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

### git show-ref

1. `git show-ref refs/heads/gh-pages`/`git show-ref gh-pages`: 检查本地是否存在某个分支

### git ls-remote

1. `git ls-remote origin refs/heads/gh-pages`/`git ls-remote origin gh-pages`: 检查远程仓库里是否有某个分支

### git checkout

1. 从远程拉一个本地不存在的新分支并切换到这个新分支上：

```bash
git fetch origin
git checkout -b new-feature origin/new-feature
```

### git branch

1. 列出本地分支：`git branch`
2. 设置本地分支跟踪远程仓库分支，后续直接`git pull`或`git push`即可：`git branch --set-upstream-to=origin/feature my-feature`
3. 还可以使用`git config`命令配置 Git，在默认情况下自动设置对新分支的跟踪。你可以设置`branch.autoSetupMerge`配置选项为`always`，使 Git 在创建新分支时创建跟踪分支。

### git status

- `git status --porcelain .`: 命令将以紧凑的"porcelain"格式显示 Git 存储库中的文件状态。

## 修改 git commit msg

1. 修改最近一次的 commit 信息 `git commit --amend`
2. `git reset --soft HEAD^` 重新提交
3. `git log --oneline -5` 查看最近 5 次 commit 的简要信息
4. 比如要修改的 commit 是倒数第三条，使用下述命令：

```bash
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

### .gitignore

为.gitignore 文件提供语法支持，远程下载.gitignore 模板

### Git Project Manager

### Git History Diff

提交记录对比

### 如何把一份本地代码同时上传 gitlab 和 gitee

git 本身是分布式版本控制系统，可以同步到另外一个远程库，当然也可以同步到另外两个远程库，所以一个本地库可以既关联 GitHub，又关联码云！

使用多个远程库时，要注意 git 给远程库起的默认名称是 origin，如果有多个远程库，我们需要用不同的名称来标识不同的远程库。仍然以 learngit 本地库为例，先删除已关联的名为 origin 的远程库：

```bash
git remote rm origin
```

然后，先关联 GitHub 的远程库：

```bash
git remote add github git@github.com:xxx/LearnGit.git
```

注意，远程库的名称叫 github，不叫 origin 了。
接着，再关联码云的远程库：

```bash
git remote add gitee git@gitee.com:xxx/LearnGit.git
```

同样注意，远程库的名称叫 gitee，不叫 origin。
现在，我们用 git remote -v 查看远程库信息，可以看到两个远程库：

```bash
gitee git@gitee.com:xxx/LearnGit.git (fetch)
gitee git@gitee.com:xxx/LearnGit.git (push)
github git@github.com:xxx/LearnGit.git (fetch)
github git@github.com:xxx/LearnGit.git (push)如果要推送到GitHub，使用命令：
git push github master
```

如果要推送到码云，使用命令：

```bash
git push gitee master
```

这样一来，本地库就可以同时与多个远程库互相同步

### 不切换 Git 分支，却能同时在多个分支上工作

正在开发某个 feature，老板突然跳出来说让你做生产上的 hotfix，面对这种情况，使用 Git 的我们通常有两种解决方案：

1. 草草提交未完成的 feature，然后切换分支到 hotfix
2. `git stash | git stash pop` 暂存工作内容，然后再切换到 hotfix
3. `git clone` 多个 repo

使用 `git-worktree`，仅需维护一个 repo，又可以同时在多个 branch 上工作，互不影响！！！

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

- `git worktree add -b "hotfix/JIRA234-fix-naming" ../hotfix/JIRA234-fix-naming`.

- `git worktree list`.

- `git worktree remove hotfix/hotfix/JIRA234-fix-naming`.

建议：通常使用 git worktree，我会统一目录结构，比如 feature 目录下存放所有 feature 的 worktree，hotfix 目录下存放所有 hotfix 的 worktree，这样整个磁盘目录结构不至于因为创建多个 worktree 而变得混乱。

### git 命令设置别名

1. git config --global alias.ps push - 把 push 设为 ps；
2. 手动编辑全局配置文件：
   - `open ~/.gitconfig` / `nano ~/.gitconfig`
   - 写入对应的别名对，例：`[alias] ck = checkout pl = pull`等并保存退出，
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

需要在一个 git 仓库里设置：`git config core.ignoreCase true/false`

### git 重命名文件/文件夹

1. 单个文件：`git mv dockerfile Dockerfile`
2. 多个文件：有很多个文件都是名字大小写变化，这种情况：
   1. 首先可以移除所有 git 缓存：`git rm -r --cached .`
   2. 这个命令将移除当前文件夹下所有文件/文件夹的 Git 缓存版本。运行这个命令后，会看到所有文件都显示在 git changes 中。
   3. 接下来，继续运行：`git add --all .`
   4. 就可以重新添加所有文件，仅显示有更改的文件。
3. 文件夹：借助一个临时的文件夹名字：`git mv myfolder tempFolder && git mv tempFolder myFolder`，或者用 2 中的方法。
4. 如果因为大小写问题已经导致远程仓库有俩重复文件，例：dockerfile Dockerfile
   1. 使用`git mv`命令重命名文件/文件夹:
      - `git mv old_file.txt new_file.txt`
      - `git mv old_folder new_folder`
   2. `git commit -m "Rename file/folder"`
5. 使用*git mv*的优点是:
   1. 保留文件/文件夹的历史记录和原有的提交信息。如果你手动删除后新增,那么新的文件就没有任何历史记录了。
   2. 使得*git diff*和*git blame*等命令仍然能跟踪到文件的历史变化。如果手动删除后新增,这些命令对新的文件就失效了。
   3. 从版本控制的角度更清晰地表示这是一个“重命名”操作,而不是删除后新增两个不相关的操作。

### git reflog

结合`.git/logs/HEAD`，勿删 commit 或分支之后找回。

### 强制禁用 Fast-Forward

`git merge --no-ff`会生成一个新的 commit。如果没有禁止 ff，那么有时候： 假如`learn-merge` 分支的历史记录包含 `master` 分支所有的历史记录，当我们要把`learn-merge`合并到`master`上时，这个合并是非常简单的。只需要通过把 `master` 分支的 HEAD 位置移动到 `learn-merge` 的最新 commit 上，Git 就会合并。fast-forward 模式下是不可能出现冲突的。**此时，即 Fast-Forward 时，没有产生新的 commit！！！**

### 压缩多次提交为一次 squash

**没有 squash 这个命令！**

1. 基础操作，逐次`git reset --soft HEAD^`，合并冲突，直至到合适的 commit。
2. 使用`git merge --squash branchName`压缩 Git 提交：当我们使用 `--squash` 选项执行 merge 时，Git 不会像在正常合并中那样在目标分支中创建合并提交。相反，Git 接受源分支中的所有更改，并将其作为本地更改放入目标分支的工作副本中，此时需要 add+commit 然后才可以 push。

```bash
# <!-- 不可以和 --no-ff同时使用 -->
git merge --squash <source_branch_name_to_squash>
```

3. 使用`git rebase -i HEAD~n`压缩 Git 提交：编辑器使用 pick 命令显示各种提交。它还显示有关可用命令的信息。我们将使用 squash（或 s）命令。其中`pick`开头的行表示要保留的主提交，其他的要压缩的提交开头改成`squash或s`。可以编辑提交的信息，然后保存退出即可，无需 add、commit。

### git 是如何存储信息的

查看`.git/objects` 目录：

1. 当使用 `git add` 命令把文件加入暂存区时，git 会根据这个对象的内容计算出 SHA-1 值
2. git 接着会用 SHA-1 值的前 2 个字符作为目录名称（避免让`.git/objects` 目录因为文件过多而降低读取效率），后 38 个字符作为文件名，创建目录及文件并放在`.git/objects` 目录下
3. 文件的内容则是 git 使用压缩算法把原本的内容压缩之后的结果（二进制 blob 文件）
4. git commit 存储的是：打包前存储的是全新文件，打包后使用了类似差异备份的方式进行存储
5. 当`.git/objects` 目录下对象过多时会自动触发资源回收，或者 git push 到远端服务器时，也可通过`git gc`手动触发

## 开启 ssr 之后无法从 GitHub 下载项目

打开 SSR 的「HTTP 代理设置」，查看端口，勾选「HTTP 代理设置」。然后在 zsh 执行如下命令：

```bash
git config --global http.proxy http://127.0.0.1:port
git config --global https.proxy http://127.0.0.1:port
```

## Git Large File Storage - LFS 大文件存储

1. [下载安装](https://git-lfs.github.com/)或`brew install git-lfs`
2. 然后在 git bash 里面安装一下：`git lfs install`
3. 接着 track 一下准备上传的文件，按文件格式进行：`git lfs track "*.psd"`
4. 进行了上述步骤之后你的文件夹会多出一个`.gitattributes`文件。接下来的先 add，commit，push 这个文件，之后再进行大文件的上传(正常操作即可)：
   1. `git add .gitattributes`
   2. `git add file.psd`
   3. `git commit -m "Add design file"`
   4. `git push origin master`
5. 请注意，定义 Git LFS 应该跟踪的文件类型本身不会将任何预先存在的文件转换为 Git LFS，例如其他分支上的文件或您之前的提交历史记录中的文件。为此，请使用 `git lfs migrate` 命令，该命令具有一系列选项，旨在适应各种潜在用例。

## git 拉代码出问题

1. 换掉 Git 的 http 版本: `git config --global http.version HTTP/1.1`
2. 更改 http buffer: `git config --global http.postBuffer 524288000`

## git submodule

当项目比较复杂，部分代码希望独立为子模块进行版本控制时，可以使用 git submodule 功能。另一个有用的场景是：当项目依赖并跟踪一个开源的第三方库时，将第三方库设置为 submodule。

使用 git submodule 功能时，主项目仓库并不会包含子模块的文件，只会保留一份子模块的配置信息及版本信息，作为主项目版本管理的一部分。或者说 git 不会主动/自动帮我们把子模块的代码下载到本地。

### git submodule 练习

假定我们有两个项目：project-main 和 project-sub-1，其中 project-main 表示主项目，而 project-sub-1 表示子模块项目。

接下来，我们希望在 project-main 中添加 project-sub-1 ，而又保持 project-sub-1 自身独立的版本控制。

一种选择是使用 git submodule。

1. 创建 submodule：`git submodule add <submodule_url>`可以在项目中创建一个子模块。

   - 此时项目仓库中会多出两个文件：.gitmodules 和 project-sub-1 。
   - 前者的内容是子模块的相关信息；而后者实际上保存的是子模块当前版本的版本号信息。
   - 比如需要修改子模块默认使用的分支，那么可以在.gitmodules 中修改 branch
   - 如果此前项目中已经存在 .gitmodules 文件，则会在文件内容中多出上述三行记录：`submodule、path、url`。
   - 通常此时可以在主项目中使用 `git commit -m "add submodule xxx"` 提交一次，表示引入了某个子模块。提交后，在主项目仓库中，会显示出子模块文件夹，并带上其所在仓库的「版本号」。
   - 上述步骤在创建子模块的过程中，会自动将相关代码克隆到对应路径，但对于后续使用者而言，对于主项目使用普通的 clone 操作并不会拉取到子模块中的实际代码。
   - 如果希望子模块代码也获取到，一种方式是在克隆主项目的时候带上参数 `--recurse-submodules`，这样会递归地将项目中所有子模块的代码拉取。

2. 获取 submodule：`git clone https://github.com/username/project-main.git --recurse-submodules`

   - 另外一种可行的方式是，在当前主项目中执行：`git submodule init`，`git submodule update`

3. 子模块内容的更新：对于子模块而言，并不需要知道引用自己的主项目的存在。对于自身来讲，子模块就是一个完整的 Git 仓库，按照正常的 Git 代码管理规范操作即可。

4. 对于主项目而言，子模块的内容发生变动时，通常有三种情况：

   - 1. 当前项目下子模块文件夹内的内容发生了未跟踪的内容变动；这时进入子模块文件夹，按照子模块内部的版本控制体系提交代码即可。
   - 2. 当前项目下子模块文件夹内的内容发生了版本变化；可以使用 `git add/commit` 将其添加到主项目的代码提交中，实际的改动就是那个子模块 文件 所表示的版本信息，通常当子项目更新后，主项目修改其所依赖的版本时，会产生类似这种情景的 commit 提交信息。
   - 3. 当前项目下子模块文件夹内的内容没变，但是子模块远程有更新；此时「当前主项目记录的子模块版本」还没有变化，在主项目看来当前情况一切正常。此时，需要让主项目主动进入子模块拉取新版代码，进行升级操作-`git pull origin master`。当主项目的子项目特别多时，可能会不太方便，此时可以使用 `git submodule` 的一个命令 foreach 执行：`git submodule foreach 'git pull origin master'`

5. 情况汇总:

   - 对于子模块，只需要管理好自己的版本，并推送到远程分支即可；
   - 对于父模块，若子模块版本信息未提交，需要更新子模块目录下的代码，并执行 commit 操作提交子模块版本信息；
   - 对于父模块，若子模块版本信息已提交，需要使用 `git submodule update` ，Git 会自动根据子模块版本信息更新所有子模块目录的相关代码。

6. 主项目可以使用 `git submodule update` 更新子模块的代码，但那是指 「当前主项目文件夹下的子模块目录内容」 与 「当前主项目记录的子模块版本」 不一致时，会参考后者进行更新。

7. 删除子模块

   - 先使用 `git submodule deinit` 命令卸载一个子模块。这个命令如果添加上参数 `--force`，则子模块工作区内即使有本地的修改，也会被移除。该命令的实际效果，是自动在 `.git/config` 中删除了以下内容：`submodule、url...`
   - 然后执行`git rm project-sub-1`移除 `project-sub-1` 文件夹，并自动在 `.gitmodules` 中删除了以下内容：`submodule、path、url`。
   - 此时，主项目中关于子模块的信息基本已经删除（虽然貌似 .git/modules 目录下还有残余）：执行`git commit -m ...`提交代码，完成对子模块的删除。
   - 网上流传了一些偏法，主要步骤是直接移除模块，并手动修改 `.gitmodules`、`.git/config` 和 `.git/modules` 内容。包含了一大堆类似`git rm --cached <sub-module>`、`rm -rf <sub-moduel>`、`rm .gitmodules` 和 `git rm --cached` 之类的代码。

8. submodule 管理起来不够灵活，可以使用 lerna 进行管理。

9. 除了 submodule，还有个方法还可以的，就是 `mklink`（windows 是 `mklink`，Linux 是 `ln -s /path/to/src/origin /path/to/dst/target`，删除`rm -rf target`，修改`ln -snf [源文件或目录] [目标文件或目录]`），就是等于把子模块复制一份到主模块中，两边所有的修改都会自动同步。 `mklink /d/j sub-module ..\sub-module\`

10. 第 2 步中的简写`git submodule update --init --recursive`

11. 更换 submodule 的 url 也就是把 submodule 的 git 切换到另一个仓库：

    - 1. 在子仓库中运行 `git remote set-url origin xx.git` 属于直接更换远程仓库
    - 2. 在主目录`.gitsubmodule` 文件中，直接修改 `url=xx.git`

12. 不 cd 进子模块，直接在主项目中拉取指定子模块更新的代码：

    - 1. `git submodule update --init --recursive` 递归
    - 2. 在`.gitsubmodule` 文件中把其他不需要更新的模块先注释掉然后使用命令：`git submodule update --recusive`

13. 把子模块添加到指定目录：在第一次拉取的时候使用这个命令`git add submodule -f xxxx.git [目标路径]`，一定要用-f，表示强制

## 报奇怪的错误

### known_hosts

```sh
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle attack)!
It is also possible that a host key has just been changed.
The fingerprint for the RSA key sent by the remote host is
SHA256:uNiVztksCsDhcc0u9e8BujQXVUpKZIDTMczCvj3tD2s.
Please contact your system administrator.
Add correct host key in /Users/eric/.ssh/known_hosts to get rid of this message.
Offending RSA key in /Users/eric/.ssh/known_hosts:1
RSA host key for github.com has changed and you have requested strict checking.
Host key verification failed.
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

解决办法：去`~/.ssh`下面把`known_hosts`文件给删了，然后重新 pull/push 代码即可。

### rebase 冲突解决

```sh
Git: warning: Pulling without specifying how to reconcile divergent branches is
# 不建议在没有为偏离分支指定合并策略时执行pull 操作
```

### 如何 Sync 那些 fork 过来的项目

当源项目有更新和自己的修改发生冲突时，通常无法直接 Sync 代码，（如果不想把自己的改动丢掉）此时需要手动操作：

1. `git checkout -b Yidadaa-main mainYours`: 先从你的最新的（要合并的）分支中 checkout 一个新分支
2. `git pull git@github.com:Yidadaa/ChatGPT-Next-Web.git mainYours`: 把源项目的最新改动分支拉到你的项目中，这些操作都是在你自己的项目中操作的，注意！
3. `git checkout mainYours`: 切换到你自己的最新（主）分支中
4. `git merge --no-ff Yidadaa-main`: 合并源仓库的最新（主）分支到你的主分支上
5. 解决代码冲突并 commit
6. `git push origin mainYours`: 把你的最新（主）分支推送到远程仓库。over。

设置为 rebase：`git config pull.rebase false`

## GitHub Actions

记录本 repo 的打包、同步码云以及推送到服务器的各个步骤，具体看注释。重点是使用的那几个别人发布的 action，以及设置 secrets。

```yml
# workflow name
name: test-ci

on:
  push:
    branches:
      - master

jobs:
  # 任务jobID
  build:
    # 运行环境
    runs-on: ubuntu-latest
    steps:
      # 使用别人的action:
      # checkout@v3:拉代码
      # setup-node@v3:设置特定nodejs版本
      - uses: actions/checkout@v3
        with:
          submodules: true # 子模块也一并pull下来
          fetch-depth: 0 # Fetch all history for .GitInfo and .Lastmod

      # 设置nodejs版本
      - uses: actions/setup-node@v3
        with:
          node-version: 16

      # 安装依赖
      - name: Install
        run: npm install

      # 更新browserslist
      - name: Update Browsers List
        run: npx browserslist@latest --update-db

      # 构建打包
      - name: Build
        run: npm run docs:build

      # 把一些其他文件也拷贝到dist文件夹下
      # 重点是搞清楚当前的目录结构，然后就好操作了
      # cp -r ../../../.github ./
      - name: Copy demos/ and the other files to dist/
        run: |
          cd ./docs/.vuepress/dist
          cp -r ../../../CNAME ./
          cp -r ../../../demos ./

      # 发布到gh-pages
      - name: Deploy to GitHub Pages
        uses: Cecilapp/GitHub-Pages-deploy@v3
        env:
          # 要自己在当前repo中设置，但是这个token需要先在user->settings里生成，同理，下面的各个secret都要提前设置好。具体可以谷歌
          GITHUB_TOKEN: ${{ secrets.ACCESS_TOKEN }}
        with:
          email: xxx@gmail.com
          build_dir: "docs/.vuepress/dist" # 打包生成产物的存放文件夹路径，optional
          branch: gh-pages # 要部署的分支，optional
          cname: domain.name # 生成CNAME文件，optional
          jekyll: no # 是否使用的jekyll，optional
          commit_message: "deploy gh-pages" # msg，optional

      # 把代码同步到Gitee
      - name: Sync to Gitee
        uses: Yikun/hub-mirror-action@master
        with:
          src: "github/EricYangXD"
          dst: "gitee/EricYangXD"
          dst_key: ${{ secrets.xxx }}
          dst_token: ${{ secrets.xxx }}
          mappings: "ericyangxd.github.io=>my-vuepress-blog"
          static_list: "ericyangxd.github.io"
          force_update: true
          debug: true

      # 发布到云服务器上
      # - name: Deploy to Oracle Cloud Server
      #   # 因为构建之后，需要把代码上传到服务器上，所以需要连接到ssh，并且做一个拷贝操作
      #   uses: cross-the-world/scp-pipeline@master
      #   env:
      #     WELCOME: "ssh scp ssh pipelines"
      #     LASTSSH: "Doing something after copying"
      #   with:
      #     host: ${{ secrets.xxx }}
      #     user: ${{ secrets.xxx }}
      #     pass: ${{ secrets.xxx }}
      #     port: ${{ secrets.xxx }}
      #     connect_timeout: 15s
      #     local: "./docs/.vuepress/dist/*"
      #     remote: "/home/xxx/xxx/"

      # 发布到云服务器上
      - name: Deploy to Your Cloud Server
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.xxx }} # 注意，换成你自己的secrets
          username: ${{ secrets.xxx }} # 注意，换成你自己的secrets
          password: ${{ secrets.xxx }} # 注意，换成你自己的secrets
          port: ${{ secrets.xxx }} # 注意，换成你自己的secrets
          source: "docs/.vuepress/dist/*" # # 注意，换成你自己的生成文件路径，需要配合下面的strip_components
          target: "/home/zzz/xxx/" # 注意，换成你自己的nginx或其他服务器配置的资源地址
          strip_components: 3 # 打包是以"docs/.vuepress/dist/*"整体打包的，解压的时候需要往上回退3层，才能解压到"/home/zzz/xxx"下面

      # 全流程结束
      - name: Done
        run: |
          echo "Complete Successfully!"
```
