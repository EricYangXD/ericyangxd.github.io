---
title: 2026上海人工智能训练师（三级/高级）
author: EricYangXD
date: "2026-07-28"
meta:
  - name: keywords
    content: Pandas,Numpy,Matplotlib,人工智能训练师
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
2. 加载数据：``
3. 展示数据：``
4. 处理数据：`X = pd.get_dummies(X)  # 将分类变量转为数值变量`
5. 设置自变量X和因变量y：``
6. 分割训练集和测试集：``
7. 训练模型：
   - `model = DecisionTreeRegressor(random_state=42) # 创建并训练决策树回归模型`
   - `rf_model = RandomForestRegressor(n_estimators=100, random_state=42) # 创建随机森林回归模型（创建的决策树的数量为100）`
   - `xgb_model = xgb.XGBRegressor(n_estimators=100, random_state=42) # 初始化XGBoost回归模型（构建100棵树）`
   - `model = LinearRegression() # 初始化线性回归模型`
   - `model = LogisticRegression(max_iter=1000) # 训练Logistic回归模型（最大迭代次数为1000次）`
   - ``
8. 保存模型：`pickle.dump(model, model_file) # 保存训练好的模型`
9. 预测并保存结果：`y_pred = model.predict(X_test) # 进行预测`/`results = pd.DataFrame({'实际值': y_test, '预测值': y_pred}) # 将结果保存到文本文件中`
10. 生成测试报告：`report = classification_report(y_test, y_pred, zero_division=1)`
11. 分析测试结果：`accuracy = (y_test==y_pred).mean()`
12. 处理数据不平衡：`# 处理数据不平衡，重采样: smote = SMOTE(random_state=42); X_resampled, y_resampled = smote.fit_resample(X_train, y_train)`
13. 重新训练模型：``
14. 重新预测并保存结果：``
15. 重新生成测试报告：``
16. 重新分析测试结果：``
17. 涉及的几个特殊值计算：`均方误差: {mean_squared_error(y_test, y_pred)}`/`平均绝对误差: {mean_absolute_error(y_test, y_pred)}`/`决定系数: {r2_score(y_test, y_pred)}`/`XGBoost训练集得分: {xgb_model.score(X_train, y_train)}`/`XGBoost测试集得分: {xgb_model.score(X_test, y_test)}`

分析题答题套路：

> 错误分析+改进建议

1. 特征冗余或无关变量过多：部分特征可能与目标变量无关，干扰模型学习。建议进行特征选择或使用正则化方法（如Lasso）筛选关键特征。
2. 模型选择不当：当前模型可能无法捕捉数据中的非线性关系。建议尝试非线性模型如XGBoost、随机森林等进行对比。
3. 样本量不足或数据质量差：样本量小或存在缺失、异常值，影响模型泛化能力。应扩充数据量并进行数据清洗处理。
4. 数据划分不合理：训练集和测试集分布差异大可能导致模型性能不稳定。建议使用分层抽样或交叉验证优化划分方式。


### 3.智能系统设计-2题必考-15分+20分

#### 3.1智能系统监控与优化

根据题目，处理操作Excel数据，通过数据透视表统计分析数据回答问题，再回答几个流程优化等问题

#### 3.2人机交互流程设计

代码补全，基本流程：

1. 加载模型：`session = ort.InferenceSession('resnet.onnx')`
2. 加载类别标签：`with open(labels_path) as f: labels = [line.strip() for line in f.readlines()]`、`class_names = [name.strip() for name in open('voc-model-labels.txt').readlines()] # 从标签文件中读取每一行，并去除行首尾的空白字符，得到类别名称列表`
3. 获取模型输入和输出的名称：`session.get_inputs()[0].name`/`session.get_outputs()[0].name`
4. 加载本地测试图片：`image = Image.open('img_test.jpg').convert('RGB')`/`image = Image.open('img_test.png').convert('L')  # 转为灰度图`
5. 预处理图像：`processed_image = preprocess_image(image)`、`processed_image = processed_image.astype(np.float32)`、`image = image.resize((28, 28))  # 调整大小为MNIST模型的输入尺寸`、`image_array = np.array(image, dtype=np.float32)  # 转为numpy数组`、`image_array = np.expand_dims(image_array, axis=0)  # 添加batch维度`、`img = img.resize((64, 64), Image.Resampling.LANCZOS)    # 调整图像大小到模型输入所需的尺寸  # 新版本代码`
6. 返回模型输入列表：`ort_inputs = {ort_session.get_inputs()[0].name: image_array}  # 模型和输入绑定`
7. 使用模型识别图片：`output = session.run([output_name], {input_name: processed_image})[0]`
8. 应用 softmax 函数获取概率：`probabilities = scipy.special.softmax(output, axis=-1)`
9. 获取预测结果：`top5_idx = np.argsort(probabilities[0])[-5:][::-1] # 先排序再取索引`、`top5_prob = probabilities[0][top5_idx]  # 根据索引获取top5`、`predicted_class = np.argmax(ort_outs[0])  # 获取最大值`、`predicted_emotion = list(emotion_table)[predicted_label] # 通过list()把dict转成list`、`predicted_idx =  np.argmax(accuracy) # 获取预测的类别索引`、`prob_percentage =  accuracy[0, predicted_idx] * 100 # 获取预测的准确值（转换为百分比）`
10. 输出识别结果：``
11. 目录操作：`if not os.path.exists(result_path): os.makedirs(result_path) # 如果保存结果的目录不存在，则创建该目录`、`listdir = os.listdir(path) # 获取指定目录下的所有文件和文件夹名称列表`
12. OpenCV操作：`orig_image = cv2.imread(img_path) # 使用 OpenCV 读取图像文件`、`image = cv2.resize(image, (320, 240))`、`image_mean = np.array([127, 127, 127])`、`image = np.transpose(image, [2, 0, 1])`、`image = np.expand_dims(image, axis=0)`、`image = image.astype(np.float32)`、`boxes, labels, probs = predict(orig_image.shape[1], orig_image.shape[0], confidences, boxes, threshold)`、`cv2.rectangle(orig_image, (box[0], box[1]), (box[2], box[3]), (255, 255, 0), 4)`、`cv2.imwrite(os.path.join(result_path, file_path), orig_image)`

问答题套路：

1. 加载模型：预加载，启动程序并载入模型参数。
2. 加载图片：给出用户界面，用户上传或导入图像。
3. 模型运行：模型调参，模型对输入图像进行分析。
4. 结果显示：可视化分析，输出预测结果并呈现给用户。

### 4.培训与指导-2抽1-5分

#### 4.1培训
1. 4.1.1 Label studio培训大纲编写
  1. 了解数据标注的定义、类型、作用和重要性
  2. 掌握Label Studio的应用场景、安装配置和界面基本操作
  3. 掌握文本数据标注的方法和技巧
  4. 掌握图像数据标注的方法和技巧
  5. 掌握视频数据标注的方法和技巧
2. 4.1.2 爬虫培训大纲编写
   1. 了解网页爬虫的基本概念、工作流程和使用规范
   2. 掌握BeautifulSoup、Scrapy、Selenium等常用爬虫工具的特点和用途
   3. 掌握网页数据解析方法，能够提取网页中的目标信息
   4. 掌握Scrapy项目的创建、爬虫编写和数据导出方法
   5. 掌握爬取数据的清洗、去重、格式转换和规范化处理方法
3. 4.1.3 数据清洗培训大纲编写
   1. 了解人工智能在康复训练中的应用以及数据清洗在康复数据处理中的作用
   2. 了解数据清洗的基本概念、常见任务及其重要性
   3. 了解Pandas、Numpy、OpenRefine、Dask等常用数据清洗工具的特点和用途
   4. 掌握Python环境的搭建和常用数据清洗工具的安装方法
   5. 掌握使用Pandas进行数据导入、筛选、清洗和转换的方法
4. 4.1.4 Pandas数据清洗培训大纲编写
  1. 掌握Pandas库的基本作用、安装方法及数据导入导出操作
  2. 掌握使用Pandas进行数据筛选、去重和缺失值处理的基本方法
  3. 掌握数据类型转换、时间序列处理及数据列拆分与合并的方法
  4. 掌握多数据集的合并方法以及数据透视、重塑和格式转换的基本操作
  5. 掌握使用groupby进行数据分组统计并能够运用常见聚合函数进行数据汇总分析
5. 4.1.5 Python数据可视化培训大纲编写
  1. 掌握数据可视化的定义、目的、优势和常见类型
  2. 掌握Matplotlib库的应用场景、安装配置、基本架构和常用组件的使用
  3. 掌握使用Matplotlib进行绘制基本图表的方法
  4. 掌握Plotly库的应用场景、安装配置和使用方法
  5. 掌握使用Plotly绘制基本图表的方法
  
#### 4.2指导
















