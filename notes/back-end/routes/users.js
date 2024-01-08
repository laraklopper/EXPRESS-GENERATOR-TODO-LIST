let express = require("express");
let router = express.Router();
let jwt = require("jsonwebtoken");
let userInformation = {
  username: "admin@test.co.za",
  password: "P@ssw0rd1"
};

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/login", function (req, res) {
  if (
    req.body.username == userInformation.username &&
    req.body.password == userInformation.password
  ) {
    let jwtToken = jwt.sign(
      {
        username: userInformation.username,
        password: userInformation.password,
      },
      "secretKey",
      { expiresIn: "1h" }
    );
    res.send(jwtToken);
  } else {
    res.send({ message: "user not Authenticated" });
  }
});
module.exports = router;
