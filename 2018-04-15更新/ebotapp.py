#encoding:utf-8
'''
author:sixseven
update:2018-04-15
desc:艺恩数据网取消了数据加密部分，所以去除了解密部分，
	添加了按年份采集和按天数采集功能
contact:2557692481@qq.com
'''
import requests
import json
import xlwt
from time import sleep,time
import datetime

# 返回一段时间内所有天
def getBetweenDay(begin_date, end_date):  
    date_list = []  
    begin_date = datetime.datetime.strptime(begin_date, "%Y-%m-%d")
    end_date = datetime.datetime.strptime(end_date, "%Y-%m-%d") 
    while begin_date <= end_date:  
        date_str = begin_date.strftime("%Y-%m-%d")  
        date_list.append(date_str)  
        begin_date += datetime.timedelta(days=1)  
    return date_list

class EbotSpider:
	def __init__(self, type, **kwargs):
		self.session = requests.Session()
		if type=='Year':
			year_list = kwargs['year_list']
			self.wbk = xlwt.Workbook()
			for year in year_list:
				print('########### 采集年份{} ###########'.format(year))
				self.sheet1 = self.wbk.add_sheet(str(year))
				self.count = 0
				self.sheet1.write(self.count, 0, '票房排名')
				self.sheet1.write(self.count, 1, '影片名称')
				self.sheet1.write(self.count, 2, '今日票房')
				self.sheet1.write(self.count, 3, '场次')
				self.sheet1.write(self.count, 4, '人次')
				self.sheet1.write(self.count, 5, '累计票房')
				self.sheet1.write(self.count, 6, '服务费')
				self.sheet1.write(self.count, 7, '场均人次')
				self.getMovieDayBoxOfficeList(type, year)
				sleep(5)
			filename = './电影信息年份采集_{}.xls'.format(int(time()))
			self.wbk.save(filename)
			print('采集完成，保存至文件"{}"'.format(filename))


		elif type=='Day':
			self.type = type
			day_dict = kwargs['day_dict']
			begin_date = day_dict['begin_date']
			end_date = day_dict['end_date']
			self.wbk = xlwt.Workbook()
			day_list = getBetweenDay(begin_date, end_date)
			for day in day_list:
				print('########### 采集日期{} ###########'.format(day))
				self.sheet1 = self.wbk.add_sheet(str(day))
				self.count = 0
				self.sheet1.write(self.count, 0, '票房排名')
				self.sheet1.write(self.count, 1, '影片名称')
				self.sheet1.write(self.count, 2, '今日票房')
				self.sheet1.write(self.count, 3, '场次')
				self.sheet1.write(self.count, 4, '排座')
				self.sheet1.write(self.count, 5, '人次')
				self.sheet1.write(self.count, 6, '累计票房')
				self.sheet1.write(self.count, 7, '票房占比')
				self.sheet1.write(self.count, 8, '场次占比')
				self.sheet1.write(self.count, 9, '上座率')
				self.sheet1.write(self.count, 10, '排片占比')
				self.sheet1.write(self.count, 11, '平均票价')
				self.sheet1.write(self.count, 12, '服务费')
				self.sheet1.write(self.count, 13, '场均人次')
				self.getMovieDayBoxOfficeList(type, day)
				sleep(5)
			filename = './电影信息日期采集_{}.xls'.format(int(time()))
			self.wbk.save(filename)
			print('采集完成，保存至文件"{}"'.format(filename))


	### 电影票房、排片等指标
	def getMovieDayBoxOfficeList(self, type, date_info):
		page = 1
		if type=='Year':
			url = 'http://ebotapp.entgroup.cn/API/DataBox/Movie/GetMovieYearBoxOfficeList'
		elif type=='Day':
			url = 'http://ebotapp.entgroup.cn/API/DataBox/Movie/GetMovieDayBoxOfficeList'
		while(True):
			data = {
				'r':0.5684623531369022,
				'PageIndex':page,
				'PageSize':'1000',
				'Order':'201',
				'OrderType':'DESC',
				'UserID':'',
				'DateSort':type,
				'Date':date_info,
				'sDate':date_info,
				'eDate':date_info,
				'Index':'102,201,202,205,203,211,221,222,606,225,251,801,604',
				'Line':'',
				'City':'',
				'CityLevel':'',
				'ServicePrice':0 if type=='Year' else 1,
			}
			headers = {
				'Host':'ebotapp.entgroup.cn',
				'Origin':'http://ebotapp.entgroup.cn',
				'Referer':'http://ebotapp.entgroup.cn/DataBox/Film/Movie/Index',
				'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
			}
			req = self.session.post(url=url, data=data, headers=headers)
			json_data = json.loads(req.text)
			if json_data.get('Data').get('Table2'):
				data_list = json_data['Data']['Table2']
				if not len(data_list):
					print('采集完成...')
					break
				for data in data_list:
					if type=='Day':
						# 票房占比
						BoxPercent = data['BoxPercent']
						# 排片占比
						OfferSeatPercent = data['OfferSeatPercent']
						# 电影名
						MovieName = data['MovieName']
						# 排名
						Irank = data['Irank']
						# 今日票房
						BoxOffice = data['BoxOffice']
						# 累计票房
						SumBoxOffice = data['SumBoxOffice']
						# 排座
						OfferSeat = data['OfferSeat']
						# 场次占比
						ShowPercent = data['ShowPercent']
						# 场次
						ShowCount = data['ShowCount']
						# 人次
						AudienceCount = data['AudienceCount']
						# 上座率
						Attendance = data['Attendance']
						# 平均票价
						AvgBoxOffice = data['AvgBoxOffice']
						# 服务费
						ServicePrice = data['ServicePrice'] if data['ServicePrice'] is not None else '-'
						# 场均人次
						AvgShowPeople = data['AvgShowPeople']
						self.count += 1
						self.sheet1.write(self.count, 0, Irank)
						self.sheet1.write(self.count, 1, MovieName)
						self.sheet1.write(self.count, 2, BoxOffice)
						self.sheet1.write(self.count, 3, ShowCount)
						self.sheet1.write(self.count, 4, OfferSeat)
						self.sheet1.write(self.count, 5, AudienceCount)
						self.sheet1.write(self.count, 6, SumBoxOffice)
						self.sheet1.write(self.count, 7, BoxPercent)
						self.sheet1.write(self.count, 8, ShowPercent)
						self.sheet1.write(self.count, 9, Attendance)
						self.sheet1.write(self.count, 10, OfferSeatPercent)
						self.sheet1.write(self.count, 11, AvgBoxOffice)
						self.sheet1.write(self.count, 12, ServicePrice)
						self.sheet1.write(self.count, 13, AvgShowPeople)
						print('电影-{}\t采集完成...'.format(MovieName))
					elif type=='Year':
						# 电影名
						MovieName = data['MovieName']
						# 排名
						Irank = data['Irank']
						# 今日票房
						BoxOffice = data['BoxOffice']
						# 累计票房
						SumBoxOffice = data['SumBoxOffice']
						# 场次
						ShowCount = data['ShowCount']
						# 人次
						AudienceCount = data['AudienceCount']
						# 服务费
						ServicePrice = data['ServicePrice'] if data['ServicePrice'] is not None else '-'
						# 场均人次
						AvgShowPeople = data['AvgShowPeople']
						self.count += 1
						self.sheet1.write(self.count, 0, Irank)
						self.sheet1.write(self.count, 1, MovieName)
						self.sheet1.write(self.count, 2, BoxOffice)
						self.sheet1.write(self.count, 3, ShowCount)
						self.sheet1.write(self.count, 4, AudienceCount)
						self.sheet1.write(self.count, 5, SumBoxOffice)
						self.sheet1.write(self.count, 6, ServicePrice)
						self.sheet1.write(self.count, 7, AvgShowPeople)
						print('电影-{}\t采集完成...'.format(MovieName))
			else:
				break
			page += 1
			sleep(2)

if __name__ == '__main__':
	'''
	按年采集，year_list填写所要采集的年份，
	存至一个excel文件的不同工作表
	'''
	type = 'Year'
	year_list = [2015]
	ebotspider1 = EbotSpider(type, year_list=year_list)

	'''
	按天采集，start_date为起始时间，end_date为终止时间，
	每天的数据存至一个excel文件的不同工作表，
	由于excel工作表个数有限，范围天数不宜过大，
	start_date、end_date为合法时间且end_date应大于start_date
	'''
	type = 'Day'
	day_dict = {
		'begin_date':'2017-04-01',
		'end_date':'2017-04-05'
	}
	# ebotspider2 = EbotSpider(type, day_dict=day_dict)