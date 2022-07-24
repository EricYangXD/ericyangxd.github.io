#!/usr/bin/python
# -*- coding: utf-8 -*-


invoice = open('./invoice.txt').read().split()
lists = open('./lists.txt').read().split()

# print(invoice.toString())
# print(lists.toString())

for i, num in enumerate(lists):
    if num in invoice:
        print(num)
        print('第', i+1, '个中奖号码是：', num, '!')
