import requests
from bs4 import BeautifulSoup as bs4
import pandas as pd


headers = {
  "Referer":"https://ssr1.scrape.center/",
  "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
}

movie_info = {
  "电影名称":[],
  "电影类型":[],
  "拍摄国家":[],
  "上映时间":[],
  "电影时长":[],
  "电影评分":[],
  # "电影详情":[],
}

# url = "https://p1.meituan.net/movie/6bea9af4524dfbd0b668eaa7e187c3df767253.jpg@464w_644h_1e_1c"

# response = requests.get(url, headers = headers)
# with open("./bwbj.jpg", "wb") as img:
#   img.write(response.content)

# url = "https://ssr1.scrape.center/"

# response = requests.get(url, headers= headers)

# soup = bs4(response.text, "html.parser")

for page in range(1, 11):
  url = f"https://ssr1.scrape.center/page/{page}"
  response = requests.get(url, headers= headers)
  soup = bs4(response.text, "html.parser")
  results = soup.find_all(name="div", class_="p-h el-col el-col-24 el-col-xs-9 el-col-sm-13 el-col-md-16")


  for i in range(len(results)):
  # for result in results:
    name =results[i].h2.text
    # print(f"电影名：{name}")
    movie_info["电影名称"].append(name)

    # 电影类型
    btns = results[i].find_all(name = "button", class_="el-button category el-button--primary el-button--mini")
    movie_type = ""
    for btn in btns:
      # print(btn.span.text)
      movie_type+=btn.span.text + ","
    movie_info["电影类型"].append(movie_type)

    #电影时长和国家
    infos = results[i].find_all(name="div", class_="m-v-sm info")

    span_list = infos[0].find_all(name="span")
    movie_info["拍摄国家"].append(span_list[0].text)
    movie_info["上映时间"].append(span_list[2].text)

    span_list = infos[1].find_all(name="span")
    if len(span_list)>0:
      movie_info["电影时长"].append(span_list[0].text)
    else:
      movie_info["电影时长"].append('')


    # for info in infos:
    #   spans = info.find_all(name="span")
    #   for span in spans:
    #     if(span.text != ' / ' ):
    #       print(span.text)

    # 电影评分
    score = soup.find_all(name="p", class_="score m-t-md m-b-n-sm")
    # print(score[0].text.strip())
    # print("++++++++++++++分割线++++++++++++++")
    movie_info["电影评分"].append(score[0].text.strip())


    # headers = {
    #   "Referer":f"https://ssr1.scrape.center/page/{i}",
    #   "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    # }

    # # 获取detail path，拼接url
    # path = results[i].a['href']
    # # print(f"href: {results[0].a['href']}")
    # url = f"https://ssr1.scrape.center{path}"  # 获取电影的详情简介

    # response = requests.get(url, headers= headers)
    # soup = bs4(response.text, "html.parser")
    # detail = soup.find_all(name="div", class_ ="drama")
    # # print(detail[0].p.text.strip()) # 获取电影简介
    # movie_info["电影详情"].append(detail[0].p.text.strip())


# url = "https://ssr1.scrape.center/page/1" # 翻页遍历每一页10个每页

# response = requests.get(url, headers= headers)
# soup = bs4(response.text, "html.parser")
# results = soup.find_all(name="div", class_="p-h el-col el-col-24 el-col-xs-9 el-col-sm-13 el-col-md-16")


# info = {
#   'name':["Eric","jack","Lily"],
#   'gender':["M","M","F"],
#   'age':[32,44,18]
# }


data = pd.DataFrame(movie_info)
# data = pd.DataFrame(info)
# print(data) # 类似excel的表格
data.to_excel("./movies.xlsx", index=False) # 生成Excel文件：index=False不带序号