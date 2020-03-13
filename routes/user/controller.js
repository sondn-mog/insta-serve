const User = require('./model')
const jwt = require('jsonwebtoken')
const config = require('../../config')

module.exports = {
    login: (req, res) => {
        User.findOne({email: req.body.email}).then(user => {
            user.comparePassword(req.body.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    let token = jwt.sign({user}, config.secret, {expiresIn: 864000});
                    res.status(200).send({ msg: 'Login Success', token })
                }else{
                    res.status(200).send({ msg: 'Password or email did not match' })
                }
            });
        }).catch(err => {
            console.error(err);
            res.status(500).send({ msg: 'Login unsuccessful'});
        });
    },
    register: (req, res) => {
        let newUser = new User({
            forename: req.body.forename,
            surname: req.body.surname,
            email: req.body.email,
            password: req.body.password
        });

        newUser.save()
            .then(result => {
                console.log(result);
                res.status(200).send({ msg: 'Register Successful', user_id: result._id })
            }).catch(err => {
                console.error(err);
                res.status(500).send({ msg: 'Register unsuccessful'});
            });
    }
}