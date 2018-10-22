import time
import random
from multiprocessing import Process
import requests
import re
import os
import time


def get_photourl(photo_url):
    kw = {'user-agent':'Mozilla/5.0 (Windows NT 10.0; WOW64)'}
    try:
        r = requests.get(photo_url,headers = kw)
        r.raise_for_status()
        r.encoding = r.apparent_encoding
        return r
    except:
        print(" wrong url")
        return 'wrong'
 
def makedir(fpath):
    E = os.path.exists(fpath)
    if not E:
        os.makedirs(fpath)
        #os.chdir(fpath)
        #print('文件夹'+ key + '_page' + str(i + 1) + '创建成功！')
    else:
        pass
        #print('文件夹已存在！')
 
def get_photos(url,fpath):
    result = get_photourl(url)
    if result == 'wrong' :
        return


    title = re.findall(re.compile("<h1 class=\"title\">.*?</h1>"), result.text)
    title = re.findall(re.compile(">.+<"), title[0])
    title = re.findall(re.compile("[^>].*[^<]"), title[0])
    print(title)
    
    pattern = re.compile("/ashx/ImagesHandler.*?jpg")    
    items = re.findall(pattern,result.text)
    makedir(fpath+title[0])

    for item in items:
        try:
            photo_url = 'http://www.mimiweidao.com' + item
            #print(item)
            save_items = re.findall(re.compile("/[\w\-]*\.jpg"),item)
            #print(save_items)
            Final_fpath = fpath + title[0] + str(save_items[0])
            #print(Final_fpath)
            save(photo_url,Final_fpath)
            time.sleep(2)
        except:
            print("error in item")
            continue
 
def save(photo_url,Final_fpath):
 
    #print('正在下载图片......')
    result = get_photourl(photo_url)
    if result == 'wrong':
        #print('图片下载失败')
        return
        
    E = os.path.exists(Final_fpath)

    if not E:
        try:
            with open(Final_fpath,'wb') as f:
                f.write(result.content)
        except:
            pass
            #print('保存失败！')
    else:
        pass
        #print('图片已存在')
 
def piao(a,b):
    print('a is %d, b is %d',a ,b)
    url = 'http://www.mimiweidao.com/yuanwei/Info/'
    fpath ='/Users/joseph.j/developer/playground/crawler/Photo3.0/'

    for key in range(a,b):
        try:
            new_url = url + str(key)
            if get_photos(new_url,fpath) == 'wrong':
                print('下载失败！')
        except:
            print('下载失败！')
    time.sleep(1)


p1=Process(target=piao,args=(22600,22700,)) #必须加,号
p2=Process(target=piao,args=(22700,22800,))
p3=Process(target=piao,args=(22800,22900,))
p4=Process(target=piao,args=(22900,23000,))

if __name__ == '__main__':
    print('主线程')
    p1.start()
    p2.start()
    p3.start()
    p4.start()
