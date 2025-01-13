from hashlib import md5
import time
import requests
from bs4 import BeautifulSoup as bs4
import os

headers = {
    "Referer": "https://music.91q.com/player",
    "Cookie": "cuid=04e787df-23bf-3c5e-ad6e-2e56e6287ee7",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
}

# keyword = "赵雷"
keyword = input("请输入歌手名字：")

# 从js代码里找出来的
secret = "0b50b02fd0d73a9c4c8c3a781c30845f"
appid = "16073360"
base_url = "https://music.91q.com"

# response = requests.get("https://music.163.com/search/m/?s=" + keyword, headers=headers)


# 生成sign值，搜索歌手接口和拿歌曲链接要用
def createSign(r):
    # 要按顺序
    r = r + secret
    return md5(r.encode("utf8")).hexdigest()[:32]


# 生成sign值，然后使用https://music.91q.com/v1/song/tracklink接口获取xcode，再根据xcode去取真实的歌曲链接
# def createSign(appid, TSID, timestamp):
#     # 要按顺序
#     r = "TSID=" + TSID + "&appid=" + appid + "&timestamp=" + timestamp + secret
#     return md5(r.encode("utf8")).hexdigest()[:32]
# print(createSign("16073360", "T10040899625", "1736756072"))


def downloadBySearch(res):
    if "path" in res["data"]:
        # print("path =", res["data"]["path"])
        song_data = requests.get(res["data"]["path"])
        song_name = res["data"]["title"]
        singer_name = ""
        for artist in res["data"]["artist"]:
            singer_name += artist["name"] + "_"
        if singer_name.endswith("_"):
            singer_name = singer_name.rstrip("_")
        format = res["data"]["format"]
        with open(f"./music/{singer_name}+{song_name}.{format}", "wb") as f:
            f.write(song_data.content)


response = requests.get(base_url + "/search?word=" + keyword, headers=headers)

soup = bs4(response.content, "html.parser")

# 根据分页设置循环次数
page_tags = soup.find_all(name="li", class_="number")
total_page = 0
if len(page_tags) == 0:
    total_page = 1
else:
    total_page = int(page_tags[-1].text)


for cur_page in range(1, total_page + 1):
    word = keyword
    timestamp = str(int(time.time()))
    r = f"appid={appid}&pageNo={cur_page}&pageSize=20&timestamp={timestamp}&type=1&word={word}"
    sign = createSign(r)

    # response = requests.get(
    #     f"https://music.91q.com/v1/song/tracklink?sign={sign}&appid={appid}&TSID={TSID}&timestamp={timestamp}"
    # )
    params = {
        "appid": appid,
        "word": word,
        "sign": sign,
        "timestamp": timestamp,
        "type": 1,
        "pageNo": cur_page,
        "pageSize": 20,
    }
    response = requests.get(base_url + "/v1/search", params=params)
    res = response.json()
    # print("response = ", res)
    for track in res["data"]["typeTrack"]:
        TSID = track["TSID"]
        song_name = track["title"].replace('"', "")
        singer_name = ""
        for artist in track["artist"]:
            singer_name += artist["name"] + "_"
        if singer_name.endswith("_"):
            singer_name = singer_name.rstrip("_")
        singer_name.replace('"', "")
        r1 = "TSID=" + TSID + "&appid=" + appid + "&timestamp=" + timestamp
        sign1 = createSign(r1)
        params = {"appid": appid, "TSID": TSID, "sign": sign1, "timestamp": timestamp}
        response = requests.get(
            "https://music.91q.com/v1/song/tracklink", params=params
        )
        # downloadBySearch(response.json())
        res = response.json()
        # print(res)
        isVip = res["data"]["isVip"]
        isPaid = res["data"]["isPaid"]
        format = res["data"]["format"]
        if isVip == 0 & ("path" in res["data"]):
            print("path =", res["data"]["path"])
            song_data = requests.get(res["data"]["path"])
            try:
                if not os.path.exists("./music"):
                    os.mkdir("./music")
                with open(f"./music/{singer_name}+{song_name}.{format}", "wb") as f:
                    f.write(song_data.content)
                print("下载完毕")
            except:
                print("出错了...")

    # if "path" in res["data"]:
    #     print("path =", res["data"]["path"])
    #     song_data = requests.get(res["data"]["path"])
    #     song_name = res["data"]["title"]
    #     singer_name = ""
    #     for artist in res["data"]["artist"]:
    #         singer_name += artist["name"] + "_"
    #     if singer_name.endswith("_"):
    #         singer_name = singer_name.rstrip("_")
    #     format = res["data"]["format"]
    #     with open(f"./music/{singer_name}+{song_name}.{format}", "wb") as f:
    #         f.write(song_data.content)

# response = requests.get(base_url + "/search?word=" + keyword, headers=headers)
# soup = bs4(response.content, "html.parser")
# content_box = soup.find_all(name="div", class_="content")
# song_box = content_box[0].find_all(name="div", class_="song-box")
# song_lists = song_box[0].find_all(name="li", class_="pr t clearfix")


def download(song_lists):
    for song in song_lists:
        # print(song.a.text)
        # print(song.a["href"])
        TSID = song.a["href"].split("/")[-1]
        timestamp = str(int(time.time()))
        r = "TSID=" + TSID + "&appid=" + appid + "&timestamp=" + timestamp
        sign = createSign(r)
        # response = requests.get(
        #     f"https://music.91q.com/v1/song/tracklink?sign={sign}&appid={appid}&TSID={TSID}&timestamp={timestamp}"
        # )
        params = {"appid": appid, "TSID": TSID, "sign": sign, "timestamp": timestamp}
        response = requests.get(
            "https://music.91q.com/v1/song/tracklink", params=params
        )
        # print("response = ", response.json())
        res = response.json()
        if "path" in res["data"]:
            print("path =", res["data"]["path"])
            song_data = requests.get(res["data"]["path"])
            song_name = res["data"]["title"]
            singer_name = ""
            for artist in res["data"]["artist"]:
                singer_name += artist["name"] + "_"
            if singer_name.endswith("_"):
                singer_name = singer_name.rstrip("_")
            format = res["data"]["format"]
            with open(f"./music/{singer_name}+{song_name}.{format}", "wb") as f:
                f.write(song_data.content)

        # print(song.a.text, base_url + song.a.get("href"), TSID)

        # singer_box = song.find_all(name="div", class_="artist ellipsis")
        # # print(singer_box)

        # for s in singer_box:
        #     singers = s.find_all(name="a", class_="")
        #     for singer in singers:
        #         print(singer.text, base_url + singer.get("href"))


# https://music.91q.com/v1/song/tracklink?sign=9fc7a2117bc61378cc8aa8a9ca3f7eeb&appid=16073360&TSID=T10040899625&timestamp=1736756072  ->   xcode

# https://audio04.dmhmusic.com/71_53_T10063954909_128_4_1_0_sdk-cpm/cn/0513/M00/4E/DF/ChAKCGTcw3-ACpZdADn8_Hqw3gU267.mp3?xcode=82bd65c3447c741ef1d0282ef79f0054812e9aa


# response =  {'state': True, 'errno': 22000, 'errmsg': '', 'elapsed_time': '0.0401', 'ip': '10.16.15.13', 'data': {'artist': [{'artistCode': 'A10839310', 'gender': '男', 'name': 'GAI周延', 'artistType': 2, 'artistTypeName': '合作艺人', 'pic': 'https://img01.dmhmusic.com/0210/M00/6A/1F/ChR461tND86AIBLBAABCx4m6QbU921.jpg', 'region': '', 'isFavorite': 0}, {'artistCode': 'A10047763', 'birthday': '1983-07-04', 'gender': '男', 'name': '胡彦斌', 'artistType': 38, 'artistTypeName': '歌手', 'pic': 'https://img01.dmhmusic.com/0206/M00/70/D4/ChR461tM60iAT3VfAAGBbG1ut2Q893.jpg', 'region': '', 'isFavorite': 0}], 'cpId': 23, 'pic': 'https://img01.dmhmusic.com/0513/M00/3D/FD/ChAKCGTUszaABSROACx1Sz8vQtE589.jpg', 'title': '敬自己不为谁', 'duration': 237, 'assetId': 'T10063954909', 'genre': '流行', 'albumTitle': '是一场烟火', 'id': 'T10063954909', 'lang': '中文', 'afReplayGain': 0, 'albumAssetCode': 'P10004125797', 'releaseDate': '2023-08-18T00:00:00.000Z', 'isrc': 'CNZ882300956', 'sort': 8, 'meanVolume': 0, 'maxVolume': 0, 'lyric': 'https://static-qianqian.taihe.com/0513/M00/E2/43/ChAKFGTd8EmAT3orAAAKsmIJv34275.txt', 'TSID': 'T10063954909', 'allRate': ['64', '320', '3000', '128'], 'pushTime': '2023-08-18T00:00:00+08:00', 'downTime': '2037-01-01T00:00:00+08:00', 'bizList': ['sdk_cpm'], 'bits': 16, 'path': 'https://audio04.dmhmusic.com/71_53_T10063954909_128_4_1_0_sdk-cpm/cn/0513/M00/4E/DF/ChAKCGTcw3-ACpZdADn8_Hqw3gU267.mp3?xcode=f1a9feafdf1618fbf1d0defe33afd3642c61d89', 'size': 3800316, 'rate': 128, 'hashcode': '9b48e9c4322f1973eedadd002f3eaf78c00549d9', 'format': 'mp3', 'filemd5': '6af68f3d7f15acf6641391c9368f6210', 'expireTime': 1736762114, 'isFavorite': 0, 'isVip': 0, 'isPaid': 0}}
# 敬自己不为谁 https://music.91q.com/song/T10063954909 T10063954909
# GAI周延 https://music.91q.com/artist/A10839310
# 胡彦斌 https://music.91q.com/artist/A10047763
# # 9fc7a2117bc61378cc8aa8a9ca3f7eeb
