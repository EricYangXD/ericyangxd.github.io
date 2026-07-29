---
title: 2026上海人工智能训练师（三级/高级）
author: EricYangXD
date: "2026-07-28"
meta:
  - name: keywords
    content: Pandas,Numpy,人工智能训练师
---

## 人工智能训练师（三级/高级）上海2026.7

### 前期准备

### 考试内容

### 1.业务分析-2抽1

#### 1.1业务流程设计-实操题套路

0. 引入外部库：pandas、numpy、matplotlib等
1. 加载数据：`pd.read_csv()`/`pd.read_excel()`
2. 展示数据：`data.head(n)`
3. 删除缺失数据：`data.dropna()`
4. 补全空数据：`data['age'].fillna(method='ffill', inplace=True)`/`data['age'].fillna(method='bfill', inplace=True)`，ffill-前向补全，用前一行的值填充后一行的空值，bfill-后向补全，用后一行的值填充前一行的空值。前后向一般会一起使用，确保第一行和最后一行都能被填充上值。
5. 根据条件创建新列：`data['RiskLevel'] = np.where(data['DaysInHospital'] > 7, '高风险患者', '低风险患者')`，np.where(条件判断,True-展示,False-展示)
6. 统计同一列中不同分类的各自的数量：`risk_counts = data['RiskLevel'].value_counts()`，比如此处会得到高风险和低风险的各自的数量表格。统计各取值所占比例：`data['RiskLevel'].value_counts(normalize=True)`。`df["列名"].value_counts()`
7. 统计某一种类的数值（或者布尔值True的个数）的总和：`scores.sum()`，默认 axis=0，表示每一列分别求和，axis=1 表示每一行求和，例如计算每个学生两门课的总分。布尔条件配合 sum() 统计数量：`age = pd.Series([18, 20, 16, 25, 17]); print((age >= 18).sum())`。`(df["列名"] == 某个值).sum()`，`df["列名"].sum()`
8. 获取数据列长度：`len(data)`
9. 数据类型转换：`data['ReviewScore'] = data['ReviewScore'].astype(int)`
10. python数组取反：`data[~data['Age'].between(18,70)]`即取<18或>70的数据，波浪线：`~`
11. 划分数据区间：`data['BMIRange'] = pd.cut(data['BMI'] , bins=bmi_bins, labels=bmi_labels, right=False)  # 使用左闭右开区间`，**pd.cut**
12. 根据BMIRange分组，然后统计每组的`RiskLevel== '高风险患者'`的平均值mean：`bmi_risk_rate = data.groupby('BMIRange')['RiskLevel'].apply(lambda x: (x == '高风险患者').mean())`
13. 分组聚合统计：`gender_stats = data.groupby('Gender').agg({'Speed':'mean', 'TravelDistance':'mean', 'TravelTime':'mean'})`
14. 计算平均值：`data['Income'].mean()`，标准差：`data['Income'].std()`
15. 数据标准化：`data['ReviewScore'] = (data['ReviewScore'] - data['ReviewScore'].mean()) / data['ReviewScore'].std()`
16. 统计并排序：`age_group_counts = data['AgeGroup'].value_counts().sort_index()`
17. 合并处理后得数据：`X = data[selected_features]; y = data['低碳行为积极性']; cleaned_data = pd.concat([X, y], axis=1)`
18. 保存数据：`cleaned_data.to_csv('2.1.2_cleaned_data.csv', index=False) #保存中不用额外创建索引`

### 1.2业务模块效果优化

根据题目内容，在答题卡上写流程和优化建议啥的，基本围绕题目来

### 2.智能训练-2题必考

#### 2.1数据处理规范制定-实操题套路

有代码和题目，根据每一小问进行代码补全或回答问题等操作。

1. 常规套路：导入外部库、加载数据集、查看数据集信息`data.head()`/`data.info() #查看表的综合结构信息`/`data.dtypes #查看每列的数据类型`/`data["Value"].dtype #查看某列的数据类型`、清除缺失值`data.dropna()`、统计数据量`data.isnull().sum()`、数据类型转换`pd.to_numeric(data['horsepower'], errors='coerce')`、清除异常值NaN`data.dropna(subset=['horsepower'])`



### 3.智能系统设计-2题必考

#### 3.1智能系统监控与优化

根据题目，处理操作Excel数据，通过数据透视表统计分析数据回答问题，再回答几个流程优化等问题

#### 3.2人机交互流程设计

### 4.培训与指导-2抽1

#### 4.1培训

#### 4.2指导
















