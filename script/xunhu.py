'''
Author: Ethan Zhang
Date: 2023-06-10 15:42:30
LastEditTime: 2023-06-17 14:36:48
FilePath: /siyu/script/xunhu.py
Description: 

Copyright (c) 2023 Ethan Zhang, All Rights Reserved. 
'''
import hashlib
import time
import collections


def getSecondTimestamp(date=None):
    if date == None:
        date = time.time()
    # 获取精确到秒的时间戳
    timestamp = int(date)
    return timestamp


# 配置你的APPID
appid = "201906125482"

# 设置参数
options = {
    # 设置版本号
    "version": "1.1",

    # 设置 appid
    "appid": appid,

    # 订单号 具体内容自己控制 长度 32位
    "trade_order_id": "20",

    # 价格价格 精确到分
    "total_fee": "0.01",

    # 标题
    "title": "test",

    # 当前时间戳
    "time": getSecondTimestamp(),

    # notify_url 回调地址
    "notify_url": "https://eozlweyfo3w7zin.m.pipedream.net",

    # nonce_str  随机值 32位内
    "nonce_str": "740969606"
}

appsecret = "fdd71ac173dd532750533d4859449d4b"

# 将字典按照键排序
options = collections.OrderedDict(sorted(options.items()))

# 生成待加密字符串
raw_string = '&'.join(f'{k}={v}' for k, v in options.items()) + appsecret
print("拼接的string: ", raw_string)

# 生成MD5
hash_string = hashlib.md5(raw_string.encode()).hexdigest()

print(f"我们生成的Hash 是：{hash_string}")
print(f"我们生成的time 是:{options['time']}")
