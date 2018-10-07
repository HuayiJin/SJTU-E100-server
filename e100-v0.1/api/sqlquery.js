var moment = require('moment');

exports.getVehicles = "select * from CAR_REGISTER_TEST";

exports.addUser = function(body){
    var now = moment().format('YYYY-MM-DD HH:mm:ss');
    var addusersql = "INSERT CAR_REGISTER_TEST values ('" +
        now                                 + "','" +
        body.car_VIN                        + "','" +
        body.registration_time              + "','" +
        body.vehicle_type                   + "','" +
        body.energy_storing_type            + "','" +
        body.drive_motor_type               + "','" +
        body.drive_motor_rated_power        + "','" +
        body.drive_motor_rated_rpm          + "','" +
        body.drive_motor_rated_torque       + "','" +
        body.drive_motor_number             + "','" +
        body.drive_motor_position           + "','" +
        body.drive_motor_cooling_method     + "','" +
        body.e_car_endurance_mileage        + "','" +
        body.e_car_top_speed                + "','" +
        body.power_battery_number           + "','" +
        body.power_battery_info_0           + "','" +
        body.power_battery_info_1           + "','" +
        body.power_battery_info_2           + "','" +
        body.power_battery_info_3           + "','" +
        body.extra_field                    + "')"
    console.log(addusersql);
    return addusersql
};
     
exports.addRuntime = function(body){
    var now = moment().format('YYYY-MM-DD HH:mm:ss');
    var addruntimesql = "INSERT CAR_REALTIME_DATA_TEST values ('" +
        now                     + "','" +           
        body.car_VID                       + "','" +           
        body.car_start_end_time            + "','" +           
        body.cumulative_mileage            + "','" +           
        body.location_status               + "','" +           
        body.longitude                     + "','" +           
        body.latitude                      + "','" +           
        body.velocity                      + "','" +           
        body.direction                     + "','" +           
        body.motor_controller_temperature  + "','" +           
        body.drive_motor_rpm               + "','" +           
        body.drive_motor_temperature       + "','" +           
        body.motor_bus_current             + "','" +           
        body.accelerator_pedal_stroke      + "','" +           
        body.brake_pedal_status            + "','" +           
        body.power_system_ready            + "','" +           
        body.emergency_poweroff_request    + "')"  
    console.log(addruntimesql);
    return addruntimesql
};
     
exports.addBattery = function(body){
    var now = moment().format('YYYY-MM-DD HH:mm:ss');
    var addbatterysql = "INSERT BATTERY_REALTIME_DATA_TEST values ('" +
        now                                 + "','" +
        body.car_VIN                        + "','" +
        body.power_battery_number           + "','" +
        body.power_battery_info_0           + "','" +
        body.power_battery_info_1           + "','" +
        body.power_battery_info_2           + "','" +
        body.power_battery_info_3           + "','" +
        body.extra_battery_info             + "','" +
        body.high_voltage_battery_current   + "','" +
        body.battery_power_SOC              + "','" +
        body.residual_energy                + "','" +
        body.total_battery_voltage          + "','" +
        body.max_single_temperature         + "','" +
        body.min_single_temperature         + "','" +
        body.max_single_voltage             + "','" +
        body.min_single_voltage             + "','" +
        body.insulation_resistance_value    + "','" +
        body.battery_equalization_activation     + "')"
    console.log(addbatterysql);
    return addbatterysql
};
     
exports.addAlert = function(body){
    var now = moment().format('YYYY-MM-DD HH:mm:ss');
    var addalertsql = "INSERT ALERT_DATA_TEST values ('" +
        now                                 + "','" +
        body.car_VIN                        + "','" +
        body.motor_controller_temperature   + "','" +
        body.drive_motor_temperature        + "','" +
        body.drive_system_failure           + "','" +
        body.dcdc_temperature               + "','" +
        body.dcdc_status                    + "','" +
        body.vcu_controller_alert           + "','" +
        body.total_battery_voltage          + "','" +
        body.battery_cell_max_temperature   + "','" +
        body.battery_cell_min_temperature   + "','" +
        body.battery_cell_max_voltage       + "','" +
        body.battery_cell_min_voltate       + "','" +
        body.high_voltage_interlock_state   + "','" +
        body.insulation_resistance_value    + "','" +
        body.collision_signal_state         + "','" +
        body.energy_storage_system_failure  + "','" +
        body.brake_system_failure           + "')"
    console.log(addalertsql);
    return addalertsql
};
     
exports.addOther = function(body){
    var now = moment().format('YYYY-MM-DD HH:mm:ss');
    var addothersql = "INSERT OTHER_REALTIME_DATA_TEST values ('" +
        now                                + "','" +           
        body.car_VID                       + "','" +           
        body.car_start_end_time            + "','" +           
        body.cumulative_mileage            + "','" +           
        body.location_status               + "','" +           
        body.longitude                     + "','" +           
        body.latitude                      + "','" +           
        body.velocity                      + "','" +           
        body.direction                     + "','" +           
        body.motor_controller_temperature  + "','" +           
        body.drive_motor_rpm               + "','" +           
        body.drive_motor_temperature       + "','" +           
        body.motor_bus_current             + "','" +           
        body.accelerator_pedal_stroke      + "','" +           
        body.brake_pedal_status            + "','" +           
        body.power_system_ready            + "','" +           
        body.emergency_poweroff_request    + "')"  
    console.log(addothersql);
    return addothersql
};
exports.deleteUser = function(car_vin, timestamp){
    var deleteusersql = "DELETE FROM CAR_REGISTER_TEST WHERE `car_VIN`='" 
    + car_vin + "' and `timestamp` ='" + timestamp + "'";
    return deleteusersql;
}

exports.getVehicle = function(car_vin, timestamp){
    var getVehiclesql = "select * from CAR_REGISTER_TEST where `car_VIN`='"
    + car_vin + "' and `timestamp` ='" + timestamp + "'";
    return getVehiclesql;
}

exports.updateVehicle = function(car_vin, timestamp, col, value){
    var updatesql = "UPDATE CAR_REGISTER_TEST SET '" + col + "'='" + value 
    + "' WHERE `car_VIN`='" + car_vin + "' and`timestamp`='" + timestamp + "'";
    return updatesql;
}

exports.searchVehiclebyVIN = function(car_vin, start, end){
    var searchsql = "select * from CAR_REGISTER_TEST WHERE `car_VIN`='" + car_vin
    + "' and`timestamp`>'" + start
    + "' and`timestamp`<'" + end + "'";
    return searchsql;
}
/*
*not complete yet
*/
exports.searchVehiclebyNUM = function(car_num, start, end){
    var searchsql = "select * from CAR_REGISTER_TEST WHERE `car_VIN`='" + car_num
    + "' and`timestamp`>'" + start
    + "' and`timestamp`<'" + end + "'";
    return searchsql;
}
