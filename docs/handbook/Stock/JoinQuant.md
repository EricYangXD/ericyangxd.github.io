---
title: 聚宽量化策略学习笔记
author: EricYangXD
date: "2025-06-03"
meta:
  - name: keywords
    content: 聚宽,JoinQuant,量化策略,Python3,语法
---

## 语法笔记

### 常见指标及含义

#### 阿尔法（Alpha）

- 定义：阿尔法表示策略的超额收益，也就是在剔除市场整体涨跌影响后，策略本身能为你多赚（或少亏）了多少。
- 举例：比如市场指数今年涨了 10%，你的策略涨了 15%，那么阿尔法大约是 5%。
- 理解：阿尔法越高，说明策略“选股/择时”能力强，真正有价值。

#### 贝塔（Beta）

- 定义：贝塔衡量的是策略对市场波动的敏感度。也可以理解为“跟大盘一起动的程度”。
- 举例：贝塔=1，说明策略和市场同步涨跌；贝塔>1，涨跌比市场更剧烈；贝塔<1，则波动小于市场。
- 理解：如果你不想承担太多系统性风险，可以选择低贝塔策略。

#### 夏普比率（Sharpe Ratio）

- 定义：夏普比率=（年化收益率 - 无风险利率）/ 年化波动率
- 作用：它衡量的是单位风险带来的超额回报。数值越高，同样承担风险下收益越好。
- 举例：夏普比率为 2，意味着每承担 1 单位风险，你能获得 2 单位超额收益。
- 理解：夏普比率越高越好。一般>1 就不错，>2 很优秀。

#### 最大回撤（Max Drawdown）

- 定义：最大回撤是指历史过程中账户净值从最高点到最低点的最大跌幅比例。
- 举例：比如账户最高时 100 万，后来最低 80 万，那最大回撤就是(100-80)/100=20%。
- 理解：最大回撤反映了极端情况下你可能亏多少钱，是投资人最关心的风险指标之一。

#### 波动率（Volatility）

- 定义：波动率通常指年化标准差，用来衡量收益曲线的“抖动幅度”。
- 举例：如果一个策略年化波动率 20%，说明它一年内上下浮动范围较大。
- 理解：波动率越小代表收益更平稳，但也可能意味着收益空间有限。

#### 收益回撤比（Calmar Ratio 等）

- 定义：“收益回撤比”一般指年化收益率与最大回撤之比，比如 Calmar Ratio = 年化收益 / 最大回撤
- 意义：这个指标综合考虑了赚钱能力和极端亏损能力。数值越大说明赚钱多、亏得少，策略更优秀。
- 举例：
  - 策略 A 年化 20%，最大回撤 10%，收益回撤比=2
  - 策略 B 年化 30%，最大回撤 30%，收益回撤比=1
  - 虽然 B 赚钱多，但抗风险能力弱，所以 A 更优

#### 滑点

滑点（Slippage）指的是你下单时预期成交价格与实际成交价格之间的差异。在真实交易中，由于市场波动、买卖盘深度、撮合延迟等原因，你的订单通常无法严格按照你设定的价格成交，常常会有一点点“偏差”。这个偏差就是滑点。它可以是正的（买入比预期贵、卖出比预期便宜），也可以是负的。

#### 总结表格

| 指标       | 含义               | 越高越好？ | 主要关注点          |
| ---------- | ------------------ | ---------- | ------------------- |
| 阿尔法     | 超额收益           | 是         | 策略自身盈利能力    |
| 贝塔       | 跟随大盘敏感度     | 看需求     | 系统性风险暴露      |
| 夏普比率   | 单位风险超额收益   | 是         | 风险调整后表现      |
| 最大回撤   | 历史最大亏损比例   | 否         | 抗极端风险能力      |
| 波动率     | 收益曲线抖动幅度   | 否         | 稳健性              |
| 收益回撤比 | 收益与最大亏损之比 | 是         | 综合赚钱+抗风险能力 |

### 常用内置库

1. jqdata：数据获取（股票、基金、期货等）
2. jqfactor：因子库，获取各种财务/技术因子
3. numpy、pandas：数据处理
4. math：数学计算
5. datetime：时间处理

### 常用函数与 API 说明

- 函数 - 用途
- get_price: 获取历史行情数据（日线/分钟线）
- get_current_data: 获取当前市场状态/最新价
- get_fundamentals: 获取财务数据（市值、市盈率等）
- get_all_securities: 获取所有可交易证券列表
- get_index_stocks: 获取某指数成分股列表
- order(security, amount): 买卖指定数量的证券
- order_value(security, value): 买卖指定金额的证券
- order_target(security, amount): 调整持仓到指定股数
- order_target_value(security, value): 调整持仓到指定市值
- run_daily(func, time): 每天指定时间运行 func
- run_weekly(func, weekday, time): 每周指定日和时间运行 func
- 全局变量建议挂在 g 对象下，如 g.stock_list
- 日志打印用 log.info/log.debug 等，也可以直接 print
-

### 代码结构示例

```python
from jqdata import *
import numpy as np
import pandas as pd

# 初始化函数，只执行一次
def initialize(context):
    # 设置基准指数，比如沪深300
    set_benchmark('000300.XSHG')
    # 开启真实价格模式
    set_option('use_real_price', True)
    # 每天开盘前运行 before_market_open 函数
    run_daily(before_market_open, time='before_open')
    # 每天收盘后运行 after_market_close 函数
    run_daily(after_market_close, time='after_close')
    # 每周一开盘后调仓（如有需要）
    run_weekly(week_rebalance, weekday=1, time='open')

# 开盘前的准备工作（如选股）
def before_market_open(context):
    g.stock_list = get_index_stocks('000300.XSHG')[:10]  # 示例：取沪深300前10只股票

# 收盘后的操作（如统计打印）
def after_market_close(context):
    print("今日交易结束，持仓如下：")
    for position in context.portfolio.positions.values():
        print(position.security, position.total_amount)

# 调仓函数，每周一执行一次
def week_rebalance(context):
    # 卖出不在股票池的股票
    for stock in list(context.portfolio.positions.keys()):
        if stock not in g.stock_list:
            order_target(stock, 0)

    # 等权买入新股票池中的股票
    cash_per_stock = context.portfolio.cash / len(g.stock_list)
    for stock in g.stock_list:
        order_value(stock, cash_per_stock)


```

### 一些参考函数

#### 市值选股

市值大于 500 亿元, 市盈率小于 10, 营业总收入大于 200 亿元的股票

```python
def stock_name(x):
    q = get_fundamentals(query(
        valuation.code, valuation.market_cap, valuation.pe_ratio, income.total_operating_revenue
    ).filter(
        valuation.market_cap > 500,
        valuation.pe_ratio < 10,
        income.total_operating_revenue > 2e10
    ), date='2024-12-31')
    return q
```

#### 自定义购买

设置初始化函数：initialize，例子中只操作一支股票：'000001.XSHE'，平安银行。实现一个函数，来根据历史数据调整仓位。

```python
def initialize(context):
    # 定义一个全局变量, 保存要操作的股票
    g.security = '000001.XSHE'
    # 运行函数
    run_daily(market_open, time='every_bar')

def market_open(context):
    if g.security not in context.portfolio.positions:
        order(g.security, 1000)
    else:
        order(g.security, -800)
```

#### 5 日内涨停次数

n 日内涨停次数快速计算方法，以 5 日内两次涨停为例。

```python
def limit_up_count(initial_list, date):
    df = get_price(initial_list, end_date=date, frequency='daily', fields=['close', 'high','high_limit'], count=5, panel=False, fill_paused=False, skip_paused=False)
    df['is_limit_up'] = (df['close']==df['high_limit'])
    df = df.groupby['code'].agg('sum')
    df = df[df['is_limit_up']>=2]
    return list(df.code)
```

#### 获取股票名称

```python
def get_security_name(code):
    """获取股票的中文名称"""
    return get_security_info(code).display_name
```

#### 白马股选股策略

筛选条件：

- 总市值 > 300 亿：筛选市值较大的公司，流动性好，抗风险能力强。
- 上市天数 > 750：排除上市不足 3 年的次新股，降低短期波动风险。
- 流通盘比例 > 95%：接近全流通状态，避免未来限售股解禁的抛压。
- 销售毛利率 > 20%：确保公司产品或服务具备较强盈利能力和竞争力。
- 扣非净资产收益率（ROE）> 20%：反映公司资本利用效率高，长期投资价值显著。
- 排名条件：总市值从大到小排列：优先选择规模更大的龙头企业，通常稳定性更高。

```python
def initialize(context):
    # 设定沪深300作为基准
    set_benchmark('000300.XSHG')

    # 开启动态复权模式(真实价格)
    set_option('use_real_price', True)

    # 设定成交量比例
    set_option('order_volume_ratio', 1)

    # 股票类每笔交易时的手续费是：买入时佣金万分之三，卖出时佣金万分之三加千分之一印花税, 每笔交易佣金最低扣5块钱
    set_order_cost(OrderCost(open_tax=0, close_tax=0.001, open_commission=0.0003,
    close_commission=0.0003, close_today_commission=0, min_commission=5), type='stock')

    #设定持仓数量
    g.stocknum = 20

    #交易日计时器
    g.days = 20

    #调仓频率
    g.refresh_rate = 100

    #执行频率
    run_daily(trade, time='every_bar')

## 选出白马股票
def check_stocks(context):
    q = query(
        valuation.code,
        valuation.capitalization,
        indicator.roe,
        indicator.gross_profit_margin,
    ).filter(
        valuation.capitalization > 300,  # 总市值>300亿
        valuation.circulating_market_cap > valuation.market_cap * 0.95,  # 流通盘比例>95%
        indicator.gross_profit_margin > 20,    # 销售毛利率>20%
        indicator.roe > 20,                    # ROE>20%
    ).order_by(
	    valuation.market_cap.desc()
	).limit(100)

    df = get_fundamentals(q, statDate=str(context.current_dt)[:4])

    # 过滤股票
    buylist = list(df['code'])

    buylist = delect_stock(buylist, context.current_dt, 750)
    return buylist[:g.stocknum]

def delect_stock(stocks, beginDate, n = 180):
    stockList = []
    for stock in stocks:
        start_date = get_security_info(stock).start_date

        if start_date < (beginDate - timedelta(days = n)).date():
            stockList.append(stock)
    return stockList

## 交易函数
def trade(context):
    if g.days%g.refresh_rate == 0:

        ## 获取持仓列表
        sell_list = list(context.portfolio.positions.keys())

        # 如果有持仓，则卖出
        if len(sell_list) > 0 :
            for stock in sell_list:
                order_target_value(stock, 0)

        ## 分配资金
        if len(context.portfolio.positions) < g.stocknum :
            Num = g.stocknum - len(context.portfolio.positions)
            Cash = context.portfolio.cash/Num
        else:
            Cash = 0

        #白马股选股
        stock_list = check_stocks(context)

        ## 买入股票
        for stock in stock_list:
            if len(context.portfolio.positions.keys()) < g.stocknum:
                order_value(stock, Cash)

        # 天计数加一
        g.days = 1
    else:
        g.days += 1
```

#### 筛选成交额

筛选过去 5 日成交额大于 3000 万的股票

```python
def filter_stock(stock_list):
    g.min_turnover=3000
    selected_stocks = []
    for stock in stock_list['code']:
        if turnover_data.get(stock, 0) >= g.min_turnover:
            selected_stocks.append(stock)
    return selected_stocks
```

#### 对列表进行排序

```python
def sort_list(input_list, ascending=True, key=None):
    """
    对列表进行排序的函数

    参数:
        input_list (list): 需要排序的列表
        ascending (bool): 升序(True)或降序(False)，默认为升序
        key (function): 排序的关键字函数，类似于内置sorted函数的key参数

    返回:
    list: 排序后的新列表
    """
    # 复制原列表，避免修改原始数据
    sorted_list = input_list.copy()

    # 使用内置sorted函数进行排序
    sorted_list = sorted(sorted_list, key=key, reverse=not ascending)

    return sorted_list

# 示例用法
if __name__ == "__main__":
    # 示例1：对整数列表排序
    numbers = [5, 2, 8, 1, 9]
    sorted_numbers = sort_list(numbers)
    print("升序排序:", sorted_numbers)  # 输出: [1, 2, 5, 8, 9]

    # 示例2：对字符串列表按长度排序
    words = ["apple", "banana", "cherry", "date"]
    sorted_words = sort_list(words, key=len)
    print("按长度排序:", sorted_words)  # 输出: ['date', 'apple', 'cherry', 'banana']

    # 示例3：对字典列表按特定字段排序
    students = [
        {"name": "Alice", "score": 85},
        {"name": "Bob", "score": 92},
        {"name": "Charlie", "score": 78}
    ]
    sorted_students = sort_list(students, key=lambda x: x["score"], ascending=False)
    print("按分数降序排序:", sorted_students)
    # 输出: [{'name': 'Bob', 'score': 92}, {'name': 'Alice', 'score': 85}, {'name': 'Charlie', 'score': 78}]
```

#### 基本面选股

选择满足市值、市盈率、roe 条件的股票。

```python
def select_stocks(context):
    # 基本面选股
    query_fields = query(
        valuation.code,               # 股票代码
        valuation.circulating_market_cap,  # 流通市值
        valuation.pe_ratio,           # 市盈率
        indicator.roe                 # 净资产收益率
    )

    # 设置筛选条件
    filtered = query_fields.filter(
        valuation.circulating_market_cap >= context.min_market_cap,
        valuation.circulating_market_cap <= context.max_market_cap,
        valuation.pe_ratio > context.min_pe,
        valuation.pe_ratio < context.max_pe,
        indicator.roe > context.min_roe
    )

    # 获取满足条件的股票
    df = get_fundamentals(filtered, date=context.current_dt)

    if df is None or len(df) == 0:
        return []

    # 按流通市值排序
    df = df.sort_values('circulating_market_cap')

    # 流动性过滤 (20日平均成交额>1亿)
    valid_stocks = []
    for stock in df['code']:
        money_data = attribute_history(
            stock, count=20, fields=['money'], skip_paused=True)['money']
        avg_turnover = money_data.mean()
        if avg_turnover > 1e8:
            valid_stocks.append(stock)

    # 返回前100只股票(控制计算量)
    return valid_stocks[:100]
```

####

```python

```

####

```python

```

####

```python

```

####

```python

```

####

```python

```

####

```python

```

####

```python

```

####

```python

```
