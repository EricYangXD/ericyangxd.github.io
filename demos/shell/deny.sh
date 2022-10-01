#!/bin/bash
#Author:ZhangGe&Corek
#Desc:Auto Deny Black_IP Script.
#Date:2016-11-16
#从第一个参数取得限制阈值，如果未设置最高并发，将设置为30
if [[ -z $1 ]]; then
  num=30
else
  num=$1
fi

#进入到脚本所在目录
cd $(cd $(dirname $BASH_SOURCE) && pwd)

#取得当前请求大于阈值$num的IP列表
iplist=$(tcpdump -i eth1 -tnn dst port 80 -c 5000 | awk -F"." '{print $1"."$2"."$3"."$4}' | sort | uniq -c | sort -nr | awk -v str=$num '{if ($1>str){print $3}}')

#循环IP列表进行筛选和处理
if [[ ! -z $iplist ]]; then
  for black_ip in $iplist; do
    #取得IP所在段
    ip_section=$(echo $black_ip | awk -F"." '{print $1"."$2"."$3}')
    #先检查白名单中是否存在匹配的IP段（为了支持整段IP为白名单）
    grep -q $ip_section ./white_ip.txt
    if [[ $? -eq 0 ]]; then
      #若发现black_ip和白名单的一个段匹配，则写入到待验证列表，并暂时放过
      echo $black_ip >>./recheck_ip.txt
    else
      #若不再白名单当中，则直接将black_ip加入到防火墙的DROP规则当中，并记录

      #封单IP
      #iptables -nL | grep $black_ip || iptables -I INPUT -s $black_ip -j DROP
      #echo $black_ip >>./black_ip.txt
      #直接封IP段
      iptables -nL | grep $ip_section.0/24 || iptables -I INPUT -s $ip_section.0/24 -j DROP
      echo $ip_section.0/24 >>./black_ip.txt
    fi
  done
fi

# nohup ./deny.sh 20  # 执行该脚本用的命令
