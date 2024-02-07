let jwt = require ('jsonwebtoken');

function checkJWTToken(req, res, next) {
    if (req.headers.token) {
        let token = req.headers.token
        jwt.verify(token, "secretKey", function(error, data){
            if (error) {
                res.send({message: "invalid token"})
                next()
            } else {
                req.username= data.username;
                req.password = data.password;
                next()
            }
        })
    } else {
        res.send({message: "No token attatched to the request"})
    }
}

function changePasswordVerification(req, res, next) {
    if (
        req.body.newPassword == req.body.confirmPassword && req.body.length >= 6
    ) {
       req.newUserpassword = req.body.newPassword;
       next(); 
    } else if(req.body.newPassword.length < 6){
        res.send({
            message: "The new password needs to be longer than six characters.",
        })
    }else{
        res.send({
            message: "Conformation Password and New Password does not match."
        })
        res.send();
    }
}

module.exports = {
    checkJWTToken,
    changePasswordVerification,
}