# -*- coding: utf-8 -*-   
#!/usr/bin/env python3
from chardet import detect
import pandas as pd
import sys
import os
import mysql.connector
from sqlalchemy import create_engine
import time

class Data2sql:
    def replace(self,data):
        data.accelerator_pedal_stroke = data.accelerator_pedal_stroke.replace(regex=[r'%'],value='')
        data.velocity = data.velocity.replace(regex=[r'km/h'],value='')
        data.motor_torque = data.motor_torque.replace(regex=[r'Nm'],value='')
        data.drive_motor_rpm = data.drive_motor_rpm.replace(regex=[r'rpm'],value='')
        data.motor_controller_current = data.motor_controller_current.replace(regex=[r'A'],value='')
        data.motor_controller_voltage = data.motor_controller_voltage.replace(regex=[r'V'],value='')
        data.drive_motor_temperature = data.drive_motor_temperature.replace(regex=[r'℃'],value='')
        data.motor_controller_temperature = data.motor_controller_temperature.replace(regex=[r'℃'],value='')
        data.high_voltage_battery_current = data.high_voltage_battery_current.replace(regex=[r'A'],value='')
        data.total_battery_voltage = data.total_battery_voltage.replace(regex=[r'V'],value='')
        data.insulation_resistance_value = data.insulation_resistance_value.replace(regex=[r'kOhm'],value='')
        data.residual_energy = data.residual_energy.replace(regex=[r'%'],value='')
        data.max_single_voltage = data.max_single_voltage.replace(regex=[r'mV'],value='')
        data.min_single_voltage = data.min_single_voltage.replace(regex=[r'mV'],value='')
        data.cumulative_mileage = data.cumulative_mileage.replace(regex=[r'km'],value='')
        return data
        
    def rename(self):
        columns={
            '日期':'create_time',
            '经度':'longitude',
            '纬度':'latitude',
            '车辆运行模式':'vehicle_operating_mode',
            '制动踏板位置':'brake_pedal_status',
            '加速踏板位置':'accelerator_pedal_stroke',
            '档位':'gear_position',
            '钥匙状态':'key_status',
            '驾驶模式':'driving_mode',
            '车速':'velocity',
            '电机状态':'motor_status',
            '电机转矩':'motor_torque',
            '电机转速':'drive_motor_rpm',
            '电机控制器电流':'motor_controller_current',
            '电机控制器电压':'motor_controller_voltage',
            '电机温度':'drive_motor_temperature',
            '电机控制器温度':'motor_controller_temperature',
            '总电流':'high_voltage_battery_current',
            '总电压':'total_battery_voltage',
            '绝缘阻值':'insulation_resistance_value',
            '剩余电量':'residual_energy',
            '电池最高单体电压':'max_single_voltage',
            '电池最低单体电压':'min_single_voltage',
            '总行驶里程':'cumulative_mileage'
        }
        return columns

    def getruntime(self):
        return [
            'timestamp',
            'car_VIN',
            'cumulative_mileage',
            'longitude',
            'latitude',
            'velocity',
            'motor_controller_temperature',
            'drive_motor_rpm',
            'drive_motor_temperature',
            'brake_pedal_status',
            'accelerator_pedal_stroke']
    
    def getbattery(self):
        return [
            'timestamp',
            'car_VIN',
			'high_voltage_battery_current',
			'residual_energy',
			'total_battery_voltage',
			'max_single_voltage',
			'min_single_voltage',
			'insulation_resistance_value']
    
    def getother(self):   
        return [
            'timestamp',
            'car_VIN',
			'gear_position',
			'key_status',
            'vehicle_operating_mode',
			'driving_mode',
			'motor_status',
			'motor_torque',
			'motor_controller_current',
			'motor_controller_voltage']


def convert2UTF(filedir):
    for root, dirs, filelist in os.walk(filedir+'/rawdata'):
        for files in filelist:
            print(files)
            rawf = os.getcwd() + '/rawdata/' + files
            with open(rawf, 'rb') as f:
                s = f.read()
            coding = detect(s)['encoding']
            #print('coding: {}'.format(coding))
            format(s.decode(coding).rstrip())
            newf = os.getcwd() + '/utf8data/'+files
            with open(newf, 'wb') as f:
                f.write(s.decode(coding).encode('utf8'))
            print('done!')
            format(newf)

def dbsqlengine(data,table):
    engine = create_engine('mysql+pymysql://root:123456@localhost:3306/localtest')
    data.to_sql(table, engine,if_exists='replace', index=False)

def connectsql(sql):
    mydb = mysql.connector.connect(
        host="e100",       # 数据库主机地址
        user="root",    # 数据库用户名
        passwd="123456",   # 数据库密码
        database="E100_TABLE"
    )
    mycursor = mydb.cursor()
    mycursor.execute(sql)

def main():
    filedir = os.getcwd()
    data2sql = Data2sql()
    errorcount = 0

    choose = input("convert or not? y/n")
    if choose == 'y':
        convert2UTF(filedir)
    
    filelist = os.listdir(filedir+'/utf8data')

    time_start = time.time()
    for files in filelist:
        f = filedir + '/utf8data/' + files
        data = pd.read_csv(f, low_memory=False)

        #Turn Chinese columns to Sql columns
        data.rename(columns = data2sql.rename(), inplace = True)

        #remove units in data
        data=data2sql.replace(data)        

        #get and insert column: car_VIN
        car_VIN = files.split()[0]
        print(car_VIN)
        data.insert(0, 'car_VIN', car_VIN)
        print(data)

    time_end = time.time()
    print("count " + str(errorcount) + " errors")
    print("Time cost: " + str(time_end - time_start))
    return 0
    '''
    #split data into runtime battery and other to insert into sql
    runtime=data.reindex(columns=data2sql.getruntime())
    battery=data.reindex(columns=data2sql.getbattery())
    other=data.reindex(columns=data2sql.getother())
    
    dbsqlengine(runtime,'CAR_REALTIME_DATA_TEST')
    dbsqlengine(battery,'BATTERY_REALTIME_DATA_TEST')
    dbsqlengine(other,'OTHER_REALTIME_DATA_TEST')
    '''

        

if __name__ == '__main__':
    sys.exit(main())