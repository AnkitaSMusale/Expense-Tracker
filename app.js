const path = require('path');
const express = require('express');
const cors = require('cors')
const bodyparser = require('body-parser');
const sequelize = require('./util/database');

const app = express();

app.use(express.json());
app.use(bodyparser.json());

const User = require('./models/user');
const Expense = require('./models/expenses');
const Order=require('./models/order')
const ForgetPassword = require('./models/forgotpassword')

const UserRoutes = require('./router/user');
const premiumRoutes=require('./router/premium')
const forgotRoutes = require('./router/forgot')

app.use(cors());

const dotenv = require('dotenv');
// get config vars
dotenv.config();

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasOne(Order)
Order.belongsTo(User)


User.hasMany(ForgetPassword)
ForgetPassword.belongsTo(User)

app.use('/user', UserRoutes);
app.use(premiumRoutes)
app.use(forgotRoutes)

app.use(express.static(path.join(__dirname, 'public')));

sequelize.sync()
    .then(() => {
        console.log(User);
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })