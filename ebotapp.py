import execjs
import requests
import json

###数据解密函数###
def decrypt(origin_data):
	fp = open('./解密.js')
	js = fp.read()
	fp.close()
	ctx = execjs.compile(js)
	data = (ctx.call('test',origin_data))
	return data

session = requests.Session()

###获取功能ID等信息###
def getPageIndexList():

	url = 'http://ebotapp.entgroup.cn/API/BaseInfo/BaseInfo/PageIndexList'
	data = {
		'PageUrl':'/Movie/Index',
		'PageType':'Day',
		'UserID':''
	}
	headers = {
		'Accept':'text/plain, */*; q=0.01',
		'Accept-Encoding':'gzip, deflate',
		'Accept-Language':'zh-CN,zh;q=0.9',
		'Connection':'keep-alive',
		'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
		'X-Requested-With':'XMLHttpRequest',
		'Host':'ebotapp.entgroup.cn',
		'Origin':'http://ebotapp.entgroup.cn',
		'Referer':'http://ebotapp.entgroup.cn/DataBox/Film/Movie/Index',
		'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
	}
	req = session.post(url=url,data=data,headers=headers)
	json_data = json.loads(decrypt(req.text))
	table = json_data["Data"]["Table1"]
	print(table)


###获取时间###
def getDateList():

	url = 'http://ebotapp.entgroup.cn/API/BaseInfo/GetDateList'
	data = {
		
	}
	headers = {
		'Accept':'text/plain, */*; q=0.01',
		'Accept-Encoding':'gzip, deflate',
		'Accept-Language':'zh-CN,zh;q=0.9',
		'Connection':'keep-alive',
		'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
		'X-Requested-With':'XMLHttpRequest',
		'Host':'ebotapp.entgroup.cn',
		'Origin':'http://ebotapp.entgroup.cn',
		'Referer':'http://ebotapp.entgroup.cn/DataBox/Film/Movie/Index',
		'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
	}
	req = session.post(url=url,data=data,headers=headers)
	json_data = json.loads(decrypt(req.text))
	print(json_data)

###获取城市###
def getCityList():

	url = 'http://ebotapp.entgroup.cn/API/BaseInfo/BaseInfo/GetCityList'
	data = {
		
	}
	headers = {
		'Accept':'text/plain, */*; q=0.01',
		'Accept-Encoding':'gzip, deflate',
		'Accept-Language':'zh-CN,zh;q=0.9',
		'Connection':'keep-alive',
		'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
		'X-Requested-With':'XMLHttpRequest',
		'Host':'ebotapp.entgroup.cn',
		'Origin':'http://ebotapp.entgroup.cn',
		'Referer':'http://ebotapp.entgroup.cn/DataBox/Film/Movie/Index',
		'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
	}
	req = session.post(url=url,data=data,headers=headers)
	json_data = json.loads(decrypt(req.text))
	print(json_data)

###
def getMovieDayBoxOfficeList():

	url = 'http://ebotapp.entgroup.cn/API/DataBox/Movie/GetMovieDayBoxOfficeList'
	data = {
		'r':'0.4218466592800554',
		'PageIndex':'1',
		'PageSize':'20',
		'Order':'201',
		'OrderType':'DESC',
		'UserID':'',
		'Index':'101,102,201,202,225,606',
		'DateSort':'Day',
		'Date':'2017-12-13',
		'sDate':'2017-12-13',
		'eDate':'2017-12-13',
		'Line':'',
		'City':'',
		'CityLevel':'',
		'ServicePrice':'1'
	}
	headers = {
		'Accept':'text/plain, */*; q=0.01',
		'Accept-Encoding':'gzip, deflate',
		'Accept-Language':'zh-CN,zh;q=0.9',
		'Connection':'keep-alive',
		'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
		'X-Requested-With':'XMLHttpRequest',
		'Host':'ebotapp.entgroup.cn',
		'Origin':'http://ebotapp.entgroup.cn',
		'Referer':'http://ebotapp.entgroup.cn/DataBox/Film/Movie/Index',
		'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
	}
	proxy = {
		"HTTPS":"125.126.162.235:808"
	}
	req = session.post(url=url,data=data,headers=headers,proxies=proxy)
	json_data = json.loads(decrypt(req.text))
	print(json_data)

getMovieDayBoxOfficeList()