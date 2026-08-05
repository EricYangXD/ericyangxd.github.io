---
title: 2026上海人工智能训练师（三级/高级）
author: EricYangXD
date: "2026-07-28"
meta:
  - name: keywords
    content: Pandas,Numpy,Matploylib,人工智能训练师
---

## 人工智能训练师（三级/高级）上海2026.7

### 前期准备

### 考试内容

### 1.业务分析-2抽1-25分

#### 1.1业务流程设计-实操题套路

0. 引入外部库：pandas、numpy、matplotlib等
   - Pandas 是一个开源的数据分析和数据处理库，它是基于 Python 编程语言的。主要引入了两种新的数据结构：Series类似于一维数组或列表，是由一组数据以及与之相关的数据标签（索引）构成。Series 可以看作是 DataFrame 中的一列，也可以是单独存在的一维数据结构。 和 DataFrame类似于一个二维表格，它是 Pandas 中最重要的数据结构。DataFrame 可以看作是由多个 Series 按列排列构成的表格，它既有行索引也有列索引，因此可以方便地进行行列选择、过滤、合并等操作。
1. 加载数据：`pd.read_csv(filepath, encoding='utf-8')`/`pd.read_excel()` ==> `DataFrame`
2. 展示数据：`data.head(n)`/`data.info()`/`data.dtypes`/`data.describe()`/`data.columns #辅助复制列名`
3. 删除缺失数据：`data.dropna()`/`data.dropna(subset=['xxx'])`--清空指定列的空值
4. 统计/删除重复数据：`data.duplicated().sum()`/`data.drop_duplicates()`/`data.drop(columns=['xx']) #删除某列`
5. 补全空数据：`data['age'].fillna(method='ffill', inplace=True)`/`data['age'].fillna(method='bfill', inplace=True)`，ffill-前向补全，用前一行的值填充后一行的空值，bfill-后向补全，用后一行的值填充前一行的空值。前后向一般会一起使用，确保第一行和最后一行都能被填充上值。`inplace=True`直接替换覆盖
6. 根据条件创建新列：`data['RiskLevel'] = np.where(data['DaysInHospital'] > 7, '高风险患者', '低风险患者')`，np.where(条件判断,True-展示,False-展示)，类似三元运算符
7. 统计同一列中不同分类的各自的数量：`risk_counts = data['RiskLevel'].value_counts()`，比如此处会得到高风险和低风险的各自的数量表格。统计各取值所占比例：`data['RiskLevel'].value_counts(normalize=True)`。`df["列名"].value_counts()`
8. 统计某一种类的数值（或者布尔值True的个数）的总和：`scores.sum()`，默认 axis=0，表示每一列分别求和，axis=1 表示每一行求和，例如计算每个学生两门课的总分。布尔条件配合 sum() 统计数量：`age = pd.Series([18, 20, 16, 25, 17]); print((age >= 18).sum())`。`(df["列名"] == 某个值).sum()`，`df["列名"].sum()`
9. 获取数据列长度：`len(data)`/`data.shape[0]`，shape是属性，返回`(row, column)`
10. 数据类型转换：`data['ReviewScore'] = data['ReviewScore'].astype(int)`/`pd.to_numeric(data['horsepower'], errors='coerce')`
11. python数组取反：`data[~data['Age'].between(18,70)]`即取<18或>70的数据，波浪线：`~`
12. 划分数据区间：`data['BMIRange'] = pd.cut(data['BMI'] , bins=bmi_bins, labels=bmi_labels, right=False)  # 使用左闭右开区间`，**pd.cut**
13. 根据BMIRange分组，然后统计每组的`RiskLevel== '高风险患者'`的平均值mean：`bmi_risk_rate = data.groupby('BMIRange')['RiskLevel'].apply(lambda x: (x == '高风险患者').mean())`
14. 分组聚合统计：`gender_stats = data.groupby('Gender').agg({'Speed':'mean', 'TravelDistance':'mean', 'TravelTime':'mean'})`
15. 计算平均值：`data['Income'].mean()`，标准差：`data['Income'].std()`
16. 数据标准化：`data['ReviewScore'] = (data['ReviewScore'] - data['ReviewScore'].mean()) / data['ReviewScore'].std()`
17. 统计并排序：`age_group_counts = data['AgeGroup'].value_counts().sort_index()`
18. 合并处理后得数据：`X = data[selected_features]; y = data['低碳行为积极性']; cleaned_data = pd.concat([X, y], axis=1)`
19. 保存数据：`cleaned_data.to_csv('2.1.2_cleaned_data.csv', index=False) #保存中不用额外创建索引`

### 1.2业务模块效果优化

根据题目内容，在答题卡上写流程和优化建议啥的，基本围绕题目来

### 2.智能训练-2题必考-15分+20分

#### 2.1数据处理规范制定-实操题套路

有代码和题目，根据每一小问进行代码补全或回答问题等操作。

1. 常规套路：导入外部库、加载数据集、查看数据集信息`data.head()`/`data.info() #查看表的综合结构信息`/`data.dtypes #查看每列的数据类型`/`data["Value"].dtype #查看某列的数据类型`、清除缺失值`data.dropna()`、统计数据量`data.isnull().sum()`、数据类型转换`pd.to_numeric(data['horsepower'], errors='coerce')`、清除异常值NaN`data.dropna(subset=['horsepower'])`、`data[data['SensorType'].isin(['Temperature', 'Humidity'])].groupby(['Location', 'SensorType'])['Value'].mean().unstack() #先筛选再分组最后求每组的平均值`、清除重复值`data.drop_duplicates()`
2. 处理数据：标准化数据：`data[numerical_features] = scaler.fit_transform(data[numerical_features])`，选择数值列用于箱线图：`numeric_cols = data.select_dtypes(include=['float64', 'int64']).columns`，使用IQR处理异常值：`Q1 = data[numeric_cols].quantile(0.25) #四分位数`，
3. 选择特征、自变量和目标变量：根据题目要求设置特征X、目标变量y
4. 划分数据集为训练集和测试集：`X_train, X_test, y_train, y_test = train_test_split(X, y, train_size=0.2, random_state=42)`，只传 X 不传 y： 完全正常。返回 (X_train, X_test) 两个数组，按指定比例随机划分特征数据。只是不能用 stratify 参数（因为需要 y 来做分层采样）。
5. 训练（此处不涉及）
6. 保存数据：cleaned_data.to_csv('2.1.1_cleaned_data.csv', index=False)，`index=False`不保存生成的序号

回答问题时根据上面代码中的步骤来回答即可，区分数据清洗和数据标注部分。`StandardScaler()`：标准化，将数据转换为均值为0，标准差为1的分布。`MinMaxScaler()`：归一化，将数据缩放到指定的范围（如 `[0，1]`）。`LabelEncoder()`：标签编码，将类别变量转换为整数形式。

#### 2.2算法测试

主要使用：

1. 导入库（不考）
2. 加载数据
3. 展示数据
4. 处理数据
5. 设置自变量X和因变量y
6. 分割训练集和测试集
7. 训练模型
8. 保存模型
9. 预测并保存结果
10. 生成测试报告
11. 分析测试结果
12. 处理数据不平衡
13. 重新训练模型
14. 重新预测并保存结果
15. 重新生成测试报告
16. 重新分析测试结果

### 3.智能系统设计-2题必考-15分+20分

#### 3.1智能系统监控与优化

根据题目，处理操作Excel数据，通过数据透视表统计分析数据回答问题，再回答几个流程优化等问题

#### 3.2人机交互流程设计

### 4.培训与指导-2抽1-5分

#### 4.1培训

#### 4.2指导
















