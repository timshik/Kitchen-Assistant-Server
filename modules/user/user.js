const dbManager = require('../../db/database_manager');
const validator = require('../validators/validator');
const { utils } = require('../../server/server');

const userSchema = dbManager.mongoose.Schema({
    email: String,
    password: String,
});

const User = dbManager.mongoose.model('User', userSchema, 'users');

function login(email, password, response) {
    if (validator(email, password)) {
         dbManager.manager.collection('users').findOne(
            {email: email, password: password}, 
             function(error, result) {
                if (error || !result) {
                    utils.error(response, "EMAIL_PASSWORD_INCORRECT");
                    return;
                }
                utils.success(response, {email: email});
         });
    }
};

function register(email, password, response) {

    if (validator(email, password)) {
        dbManager.manager.collection('users').findOne({email: email}, (error, result) => {
            if (error || result) {
                utils.error(response, "USER_ALREADY_EXISTS");
                return;
            }
            
            // EMAIL not exists in the DB, lets create new user:
            let user = new User({email: email, password: password});
            user.save((error, object) => {
                if (error) {
                    utils.error(response, "DB_FAILURE");
                    return;
                }
                utils.success(response, true);
            });
        });
    }
};

const user = {
    'login': login,
    register: register
}

module.exports = {
    object: user,
    schema: userSchema
}