let express = require('express');
let router = express.Router();
const jwt = require('jsonwebtoken');
const { checkJWTToken, changePasswordVerification } = require('./middleware');

//===============DATA==================
//-----------USER DATA-------------
//In-memory array used to store user-data
// let users = [
//   {
//     id: '0',
//     username: 'admin@gmail.com',
//     password: 'passWord1',
//   },
//   {
//     id: 1,
//     username: 'user1@gmail.com',
//     password: 'passWord2',
//   },
// ];

//----------TASK DATA--------------------
//In-memory array used to store task-data
// let tasks = [
//   {
//     id: 0,
//     user: "admin@gmail.com",
//     title: "Implement a Post route for logging in",
//   },
//   {
//     id: 1,
//     user: "user1@gmail.com",
//     title: "Implement custom middleware to authenticate user",
//   },
// ];
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
