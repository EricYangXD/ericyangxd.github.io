---
title: Windows使用事项
author: EricYangXD
date: "2022-05-21"
---

## 使用 PE 微盘制作启动 U 盘变成两个盘符后，恢复原始状态

[参考这里](https://blog.csdn.net/qq_33188180/article/details/108335615)

## 在 PDF 文件中增加签名

我说的是没有手写板或者你觉得用鼠标写的很难看的时候。

1. 拿张纸先写个好看的签名
2. 用相机拍下来，最好裁剪一下，传输并保存到电脑上，**保存成 jpg 格式**
3. 用`Adobe Acrobat Reader DC`打开要增加签名的文件
4. 在工具栏找到「钢笔」这个图标并点击，然后点击「自行签名」=>「添加签名」
5. 然后点击「图像」，选择刚才保存的 jpg 签名图片并点击「应用」
6. 然后就可以把签名移动到合适的位置，并调整大小即可，此时的签名背景是透明的，不会有纸张的颜色，完美！

## 安装 Java

[参考这里](https://www.runoob.com/w3cnote/windows10-java-setup.html)

## Chrome

1. `chrome://flags/#tab-hover-cards`两个都设置为 enable 即可。

## 远程桌面

1. windows 自带的，需要设置里开启一下，Mac 上也叫`Microsoft Remote Desktop`，外区 appstore 里可以下载安装
2. Parsec
3. ToDesk
4. Chrome Remote Desktop
5. TeamViewer
6. 向日葵

## 异地组网

1. 蒲公英
2. ZeroTier
3. Tailscale

### Tailscale 异地组网实战

1. 注册账号添加绑定设备就行了
2. Tailscale 会给每台设备分配一个 ip，通过这个 ip 就可以直接访问你的设备了

## 常用 cmd 命令

1. ipconfig
2. win+S，以管理员运行
3. win+R，以本地用户运行
4. `ping www.baidu.com -t`：查看网络波动
5. `ipconfig /flushdns`：刷新本机 dns
6. `nslookup www.baidu.com`：查看与某个网站的连接情况
7. `netsh winsock reset`：重置 winsock 目录至初始状态
8. `netsh advfirewall set allprofiles state [off/on]`：关闭/打开防火墙
9. `sfc /scannow`：验证系统文件的完整性
10. `DISM /Online /Cleanup-image /ScanHealth`：强力扫描电脑内的所有系统文件，检查是否与官方的系统文件是否一致
11. `DISM /Online /Cleanup-image /RestoreHealth`：修复上一步的错误
12. `powercfg /energy`：生成电源报告
13. `powercfg /batteryreport`：生成电池报告
14. `netsh wlan show wlanreport`：生成无线网卡报告
15. win+R，输入`netplwiz`，取消勾选登录时需要密码，即可取消开机密码
16. `netsh wlan show profile name="network_name" key=clear`：查看连接过的无线网的密码
17. `curl -L ip.tool.lu`：查看 ip
18. `chkdsk`：扫描硬盘扇区
19. `mstsc`：远程桌面
20. `perfmon.msc`：性能监控
21. `color all`：修改命令行字体颜色
22. `regedit`：进入注册表编辑
23. `net user`：系统全部用户
24. `net user 用户名 /del`：删除用户
25. `sfc /scannow`：系统扫描修复
26. `IExpress`：系统内置捆绑器？
27. `shutdown /s /t 3000`：设置 3000 秒后自动关机
28. `MSG /server:192.168.1.101 * "略略略！"`：命令行里给局域网其他电脑发消息
29. `.cmd`仿黑客帝国数字雨：

```sh
@echo off
:line
color 0a
setlocal ENABLEDELAYEDEXPANSION

for /l %%i in (0) do (
set "line="
for /l %%j in (1,1,80) do (
set /a Down%%j-=2
set "x=!Down%%j!"
if !x! LSS 0 (
set /a Arrow%%j=!random!%%3
set /a Down%%j=!random!%%15+10
)
set "x=!Arrow%%j!"
if "!x!" == "2" (
set "line=!line!!random:~-1! "
) else (set "line=!line! ")
)
set /p=!line!<nul
)
goto line
```
30. 在 PowerShell 里删除当前目录 node_modules：
```sh
Remove-Item -Recurse -Force .\node_modules
rm -r -fo .\node_modules
Remove-Item -Force .\package-lock.json
```
31. winget查找安装升级软件：`winget upgrade --id Microsoft.PowerShell -e --source winget`、`winget install --id Microsoft.Edge --exact --source winget`、`winget search python`
32. 查看端口占用：`netstat -ano | findstr :8888`
33. 查找端口对应的进程：`tasklist | findstr 12345`
34. 根据进程PID杀死进程：`taskkill /PID <PID> /F`
35. 删除多余的桌面：`win+ctrl+F4`
36. 

## 手机投屏

1. scrcpy: 也支持 Mac 和 Linux。`scrcpy --tcpip=192.168.150.18:5555` 小米手机需要打开无线调试之后再看端口号即可。同一局域网或固定 IP。或者使用 USB 数据线连接手机。[github](https://github.com/Genymobile/scrcpy)
2. alink
3. QtScrcpy

## 好用的软件

1. PowerToys：映射Mac键盘，一定要通过正常手段卸载，否则会无法卸载也无法更新，贼拉傻叉！
2. Snipaste：截图工具

## whistle

一个 HTTP/HTTPS/Socks 调试代理工具，功能类似 Charles/Fiddler，但更轻便且可脚本化。通过在Rules中配置规则，来抓到相应的http请求并替换成本地的请求路径，再结合ZeroOmega等浏览器插件创建相应的情景模式来代理在whistle中抓到的请求，实现本地直接通过线上接口的数据进行开发，不用单独mock。

```sh
# 安装whistle
npm install -g whistle

# 3种命令等效：whistle === w2 === wproxy

# 查看版本(确认安装成功)
w2 --version # w2 -V

# 启动whistle(指定端口)
w2 start -p 8888

# 重启
w2 restart

# 停止
w2 stop

# 设置代理
w2 proxy

# 设置指定 IP 或端口
w2 proxy "10.x.x.x:8888"

# 关闭代理
w2 proxy 0
```
- 配置 host 规则：`^https://ohmygod.test.com/cart-*/service/** http://localhost:8793/$2`
- 还需要安装 https 证书并启动 https 监听：参考：[whistle 使用实践（配置与基础篇）](https://juejin.cn/post/6930415221185970189#heading-10)。
- 配置浏览器代理，Chrome：使用 [SwitchOmega 插件](https://chromewebstore.google.com/detail/proxy-switchyomega-3-zero/pfnededegaaopdmhkdmcofjmoldfiped)。新建一个`情景模式`，选择`代理服务器`>`代理协议类型`>`HTTP`。配置`代理服务器`: `127.0.0.1`，`代理端口`与启动的代理服务器 whistle 端口(`8888`)一致。
