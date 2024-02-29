let express = require('express');
let router = express.Router();
const jwt = require('jsonwebtoken');
const { checkJWTToken, changePasswordVerification } = require('./middleware');

/* GET users listing. */
router.get('/', checkJWTToken, function(req, res, next) {
  res.send(JSON.stringify(todos));
});

let userInformation = {
  username: "admin@test.co.za",
  password: "P@ssw0rd1"
}

let todos = [
  {
    username: "admin@test.co.za",
    id: 1,
    title: "Implement a Post route for logging in",
    completed: true,
  },
  {
    username: "admin@test.co.za",
    id: 2,
    title: "Implement custom middleware to authenticate user...",
    completed: true,
  },
];



router.post("/login", function(req,res){
  if (req.body.username == userInformation.username && req.body.password == userInformation.password) {
    let jwtToken = jwt.sign(
      {
        username: userInformation.username,
        password: userInformation.password,
      },
      "secretKey",
      {expiresIn: '1h'}
    )

    res.send(jwtToken)
  }else{
    res.send({message: 'user not authenticated'})
  }
});

router.put('/changePassword', 
checkJWTToken, 
changePasswordVerification, 
function (req, res) {
  userInformation.password =req.newUsername;
  res.send({
    message: "Password Successfully changed",
    newPassword: userInformation.password,
  })
})

module.exports = router;
