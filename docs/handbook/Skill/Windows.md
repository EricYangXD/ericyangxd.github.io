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
2. 用县级拍下来，最好裁剪一下，传输并保存到电脑上，**保存成 jpg 格式**
3. 用`Adobe Acrobat Reader DC`打开要增加签名的文件
4. 在工具栏找到「钢笔」这个图标并点击，然后点击「自行签名」=>「添加签名」
5. 然后点击「图像」，选择刚才保存的 jpg 签名图片并点击「应用」
6. 然后就可以把签名移动到合适的位置，并调整大小即可，此时的签名背景是透明的，不会有纸张的颜色，完美！


## 安装Java

[参考这里](https://www.runoob.com/w3cnote/windows10-java-setup.html)

## Chrome

1. `chrome://flags/#tab-hover-cards`两个都设置为enable即可。


## 远程桌面

1. windows自带的，需要设置里开启一下，Mac上也叫`Microsoft Remote Desktop`，外区appstore里可以下载安装
2. Parsec
3. ToDesk
4. Chrome Remote Desktop
5. TeamViewer
6. 向日葵


## 异地组网

1. 蒲公英
2. ZeroTier
3. Tailscale

### Tailscale异地组网实战

1. 



## 常用cmd命令

1. ipconfig
2. win+S，以管理员运行
3. win+R，以本地用户运行
4. `ping www.baidu.com -t`：查看网络波动
5. `ipconfig /flushdns`：刷新本机dns
6. `nslookup www.baidu.com`：查看与某个网站的连接情况
7. `netsh winsock reset`：重置winsock目录至初始状态
8. `netsh advfirewall set allprofiles state [off/on]`：关闭/打开防火墙
9. `sfc /scannow`：验证系统文件的完整性
10. `DISM /Online /Cleanup-image /ScanHealth`：强力扫描电脑内的所有系统文件，检查是否与官方的系统文件是否一致
11. `DISM /Online /Cleanup-image /RestoreHealth`：修复上一步的错误
12. `powercfg /energy`：生成电源报告
13. `powercfg /batteryreport`：生成电池报告
14. `netsh wlan show wlanreport`：生成无线网卡报告
15. win+R，输入`netplwiz`，取消勾选登录时需要密码，即可取消开机密码
16. `netsh wlan show profile name="network_name" key=clear`：查看连接过的无线网的密码
17. `curl -L ip.tool.lu`：查看ip
18. `chkdsk`：扫描硬盘扇区
19. `mstsc`：远程桌面
20. `perfmon.msc`：性能监控
21. `color all`：修改命令行字体颜色
22. `regedit`：进入注册表编辑
23. `net user`：系统全部用户
24. `net user 用户名 /del`：删除用户
25. `sfc /scannow`：系统扫描修复
26. `IExpress`：系统内置捆绑器？
27. `shutdown /s /t 3000`：设置3000秒后自动关机
28. `MSG /server:192.168.1.101 * "略略略！"`：命令行里给局域网其他电脑发消息
29. `.cmd`防黑客帝国数字雨：
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

## 手机投屏

1. scrcpy: 也支持Mac和Linux。`scrcpy --tcpip=192.168.150.18:5555` 小米手机需要打开无线调试之后再看端口号即可。同一局域网或固定IP。或者使用USB数据线连接手机。[github](https://github.com/Genymobile/scrcpy)
2. alink


