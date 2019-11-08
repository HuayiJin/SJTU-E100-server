# -*- coding:utf-8 -*-

import execjs
import http.cookiejar as cj
import requests
import os.path
import json
from bs4 import BeautifulSoup

class sgmw_crwal:
    def __init__(self, username, password):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36kk '
                          '(KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36}',
            'Referer': 'https://cloud.sgmw.com.cn/login.aspx'
        }
        self.login_url = 'https://cloud.sgmw.com.cn/login.aspx'
        self.index_url = 'https://cloud.sgmw.com.cn/index.aspx'
        self.session = requests.session()
        if os.path.isfile('cookies.txt'):
            self.session.cookies = cj.LWPCookieJar(filename='cookies.txt')
            self.session.cookies.load(filename='cookies.txt', ignore_discard=True)
        else:
            self.session.cookies = cj.LWPCookieJar()
        self.username = username
        self.password = password

    def get_auth_img(self):
        auth_code_url = 'https://cloud.sgmw.com.cn/VerifyCode.aspx?a=' + execjs.eval("new Date")
        auth_img = self.session.get(auth_code_url, headers=self.headers)
        print(auth_img)
        with open('auth.jpg', 'wb') as f:
            f.write(auth_img.content)
        code_typein = input("请根据下载图片输入验证码：")
        return code_typein

    def login(self):
        data = {
            'action': 'login',
            'user': self.username,
            'pass': self.password,
            'tag': 'false',
            'yzm': self.get_auth_img()
        }
        headers = {
            "Referer": self.login_url,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36kk '
                          '(KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36}',
            'X-Requested-With': 'XMLHttpRequest'
        }
        try:
            login_page = self.session.post('https://cloud.sgmw.com.cn/functions/commonajax.ashx',
                                           data=data, headers=headers, cookies=self.session.cookies)
            print(login_page)
            self.session.cookies.save(filename='cookies.txt', ignore_discard=True, ignore_expires=True)
        except Exception as e:
            print(e)

    def get_car_list(self):
        data = {
            'action': 'getline',
            'type': 'V'
        }
        headers = {
            "Referer": self.index_url,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36kk '
                          '(KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36}',
            'X-Requested-With': 'XMLHttpRequest'
        }
        try:
            line = self.session.post('https://cloud.sgmw.com.cn/functions/DpsCanData.ashx',
                                     data=data, headers=headers)
            return line.text
        except Exception as e:
            print(e)

    def req_vehdata(self, vehnumber):
        data = {
            'op': 'FindHistoricalDataData',
            # 'vehnumber': vehnumber,
            'vehnumber': 24048,
            'datasarr': '[{"key":"TravelTime","value":"日期"},\
            {"key":"经度","value":"经度"},\
            {"key":"纬度","value":"纬度"},\
            {"key":"DATA3","value":"车辆运行模式"},\
            {"key":"DATA5","value":"制动踏板位置"},\
            {"key":"DATA7","value":"加速踏板位置"},\
            {"key":"DATA8","value":"档位"},\
            {"key":"DATA13","value":"钥匙状态"},\
            {"key":"DATA14","value":"驾驶模式"},\
            {"key":"DATA23","value":"车速"},\
            {"key":"DATA26","value":"电机状态"},\
            {"key":"DATA29","value":"电机转矩"},\
            {"key":"DATA30","value":"电机转速"},\
            {"key":"DATA34","value":"电机控制器电流"},\
            {"key":"DATA35","value":"电机控制器电压"},\
            {"key":"DATA36","value":"电机温度"},\
            {"key":"DATA37","value":"电机控制器温度"},\
            {"key":"DATA41","value":"总电流"},\
            {"key":"DATA42","value":"总电压"},\
            {"key":"DATA43","value":"绝缘阻值"},\
            {"key":"DATA47","value":"剩余电量"},\
            {"key":"DATA58","value":"电池最高单体电压"},\
            {"key":"DATA60","value":"电池最低单体电压"},\
            {"key":"DATA94","value":"总行驶里程"}]',
            'starttime': '2019-06-14 00:00',
            'endtime': '2019-06-15 00:00',
            'datatypesvalue': 'DATA3, DATA5, DATA7, DATA8, DATA13, DATA14, DATA23, DATA26, DATA29,\
             DATA30, DATA34, DATA35, DATA36, DATA37, DATA41, DATA42, DATA43, DATA47, DATA58, DATA60, DATA94'
        }
        headers = {
            "Referer": 'https://cloud.sgmw.com.cn/HistoricalData/SelectHistoricalDataCh.aspx',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36kk '
                          '(KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36}',
            'X-Requested-With': 'XMLHttpRequest'
        }
        try:
            res = self.session.post('https://cloud.sgmw.com.cn/HistoricalDataAjax/SelectHistoricalDataChAjax.ashx',
                                     data=data, headers=headers)
            return res.text
        except Exception as e:
            print(e)


if __name__ == '__main__':
    sgmw = sgmw_crwal('shanghai','Sh@50#54')
    autologin = sgmw.session.get('https://cloud.sgmw.com.cn/index.aspx', headers=sgmw.headers)
    soup = BeautifulSoup(autologin.content, 'lxml')

    if '[<title>上汽通用五菱云智能行车管理系统</title>]' == str(soup('title')):
        print('Auto login success')
    else:
        sgmw.login()

    car_list = json.loads(sgmw.get_car_list())['Value']

    # for line in car_list[0]['c']:
    #     print(line['v'])
    # for line in car_list[1]['c']:
    #     print(line['v'])

    select_car = car_list[0]['c'][1]['v']
    car_result = sgmw.req_vehdata(select_car)
    car_result_json = json.loads(str(car_result).strip('(').strip(')'))
    print(car_result_json['Txt'])




