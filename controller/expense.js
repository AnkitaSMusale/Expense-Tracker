const Expense = require('../models/expenses');
const addExpense = (req,res) => {
    // const amount = req.body.amount;
    // const description = req.body.description;
    // const category = req.body.category;
    const {amount,description,category}=req.body;
    req.user.createExpense({
        amount : amount,
        description : description,
        category : category
    })
    .then(expense => {
        return res.status(201).json({expense, success:true, message:'expense added successfully'})
    })
    .catch(err=>{
        console.log(err)
        return res.status(403).json({success:false,message:'expense not added'})

    })
}
module.exports = { addExpense };