import pandas as pd

# df = pd.read_excel("./movies.xlsx")

# # 快速查看数据信息
# print(df.info())

# # 删除缺失值的行
# df = df.dropna()

# print(df.info())

# df.to_excel("./clear_movies.xlsx", index=False)


# 清洗数据
# df = pd.read_excel("./clear_movies.xlsx")


def clearName(name):
    # print(name)
    # name = name.split("-")[0].strip()
    return name[: name.find(" ")].strip()


def clearType(str):
    return str[:-1]


# df["电影名称"] = df["电影名称"].apply(clearName)
# df["上映时间"] = df["上映时间"].apply(clearName)
# df["电影时长"] = df["电影时长"].apply(clearName)
# df["电影类型"] = df["电影类型"].apply(clearType)

# df.to_excel("./cleared_movies.xlsx", index=False)

# 找出时长最长的电影
df = pd.read_excel("./cleared_movies.xlsx")

# print(df["电影时长"].argmax())
# print(df["电影时长"].max())
# print(df["电影时长"].argmin())
# print(df["电影时长"].min())
# print(df.iloc[df["电影时长"].argmax(), :])

# 计算平均分
print(df["电影评分"].mean())
avg = df["电影评分"].mean()
# print(df["电影评分"] > avg)
# for movie in df:
#     if float(movie["电影评分"]) > avg:
#         print(movie["电影名称"])
# print(df[df["电影评分"] > avg][["电影名称", "电影评分"]])  # 过滤出评分高于平均值的电影
# print(df[df["电影评分"] > avg]["电影名称"])  # 过滤出评分高于平均值的电影


def hasChina(name):
    return "中国" in name


def hasJapan(name):
    return "日本" in name


# 逻辑操作：与& 或| 非~

# 过滤出评分高于平均值且产自中国的电影
# print(
#     df[
#         (~df["拍摄国家"].apply(hasChina) | df["拍摄国家"].apply(hasJapan))
#         & (df["电影评分"] > avg)
#     ][["电影名称", "电影评分", "拍摄国家"]]
# )


# 过滤年份
def getYear(year):
    return int(year[:4])


print(df[df["上映时间"].apply(getYear) >= 2000][["上映时间", "电影名称"]])
# print(df[df["上映时间"].apply(getYear) >= 2000][["上映时间", "电影名称"]].count())

# groupby 按年份分组

# 按年份分组并统计数量
print(df["上映时间"].groupby(df["上映时间"].apply(getYear)).count())

# 按年份分组并统计数量
print(df.groupby(df["上映时间"].apply(getYear)).count())
