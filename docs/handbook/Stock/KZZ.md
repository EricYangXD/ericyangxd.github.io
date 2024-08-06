---
title: 可转债笔记
author: EricYangXD
date: "2024-05-21"
meta:
  - name: keywords
    content: 可转债,四因子,可转债策略
---

## 记录可转债学习笔记

### 四因子策略

1. 把可转债数据全表导出后，价格筛选 120 以下的可转债(确保安全边际)，转债余额筛选 5 亿以下的(确保弹性)，税前收益率选择大于 2%的(确保债性)。再去除 ST 债，年报非标股票的债，A 评级以下的债，避免暴雷风险。
2. 接下来利用价格，溢价率，余额，到期收益率四因子就可以来排名选债了。
   1. 双低就是用价格+溢价率\*100，也是个经典指标，用它先对可转债进行排名，得到双低排名。
   2. 将余额从小到大排序，得到余额排名。
   3. 将收益率从大到小排序，得到收益率排名。
   4. 那么怎么综合来看呢？最简单的办法不就是把三个排名加起来，最后就得到一个总排名，然后从小到大排序即可。