const User = require("./model");
const jwt = require("jsonwebtoken");
const config = require("../../config");

module.exports = {
  login: (req, res) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) return res.send({ auth: false, msg: "User not found" });
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (err) throw err;
          if (isMatch) {
            let token = jwt.sign({ user }, config.secret, {
              expiresIn: 864000
            });
            res.status(200).send({ auth: true, msg: "Login Success", token });
            return;
          }
          res.send({ auth: false, msg: "Password or email did not match" });
        });
      })
      .catch(err => {
        console.error(err);
        res.status(500).send({ msg: err });
      });
  },
  register: (req, res) => {
    let newUser = new User({
      forename: req.body.forename,
      surname: req.body.surname,
      email: req.body.email,
      password: req.body.password
    });

    newUser
      .save()
      .then(result => {
        let token = jwt.sign({ result }, config.secret, {
          expiresIn: 864000
        });
        res.send({ auth: true, msg: "Register Successful", user_id: token });
      })
      .catch(err => {
        if (err.code == 11000) {
          res.send({ auth: false, msg: "Email already exists ..." });
          return;
        }
        // console.error(err);
        res.send({ auth: false, msg: "An internal serve error has occured" });
      });
  }
};
