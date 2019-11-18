const db = require("../data/dbConfig");

module.exports = {
    addUser,
    getUser,
    getMothers,
    addMother,
    addDriver,
    getVillages
};

function getVillages(){
    return db("village").select("*")
}


function getUser(){
    return db("users").select("*")
}

function addUser(user) {
    return db('users')
        .insert(user)
        .returning(['id', 'username']);
}

function getMothers(){
    return db("mothers").select("*")
}

function addMother(mother){
    return db('mothers')
        .insert(mother)
        .returning(['id',"name"])
}

function addDriver(driver){
    return db('drivers')
        .insert(driver)
        .returning(['id',"driver_name"])
}