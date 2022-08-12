// const User = require('../models/user');

// exports.postAddUser = (req, res, next) => {
//     const name = req.body.name;
//     const email = req.body.email;
//     const phone = req.body.phone;
//     const password = req.body.password;
//     // const user = new User(name, email, phone, password);
//     // return user.save();
//     User.create({ name, email, phone, password}).then(() => {
//         res.status(201).json({ message: 'Successfuly create new user' })
//     }).catch(err => {
//         res.status(403).json(err);
//     })
// }

const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

 const signup = (req, res)=>{  
    //const { name, email, password } = req.body;
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            // Store hash in your password DB.
            if(err){
                console.log('Unable to create new user')
                res.json({message: 'Unable to create new user'})
            }
            User.create({ name, email, phone, password: hash })
            .then(() => {
                res.status(201).json({message: 'Successfuly create new user'})
            }).catch(err => {
                console.log('not working');
                res.status(403).json(err);
            })

        });
    });
}

function generateAccessToken(id) {
    return jwt.sign(id ,process.env.TOKEN_SECRET);
}

const login = (req, res) => {
    const { email, password } = req.body;
    console.log(password);
    User.findAll({ where : { email }})
    .then(user => {
        if(user.length > 0){
            bcrypt.compare(password, user[0].password, function(err, response) {
                if (err){
                console.log(err)
                return res.json({success: false, message: 'Something went wrong'})
                }
                if (response){
                    console.log(JSON.stringify(user))
                    const jwttoken = generateAccessToken(user[0].id);
                    res.json({token: jwttoken, success: true, message: 'Successfully Logged In'})
                // Send JWT
                } else {
                // response is OutgoingMessage object that server response http request
                return res.status(401).json({success: false, message: 'passwords do not match'});
                }
            });
        } else {
            return res.status(404).json({success: false, message: 'Can not log in'})
        }
    })
}

module.exports = {signup , login};