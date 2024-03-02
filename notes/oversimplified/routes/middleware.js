const jwt = require ('jsonwebtoken');

const checkJwtToken = (req, res, next) => {
    if (req.headers.token) {
        let token = req.headers.token;

        jwt.verify(token, 'secretKey', (error, data) =>{
            if (error) {
                res.json({message: 'Invalid Token'})
                console.error('Invalid Token');
                return res.status(401).json({message: 'Invalid Token'})
            } else {
                req.username = data.username
                req.password = data.password
                next()
            }
        })
    }else{
        res.send({message:'No token attatched to the request'})
        return res.status(401).json({message: 'No token attatched to the request'});
    }
}

module.exports ={checkJwtToken}