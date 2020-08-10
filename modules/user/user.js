const dbManager = require('../../db/database_manager');
const validator = require('../validators/validator');

const login = function(email, password) {
    if (validator(email, password)) {
         dbManager.manager.collection('users').findOne({email: email, password: password}, function(error, result) {
                if (!error) {
                    if (result) {
                        return result;
                    } else {
                        return "USER_NOT_EXISTS";
                    }
                } else {
                    return "DB_CONNECTION_FAILED";
                }
         });
    }

    return false;
}

const register = function(email, password) {
    if (validator(email, password)) {
        
    }
}

const user = {
    'login': login,
    'register': register
}

module.exports = {
    object: user
}