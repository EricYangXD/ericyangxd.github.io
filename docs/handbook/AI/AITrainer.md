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

### 业务分析

#### 实操题套路

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
17. 
