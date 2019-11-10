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

def main():
    filedir = os.getcwd()
    data2sql = Data2sql()
    mydb = mysql.connector.connect(
                    host="localhost",       # 数据库主机地址
                    user="root",    # 数据库用户名
                    passwd="123456",   # 数据库密码
                    database="e100",
                    charset='utf8'
                )
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

        #get column: car_VIN
        car_VIN = files.split()[0]
        print(car_VIN)

        mycursor = mydb.cursor()
        for row in data.itertuples():
            sql = "INSERT e100.E100_TABLE_TEST values (null,'" + car_VIN + "','" 
            #print(getattr(row,'create_time'))
            for i in range(1,24):
                sql += str(row[i]) + "','"
            sql += str(row[24]) + "')"
            
            try:
                mycursor.execute(sql)
                mydb.commit()
            except:
                errorcount += 1
        
        mycursor.close()

    mydb.close()

    time_end = time.time()
    print("count " + str(errorcount) + " errors")
    print("Time cost: " + str(time_end - time_start))
    return 0

        

if __name__ == '__main__':
    sys.exit(main())