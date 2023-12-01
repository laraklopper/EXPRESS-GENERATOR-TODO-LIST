const express = require('express');
const router = express.Router();
;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// let userInformation = {
//   username: "admin@gmail.com",
//   password: "password1"
// }


module.exports = router;
