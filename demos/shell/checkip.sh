#!/bin/bash

#过滤/var/log/secure日志，因为有密码输入错误和用户名输入错误，awk取IP值要利用NF-3取值
awk '/Failed password/{count[$(NF-3)]++}END{for(i in count){if(count[i]>10) print i}}' /var/log/secure >/tmp/ssh_faild.log
while read ip; do
  #如果IP为空或者已经在/etc/hosts.deny中，就跳过此次循环
  if grep -q "$ip" /etc/hosts.deny; then
    continue
  else
    echo "sshd:$ip" >>/etc/hosts.deny
  fi
done </tmp/ssh_faild.log
