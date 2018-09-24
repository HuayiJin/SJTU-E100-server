
exports.getVehicles = "select * from CAR_REGISTER_TEST";

exports.addUser = function(body){
    console.dir(body);
    var addusersql = "INSERT CAR_REGISTER_TEST values ('" +
        body.timestamp + "'," +
        body.car_VIN + "'," +
        body.registration_time + "'," +
        body.vehicle_type + "'," +
        body.energy_storing_type + "'," +
        body.drive_motor_type + "'," +
        body.drive_motor_rated_power + "'," +
        body.drive_motor_rated_rpm + "'," +
        body.drive_motor_rated_torque + "'," +
        body.drive_motor_number + "'," +
        body.drive_motor_position + "'," +
        body.drive_motor_cooling_method + "'," +
        body.e_car_endurance_mileage + "'," +
        body.e_car_top_speed + "'," +
        body.power_battery_number + "'," +
        body.power_battery_info_0 + "'," +
        body.power_battery_info_1 + "'," +
        body.power_battery_info_2 + "'," +
        body.power_battery_info_3 + "'," +
        body.extra_field + ")"
    return addusersql
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

exports.searchVehicle = function(car_vin, timestamp){
    var searchsql = "select * from CAR_REGISTER_TEST"
    if (car_vin) {
        searchsql += " and name='" + name + "' ";
    }
    if (timestamp) {
        searchsql += " and age=" + age + " ";
    }
    searchsql = searchsql.replace(/and/,"where");
    return searchsql;
}

