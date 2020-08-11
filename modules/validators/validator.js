var email_validator = require("email-validator");

const validator = (email, password) => {
        if (email == null || password == null) {
            return false;
        } 

        return email_validator.validate(email);
    }

module.exports = validator;