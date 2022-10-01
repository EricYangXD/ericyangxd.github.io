#!/bin/bash

#自动拒绝恶意 IP 脚本
#auto drop ssh failed IP address
#定义变量
SSH_PORT=22
SEC_FILE=/var/log/secure
#如下为截取 secure 文件恶意 ip 远程登录，大于等于 4 次就写入防火墙，禁止以后再尝试登录服务器,第一次可以判断secure全文，后续可只匹配末尾1000行
IP_ADDR=$(cat $SEC_FILE | grep "Failed password" | egrep -o "([0-9]{1,3}\.){3}[0-9]{1,3}" | sort -nr | uniq -c | awk ' $1>=4 {print $2}')
#IP_ADDR=`tail -n 1000 $SEC_FILE |grep "Failed password"| egrep -o "([0-9]{1,3}\.){3}[0-9]{1,3}" | sort -nr | uniq -c |awk ' $1>=4 {print $2}'`
FIREWALL_CONF=/etc/firewalld/zones/public.xml
##检查防火墙
systemctl status firewalld >/dev/null 2>&1
if [ $? -eq 0 ]; then
    firewall-cmd --reload >/dev/null 2>&1
    echo "firewalld is running" >>/root/firewallstatus.txt 2>&1
else
    echo "Firewalld looks like not running, trying to start..." >>/root/firewallstatus.txt 2>&1
    systemctl start firewalld >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "Firewalld start successfully..." >>/root/firewallstatus.txt 2>&1
    else
        echo "Failed to start firewalld" >>/root/firewallstatus.txt 2>&1
    fi
fi
##把匹配到的ip加入firewalld防火墙
for i in $(echo $IP_ADDR); do
    ##查看 firewalld 配置文件是否含有提取的 IP 信息
    cat $FIREWALL_CONF | grep $i >/dev/null 2>&1
    if [ $? -ne 0 ]; then
        ##判断 firewalld 配置文件里面是否存在已拒绝的 ip，如何不存在就不再添加相应条目
        firewall-cmd --permanent --add-rich-rule="rule family='ipv4' source address="$i/32" port port="$SSH_PORT" protocol=tcp drop" >/dev/null 2>&1
        echo $(date +"%Y-%m-%d %H:%M:%S $i 此ip增加到防火墙拉黑") >>/root/drop_ip.txt
    fi
done
#最后重启 firewalld 生效
firewall-cmd --reload >/dev/null 2>&1
